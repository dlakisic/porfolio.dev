// Component interfaces for type safety and better DX

// Base component props
export interface BaseComponentProps {
  class?: string
  id?: string
}

// Button and Link components
export interface LinkButtonProps extends BaseComponentProps {
  href: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  external?: boolean
  download?: boolean
  disabled?: boolean
}

export interface SocialPillProps extends BaseComponentProps {
  href: string
  platform: 'github' | 'linkedin' | 'twitter' | 'email' | 'website'
  username?: string
  external?: boolean
}

// Card components
export interface CardProps extends BaseComponentProps {
  title: string
  body: string
  href: string
  variant?: 'default' | 'gradient' | 'glass'
  animated?: boolean
}

// Badge component
export interface BadgeProps extends BaseComponentProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  pulse?: boolean
}

// Typography component
export interface TypographyProps extends BaseComponentProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
  variant?: 
    | 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'heading-5' | 'heading-6'
    | 'subtitle-1' | 'subtitle-2'
    | 'body-large' | 'body' | 'body-small'
    | 'caption' | 'overline'
  color?: 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'error'
  align?: 'left' | 'center' | 'right'
  gradient?: boolean
  truncate?: boolean
}

// Icon component
export interface IconProps extends BaseComponentProps {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  color?: string
  strokeWidth?: number
  rotate?: number
  flip?: 'horizontal' | 'vertical' | 'both'
}

// Dropdown component
export interface DropdownProps extends BaseComponentProps {
  id: string
  triggerClass?: string
  menuClass?: string
  menuPosition?: 'left' | 'right' | 'center'
  closeOnSelect?: boolean
  disabled?: boolean
}

// Timeline components
export interface TimelineItemProps extends BaseComponentProps {
  variant?: 'default' | 'compact'
}

export interface ExperienceItemProps extends TimelineItemProps {
  title: string
  company: string
  date: string
  location?: string
  description?: string
  tags?: string[]
  link?: string
}

export interface EducationItemProps extends TimelineItemProps {
  diploma: string
  school: string
  date: string
  description?: string
  grade?: string
  location?: string
}

// Section components
export interface SectionContainerProps extends BaseComponentProps {
  tag?: 'section' | 'div' | 'article' | 'main'
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  background?: 'transparent' | 'subtle' | 'muted'
}

// Theme and Language components
export interface ThemeToggleProps extends BaseComponentProps {
  themes?: string[]
  defaultTheme?: string
  showLabels?: boolean
}

export interface LanguageSelectorProps extends BaseComponentProps {
  locales?: Record<string, string>
  currentLocale?: string
  showFlags?: boolean
}

// Project components
export interface ProjectProps extends BaseComponentProps {
  title: string
  description: string
  image?: string
  tags?: Technology[]
  links?: ProjectLink[]
  featured?: boolean
  status?: 'completed' | 'in-progress' | 'planned'
}

export interface ProjectLink {
  type: 'github' | 'demo' | 'website' | 'download'
  url: string
  label?: string
}

export interface Technology {
  name: string
  color?: string
  icon?: string
  category?: 'frontend' | 'backend' | 'database' | 'tool' | 'language'
}

// Form components
export interface FormFieldProps extends BaseComponentProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  help?: string
}

// Layout components
export interface LayoutProps extends BaseComponentProps {
  title: string
  description: string
  image?: string
  canonical?: string
  noindex?: boolean
}

export interface HeaderProps extends BaseComponentProps {
  variant?: 'default' | 'minimal' | 'transparent'
  sticky?: boolean
  showNav?: boolean
  showThemeToggle?: boolean
  showLanguageSelector?: boolean
}

export interface FooterProps extends BaseComponentProps {
  variant?: 'default' | 'minimal'
  showSocial?: boolean
  showCopyright?: boolean
  year?: number
}

// Animation and transition props
export interface AnimationProps {
  animation?: 'fade-in' | 'slide-up' | 'scale-in' | 'bounce-subtle' | 'none'
  delay?: number
  duration?: 'fast' | 'normal' | 'slow'
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce' | 'smooth'
}

// Responsive props
export interface ResponsiveProps {
  responsive?: {
    sm?: boolean
    md?: boolean
    lg?: boolean
    xl?: boolean
  }
}

// Accessibility props
export interface A11yProps {
  ariaLabel?: string
  ariaDescribedBy?: string
  ariaLabelledBy?: string
  role?: string
  tabIndex?: number
}

// Combined props for enhanced components
export interface EnhancedComponentProps extends BaseComponentProps, AnimationProps, ResponsiveProps, A11yProps {}

// Data types for content
export interface BlogPost {
  slug: string
  title: string
  description: string
  publishDate: Date
  tags: string[]
  image?: string
  featured?: boolean
  draft?: boolean
  author?: string
  readingTime?: number
}

export interface Certificate {
  id: string
  title: string
  issuer: string
  date: Date
  url?: string
  image?: string
  skills?: string[]
}

export interface Skill {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: string
  icon?: string
  color?: string
  years?: number
}

// Utility types
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type SpacingVariant = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

// Helper type for slot content
export interface SlotProps {
  [key: string]: any
}

// Event handler types
export type ClickHandler = (event: MouseEvent) => void
export type ChangeHandler = (event: Event) => void
export type SubmitHandler = (event: SubmitEvent) => void

// Configuration types
export interface ThemeConfig {
  defaultTheme: 'light' | 'dark' | 'system'
  themes: string[]
  storageKey: string
}

export interface I18nConfig {
  defaultLocale: string
  locales: Record<string, string>
  fallbackLocale: string
  storageKey: string
}