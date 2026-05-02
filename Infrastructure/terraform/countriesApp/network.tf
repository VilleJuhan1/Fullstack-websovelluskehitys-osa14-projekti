# Generated with Gemini 3.1 Pro

# -----------------------------------------------------------------------------
# Virtual Cloud Network (VCN)
# -----------------------------------------------------------------------------
resource "oci_core_vcn" "project_vcn" {
  compartment_id = data.oci_identity_compartments.network.compartments[0].id
  cidr_block     = "10.0.0.0/16"
  display_name   = "${var.project_name}-vcn"
  dns_label      = "countriesapp"
}

# -----------------------------------------------------------------------------
# Internet Gateway
# -----------------------------------------------------------------------------
resource "oci_core_internet_gateway" "igw" {
  compartment_id = data.oci_identity_compartments.network.compartments[0].id
  vcn_id         = oci_core_vcn.project_vcn.id
  display_name   = "${var.project_name}-igw"
  enabled        = true
}

# -----------------------------------------------------------------------------
# Route Tables
# -----------------------------------------------------------------------------
# Public Route Table (Routes outbound internet traffic to the IGW)
resource "oci_core_route_table" "public_rt" {
  compartment_id = data.oci_identity_compartments.network.compartments[0].id
  vcn_id         = oci_core_vcn.project_vcn.id
  display_name   = "${var.project_name}-public-rt"

  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_internet_gateway.igw.id
  }
}

# -----------------------------------------------------------------------------
# Subnets
# -----------------------------------------------------------------------------

# (Bastion Subnet removed - Service is anchored in K3s Subnet)

# 2. Load Balancer Subnet (Public - For Public NLB)
resource "oci_core_subnet" "lb_subnet" {
  compartment_id = data.oci_identity_compartments.network.compartments[0].id
  vcn_id         = oci_core_vcn.project_vcn.id
  cidr_block     = "10.0.2.0/24"
  display_name   = "${var.project_name}-lb-subnet"
  dns_label      = "lb"
  route_table_id = oci_core_route_table.public_rt.id
  security_list_ids = [oci_core_security_list.empty_sl.id]
  
  prohibit_public_ip_on_vnic = false
}

# 3. K3s Subnet (Public - For Master and Worker nodes)
# Note: We use a public subnet here to allow egress without a paid NAT Gateway.
# Ingress will be strictly controlled via NSGs.
resource "oci_core_subnet" "k3s_subnet" {
  compartment_id = data.oci_identity_compartments.network.compartments[0].id
  vcn_id         = oci_core_vcn.project_vcn.id
  cidr_block     = "10.0.3.0/24"
  display_name   = "${var.project_name}-k3s-subnet"
  dns_label      = "k3s"
  route_table_id = oci_core_route_table.public_rt.id
  security_list_ids = [oci_core_security_list.empty_sl.id]
  
  prohibit_public_ip_on_vnic = false
}