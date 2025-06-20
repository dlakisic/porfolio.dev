// Client-side i18n script
import { getAvailableTranslations } from '../i18n/utils.ts'

const translations = getAvailableTranslations()

// Helper function to get nested translation values
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && typeof current === 'object' ? current[key] : undefined
  }, obj) || path
}

function updatePageTranslations() {
  const lang = localStorage.getItem('lang') || 'fr'
  const langTranslations = translations[lang] || translations['fr']
  
  // Update all elements with data-translate attribute
  const elements = document.querySelectorAll('[data-i18n]')
  
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n')
    if (key) {
      const translation = getNestedValue(langTranslations, key)
      if (typeof translation === 'string') {
        el.textContent = translation
      }
    }
  })
}

// Initialize translations on page load
document.addEventListener('DOMContentLoaded', updatePageTranslations)
document.addEventListener('astro:page-load', updatePageTranslations)

// Listen for language changes
window.addEventListener('storage', (e) => {
  if (e.key === 'lang') {
    updatePageTranslations()
  }
})

// Export for use in other scripts
window.updatePageTranslations = updatePageTranslations