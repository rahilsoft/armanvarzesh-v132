
export enum Permission {
  VIEW_USERS = "view_users",
  EDIT_USERS = "edit_users",
  VIEW_COACHES = "view_coaches",
  MANAGE_PAYMENTS = "manage_payments",
  VIEW_ANALYTICS = "view_analytics"
}
export function hasPermission(user, perm: Permission): boolean {
  if (!user?.permissions) return false;
  return user.permissions.includes(perm);
}
