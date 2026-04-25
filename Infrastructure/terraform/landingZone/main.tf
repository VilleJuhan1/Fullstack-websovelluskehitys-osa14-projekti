# Generated with Gemini 3.1 Pro
# -----------------------------------------------------------------------------
# Compartments
# -----------------------------------------------------------------------------
resource "oci_identity_compartment" "project" {
  compartment_id = var.tenancy_ocid
  description    = "Parent compartment for the ${var.project_name} project"
  name           = var.project_name
  enable_delete  = true
}

resource "oci_identity_compartment" "network" {
  compartment_id = oci_identity_compartment.project.id
  description    = "Child compartment for Network resources"
  name           = "Network"
  enable_delete  = true
}

resource "oci_identity_compartment" "compute" {
  compartment_id = oci_identity_compartment.project.id
  description    = "Child compartment for Compute resources"
  name           = "Compute"
  enable_delete  = true
}

resource "oci_identity_compartment" "security_access" {
  compartment_id = oci_identity_compartment.project.id
  description    = "Child compartment for Security & Access resources"
  name           = "Security-and-Access"
  enable_delete  = true
}

# -----------------------------------------------------------------------------
# Identity and Access Management (IAM)
# -----------------------------------------------------------------------------
resource "oci_identity_group" "project_admins" {
  compartment_id = var.tenancy_ocid
  description    = "Service accounts and pipelines group for ${var.project_name}"
  name           = "${replace(var.project_name, "-", "")}AdminsGroup"
}

resource "oci_identity_policy" "project_admin_policy" {
  compartment_id = var.tenancy_ocid
  description    = "Allows ${oci_identity_group.project_admins.name} to manage all resources in the ${var.project_name} compartment"
  name           = "${replace(var.project_name, "-", "")}CompartmentAdminPolicy"
  
  statements = [
    "Allow group ${oci_identity_group.project_admins.name} to manage all-resources in compartment id ${oci_identity_compartment.project.id}"
  ]
}

# (Optional Placeholder) Service Account User for CI/CD
resource "oci_identity_user" "github_actions_sa" {
  compartment_id = var.tenancy_ocid
  description    = "Service Account for GitHub Actions Terraform CI/CD"
  name           = "github-actions-sa"
}

resource "oci_identity_user_group_membership" "github_actions_sa_membership" {
  group_id = oci_identity_group.project_admins.id
  user_id  = oci_identity_user.github_actions_sa.id
}
