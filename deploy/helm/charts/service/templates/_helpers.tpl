{- define "service.name" -}
service
{- end -}
{- define "service.fullname" -}
{- printf "%s-%s" .Release.Name "service" | trunc 63 | trimSuffix "-" -}
{- end -}
