
    # Helm/K8s Productionization
    Date: 2025-08-12T11:45:25.662920Z

    ## Changes
    - Completed `values.yaml` in charts: image/ingress/resources/env/envFromSecretName/externalSecrets blocks
    - Added templates: `external-secret.yaml` and `secret-env.yaml` (per chart)
    - Replaced `api.example.com` with `api.armanvarzesh.com` in raw k8s manifests
    - Added sample `values.production.yaml` to backend chart

    ## Invalid YAML encountered
    - Handled invalid YAML by overwriting with structured defaults:
      - helm/armanfit-admin/values.yaml: while scanning a simple key
  in "helm/armanfit-admin/values.yaml", line 2, column 1
could not find expected ':'
  in "helm/armanfit-admin/values.yaml", line 3, column 1

