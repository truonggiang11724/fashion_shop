# Seller Dashboard - Hướng Dẫn Hoàn Chỉnh

## 📋 Tóm tắt

Tôi đã tạo một Dashboard hoàn chỉnh cho Seller (người bán hàng) bao gồm 5 trang chính:

### 🎯 Các Trang Seller

1. **Dashboard** (`/seller`)
   - Hiển thị thống kê tổng quát: số sản phẩm, đơn hàng, doanh thu, đánh giá
   - Thông tin ví (Available, Pending, Withdrawn Balance)
   - Analytics 30 ngày: tổng đơn hàng, doanh thu, giá trị trung bình
   - Bảng doanh thu hàng ngày

2. **Products** (`/seller/products`)
   - Danh sách sản phẩm của seller
   - Tìm kiếm sản phẩm
   - Xem trạng thái (Active/Inactive)
   - Số lượng variants và reviews cho mỗi sản phẩm

3. **Orders** (`/seller/orders`)
   - Danh sách đơn hàng chứa sản phẩm của seller
   - Lọc theo trạng thái (Pending, Confirmed, Shipped, Delivered, Cancelled)
   - Hiển thị: ID đơn hàng, khách hàng, ngày, tổng tiền, trạng thái

4. **Reviews** (`/seller/reviews`)
   - Danh sách đánh giá cho sản phẩm của seller
   - Lọc theo số sao (5 sao, 4 sao, ..., 1 sao)
   - Hiển thị: tên khách hàng, rating, ngày, nội dung, hình ảnh
   - Chức năng xóa review

5. **Wallet** (`/seller/wallet`)
   - Hiển thị số dư ví chi tiết
   - Available Balance (có thể rút)
   - Pending Balance (chờ xác nhận)
   - Withdrawn Balance (đã rút)
   - Lịch sử giao dịch (20 giao dịch gần nhất)
   - Nút "Withdraw" để rút tiền

---

## 🔧 Backend Implementation

### Thêm các Model Methods

**products.service.ts**
```typescript
async findBySellerId(sellerId: number)
```
Lấy tất cả sản phẩm của seller kèm variants, media, và reviews

**orders.service.ts**
```typescript
async findBySellerId(sellerId: number)
```
Lấy tất cả đơn hàng chứa sản phẩm của seller

**reviews.service.ts**
```typescript
async findByProductIds(productIds: number[])
```
Lấy danh sách reviews cho các sản phẩm của seller

### Seller Module (Mới tạo)

**Controllers**: 
```
/seller/dashboard    - GET dashboard stats
/seller/products     - GET seller's products
/seller/orders       - GET seller's orders
/seller/reviews      - GET seller's reviews
/seller/wallet       - GET seller's wallet
/seller/analytics    - GET seller's analytics
```

**Service Logic**:
- `getDashboardStats()` - Tính toán thống kê tổng hợp
- `getSellerProducts()` - Lấy danh sách sản phẩm seller
- `getSellerOrders()` - Lấy danh sách đơn hàng seller
- `getSellerReviews()` - Lấy danh sách reviews seller
- `getSellerWallet()` - Thông tin ví seller
- `getSellerAnalytics()` - Phân tích doanh thu

---

## 🎨 Frontend Implementation

### Redux Slice (sellerSlice.js)

**Actions**:
- `fetchSellerDashboard()` - Lấy dashboard stats
- `fetchSellerProducts()` - Lấy products
- `fetchSellerOrders()` - Lấy orders
- `fetchSellerReviews()` - Lấy reviews
- `fetchSellerWallet()` - Lấy wallet info
- `fetchSellerAnalytics()` - Lấy analytics

**State**:
```javascript
{
  dashboard: null,
  products: [],
  orders: [],
  reviews: [],
  wallet: null,
  analytics: null,
  loading: false,
  error: null,
}
```

### Components

**SellerLayout**
- Sidebar với menu navigation
- Top bar với thông tin seller
- Responsive design
- Dark sidebar + light content

**ProtectedSellerRoute**
- Kiểm tra token và seller data
- Redirect tới login nếu không đăng nhập
- Bảo vệ các routes seller

### Pages

**Dashboard.jsx**
- Stats cards (Products, Orders, Revenue, Reviews)
- Wallet balance section
- 30-day analytics
- Daily revenue table

