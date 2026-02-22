/**
 * Decode the base64-encoded contact email — anti-harvesting measure
 * that executes client-side only, where the bots can't scrape it.
 * The obfuscation is thin but effective against the automated crawlers
 * that trawl production markup for mailto: targets.
 *
 * @returns {{ display: string, href: string }}
 */
const ENCODED_EMAIL = 'Y29udGFjdEBlbGJpdC1vdXQuaW5mbw=='

export function decodeContactEmail() {
  try {
    const decoded = atob(ENCODED_EMAIL)
    return { display: decoded, href: `mailto:${decoded}` }
  } catch (e) {
    console.error('[Email] Decode failure — obfuscation layer compromised:', e)
    return { display: 'contact', href: '#' }
  }
}
