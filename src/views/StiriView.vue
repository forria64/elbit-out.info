<template>
  <div class="stiri">
    <ContentPage 
      :bannerImage="bannerImage"
      :title="$t('news.title')"
      content=""
      :showCTA="false"
    >
      <template #content>
        <div v-if="loading" class="stiri-content">
          <ContentBox variant="lead" class="loading-box">
            <p class="loading-text">{{ $t('news.loading') }}</p>
          </ContentBox>
        </div>

        <div v-else-if="error" class="stiri-content">
          <DirectusError />
        </div>

        <div v-else class="stiri-content">
          <article 
            v-for="article in articles" 
            :key="article.id" 
            :data-article-id="article.id"
            class="news-article"
            :class="{ 'is-expanded': article.expanded }"
          >
            <div v-if="article.image" class="article-image-wrapper">
              <img 
                :src="article.image" 
                :alt="article.title"
                class="article-image"
                loading="lazy"
              />
              <div class="image-overlay"></div>
            </div>

            <div class="article-body">
              <h2 class="article-title">{{ article.title }}</h2>
              <p class="article-date">{{ formatDate(article.date) }}</p>
              
              <div 
                v-if="article.expanded"
                class="article-content"
                v-html="formatContent(article.content)"
              ></div>
              
              <button 
                v-if="article.content.length > 200"
                @click="toggleExpand(article)"
                class="read-more-btn"
              >
                {{ article.expanded ? $t('news.readLess') : $t('news.readMore') }}
                <span class="arrow">{{ article.expanded ? '▲' : '▶' }}</span>
              </button>
            </div>
          </article>

          <ContentBox v-if="articles.length === 0" variant="lead" class="empty-box">
            <p class="empty-text">{{ $t('news.empty') }}</p>
          </ContentBox>
        </div>
      </template>
    </ContentPage>
  </div>
</template>

<script>
import ContentPage from '@/components/ContentPage.vue'
import ContentBox from '@/components/ContentBox.vue'
import DirectusError from '@/components/DirectusError.vue'
import { newsService } from '@/services/api.js'
import DOMPurify from 'dompurify'

export default {
  name: 'StiriView',
  components: {
    ContentPage,
    ContentBox,
    DirectusError
  },
  data() {
    return {
      articles: [],
      loading: true,
      error: null
    }
  },
  computed: {
    bannerImage() {
      return new URL('../assets/banners/EObanner_stiri.webp', import.meta.url).href
    }
  },
  async created() {
    await this.fetchArticles()
  },
  watch: {
    // Refetch on locale change so articles match the active language
    '$i18n.locale'() {
      this.fetchArticles()
    }
  },
  methods: {
    async fetchArticles() {
      this.loading = true
      this.error = null
      
      try {
        const fetchedArticles = await newsService.getAllArticles(this.$i18n.locale)
        
        this.articles = fetchedArticles.map(article => ({
          ...article,
          expanded: false
        }))
      } catch (err) {
        console.error('Failed to fetch articles from CMS:', err)
        this.error = err.response?.statusText || err.message || 'Eroare de conexiune'
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      // Directus timestamps include T09:48:53 noise — split it off so dates stay human-readable
      const dateOnly = dateString.split('T')[0]
      const [year, month, day] = dateOnly.split('-')
      return `${day}.${month}.${year}`
    },
    formatContent(content) {
      if (!content) return ''
      // Directus is first-party, but v-html is still an XSS surface — sanitize everything that touches innerHTML
      const raw = content
        .split('\n\n')
        .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
        .join('')
      return DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } })
    },
    toggleExpand(article) {
      const wasExpanded = article.expanded
      const targetId = article.id
      
      this.articles.forEach(a => {
        a.expanded = false
      })
      
      if (!wasExpanded) {
        article.expanded = true
        
        // DOM patch is async — wait for Vue to finish before measuring coordinates.
        // Grid reflow has no transition, so scroll targets are immediately accurate.
        this.$nextTick(() => {
          const el = document.querySelector(`[data-article-id="${targetId}"]`)
          if (!el) return

          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      }
    }
  }
}
</script>

