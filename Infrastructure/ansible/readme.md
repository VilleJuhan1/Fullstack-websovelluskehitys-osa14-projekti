# Ansible K3s Deployment via OCI Bastion

Because our primary compute interfaces are entirely isolated in a private subnet (with no public internet ingress), Ansible cannot connect to them directly. We use **OCI Bastion Port Forwarding** to securely deploy the cluster without exposing Port 22 to the public internet.

## Step-by-Step Deployment Guide

### 1. Activate the python environment (path is oci-automation if you're using the instructions in the venv readme.md file)
```bash
source oci-automation/bin/activate
```

### 2. Provision the Infrastructure
Run your Terraform to create the compute instances and automatically generate the base `inventory.ini` and `ansible_key.pem`.
```bash
cd ../terraform/countriesApp
terraform plan -var-file=./local/terraform.tfvars
terraform apply -var-file=./local/terraform.tfvars
```

### 3. Create the Secure Tunnels
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
This script will interact with the OCI CLI, create the required Bastion sessions, open local SSH tunnels in the background, and generate an `inventory.local.ini` file for Ansible.

### 4. Run the Playbooks
Now that the secure tunnels are open, simply activate your python environment and run the playbook!
```bash
cd ../ansible
ansible-playbook -i inventory.local.ini update_and_reboot.yaml
ansible-playbook -i inventory.local.ini main.yml

# If for some reason you want a clean k3s install, add "force_reinstall=true" to the playbook command like this:
ansible-playbook -i inventory.local.ini main.yml --extra-vars "force_reinstall=true"
```

### 5. Verify Kubernetes
As is, bastion tunnels don't work with kubectl. This might be an OCI limit. To verify the cluster is working, SSH to the node via bastion and run `kubectl get nodes`.

```bash
ssh -i ansible/ansible_key.pem ubuntu@localhost -p 2222 # use the same SSH private key that Ansible uses
# Then, on the node
kubectl get nodes
```

### 6. Clean Up
When you are done, you can safely close all the background tunnels by running (or just wait for the sessions to drop):
```bash
cd ../scripts
ps -fp $(cat bastion_pids.txt)  # See which processes are running and if the tunnels are still up
kill $(cat bastion_pids.txt)    # Kill the processes
```
