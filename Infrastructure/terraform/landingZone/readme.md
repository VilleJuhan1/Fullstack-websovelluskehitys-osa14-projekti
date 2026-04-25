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
  "Thesis-project" = {
    name          = "Thesis-project"
    budget_amount = 1
  }
}
```

## Bootstrapping State (The "Chicken & Egg" Problem)

Because this module creates the Object Storage bucket intended to hold its own state, you cannot initialize the HTTP backend immediately on the very first run. You must bootstrap the state locally first, create the resources (including the bucket), and then migrate the state to the newly created remote bucket.

**Steps to bootstrap:**
1. Comment out the `backend "http" {}` block in `providers.tf`.
2. Run `terraform init` to initialize the project with local state.
3. Run `terraform apply -var-file=terraform.tfvars` to create the tenancy resources, which will also provision your new state bucket.
4. Go to the OCI Console, locate the new bucket (named `<project_name>-terraform-state`) in your `Security-and-Access` compartment.
5. Create a Pre-Authenticated Request (PAR) for the bucket, making sure to grant **Read/Write** permissions.
6. Add the PAR URL to your `backend.conf` file as per the template.
7. Re-enable the `backend "http" {}` block in `providers.tf`.
8. Run `terraform init -backend-config=backend.conf -migrate-state` and say `yes` to push your local state into the remote bucket!

## Regular Usage

Once the state is bootstrapped, your normal workflow will be:

```bash
terraform init -backend-config=backend.conf
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```

## Using an automated or manually triggered CI/CD pipeline via Github actions

--- Will be added later ---