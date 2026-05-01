# Generated with Gemini 3.1 Pro

# -----------------------------------------------------------------------------
# Security Lists (SL)
# -----------------------------------------------------------------------------
# We create an empty Security List to override the VCN's default security list 
# (which dangerously allows Port 22 from 0.0.0.0/0). 
# We will rely entirely on Network Security Groups (NSGs) for granular access.
resource "oci_core_security_list" "empty_sl" {
  compartment_id = data.oci_identity_compartments.security.compartments[0].id
  vcn_id         = oci_core_vcn.project_vcn.id
  display_name   = "${var.project_name}-base-sl"

  # We must allow egress at the subnet level so the OCI Bastion Service 
  # can reach the VMs. Ingress is still locked down by NSGs.
  egress_security_rules {
    destination      = "0.0.0.0/0"
    destination_type = "CIDR_BLOCK"
    protocol         = "all"
  }

  ingress_security_rules {
    protocol    = "6" # TCP
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    tcp_options {
      max = 80
      min = 80
    }
  }

  ingress_security_rules {
    protocol    = "6" # TCP
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    tcp_options {
      max = 443
      min = 443
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
  source                    = oci_core_vcn.project_vcn.cidr_block
  source_type               = "CIDR_BLOCK"
  tcp_options {
    destination_port_range {
      max = 22
      min = 22
    }
  }
}


# 2a. Kubernetes API Server (Allows nodes to talk to master)
resource "oci_core_network_security_group_security_rule" "k3s_api_node_ingress" {
  network_security_group_id = oci_core_network_security_group.nsg_k3s_nodes.id
  direction                 = "INGRESS"
  protocol                  = "6" # TCP
  source                    = oci_core_subnet.k3s_subnet.cidr_block
  source_type               = "CIDR_BLOCK"
  tcp_options {
    destination_port_range {
      max = 6443
      min = 6443
    }
  }
}

# 2b. Kubernetes API Server (Allows direct management for debugging)
resource "oci_core_network_security_group_security_rule" "k3s_api_bastion_ingress" {
  network_security_group_id = oci_core_network_security_group.nsg_k3s_nodes.id
  direction                 = "INGRESS"
  protocol                  = "6" # TCP
  source                    = oci_core_vcn.project_vcn.cidr_block
  source_type               = "CIDR_BLOCK"
  tcp_options {
    destination_port_range {
      max = 6443
      min = 6443
    }
  }
}


# 3. Flannel VXLAN (Pod-to-Pod networking between nodes)
resource "oci_core_network_security_group_security_rule" "k3s_flannel_ingress" {
  network_security_group_id = oci_core_network_security_group.nsg_k3s_nodes.id
  direction                 = "INGRESS"
  protocol                  = "17" # UDP
  source                    = oci_core_subnet.k3s_subnet.cidr_block
  source_type               = "CIDR_BLOCK"
  udp_options {
    destination_port_range { 
      max = 8472
      min = 8472
    }
  }
}

# 4. Kubelet API (Metrics and logs between nodes)
resource "oci_core_network_security_group_security_rule" "k3s_kubelet_ingress" {
  network_security_group_id = oci_core_network_security_group.nsg_k3s_nodes.id
  direction                 = "INGRESS"
  protocol                  = "6" # TCP
  source                    = oci_core_subnet.k3s_subnet.cidr_block
  source_type               = "CIDR_BLOCK"
  tcp_options {
    destination_port_range { 
      max = 10250
      min = 10250 
    }
  }
}

# 5. NodePorts (Allows the Public Load Balancer to reach the k3s ingress controller)
resource "oci_core_network_security_group_security_rule" "k3s_nodeport_ingress" {
  network_security_group_id = oci_core_network_security_group.nsg_k3s_nodes.id
  direction                 = "INGRESS"
  protocol                  = "6" # TCP
  source                    = oci_core_subnet.lb_subnet.cidr_block # Only from LB subnet
  source_type               = "CIDR_BLOCK"
  tcp_options {
    destination_port_range {
      max = 32767
      min = 30000
    }
  }
}

# 6. Service Ports (Allows the Public Load Balancer to reach the Ingress Controller)
resource "oci_core_network_security_group_security_rule" "k3s_service_port_ingress" {
  network_security_group_id = oci_core_network_security_group.nsg_k3s_nodes.id
  direction                 = "INGRESS"
  protocol                  = "6" # TCP
  source                    = oci_core_subnet.lb_subnet.cidr_block
  source_type               = "CIDR_BLOCK"
  tcp_options {
    destination_port_range { 
      max = 8085
      min = 8080 
    } 

  }
}


# --- EGRESS RULES ---

# 1. Allow all outbound traffic to the VCN. 
resource "oci_core_network_security_group_security_rule" "k3s_internal_egress" {
  network_security_group_id = oci_core_network_security_group.nsg_k3s_nodes.id
  direction                 = "EGRESS"
  protocol                  = "all"
  destination               = oci_core_vcn.project_vcn.cidr_block
  destination_type          = "CIDR_BLOCK"
}

# -----------------------------------------------------------------------------

# 2. NSG for the VMs' Public Interfaces (Secondary VNICs in Public Subnet)
resource "oci_core_network_security_group" "nsg_public_egress" {
  compartment_id = data.oci_identity_compartments.security.compartments[0].id
  vcn_id         = oci_core_vcn.project_vcn.id
  display_name   = "${var.project_name}-nsg-public-egress"
}

# Allow outbound traffic to the entire internet (for pulling images, ArgoCD, etc.)
resource "oci_core_network_security_group_security_rule" "public_vnic_internet_egress" {
  network_security_group_id = oci_core_network_security_group.nsg_public_egress.id
  direction                 = "EGRESS"
  protocol                  = "all"
  destination               = "0.0.0.0/0"
  destination_type          = "CIDR_BLOCK"
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
  
  tcp_options {
    destination_port_range {
      max = 443
      min = 443
    }
  }
}

# Allow LB to send traffic to the K3s Subnet (where the VMs are listening)
resource "oci_core_network_security_group_security_rule" "lb_internal_egress" {
  network_security_group_id = oci_core_network_security_group.nsg_public_lb.id
  direction                 = "EGRESS"
  protocol                  = "all"
  destination               = oci_core_subnet.k3s_subnet.cidr_block
  destination_type          = "CIDR_BLOCK"
}

# 2. Allow outbound traffic to the internet (to reply to clients)
resource "oci_core_network_security_group_security_rule" "lb_public_egress" {
  network_security_group_id = oci_core_network_security_group.nsg_public_lb.id
  direction                 = "EGRESS"
  protocol                  = "all"
  destination               = "0.0.0.0/0"
  destination_type          = "CIDR_BLOCK"
}