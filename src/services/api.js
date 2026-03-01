import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://press.elbit-out.info'

const api = axios.create({
  baseURL: `${API_BASE_URL}/items`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Error handling interceptor — structured context so failures tell us something useful
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
   * Fetch all articles, sorted by ID descending (newest first)
   * Supports both simple and translations-based schemas
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
        
        // Fetch all translations and filter client-side (more reliable than deep filtering)
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
        // Fallback for single-language Directus installs — no translations collection needed
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

export const projectsPageService = {
  /**
   * Fetch the projects page singleton — holds page title, nav label, banner, and content.
   * Directus collection: projects_page (singleton)
   * @param {string} locale - Language code ('ro', 'en')
   * @returns {Promise<{title: string|null, navLabel: string|null, banner: string|null, content: string|null}>}
   */
  async getPageMeta(locale = null) {
    try {
      const localeMap = { 'ro': 'ro-RO', 'en': 'en-US' }
      const directusLocale = localeMap[locale] || 'ro-RO'

      const response = await api.get('/projects_page', {
        params: {
          fields: 'banner,translations.title,translations.nav_label,translations.content,translations.languages_code'
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
        banner: data?.banner ? `${API_BASE_URL}/assets/${data.banner}` : null
      }
    } catch (error) {
      // Non-critical — view falls back to i18n defaults
      console.warn('[API] Failed to fetch projects page meta:', error.message)
      return { title: null, navLabel: null, content: null, banner: null }
    }
  }
}

export default api
