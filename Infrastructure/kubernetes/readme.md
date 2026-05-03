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
    Grafana -- "Query" --> Prometheus
```