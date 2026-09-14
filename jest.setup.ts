import '@testing-library/jest-dom'

// framer-motion (whileInView) braucht IntersectionObserver in jsdom
class MockIntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}
;(globalThis as Record<string, unknown>).IntersectionObserver = MockIntersectionObserver

// framer-motion Scroll-Progress (used by motion.div viewport)
;(globalThis as Record<string, unknown>).ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
