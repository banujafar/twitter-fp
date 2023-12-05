/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xxs: '180px',
      xs: '320px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px'
    },
    container: {
      center: true,
      padding: {
        default: '20px', 
        sm: '0',
        xs:'0',
        xxs:'0'
      }
    },
    extend: {
      colors:{
        primaryGray: "#71767B",
        twitterColor: "#1DA1F2",
        navHoverColor: "rgba(15, 20, 25, 0.1)"
      },
      boxShadow: {
        'logout': 'rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px',
      },
      borderRadius:{
        'circle':'50%'

      }
    },
  },
  plugins: [],
};
