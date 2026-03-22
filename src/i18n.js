import { createI18n } from 'vue-i18n'
import ro from './locales/ro.json'
import en from './locales/en.json'

const LOCALE_STORAGE_KEY = 'elbit-out-locale'

// Saved preference wins. Otherwise Romanian — the primary audience — until IP check resolves.
const getStartingLocale = () => {
  return localStorage.getItem(LOCALE_STORAGE_KEY) || 'ro'
}

/**
 * Sniff the user's country by IP and assign a language — Romania gets Romanian,
 * everywhere else gets English. Backs off immediately if the user already
 * made a conscious choice via the navbar toggle.
 *
 * ipapi.co/country_code/ returns a two-letter ISO code as plain text.
 * 3-second timeout so a sluggish CDN doesn't hold the entire experience hostage.
 *
 * @param {import('vue-i18n').I18n} i18nInstance
 */
export async function detectLocaleByIP(i18nInstance) {
  // Respect explicit user choice — localStorage means they picked it themselves
  if (localStorage.getItem(LOCALE_STORAGE_KEY)) return

  try {
    const response = await fetch('https://ipapi.co/country_code/', {
      signal: AbortSignal.timeout(3000)
    })
    if (!response.ok) return

    const countryCode = (await response.text()).trim().toUpperCase()
    const detectedLocale = countryCode === 'RO' ? 'ro' : 'en'

    if (i18nInstance.global.locale.value !== detectedLocale) {
      i18nInstance.global.locale.value = detectedLocale
    }
  } catch (error) {
    // Network fail, timeout, or blocked — Romanian default stands
    console.warn('[i18n] IP locale detection failed, keeping default:', error.message)
  }
}

const i18n = createI18n({
  legacy: false,
  locale: getStartingLocale(),
  fallbackLocale: 'ro',
  messages: { ro, en },
  globalInjection: true
})

export default i18n
