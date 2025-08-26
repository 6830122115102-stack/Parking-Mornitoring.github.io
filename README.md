# 🚗 Parking System Monitor

ระบบมอนิเตอร์ลานจอดรถแบบ Web Application ที่พัฒนาด้วย React.js

## ✨ Features

### 📊 Dashboard
- แสดงสถิติการใช้งานระบบ
- กราฟแสดงอัตราการเข้าใช้ของผู้ใช้บริการ
- ข้อมูลรายวัน, รายเดือน, ไตรมาศ, รายปี
- บล็อกแสดงข้อมูลสำคัญ 3 ด้าน

### 🚗 Parking Allotment
- แสดงลานจอดรถแบบ Grid 4 Sections (A, B, C, D)
- แต่ละ Section มี 8 parking spots
- คลิกขวาเพื่อเปลี่ยนสถานะ (Available/Occupied)
- แสดง car.png เมื่อสถานะเป็น Occupied
- Layout สมมาตรและสวยงาม

### 👥 Users Management
- ตารางแสดงรายชื่อผู้ใช้
- ระบบค้นหาและกรองข้อมูล
- แสดงสถานะและบทบาทของผู้ใช้
- สถิติจำนวนผู้ใช้

### 📈 Reports
- รายงานการใช้งานระบบจอดรถ
- ข้อมูลจำนวนรถ, เวลาจอดเฉลี่ย, ผู้ใช้เฉลี่ย
- ตารางรายงานรายวัน/สัปดาห์/เดือน
- กราฟแสดงจำนวนรถ

### ⚙️ Settings
- การตั้งค่าระบบต่างๆ
- แบ่งเป็นหมวดหมู่: General, Notifications, Security, Parking, System

## 🛠️ Technologies

- **Frontend:** React.js
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Build Tool:** Create React App

## 🚀 Installation

1. Clone repository:
```bash
git clone [your-repository-url]
cd parking-system-monitor
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── App.js              # Main application component
│   ├── Sidebar.js          # Navigation sidebar
│   ├── Header.js           # Top header bar
│   ├── Dashboard.js        # Dashboard page
│   ├── ParkingAllotment.js # Parking spots management
│   ├── ParkingSpot.js      # Individual parking spot
│   ├── Users.js            # Users management
│   ├── Report.js           # Reports and statistics
│   └── Settings.js         # System settings
├── index.js                # Application entry point
└── index.css               # Global styles
```

## 🎨 Design System

### Colors
- **Primary:** Orange (#f97316)
- **Sidebar:** Dark Gray (#1f2937)
- **Background:** Light Gray (#f9fafb)
- **Available:** White
- **Occupied:** Dark Blue (#1e40af)
- **Selected:** Orange (#f97316)

### Layout
- **Sidebar:** 320px width
- **Grid:** 4 columns responsive
- **Cards:** Rounded corners with shadows
- **Typography:** Clean and modern

## 📱 Responsive Design

- Desktop-first approach
- Responsive grid layouts
- Mobile-friendly navigation
- Adaptive card layouts

## 🔧 Customization

### Adding New Sections
1. Create new component in `src/components/`
2. Add to menu items in `Sidebar.js`
3. Add route in `App.js`

### Modifying Parking Grid
- Edit `parkingSpots` data in `ParkingAllotment.js`
- Modify `ParkingSpot.js` for individual spot styling
- Update colors in `tailwind.config.js`

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Parking System Monitor Team
