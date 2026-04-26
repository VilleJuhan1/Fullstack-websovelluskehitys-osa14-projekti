# Generated with Gemini 3.1 Pro
terraform {
  required_version = ">= 1.0.0"
  
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = ">= 6.0.0"
    }
  }
  
  # State is stored remotely to allow CI/CD to access it
  # Initialize with: terraform init -backend-config=backend.conf
  #backend "http" {}
}

provider "oci" {
  tenancy_ocid     = var.tenancy_ocid
  user_ocid        = var.user_ocid
  fingerprint      = var.fingerprint
  region           = var.region

  # If var.private_key is null, OCI looks at private_key_path (local dev)
  private_key      = var.private_key
  private_key_path = var.private_key_path
}
