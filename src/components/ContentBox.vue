<template>
  <div :class="boxClasses">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ContentBox',
  
  props: {
    variant: {
      type: String,
      default: 'default',
      validator: value => ['default', 'lead', 'highlight', 'warning', 'heading', 'heading-no-border', 'demands-box'].includes(value)
    }
  },
  
  computed: {
    boxClasses() {
      return [
        'content-box',
        `content-box--${this.variant}`
      ]
    }
  }
}
</script>

<style scoped>
.content-box {
  font-family: 'Atkinson Hyperlegible', Arial, sans-serif;
  font-size: clamp(15px, 1.3vw, 17px);
  line-height: 1.8;
  color: var(--color-black);
  margin-bottom: 1.8em;
  text-align: left;
}

.content-box--lead {
  font-size: clamp(16px, 1.4vw, 18px);
  font-weight: 500;
  line-height: 1.9;
  margin-bottom: 2.5em;
  padding: 2em;
  background: rgba(0, 0, 0, 0.03);
  border-left: 5px solid var(--color-black);
  border-radius: 0 4px 4px 0;
}

.content-box--highlight {
  background: rgba(250, 29, 29, 0.05);
  padding: 1.8em;
  padding-left: 3em;
  border-left: 5px solid var(--color-red);
  border-radius: 0 4px 4px 0;
  margin-bottom: 2.5em;
  position: relative;
}

.content-box--highlight::before {
  content: '▸';
  color: var(--color-red);
  font-size: 2em;
  position: absolute;
  left: 0.5em;
  top: 0.8em;
  font-weight: bold;
  line-height: 1;
}

.content-box--warning {
  font-size: clamp(16px, 1.4vw, 19px);
  font-weight: bold;
  color: var(--color-red);
  background: rgba(250, 29, 29, 0.08);
  padding: 2em;
  border: 3px solid var(--color-red);
  border-radius: 4px;
  text-align: center;
  margin-top: 3em;
  margin-bottom: 2em;
  line-height: 1.6;
  box-shadow: 0 4px 12px rgba(250, 29, 29, 0.15);
}

.content-box--heading {
  font-family: 'Atkinson Hyperlegible', Arial, sans-serif;
  font-weight: bold;
  font-size: clamp(15px, 1.5vw, 18px);
  color: var(--color-black);
  margin-top: 3.5em;
  margin-bottom: 1.5em;
  line-height: 1.4;
  text-align: left;
  border: 2px solid var(--color-red);
  padding: 1.2em 1.5em;
  border-radius: 4px;
}

.content-box--heading-no-border {
  font-family: 'Atkinson Hyperlegible', Arial, sans-serif;
  font-weight: bold;
  font-size: clamp(15px, 1.5vw, 18px);
  color: var(--color-black);
  margin-top: 3.5em;
  margin-bottom: 1.5em;
  line-height: 1.4;
  text-align: left;
}

.content-box--demands-box {
  background: rgba(250, 29, 29, 0.05);
  padding: 1.8em;
  border-left: 5px solid var(--color-red);
  border-radius: 0 4px 4px 0;
  margin-bottom: 2.5em;
  margin-top: 3em;
}

/* Nested content-box inherits parent margin — zero it so the first child sits flush */
.content-box--demands-box > .content-box:first-child {
  margin-top: 0;
}

@media (max-width: 768px) {
  .content-box {
    margin-left: 0;
    margin-right: 0;
  }
  
  .content-box--lead {
    padding: 1.4em 0.5em;
    border-left-width: 4px;
  }
  
  .content-box--highlight {
    padding: 1.4em 0.5em;
    border-left-width: 4px;
  }
  
  .content-box--highlight::before {
    font-size: 1.8em;
    left: 0.6em;
  }
  
  .content-box--warning {
    padding: 1.4em 1.1em;
    margin-top: 2em;
    margin-left: 0;
    margin-right: 0;
  }
  
  .content-box--demands-box {
    padding: 1.4em 0.5em;
    border-left-width: 4px;
  }
  
  .content-box--heading {
    padding: 0em 0.5em;
    margin-left: 0;
    margin-right: 0;
  }
  
  .content-box--heading-no-border {
    margin-left: 0;
    margin-right: 0;
    margin-top: 0;
  }
}

@media (max-width: 480px) {
  .content-box--lead,
  .content-box--highlight,
  .content-box--demands-box {
    border-left-width: 3px;
  }
}
</style>
