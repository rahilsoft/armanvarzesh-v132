{{- define "armanfit-backend.name" -}}
armanfit-backend
{{- end -}}

{{- define "armanfit-backend.fullname" -}}
{{ include "armanfit-backend.name" . }}
{{- end -}}
