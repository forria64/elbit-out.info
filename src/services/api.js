import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://press.elbit-out.info'

const api = axios.create({
  baseURL: `${API_BASE_URL}/items`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Naked errors are useless testimony — pin the URL, method, and timestamp to every failure before it leaves this room
api.interceptors.response.use(
  response => response,
  error => {
    const context = {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      timestamp: new Date().toISOString(),
      message: error.response?.data?.errors?.[0]?.message || error.message
    }
    console.error('[API] Request failed:', context)
    return Promise.reject(error)
  }
)

export const newsService = {
  /**
   * Pull every published article, newest first. Two-language installs
   * get translation-filtered output; bare setups get the raw feed.
   * @param {string} locale - Language code ('ro', 'en') - optional for simple schema
   * @returns {Promise<Array>} Array of article objects
   */
  async getAllArticles(locale = null) {
    try {
      const useTranslations = locale !== null
      
      if (useTranslations) {
        const localeMap = {
          'ro': 'ro-RO',
          'en': 'en-US'
        }
        const directusLocale = localeMap[locale] || 'ro-RO'
        
        // Directus deep filtering on nested relations is unreliable — client-side matching is deterministic
        const response = await api.get('/articles', {
          params: {
            sort: '-id',
            limit: 100,
            filter: {
              status: { _eq: 'published' }
            },
            fields: 'id,date,status,image,translations.title,translations.content,translations.languages_code'
          }
        })
        
        return response.data.data.map(article => {
          const translation = article.translations?.find(
            t => t.languages_code === directusLocale
          ) || {}
          
          return {
            id: article.id,
            date: article.date,
            title: translation.title || `[${locale}] Translation missing`,
            content: translation.content || '',
            image: article.image ? `${API_BASE_URL}/assets/${article.image}` : null
          }
        })
      } else {
        // No translations table means the CMS speaks one language — go direct
        const response = await api.get('/articles', {
          params: {
            sort: '-id',
            fields: 'id,title,date,content,image',
            limit: 100,
            filter: {
              status: { _eq: 'published' }
            }
          }
        })
        
        return response.data.data.map(article => ({
          ...article,
          image: article.image ? `${API_BASE_URL}/assets/${article.image}` : null
        }))
      }
    } catch (error) {
      const context = { resource: 'articles', locale, timestamp: new Date().toISOString() }
      console.error('[API] Failed to fetch articles:', context, error.message)
      throw error
    }
  }
}

export const partnersService = {
  /**
   * Partners split by allegiance: local vs. international.
   * Sort order is whatever the CMS editor dragged them into. Translated per locale.
   * @param {string} locale - Language code ('ro', 'en')
   * @returns {Promise<{localPartners: Array, internationalPartners: Array}>}
   */
  async getAll(locale = 'ro') {
    const localeMap = { 'ro': 'ro-RO', 'en': 'en-US' }
    const directusLocale = localeMap[locale] || 'ro-RO'

    try {
      const response = await api.get('/partners', {
        params: {
          sort: 'sort',
          limit: -1,
          filter: {
            status: { _eq: 'published' }
          },
          fields: 'id,logo,link,type,translations.name,translations.languages_code'
        }
      })

      const partners = (response.data.data || []).map(partner => {
        const translation = partner.translations?.find(
          t => t.languages_code === directusLocale
        ) || {}

        return {
          name: translation.name || '',
          logo: partner.logo ? `${API_BASE_URL}/assets/${partner.logo}` : null,
          url: partner.link || null,
          type: partner.type || 'local'
        }
      })

      return {
        localPartners: partners.filter(p => p.type === 'local'),
        internationalPartners: partners.filter(p => p.type === 'international')
      }
    } catch (error) {
      const context = { resource: 'partners', locale, timestamp: new Date().toISOString() }
      console.error('[API] Failed to fetch partners:', context, error.message)
      throw error
    }
  }
}

export const projectsPageService = {
  /**
   * Singleton page — the entire projects overview lives in one Directus record.
   * Banner is language-agnostic; everything else is locale-filtered.
   * @param {string} locale - Language code ('ro', 'en')
   * @returns {Promise<{title: string|null, navLabel: string|null, banner: string|null, image: string|null, content: string|null}>}
   */
  async getPageMeta(locale = null) {
    const localeMap = { 'ro': 'ro-RO', 'en': 'en-US' }
    const directusLocale = localeMap[locale] || 'ro-RO'

    const response = await api.get('/projects_page', {
      params: {
        fields: 'banner,translations.title,translations.nav_label,translations.content,translations.image,translations.languages_code'
      }
    })

    const data = response.data.data
    const translation = data?.translations?.find(
      t => t.languages_code === directusLocale
    ) || {}

    return {
      title: translation.title || null,
      navLabel: translation.nav_label || null,
      content: translation.content || null,
      banner: data?.banner ? `${API_BASE_URL}/assets/${data.banner}` : null,
      image: translation.image ? `${API_BASE_URL}/assets/${translation.image}` : null
    }
  }
}

export default api
