# 🔧 CORS Error Fix Guide

## ❌ Vấn đề

Khi call API từ localhost, bạn gặp lỗi CORS:
```
Access to XMLHttpRequest at 'https://system.kingcontent.pro/api/v1/user/login' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Nguyên nhân:** API server không cho phép request từ localhost (khác origin).

---

## ✅ Giải pháp đã implement

### **1. Vite Proxy Configuration**

File `vite.config.ts` đã được config proxy:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'https://system.kingcontent.pro',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, '/api'),
    },
  },
}
```

**Cách hoạt động:**
- Request từ browser: `http://localhost:5173/api/v1/user/login`
- Vite proxy chuyển thành: `https://system.kingcontent.pro/api/v1/user/login`
- API server nhận request từ Vite server (không phải browser) → Không bị CORS

### **2. Auth Service Update**

File `src/services/auth.service.ts` đã được cập nhật:

```typescript
const API_BASE_URL = import.meta.env.DEV 
  ? '/api/v1'  // Development: Use proxy
  : 'https://system.kingcontent.pro/api/v1'; // Production: Direct URL
```

---

## 🚀 Cách sử dụng

### **Bước 1: Restart Dev Server**

```bash
# Stop server hiện tại (Ctrl + C)
# Start lại
yarn dev
```

### **Bước 2: Test Login**

1. Truy cập: `http://localhost:5173/login`
2. Nhập credentials:
   - Email: `hieu195`
   - Password: `Hieu1905`
3. Click "Đăng nhập"
4. ✅ Sẽ login thành công!

---

## 🔍 Debug

### **Check Network Tab**

1. Mở DevTools (F12)
2. Tab Network
3. Login
4. Xem request:
   - **URL**: `http://localhost:5173/api/v1/user/login` (proxied)
   - **Status**: 200 OK
   - **Response**: Token và user data

### **Check Console**

Proxy logs sẽ hiển thị trong terminal:
```
Sending Request to the Target: POST /api/v1/user/login
Received Response from the Target: 200 /api/v1/user/login
```

---

## 🎯 Giải pháp thay thế

### **Option 1: Browser Extension (Quick Fix)**

Install extension để disable CORS trong development:
- Chrome: "CORS Unblock"
- Firefox: "CORS Everywhere"

⚠️ **Chỉ dùng cho development, không dùng cho production!**

### **Option 2: Backend Config (Best Solution)**

Yêu cầu backend team thêm CORS headers:

```javascript
// Backend (Node.js/Express example)
app.use(cors({
  origin: ['http://localhost:5173', 'https://kingcontent.pro'],
  credentials: true,
}));
```

### **Option 3: Nginx Reverse Proxy (Production)**

```nginx
location /api {
    proxy_pass https://system.kingcontent.pro;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

---

## 📝 Environment Variables

Tạo file `.env` trong root folder:

```env
# API Configuration
VITE_API_BASE_URL=https://system.kingcontent.pro/api/v1

# App Configuration
VITE_APP_NAME=AI Video Generator
```

Sử dụng trong code:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

---

## 🔒 Production Build

Khi build production, proxy không hoạt động. Cần:

### **Option 1: Direct API Call**

Code đã handle tự động:
```typescript
const API_BASE_URL = import.meta.env.DEV 
  ? '/api/v1'  // Dev: proxy
  : 'https://system.kingcontent.pro/api/v1'; // Prod: direct
```

### **Option 2: Environment Variable**

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
```

Build với env:
```bash
VITE_API_BASE_URL=https://system.kingcontent.pro/api/v1 yarn build
```

---

## 🐛 Troubleshooting

### **Lỗi: Proxy không hoạt động**

1. **Restart dev server:**
   ```bash
   yarn dev
   ```

2. **Check vite.config.ts:**
   - Đảm bảo proxy config đúng
   - Check indentation

3. **Check console logs:**
   - Xem có log "Sending Request to the Target" không

### **Lỗi: 404 Not Found**

- Check API endpoint path
- Đảm bảo rewrite rule đúng

### **Lỗi: 500 Internal Server Error**

- Check request body format
- Check headers
- Xem response trong Network tab

### **Lỗi: Timeout**

- Tăng timeout trong axios config:
  ```typescript
  timeout: 60000, // 60 seconds
  ```

---

## ✅ Checklist

- [x] Vite proxy configured
- [x] Auth service updated
- [x] Dev/Prod environment handling
- [x] Error handling
- [x] Logging for debug

---

## 📚 Tài liệu tham khảo

- [Vite Server Proxy](https://vitejs.dev/config/server-options.html#server-proxy)
- [Axios Configuration](https://axios-http.com/docs/req_config)
- [CORS MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Updated**: 2026-01-29  
**Status**: ✅ Fixed  
**Solution**: Vite Proxy + Environment-based API URL

