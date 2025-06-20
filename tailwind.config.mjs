/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			// Design System Colors
			colors: {
				// Primary brand colors
				primary: {
					50: '#fffbeb',
					100: '#fef3c7',
					200: '#fde68a',
					300: '#fcd34d',
					400: '#fbbf24',
					500: '#f59e0b', // Main yellow
					600: '#d97706',
					700: '#b45309',
					800: '#92400e',
					900: '#78350f',
				},
				// Accent colors for technologies
				accent: {
					python: '#306998',
					javascript: '#f7df1e',
					typescript: '#3178c6',
					nextjs: '#000000',
					react: '#61dafb',
					tailwind: '#06b6d4',
					astro: '#ff5d01',
					github: '#181717',
					linkedin: '#0077b5',
				},
				// Semantic colors
				success: {
					50: '#ecfdf5',
					100: '#d1fae5',
					500: '#10b981',
					600: '#059669',
				},
				warning: {
					50: '#fffbeb',
					100: '#fef3c7',
					500: '#f59e0b',
					600: '#d97706',
				},
				error: {
					50: '#fef2f2',
					100: '#fee2e2',
					500: '#ef4444',
					600: '#dc2626',
				},
				// Neutral grays (enhanced)
				neutral: {
					50: '#fafafa',
					100: '#f5f5f5',
					200: '#e5e5e5',
					300: '#d4d4d4',
					400: '#a3a3a3',
					500: '#737373',
					600: '#525252',
					700: '#404040',
					800: '#262626',
					900: '#171717',
					950: '#0a0a0a',
				}
			},
			// Typography System
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1.16' }],
				'6xl': ['3.75rem', { lineHeight: '1.1' }],
			},
			// Spacing System
			spacing: {
				'section': '5rem',      // 80px - Consistent section spacing
				'section-sm': '3rem',   // 48px - Small section spacing
				'card': '1.5rem',       // 24px - Card padding
				'gutter': '1rem',       // 16px - Component gutters
			},
			// Border Radius System  
			borderRadius: {
				'card': '0.75rem',      // 12px - Card border radius
				'button': '0.5rem',     // 8px - Button border radius
				'input': '0.375rem',    // 6px - Input border radius
			},
			// Shadow System
			boxShadow: {
				'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
				'dropdown': '0 10px 25px rgba(0, 0, 0, 0.15)',
			},
			// Animation System
			animation: {
				'fade-in': 'fadeIn 0.3s ease-in-out',
				'slide-up': 'slideUp 0.3s ease-out',
				'scale-in': 'scaleIn 0.2s ease-out',
				'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				scaleIn: {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				bounceSubtle: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-4px)' },
				},
			},
			// Transition System
			transitionDuration: {
				'fast': '150ms',
				'normal': '300ms',
				'slow': '500ms',
			},
			transitionTimingFunction: {
				'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		// Custom utilities plugin
		function({ addUtilities }) {
			const newUtilities = {
				// Consistent focus styles
				'.focus-ring': {
					'&:focus': {
						outline: '2px solid transparent',
						'outline-offset': '2px',
						'box-shadow': '0 0 0 2px var(--tw-ring-color)',
						'--tw-ring-color': 'rgb(249 115 22 / 0.5)',
					},
				},
				// Text gradient utility
				'.text-gradient': {
					'background': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
					'-webkit-background-clip': 'text',
					'-webkit-text-fill-color': 'transparent',
					'background-clip': 'text',
				},
				// Glass effect utility
				'.glass': {
					'background': 'rgba(255, 255, 255, 0.1)',
					'backdrop-filter': 'blur(10px)',
					'border': '1px solid rgba(255, 255, 255, 0.2)',
				},
				'.glass-dark': {
					'background': 'rgba(0, 0, 0, 0.1)',
					'backdrop-filter': 'blur(10px)',
					'border': '1px solid rgba(255, 255, 255, 0.1)',
				},
			}
			addUtilities(newUtilities)
		}
	],
}
