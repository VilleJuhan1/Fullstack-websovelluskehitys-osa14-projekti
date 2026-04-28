# Ansible K3s Deployment via OCI Bastion

Because our primary compute interfaces are entirely isolated in a private subnet (with no public internet ingress), Ansible cannot connect to them directly. We use **OCI Bastion Port Forwarding** to securely deploy the cluster without exposing Port 22 to the public internet.

## Step-by-Step Deployment Guide

### 1. Provision the Infrastructure
Run your Terraform to create the compute instances and automatically generate the base `inventory.ini` and `ansible_key.pem`.
```bash
cd ../terraform/countriesApp
terraform plan -var-file=./local/terraform.tfvars
terraform apply -var-file=./local/terraform.tfvars
```

### 2. Create the Secure Tunnels
We use a script to automatically interact with the OCI CLI, create the required Bastion sessions, and open local SSH tunnels on your laptop.
```bash
cd ../scripts
./create_tunnels.sh
```
This script will prompt you for your public key, create the tunnels in the background, and generate an `inventory.local.ini` file for Ansible.

### 3. Run the Playbook
Now that the secure tunnels are open, simply activate your python environment and run the playbook!
```bash
cd ../ansible
ansible-playbook main.yml
```

### 4. Verify Kubernetes
Ansible will automatically fetch the `kubeconfig` down to your local machine and place it in the `../kubernetes/` directory.

The `create_tunnels.sh` script automatically opened a third tunnel specifically for the Kubernetes API server (Port `6443`). Ansible also automatically updated your `kubeconfig` to point to this local tunnel.

You can instantly interact with your cluster:
```bash
export KUBECONFIG=../kubernetes/kubeconfig.yaml
kubectl get nodes
```

### 5. Clean Up
When you are done, you can safely close all the background tunnels by running:
```bash
cd ../scripts
./remove_tunnels.sh
```
