
#!/usr/bin/env bash
# Label namespace for sidecar injection
NS="${1:-default}"
kubectl label ns "$NS" istio-injection=enabled --overwrite
