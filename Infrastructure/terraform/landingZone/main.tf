# Generated with Gemini 3.1 Pro
# -----------------------------------------------------------------------------
# Compartments
# -----------------------------------------------------------------------------
resource "oci_identity_compartment" "project" {
  for_each       = var.projects
  compartment_id = var.tenancy_ocid
  description    = "Parent compartment for the ${each.value.name} project"
  name           = each.value.name
  enable_delete  = true
}

resource "oci_identity_compartment" "network" {
  for_each       = var.projects
  compartment_id = oci_identity_compartment.project[each.key].id
  description    = "Child compartment for Network resources"
  name           = "Network"
  enable_delete  = true
}

resource "oci_identity_compartment" "compute" {
  for_each       = var.projects
  compartment_id = oci_identity_compartment.project[each.key].id
  description    = "Child compartment for Compute resources"
  name           = "Compute"
  enable_delete  = true
}

resource "oci_identity_compartment" "security_access" {
  for_each       = var.projects
  compartment_id = oci_identity_compartment.project[each.key].id
  description    = "Child compartment for Security & Access resources"
  name           = "Security-and-Access"
  enable_delete  = true
}

# -----------------------------------------------------------------------------
# Identity and Access Management (IAM)
# -----------------------------------------------------------------------------
resource "oci_identity_group" "project_admins" {
  for_each       = var.projects
  compartment_id = var.tenancy_ocid
  description    = "Service accounts and pipelines group for ${each.value.name}"
  name           = "${replace(each.value.name, "-", "")}AdminsGroup"
}

resource "oci_identity_policy" "project_admin_policy" {
  for_each       = var.projects
  compartment_id = var.tenancy_ocid
  description    = "Allows ${oci_identity_group.project_admins[each.key].name} to manage all resources in the ${each.value.name} compartment"
  name           = "${replace(each.value.name, "-", "")}CompartmentAdminPolicy"
  
  statements = [
    "Allow group ${oci_identity_group.project_admins[each.key].name} to manage all-resources in compartment id ${oci_identity_compartment.project[each.key].id}"
  ]
}

# (Optional Placeholder) Service Account User for CI/CD
resource "oci_identity_user" "github_actions_sa" {
  for_each       = var.projects
  compartment_id = var.tenancy_ocid
  description    = "Service Account for GitHub Actions Terraform CI/CD for ${each.value.name}"
  name           = "github-actions-sa-${each.value.name}"
}

resource "oci_identity_user_group_membership" "github_actions_sa_membership" {
  for_each = var.projects
  group_id = oci_identity_group.project_admins[each.key].id
  user_id  = oci_identity_user.github_actions_sa[each.key].id
}
