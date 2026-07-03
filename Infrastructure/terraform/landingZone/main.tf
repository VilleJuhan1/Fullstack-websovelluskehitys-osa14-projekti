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
    "Allow group ${oci_identity_group.project_admins[each.key].name} to manage all-resources in compartment id ${oci_identity_compartment.project[each.key].id}",
    "Allow group ${oci_identity_group.project_admins[each.key].name} to inspect compartments in tenancy"
  ]
}

# Service Account User for CI/CD
resource "oci_identity_user" "github_actions_sa" {
  for_each       = var.projects
  compartment_id = var.tenancy_ocid
  description    = "Service Account for GitHub Actions Terraform CI/CD for ${each.value.name}"
  name           = "github-actions-sa-${each.value.name}"
  email          = each.value.service_account_email
}

# Restrict the service account to only use API keys (disables console login and password enforcement)
resource "oci_identity_user_capabilities_management" "github_actions_sa_capabilities" {
  for_each                     = var.projects
  user_id                      = oci_identity_user.github_actions_sa[each.key].id
  can_use_api_keys             = true
  can_use_auth_tokens          = false
  can_use_console_password     = false
  can_use_customer_secret_keys = false
  can_use_smtp_credentials     = false
}

resource "oci_identity_user_group_membership" "github_actions_sa_membership" {
  for_each = var.projects
  group_id = oci_identity_group.project_admins[each.key].id
  user_id  = oci_identity_user.github_actions_sa[each.key].id
}

# -----------------------------------------------------------------------------
# OCI IAM Dynamic Group for Instance Principals
# -----------------------------------------------------------------------------
# Note: Dynamic groups must be defined at the Tenancy level (root compartment).
resource "oci_identity_dynamic_group" "k3s_nodes_group" {
  for_each       = var.projects
  compartment_id = var.tenancy_ocid
  name           = "${each.value.name}-K3s-Nodes-Group"
  description    = "Dynamic group for K3s instances in the compute compartment of ${each.value.name}"
  matching_rule  = "instance.compartment.id = '${oci_identity_compartment.compute[each.key].id}'"
}

# -----------------------------------------------------------------------------
# OCI IAM Policies for Secret Access
# -----------------------------------------------------------------------------
# Grants K3s nodes permission to read secrets from the Security compartment.
resource "oci_identity_policy" "k3s_secrets_policy" {
  for_each       = var.projects
  compartment_id = oci_identity_compartment.security_access[each.key].id
  name           = "${each.value.name}-K3s-Secrets-Policy"
  description    = "Allows K3s instances in dynamic group to read secrets and use vaults in Security-and-Access compartment"

  statements = [
    "Allow dynamic-group ${oci_identity_dynamic_group.k3s_nodes_group[each.key].name} to read secret-family in compartment id ${oci_identity_compartment.security_access[each.key].id}",
    "Allow dynamic-group ${oci_identity_dynamic_group.k3s_nodes_group[each.key].name} to use vaults in compartment id ${oci_identity_compartment.security_access[each.key].id}"
  ]
}

