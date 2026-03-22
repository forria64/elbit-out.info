<template>
  <ContentBox variant="warning" class="error-box">
    <h2 class="error-title">{{ $t('common.errorTitle') }}</h2>
    <p class="error-message">{{ $t('common.errorMessage') }}</p>
  </ContentBox>
</template>

<script>
import ContentBox from '@/components/ContentBox.vue'

export default {
  name: 'DirectusError',
  components: { ContentBox }
}
</script>

<style scoped>
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
  text-align: center;
}
</style>
