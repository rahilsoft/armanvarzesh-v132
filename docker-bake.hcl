
group "default" {
  targets = [
    "api-gateway",
    "activities-service"
  ]
}

variable "REGISTRY" { default = "ghcr.io" }
variable "OWNER" { default = "owner" }
variable "TAG" { default = "latest" }

target "base" { platforms = ["linux/amd64"] }

target "api-gateway" {
  inherits = ["base"]
  context = "."
  dockerfile = "services/api-gateway/Dockerfile"
  tags = ["${REGISTRY}/${OWNER}/av90-gateway:${TAG}"]
}

target "activities-service" {
  inherits = ["base"]
  context = "."
  dockerfile = "services/activities-service/Dockerfile"
  tags = ["${REGISTRY}/${OWNER}/av90-activities:${TAG}"]
}

