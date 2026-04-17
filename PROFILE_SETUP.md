# Hướng dẫn cài đặt chức năng Profile nâng cao

## 📝 Tóm tắt các thay đổi

Tôi đã cập nhật trang Profile và backend để:
1. Hiển thị tất cả thông tin người dùng (username, email, phone, full_name, avatar_url)
2. Cho phép sửa các thuộc tính: username, phone, full_name, avatar (upload)
3. Thêm chức năng đổi mật khẩu
4. Thêm chức năng quên mật khẩu (gửi email xác thực)

## 🔧 Cài đặt cần thiết

### Backend (fashion-backend)

**Cài đặt nodemailer:**
```bash
npm install nodemailer
npm install -D @types/nodemailer
```

**Cấu hình biến môi trường (`.env`):**
```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# JWT Secret cho reset password
JWT_RESET_SECRET=reset-secret-key-change-this

# Frontend URL cho link đặt lại mật khẩu
FRONTEND_URL=http://localhost:3000
```

**Ghi chú về Gmail:**
- Nếu sử dụng Gmail, bạn cần tạo [App Password](https://myaccount.google.com/apppasswords)
- Không sử dụng mật khẩu Gmail thường

### Frontend (fashion-frontend)

Không cần cài đặt thêm gì (đã cập nhật code)

## 📋 Các file đã thay đổi

### Backend
- `src/users/dto/updateUser.dto.ts` - Thêm full_name, avatar_url
- `src/users/dto/forgotPassword.dto.ts` - ✨ File mới
- `src/users/dto/resetPassword.dto.ts` - ✨ File mới
- `src/users/users.service.ts` - Thêm forgotPassword, resetPassword methods
- `src/users/users.controller.ts` - Thêm POST /user/forgotPassword, /user/resetPassword
- `src/users/users.module.ts` - Thêm JwtModule

### Frontend
- `src/pages/Profile.jsx` - Cập nhật giao diện hiển thị và chỉnh sửa profile
- `src/pages/ResetPassword.jsx` - ✨ File mới để đặt lại mật khẩu
- `src/store/slices/userSlice.js` - Thêm changePassword, forgotPassword, resetPassword thunks
- `src/App.jsx` - Thêm route /reset-password

## 🎯 API Endpoints

### User Profile
- `GET /user/me` - Lấy thông tin người dùng hiện tại
- `PUT /user/me` - Cập nhật thông tin người dùng
- `PUT /user/changePassword` - Đổi mật khẩu (yêu cầu mật khẩu cũ)
- `POST /user/forgotPassword` - Yêu cầu liên kết đặt lại mật khẩu
- `POST /user/resetPassword` - Đặt lại mật khẩu với token

### Upload
- `POST /upload` - Upload avatar (hoặc file khác)

## 🔐 Luồng Quên Mật Khẩu

1. Người dùng click "Quên mật khẩu" → nhập email
2. Backend tạo JWT token (hết hạn sau 1 giờ) và gửi email
3. Email chứa link: `{FRONTEND_URL}/reset-password?token={token}`
4. Người dùng click link → trang ResetPassword mở
5. Nhập mật khẩu mới → gửi token + mật khẩu
6. Backend xác thực token và cập nhật mật khẩu
7. Chuyển hướng đến trang đăng nhập

## 📱 Giao diện Profile

### Đã thêm các phần:
- **Avatar Section**: Hiển thị avatar và upload avatar mới
- **Edit Profile**: Form chỉnh sửa username, phone, full_name (email chỉ đọc)
- **Security Section**: Button đổi mật khẩu và quên mật khẩu
- **Modals**: 
  - Change Password Modal
  - Forgot Password Modal

## ✅ Kiểm tra

1. **Kiểm tra Upload Avatar:**
   - Click chọn file avatar
   - Click "Upload Avatar"
   - Avatar cập nhật trong form

2. **Kiểm tra Đổi Mật Khẩu:**
   - Click "Đổi mật khẩu"
   - Nhập mật khẩu cũ
   - Nhập mật khẩu mới (2 lần)
   - Click cập nhật

3. **Kiểm tra Quên Mật Khẩu:**
   - Click "Quên mật khẩu"
   - Nhập email đã đăng ký
   - Check email (console hoặc Gmail if configured)
   - Click link trong email → trang đặt lại mật khẩu

## 🛠️ Troubleshooting

**Lỗi: "Lỗi khi gửi email"**
- Kiểm tra EMAIL_USER và EMAIL_PASSWORD trong .env
- Nếu dùng Gmail, đảm bảo dùng App Password chứ không phải mật khẩu thường
- Kiểm tra enable "Less secure app access" nếu cần thiết

**Lỗi: "Token không hợp lệ"**
- Token hết hạn (1 giờ)
- JWT_RESET_SECRET không khớp

**Avatar không upload:**
- Kiểm tra endpoint `/upload` có hoạt động
- Kiểm tra folder `uploads/` có tồn tại
- Kiểm tra permissions

## 📚 Thêm thông tin

Tất cả các endpoint đều có JWT authentication guard (trừ forgotPassword và resetPassword)

Hãy liên hệ nếu có vấn đề gì cần hỗ trợ!
