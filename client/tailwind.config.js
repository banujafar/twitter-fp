/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xxs: '180px',
      xs: '320px',
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
   
    extend: {
      colors:{
        primaryGray: "#71767B",
        twitterColor: "#1DA1F2",
        navHoverColor: "rgba(15, 20, 25, 0.1)"
      }
    },
   
  },
  plugins: [],
};
