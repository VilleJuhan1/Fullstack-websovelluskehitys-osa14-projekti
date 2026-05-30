# Kubernetes Monitoring Manifests

This directory contains declarative Kubernetes manifests for monitoring storage and dashboards.

## 2. Compilation and Deployment Workflow

### Re-build Dashboards
Compile locally when editing dashboards:
```sh
kustomize build Infrastructure/kubernetes/monitoring/dashboards/ > Infrastructure/kubernetes/monitoring/dashboards.yaml
```

### Apply Manifests
Deploy the storage PVs and dashboard ConfigMaps directly using Kustomize:
```sh
kustomize build Infrastructure/kubernetes/monitoring/ | kubectl apply -f - --server-side
```
