export const CLERK_SESSION_COOKIE_CANDIDATES = ["__session", "__clerk_db_jwt", "__client_uat"];

export function hasClerkSessionFromCookieLookup(
  getCookieValue: (name: string) => string | undefined,
): boolean {
  return CLERK_SESSION_COOKIE_CANDIDATES.some((name) => {
    const value = getCookieValue(name);
    return Boolean(value && value.length > 0);
  });
}