**Products.jsx**
- Danh sách sản phẩm (table)
- Search functionality
- Hiển thị: Product, Category, Status, Variants count, Reviews count
- Actions: View, Delete

**Orders.jsx**
- Danh sách đơn hàng (table)
- Status filter
- Hiển thị: Order ID, Customer, Date, Total, Status
- Action: View order details

**Reviews.jsx**
- Danh sách reviews (card list)
- Rating filter
- Hiển thị: Customer, Rating (stars), Date, Comment, Images
- Action: Delete review

**Wallet.jsx**
- 4 balance cards (Available, Pending, Withdrawn, Total Revenue)
- Withdraw button
- Transaction history (20 transactions)
- Hiển thị: Date, Type (Income/Expense), Order ID, Amount

---

## 🚀 Sử Dụng

### Truy cập Seller Dashboard

1. Seller đăng nhập bình thường
2. Sau khi đăng nhập thành công, lưu `seller` data vào localStorage
3. Truy cập `/seller` để vào dashboard
4. Sử dụng sidebar để navigate qua các trang

### Login as Seller

Chắc chắn hệ thống auth lưu seller data sau khi đăng nhập:

```javascript
localStorage.setItem('seller', JSON.stringify(sellerData));
```

---

## 📊 API Endpoints

```
GET    /seller/dashboard    - Dashboard stats
GET    /seller/products     - Seller's products
GET    /seller/orders       - Seller's orders
GET    /seller/reviews      - Seller's reviews
GET    /seller/wallet       - Seller's wallet
GET    /seller/analytics    - 30-day analytics
```

Tất cả endpoints require JWT authentication (`Authorization: Bearer token`)

---

## 💾 Redux Store

Store đã được cập nhật để include sellerSlice:

```javascript
export const store = configureStore({
  reducer: {
    // ... other reducers
    seller: sellerReducer,
  },
});
```

---

## 🔒 Bảo Mật

- Tất cả seller routes được bảo vệ bằng `ProtectedSellerRoute`
- Kiểm tra token JWT và seller data trước khi cho phép truy cập
- Backend sử dụng `JwtAuthGuard` để xác thực requests

---

## 📁 Cấu Trúc Tệp

**Backend**:
```
src/seller/
  ├── seller.controller.ts
  ├── seller.service.ts
  └── seller.module.ts
```

**Frontend**:
```
src/seller/
  ├── components/
  │   ├── SellerLayout.jsx
  │   └── ProtectedSellerRoute.jsx
  ├── pages/
  │   ├── Dashboard.jsx
  │   ├── Products.jsx
  │   ├── Orders.jsx
  │   ├── Reviews.jsx
  │   └── Wallet.jsx
src/store/slices/
  └── sellerSlice.js
```

---

## ✅ Checklist

- [x] Seller Module (Backend)
- [x] Seller Controller + Service
- [x] Redux Slice
- [x] SellerLayout Component
- [x] ProtectedSellerRoute
- [x] Dashboard Page
- [x] Products Page
- [x] Orders Page
- [x] Reviews Page
- [x] Wallet Page
- [x] Routes trong App.jsx
- [x] Store integration

---

## 🎯 Tiếp theo (Optional)

### Có thể thêm:

1. **Edit Product** - Chỉnh sửa chi tiết sản phẩm
2. **Withdrawal Management** - Quản lý yêu cầu rút tiền
3. **Order Management** - Cập nhật trạng thái đơn hàng, thêm tracking
4. **Analytics Chart** - Biểu đồ doanh số chi tiết hơn
5. **Notifications** - Thông báo về đơn hàng, reviews mới
6. **Settings** - Cài đặt shop, thông tin seller

---

## 🐛 Troubleshooting

**Blank page on `/seller`?**
- Kiểm tra token có được lưu không
- Kiểm tra seller data trong localStorage
- Kiểm tra Redux state trong DevTools

**Data not loading?**
- Kiểm tra backend API responses
- Kiểm tra network tab trong DevTools
- Kiểm tra error messages trong console

**Layout issues?**
- Tailwind CSS class names
- Responsive breakpoints (md:, lg:)
- Sidebar toggle functionality

---

Hết! Đây là một seller dashboard đầy đủ và có thể sử dụng ngay. 🎉
