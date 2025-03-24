/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '12px',
      },
      screens: {
        DEFAULT: '1140px',
      },
    },
    extend: {
      boxShadow: {
        custom1: '0 0 23px 0 rgba(49, 144, 221, 0.53)',
        custom2: '0 0 25px 0 rgba(56, 170, 223, 0.25)',
        custom3: '2px 2px 2px 0px rgba(47, 142, 221, 0.32)',
        custom4: '1px 1px 5px 0px rgba(40, 140, 204, 0.75)',
        custom5: '0px 0px 20px 5px rgba(47, 142, 221, 0.22)',
        custom6: '3px 3px 3px 0px rgba(0, 0, 0, 0.22)',
        customInner1: 'rgba(0, 0, 0, 0.22) 0px 1px 4px inset',
      },
      fontFamily: {
        acuminCondensedRegular: ['var(--acuminCondensedRegular)'],
        acuminCondensedBold: ['var(--acuminCondensedBold)'],
        acuminProRegular: ['var(--acuminProRegular)'],
        acuminProThin: ['var(--acuminProThin)'],
        acuminProExtraLight: ['var(--acuminProExtraLight)'],
        acuminProLight: ['var(--acuminProLight)'],
        acuminProMedium: ['var(--acuminProMedium)'],
        acuminProSemibold: ['var(--acuminProSemibold)'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: {
          DEFAULT: '#38aadf',
          50: '#f2f9fd',
          100: '#e3f1fb',
          200: '#c2e3f5',
          300: '#8bcdee',
          400: '#38aadf',
          500: '#279ad0',
          600: '#187bb1',
          700: '#15638f',
          800: '#155477',
          900: '#174663',
          950: '#0f2d42',
        },
        tersiary: {
          DEFAULT: '#3fbee7',
        },
      },
      keyframes: {
        wobble: {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-10px) rotate(-2deg)' },
          '30%': { transform: 'translateX(8px) rotate(1deg)' },
          '45%': { transform: 'translateX(-6px) rotate(-1deg)' },
          '60%': { transform: 'translateX(4px) rotate(0.5deg)' },
          '75%': { transform: 'translateX(-2px) rotate(-0.2deg)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      animation: {
        wobble: 'wobble 1s ease-in-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        'fade-out': 'fade-out 0.4s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
