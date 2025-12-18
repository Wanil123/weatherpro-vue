/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      // Police moderne
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },

      // Animations météo
      keyframes: {
        'sun-rays': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(20deg)' }
        },
        'clouds': {
          '0%': { transform: 'translateX(-10%)' },
          '100%': { transform: 'translateX(10%)' }
        },
        'rain-drops': {
          '0%': { transform: 'translateY(-10%)', opacity: '0.7' },
          '100%': { transform: 'translateY(10%)', opacity: '0.2' }
        },
        'snowflakes': {
          '0%': { transform: 'translateY(-10%) rotate(0deg)' },
          '100%': { transform: 'translateY(10%) rotate(180deg)' }
        },
        'lightning': {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      },
      animation: {
        'sun-rays': 'sun-rays 6s ease-in-out infinite',
        'clouds': 'clouds 20s linear infinite alternate',
        'rain-drops': 'rain-drops 1s linear infinite',
        'snowflakes': 'snowflakes 4s linear infinite',
        'lightning': 'lightning 0.8s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite'
      },

      // Ombres personnalisées
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.15)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.1)'
      },

      // Couleurs personnalisées
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.25)',
          dark: 'rgba(15, 23, 42, 0.5)'
        }
      },

      // Backdrop blur
      backdropBlur: {
        'xs': '2px',
        '3xl': '64px'
      },

      // Border radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem'
      },

      // Spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },

      // Z-index
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100'
      },

      // Transitions
      transitionDuration: {
        '400': '400ms'
      },

      // Timing functions
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },
  plugins: []
}
