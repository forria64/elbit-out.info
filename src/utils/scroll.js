import { nextTick } from 'vue'

/**
 * Nuclear scroll-to-top — the kind of overkill that works on every browser,
 * every device, every cursed webview some intern at Samsung cooked up.
 * Multiple strategies fire in sequence because no single API
 * can be trusted across the full spectrum of rendering engines.
 */
export function forceScrollToTop() {
  // Direct imperative — works unless Vue or the browser's transition system actively interfere
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0

  // Vue batches DOM writes — re-issue after the reconciliation pass settles
  nextTick(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    // Route transitions sometimes paint after the tick — setTimeout catches the stragglers
    setTimeout(() => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0

      // Final smooth pass for the user's benefit — visual proof the page actually responded
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 50)
    }, 150)
  })
}
