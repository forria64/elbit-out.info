<template>
  <div class="ce-vrem">
    <ContentPage 
      :bannerImage="bannerImage"
      :title="$t('whatWeWant.title')"
      content=""
      :showCTA="false"
    >
      <template #content>
        <div class="vrem-content">
          <ContentBox variant="lead">
            {{ $t('whatWeWant.intro') }}
            <br><br>
            {{ $t('whatWeWant.collaboration') }}
          </ContentBox>

          <ContentBox variant="warning">
            {{ $t('whatWeWant.noTaxes') }}
          </ContentBox>

          <ContentBox variant="demands-box">
            <ContentBox variant="heading-no-border">
              {{ $t('whatWeWant.demands') }}
            </ContentBox>

            <ContentBox variant="heading-no-border">
              {{ $t('whatWeWant.demand1.title') }}
            </ContentBox>

            <ContentBox variant="lead">
              {{ $t('whatWeWant.demand1.content') }}
            </ContentBox>

            <ContentBox variant="heading-no-border">
              {{ $t('whatWeWant.demand2.title') }}
            </ContentBox>

            <ContentBox variant="lead">
              {{ $t('whatWeWant.demand2.content') }}
            </ContentBox>
          </ContentBox>
        </div>
      </template>
    </ContentPage>
  </div>
</template>

<script>
import ContentPage from '@/components/ContentPage.vue'
import ContentBox from '@/components/ContentBox.vue'

export default {
  name: 'CeVremView',
  components: {
    ContentPage,
    ContentBox
  },
  computed: {
    bannerImage() {
      return new URL('../assets/banners/banner_ce_vrem.webp', import.meta.url).href
    }
  }
}
</script>

<style scoped>
.ce-vrem {
  width: 100%;
  min-height: 100vh;
}

.vrem-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.vrem-content p {
  font-family: 'Atkinson Hyperlegible', Arial, sans-serif;
  font-size: clamp(15px, 1.3vw, 17px);
  line-height: 1.8;
  color: var(--color-black);
  margin-bottom: 1.8em;
  text-align: left;
}

@media (max-width: 768px) {
  .vrem-content {
    padding: 30px 0;
  }
}
</style>