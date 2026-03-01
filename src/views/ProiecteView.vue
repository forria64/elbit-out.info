<template>
  <div class="proiecte">
    <ContentPage 
      :bannerImage="bannerImage"
      :title="pageTitle"
      content=""
      :showCTA="false"
    >
      <template #content>
        <div v-if="loading" class="proiecte-content">
          <ContentBox variant="lead" class="loading-box">
            <p class="loading-text">{{ $t('projects.loading') }}</p>
          </ContentBox>
        </div>

        <div v-else-if="error" class="proiecte-content">
          <ContentBox variant="warning" class="error-box">
            <h2 class="error-title">{{ $t('projects.errorTitle') }}</h2>
            <p class="error-message">{{ $t('projects.errorMessage') }}</p>
          </ContentBox>
        </div>

        <div v-else-if="pageContent" class="proiecte-content">
          <div class="page-body" v-html="formatContent(pageContent)"></div>
        </div>

        <div v-else class="proiecte-content">
          <ContentBox variant="lead" class="empty-box">
            <p class="empty-text">{{ $t('projects.empty') }}</p>
          </ContentBox>
        </div>
      </template>
    </ContentPage>
  </div>
</template>

<script>
import ContentPage from '@/components/ContentPage.vue'
import ContentBox from '@/components/ContentBox.vue'
import { projectsPageService } from '@/services/api.js'
import DOMPurify from 'dompurify'

export default {
  name: 'ProiecteView',
  components: {
    ContentPage,
    ContentBox
  },
  data() {
    return {
      bannerUrl: null,
      cmsTitle: null,
      pageContent: null,
      loading: true,
      error: null
    }
  },
  computed: {
    bannerImage() {
      if (this.bannerUrl) return this.bannerUrl
      return new URL('../assets/banners/EObanner_proiecte.webp', import.meta.url).href
    },
    pageTitle() {
      return this.cmsTitle || this.$t('projects.title')
    }
  },
  async created() {
    await this.fetchPage()
  },
  watch: {
    '$i18n.locale'() {
      this.fetchPage()
    }
  },
  methods: {
    async fetchPage() {
      this.loading = true
      this.error = null

      try {
        const meta = await projectsPageService.getPageMeta(this.$i18n.locale)
        this.cmsTitle = meta.title
        this.pageContent = meta.content
        if (meta.banner) {
          this.bannerUrl = meta.banner
        }
      } catch (err) {
        console.error('Failed to fetch project page from CMS:', err)
        this.error = true
      } finally {
        this.loading = false
      }
    },
    formatContent(content) {
      if (!content) return ''
      const raw = content
        .split('\n\n')
        .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
        .join('')
      return DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } })
    }
  }
}
</script>

<style scoped>
.proiecte {
  width: 100%;
  min-height: 100vh;
}

.proiecte-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-body {
  font-family: 'Atkinson Hyperlegible', Arial, sans-serif;
  font-size: clamp(15px, 1.3vw, 17px);
  line-height: 1.8;
  color: var(--color-black);
  text-align: left;
}

.page-body :deep(p) {
  margin-bottom: 1em;
}

.page-body :deep(p:last-child) {
  margin-bottom: 0;
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

.error-box {
  text-align: center;
  padding: 3em 2em;
}

.error-title {
  font-family: 'Play', Arial, sans-serif;
  font-weight: bold;
  font-size: clamp(20px, 2.5vw, 24px);
  color: var(--color-red);
  margin-bottom: 1em;
}

.error-message {
  font-family: 'Atkinson Hyperlegible', Arial, sans-serif;
  font-size: clamp(15px, 1.3vw, 17px);
  color: var(--color-black);
  margin-bottom: 1em;
  line-height: 1.6;
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
  .proiecte-content {
    padding: 30px 10px;
  }
}
</style>
