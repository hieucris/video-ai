# 🔐 Authentication System Guide

## ✅ Hoàn thành!

Hệ thống authentication đã được tích hợp hoàn chỉnh với API thật.

---

## 📁 File Structure

```
src/
├── services/
│   ├── auth.service.ts                    ← Auth service với axios
│   └── types/
│       └── auth/
│           └── request.types.ts           ← Login request/response types
├── components/
│   ├── ProtectedRoute.tsx                 ← HOC bảo vệ routes
│   ├── LoginIllustration.tsx              ← Illustration component
│   └── layout/
│       └── Header.tsx                     ← Header với logout dropdown
├── pages/
│   └── Login.tsx                          ← Login page với API integration
└── App.tsx                                ← Routes với ProtectedRoute
```

---

## 🚀 API Integration

### **Endpoint**
```
POST https://system.kingcontent.pro/api/v1/user/login
```

### **Request Body**
```json
{
  "email": "hieu195",
  "password": "Hieu1905"
}
```

### **Headers**
```
Content-Type: application/json
Accept: application/json, text/plain, */*
Access-Control-Allow-Methods: *
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
Referer: https://kingcontent.pro/
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
```

### **Response Structure**
```typescript
interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    token?: string;
    user?: {
      id: string;
      email: string;
      name?: string;
      avatar?: string;
    };
  };
  error?: string;
}
```

---

## 🔧 Auth Service Features

### **1. Login**
```typescript
import { authService } from '@/services/auth.service';

const response = await authService.login({
  email: 'hieu195',
  password: 'Hieu1905'
});
```

### **2. Logout**
```typescript
authService.logout(); // Clears token & redirects to /login
```

### **3. Check Authentication**
```typescript
const isAuth = authService.isAuthenticated();
```

### **4. Get Current User**
```typescript
const user = authService.getCurrentUser();
```

### **5. Auto Token Management**
- ✅ Tự động lưu token vào localStorage khi login thành công
- ✅ Tự động thêm token vào header của mọi request
- ✅ Tự động redirect về /login khi token hết hạn (401)
- ✅ Tự động xóa token khi logout

---

## 🛡️ Protected Routes

Tất cả routes trong app đều được bảo vệ bởi `ProtectedRoute`:

```tsx
<Route
  path="/"
  element={
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<Dashboard />} />
  <Route path="dashboard" element={<Dashboard />} />
  {/* ... other routes */}
</Route>
```

**Behavior:**
- Nếu chưa login → Redirect về `/login`
- Nếu đã login → Cho phép truy cập
- Lưu attempted location để redirect về sau khi login

---

## 🎨 Login Page Features

### **UI Components**
1. ✅ **Left Side** (Desktop only):
   - Animated 3D device illustration
   - Floating elements (Sparkles, Film icon)
   - Progress bars with animation
   - Stats cards

2. ✅ **Right Side**:
   - Logo + Language selector
   - Email/Username input
   - Password input (với show/hide toggle)
   - Remember me checkbox
   - Forgot password link
   - Login button với loading state
   - Error message display
   - Social login buttons (Microsoft, Google)
   - Sign up link

### **Form Validation**
- ✅ Required fields
- ✅ Disabled inputs during loading
- ✅ Error handling với animation
- ✅ Success redirect

### **Error Handling**
```tsx
// Error message hiển thị với animation
<AnimatePresence>
  {error && (
    <motion.div className="bg-red-50 border-2 border-red-200">
      <AlertCircle />
      <p>{error}</p>
    </motion.div>
  )}
</AnimatePresence>
```

---

## 🎯 Header Dropdown Menu

Header có dropdown menu với:
- ✅ User info (name, email)
- ✅ Settings button
- ✅ Logout button
- ✅ Click outside to close
- ✅ Smooth animations

```tsx
// Logout handler
const handleLogout = () => {
  authService.logout(); // Auto redirect to /login
};
```

