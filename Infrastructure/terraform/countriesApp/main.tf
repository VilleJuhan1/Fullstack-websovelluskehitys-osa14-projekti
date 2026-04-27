# Generated with Gemini 3.1 Pro

# -----------------------------------------------------------------------------
# Main configuration for the CountriesApp project
# -----------------------------------------------------------------------------

# Fetch the compartment OCID dynamically based on the name we created in the Landing Zone
data "oci_identity_compartments" "project_compartment" {
  compartment_id            = var.tenancy_ocid
  compartment_id_in_subtree = true
  name                      = var.project_name
}

# Output the discovered compartment ID just to verify our auth and framework are working
output "project_compartment_id" {
  description = "The OCID of the CountriesApp compartment"
  value       = data.oci_identity_compartments.project_compartment.compartments[0].id
}
