# K3s cluster

For now, kubectl can not be used from the developer's local machine due to our strict network security rules and Bastion limitations. Instead, we'll use bastion to ssh into the master node and run kubectl commands there if needed. Normally all changes to app deployments are handled by ArgoCD.

## Container Service Architecture

```mermaid
graph TD
    subgraph "External"
        User(("App Users"))
        Dev(("Developer / CI"))
        GitHub[("GitHub Repository")]
        DockerHub[("DockerHub")]
    end

    subgraph "OCI - Cloud Infrastructure"
        NLB[("Public Network Load Balancer")]
        OCIVault[("OCI Vault")]

        subgraph Cluster ["K3s Cluster (2 Nodes)"]
            subgraph "Namespace: argocd"
                ArgoCD["ArgoCD Controller"]
            end

            subgraph "Namespace: cert-manager"
                CertManager["cert-manager"]
            end

            subgraph "Namespace: external-secrets"
                ESO["External Secrets Operator"]
            end

            subgraph "Namespace: ingress-nginx"
                Ingress["Nginx Ingress Controller"]
            end

            subgraph "Namespace: monitoring"
                Prometheus["Prometheus"]
                Grafana["Grafana"]
                Loki["Loki + Promtail"]
            end

            subgraph "Namespace: dev"
                FrontpageDev["Frontpage"]
                FrontendDev["Frontend (Quiz App)"]
                BackendDev["Backend (GraphQL)"]
                DBDev[("PostgreSQL")]
                StripeDev["Stripe Mock"]
            end

            subgraph "Namespace: prod"
                FrontpageProd["Frontpage"]
                FrontendProd["Frontend (Quiz App)"]
                BackendProd["Backend (GraphQL)"]
                DBProd[("PostgreSQL")]
                StripeProd["Stripe Mock"]
            end
        end
    end

    %% Flow: GitOps
    Dev -- "Push Code" --> GitHub
    Dev -- "Push Image" --> DockerHub
    GitHub -- "Webhook / Polling" --> ArgoCD
    ArgoCD -- "Sync Manifests" --> Cluster
    DockerHub -- "Image pull" --> Cluster

    %% Flow: Secrets
    OCIVault -- "Secret sync" --> ESO
    ESO -- "Inject Secrets" --> BackendDev
    ESO -- "Inject Secrets" --> BackendProd

    %% Flow: TLS
    CertManager -- "Issue TLS Certs" --> Ingress

    %% Flow: Traffic
    User -- "HTTPS (443)" --> NLB
    NLB -- "Route" --> Ingress
    Ingress -- "hiekkalaatikko.tech" --> FrontpageProd
    Ingress -- "dev.hiekkalaatikko.tech" --> FrontpageDev
    Ingress -- "quizgame.hiekkalaatikko.tech" --> FrontendProd
    Ingress -- "dev.quizgame.hiekkalaatikko.tech" --> FrontendDev
    Ingress -- "argo.hiekkalaatikko.tech" --> ArgoCD
    Ingress -- "grafana.hiekkalaatikko.tech" --> Grafana
    FrontendDev -- "GraphQL proxy" --> BackendDev
    FrontendProd -- "GraphQL proxy" --> BackendProd
    BackendDev -- "SQL" --> DBDev
    BackendProd -- "SQL" --> DBProd
    BackendDev -- "Payments" --> StripeDev
    BackendProd -- "Payments" --> StripeProd

    %% Flow: Observability
    Prometheus -- "Scrape metrics" --> BackendDev
    Prometheus -- "Scrape metrics" --> BackendProd
    Loki -- "Collect logs" --> BackendDev
    Loki -- "Collect logs" --> FrontendDev
    Grafana -- "Query" --> Prometheus
    Grafana -- "Query" --> Loki
```

## Deployment Setup

### 1. Configure Secrets
The application requires several secrets to be present in the target namespace (`dev` or `prod`).

```bash
# Database Secrets for DEV environment
kubectl create secret generic db-secret \
  --from-literal=DATABASE_URL="postgres://postgres:mypassword@postgres:5432/quiz_db" \
  --from-literal=POSTGRES_PASSWORD="mypassword" \
  -n <namespace>

# Application Secrets for DEV environment
kubectl create secret generic app-secret \
  --from-literal=JWT_SECRET="your-super-secret-jwt-key" \
  --from-literal=PASSWORD_SECRET="your-password-pepper-secret" \
  -n <namespace>
```

