output "postgres_container" {
  description = "Name of the PostgreSQL container"
  value       = docker_container.postgres.name
}

output "backend_url" {
  description = "Host URL for the backend API"
  value       = "http://localhost:${var.backend_host_port}"
}

output "frontend_url" {
  description = "Host URL for the frontend"
  value       = "http://localhost:${var.frontend_host_port}"
}
