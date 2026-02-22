import { nextTick } from 'vue'

/**
 * Nuclear scroll-to-top — the kind of overkill that works on every browser,
 * every device, every cursed webview some intern at Samsung cooked up.
 * Multiple strategies deployed in sequence because trusting one method
 * is like trusting a single source in journalism.
 */
export function forceScrollToTop() {
  // Method 1: Immediate brute force — no negotiation
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0

  // Method 2: After Vue's DOM reconciliation settles
  nextTick(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    // Method 3: Delayed for route transitions that think they're clever
    setTimeout(() => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0

      // Method 4: The smooth finish — visual confirmation that we mean it
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 50)
    }, 150)
  })
}
