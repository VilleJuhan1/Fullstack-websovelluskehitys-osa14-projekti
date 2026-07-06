# Terraform for the tenancy LZ (Landing Zone)

This module creates the basic infrastructure for creating project compartments and IAM policies in OCI. It assumes that the tenancy is already created and that the necessary permissions to create compartments and IAM policies are in place.

The Terraform codebase was generated using Gemini 3.1 Pro and Antigravity IDE and evaluated against OCI best practices and the official Oracle's Landing Zone (LZ) references found in the [OCI Landing Zones repository](https://github.com/oci-landing-zones).

## Prerequisites

- Terraform and OCI CLI installed and configured, refer to readme in ../venv/readme.md for instructions.
- OCI API key and config file set up, see above for instructions.
- Local backend.conf and terraform.tfvars files created.

### Templates for Terraform configuration and variables files for local dev

Two files need to be created and immediately added to the `.gitignore` file. Below are examples of the contents of these files.

backend.conf:
```conf
address       = "https://objectstorage.<region>.oraclecloud.com/p/<pre-authenticated-request-url>/n/<namespace>/b/<bucket-name>/o/terraform.tfstate"
update_method = "PUT"
```

terraform.tfvars:
```tfvars
# -----------------------------------------------------------------------------
# Authentication placeholders
# -----------------------------------------------------------------------------
tenancy_ocid     = "ocid1.tenancy.oc1..placeholder"
user_ocid        = "ocid1.user.oc1..placeholder"
fingerprint      = "00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00"
private_key_path = "~/.oci/oci_api_key.pem"
region           = "eu-frankfurt-1"

# -----------------------------------------------------------------------------
# Tenancy Configuration
# -----------------------------------------------------------------------------
# Defines the projects that will be created in the tenancy (multiple can be created with the same code)
projects = {
  "Example-project" = {
    name                  = "Example-project"
    budget_amount         = 1
    service_account_email = "placeholder" # Required string for SAs, I'm using a temporary address/alias in Protonmail for this. 
  }
}
```

## Bootstrapping Terraform State

Because this module creates the Object Storage bucket intended to hold its own state, the HTTP backend cannot be initialized immediately on the very first run. The state must be bootstrapped locally first, the resources (including the bucket) created, and then the state migrated to the newly created remote bucket.

**Steps to bootstrap:**
1. Comment out the `backend "http" {}` block in `providers.tf`.
2. Run `terraform init` to initialize the project with local state.
3. Run `terraform apply -var-file=terraform.tfvars` to create the tenancy resources, which will also provision the new state bucket.
4. Run `terraform output landing_zone_state_backend_url` to get the PAR URL for the landing zone state bucket.
5. Add the PAR URL to the local `backend.conf` file as per the template.
6. Re-enable the `backend "http" {}` block in `providers.tf`.
7. Run `terraform init -backend-config=backend.conf -migrate-state` and confirm with `yes` to push the local state into the remote bucket!
8. Save the PAR URL as a Github secret named `TF_VAR_landing_zone_state_backend_url`.

## Regular Usage

Once the state is bootstrapped, the normal workflow will be:

```bash
terraform init -backend-config=backend.conf
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```

## Removing the Tenancy Infrastructure

As the terraform state is stored to OCI, ensure that the correct backend configuration is set before destroying the resources. The object storage bucket can't be deleted until the state has been migrated away from it. Also, if there are resources in the project compartment, they need to be deleted first.

```bash
# Ensure the terraform state is stored in the OCI Object Storage bucket. 

# Remove the local files
rm -rf .terraform
rm terraform.tfstate
rm terraform.tfstate.backup

# Initialize the backend from the Object Storage
terraform init -backend-config=backend.conf

# Migrate state from the remote backend to a local backend.
# Terraform will prompt for confirmation of the migration.
terraform init -migrate-state

# Then run the destroy command
terraform destroy -var-file=terraform.tfvars
```