### 2. Manual Deployments
We use a **GitHub Action** for manual branch deployments.
- **Trigger**: Go to `Actions` -> `Manual Branch Deploy` -> `Run workflow`.
- **Inputs**: Choose your branch and target environment (`dev` or `prod`).
- **Result**: 
  - Images are built with a pseudo-random tag (e.g. `happy-dolphin-v123`).
  - Images are pushed to Docker Hub.
  - The `kustomization.yaml` in `Infrastructure/kubernetes/apps/<env>` is automatically updated and committed back to the branch.
  - ArgoCD (if configured) will automatically pick up the change and sync the cluster.

## Kustomize Structure
- `Infrastructure/kubernetes/base/`: Core manifests (Deployments, Services).
- `Infrastructure/kubernetes/apps/dev/`: Development environment with seeds and DevBar enabled.
- `Infrastructure/kubernetes/apps/prod/`: Production environment (no seeds, strict settings).

## Enabling HTTPS
Once you have a domain name, follow these steps to enable encrypted traffic:

1. **Install Infrastructure**: Run the Ansible playbook `Infrastructure/ansible/cluster-addons.yml`. This installs the Nginx Ingress Controller and Cert-Manager + configures the ClusterIssuer via a j2 template.
2. **Update Domain & Email**: 
   - Set your real domain in `Infrastructure/kubernetes/base/ingress.yaml` (or via Kustomize overlays).
   - Set your email in `Infrastructure/ansible/vars.yml` (or pass it as an argument to the Ansible playbook).
3. **Switch to Ingress**:
   - In `Infrastructure/kubernetes/base/frontend.yaml`, change the service type to `ClusterIP`.
   - In `Infrastructure/kubernetes/base/kustomization.yaml`, uncomment the `- ingress.yaml` line.
4. **Update DNS**: Point your domain's A record to the Public IP of the new LoadBalancer created by the Nginx Ingress Controller.

Cert-Manager will automatically handle the handshake with Let's Encrypt and provide a valid certificate!


## Monitoring Stack (Prometheus & Grafana)

The monitoring stack uses the `kube-prometheus-stack` Helm chart. It is configured to run inside the `monitoring` namespace with optimized resource limits for a lightweight K3s cluster.

### Automated Installation via Ansible (Recommended)
The deployment is managed by the `monitoring` Ansible role. It templates the helm values and applies the PersistentVolume manifest automatically.

1. **Set up local credentials**: Define the Grafana administrator username and password in your local terminal environment:
   ```bash
   export GRAFANA_ADMIN_USER="your-admin-user"
   export GRAFANA_ADMIN_PASSWORD="your-secure-password"
   ```
   *If these are not specified, they will default to `admin` / `admin`.*

2. **Set up 2fa**: As is, login form is disabled for Grafana and only 2fa authentication is enabled. Login uses github token instead:
    ```bash
    export grafana_github_client_secret="<your-github-client-secret>"
    export grafana_github_client_id="<your-github-client-id>"
    ```

3. **Run the playbook**:
   Run the main playbook to deploy the entire cluster configuration including monitoring:
   ```bash
   cd Infrastructure/ansible
   ansible-playbook main.yml
   ```

### Accessing the Grafana Dashboard
1. **Access via Domain**: Navigate to the configured domain in your browser:
   ```
   https://grafana.hiekkalaatikko.tech
   ```

2. **Log in**: Sign in using the github credentials (which you set in `vars.yml` or terminal environment variables).

## Argo CD (GitOps)

Argo CD is deployed via the Ansible `argocd` role alongside the monitoring stack. It uses a local admin user whose credentials are configured in `vars.yml`.

### Accessing Argo CD

Argo CD is exposed securely via the public Ingress. 

1. Navigate to `https://argo.hiekkalaatikko.tech` on the local machine.

> **Note**: The login page is hardened. It limits login requests to 10 per second and will lock you out for 10 minutes if you fail to login 3 times.

### Applying Applications manually

The `dev` and `prod` application manifests are located in `Infrastructure/kubernetes/argocd/`. To start the GitOps synchronization, apply them manually to the cluster.

```bash
kubectl apply -f Infrastructure/kubernetes/argocd/dev-app.yaml
kubectl apply -f Infrastructure/kubernetes/argocd/prod-app.yaml
```
Once applied, Argo CD will take over and automatically sync the configured branches from the repository to the `dev` and `prod` namespaces.