export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        dark: {
          bg: '#0a0e1a',
          card: '#151b2b',
          hover: '#1a2235',
          border: '#1f2937'
        },
        accent: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444'
        }
      }
    }
  },
  plugins: []
}
