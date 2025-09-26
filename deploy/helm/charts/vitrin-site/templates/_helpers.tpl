{- define "vitrin-site.name" -}
vitrin-site
{- end -}
{- define "vitrin-site.fullname" -}
{- printf "%s-%s" .Release.Name "vitrin-site" | trunc 63 | trimSuffix "-" -}
{- end -}
