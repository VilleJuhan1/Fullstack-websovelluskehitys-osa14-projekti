# Project Terraform Code

This is the terraform code for the project infrastructure, which will host the application.

## Usage

If you've created the project landing zone using the terraform code in the landingZone folder, you can use the following commands to initialize and apply the terraform code for the project. Remember that you need the project object storage PAR (pre-authenticated request) url. You can get that from the OCI console or by using the terraform code in the landingZone folder and `terraform output terraform_state_backend_urls`. Add this to your local backend.conf file.

```bash
# backend.conf
address = "your-par-url"
update_method = "PUT"

# then initialize terraform
terraform init -backend-config=./backend.conf # use your local path

# To apply the terraform code, use the following command:
terraform apply -var-file=./terraform.tfvars # use your local path
```

**NOTE! **