/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",  // สำหรับ Expo Router
    "./components/**/*.{js,ts,jsx,tsx}", // ถ้าคุณมีโฟลเดอร์ components เพิ่มเติม
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e40af",     // 🔵 เพิ่มสีหลักของแอป
        secondary: "#9333ea",   // 🟣 เพิ่มสีรอง
      },
    },
  },
  plugins: [],
};
