# Placeholder: configure Kubernetes provider via KUBECONFIG
provider "kubernetes" {}

# Example: Namespace creation (if not using Helm chart)
resource "kubernetes_namespace" "armanfit" {
  metadata { name = "armanfit" }
}