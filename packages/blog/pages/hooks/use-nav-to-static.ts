import { onMounted, onUnmounted } from 'vue'

type StyleKey = 'paddingTop' | 'position' | 'zIndex' | 'top' | 'width' | 'transform' | 'transition'

interface NavToStaticOptions {
  hideOnMobileScroll?: boolean
}

function restoreInlineStyles(element: HTMLElement | null, keys: StyleKey[]) {
  if (!element)
    return () => {}

  const previousStyles = keys.map(key => [key, element.style[key]] as const)

  return () => {
    previousStyles.forEach(([key, value]) => {
      element.style[key] = value
    })
  }
}

export function useNavToStatic(options: NavToStaticOptions = {}) {
  let cleanup: (() => void) | undefined

  onMounted(() => {
    if (typeof window === 'undefined')
      return

    const navElement = document.querySelector<HTMLElement>('.VPNav')
    const docElement = document.querySelector<HTMLElement>('.VPDoc')
    const sidebarElement = document.querySelector<HTMLElement>('.VPSidebar')
    const contentElement = document.querySelector<HTMLElement>('.VPContent')

    const restoreStyles = [
      restoreInlineStyles(contentElement, ['paddingTop']),
      restoreInlineStyles(navElement, [
        'position',
        'zIndex',
        'top',
        'width',
        'transform',
        'transition',
      ]),
      restoreInlineStyles(docElement, ['paddingTop']),
      restoreInlineStyles(sidebarElement, ['top']),
    ]

    const mobileQuery = window.matchMedia('(max-width: 767px)')

    const applyMobileNavVisibility = () => {
      if (!navElement)
        return

      if (!mobileQuery.matches) {
        navElement.style.transform = ''
        navElement.style.transition = ''
        return
      }

      navElement.style.transition = 'transform 0.2s ease'

      const isScreenOpen = Boolean(document.querySelector('.VPNavScreen'))
      if (!options.hideOnMobileScroll || isScreenOpen || window.scrollY <= 8) {
        navElement.style.transform = 'translateY(0)'
        return
      }

      navElement.style.transform = 'translateY(-100%)'
    }

    const applyLayout = () => {
      if (contentElement) {
        contentElement.style.paddingTop = mobileQuery.matches
          ? 'var(--vp-nav-height)'
          : '0'
      }

      if (navElement) {
        navElement.style.position = mobileQuery.matches ? 'fixed' : 'static'
        navElement.style.zIndex = mobileQuery.matches ? '1000' : '1'
        navElement.style.top = mobileQuery.matches
          ? 'var(--vp-layout-top-height, 0px)'
          : ''
        navElement.style.width = mobileQuery.matches ? '100%' : ''
        applyMobileNavVisibility()
      }

      if (docElement) {
        docElement.style.paddingTop = mobileQuery.matches ? '' : '0'
      }

      if (sidebarElement) {
        sidebarElement.style.top = mobileQuery.matches ? '' : '0'
      }
    }

    applyLayout()
    window.addEventListener('resize', applyLayout)
    window.addEventListener('scroll', applyMobileNavVisibility, { passive: true })
    const navObserver = new MutationObserver(applyMobileNavVisibility)
    if (navElement) {
      navObserver.observe(navElement, { childList: true })
    }

    cleanup = () => {
      window.removeEventListener('resize', applyLayout)
      window.removeEventListener('scroll', applyMobileNavVisibility)
      navObserver.disconnect()
      restoreStyles.forEach(restore => restore())
    }
  })

  onUnmounted(() => {
    cleanup?.()
  })
}
