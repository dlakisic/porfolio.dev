// i18n utility for portfolio
import frTranslations from './translations/fr.json'
import enTranslations from './translations/en.json'

const defaultLang = 'fr'
const supportedLanguages = ['fr', 'en'] as const
type SupportedLanguage = typeof supportedLanguages[number]

const translations = {
  fr: frTranslations,
  en: enTranslations
}

// Helper function to get nested translation values
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => {
    return current && typeof current === 'object' ? current[key] : undefined
  }, obj) || path
}

export function useTranslations(lang?: SupportedLanguage) {
  const currentLang = (lang || (typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null) || defaultLang) as SupportedLanguage
  
  return function translate(key: string): string {
    const langTranslations = translations[currentLang] || translations[defaultLang]
    return getNestedValue(langTranslations, key)
  }
}

export function getCurrentLanguage(): SupportedLanguage {
  // Côté serveur, on utilise la langue par défaut
  if (typeof window === 'undefined') {
    return defaultLang
  }
  
  // Côté client, on utilise localStorage
  if (typeof localStorage !== 'undefined') {
    const storedLang = localStorage.getItem('lang') as SupportedLanguage
    return supportedLanguages.includes(storedLang) ? storedLang : defaultLang
  }
  return defaultLang
}

export function setLanguage(lang: SupportedLanguage) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('lang', lang)
  }
}

export function getSupportedLanguages() {
  return supportedLanguages
}

export function getAvailableTranslations() {
  return translations
}