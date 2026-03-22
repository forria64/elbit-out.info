<template>
  <div class="content-page">
    <NavigationBar />
    
    <div class="banner-section">
      <div class="banner-container">
        <img 
          :src="bannerImage" 
          :alt="title + ' banner'"
          class="banner-image"
        />
        <div class="banner-overlay">
          <h1 class="banner-title">{{ title }}</h1>
        </div>
      </div>
      
      <div class="banner-red-border"></div>
    </div>
    
    <div class="body-section">
      <div class="body-container">
        <div class="text-block">
          <slot name="content">
            <p>{{ content }}</p>
          </slot>
          
          <div class="cta-section" v-if="showCTA">
            <CTAButton 
              :text="ctaText"
              variant="primary"
              size="large"
              @click="handleCTAClick"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationBar from './NavigationBar.vue'
import CTAButton from './CTAButton.vue'
import { forceScrollToTop } from '@/utils/scroll.js'

export default {
  name: 'ContentPage',
  
  components: {
    NavigationBar,
    CTAButton
  },
  
  props: {
    title: {
      type: String,
      required: true
    },
    
    content: {
      type: String,
      default: ''
    },
    
    bannerImage: {
      type: String,
      required: true
    },
    
    ctaText: {
      type: String,
      default: 'Află mai multe'
    },
    
    showCTA: {
      type: Boolean,
      default: true
    },
    
    ctaRoute: {
      type: String,
      default: '/'
    }
  },
  
  methods: {
    handleCTAClick() {
      if (this.ctaRoute) {
        this.$router.push(this.ctaRoute)
        forceScrollToTop()
      } else {
        this.$emit('cta-click')
      }
    }
  }
}
</script>

<style scoped>
.content-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  /* Banners start flush against the viewport top, behind the fixed nav — no padding to interfere */
}

.banner-section {
  width: 100vw;
  /* Break out of parent padding to span full viewport width */
  margin-left: calc(50% - 50vw);
  background: #f8f8f8;
  position: relative;
}

/* Visual anchor between banner and content — thick enough to register as intentional, not a rendering artifact */
.banner-red-border {
  width: 100%;
  height: 6px;
  background: var(--color-red);
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 100;
}

.banner-container {
  width: 100%;
  height: 28vh; /* ~360px responsive height */
  position: relative;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.6)
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-title {
  font-family: 'Play', Arial, sans-serif;
  font-weight: bold;
  font-size: clamp(28px, 3.8vw, 48px);
  color: white;
  text-align: center;
  text-transform: uppercase;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  max-width: min(80vw, 900px);
  line-height: 1.2;
}

.body-section {
  flex: 1;
  width: 100%;
  padding: 2vh 0;
  background: white;
  position: relative;
}

.body-container {
  max-width: 100vw;
  margin: 0 auto;
  padding: 0 7.8vw; /* ~100px responsive padding */
}

.text-block {
  max-width: 84.4vw; /* ~1080px on 1280px screen */
  min-height: 43.8vh; /* ~560px on 1280px screen */
  margin: 0 auto;
  padding: 3.1vh 3.1vw; /* ~40px responsive */
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
}

.text-block p {
  font-family: 'Atkinson Hyperlegible', Arial, sans-serif;
  font-weight: normal;
  font-size: clamp(11px, 0.9vw, 14px);
  line-height: 1.5;
  color: var(--color-black);
  margin-bottom: 1.9vh; /* ~24px responsive */
  text-align: justify;
}

.text-block h2 {
  font-family: 'Play', Arial, sans-serif;
  font-weight: bold;
  font-size: clamp(15px, 1.7vw, 22px);
  color: var(--color-black);
  margin-bottom: 1.6vh; /* ~20px responsive */
  margin-top: 3.1vh; /* ~40px responsive */
}

.text-block h3 {
  font-family: 'Play', Arial, sans-serif;
  font-weight: bold;
  font-size: clamp(13px, 1.2vw, 16px);
  color: var(--color-red);
  margin-bottom: 1.3vh; /* ~16px responsive */
  margin-top: 2.5vh; /* ~32px responsive */
}

.cta-section {
  margin-top: 3.9vh; /* ~50px responsive */
  text-align: center;
  padding-top: 2.3vh; /* ~30px responsive */
  border-top: 1px solid #eee;
}

@media (max-width: 1024px) and (min-width: 769px) {
  .content-page {
    padding-bottom: 2vh;
  }
  
  .body-container {
    padding: 0 3.9vw; /* ~50px equivalent */
  }
  
  .banner-container {
    height: 22vh; /* ~280px responsive */
  }
  
  .text-block {
    padding: 2.3vh 2.3vw; /* ~30px responsive */
    min-height: auto;
  }
  
  .body-section {
    padding: 1.5vh 0; /* Tighter on tablet */
  }
}

@media (max-width: 768px) {
  .content-page {
    padding-bottom: 2vh;
  }
  
  .body-container {
    padding: 0 0vw; /* Comfortable breathing room on mobile */
  }
  
  .banner-container {
    height: 50vh;
  }
  
  .text-block {
    padding: 1.8vh 0vw; /* Align text with container gutters */
    box-shadow: none;
  }
  
  .text-block p {
    text-align: left;
    font-size: clamp(12px, 3.5vw, 15px);
    line-height: 1.55;
  }
  
  .text-block h2 {
    font-size: clamp(16px, 4vw, 22px);
  }
  
  .text-block h3 {
    font-size: clamp(14px, 3.5vw, 18px);
  }
  
  .body-section {
    padding: 1.5vh 0;
  }
}

</style>
