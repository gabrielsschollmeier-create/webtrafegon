/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /* Estrutura de superfícies */
        sidebar:        '#12141e',
        surface:        '#ffffff',
        'surface-2':    '#eceef8',
        bg:             '#edf0f7',
        border:         '#e0e3f0',

        /* Marca */
        accent:         '#6eda2c',
        'accent-hover': '#5bc424',
        'accent-dim':   '#6eda2c18',
        purple:         '#be29ec',
        'purple-dim':   '#be29ec15',
        orange:         '#ea8a29',
        'orange-dim':   '#ea8a2915',

        /* Status */
        success:        '#6eda2c',
        warning:        '#ea8a29',
        danger:         '#ef4444',

        /* Tipografia */
        text:           '#111827',
        'text-2':       '#3d4575',
        muted:          '#7680a8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