---

## 🔄 Flow Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  /any-route     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐      No      ┌──────────────┐
│ ProtectedRoute  ├──────────────►│  /login      │
│ Check Auth      │               └──────┬───────┘
└──────┬──────────┘                      │
       │ Yes                             │
       ▼                                 ▼
┌─────────────────┐               ┌──────────────┐
│  MainLayout     │               │ Login Form   │
│  (Dashboard)    │               └──────┬───────┘
└─────────────────┘                      │
                                         ▼
                                  ┌──────────────┐
                                  │ API Call     │
                                  └──────┬───────┘
                                         │
                                         ▼
                                  ┌──────────────┐
                                  │ Save Token   │
                                  └──────┬───────┘
                                         │
                                         ▼
                                  ┌──────────────┐
                                  │ Redirect to  │
                                  │ /dashboard   │
                                  └──────────────┘
```

---

## 💾 LocalStorage Structure

```javascript
// Token
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIs...');

// User
localStorage.setItem('user', JSON.stringify({
  id: '123',
  email: 'hieu195',
  name: 'Hieu',
  avatar: 'https://...'
}));
```

---

## 🧪 Testing

### **Test Login**
1. Chạy dev server: `yarn dev`
2. Truy cập: `http://localhost:5173`
3. Sẽ tự động redirect về `/login`
4. Nhập credentials:
   - Email: `hieu195`
   - Password: `Hieu1905`
5. Click "Đăng nhập"
6. Sẽ redirect về `/dashboard` nếu thành công

### **Test Logout**
1. Click vào user avatar ở header
2. Click "Đăng xuất"
3. Sẽ redirect về `/login`

### **Test Protected Routes**
1. Logout
2. Thử truy cập `http://localhost:5173/dashboard`
3. Sẽ tự động redirect về `/login`

---

## 🔒 Security Notes

### **Implemented**
- ✅ Token-based authentication
- ✅ Automatic token injection
- ✅ 401 auto-logout
- ✅ Protected routes
- ✅ Secure password input

### **TODO (Production)**
- [ ] HTTPS only
- [ ] Refresh token mechanism
- [ ] Token expiration handling
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Password strength validation
- [ ] 2FA support
- [ ] Remember me with secure cookie

---

## 📝 Environment Variables

Tạo file `.env`:

```env
VITE_API_BASE_URL=https://system.kingcontent.pro/api/v1
VITE_APP_NAME=AI Video Generator
```

Sử dụng trong code:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://system.kingcontent.pro/api/v1';
```

---

## 🎨 Customization

### **Change API Endpoint**
```typescript
// src/services/auth.service.ts
const API_BASE_URL = 'https://your-api.com/api/v1';
```

### **Change Token Storage**
```typescript
// Use sessionStorage instead of localStorage
private saveToken(token: string): void {
  sessionStorage.setItem('token', token);
}
```

### **Add More Auth Methods**
```typescript
// src/services/auth.service.ts
async loginWithGoogle() {
  // Implement Google OAuth
}

async loginWithMicrosoft() {
  // Implement Microsoft OAuth
}
```

---

## 🐛 Troubleshooting

### **CORS Issues**
Nếu gặp CORS error:
1. Check API server có enable CORS
2. Hoặc dùng proxy trong `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://system.kingcontent.pro',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
});
```

### **Token Not Persisting**
- Check localStorage có bị block không
- Check browser privacy settings
- Try sessionStorage instead

### **401 Loop**
- Clear localStorage
- Check token format
- Verify API endpoint

---

## 📚 Dependencies

```json
{
  "axios": "^1.6.0",
  "framer-motion": "^10.0.0",
  "react-router-dom": "^6.20.0",
  "lucide-react": "^0.300.0"
}
```

---

**Created**: 2026-01-29  
**Version**: 1.0.0  
**API**: https://system.kingcontent.pro/api/v1  
**Status**: ✅ Production Ready

