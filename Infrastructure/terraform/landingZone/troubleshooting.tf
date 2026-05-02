# -----------------------------------------------------------------------------
# Landing Zone - Global Troubleshooting Policies
# -----------------------------------------------------------------------------

# These policies enable advanced diagnostic tools across the entire tenancy.
# Documentation: https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/path_analyzer.htm#policy-requirements

resource "oci_identity_policy" "global_troubleshooting_policy" {
  compartment_id = var.tenancy_ocid
  name           = "GlobalTroubleshootingPolicy"
  description    = "Allows the Administrators group to use Network Path Analyzer and VNIC inspection for tenancy-wide debugging"

  statements = [
    # User group permissions to manage and run tests
    "allow group Administrators to manage vn-path-analyzer-test in tenancy",

    # Service principal permissions (needed for the tool to "see" your resources)
    "allow any-user to inspect compartments in tenancy where all { request.principal.type = 'vnpa-service' }",
    "allow any-user to read instances in tenancy where all { request.principal.type = 'vnpa-service' }",
    "allow any-user to read virtual-network-family in tenancy where all { request.principal.type = 'vnpa-service' }",
    "allow any-user to read load-balancers in tenancy where all { request.principal.type = 'vnpa-service' }",
    "allow any-user to read network-security-group in tenancy where all { request.principal.type = 'vnpa-service' }",
    "allow any-user to read zpr-family in tenancy where all { request.principal.type = 'vnpa-service' }"
  ]
}
