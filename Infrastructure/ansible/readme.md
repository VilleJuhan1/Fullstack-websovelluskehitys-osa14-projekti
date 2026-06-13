# Ansible K3s Deployment via OCI Bastion



## Roles

- `common`: Common configuration for all nodes
- `k3s-master`: Installs K3s master and configures it
- `k3s-worker`: Installs K3s worker and joins the master node
- `security`: Hardening configurations, firewall rules, unattended upgrades
- `storage`: Configures block volume mount and creates directories for PVC claims on kube-worker node
- `monitoring`: Installs helm, configures the persistent volume and deploys Prometheus, Loki and Grafana

## Playbooks

- `main.yml`: K3s cluster installation and configuration, runs all aforementioned roles
- `update_and_reboot.yaml`: Updates and reboots the k3s nodes
- `cluster-addons.yml`: Installs cert-manager and configures Nginx ingress with Let's Encrypt for https certs

## Step-by-Step Deployment Guide

### Create the Python virtual environment

Review [readme.md](../venv/readme.md) for instructions on creating and activating the `oci-automation` Python3 virtual environment.

### Activate the python environment
```bash
source ../venv/oci-automation/bin/activate
```

### Provision the cloud landing zone using Terraform

Follow the instructions in [the landing zone readme](../terraform/landingZone/readme.md) for creating the cloud landing zone infrastructure and the service account.

### Provision the Project Infrastructure using Terraform

Run your Terraform to create the compute instances and automatically generate the base `inventory.ini` and `ansible_key.pem`.
```bash
cd ../terraform/countriesApp
terraform plan -var-file=./local/terraform.tfvars
terraform apply -var-file=./local/terraform.tfvars
```

For more thorough review, check [the project terraform readme](../terraform/countriesApp/readme.md).

### Create the Bastion tunnels

Bastion is a managed SSH service that allows you to securely connect to compute instances without needing public IP addresses OR without needing to configure ingress rules on the NSG (Network Security Group).

Before running the tunnel script, ensure your private SSH key (the one associated with your OCI account) is added to your local SSH agent. This prevents the script from failing due to passphrase prompts during the background tunnel creation:

```bash
eval $(ssh-agent -s)
ssh-add ~/.ssh/id_ed25519  # Replace with your actual key path
```

Then, run the tunnel automation:
```bash
cd ../scripts
python3 create_tunnels.py
```

This script will interact with the OCI CLI, create the required Bastion sessions, open local SSH tunnels in the background, and generate an `inventory.local.ini` file for Ansible. The tunnels are up for 30 minutes at a time.

### Optional: Create a variables file
If you want to use a custom email for Let's Encrypt (https), create a `vars.yml` file in the `ansible` directory:
```yaml
cert_manager_email: "bob@example.com"
```

### Run the Playbooks
Now that the secure tunnels are open, simply activate your python environment and run the playbook from the project ansible directory.
```bash
# Updates and reboots the k3s nodes
ansible-playbook -i inventory.local.ini update_and_reboot.yaml
# Installs k3s and configures the nodes
ansible-playbook -i inventory.local.ini main.yml
# Installs cert-manager and configures Nginx ingress with Let's Encrypt for https certs
ansible-playbook -i inventory.local.ini cluster-addons.yml

# If for some reason you want a clean k3s install, add "force_reinstall=true" to the playbook command like this:
ansible-playbook -i inventory.local.ini main.yml --extra-vars "force_reinstall=true"
```

### Verify Kubernetes

As is, bastion tunnels don't work with kubectl. This might be an OCI limit. To verify the cluster is working, SSH to the node via bastion and run `kubectl get nodes`. You will need to use `ansible_key.pem` to SSH to the node via bastion, which is created automatically on a previous step.

```bash
ssh -i ansible/ansible_key.pem ubuntu@localhost -p 2222 # use the same SSH private key that Ansible uses
# Then, on the node
kubectl get nodes
```

If you run into trouble, you might need to add the kubeconfig to the users `~/.kube/config` file. Find the config file on the master node using `cat /etc/rancher/k3s/k3s.yaml` and copy the contents to your local `~/.kube/config` file. Remember to replace `[IP_ADDRESS]` with the master node's private IP address.

### Clean Up

When you are done, you can safely close all the background tunnels by running:
```bash
cd ../scripts
ps -fp $(cat bastion_pids.txt)  # See which processes are running and if the tunnels are still up
kill $(cat bastion_pids.txt)    # Kill the processes
```

However, this is not strictly necessary as the pids file is overwritten every time the tunnel script is run. Also the sessions drop automatically after 30 minutes or a 10 minute idle timeout.

### Further steps

For pod deployments, see [kubernetes/readme.md](../kubernetes/readme.md).