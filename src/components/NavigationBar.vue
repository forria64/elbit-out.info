<template>
  <nav class="navigation-bar">
    <div class="nav-container">
      <div class="nav-logo">
        <router-link to="/" @click="handleNavClick">
          <img src="../assets/logo.png" alt="Elbit Out - Acasă" />
        </router-link>
      </div>
      
      <button class="mobile-menu-toggle" @click="toggleMobileMenu" :class="{ active: mobileMenuOpen }" aria-label="Menu" :aria-expanded="mobileMenuOpen">
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <div class="nav-links" :class="{ 'mobile-open': mobileMenuOpen }">
        <router-link to="/de-ce-elbit" class="nav-link" @click="handleNavClick">{{ $t('nav.whyElbit') }}</router-link>
        <router-link to="/stiri" class="nav-link" @click="handleNavClick">{{ $t('nav.news') }}</router-link>
        <router-link to="/ce-vrem" class="nav-link" @click="handleNavClick">{{ $t('nav.whatWeWant') }}</router-link>
        <router-link to="/sustine-campania" class="nav-link" @click="handleNavClick">{{ $t('nav.support') }}</router-link>
        <router-link to="/cine-suntem" class="nav-link" @click="handleNavClick">{{ $t('nav.whoWeAre') }}</router-link>
        <router-link to="/proiecte" class="nav-link" @click="handleNavClick">{{ projectsNavLabel }}</router-link>
        
        <div class="language-switcher">
          <button 
            @click="switchLanguage('ro')" 
            :class="{ active: currentLocale === 'ro' }"
            class="lang-btn"
            aria-label="Limba română"
          >
            RO
          </button>
          <span class="lang-separator">|</span>
          <button 
            @click="switchLanguage('en')" 
            :class="{ active: currentLocale === 'en' }"
            class="lang-btn"
            aria-label="English language"
          >
            EN
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { forceScrollToTop } from '@/utils/scroll.js'
import { projectsPageService } from '@/services/api.js'

export default {
  name: 'NavigationBar',
  setup() {
    const { locale } = useI18n()
    return { locale }
  },
  data() {
    return {
      mobileMenuOpen: false,
      touchStartX: 0,
      touchStartY: 0,
      cmsProjectsNavLabel: null
    }
  },
  computed: {
    currentLocale() {
      return this.locale
    },
    projectsNavLabel() {
      return this.cmsProjectsNavLabel || this.$t('nav.projects')
    }
  },
  watch: {
    '$route'() {
      this.mobileMenuOpen = false
      this.enableBodyScroll()
      forceScrollToTop()
    }
  },
  methods: {
    async fetchProjectsNavLabel() {
      const meta = await projectsPageService.getPageMeta(this.locale)
      this.cmsProjectsNavLabel = meta.navLabel
    },
    switchLanguage(lang) {
      this.locale = lang
      localStorage.setItem('elbit-out-locale', lang)
      this.fetchProjectsNavLabel()
      if (this.mobileMenuOpen) {
        this.closeMobileMenu()
      }
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
      this.toggleBodyScroll()
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false
      this.enableBodyScroll()
    },
    handleNavClick() {
      this.closeMobileMenu()
      forceScrollToTop()
    },
    openMobileMenu() {
      this.mobileMenuOpen = true
      this.disableBodyScroll()
    },
    disableBodyScroll() {
      document.body.style.overflow = 'hidden'
    },
    enableBodyScroll() {
      document.body.style.overflow = ''
    },
    toggleBodyScroll() {
      if (this.mobileMenuOpen) {
        this.disableBodyScroll()
      } else {
        this.enableBodyScroll()
      }
    },
    handleTouchStart(e) {
      this.touchStartX = e.touches[0].clientX
      this.touchStartY = e.touches[0].clientY
    },
    handleTouchEnd(e) {
      if (!this.touchStartX || !this.touchStartY) {
        return
      }

      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY
      const deltaX = touchEndX - this.touchStartX
      const deltaY = touchEndY - this.touchStartY

      // Only trigger if horizontal swipe is dominant (not vertical scroll)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
        if (deltaX > 0 && this.mobileMenuOpen) {
          // Swipe right while menu is open — dismiss it
          this.closeMobileMenu()
        } else if (deltaX < 0 && !this.mobileMenuOpen && window.innerWidth <= 768) {
          // Swipe left from right edge — 50px zone so thumbs actually hit it
          const rightEdgeZone = window.innerWidth - 50
          if (this.touchStartX > rightEdgeZone) {
            this.openMobileMenu()
          }
        }
      }

      this.touchStartX = 0
      this.touchStartY = 0
    }
  },
  mounted() {
    this.enableBodyScroll()
    this.fetchProjectsNavLabel()
    
    // Close mobile menu on window resize — stored reference so we can clean up
    this.handleResize = () => {
      if (window.innerWidth > 768) {
        this.mobileMenuOpen = false
        this.enableBodyScroll()
      }
    }
    window.addEventListener('resize', this.handleResize)

    document.addEventListener('touchstart', this.handleTouchStart, { passive: true })
    document.addEventListener('touchend', this.handleTouchEnd, { passive: true })
  },
  beforeUnmount() {
    // Clean up all event listeners — leave no trace
    window.removeEventListener('resize', this.handleResize)
    document.removeEventListener('touchstart', this.handleTouchStart)
    document.removeEventListener('touchend', this.handleTouchEnd)
  }
}
</script>

