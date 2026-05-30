To apply:

```sh
kustomize build --enable-helm Infrastructure/kubernetes/monitoring/ | kubectl apply -f - --server-side
```