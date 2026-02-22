<template>
  <div class="home">
    <section class="intro-section">
      <VideoBanner 
        @slide-change="handleSlideChange"
      />
    </section>
      
    <div class="content-red-border"></div>
    
    <section class="main-section">
      <div class="main-container">
        <transition name="slide" mode="out-in">
          <div class="text-content-wrapper" :key="currentSlide.title">
            <div class="text-content">
              <div class="content-paragraphs">
                <p 
                  v-for="(paragraph, index) in formattedContent" 
                  :key="index"
                  :class="{ 'bullet-point': isBulletPoint(paragraph) }"
                  v-html="paragraph"
                >
                </p>
              </div>
            </div>
          </div>
        </transition>

        <div class="secondary-cta">
          <CTAButton 
            :text="$t('home.learnMore')"
            variant="primary"
            size="large"
            @click="handleLearnMore"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import VideoBanner from '@/components/VideoBanner.vue'
import CTAButton from '@/components/CTAButton.vue'
import { forceScrollToTop } from '@/utils/scroll.js'

export default {
  name: 'HomeView',
  
  components: {
    VideoBanner,
    CTAButton
  },

  data() {
    return {
      // Current slide from carousel
      currentSlide: {}
    }
  },

  computed: {
    formattedContent() {
      if (!this.currentSlide.content) {
        return []
      }
      return this.currentSlide.content.split('\n\n').filter(p => p.trim())
    }
  },
  
  methods: {
    handleSlideChange(slideData) {
      this.$nextTick(() => {
        this.currentSlide = slideData
      })
    },

    handleLearnMore() {
      this.$router.push('/de-ce-elbit')
      forceScrollToTop()
    },

    isBulletPoint(paragraph) {
      return paragraph?.includes('•')
    }
  }
}
</script>

<style scoped>
.home {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  overflow: hidden; /* Homepage locked to viewport — no scrolling */
}

.intro-section {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  /* Start from viewport top — no padding needed */
  height: 50vh;
  padding: 0;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.content-red-border {
  width: 100%;
  height: 6px;
  background: var(--color-red);
  margin: 0;
}

.main-section {
  width: 100%;
  max-width: 84.4vw; /* ~1080px on 1280px screen */
  min-height: 35vh; /* Reduced since video takes more space */
  margin: 0.5vh auto; /* Much tighter - reduced from 2vh */
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-container {
  width: 100%;
  height: 100%;
  padding: 2vh 3.9vw; /* Reduced vertical padding from 5.5vh */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Text content wrapper — clean panel with subtle border */
.text-content-wrapper {
  width: 100%;
  max-width: 50vw;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 2rem 2rem 0 2rem;
  margin-top: 3vh;
  overflow: hidden;
}

/* Text content block - slides in/out */
.text-content {
  width: 100%;
  min-height: 150px; /* Minimum for readability */
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.main-title {
  font-family: 'Play', Arial, sans-serif;
  font-weight: bold;
  font-size: clamp(18px, 2vw, 26px); /* Smaller default title */
  color: var(--color-black);
  text-align: center;
  margin-bottom: 2.3vh; /* ~30px responsive */
}

.lead-paragraph {
  font-size: clamp(14px, 1.4vw, 18px) !important; /* Smaller default lead text */
  font-weight: bold;
  color: var(--color-red);
  margin-bottom: 2.3vh; /* ~30px responsive */
}

/* Paragraph spacing */
.content-paragraphs {
  display: flex;
  flex-direction: column;
  gap: 1.9vh; /* ~24px responsive */
}

.content-paragraphs p {
  font-family: 'Atkinson Hyperlegible', Arial, sans-serif;
  font-weight: normal;
  font-size: clamp(13px, 1.2vw, 14px); /* Smaller default text */
  line-height: 1.6;
  color: var(--color-black);
  text-align: justify;
  margin: 0;
  white-space: pre-line; /* Preserve whitespace and line breaks for bullet points */
}

/* Hanging indent — bullet char pokes left while wrapped text stays aligned */
.content-paragraphs p.bullet-point {
  padding-left: 2em;
  text-indent: -0.5em;
  margin-left: 0;
}

.secondary-cta {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.text-content-wrapper .secondary-cta button {
  width: 100%;
  display: block;
  text-align: center;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease-in-out;
}

.slide-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

/* Clip overflow during slide transitions */
.main-container {
  position: relative;
  overflow: hidden;
}

@media (max-width: 1200px) {

  .intro-section {
    height: 50vh; /* Keep 50% height on all screen sizes */
  }
  
  .main-section {
    max-width: 95%;
    min-height: 30vh;
    margin: 0.3vh auto; /* Even tighter on tablet */
  }
  
  .main-container {
    padding: 1.5vh 1.8vw; /* Reduced padding */
  }
  
  .text-content-wrapper {
    max-width: 85vw; /* Wider on tablets */
    padding: 1.5rem 1.5rem 0 1.5rem;
  }
  
  .text-content {
    min-height: 150px;
    margin-bottom: 1rem;
  }

}

@media (max-width: 768px) {
  .intro-section {
    height: 50vh; /* Maintain 50% height on mobile */
  }
  
  .main-container {
    padding: 2vh 5vw; /* Softer mobile gutters */
    margin-top: 1vh; /* Less top margin - content higher */
  }
  
  .content-paragraphs p {
    text-align: left;
    font-size: clamp(12px, 1.1vw, 15px); /* Smaller paragraph text on tablet */
    line-height: 1.5; /* Tighter line height */
  }
  
  .content-paragraphs {
    gap: 1.5vh; /* More space between paragraphs */
  }
}

@media (max-width: 480px) {
  .intro-section {
    height: 50vh; /* Keep consistent 50% even on small screens */
  }
  
  .main-container {
    padding: 2.5vh 6vw; /* Softer mobile gutters */
    margin-top: 1.5vh; /* Consistent top margin */
  }
  
  .text-content-wrapper {
    max-width: 95vw;
    padding: 1.5rem 1.5rem 0 1.5rem;
  }
  
  .text-content {
    margin-bottom: 1rem;
  }
  
  .content-paragraphs {
    gap: 1.8vh; /* More gap between paragraphs on mobile */
  }
  
  .content-paragraphs p {
    font-size: clamp(11px, 1vw, 15px); /* Consistent smaller text on mobile */
    line-height: 1.4; /* Tighter line height for small screens */
  }
}

</style>
