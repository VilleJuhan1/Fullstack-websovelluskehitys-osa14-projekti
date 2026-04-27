# Generated with Gemini 3.1 Pro

variable "tenancy_ocid" {
  description = "The tenancy OCID."
  type        = string
}

variable "user_ocid" {
  description = "The user OCID. For CI/CD this is the Service Account OCID."
  type        = string
}

variable "fingerprint" {
  description = "The fingerprint for the user's API key."
  type        = string
}

variable "private_key_path" {
  description = "The path to the user's private API key."
  type        = string
  default     = null
}

variable "private_key" {
  description = "The actual content of the private API key (used in CI/CD)"
  type        = string
  sensitive   = true
  default     = null
}

variable "region" {
  description = "The OCI region (e.g., eu-frankfurt-1)."
  type        = string
}

variable "project_name" {
  description = "The name of the project (used for querying the compartment)"
  type        = string
}
