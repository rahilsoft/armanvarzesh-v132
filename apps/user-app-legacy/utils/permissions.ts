
export enum Permission {
  VIEW_WORKOUTS = "view_workouts",
  EDIT_PROFILE = "edit_profile",
  ACCESS_MARKETPLACE = "access_marketplace"
}
export function hasPermission(user, perm: Permission): boolean {
  if (!user?.permissions) return false;
  return user.permissions.includes(perm);
}
