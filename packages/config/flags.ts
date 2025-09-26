type Flags = {
  payments_api: boolean;
  livekit_enabled: boolean;
  chat_ws_real: boolean;
  media_signed_upload: boolean;
  vip_wallet_guard: boolean;
  i18n_audit_enforced: boolean;
};
let flags: Flags = {
  payments_api: JSON.parse(process.env.NEXT_PUBLIC_FF_PAYMENTS_API || 'true'),
  livekit_enabled: JSON.parse(process.env.NEXT_PUBLIC_FF_LIVEKIT || 'false'),
  chat_ws_real: JSON.parse(process.env.NEXT_PUBLIC_FF_CHAT_WS || 'false'),
  media_signed_upload: JSON.parse(process.env.NEXT_PUBLIC_FF_MEDIA_UPLOAD || 'false'),
  vip_wallet_guard: JSON.parse(process.env.NEXT_PUBLIC_FF_VIP_WALLET || 'true'),
  i18n_audit_enforced: JSON.parse(process.env.NEXT_PUBLIC_FF_I18N_AUDIT || 'false'),
};
export function getFlags(){ return flags; }
export function setFlags(next: Partial<Flags>){ flags = { ...flags, ...next }; }
