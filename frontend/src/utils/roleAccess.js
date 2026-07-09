// Lightweight, UI-only role gating. NOT enforced by RLS - a determined user could still
// hit the underlying Supabase tables directly with the same access the owner/manager has,
// since fine-grained per-role RLS was explicitly deferred as a follow-up. This only
// controls what the app's own UI shows/allows navigating to.
//
// Owner and manager are unrestricted (any role not listed below gets full access).
export const ROLE_ALLOWED_PREFIXES = {
  cashier: ['/sales', '/warehouse', '/product', '/report'],
  purchasing: ['/supplier', '/order', '/warehouse', '/product'],
};

// Accessible to every role regardless of the restrictions above (personal account
// settings, not business data).
const ALWAYS_ALLOWED_PREFIXES = ['/settings', '/notifications'];

// Where a restricted role lands after login / when bounced off a page they can't see.
export const ROLE_DEFAULT_PATH = {
  cashier: '/sales',
  purchasing: '/order',
};

export function hasRouteAccess(role, path) {
  if (ALWAYS_ALLOWED_PREFIXES.some((prefix) => path.startsWith(prefix))) return true;
  const allowed = ROLE_ALLOWED_PREFIXES[role];
  if (!allowed) return true; // owner/manager/unrecognized role: unrestricted
  return allowed.some((prefix) => path.startsWith(prefix));
}
