<template>
  <div class="sustine-campania">
    <ContentPage 
      :bannerImage="bannerImage"
      :title="$t('support.title')"
      content=""
      :showCTA="false"
    >
      <template #content>
        <div class="sustine-content">
          <ContentBox variant="lead">
            <h2>{{ $t('support.donate.heading') }}</h2>
            <p>{{ $t('support.donate.intro') }}</p>
            <p>{{ $t('support.donate.brick') }}</p>
            <p>{{ $t('support.donate.together') }}</p>
            <a href="https://chuffed.org/project/152381-elbit-out" target="_blank" rel="noopener noreferrer" class="button-common donate-button">
              {{ $t('support.donate.button') }}
            </a>
          </ContentBox>

          <ContentBox variant="lead">
            <h2>{{ $t('support.petition.heading') }}</h2>
            <p>{{ $t('support.petition.movement') }}</p>
            <p>{{ $t('support.petition.callToAction') }}</p>
            <p>{{ $t('support.petition.download') }}</p>
            <button type="button" class="button-common petition-button" @click="downloadPetition">
              {{ $t('support.petition.downloadButton') }}
            </button>
            <p class="submission-info">{{ $t('support.petition.submission') }} <strong>{{ $t('support.petition.address') }}</strong>.</p>
            <p class="closing">{{ $t('support.petition.closing') }}</p>
          </ContentBox>

          <ContentBox variant="lead">
            <h2>{{ $t('support.onlinePetition.heading') }}</h2>
            <a href="https://campaniamea.declic.ro/petitions/stop-inarmarii-genocidului-si-ocupatiei-romania-spune-nu-complicitatii" target="_blank" rel="noopener noreferrer" class="button-common online-petition-button">
              {{ $t('support.onlinePetition.button') }}
            </a>
          </ContentBox>
        </div>
      </template>
    </ContentPage>
  </div>
</template>

<script>
import ContentPage from '@/components/ContentPage.vue'
import ContentBox from '@/components/ContentBox.vue'
import { triggerDownload } from '@/utils/download.js'

export default {
  name: 'SustineCampaniaView',
  components: {
    ContentPage,
    ContentBox
  },
  computed: {
    bannerImage() {
      return new URL('../assets/banners/EObanner_sustine.webp', import.meta.url).href
    },
    petitionPdfUrl() {
      return new URL('../assets/docs/model_tabel_semnaturi.pdf', import.meta.url).href
    }
  },
  methods: {
    downloadPetition() {
      triggerDownload(this.petitionPdfUrl, 'model_tabel_semnaturi.pdf')
    }
  }
}
</script>

<style scoped>
.sustine-campania {
  width: 100%;
  min-height: 100vh;
}

.sustine-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.sustine-content h2 {
  font-family: 'Play', Arial, sans-serif;
  font-weight: bold;
  font-size: clamp(20px, 2.5vw, 28px);
  color: var(--color-black);
  margin-bottom: 1.5em;
  text-align: left;
  margin-top: 0;
}

.sustine-content p {
  font-family: 'Atkinson Hyperlegible', Arial, sans-serif;
  font-size: clamp(14px, 1.2vw, 16px);
  line-height: 1.8;
  color: var(--color-black);
  margin-bottom: 1.5em;
  text-align: left;
}

.donate-button,
.online-petition-button,
.petition-button {
  display: block;
  margin: 2em 0;
  text-align: center;
}

.petition-button {
  width: 100%;
}

.submission-info {
  background-color: rgba(250, 29, 29, 0.05);
  padding: 1.5em;
  border-left: 4px solid var(--color-red);
  margin-top: 2em;
}

.closing {
  font-style: italic;
  margin-top: 2em;
}

@media (max-width: 768px) {
  .sustine-content {
    padding: 30px 0;
  }
}
</style>