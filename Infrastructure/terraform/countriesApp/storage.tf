# Generated with Gemini 3.1 Pro

# -----------------------------------------------------------------------------
# Database Storage (Block Volume)
# -----------------------------------------------------------------------------
# We provision a 50GB Block Volume out of the remaining 100GB Free Tier allocation.
# This will be attached to the k3s worker node and formatted by Ansible to store
# the PostgreSQL database data, ensuring persistence across pod restarts.
resource "oci_core_volume" "postgres_data" {
  compartment_id      = data.oci_identity_compartments.compute.compartments[0].id
  
  # We use the same availability domain that was fetched in compute.tf
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  display_name        = "${var.project_name}-postgres-data"
  
  # 50 GB is exactly half of the remaining 100 GB Free Tier allocation
  size_in_gbs         = 50
  
  # Balanced performance (10 VPUs) is covered by Free Tier
  vpus_per_gb         = 10 
}

# Attach the volume to the Worker node
resource "oci_core_volume_attachment" "postgres_data_attachment" {
  attachment_type = "paravirtualized"
  instance_id     = oci_core_instance.k3s_worker.id
  volume_id       = oci_core_volume.postgres_data.id
  display_name    = "postgres-data-attachment"
}

# -----------------------------------------------------------------------------
# Backup Storage (Object Storage Bucket)
# -----------------------------------------------------------------------------
# We create an Object Storage bucket (using the Free Tier 10GB allocation).
# A Kubernetes CronJob will run pg_dump and upload the compressed backup here nightly.

# Fetch the globally unique namespace for your tenancy (required for buckets)
data "oci_objectstorage_namespace" "tenancy_namespace" {
  compartment_id = var.tenancy_ocid
}

resource "oci_objectstorage_bucket" "postgres_backups" {
  # We place the bucket in the parent project compartment, 
  # as it is a generic data asset and not compute/network specific.
  compartment_id = data.oci_identity_compartments.project.compartments[0].id 
  
  name           = lower("${var.project_name}-postgres-backups")
  namespace      = data.oci_objectstorage_namespace.tenancy_namespace.namespace
  
  # We use Standard tier since Free Tier offers 10GB Standard storage
  storage_tier   = "Standard"
  access_type    = "NoPublicAccess"
  
  versioning     = "Disabled"
}
