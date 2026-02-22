<template>
  <div id="app">
    <div class="red-margin-left"></div>
    <main class="app-main">
      <router-view />
    </main>
    <footer v-if="!isHomePage" class="site-footer">
      <span class="footer-built">Built with</span>
      <span class="footer-heart">&hearts;</span>
      <span class="footer-built">by</span>
      <a
        :href="brandHref"
        target="_blank"
        rel="noopener noreferrer"
        class="footer-brand-link"
      >
        <span class="footer-brand-inner">
          <img
            :src="brandLogo"
            alt=""
            class="footer-brand-logo"
          />
          <span class="footer-brand-name">{{ brandName }}</span>
        </span>
      </a>
    </footer>
  </div>
</template>

<script>
import i18n, { detectLocaleByIP } from '@/i18n.js'

export default {
  name: 'App',
  data() {
    return {
      brandHref: '',
      brandName: ''
    }
  },
  computed: {
    isHomePage() {
      return this.$route.path === '/'
    },
    brandLogo() {
      return new URL('./assets/branding.png', import.meta.url).href
    }
  },
  watch: {
    // Lock body scroll on homepage, free it everywhere else
    isHomePage: {
      immediate: true,
      handler(locked) {
        document.documentElement.style.overflow = locked ? 'hidden' : ''
      }
    },
    // Sync <html lang> with active locale — screen readers and crawlers need this
    '$i18n.locale': {
      immediate: true,
      handler(lang) {
        document.documentElement.lang = lang
      }
    }
  },
  mounted() {
    // Decode brand identity client-side — keeps bots from scraping the association
    this.brandHref = atob('aHR0cHM6Ly9mb3JyaWE2NC5zcGFjZQ==')
    this.brandName = atob('Rk9SUklBNjQ=')
    detectLocaleByIP(i18n)
  },
  beforeUnmount() {
    document.documentElement.style.overflow = ''
  }
}
</script>

<style>
/* Custom typefaces — Play for headlines, Atkinson for body. Swap display prevents FOIT. */
@font-face {
  font-family: 'Play';
  src: url('./assets/fonts/Play-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Play';
  src: url('./assets/fonts/Play-Bold.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Atkinson Hyperlegible';
  src: url('./assets/fonts/AtkinsonHyperlegible.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

:root {
  --color-black: #000000;
  --color-gray: #555555;
  --color-red: #fa1d1d;
  --color-cream: #ffffff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Custom red scrollbar — brand presence in every scroll */
html {
  scrollbar-width: thin;
  scrollbar-color: var(--color-red) transparent;
}

/* Webkit needs its own API — standard scrollbar-* doesn't cut it yet */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--color-red);
  border-radius: 100px;
}

::-webkit-scrollbar-thumb:hover {
  background: #d91919;
}

/* Tighter scrollbar on mobile — less real estate burned on small glass */
@media (max-width: 768px) {
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
}

@media (max-width: 480px) {
  ::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }
}

html, body {
  width: 100%;
  height: 100%;
  font-family: 'Atkinson Hyperlegible', Arial, sans-serif;
  font-weight: normal;
  color: var(--color-black);
  background: var(--color-cream);
  line-height: 1.5;
  overflow-x: hidden;
  scroll-behavior: smooth;
  /* No global padding-top — each page handles its own nav spacing */
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}

.app-main {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
}

/* Brand stripe — the red vertical line that anchors every page visually */
.red-margin-left {
  position: fixed;
  left: 1.5vw; /* ~20px on 1280px screen */
  top: 0;
  width: 5px;
  height: 100vh;
  background: var(--color-red);
  z-index: 1000;
  opacity: 0.9;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Play', Arial, sans-serif;
  font-weight: bold;
  color: var(--color-black);
}

p, span, div {
  font-family: 'Atkinson Hyperlegible', Arial, sans-serif;
  font-weight: normal;
  color: var(--color-black);
}

a {
  font-family: 'Atkinson Hyperlegible', Arial, sans-serif;
  font-weight: normal;
  color: var(--color-gray);
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: var(--color-red);
}

/* Touch devices get no hover effects — sticky :hover on tap is hostile UX */
@media (hover: none) and (pointer: coarse) {
  *:hover {
    transform: none !important;
    box-shadow: none !important;
  }

  a:hover {
    color: inherit;
  }

  button:hover {
    transform: none !important;
    box-shadow: none !important;
  }
}

@media (max-width: 768px) {
  .red-margin-left {
    left: 5vw;
    width: 4px;
  }

  p, span, div {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  body {
    overflow-x: hidden;
    /* No mobile-specific padding — each page handles its own nav spacing */
  }

  h1, h2, h3, h4, h5, h6 {
    line-height: 1.3;
  }
  
  p {
    line-height: 1.6;
  }
}

@media (max-width: 480px) {
  .red-margin-left {
    left: 4vw;
    width: 3px;
  }
}

/* ── Footer branding ── */
.site-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4em;
  padding: 0 0 1em;
  background: transparent;
  font-family: 'Atkinson Hyperlegible', Arial, sans-serif;
  font-size: clamp(13px, 1.1vw, 16px);
  color: var(--color-gray);
  user-select: none;
}

.footer-heart {
  color: var(--color-red);
  font-size: 1.5em;
  line-height: 1;
}

.footer-brand-link {
  display: inline-flex;
  text-decoration: none;
  color: inherit;
}

.footer-brand-inner {
  display: inline-flex;
  align-items: center;
  gap: 0;
  border: 1.5px solid transparent;
  border-radius: 20px;
  padding: 4px 8px;
  transition: border-color 0.3s ease, gap 0.3s ease;
  /* Clip the name while it's hidden */
  overflow: hidden;
}

.footer-brand-logo {
  height: 22px;
  width: auto;
  display: block;
  flex-shrink: 0;
}

.footer-brand-name {
  font-family: 'Play', Arial, sans-serif;
  font-weight: bold;
  font-size: clamp(12px, 1vw, 14px);
  color: var(--color-red);
  white-space: nowrap;
  /* Collapsed by default — slides open on hover */
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.3s ease 0.05s;
}

/* Hover state — name slides out, border appears */
.footer-brand-link:hover .footer-brand-inner {
  border-color: var(--color-red);
  gap: 0.5em;
}

.footer-brand-link:hover .footer-brand-name {
  max-width: 8em;
  opacity: 1;
}

@media (max-width: 768px) {
  .footer-brand-logo {
    height: 18px;
  }
}
</style>
