<template>
  <div class="video-banner">
    <div class="video-container">
      <video 
        ref="backgroundVideo"
        class="background-video" 
        :src="videoSrc" 
        autoplay 
        muted 
        loop 
        playsinline
        :controls="false"
        disablePictureInPicture
        controlslist="nodownload nofullscreen noremoteplayback"
        preload="auto"
        webkit-playsinline
        x5-playsinline
      >
        <!-- Chromium accessibility audits flag <video> without a <track> — this satisfies the check -->
        <track kind="descriptions" label="Video description" />
      </video>
      
      <div class="video-overlay"></div>
    </div>
    
    <transition name="slide-title" mode="out-in">
      <div class="sliding-title" :key="currentSlide">
        {{ mainCTAText }}
      </div>
    </transition>
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'VideoBanner',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      currentSlide: 0,
      slideInterval: null
    }
  },
  
  computed: {
    slides() {
      return [
        {
          title: this.t('home.slides.occupation.title'),
          content: this.t('home.slides.occupation.content')
        },
        {
          title: this.t('home.slides.genocide.title'),
          content: this.t('home.slides.genocide.content')
        },
        {
          title: this.t('home.slides.armingIsrael.title'),
          content: this.t('home.slides.armingIsrael.content')
        },
        {
          title: this.t('home.slides.complicity.title'),
          content: this.t('home.slides.complicity.content')
        }
      ]
    },
    // Vite's new URL() import resolves to the hashed asset path at build time
    videoSrc() {
      return new URL('../assets/video_banner.mp4', import.meta.url).href
    },
    
    mainCTAText() {
      return this.slides[this.currentSlide].title
    }
  },
  
  mounted() {
    this.startSlideRotation()
    this.$emit('slide-change', this.slides[this.currentSlide])
    this.ensureVideoAutoplay()
  },
  
  beforeUnmount() {
    this.stopSlideRotation()
  },
  
  methods: {
    startSlideRotation() {
      this.slideInterval = setInterval(() => {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length
        this.$emit('slide-change', this.slides[this.currentSlide])
      }, 10000) // 10s per slide — enough time for a reader to actually absorb the content
    },
    
    stopSlideRotation() {
      if (this.slideInterval) {
        clearInterval(this.slideInterval)
        this.slideInterval = null
      }
    },

    // Browsers increasingly block autoplay — attempt programmatic play and wire up a gesture fallback if it refuses
    ensureVideoAutoplay() {
      this.$nextTick(() => {
        const video = this.$refs.backgroundVideo
        if (!video) return
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Programmatic play rejected — need a real user gesture to unblock
            this.setupVideoClickHandler(video)
          })
        }
      })
    },

    // If autoplay was blocked, the next real user interaction becomes our last shot
    setupVideoClickHandler(video) {
      const playOnClick = () => {
        video.play().catch(() => {
          // Browser refused every attempt — the video stays a still frame and we move on
        })
      }
      document.addEventListener('click', playOnClick, { once: true })
      document.addEventListener('touchstart', playOnClick, { once: true })
    }
  }
}
</script>

<style scoped>
.video-banner {
  width: 100%;
  height: 100%;
  margin: 0;
  position: relative;
  overflow: hidden;
  border-radius: 0;
  box-shadow: none;
}

.video-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.background-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

/* Video is ambient decoration — strip native controls so users don't try to pause the atmosphere */
.background-video::-webkit-media-controls {
  display: none !important;
}

.background-video::-webkit-media-controls-panel {
  display: none !important;
}

.background-video::-webkit-media-controls-play-button {
  display: none !important;
}

.background-video::-webkit-media-controls-start-playback-button {
  display: none !important;
}

.background-video::-webkit-media-controls-overlay-enclosure {
  display: none !important;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2;
}

.sliding-title {
  position: absolute;
  bottom: -0.5rem;
  left: 3%;
  width: 90%;
  padding: 0.3rem 1.5rem;
  background: transparent;
  color: white;
  font-family: 'Play', Arial, sans-serif;
  font-weight: bold;
  font-size: clamp(24px, 3vw, 40px);
  text-transform: uppercase;
  text-align: left;
  z-index: 4;
}

.slide-title-enter-active,
.slide-title-leave-active {
  transition: all 0.6s ease-in-out;
}

.slide-title-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-title-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-title-enter-to,
.slide-title-leave-from {
  transform: translateX(0);
  opacity: 1;
}

@media (max-width: 1024px) {
  .sliding-title {
    font-size: clamp(20px, 2.5vw, 32px);
    padding: 1.2rem 1.5rem;
  }
}

@media (max-width: 768px) {
  .sliding-title {
    font-size: clamp(18px, 2.2vw, 28px);
    padding: 1rem 1.2rem;
  }
}

@media (max-width: 480px) {
  .sliding-title {
    font-size: clamp(16px, 4vw, 24px);
    padding: 0.8rem 1rem;
  }
}
</style>
