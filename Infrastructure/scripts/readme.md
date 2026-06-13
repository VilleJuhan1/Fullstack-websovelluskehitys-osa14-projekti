# Helper scripts

1. **create_tunnels.py**: Use to create tunnels to worker and master nodes via bastion (3h duration).
2. **remove_tunnels.sh**: Use to remove tunnels to bastion and worker and master nodes from **local processes**. The sessions will stay open in OCI for the duration of the tunnel (30 min by default).
3. **retry_terraform.sh**: Use to retry terraform apply command. This was tested with hopes that free tier resources would become available after a while but it does not seem to work as intended. Changing to `Pay as you go` tier should fix the issue without accumulating any costs if you stay within the free tier limits (4 ocpus and 24gb memory total) 