<template>
  <div class="de-ce-elbit">
    <ContentPage 
      :bannerImage="bannerImage"
      :title="$t('whyElbit.title')"
      content=""
      :showCTA="false"
    >
      <template #content>
        <div class="elbit-content">
          <div class="video-embed">
            <iframe
              src="https://www.youtube-nocookie.com/embed/uf69ysi8Fnk"
              title="Why Elbit?"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>

          <ContentBox variant="lead">
            {{ $t('whyElbit.intro') }}
          </ContentBox>

          <ContentBox variant="demands-box">
            {{ $t('whyElbit.mainInfo') }}
            <br><br>
            {{ $t('whyElbit.romaniaRole') }}
            <br><br>
            {{ $t('whyElbit.warning') }}
          </ContentBox>

          <ContentBox variant="lead">
            {{ $t('whyElbit.trends') }}
            <div class="download-report">
              <CTAButton
                :text="$t('whyElbit.downloadReport')"
                variant="primary"
                size="medium"
                :fullWidth="true"
                @click="downloadReport"
              />
            </div>
          </ContentBox>
        </div>
      </template>
    </ContentPage>
  </div>
</template>

<script>
import ContentPage from '@/components/ContentPage.vue'
import ContentBox from '@/components/ContentBox.vue'
import CTAButton from '@/components/CTAButton.vue'
import { triggerDownload } from '@/utils/download.js'

export default {
  name: 'DeCeElbitView',
  components: {
    ContentPage,
    ContentBox,
    CTAButton
  },
  computed: {
    bannerImage() {
      return new URL('../assets/banners/banner_de_ce_elbit.webp', import.meta.url).href
    },
    reportUrl() {
      return new URL('../assets/docs/final-report.pdf', import.meta.url).href
    }
  },
  methods: {
    downloadReport() {
      triggerDownload(this.reportUrl, 'raport_elbit_out.pdf')
    }
  }
}
</script>

<style scoped>
.de-ce-elbit {
  width: 100%;
  min-height: 100vh;
}

.elbit-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.download-report {
  margin-top: 2em;
  width: 100%;
}

.video-embed {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  margin-bottom: 2em;
  border: 2px solid var(--color-black);
  border-radius: 4px;
  overflow: hidden;
}

.video-embed iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.elbit-content p {
  font-family: 'Atkinson Hyperlegible', Arial, sans-serif;
  font-size: clamp(15px, 1.3vw, 17px);
  line-height: 1.8;
  color: var(--color-black);
  margin-bottom: 1.8em;
  text-align: left;
}

@media (max-width: 768px) {
  .elbit-content {
    padding: 30px 0;
  }
}
</style>