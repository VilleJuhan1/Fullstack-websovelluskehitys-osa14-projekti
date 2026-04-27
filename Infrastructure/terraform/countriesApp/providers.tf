# Generated with Gemini 3.1 Pro

terraform {
  required_version = ">= 1.0.0"
  
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = ">= 6.0.0"
    }
  }
  
  # State is stored remotely in the project-specific bucket (created by Landing Zone)
  # Initialize with: terraform init -backend-config=local/backend.conf
  backend "http" {}
}

provider "oci" {
  tenancy_ocid     = var.tenancy_ocid
  user_ocid        = var.user_ocid
  fingerprint      = var.fingerprint
  region           = var.region
  private_key      = var.private_key
  private_key_path = var.private_key_path
}
