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
  for_each       = var.projects
  # Placing the bucket in the Security & Access compartment for strict control
  compartment_id = oci_identity_compartment.security_access[each.key].id
  name           = "${each.value.name}-terraform-state"
  namespace      = data.oci_objectstorage_namespace.tenancy_namespace.namespace
  access_type    = "NoPublicAccess"
  
  # Enabling object versioning is highly recommended for Terraform state
  # to prevent accidental state loss/corruption.
  versioning     = "Enabled"
}

# Automatically generate the Pre-Authenticated Request (PAR) for the state file
resource "oci_objectstorage_preauthrequest" "terraform_state_par" {
  for_each     = var.projects
  access_type  = "ObjectReadWrite"
  bucket       = oci_objectstorage_bucket.terraform_state[each.key].name
  name         = "${each.value.name}-terraform-state-par"
  namespace    = data.oci_objectstorage_namespace.tenancy_namespace.namespace
  # Setting an expiration far in the future (adjust as needed for security policies)
  time_expires = "2030-12-31T23:59:00Z" 
  object_name  = "terraform.tfstate"
}

# Output the PAR URL so it can be saved as a GitHub Secret
output "terraform_state_backend_urls" {
  description = "The secret PAR URLs to use for the HTTP backend for each project. Save this as a GitHub Secret (e.g., OCI_TF_STATE_PAR)."
  value       = {
    for key, proj in var.projects : key => "https://objectstorage.${var.region}.oraclecloud.com${oci_objectstorage_preauthrequest.terraform_state_par[key].access_uri}"
  }
  sensitive   = true
}
