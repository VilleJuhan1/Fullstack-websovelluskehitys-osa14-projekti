# Generated partially with Gemini 3.1 Pro and Gemini 3.5 Flash

# -----------------------------------------------------------------------------
# Database Storage (Block Volume)
# -----------------------------------------------------------------------------
# A 50GB block volume for storing persistent container data like postgresql, loki, prometheus etc.
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
# An object storage bucket for storing database backups
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

# -----------------------------------------------------------------------------
# Automated Block Volume Backups (OCI Always Free Compliant)
# -----------------------------------------------------------------------------
# Hybrid backup policy that retains both short and longterm backups from the kube-worker block volume (limit is 5 total in OCI free tier)
resource "oci_core_volume_backup_policy" "postgres_backup_policy" {
  compartment_id = data.oci_identity_compartments.compute.compartments[0].id
  display_name   = "${var.project_name}-postgres-hybrid-backup-policy"

  # Daily backups retained for 2 days (maximum 2 active backups)
  schedules {
    backup_type       = "INCREMENTAL"
    period            = "ONE_DAY"
    retention_seconds = 172800 # 2 days
  }

  # Weekly backups retained for 7 days (maximum 1 active backup)
  schedules {
    backup_type       = "INCREMENTAL"
    period            = "ONE_WEEK"
    retention_seconds = 604800 # 7 days
  }

  # Monthly backups retained for 30 days (maximum 1 active backup)
  schedules {
    backup_type       = "INCREMENTAL"
    period            = "ONE_MONTH"
    retention_seconds = 2592000 # 30 days
  }
}

# Attach the backup policy to the Postgres block volume
resource "oci_core_volume_backup_policy_assignment" "postgres_backup_policy_assignment" {
  asset_id  = oci_core_volume.postgres_data.id
  policy_id = oci_core_volume_backup_policy.postgres_backup_policy.id
}

