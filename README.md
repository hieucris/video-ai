# Video AI Generator 🎥

Ứng dụng tạo video AI với giao diện hiện đại, được xây dựng bằng React 19, TypeScript, TailwindCSS và Framer Motion.

## 🚀 Quick Start

### Cài đặt

```bash
npm install
```

### Cấu hình Environment Variables (Tùy chọn)

Tính năng AI Prompt Enhancement có 2 chế độ:
- **Chế độ cơ bản** (không cần API key): Tự động cải thiện prompt bằng rules
- **Chế độ AI nâng cao** (cần API key): Sử dụng Groq AI (Llama 3.3 70B) - **MIỄN PHÍ & CỰC NHANH!** ⚡

#### Để sử dụng chế độ AI nâng cao (FREE):

1. **Lấy FREE API Key từ Groq:**
   - Truy cập: https://console.groq.com/keys
   - Đăng nhập (hoặc đăng ký miễn phí)
   - Click **"Create API Key"**
   - Đặt tên và copy API key (bắt đầu với `gsk_...`)

2. **Cấu hình trong project:**
   ```bash
   # Mở file .env (đã được tạo sẵn)
   # Thêm API key của bạn:
   VITE_GROQ_API_KEY=gsk_your_groq_api_key_here
   ```

3. **Restart dev server:**
   ```bash
   # Dừng server hiện tại (Ctrl+C)
   # Chạy lại
   npm run dev
   ```

> ✨ **TẠI SAO CHỌN GROQ?**
> - 🆓 **MIỄN PHÍ 100%** - Free tier rất hào phóng
> - ⚡ **CỰC NHANH** - Nhanh hơn OpenAI 10-20 lần
> - 🚀 **MẠNH MẼ** - Sử dụng Llama 3.3 70B (tương đương GPT-4)
> - 💪 **KHÔNG GIỚI HẠN** - Free tier: 30 requests/minute
>
> ⚠️ **BẢO MẬT**: 
> - File `.env` đã được thêm vào `.gitignore` - an toàn khi commit
> - **KHÔNG BAO GIỜ** chia sẻ API key công khai
> - Nếu vô tình lộ API key, hãy xóa (revoke) ngay tại Groq Console

### Chạy development

```bash
npm run dev
```

### Build production

```bash
npm run build
```

## ✨ Tính năng

- 📤 Upload ảnh để tạo video
- 📝 Nhập prompt mô tả video
- ✨ **AI Prompt Enhancement** - Click vào icon Sparkles để AI tự động cải thiện và tối ưu prompt của bạn
  - 🆓 **MIỄN PHÍ** với Groq AI (Llama 3.3 70B)
  - ⚡ **CỰC NHANH** - Nhanh hơn OpenAI 10-20 lần
  - 🎯 Chất lượng tương đương GPT-4
- 📱 Hỗ trợ 2 tỷ lệ khung hình: 9:16 (dọc) và 16:9 (ngang)
- 🎬 Chất lượng video: 720p và 1080p
- 🎨 UI/UX hiện đại với animations
- 🗂️ Sidebar navigation
- 📦 Component-based architecture

## 🛠️ Tech Stack

- React 19
- TypeScript
- Vite
- TailwindCSS
- React Router
- Framer Motion
- Lucide Icons

## 📄 License

MIT License
