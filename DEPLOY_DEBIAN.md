# คู่มือการ Deploy ระบบฝึกประสบการณ์สอนบน Debian Server

คู่มือนี้แนะนำขั้นตอนการ Deploy เว็บไซต์บนระบบปฏิบัติการ **Debian 11 / 12** แบบ Production พร้อมติดตั้ง Nginx และ Node.js

---

## 1. เตรียม Server (Debian)

อัปเดตระบบและติดตั้งเครื่องมือพื้นฐาน:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx ufw
```

ติดตั้ง **Node.js (LTS v20 หรือ v22)**:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v # ตรวจสอบเวอร์ชัน Node.js
npm -v  # ตรวจสอบเวอร์ชัน NPM
```

---

## 2. Clone โปรเจกต์จาก GitHub

```bash
cd /var/www
sudo git clone https://github.com/whipcreamm/teaching-practice.git
cd teaching-practice
sudo chown -R $USER:$USER /var/www/teaching-practice
```

---

## 3. ข้อมูลรูปภาพและการซิงค์ข้อมูล (Images & Data Sync)

ระบบรองรับไฟล์ `src/data.json` ที่บันทึกข้อมูลและรูปภาพทั้งหมด (รวม Base64 และ URL):
1. กดปุ่ม **"ดาวน์โหลดไฟล์ Data (Export JSON)"** ในหน้า Admin Dashboard ของเว็บในเครื่อง
2. นำไฟล์ที่ได้มาแทนที่หรือวางทับที่ `src/data.json` ในโปรเจกต์
3. ทำการติดตั้ง Dependencies และ Build เว็บไซต์:
   ```bash
   npm install
   npm run build
   ```
   *(ผลลัพธ์ไฟล์เว็บจะอยู่ในโฟลเดอร์ `/var/www/teaching-practice/dist`)*

---

## 4. ตั้งค่า Nginx สำหรับ Serve เว็บไซต์ (Production)

สร้างไฟล์ Virtual Host สำหรับ Nginx:
```bash
sudo nano /etc/nginx/sites-available/teaching-practice
```

ใส่การตั้งค่าดังนี้ (เปลี่ยน `your_domain_or_ip` เป็นชื่อโดเมนหรือไอพีของเซิร์ฟเวอร์):
```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    root /var/www/teaching-practice/dist;
    index index.html;

    # รองรับ Single Page Application (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Caching สำหรับไฟล์ Assets รูปภาพและโค้ด
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|heic|webp|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # เพิ่มขนาด Client Max Body Size สำหรับอัปโหลดรูป
    client_max_body_size 50M;

    error_page 404 /index.html;
}
```

เปิดใช้งาน Site และรีสตาร์ต Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/teaching-practice /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

ตั้งค่า Firewall (ถ้ามี):
```bash
sudo ufw allow 'Nginx Full'
```

---

## 5. การอัปเดตระบบด้วย deploy.sh

ในโปรเจกต์มีสคริปต์ `deploy.sh` เตรียมไว้ให้แล้ว ให้สิทธิ์การรัน:
```bash
chmod +x deploy.sh
```

เมื่อต้องการอัปเดตโค้ดหรือข้อมูลใหม่ เพียงรัน:
```bash
./deploy.sh
```
