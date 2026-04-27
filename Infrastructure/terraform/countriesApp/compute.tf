# Generated with Gemini 3.1 Pro

# -----------------------------------------------------------------------------
# SSH Keys for Ansible
# -----------------------------------------------------------------------------
resource "tls_private_key" "ansible_ssh_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "local_sensitive_file" "ansible_private_key" {
  content         = tls_private_key.ansible_ssh_key.private_key_pem
  filename        = "${path.module}/local/ansible_key.pem"
  file_permission = "0600"
}

# -----------------------------------------------------------------------------
# Data Sources for Compute
# -----------------------------------------------------------------------------
data "oci_identity_availability_domains" "ads" {
  compartment_id = var.tenancy_ocid
}

# Get the latest Ubuntu 24.04 ARM64 image
data "oci_core_images" "ubuntu_arm" {
  compartment_id           = var.tenancy_ocid
  operating_system         = "Canonical Ubuntu"
  operating_system_version = "24.04"
  shape                    = "VM.Standard.A1.Flex"
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

# -----------------------------------------------------------------------------
# K3s Master Node (Primary VNIC in Private Subnet)
# -----------------------------------------------------------------------------
resource "oci_core_instance" "k3s_master" {
  compartment_id      = data.oci_identity_compartments.compute.compartments[0].id
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  display_name        = "${var.project_name}-k3s-master"
  shape               = "VM.Standard.A1.Flex"

  shape_config {
    ocpus         = 2
    memory_in_gbs = 12
  }

  source_details {
    source_type             = "image"
    source_id               = data.oci_core_images.ubuntu_arm.images[0].id
    boot_volume_size_in_gbs = 50
  }

  create_vnic_details {
    subnet_id                 = oci_core_subnet.private_subnet.id
    assign_public_ip          = false
    display_name              = "primary-private"
    nsg_ids                   = [oci_core_network_security_group.nsg_private_k3s.id]
  }

  metadata = {
    ssh_authorized_keys = tls_private_key.ansible_ssh_key.public_key_openssh
  }
}

# Secondary VNIC for Master (Public Subnet for outbound internet)
resource "oci_core_vnic_attachment" "master_public_vnic" {
  create_vnic_details {
    subnet_id        = oci_core_subnet.public_subnet.id
    assign_public_ip = true
    display_name     = "secondary-public"
    nsg_ids          = [oci_core_network_security_group.nsg_public_egress.id]
  }
  instance_id = oci_core_instance.k3s_master.id
}

# -----------------------------------------------------------------------------
# K3s Worker Node (Primary VNIC in Private Subnet)
# -----------------------------------------------------------------------------
resource "oci_core_instance" "k3s_worker" {
  compartment_id      = data.oci_identity_compartments.compute.compartments[0].id
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  display_name        = "${var.project_name}-k3s-worker"
  shape               = "VM.Standard.A1.Flex"

  shape_config {
    ocpus         = 2
    memory_in_gbs = 12
  }

  source_details {
    source_type             = "image"
    source_id               = data.oci_core_images.ubuntu_arm.images[0].id
    boot_volume_size_in_gbs = 50
  }

  create_vnic_details {
    subnet_id                 = oci_core_subnet.private_subnet.id
    assign_public_ip          = false
    display_name              = "primary-private"
    nsg_ids                   = [oci_core_network_security_group.nsg_private_k3s.id]
  }

  metadata = {
    ssh_authorized_keys = tls_private_key.ansible_ssh_key.public_key_openssh
  }
}

# Secondary VNIC for Worker (Public Subnet for outbound internet)
resource "oci_core_vnic_attachment" "worker_public_vnic" {
  create_vnic_details {
    subnet_id        = oci_core_subnet.public_subnet.id
    assign_public_ip = true
    display_name     = "secondary-public"
    nsg_ids          = [oci_core_network_security_group.nsg_public_egress.id]
  }
  instance_id = oci_core_instance.k3s_worker.id
}

# -----------------------------------------------------------------------------
# Ansible Inventory Generation
# -----------------------------------------------------------------------------
# This automatically generates the inventory.ini file for Ansible with the 
# private IPs of the newly provisioned VMs.
resource "local_file" "ansible_inventory" {
  filename = "${path.module}/local/inventory.ini"
  content  = <<EOF
[k3s_master]
${oci_core_instance.k3s_master.private_ip} ansible_user=ubuntu ansible_ssh_private_key_file=./ansible_key.pem

[k3s_worker]
${oci_core_instance.k3s_worker.private_ip} ansible_user=ubuntu ansible_ssh_private_key_file=./ansible_key.pem

[k3s_cluster:children]
k3s_master
k3s_worker
EOF
}
