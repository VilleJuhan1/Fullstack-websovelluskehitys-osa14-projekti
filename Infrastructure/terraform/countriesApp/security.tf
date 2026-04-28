# Generated with Gemini 3.1 Pro

# -----------------------------------------------------------------------------
# OCI Bastion Service
# -----------------------------------------------------------------------------
resource "oci_bastion_bastion" "project_bastion" {
  bastion_type     = "STANDARD"
  compartment_id   = data.oci_identity_compartments.security.compartments[0].id
  target_subnet_id = oci_core_subnet.private_subnet.id
  client_cidr_block_allow_list = ["0.0.0.0/0"] # Consider restricting to your home IP address
  name             = "${var.project_name}-Bastion"
  
  # A Bastion requires a Max TTL for sessions (in seconds). Default is usually 3 hours.
  max_session_ttl_in_seconds = 10800
}

# -----------------------------------------------------------------------------
# OCI Vault (KMS)
# -----------------------------------------------------------------------------
resource "oci_kms_vault" "project_vault" {
  compartment_id = data.oci_identity_compartments.security.compartments[0].id
  display_name   = "${var.project_name}-Vault"
  vault_type     = "DEFAULT" # Free tier supports DEFAULT (Virtual Vault)
}

resource "oci_kms_key" "master_key" {
  compartment_id = data.oci_identity_compartments.security.compartments[0].id
  display_name   = "${var.project_name}-MasterKey"
  management_endpoint = oci_kms_vault.project_vault.management_endpoint
  
  key_shape {
    algorithm = "AES"
    length    = 32
  }
}

# -----------------------------------------------------------------------------
# OCI Network Load Balancer (NLB) - Free Tier Layer 4 LB
# -----------------------------------------------------------------------------
resource "oci_network_load_balancer_network_load_balancer" "public_nlb" {
  compartment_id = data.oci_identity_compartments.security.compartments[0].id
  display_name   = "${var.project_name}-NLB"
  subnet_id      = oci_core_subnet.public_subnet.id
  
  is_private                     = false
  is_preserve_source_destination = true
}

# Backend Set for HTTP (Port 80)
resource "oci_network_load_balancer_backend_set" "http_backend_set" {
  network_load_balancer_id = oci_network_load_balancer_network_load_balancer.public_nlb.id
  name                     = "http-backend-set"
  policy                   = "FIVE_TUPLE" # Standard for NLB
  
  health_checker {
    protocol = "TCP"
    port     = 80
  }
}

# Backend Set for HTTPS (Port 443)
resource "oci_network_load_balancer_backend_set" "https_backend_set" {
  network_load_balancer_id = oci_network_load_balancer_network_load_balancer.public_nlb.id
  name                     = "https-backend-set"
  policy                   = "FIVE_TUPLE"
  
  health_checker {
    protocol = "TCP"
    port     = 443
  }
}

# Listener for HTTP (Port 80)
resource "oci_network_load_balancer_listener" "http_listener" {
  network_load_balancer_id = oci_network_load_balancer_network_load_balancer.public_nlb.id
  name                     = "http-listener"
  default_backend_set_name = oci_network_load_balancer_backend_set.http_backend_set.name
  port                     = 80
  protocol                 = "TCP"
}

# Listener for HTTPS (Port 443)
resource "oci_network_load_balancer_listener" "https_listener" {
  network_load_balancer_id = oci_network_load_balancer_network_load_balancer.public_nlb.id
  name                     = "https-listener"
  default_backend_set_name = oci_network_load_balancer_backend_set.https_backend_set.name
  port                     = 443
  protocol                 = "TCP"
}

# Output the public IP of the Network Load Balancer
output "nlb_public_ip" {
  description = "The public IP address of the Network Load Balancer"
  value       = [for ip in oci_network_load_balancer_network_load_balancer.public_nlb.ip_addresses : ip.ip_address if ip.is_public == true]
}

# Output the Bastion ID for automation scripts
output "bastion_id" {
  description = "The OCID of the Bastion Service"
  value       = oci_bastion_bastion.project_bastion.id
}
