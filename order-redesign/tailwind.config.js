/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Graphik', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        ink: 'rgb(33, 43, 54)',
        muted: 'rgb(167, 169, 171)',
        line: 'rgb(192, 192, 192)',
        brand: {
          DEFAULT: 'rgb(80, 25, 160)',
          link: 'rgb(26, 13, 171)',
        },
        accent: 'rgb(217, 26, 122)',
        success: 'rgb(0, 182, 122)',
        progress: 'rgb(255, 153, 31)',
        chip: {
          warn: 'rgb(255, 213, 153)',
          warnInk: 'rgb(180, 95, 6)',
          danger: 'rgb(220, 38, 38)',
        },
        page: '#FFFFFF',
        surface: '#FFFFFF',
        searchBg: 'rgb(244, 240, 250)',
      },
      fontSize: {
        body: ['14px', '20px'],
        small: ['12px', '16px'],
        section: ['14px', '20px'],
        page: ['20px', '28px'],
      },
      borderRadius: {
        card: '16px',
        btn: '8px',
      },
      maxWidth: {
        mobile: '430px',
      },
    },
  },
  plugins: [],
}
