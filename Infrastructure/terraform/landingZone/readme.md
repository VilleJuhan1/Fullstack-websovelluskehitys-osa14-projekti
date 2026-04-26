# Terraform tenancy

This module creates the basic infrastructure for creating project compartments and IAM policies in OCI. It assumes that the tenancy is already created and that you have the necessary permissions to create compartments and IAM policies.

The Terraform codebase was generated using Gemini 3.1 Pro and Antigravity IDE and evaluated against OCI best practices and the official Oracle's Landing Zone (LZ) references found in the [OCI Landing Zones repository](https://github.com/oci-landing-zones).

## Prerequisites

- Terraform and OCI CLI installed and configured, refer to readme in ../venv/readme.md for instructions.
- OCI API key and config file set up, see above for instructions.
- Local backend.conf and terraform.tfvars files created.

### Templates for Terraform configuration and variables files for local dev

You need to create two files that you should also put immediately to your .gitignore file. Below are examples on the contents of these files.

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

## Bootstrapping State (The "Chicken & Egg" Problem)

Because this module creates the Object Storage bucket intended to hold its own state, you cannot initialize the HTTP backend immediately on the very first run. You must bootstrap the state locally first, create the resources (including the bucket), and then migrate the state to the newly created remote bucket.

**Steps to bootstrap:**
1. Comment out the `backend "http" {}` block in `providers.tf`.
2. Run `terraform init` to initialize the project with local state.
3. Run `terraform apply -var-file=terraform.tfvars` to create the tenancy resources, which will also provision your new state bucket.
4. Run `terraform output landing_zone_state_backend_url` to get the PAR URL for the landing zone state bucket.
5. Add the PAR URL to your local `backend.conf` file as per the template.
6. Re-enable the `backend "http" {}` block in `providers.tf`.
7. Run `terraform init -backend-config=backend.conf -migrate-state` and say `yes` to push your local state into the remote bucket!
8. Save the PAR URL as a Github secret named `TF_VAR_landing_zone_state_backend_url`.

## Regular Usage

Once the state is bootstrapped, your normal workflow will be:

```bash
terraform init -backend-config=backend.conf
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```

## Using an automated or manually triggered CI/CD pipeline via Github actions

When creating the service account via Terraform, we didn't set the API key in the same action. This means that the GitHub action will not be able to authenticate with OCI. To fix this, you will need to manually create an API key for the service account in the OCI Console and add it to the GitHub secrets. This is just a safety measure and gives some more granular control over the API key expiration etc. You can find the service account user in the OCI Console under "Identity & Security" -> "Identity" -> "Users" -> "github-actions-sa-`project name`" -> "API Keys".

## Removing the Tenancy Infrastructure

As we store the terraform state to OCI, we need to ensure that we have the correct backend configuration before we can destroy the resources. We can't destroy the object storage bucket until we have migrated the state away from it. 

```bash
# Ensure the terraform state is stored in the OCI Object Storage bucket. 

# Remove the local files
rm -rf .terraform
rm terraform.tfstate
rm terraform.tfstate.backup

# Initialize the backend from the Object Storage
terraform init -backend-config=backend.conf

# Migrate state from the remote backend to a local backend.
# Terraform will prompt you to confirm the migration.
terraform init -migrate-state

# Then run the destroy command
terraform destroy -var-file=terraform.tfvars
```