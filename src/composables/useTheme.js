import { ref, watch, onMounted } from 'vue'

const isDark = ref(false)

export function useTheme() {
  function applyTheme(dark) {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  function initTheme() {
    const saved = localStorage.getItem('theme')
    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme(isDark.value)
  }

  watch(isDark, (val) => {
    applyTheme(val)
  })

  onMounted(() => {
    initTheme()
  })

  return { isDark, toggleTheme, initTheme }
}
