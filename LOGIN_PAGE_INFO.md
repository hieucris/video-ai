# 🔐 Login Page - AI Video Generator

## ✨ Tính năng

Trang đăng nhập đẹp mắt, hiện đại với UI tương tự FPT.eTCS nhưng được tùy chỉnh cho project Video AI.

### 🎨 Thiết kế

#### **Bên Trái (Desktop)** - Minh họa Video AI
- ✅ Gradient nền xanh-tím-đỏ tím (blue-indigo-purple)
- ✅ Hiệu ứng lưới nền (grid pattern)
- ✅ Minh họa thiết bị 3D với:
  - Video preview với icon
  - Progress bars có animation
  - Stats cards (Quality, Ratio, AI)
- ✅ Floating elements với animation:
  - Icon Sparkles (✨)
  - Icon phim (🎬)
- ✅ Text content:
  - "AI Video Generator"
  - "Tạo video từ ảnh và văn bản"
  - "Nhanh chóng • Dễ dàng • Chuyên nghiệp"
- ✅ Animations: Float, rotate, pulse effects

#### **Bên Phải** - Form đăng nhập
- ✅ Logo và language selector (🇻🇳/🇬🇧)
- ✅ Card đăng nhập với shadow đẹp
- ✅ Form fields:
  - Tên đăng nhập
  - Mật khẩu (có toggle show/hide)
  - Checkbox "Ghi nhớ đăng nhập"
  - Link "Quên mật khẩu?"
- ✅ Button đăng nhập với gradient violet-purple
- ✅ Loading state với animation
- ✅ Social login buttons:
  - Microsoft (với logo màu)
  - Google (với logo màu)
- ✅ Link đăng ký
- ✅ Footer với links

### 🎯 Màu sắc chủ đạo

- **Primary**: Violet (#7c3aed) → Purple (#9333ea)
- **Background Left**: Blue (#2563eb) → Indigo (#4338ca) → Purple (#6b21a8)
- **Background Right**: Gray-50 → Purple-50
- **Accents**: White/10, White/20 cho glass morphism

### 🚀 Tính năng kỹ thuật

1. **Responsive Design**
   - Mobile: Chỉ hiện form đăng nhập
   - Desktop: Split screen với illustration

2. **Animations**
   - Framer Motion cho smooth transitions
   - Float effects cho illustration
   - Hover effects cho buttons
   - Loading spinner

3. **Form Validation**
   - Required fields
   - Password toggle
   - Remember me checkbox

4. **Navigation**
   - Sau khi login thành công → redirect to `/dashboard`
   - Simulated API call (1.5s delay)

### 📁 File Structure

```
src/
├── pages/
│   ├── Login.tsx          ← Trang login mới
│   └── index.ts           ← Export Login
└── App.tsx                ← Thêm route /login
```

### 🔗 Routes

- `/login` - Trang đăng nhập (không có sidebar/header)
- `/dashboard` - Trang chính sau khi login

### 💡 Cách sử dụng

1. Truy cập: `http://localhost:5173/login`
2. Nhập username và password bất kỳ
3. Click "Đăng nhập"
4. Sẽ redirect về `/dashboard` sau 1.5s

### 🎨 Customization

Để thay đổi màu sắc hoặc nội dung:

1. **Màu gradient bên trái**: 
   ```tsx
   className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"
   ```

2. **Logo và tên app**:
   ```tsx
   <span className="text-2xl font-bold">AI Video</span>
   ```

3. **Social login providers**:
   Thêm/xóa buttons trong phần "Social Login Buttons"

### 🔒 Security Notes

- Hiện tại là demo UI, chưa có authentication thật
- Cần implement:
  - API call thật cho login
  - JWT token storage
  - Protected routes
  - Session management

### 📱 Screenshots

**Desktop View**:
- Split screen: Illustration (trái) + Form (phải)
- Animated 3D device mockup
- Floating elements

**Mobile View**:
- Full screen login form
- Illustration ẩn đi
- Optimized cho màn hình nhỏ

---

**Created**: 2026-01-29
**Version**: 1.0.0
**Design inspired by**: FPT.eTCS Login
**Customized for**: AI Video Generator Project

