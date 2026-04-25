# Generated with Gemini 3.1 Pro
# -----------------------------------------------------------------------------
# Budgets
# -----------------------------------------------------------------------------
resource "oci_budget_budget" "project_budget" {
  compartment_id = var.tenancy_ocid
  amount         = var.budget_amount
  reset_period   = "MONTHLY"
  target_type    = "COMPARTMENT"
  targets        = [oci_identity_compartment.project.id]
}

resource "oci_budget_alert_rule" "project_budget_alert" {
  budget_id      = oci_budget_budget.project_budget.id
  type           = "FORECAST"
  threshold      = 100
  threshold_type = "PERCENTAGE"
  message        = "Forecasted to exceed the ${var.budget_amount} monthly budget for ${var.project_name}."
}

# -----------------------------------------------------------------------------
# Notifications & Events (Placeholders)
# -----------------------------------------------------------------------------
resource "oci_ons_notification_topic" "alerts" {
  compartment_id = oci_identity_compartment.security_access.id
  # Remove hyphens for valid ONS topic name if needed, or keep standard 
  name           = "${replace(var.project_name, "-", "")}Alerts"
}

# (Placeholder) Event Rule to trigger on specific actions like instance termination
resource "oci_events_rule" "security_events" {
  compartment_id = oci_identity_compartment.security_access.id
  condition      = "{ \"eventType\": [ \"com.oraclecloud.computeapi.terminateinstance.begin\" ] }"
  display_name   = "${var.project_name}-SecurityEvents"
  is_enabled     = true

  actions {
    actions {
      action_type = "ONS"
      is_enabled  = true
      topic_id    = oci_ons_notification_topic.alerts.id
    }
  }
}

# -----------------------------------------------------------------------------
# Flow Logs & Cloud Guard (Placeholders)
# -----------------------------------------------------------------------------

# Flow logs are typically attached to a Subnet. Here we provision the parent Log Group 
# that will later be used by the child compartment resources.
resource "oci_logging_log_group" "network_log_group" {
  compartment_id = oci_identity_compartment.network.id
  display_name   = "NetworkLogGroup"
}

# Note: Enabling Cloud Guard entirely through Terraform requires configuring a Target
# and passing the specific Recipe OCIDs for your region. It is often simpler to enable 
# Cloud Guard in the root compartment via the OCI Console once.
# If you wish to manage it via Terraform, you'll need the `oci_cloud_guard_target` resource.
