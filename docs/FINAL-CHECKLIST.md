
# Final Checklist (Go-Live)

- [ ] All migrations applied & seeds loaded for demo
- [ ] Helm values (secrets endpoints, URLs) set for cluster
- [ ] CI gates green: tests, coverage, SBOM, a11y/perf smoke
- [ ] PR Preview env healthy; teardown policy defined
- [ ] NetworkPolicies applied; PodSecurity labels set
- [ ] JWKS/Device-bind configured in Gateway
- [ ] Observability: Grafana dashboards, Alerts, Tempo/Loki datasources
- [ ] Runbook shared with On-call
