terraform {
  required_version = ">= 1.5.0"

  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

# Shared network for the application stack
resource "docker_network" "app" {
  name = "tiket-network"
}

# Persistent volume for PostgreSQL data
resource "docker_volume" "postgres_data" {
  name = "postgres_data"
}

resource "docker_image" "postgres" {
  name         = "postgres:15-alpine"
  keep_locally = true
}

resource "docker_image" "backend" {
  name         = "tiket-backend:local"
  keep_locally = true

  build {
    context    = "../backend"
    dockerfile = "Dockerfile"
  }
}

resource "docker_image" "frontend" {
  name         = "tiket-frontend:local"
  keep_locally = true

  build {
    context    = "../frontend"
    dockerfile = "Dockerfile"
  }
}

resource "docker_container" "postgres" {
  name  = "tiket-postgres"
  image = docker_image.postgres.image_id

  restart = "unless-stopped"

  env = [
    "POSTGRES_USER=${var.db_user}",
    "POSTGRES_PASSWORD=${var.db_password}",
    "POSTGRES_DB=${var.db_name}"
  ]

  ports {
    internal = 5432
    external = var.postgres_host_port
  }

  networks_advanced {
    name = docker_network.app.name
  }

  mounts {
    target = "/var/lib/postgresql/data"
    source = docker_volume.postgres_data.name
    type   = "volume"
  }
}

resource "docker_container" "backend" {
  name  = "tiket-backend"
  image = docker_image.backend.image_id

  depends_on = [docker_container.postgres]
  restart    = "unless-stopped"

  env = concat([
    "PORT=${var.backend_port}",
    "DB_HOST=${docker_container.postgres.name}",
    "DB_USER=${var.db_user}",
    "DB_PASSWORD=${var.db_password}",
    "DB_NAME=${var.db_name}",
    "DB_PORT=${var.db_port}",
    "JWT_SECRET=${var.jwt_secret}",
    "FRONTEND_URL=${var.frontend_url}",
    "FIREBASE_CREDENTIALS_PATH=${var.firebase_credentials_path}"
  ], [
    for key, value in var.backend_extra_env : "${key}=${value}"
  ])

  ports {
    internal = var.backend_port
    external = var.backend_host_port
  }

  networks_advanced {
    name = docker_network.app.name
  }
}

resource "docker_container" "frontend" {
  name  = "tiket-frontend"
  image = docker_image.frontend.image_id

  depends_on = [docker_container.backend]
  restart    = "unless-stopped"

  env = [
    "PORT=80"
  ]

  ports {
    internal = 80
    external = var.frontend_host_port
  }

  networks_advanced {
    name = docker_network.app.name
  }
}
