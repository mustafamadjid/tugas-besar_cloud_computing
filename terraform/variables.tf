variable "db_user" {
  description = "PostgreSQL username"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "PostgreSQL password"
  type        = string
  default     = "postgres"
  sensitive   = true
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "tiketdb"
}

variable "db_port" {
  description = "Database port exposed inside the network"
  type        = number
  default     = 5432
}

variable "postgres_host_port" {
  description = "Host port for PostgreSQL"
  type        = number
  default     = 5432
}

variable "backend_port" {
  description = "Port exposed by the backend container"
  type        = number
  default     = 8080
}

variable "backend_host_port" {
  description = "Host port to access the backend"
  type        = number
  default     = 8080
}

variable "frontend_host_port" {
  description = "Host port to access the frontend"
  type        = number
  default     = 3000
}

variable "jwt_secret" {
  description = "Secret used for signing JWT tokens"
  type        = string
  default     = "dev-secret"
  sensitive   = true
}

variable "frontend_url" {
  description = "Public URL of the frontend used by the backend for CORS"
  type        = string
  default     = "http://localhost:3000"
}

variable "firebase_credentials_path" {
  description = "Path to Firebase credentials file mounted inside the backend container"
  type        = string
  default     = ""
}

variable "backend_extra_env" {
  description = "Additional environment variables for the backend container"
  type        = map(string)
  default     = {}
}
