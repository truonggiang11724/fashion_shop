# Cấu Trúc Mã Nguồn Dự Án Fashion E-commerce

## Tổng Quan Dự Án

Dự án này là một hệ thống thương mại điện tử thời trang (Fashion E-commerce) được xây dựng với kiến trúc full-stack, bao gồm:

- **Backend**: Sử dụng NestJS (Node.js framework) với TypeScript, tích hợp Prisma ORM cho cơ sở dữ liệu.
- **Frontend**: Ứng dụng React với Vite, sử dụng JSX và CSS.
- **Cơ sở dữ liệu**: Sử dụng Prisma với schema được định nghĩa trong `prisma/schema.prisma`.

Dự án hỗ trợ nhiều vai trò người dùng: khách hàng, người bán (seller), và quản trị viên (admin).

## Cấu Trúc Tổng Thể

```
fashion-ecommerce/
├── fashion-backend/          # Backend API (NestJS)
├── fashion-frontend/         # Frontend UI (React + Vite)
├── prisma/                   # Cấu hình cơ sở dữ liệu chung
├── uploads/                  # Thư mục lưu trữ file upload
├── MOCKUP_SETUP_GUIDE.md     # Hướng dẫn setup mockup
├── PROFILE_SETUP.md          # Hướng dẫn setup profile
├── SELLER_DASHBOARD_SETUP.md # Hướng dẫn setup dashboard seller
└── SUDOMOCK_SETUP.md         # Hướng dẫn setup sudo mock
```

## Chi Tiết Backend (fashion-backend)

Backend được xây dựng trên NestJS với cấu trúc module-based. Các thành phần chính:

### Cấu Hình và Dependencies
- `package.json`: Quản lý dependencies (NestJS, Prisma, JWT, etc.)
- `tsconfig.json` & `tsconfig.build.json`: Cấu hình TypeScript
- `nest-cli.json`: Cấu hình NestJS CLI
- `eslint.config.mjs`: Cấu hình ESLint
- `upload.config.ts`: Cấu hình upload file

### Cơ Sở Dữ Liệu
- `prisma/schema.prisma`: Định nghĩa schema database với các model:
  - Users, Customers, Sellers
  - Products, ProductVariants, ProductMedia
  - Orders, OrderItems, Payments
  - Carts, CartItems
  - Categories, Reviews, Promotions
  - Addresses (Provinces, Wards)
  - Wallets, WalletTransactions
  - Shipments, Refunds

- `generated/`: Code được generate từ Prisma (client, models, enums)

### Source Code (src/)
```
src/
├── app.controller.ts         # Controller chính
├── app.module.ts             # Module gốc
├── app.service.ts            # Service chính
├── main.ts                   # Entry point
├── prisma/                   # Prisma service
├── upload/                   # Upload service
├── auth/                     # Authentication module
├── users/                    # User management
├── products/                 # Product management
├── categories/               # Category management
├── cart/                     # Shopping cart
├── orders/                   # Order management
├── payments/                 # Payment processing
├── reviews/                  # Product reviews
├── seller/                   # Seller dashboard
├── admin/                    # Admin panel
├── addresses/                # Address management
├── mockup-render/            # Mockup rendering
└── mockups/                  # Mockup templates
```

#### Các Module Chính:

1. **Auth Module**: Xử lý đăng nhập, đăng ký, JWT authentication
2. **Users Module**: Quản lý thông tin người dùng
3. **Products Module**: CRUD sản phẩm, variants, media
4. **Orders Module**: Quản lý đơn hàng, thanh toán, vận chuyển
5. **Cart Module**: Giỏ hàng và checkout
6. **Seller Module**: Dashboard cho người bán
7. **Admin Module**: Panel quản trị với auth riêng
8. **Categories Module**: Phân loại sản phẩm
9. **Reviews Module**: Đánh giá sản phẩm
10. **Addresses Module**: Quản lý địa chỉ giao hàng
11. **Mockup System**: Tạo mockup sản phẩm

### Test
- `test/app.e2e-spec.ts`: End-to-end tests
- `jest-e2e.json`: Cấu hình Jest cho E2E

## Chi Tiết Frontend (fashion-frontend)

Frontend được xây dựng với React và Vite, sử dụng JSX.

### Cấu Hình
- `package.json`: Dependencies (React, Vite, etc.)
- `vite.config.js`: Cấu hình Vite
- `eslint.config.js`: Cấu hình ESLint
- `index.html`: Template HTML chính

### Source Code (src/)
```
src/
├── main.jsx                  # Entry point
├── App.jsx                   # Component chính
├── App.css                   # Styles chính
├── index.css                 # Global styles
├── components/               # Reusable components
├── pages/                    # Page components
├── services/                 # API services
├── context/                  # React context
├── store/                    # State management
├── admin/                    # Admin pages/components
├── seller/                   # Seller pages/components
└── assets/                   # Static assets
```

#### Cấu Trúc Components:
- **Pages**: Các trang chính (ProductDetail, Home, Cart, etc.)
- **Components**: UI components tái sử dụng
- **Services**: API calls và business logic
- **Context/Store**: Quản lý state toàn cục
- **Admin/Seller**: Giao diện riêng cho admin và seller

## Kiến Trúc Hệ Thống

### Authentication & Authorization
- JWT-based authentication
- Separate guards cho admin và user
- Role-based access control

### Database Design
- Relational database với Prisma ORM
- Models được generate tự động
- Support migrations và seeding

### API Design
- RESTful APIs với NestJS controllers
- DTOs cho validation input
- Swagger documentation (có thể)

### File Upload
- Configured upload service
- Support multiple file types
- Stored in `uploads/` directory

### Mockup System
- Custom mockup rendering
- Template-based product visualization
- Integration với product management

## Công Nghệ Sử Dụng

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: Prisma ORM
- **Authentication**: JWT
- **Validation**: Class-validator
- **Testing**: Jest

### Frontend
- **Framework**: React
- **Build Tool**: Vite
- **Language**: JavaScript (JSX)
- **Styling**: CSS
- **State Management**: Context API / Redux (tùy)

### DevOps
- **Linting**: ESLint
- **Version Control**: Git
- **Package Management**: npm

## Setup và Chạy Dự Án

1. **Backend**:
   ```bash
   cd fashion-backend
   npm install
   npx prisma generate
   npx prisma db push
   npm run start:dev
   ```

2. **Frontend**:
   ```bash
   cd fashion-frontend
   npm install
   npm run dev
   ```

3. **Database**: Cần setup PostgreSQL/MySQL và cấu hình trong `.env`

## Lưu Ý Phát Triển

- Dự án đang trong quá trình phát triển
- Có thể cần setup environment variables
- Mockup system có hướng dẫn riêng trong `MOCKUP_SETUP_GUIDE.md`
- Seller dashboard setup trong `SELLER_DASHBOARD_SETUP.md`