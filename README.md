# ระบบเว็บไซต์ฝึกประสบการณ์สอน วิทยาลัยเทคนิคน่าน

ระบบสารสนเทศรวบรวมและจัดการข้อมูลการฝึกประสบการณ์สอน แผนกวิชาเทคโนโลยีสารสนเทศ วิทยาลัยเทคนิคน่าน ประกอบด้วย 2 ส่วนหลัก:
1. **Landing Page (8 เมนู)** — เว็บไซต์สาธารณะ แสดงข้อมูลสำหรับผู้เยี่ยมชม
2. **Admin Panel** — ระบบหลังบ้านสำหรับจัดการเนื้อหาทั้ง 8 เมนู (CRUD + Auth)

---

## 🚀 ฟีเจอร์หลัก (Key Features)

- **Landing Page (8 เมนูหลัก)**:
  - `1.1 หน้าแรก`: สถานศึกษา, ครูพี่เลี้ยง, นักศึกษาฝึกสอน
  - `1.2 สถานศึกษาฝึกประสบการณ์สอน`: ประวัติวิทยาลัย, คณะผู้บริหาร, ครูแผนก IT (10 ท่าน)
  - `1.3 ตารางสอน`: ตัวสลับ ภาคเรียนที่ 1 / ภาคเรียนที่ 2
  - `1.4 แผนการสอน`: ตัวสลับ ภาคเรียนที่ 1 / ภาคเรียนที่ 2 + เปิดอ่าน PDF / ดาวน์โหลด
  - `1.5 บันทึกการฝึกสอน`: ตัวสลับ ภาคเรียนที่ 1 / ภาคเรียนที่ 2 + บันทึกหลังสอน ปัญหาและแนวทางแก้ไข
  - `1.6 กิจกรรม`: ตัวสลับ ภาคเรียนที่ 1 / ภาคเรียนที่ 2 + แกลเลอรี่ภาพกิจกรรม
  - `1.7 วิจัยในชั้นเรียน`: ชื่อวิจัย, บทคัดย่อ, กลุ่มเป้าหมาย, ไฟล์แนบ
  - `1.8 แบบประเมินการฝึกสอน`: แยกตาม ครูพี่เลี้ยง / ผู้บริหาร / กรรมการสถานศึกษา
- **Admin Panel & Authentication**:
  - ระบบเข้าสู่ระบบด้วย JWT Token + Cookie Session
  - แดชบอร์ดภาพรวมสรุปสถิติมุมมองระดับบริหาร
  - CRUD Form (เพิ่ม, แก้ไข, ลบ) รองรับทั้ง 9 Tabs ข้อมูล
- **Dual Data Provider & Caching Layer**:
  - รองรับการทำงานในโหมด **Local File JSON Store** (พร้อมใช้งานทันที)
  - รองรับการเชื่อมต่อกับ **Google Sheets API** ผ่าน Service Account JWT พร้อมระบบ Cache ลด Request

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend & API**: Next.js 14 (App Router), TypeScript, React 18
- **Styling & Icons**: Tailwind CSS (โทนสีเขียวขาววิทยาลัยเทคนิคน่าน `#0F6E56` / `#97C459`), Lucide Icons
- **Authentication**: JWT (`jsonwebtoken`), Cookie Session Management
- **Database & API**: Google Sheets API (`googleapis`), Local File Persistence
- **Deployment**: Vercel / Render / Netlify

---

## 💻 วิธีการรันในเครื่อง (Local Setup)

1. **ติดตั้ง Dependencies**:
   ```bash
   npm install
   ```

2. **เริ่มระบบในโหมดพัฒนา (Development Mode)**:
   ```bash
   npm run dev
   ```
   เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

3. **ทดสอบเข้าใช้งานระบบ Admin**:
   - URL: `http://localhost:3000/admin/login`
   - **Username**: `admin`
   - **Password**: `admin123`

---

## 📊 การตั้งค่าเชื่อมต่อ Google Sheets API (Optional)

หากต้องการสลับฐานข้อมูลไปใช้ Google Sheets ให้ตั้งค่าไฟล์ `.env.local`:

```env
DATA_SOURCE=google_sheets
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## 🌐 การ Deploy ขึ้น Production (Vercel / Render)

1. Push โค้ดขึ้น **GitHub**
2. เชื่อมต่อ Repository บน **Vercel** หรือ **Render**
3. กำหนดตัวแปรสภาพแวดล้อม (Environment Variables) ในหน้า Dashboard ของ Vercel
4. ระบบจะทำการ Build และ Deploy โดยอัตโนมัติ พร้อมใช้งานผ่าน HTTPS ถาวร
