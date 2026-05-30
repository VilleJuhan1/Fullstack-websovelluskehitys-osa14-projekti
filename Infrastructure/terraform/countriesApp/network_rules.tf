# Generated with Gemini 3.1 Pro

# -----------------------------------------------------------------------------
# Security Lists (SL)
# -----------------------------------------------------------------------------
resource "oci_core_security_list" "empty_sl" {
  compartment_id = data.oci_identity_compartments.security.compartments[0].id
  vcn_id         = oci_core_vcn.project_vcn.id
  display_name   = "${var.project_name}-base-sl"

  # Managed OCI Services (like Bastion) require subnet-level egress.
  egress_security_rules {
    destination      = oci_core_vcn.project_vcn.cidr_block
    destination_type = "CIDR_BLOCK"
    protocol         = "6" # TCP
    description      = "Allow Bastion Service to reach nodes via SSH"
    
    tcp_options {
      max = 22
      min = 22
    }
  }
}

# -----------------------------------------------------------------------------
# Network Security Groups (NSGs)
# -----------------------------------------------------------------------------

# 1. NSG for the k3s Cluster Nodes (VNICs in K3s Subnet)
resource "oci_core_network_security_group" "nsg_k3s_nodes" {
  compartment_id = data.oci_identity_compartments.security.compartments[0].id
  vcn_id         = oci_core_vcn.project_vcn.id
  display_name   = "${var.project_name}-nsg-k3s-nodes"
}

# --- INGRESS RULES ---

# 1. SSH from VCN (Allows OCI Bastion Service to connect to nodes)
resource "oci_core_network_security_group_security_rule" "k3s_ssh_ingress" {
  network_security_group_id = oci_core_network_security_group.nsg_k3s_nodes.id
  direction                 = "INGRESS"
  protocol                  = "6" # TCP
  source                    = oci_core_subnet.k3s_subnet.cidr_block
  source_type               = "CIDR_BLOCK"
  description               = "Allow SSH access from the local subnet for Bastion Service"
  
  tcp_options {
    destination_port_range {
      max = 22
      min = 22
    }
  }
}


# 2. Kubernetes API Server from other Nodes
resource "oci_core_network_security_group_security_rule" "k3s_api_node_ingress" {
  network_security_group_id = oci_core_network_security_group.nsg_k3s_nodes.id
  direction                 = "INGRESS"
  protocol                  = "6" # TCP
  source                    = oci_core_subnet.k3s_subnet.cidr_block
  source_type               = "CIDR_BLOCK"
  description               = "Allow nodes and Bastion to communicate with the API server"
  
  tcp_options {
    destination_port_range {
      max = 6443
      min = 6443
    }
  }
}

# 3. Flannel VXLAN (Overlay Network)
resource "oci_core_network_security_group_security_rule" "k3s_flannel_ingress" {
  network_security_group_id = oci_core_network_security_group.nsg_k3s_nodes.id
  direction                 = "INGRESS"
  protocol                  = "17" # UDP
  source                    = oci_core_network_security_group.nsg_k3s_nodes.id
  source_type               = "NETWORK_SECURITY_GROUP"
  description               = "Allow Flannel overlay network traffic between nodes"
  
  udp_options {
    destination_port_range {
      max = 8472
      min = 8472
    }
  }
}

# 4. Kubelet API
resource "oci_core_network_security_group_security_rule" "k3s_kubelet_ingress" {
  network_security_group_id = oci_core_network_security_group.nsg_k3s_nodes.id
  direction                 = "INGRESS"
  protocol                  = "6" # TCP
  source                    = oci_core_network_security_group.nsg_k3s_nodes.id
  source_type               = "NETWORK_SECURITY_GROUP"
  description               = "Allow Kubelet API communication between nodes"
  
  tcp_options {
    destination_port_range {
      max = 10250
      min = 10250
    }
  }
}

# 5. K8s NodePort Range (for Public LB)
resource "oci_core_network_security_group_security_rule" "k3s_nodeport_ingress" {
  network_security_group_id = oci_core_network_security_group.nsg_k3s_nodes.id
  direction                 = "INGRESS"
  protocol                  = "6" # TCP
  source                    = oci_core_network_security_group.nsg_public_lb.id
  source_type               = "NETWORK_SECURITY_GROUP"
  description               = "Allow the Load Balancer to reach Kubernetes NodePort services"
  
  tcp_options {
    destination_port_range {
      max = 32767
      min = 30000
    }
  }
}

