# Generated with Gemini 3.1 Pro
variable "tenancy_ocid" {
  description = "The tenancy OCID."
  type        = string
}

variable "user_ocid" {
  description = "The user OCID."
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
  description = "The actual content of the private API key"
  type        = string
  sensitive   = true
  default     = null
}

variable "region" {
  description = "The OCI region (e.g., eu-frankfurt-1)."
  type        = string
}

variable "projects" {
  description = "A map of projects with their respective configurations."
  type = map(object({
    name                  = string
    budget_amount         = number
    service_account_email = string
  }))
}
