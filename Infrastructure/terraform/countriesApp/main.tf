# Generated with Gemini 3.1 Pro

# -----------------------------------------------------------------------------
# Main configuration for the CountriesApp project
# -----------------------------------------------------------------------------

# Fetch the compartment OCIDs dynamically based on the naming convention from Landing Zone

# 1. Parent Project Compartment
data "oci_identity_compartments" "project" {
  compartment_id            = var.tenancy_ocid
  compartment_id_in_subtree = true
  name                      = var.project_name
}

# 2. Network Child Compartment
data "oci_identity_compartments" "network" {
  compartment_id            = data.oci_identity_compartments.project.compartments[0].id
  compartment_id_in_subtree = false
  name                      = "Network"
}

# 3. Compute Child Compartment
data "oci_identity_compartments" "compute" {
  compartment_id            = data.oci_identity_compartments.project.compartments[0].id
  compartment_id_in_subtree = false
  name                      = "Compute"
}

# 4. Security & Access Child Compartment
data "oci_identity_compartments" "security" {
  compartment_id            = data.oci_identity_compartments.project.compartments[0].id
  compartment_id_in_subtree = false
  name                      = "Security-and-Access"
}

# Output the discovered compartment IDs just to verify
output "compartment_ids" {
  description = "The OCIDs of the project compartments"
  value = {
    project  = data.oci_identity_compartments.project.compartments[0].id
    network  = data.oci_identity_compartments.network.compartments[0].id
    compute  = data.oci_identity_compartments.compute.compartments[0].id
    security = data.oci_identity_compartments.security.compartments[0].id
  }
}
