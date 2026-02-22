<template>
  <div class="cine-suntem">
    <ContentPage
      :bannerImage="bannerImage"
      :title="$t('whoWeAre.title')"
      content=""
      :showCTA="false"
    >
      <template #content>
        <div class="cine-content">
          <ContentBox variant="lead">
            <p>{{ $t('whoWeAre.intro') }}</p>
            <p>{{ $t('whoWeAre.coordinated') }}</p>
            <p class="contact-info">
              <a :href="emailHref" class="button-common email-link" ref="emailLink">{{ $t('whoWeAre.email') }}</a>
            </p>
          </ContentBox>

          <section class="partners-section">
            <h2>{{ $t('whoWeAre.localPartners') }}</h2>
            <div class="partners-grid">
              <a
                v-for="(partner, index) in localPartners"
                :key="index"
                :href="decodeUrl(partner.url)"
                :target="partner.url ? '_blank' : undefined"
                :rel="partner.url ? 'noopener noreferrer' : undefined"
                class="partner-item"
                :class="{ 'no-link': !partner.url }"
              >
                <div v-if="partner.logo" class="partner-logo">
                  <img :src="getLogoPath(partner.logo)" :alt="getPartnerName(partner)" />
                </div>
                <div class="partner-name">{{ getPartnerName(partner) }}</div>
              </a>
            </div>

            <h2>{{ $t('whoWeAre.internationalPartners') }}</h2>
            <div class="partners-grid">
              <a
                v-for="(partner, index) in internationalPartners"
                :key="index"
                :href="decodeUrl(partner.url)"
                :target="partner.url ? '_blank' : undefined"
                :rel="partner.url ? 'noopener noreferrer' : undefined"
                class="partner-item"
                :class="{ 'no-link': !partner.url }"
              >
                <div v-if="partner.logo" class="partner-logo">
                  <img :src="getLogoPath(partner.logo)" :alt="getPartnerName(partner)" />
                </div>
                <div class="partner-name">{{ getPartnerName(partner) }}</div>
              </a>
            </div>
          </section>
        </div>
      </template>
    </ContentPage>
  </div>
</template>

<script>
import ContentPage from '@/components/ContentPage.vue'
import ContentBox from '@/components/ContentBox.vue'
import partnersData from '@/data/partners.json'
import { decodeContactEmail } from '@/utils/email.js'

export default {
  name: 'CineSuntemView',
  components: {
    ContentPage,
    ContentBox
  },
  data() {
    return {
      emailHref: '',
      localPartners: partnersData.localPartners,
      internationalPartners: partnersData.internationalPartners
    }
  },
  computed: {
    bannerImage() {
      return new URL('../assets/banners/banner_cine_suntem.webp', import.meta.url).href
    }
  },
  mounted() {
    // Decode email on client side — bot-proof delivery
    const { href } = decodeContactEmail()
    this.emailHref = href
  },
  methods: {
    decodeUrl(encodedUrl) {
      if (!encodedUrl) return null
      try {
        return atob(encodedUrl)
      } catch (e) {
        console.error('Failed to decode URL:', e)
        return null
      }
    },
    getPartnerName(partner) {
      // Serve the right name for the right locale — no one reads Romanian abroad
      if (this.$i18n.locale === 'en' && partner.nameEn) {
        return partner.nameEn
      }
      return partner.name
    },
    getLogoPath(logoFilename) {
      if (!logoFilename) return null
      try {
        return new URL(`../assets/partners/${logoFilename}`, import.meta.url).href
      } catch (e) {
        console.error('Failed to load logo:', logoFilename, e)
        return null
      }
    }
  }
}
</script>

<style scoped>
.cine-suntem {
  width: 100%;
  min-height: 100vh;
}

.cine-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.cine-content section {
  margin-bottom: 3em;
}

.cine-content p {
  font-family: 'Atkinson Hyperlegible', Arial, sans-serif;
  font-size: clamp(15px, 1.3vw, 18px);
  line-height: 1.8;
  color: var(--color-black);
  margin-bottom: 1.5em;
  text-align: left;
}

.cine-content h2 {
  font-family: 'Play', Arial, sans-serif;
  font-weight: bold;
  font-size: clamp(18px, 2vw, 24px);
  color: var(--color-black);
  margin-top: 2.5em;
  margin-bottom: 1.5em;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2em;
  margin-bottom: 3em;
}

.partner-item {
  position: relative;
  background: white;
  border: 2px solid var(--color-black);
  padding: 0;
  text-align: center;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.partner-item.no-link {
  cursor: default;
}

.partner-item:hover:not(.no-link) {
  border-color: var(--color-red);
  transform: translateY(-5px) scale(1.08);
  box-shadow: 0 5px 15px rgba(250, 29, 29, 0.3);
}

.partner-logo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.partner-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: all 0.3s ease;
}

/* Dark overlay — dims logo so white text stays readable, lifts on hover */
.partner-logo::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  transition: all 0.3s ease;
  z-index: 2;
}

.partner-item:hover .partner-logo::after {
  background: rgba(0, 0, 0, 0);
}

.partner-name {
  position: relative;
  z-index: 3;
  font-family: 'Play', Arial, sans-serif;
  font-size: clamp(13px, 1.1vw, 15px);
  line-height: 1.3;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  padding: 1.5rem;
  opacity: 1;
  transition: all 0.3s ease;
}

.partner-item:hover .partner-name {
  opacity: 0;
}

@media (max-width: 768px) {
  .cine-content {
    padding: 30px 0;
  }

  .partners-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.5em;
  }

  .partner-name {
    font-size: clamp(20px, 10vw, 20px);
    padding: 1.2rem;
    letter-spacing: 0.4px;
  }
}

.contact-info {
  text-align: center;
  margin-top: 2em;
}

.contact-info .email-link {
  display: block;
  width: 100%;
  text-align: center;
}
</style>