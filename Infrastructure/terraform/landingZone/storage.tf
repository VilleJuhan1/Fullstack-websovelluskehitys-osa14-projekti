# Generated with Gemini 3.1 Pro
# -----------------------------------------------------------------------------
# Object Storage (Terraform Backend)
# -----------------------------------------------------------------------------

# Dynamically fetch the namespace for the tenancy
data "oci_objectstorage_namespace" "tenancy_namespace" {
  compartment_id = var.tenancy_ocid
}

# Create the Object Storage bucket for storing terraform.tfstate
resource "oci_objectstorage_bucket" "terraform_state" {
  # Placing the bucket in the Security & Access compartment for strict control
  compartment_id = oci_identity_compartment.security_access.id
  name           = "${var.project_name}-terraform-state"
  namespace      = data.oci_objectstorage_namespace.tenancy_namespace.namespace
  access_type    = "NoPublicAccess"
  
  # Enabling object versioning is highly recommended for Terraform state
  # to prevent accidental state loss/corruption.
  versioning     = "Enabled"
}

# Automatically generate the Pre-Authenticated Request (PAR) for the state file
resource "oci_objectstorage_preauthrequest" "terraform_state_par" {
  access_type  = "ObjectReadWrite"
  bucket       = oci_objectstorage_bucket.terraform_state.name
  name         = "${var.project_name}-terraform-state-par"
  namespace    = data.oci_objectstorage_namespace.tenancy_namespace.namespace
  # Setting an expiration far in the future (adjust as needed for security policies)
  time_expires = "2030-12-31T23:59:00Z" 
  object_name  = "terraform.tfstate"
}

# Output the PAR URL so it can be saved as a GitHub Secret
output "terraform_state_backend_url" {
  description = "The secret PAR URL to use for the HTTP backend. Save this as a GitHub Secret (e.g., OCI_TF_STATE_PAR)."
  value       = "https://objectstorage.${var.region}.oraclecloud.com${oci_objectstorage_preauthrequest.terraform_state_par.access_uri}"
  sensitive   = true
}
