import { onMounted, onUnmounted } from 'vue'

type StyleKey = 'paddingTop' | 'position' | 'zIndex' | 'top' | 'width'

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

export function useNavToStatic() {
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
      restoreInlineStyles(navElement, ['position', 'zIndex', 'top', 'width']),
      restoreInlineStyles(docElement, ['paddingTop']),
      restoreInlineStyles(sidebarElement, ['top']),
    ]

    const mobileQuery = window.matchMedia('(max-width: 767px)')

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

    cleanup = () => {
      window.removeEventListener('resize', applyLayout)
      restoreStyles.forEach(restore => restore())
    }
  })

  onUnmounted(() => {
    cleanup?.()
  })
}
