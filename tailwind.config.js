/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          dark: '#352B23',    // 深复古棕主背景色
          card: '#EFECE6',    // 米白/浅卡其色卡片
          accent: '#E5B883',  // 高级金/高亮色
          border: '#4A3E34'   // 边框分隔线色
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      }
    },
  },
  plugins: [],
}