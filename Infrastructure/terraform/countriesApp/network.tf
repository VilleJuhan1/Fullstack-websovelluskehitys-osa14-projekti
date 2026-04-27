# Generated with Gemini 3.1 Pro

# -----------------------------------------------------------------------------
# Virtual Cloud Network (VCN)
# -----------------------------------------------------------------------------
resource "oci_core_vcn" "project_vcn" {
  compartment_id = data.oci_identity_compartments.project_compartment.compartments[0].id
  cidr_block     = "10.0.0.0/16"
  display_name   = "${var.project_name}-vcn"
  dns_label      = "countriesapp"
}

# -----------------------------------------------------------------------------
# Internet Gateway
# -----------------------------------------------------------------------------
resource "oci_core_internet_gateway" "igw" {
  compartment_id = data.oci_identity_compartments.project_compartment.compartments[0].id
  vcn_id         = oci_core_vcn.project_vcn.id
  display_name   = "${var.project_name}-igw"
  enabled        = true
}

# -----------------------------------------------------------------------------
# Route Tables
# -----------------------------------------------------------------------------
# Public Route Table (Routes outbound internet traffic to the IGW)
resource "oci_core_route_table" "public_rt" {
  compartment_id = data.oci_identity_compartments.project_compartment.compartments[0].id
  vcn_id         = oci_core_vcn.project_vcn.id
  display_name   = "${var.project_name}-public-rt"

  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_internet_gateway.igw.id
  }
}

# Private Route Table (No internet routing since we use no NAT Gateway)
resource "oci_core_route_table" "private_rt" {
  compartment_id = data.oci_identity_compartments.project_compartment.compartments[0].id
  vcn_id         = oci_core_vcn.project_vcn.id
  display_name   = "${var.project_name}-private-rt"

  # Internal VCN traffic is automatically routed implicitly. 
  # We leave this without external routes to enforce complete isolation.
}

# -----------------------------------------------------------------------------
# Subnets
# -----------------------------------------------------------------------------
# Public Subnet (For Secondary VNICs: Outbound Internet Access & Load Balancer)
resource "oci_core_subnet" "public_subnet" {
  compartment_id = data.oci_identity_compartments.project_compartment.compartments[0].id
  vcn_id         = oci_core_vcn.project_vcn.id
  cidr_block     = "10.0.1.0/24"
  display_name   = "${var.project_name}-public-subnet"
  dns_label      = "public"
  route_table_id = oci_core_route_table.public_rt.id
  
  # Ensure public IP addresses can be assigned
  prohibit_public_ip_on_vnic = false
}

# Private Subnet (For Primary VNICs: Internal Cluster Communication)
resource "oci_core_subnet" "private_subnet" {
  compartment_id = data.oci_identity_compartments.project_compartment.compartments[0].id
  vcn_id         = oci_core_vcn.project_vcn.id
  cidr_block     = "10.0.2.0/24"
  display_name   = "${var.project_name}-private-subnet"
  dns_label      = "private"
  route_table_id = oci_core_route_table.private_rt.id
  
  # Strictly prohibit public IPs
  prohibit_public_ip_on_vnic = true
}