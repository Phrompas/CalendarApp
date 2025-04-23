🗓️ CalendarApp
แอปพลิเคชันจัดการกิจกรรมแบบปฏิทิน พร้อมระบบล็อกอิน บันทึก ลบ แก้ไขกิจกรรม รองรับการใช้งานผ่านมือถือ (React Native + Expo) และเชื่อมต่อฐานข้อมูลผ่าน backend (Node.js + MySQL)

📂 โครงสร้างโปรเจกต์
CalendarApp/
├── backend/          # Node.js + Express + MySQL
├── frontend/         # React Native + Expo

git clone https://github.com/Phrompas/CalendarApp.git
cd CalendarApp

cd backend
npm install

.env
JWT_SECRET=supersecretkey
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=calendar_app

npm run dev

Import ฐานข้อมูล
สร้าง database ชื่อ calendar_app
mport ตาราง users และ events ตาม schema

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255),
  password VARCHAR(255)
);

CREATE TABLE events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  description TEXT,
  startTime DATETIME,
  endTime DATETIME,
  userId INT
);

cd ../frontend
npm install

npx expo start

🔐 ฟีเจอร์
 Login / Register

 JWT Token & AsyncStorage

 เพิ่ม ลบ แก้ไขกิจกรรม

 ปฏิทินแสดงกิจกรรมของแต่ละวัน

 Highlight วันที่มีกิจกรรม

 Double click วันที่เพื่อแก้ไขกิจกรรม

 ลบกิจกรรมอัตโนมัติเมื่อหมดเวลา

🛠️ Stack ที่ใช้

Layer	Technology
Frontend	React Native (Expo)
Backend	Node.js + Express
Database	MySQL (phpMyAdmin)
Auth	JWT + AsyncStorage
Date Picker	react-native-modal-datetime-picker
