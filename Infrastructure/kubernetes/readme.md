# K3s cluster README

For now, kubectl can not be used from the developer's local machine due to our strict network security rules. Instead, we'll use bastion to ssh into the master node and run kubectl commands there. Another option would be to use Cloud shell. Later, we'll automate the deployment so that the master node pulls the manifests from github using ArgoCD.

## Future Architecture

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
        
        subgraph Cluster ["K3s Cluster (Nodes)"]
            subgraph "Namespace: argocd"
                ArgoCD["ArgoCD Controller"]
            end

            subgraph "Namespace: monitoring"
                Prometheus["Prometheus"]
                Grafana["Grafana"]
            end

            subgraph "Namespace: prod / dev"
                Frontend["Frontend (Web App)<br/>(Service: NodePort 30080)"]
                Backend["Backend (GraphQL)"]
                DB[("PostgreSQL")]
            end
        end
    end

    %% Flow: GitOps
    Dev -- "Push Code/Manifests" --> GitHub
    GitHub -- "Webhook / Polling" --> ArgoCD
    GitHub -- "Image push" --> DockerHub
    DockerHub -- "Image pull" --> ArgoCD
    ArgoCD -- "Sync State" --> Cluster

    %% Flow: Traffic
    User -- "HTTPS (443)" --> NLB
    NLB -- "NodePort 30080" --> Frontend
    Frontend -- "Internal API Call" --> Backend
    Backend -- "SQL" --> DB

    %% Flow: Observability
    Prometheus -- "Scrape" --> Backend
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

## Enabling HTTPS (Future Step)
Once you have a domain name, follow these steps to enable encrypted traffic:

1. **Install Infrastructure**: Run the Ansible playbook `Infrastructure/ansible/cluster-addons.yml`. This installs the Nginx Ingress Controller and Cert-Manager.
2. **Update Domain & Email**: 
   - Set your email in `Infrastructure/kubernetes/ingress/cluster-issuer.yaml`.
   - Set your real domain in `Infrastructure/kubernetes/base/ingress.yaml` (or via Kustomize overlays).
3. **Switch to Ingress**:
   - In `Infrastructure/kubernetes/base/frontend.yaml`, change the service type to `ClusterIP`.
   - In `Infrastructure/kubernetes/base/kustomization.yaml`, uncomment the `- ingress.yaml` line.
4. **Update DNS**: Point your domain's A record to the Public IP of the new LoadBalancer created by the Nginx Ingress Controller.

Cert-Manager will automatically handle the handshake with Let's Encrypt and provide a valid certificate!
```