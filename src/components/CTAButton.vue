<template>
  <button 
    :class="buttonClasses" 
    @click="handleClick"
    :disabled="disabled"
  >
    {{ text }}
  </button>
</template>

<script>
export default {
  name: 'CTAButton',
  
  props: {
    text: {
      type: String,
      required: true
    },
    
    variant: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'outline'].includes(value)
    },
    
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    
    disabled: {
      type: Boolean,
      default: false
    },
    
    fullWidth: {
      type: Boolean,
      default: false
    }
  },
  
  computed: {
    buttonClasses() {
      return [
        'cta-button',
        `cta-button--${this.variant}`,
        `cta-button--${this.size}`,
        {
          'cta-button--disabled': this.disabled,
          'cta-button--full-width': this.fullWidth
        }
      ]
    }
  },
  
  methods: {
    handleClick() {
      if (!this.disabled) {
        this.$emit('click')
      }
    }
  }
}
</script>

<style scoped>
.cta-button {
  border: 2px solid var(--color-red);
  border-radius: 4px;
  font-family: 'Play', Arial, sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 15px 30px;
  font-size: 16px;
  min-height: 60px;
}

.cta-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(250, 29, 29, 0.3);
}

/* Size variants — graduated escalation of visual presence */
.cta-button--small {
  padding: 8px 16px;
  font-size: 13px;
  min-height: 36px;
}

.cta-button--medium {
  padding: 12px 24px;
  font-size: 15px;
  min-height: 48px;
}

.cta-button--large {
  padding: 15px 30px;
  font-size: 16px;
  min-height: 60px;
}

.cta-button--primary {
  background: var(--color-red);
  color: white;
  box-shadow: 0 2px 8px rgba(250, 29, 29, 0.3);
}

.cta-button--primary:hover:not(.cta-button--disabled) {
  background: transparent;
  color: var(--color-red);
  border-color: var(--color-red);
  box-shadow: 0 2px 8px rgba(250, 29, 29, 0.3);
}

.cta-button--primary:active:not(.cta-button--disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(250, 29, 29, 0.3);
}

.cta-button--secondary {
  background: var(--color-gray);
  color: white;
  border-color: var(--color-gray);
  box-shadow: 0 2px 8px rgba(85, 85, 85, 0.3);
}

.cta-button--secondary:hover:not(.cta-button--disabled) {
  background: transparent;
  color: var(--color-gray);
  border-color: var(--color-gray);
  box-shadow: 0 2px 8px rgba(85, 85, 85, 0.3);
}

.cta-button--secondary:active:not(.cta-button--disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(85, 85, 85, 0.3);
}

.cta-button--outline {
  background: transparent;
  color: var(--color-red);
  border-color: var(--color-red);
}

.cta-button--outline:hover:not(.cta-button--disabled) {
  background: var(--color-red);
  color: white;
  border-color: var(--color-red);
  box-shadow: 0 2px 8px rgba(250, 29, 29, 0.3);
}

.cta-button--outline:active:not(.cta-button--disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(250, 29, 29, 0.3);
}

.cta-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.cta-button--full-width {
  width: 100%;
}

@media (max-width: 768px) {
  .cta-button {
    font-size: 14px;
    min-height: 52px;
    padding: 14px 26px;
    touch-action: manipulation;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }
}
</style>

<!-- Global styles for <a> tags that need to look like CTAButton -->
<style>
.button-common {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-red);
  color: white;
  text-decoration: none;
  font-family: 'Play', Arial, sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(250, 29, 29, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid var(--color-red);
  padding: 15px 30px;
  font-size: 16px;
  min-height: 60px;
}

.button-common:hover {
  background: transparent;
  color: var(--color-red);
  border-color: var(--color-red);
  box-shadow: 0 2px 8px rgba(250, 29, 29, 0.3);
}

.button-common:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(250, 29, 29, 0.3);
}

.button-common:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(250, 29, 29, 0.3);
}

@media (max-width: 768px) {
  .button-common {
    font-size: 14px;
    min-height: 52px;
    padding: 14px 26px;
  }
}
</style>