<style scoped>
.navigation-bar {
  width: 100%;
  background: white;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000; /* Must sit above video banner (z:4) and mobile menu overlay (z:9999) */
  border-bottom: 1px solid #eee;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px); /* Safari support */
  transition: all 0.3s ease;
}

.nav-container {
  max-width: 92vw; /* ~1180px on 1280px screen */
  height: 5vh;
  margin: 0 auto;
  padding: 0 4vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  position: relative;
  z-index: 10002; /* Above mobile menu overlay */
  margin-top: 0.3vh;
}

.nav-logo img {
  height: 5vh;
  width: auto;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2.3vw;
}

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 28px;
  height: 21px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.mobile-menu-toggle span {
  display: block;
  height: 2px;
  width: 100%;
  background: var(--color-black);
  transition: all 0.3s ease;
  transform-origin: center center;
}

.mobile-menu-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(1.5px, 8px); /* Offset corrects right skew from transform origin */
}

.mobile-menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(-0.5px, -6px); /* Offset corrects right skew from transform origin */
}

.nav-link {
  font-family: 'Play', Arial, sans-serif;
  font-weight: bold;
  font-size: clamp(12px, 1.1vw, 16px);
  text-transform: uppercase;
  color: var(--color-black);
  text-decoration: none;
  padding: 0.5vh 0; /* Tight padding keeps underline visually close to text */
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  white-space: nowrap;
  line-height: 1.2; /* Tighter line height keeps underline close */
}

.nav-link:hover {
  color: var(--color-red);
  border-bottom-color: var(--color-red);
}

.nav-link.router-link-exact-active {
  color: var(--color-red);
  border-bottom-color: var(--color-red);
}

.language-switcher {
  display: flex;
  align-items: center;
  gap: 0.5vw;
  font-family: 'Play', Arial, sans-serif;
  font-weight: bold;
  font-size: clamp(12px, 1.1vw, 16px);
}

.lang-btn {
  background: none;
  border: none;
  color: var(--color-black);
  cursor: pointer;
  padding: 0.3vh 0.5vw;
  transition: all 0.3s ease;
  font-family: 'Play', Arial, sans-serif;
  font-weight: bold;
  font-size: clamp(12px, 1.1vw, 16px);
  text-transform: uppercase;
}

.lang-btn:hover {
  color: var(--color-red);
}

.lang-btn.active {
  color: var(--color-red);
}

.lang-separator {
  color: var(--color-black);
  font-weight: normal;
}

@media (max-width: 1024px) {
  .nav-container {
    padding: 0 2vw;
    height: 7vh;
  }
  
  .nav-links {
    gap: 1.8vw;
  }
  
  .nav-link {
    font-size: clamp(11px, 1.4vw, 14px);
  }
}

@media (min-width: 769px) {
  .nav-container {
    height: 3.5vh;
    min-height: 45px; /* Floor for usability — touch targets below this become hostile */
  }
  
  .nav-logo img {
    height: 2.8vh;
    min-height: 28px;
  }
  
  .navigation-bar {
    /* will-change: transform prevents paint jank when banner video plays behind the nav */
    will-change: transform;
  }
}

@media (max-width: 768px) {
  .nav-container {
    justify-content: space-between;
    height: 4vh;
    padding: 0vh 3vw;
  }
  
  .nav-logo img {
    height: 3.5vh;
    min-height: 32px;
    margin-top: 0.4vh;
  }
  
  .mobile-menu-toggle {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 20px; /* Slightly oversized for a cleaner X transform */
    height: 16px;
    z-index: 10001; /* Higher than mobile menu to always be clickable */
    margin-top: 0.4vh;
  }
  
  .mobile-menu-toggle span {
    height: 2px;
  }
  
  .nav-links {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3vh; /* Reduced gap between links */
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 9999;
  }
  
  .nav-links.mobile-open {
    transform: translateX(0);
  }
  
  .nav-link {
    font-size: clamp(14px, 3vw, 18px);
    padding: 1.5vh 3vw;
    text-align: center;
    border: 2px solid transparent;
    border-radius: 8px;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.9);
  }
  
  .nav-link:hover,
  .nav-link.router-link-exact-active {
    background: var(--color-red);
    color: white;
    border-color: var(--color-red);
    transform: scale(1.05);
  }
  
  .language-switcher {
    margin-top: 2vh;
    font-size: clamp(14px, 3vw, 18px);
  }
  
  .lang-btn {
    font-size: clamp(14px, 3vw, 18px);
    padding: 1vh 2vw;
  }
}

@media (max-width: 480px) {
  .nav-link {
    font-size: clamp(11px, 3vw, 15px);
  }
  
  .nav-links {
    gap: 4vw;
  }
}
</style>
