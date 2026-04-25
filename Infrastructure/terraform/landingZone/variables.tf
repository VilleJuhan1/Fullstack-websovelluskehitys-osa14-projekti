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
}

variable "region" {
  description = "The OCI region (e.g., eu-frankfurt-1)."
  type        = string
}

variable "budget_amount" {
  description = "Monthly budget amount in tenancy currency to alert on (to prevent unexpected Free Tier charges)"
  type        = number
  default     = 10 
}

variable "project_name" {
  description = "The name of the project, used to label compartments, groups, and policies."
  type        = string
  default     = "Thesis-project"
}
