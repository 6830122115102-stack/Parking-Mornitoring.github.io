# 🚗 Parking System Backend API

Backend API สำหรับระบบมอนิเตอร์ลานจอดรถ พัฒนาด้วย Node.js, Express และ Supabase

## 🛠️ Technologies

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Real-time:** Supabase Realtime

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
สร้างไฟล์ `config.env` และใส่ค่า Supabase credentials:
```env
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. Database Setup
1. ไปที่ Supabase Dashboard
2. เปิด SQL Editor
3. รันไฟล์ `database/schema.sql`

### 4. Start Development Server
```bash
npm run dev
```

## 📡 API Endpoints

### Health Check
- `GET /api/health` - ตรวจสอบสถานะ API

### Parking Spots
- `GET /api/parking/spots` - ดึงข้อมูล parking spots ทั้งหมด
- `GET /api/parking/spots/:id` - ดึงข้อมูล parking spot เฉพาะ
- `PUT /api/parking/spots/:id/status` - อัปเดตสถานะ parking spot
- `POST /api/parking/spots/:id/occupy` - จอง parking spot
- `DELETE /api/parking/spots/:id/release` - ปล่อย parking spot
- `GET /api/parking/stats` - สถิติ parking spots

### Users (Supabase Auth)
- `GET /api/users` - ดึงข้อมูลผู้ใช้ทั้งหมด (admin only)
- `GET /api/users/:id` - ดึงข้อมูลผู้ใช้เฉพาะ
- `POST /api/users/register` - ลงทะเบียนผู้ใช้ใหม่
- `POST /api/users/login` - เข้าสู่ระบบ
- `POST /api/users/logout` - ออกจากระบบ
- `GET /api/users/profile/me` - ดึงข้อมูลโปรไฟล์ผู้ใช้ปัจจุบัน
- `PUT /api/users/profile` - อัปเดตโปรไฟล์ผู้ใช้
- `DELETE /api/users/:id` - ลบผู้ใช้ (admin only)

### Reports
- `GET /api/reports/daily` - รายงานรายวัน
- `GET /api/reports/weekly` - รายงานรายสัปดาห์
- `GET /api/reports/monthly` - รายงานรายเดือน
- `GET /api/reports/analytics` - สรุปสถิติ
- `GET /api/reports/history` - ประวัติการจอดรถ

## 🗄️ Database Schema

### Tables

#### `parking_spots`
- `id` - Primary Key
- `spot_id` - รหัสที่จอด (A01, B02, etc.)
- `section` - หมวดหมู่ (A, B, C, D)
- `status` - สถานะ (available/occupied)
- `occupied_by` - User ID ที่จอง
- `occupied_at` - เวลาที่จอง
- `released_at` - เวลาที่ปล่อย
- `created_at` - เวลาสร้าง
- `updated_at` - เวลาอัปเดต

#### `parking_history`
- `id` - Primary Key
- `spot_id` - รหัสที่จอด
- `user_id` - User ID
- `action` - การกระทำ (occupy/release)
- `timestamp` - เวลาที่ทำการ
- `duration_minutes` - ระยะเวลาจอด (นาที)

#### `reports`
- `id` - Primary Key
- `report_date` - วันที่รายงาน
- `total_cars` - จำนวนรถทั้งหมด
- `avg_parking_time` - เวลาจอดเฉลี่ย
- `total_revenue` - รายได้รวม
- `created_at` - เวลาสร้าง

## 🔐 Security Features

- **Row Level Security (RLS)** - ควบคุมการเข้าถึงข้อมูล
- **Supabase Auth** - ระบบยืนยันตัวตน
- **CORS Protection** - ป้องกัน Cross-Origin requests
- **Input Validation** - ตรวจสอบข้อมูลนำเข้า

## 📊 Real-time Features

- **Live Parking Updates** - อัปเดตสถานะที่จอดแบบ Real-time
- **WebSocket Support** - เชื่อมต่อแบบ Real-time
- **Auto-refresh** - รีเฟรชข้อมูลอัตโนมัติ

## 🧪 Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Get parking spots
curl http://localhost:5000/api/parking/spots

# Get parking stats
curl http://localhost:5000/api/parking/stats
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | ✅ |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `PORT` | Server port | ❌ (default: 5000) |
| `NODE_ENV` | Environment | ❌ (default: development) |
| `CORS_ORIGIN` | CORS origin | ❌ (default: http://localhost:3000) |

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```bash
docker build -t parking-system-backend .
docker run -p 5000:5000 parking-system-backend
```

## 📁 Project Structure

```
backend/
├── config/
│   └── supabase.js          # Supabase configuration
├── database/
│   └── schema.sql           # Database schema
├── routes/
│   ├── parking.js           # Parking spots routes
│   ├── users.js             # User management routes
│   └── reports.js           # Reports routes
├── server.js                # Main server file
├── package.json             # Dependencies
├── config.env               # Environment variables
└── README.md                # This file
```

## 🔧 Development

### Adding New Routes
1. สร้างไฟล์ใหม่ใน `routes/`
2. Export router
3. Import ใน `server.js`
4. เพิ่ม middleware

### Database Changes
1. แก้ไข `database/schema.sql`
2. รันใน Supabase SQL Editor
3. อัปเดต API routes ตามต้องการ

## 📞 Support

หากมีปัญหาหรือคำถาม ติดต่อทีมพัฒนา Parking System

---

**Made with ❤️ by Parking System Team**