<style scoped>
.stiri {
  width: 100%;
  min-height: 100vh;
}

.stiri-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5em;
}

@media (min-width: 900px) {
  .stiri-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 3em;
  }
}

.news-article {
  background: transparent;
  border: 2px solid var(--color-black);
  overflow: hidden;
  /* Animate only visual polish — grid reflow must be instantaneous or scrollIntoView lands on stale coordinates */
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  /* Offset for scrollIntoView — account for the fixed navbar at each breakpoint */
  scroll-margin-top: 5vh;
}

@media (max-width: 1024px) {
  .news-article {
    scroll-margin-top: 7vh;
  }
}

@media (max-width: 768px) {
  .news-article {
    scroll-margin-top: 50px; /* nav min-height (45px) plus breathing room */
  }
}

.news-article.is-expanded {
  grid-column: 1 / -1;
  transform: scale(1.01);
}

.news-article:hover {
  transform: translateY(-4px);
  box-shadow: 8px 8px 0 var(--color-red);
}

.news-article:last-child {
  margin-bottom: 0;
}

.article-image-wrapper {
  position: relative;
  width: 100%;
  height: 0;
  /* padding-bottom trick — intrinsic 16:9 ratio without knowing the actual image dimensions */
  padding-bottom: 56.25%;
  overflow: hidden;
  background: var(--color-black);
  transition: padding-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.news-article.is-expanded .article-image-wrapper {
  padding-bottom: 30%;
}

.article-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-article:hover .article-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3) 100%);
  pointer-events: none;
}

.article-body {
  padding: 2em;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-title {
  font-family: 'Play', Arial, sans-serif;
  font-weight: bold;
  font-size: clamp(22px, 3vw, 28px);
  color: var(--color-black);
  margin-bottom: 0.5em;
  text-align: left;
  line-height: 1.3;
}

.article-date {
  font-family: 'Atkinson Hyperlegible', Arial, sans-serif;
  font-size: clamp(13px, 1.1vw, 15px);
  color: var(--color-red);
  font-weight: bold;
  margin-bottom: 1.2em;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.article-content {
  font-family: 'Atkinson Hyperlegible', Arial, sans-serif;
  font-size: clamp(15px, 1.3vw, 17px);
  line-height: 1.8;
  color: var(--color-black);
  text-align: left;
  margin-bottom: 2em;
}

.article-content :deep(p) {
  margin-bottom: 1em;
}

.article-content :deep(p:last-child) {
  margin-bottom: 0;
}

/* margin-top:auto pins this to the card bottom via flexbox — consistent alignment regardless of content length */
.read-more-btn {
  margin-top: auto;
  margin-left: auto;
  padding: 0.8em 1.5em;
  background: var(--color-red);
  color: white;
  border: 2px solid var(--color-black);
  font-family: 'Play', Arial, sans-serif;
  font-weight: bold;
  font-size: clamp(13px, 1.1vw, 15px);
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5em;
  width: fit-content;
}

.read-more-btn:hover {
  background: var(--color-black);
  transform: translateX(4px);
}

.read-more-btn .arrow {
  font-size: 0.8em;
  font-weight: bold;
  color: white;
  transition: transform 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0.9em;
  height: 0.9em;
}

.loading-box {
  text-align: center;
  padding: 3em 2em;
}

.loading-text {
  font-family: 'Atkinson Hyperlegible', Arial, sans-serif;
  font-size: clamp(16px, 1.5vw, 18px);
  color: var(--color-black);
  font-style: italic;
}



.empty-box {
  text-align: center;
  padding: 3em 2em;
}

.empty-text {
  font-family: 'Atkinson Hyperlegible', Arial, sans-serif;
  font-size: clamp(16px, 1.5vw, 18px);
  color: var(--color-black);
  font-style: italic;
}

@media (max-width: 768px) {
  .stiri-content {
    padding: 30px 10px;
    gap: 2em;
  }

  .article-body {
    padding: 1.5em;
  }

}

/* Full-width grid span so these never sit beside article cards */
.loading-box,
.empty-box {
  grid-column: 1 / -1;
}
</style>