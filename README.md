# 📺 WebTV Digital Signage

Hệ thống Digital Signage hiển thị thông tin lên TV cho lãnh đạo trung tâm.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Ant Design |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| DevOps | Docker + Docker Compose |
| CI/CD | GitHub Actions |

## 📂 Cấu trúc dự án

```
WebTV/
├── backend/
│   ├── src/
│   │   ├── config/          # Database config
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/       # Auth, error handler, logger
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── seed.js          # Seed admin user
│   │   └── server.js        # Entry point
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance + API calls
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Auth context
│   │   ├── layouts/         # Admin layout
│   │   ├── pages/           # All pages
│   │   ├── App.jsx          # Router
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── .github/workflows/
│   └── ci-cd.yml
├── docker-compose.yml
└── README.md
```

## 🚀 Chạy Local (Development)

### Yêu cầu
- Node.js >= 18
- MongoDB đang chạy trên `localhost:27017`

### 1. Backend

```bash
cd backend
cp .env.example .env    # Chỉnh sửa nếu cần
npm install
npm run seed            # Tạo tài khoản admin
npm run dev             # Chạy trên port 5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev             # Chạy trên port 3000
```

### 3. Truy cập

| Trang | URL |
|-------|-----|
| TV Display | http://localhost:3000/display |
| Login | http://localhost:3000/login |
| Dashboard | http://localhost:3000/dashboard |
| Quản lý ảnh | http://localhost:3000/admin/images |

**Tài khoản mặc định:** `admin` / `admin123`

## 🐳 Chạy với Docker

```bash
# Build & start tất cả services
docker-compose up --build -d

# Seed admin user
docker-compose exec backend node src/seed.js

# Xem logs
docker-compose logs -f

# Dừng
docker-compose down
```

Truy cập: `http://localhost` (port 80)

## 📡 API Endpoints

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|--------|
| GET | /api/health | ❌ | Health check |
| POST | /api/auth/login | ❌ | Đăng nhập |
| GET | /api/auth/me | ✅ | Thông tin user |
| GET | /api/images | ❌ | Danh sách ảnh |
| POST | /api/images | ✅ | Thêm ảnh |
| PUT | /api/images/:id | ✅ | Sửa ảnh |
| DELETE | /api/images/:id | ✅ | Xóa ảnh |

## 🚢 Deploy Production

### Với Docker Compose
1. Clone repo lên server
2. Chỉnh biến môi trường trong `docker-compose.yml`
3. `docker-compose up --build -d`
4. `docker-compose exec backend node src/seed.js`

### CI/CD (GitHub Actions)
Cần thiết lập secrets trong GitHub repo:
- `DOCKER_HUB_USERNAME` — Docker Hub username
- `DOCKER_HUB_TOKEN` — Docker Hub access token

Pipeline tự động: push `main` → build → push Docker images → Docker Hub.

## ⌨️ Phím tắt TV Display

| Phím | Chức năng |
|------|-----------|
| `F` | Toggle fullscreen |
| `→` | Slide tiếp theo |
| `←` | Slide trước |

## 📄 License

MIT