# 6. Allow Node-Exporter traffic between cluster nodes (Grafana)
resource "oci_core_network_security_group_security_rule" "k3s_node_exporter_ingress" {
  network_security_group_id = oci_core_network_security_group.nsg_k3s_nodes.id
  direction                 = "INGRESS"
  protocol                  = "6" # TCP
  source                    = oci_core_network_security_group.nsg_k3s_nodes.id
  source_type               = "NETWORK_SECURITY_GROUP"
  description               = "Allow Prometheus Node-Exporter metrics collection between K3s cluster nodes"

  tcp_options {
    destination_port_range {
      max = 9100
      min = 9100
    }
  }
}


# --- EGRESS RULES ---

# (Redundant VCN rule removed as nodes have 0.0.0.0/0 egress for internet access)

# -----------------------------------------------------------------------------

# 2. NSG for the VMs' Public Interfaces (Secondary VNICs in Public Subnet)
resource "oci_core_network_security_group" "nsg_public_egress" {
  compartment_id = data.oci_identity_compartments.security.compartments[0].id
  vcn_id         = oci_core_vcn.project_vcn.id
  display_name   = "${var.project_name}-nsg-public-egress"
}

# 1. Allow outbound traffic to the internet (for pulling images, ArgoCD, etc.)
resource "oci_core_network_security_group_security_rule" "public_vnic_internet_egress" {
  network_security_group_id = oci_core_network_security_group.nsg_public_egress.id
  direction                 = "EGRESS"
  protocol                  = "all"
  destination               = "0.0.0.0/0"
  destination_type          = "CIDR_BLOCK"
  description               = "Allow instances to reach the public internet for updates and image pulls"
}

# NO INGRESS RULES FOR PUBLIC VNICs! 
# We explicitly do not add any 0.0.0.0/0 ingress rules here, completely shielding the VMs from the internet.

# -----------------------------------------------------------------------------

# 3. NSG for the Public Load Balancer
resource "oci_core_network_security_group" "nsg_public_lb" {
  compartment_id = data.oci_identity_compartments.security.compartments[0].id
  vcn_id         = oci_core_vcn.project_vcn.id
  display_name   = "${var.project_name}-nsg-public-lb"
}

# Allow HTTP Ingress from Internet
resource "oci_core_network_security_group_security_rule" "lb_http_ingress" {
  network_security_group_id = oci_core_network_security_group.nsg_public_lb.id
  direction                 = "INGRESS"
  protocol                  = "6" # TCP
  source                    = "0.0.0.0/0"
  source_type               = "CIDR_BLOCK"
  description               = "Allow public HTTP traffic"
  
  tcp_options {
    destination_port_range {
      max = 80
      min = 80
    }
  }
}

# Allow HTTPS Ingress from Internet
resource "oci_core_network_security_group_security_rule" "lb_https_ingress" {
  network_security_group_id = oci_core_network_security_group.nsg_public_lb.id
  direction                 = "INGRESS"
  protocol                  = "6" # TCP
  source                    = "0.0.0.0/0"
  source_type               = "CIDR_BLOCK"
  description               = "Allow public HTTPS traffic"
  
  tcp_options {
    destination_port_range {
      max = 443
      min = 443
    }
  }
}

# 3. All Internal Traffic from K3s Nodes (for Health Checks and diagnostics)
resource "oci_core_network_security_group_security_rule" "lb_internal_ingress" {
  network_security_group_id = oci_core_network_security_group.nsg_public_lb.id
  direction                 = "INGRESS"
  protocol                  = "all"
  source                    = oci_core_network_security_group.nsg_k3s_nodes.id
  source_type               = "NETWORK_SECURITY_GROUP"
  description               = "Allow any internal traffic coming from the K3s nodes"
}

# --- EGRESS RULES ---

# 1. Forward Traffic to K3s Nodes
resource "oci_core_network_security_group_security_rule" "lb_internal_egress" {
  network_security_group_id = oci_core_network_security_group.nsg_public_lb.id
  direction                 = "EGRESS"
  protocol                  = "all"
  destination               = oci_core_network_security_group.nsg_k3s_nodes.id
  destination_type          = "NETWORK_SECURITY_GROUP"
  description               = "Allow the LB to forward traffic to the K3s nodes"
}

# 2. Allow outbound traffic to the internet (to reply to clients)
resource "oci_core_network_security_group_security_rule" "lb_public_egress" {
  network_security_group_id = oci_core_network_security_group.nsg_public_lb.id
  direction                 = "EGRESS"
  protocol                  = "all"
  destination               = "0.0.0.0/0"
  destination_type          = "CIDR_BLOCK"
  description               = "Allow the LB to send response packets back to clients on the internet"
}