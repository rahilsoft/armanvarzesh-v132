
group "default" {
  targets = [
    "api-gateway",
    "nutrition-service",
    "activities-service",
    "challenges-service",
    "courses-service",
    "kpis-service",
    "affiliate-service",
    "inbox-service",
    "assessments-service",
    "rewards-service",
    "medical-service"
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

target "nutrition-service" {
  inherits = ["base"]
  context = "."
  dockerfile = "services/nutrition-service/Dockerfile"
  tags = ["${REGISTRY}/${OWNER}/av90-nutrition:${TAG}"]
}

target "activities-service" {
  inherits = ["base"]
  context = "."
  dockerfile = "services/activities-service/Dockerfile"
  tags = ["${REGISTRY}/${OWNER}/av90-activities:${TAG}"]
}

target "challenges-service" {
  inherits = ["base"]
  context = "."
  dockerfile = "services/challenges-service/Dockerfile"
  tags = ["${REGISTRY}/${OWNER}/av90-challenges:${TAG}"]
}

target "courses-service" {
  inherits = ["base"]
  context = "."
  dockerfile = "services/courses-service/Dockerfile"
  tags = ["${REGISTRY}/${OWNER}/av90-courses:${TAG}"]
}

target "kpis-service" {
  inherits = ["base"]
  context = "."
  dockerfile = "services/kpis-service/Dockerfile"
  tags = ["${REGISTRY}/${OWNER}/av90-kpis:${TAG}"]
}

target "affiliate-service" {
  inherits = ["base"]
  context = "."
  dockerfile = "services/affiliate-service/Dockerfile"
  tags = ["${REGISTRY}/${OWNER}/av90-affiliate:${TAG}"]
}

target "inbox-service" {
  inherits = ["base"]
  context = "."
  dockerfile = "services/inbox-service/Dockerfile"
  tags = ["${REGISTRY}/${OWNER}/av90-inbox:${TAG}"]
}

target "assessments-service" {
  inherits = ["base"]
  context = "."
  dockerfile = "services/assessments-service/Dockerfile"
  tags = ["${REGISTRY}/${OWNER}/av90-assessments:${TAG}"]
}

target "rewards-service" {
  inherits = ["base"]
  context = "."
  dockerfile = "services/rewards-service/Dockerfile"
  tags = ["${REGISTRY}/${OWNER}/av90-rewards:${TAG}"]
}

target "medical-service" {
  inherits = ["base"]
  context = "."
  dockerfile = "services/medical-service/Dockerfile"
  tags = ["${REGISTRY}/${OWNER}/av90-medical:${TAG}"]
}
