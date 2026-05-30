# Grafana and Prometheus

## Grafana

The deployment uses a public Grafana with password authentication. A 2FA implementation is planned. The Grafana dashboards are imported manually from the browser UI.

Dashboards in use:
- 1860 - Kube-Stack-Monitoring
- 3119 - Kubernetes / Single Node Cluster

## Prometheus

Prometheus is used as the Grafana data source for performance related metrics.

## Grafana Loki

Loki is used for log aggregation across all nodes and pods. Logs can be viewed from Grafana by using loki as the data source and querying the logs using LogQL.

## Security and 2FA

To secure access to Grafana and central log storage, Grafana integrates **GitHub OAuth2** for user authentication, enforcing 2FA.