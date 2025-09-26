# Rollback Runbook
1) تعیین نسخه سالم (tag یا commit)
2) توقف ترافیک (drain)
3) بازگشت نسخه deployment
4) اجرای مهاجرت برگشتی DB (در صورت نیاز)
5) اعتبارسنجی smoke و re-enable
