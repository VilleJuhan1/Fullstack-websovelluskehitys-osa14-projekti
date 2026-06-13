# Project Terraform Code

This is the terraform code for the project infrastructure, which will host the application and related resources.

## Usage

If you've created the project landing zone using the terraform code in the landingZone folder, you can use the following commands to initialize and apply the terraform code for the project. Remember that you need the project object storage PAR (pre-authenticated request) url. You can get that from the OCI console or by using the terraform code in the landingZone folder and `terraform output terraform_state_backend_urls`. Add this to the local backend.conf file:

```bash
# backend.conf
address = "your-par-url"
update_method = "PUT"
```

## Project resources created

1. `VCN` with 2 subnets:
    - `Public subnet` for bastion service and public load balancer
    - `Public subnet` for k3s cluster (master and worker nodes)
2. `Internet Gateway`
3. `Security and Route Rules` for both subnets:
    - All NSG rules: [network_rules.tf](./network_rules.tf)
4. Two `compute` instances (one `k3s master`, one `k3s worker`)
    - **Master node**: 2 OCPUs, 12GB memory
    - **Worker node**: 2 OCPUs, 12GB memory
5. One 50GB `block volume` for the `worker` node
6. `Bastion Service`
7. `Public Load Balancer`
8. `OCI Vault`
9. `Automated backups for the block volume`

### Initialize terraform

```bash
terraform init -backend-config=./backend.conf # use the local path
```

### Apply terraform code

```bash
terraform apply -var-file=./terraform.tfvars # use the local path
```

### Destroy the project resources

```bash
terraform destroy -var-file=./terraform.tfvars # use the local path
```