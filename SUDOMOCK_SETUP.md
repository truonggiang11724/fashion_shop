# Hướng Dẫn Sử Dụng Sudomock

## 📋 Nội Dung

1. [Thiết Lập](#thiết-lập)
2. [API Endpoints](#api-endpoints)
3. [Các Bước Sử Dụng](#các-bước-sử-dụng)
4. [Ví Dụ Cụ Thể](#ví-dụ-cụ-thể)
5. [Troubleshooting](#troubleshooting)

---

## 🔧 Thiết Lập

### Bước 1: Tạo API Key

1. Truy cập [Sudomock Dashboard](https://sudomock.com/dashboard/api-keys)
2. Đăng ký tài khoản miễn phí (500 credits miễn phí để test)
3. Tạo API Key từ dashboard
4. Copy API Key (bắt đầu bằng `sm_`)

### Bước 2: Cấu Hình Environment

Thêm vào file `.env` trong `fashion-backend`:

```env
SUDOMOCK_API_KEY=sm_your_api_key_here
```

### Bước 3: Kiểm Tra Cài Đặt

```bash
cd fashion-backend
npm install  # Đã cài sẵn axios
```

---

## 🔌 API Endpoints

### 1. Lấy Danh Sách Templates

```
GET /mockups/templates
```

**Query Parameters:**
- `active` (optional): `'true'` | `'false'` - Lọc theo trạng thái hoạt động

**Response:**
```json
[
  {
    "template_id": 1,
    "name": "T-Shirt Front",
    "mockup_uuid": "c315f78f-d2c7-4541-b240-a9372842de94",
    "description": "T-shirt mockup template",
    "category": "Apparel",
    "smart_objects": [
      {
        "uuid": "128394ee-6758-4f2f-aa36-e2b19b152bd9",
        "name": "Front Design",
        "size": { "width": 3000, "height": 3413 },
        "position": { "top": 100, "left": 50 }
      }
    ],
    "thumbnail_url": "https://...",
    "is_active": true,
    "created_at": "2026-04-17T10:00:00Z"
  }
]
```

### 2. Lấy Chi Tiết Template

```
GET /mockups/templates/:id
```

**Parameters:**
- `id` (required): Template ID

### 3. Render Mockup

```
POST /mockups/render
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "template_id": 1,
  "design_image_url": "https://your-domain.com/design.png",
  "product_id": 10,
  "render_config": {
    "smart_object_uuid": "128394ee-6758-4f2f-aa36-e2b19b152bd9",
    "fit": "cover",
    "image_format": "webp",
    "image_size": 1920,
    "quality": 95
  }
}
```

**Response:**
```json
{
  "render_id": 1,
  "customer_id": 5,
  "template_id": 1,
  "design_image_url": "https://your-domain.com/design.png",
  "rendered_image_url": "https://cdn.sudomock.com/renders/c315f78f-.../render_1711234567890.webp",
  "status": "completed",
  "created_at": "2026-04-17T10:05:00Z"
}
```

### 4. Lịch Sử Render

```
GET /mockups/renders
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `limit` (optional): Số lượng kết quả (mặc định 20)

### 5. Chi Tiết Render

```
GET /mockups/renders/:id
Authorization: Bearer <jwt_token>
```

### 6. Xóa Render

```
DELETE /mockups/renders/:id
Authorization: Bearer <jwt_token>
```

### 7. Đồng Bộ Templates

```
POST /mockups/sync-templates
Content-Type: application/json
```

**Request Body:**
```json
[
  {
    "name": "T-Shirt Front",
    "mockup_uuid": "c315f78f-d2c7-4541-b240-a9372842de94",
    "category": "Apparel",
    "description": "T-shirt mockup template"
  }
]
```

---

## 📝 Các Bước Sử Dụng

### Quy Trình Tổng Quát

```
1. Chuẩn Bị Design Image
   ↓
2. Lấy Danh Sách Templates
   ↓
3. Chọn Template & Smart Object UUID
   ↓
4. Gửi Request Render
   ↓
5. Nhận Rendered Image URL
   ↓
6. Lưu URL vào Database
```

### Chi Tiết Từng Bước

#### Bước 1: Chuẩn Bị Design Image

- Upload ảnh thiết kế lên CDN hoặc server của bạn
- Định dạng hỗ trợ: PNG, JPG, WebP, GIF
- Kích thước: Khuyến nghị thiết kế ở kích thước smart object (`size.width x size.height`)
- Đảm bảo URL công khai và có thể truy cập

#### Bước 2: Lấy Danh Sách Templates

```bash
curl "http://localhost:3000/mockups/templates"
```

#### Bước 3: Chọn Template

- Tìm template phù hợp từ danh sách
- Lưu `template_id` và `smart_objects` UUIDs
- Kiểm tra `size` để chuẩn bị design

#### Bước 4: Render Mockup (Yêu Cầu Đăng Nhập)

```bash
curl -X POST "http://localhost:3000/mockups/render" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": 1,
    "design_image_url": "https://your-domain.com/design.png",
    "product_id": 10,
    "render_config": {
      "fit": "cover",
      "image_format": "webp",
      "image_size": 1920,
      "quality": 95
    }
  }'
```

#### Bước 5: Nhận Kết Quả

- Sudomock xử lý yêu cầu (thường < 1 giây)
- Trả về URL ảnh mockup hoàn thành
- URL được lưu trong CDN Sudomock (giữ trong 7 ngày)

---

## 💡 Ví Dụ Cụ Thể

### Ví Dụ 1: Render T-Shirt Đơn Giản

```javascript
// Frontend - React
const renderMockup = async () => {
  const response = await fetch('/mockups/render', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      template_id: 1,
      design_image_url: 'https://cdn.example.com/tshirt-design.png',
      product_id: 10,
      render_config: {
        fit: 'cover',
        image_format: 'webp'
      }
    })
  });

  const data = await response.json();
  console.log('Rendered Image:', data.rendered_image_url);
  return data;
};
```

### Ví Dụ 2: Render với Adjustment Layers (Nâng Cao)

```json
{
  "template_id": 2,
  "design_image_url": "https://your-domain.com/hoodie-design.png",
  "product_id": 15,
  "render_config": {
    "smart_object_uuid": "uuid-hoodie-front",
    "fit": "cover",
    "image_format": "webp",
    "image_size": 2400,
    "quality": 95,
    "brightness": 10,
    "contrast": 5,
    "saturation": 10,
    "opacity": 100
  }
}
```

### Ví Dụ 3: Đồng Bộ Templates Từ Sudomock

```bash
curl -X POST "http://localhost:3000/mockups/sync-templates" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "name": "T-Shirt Front View",
      "mockup_uuid": "c315f78f-d2c7-4541-b240-a9372842de94",
      "category": "Apparel",
      "description": "Classic t-shirt mockup"
    },
    {
      "name": "Hoodie Front View",
      "mockup_uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "category": "Apparel",
      "description": "Hoodie mockup"
    }
  ]'
```

---

## ⚙️ Các Tùy Chọn Cấu Hình

### Tham Số `fit`

| Giá Trị | Mô Tả | Khi Nào Sử Dụng |
|---------|-------|-----------------|
| `cover` | Lấp đầy & cắt (không bị biến dạng) | Hầu hết mockup sản phẩm |
| `contain` | Vừa vào bảo toàn tỷ lệ (có khoảng trống) | Khi cần nhìn thấy toàn bộ design |
| `fill` | Kéo căng lấp đầy (có thể biến dạng) | Hiếm khi sử dụng |

### Tham Số `image_format`

| Định Dạng | Ưu Điểm | Nhược Điểm |
|-----------|---------|-----------|
| `webp` | Nhỏ nhất (30-70% so với PNG) | Ít trình duyệt cũ hỗ trợ |
| `png` | Không mất chất lượng, trong suốt | File lớn hơn |
| `jpg` | Nhỏ, tương thích tốt | Không in suốt |

**Khuyến nghị:** WebP cho web, PNG cho in, JPG cho archive

### Tham Số `image_size`

- **Khoảng:** 100 - 10,000 pixels
- **Mặc định:** 1920
- **Khuyến nghị:** 1920-2400 cho e-commerce

### Tham Số `quality`

- **Khoảng:** 1 - 100
- **Mặc định:** 95
- **Áp dụng cho:** JPG & WebP (PNG luôn lossless)
- **Khuyến nghị:** 90-95

### Adjustment Layers

```json
{
  "brightness": -50 to 50,    // -50 = tối, 50 = sáng
  "contrast": -100 to 100,    // -100 = xám, 100 = cao độ tương phản
  "saturation": -100 to 100,  // -100 = xám, 100 = bão hòa
  "opacity": 0 to 100,        // 0 = trong suốt, 100 = không trong
  "vibrance": -100 to 100     // Tương tự saturation nhưng giữ da
}
```

---

## 🚀 Best Practices

### 1. Tối Ưu Hóa Design
- Thiết kế ở kích thước smart object (trong response template)
- Sử dụng PNG trong suốt nếu cần
- Đảm bảo design vừa vào bounds

### 2. Tối Ưu Hóa Performance
- Sử dụng WebP format (tiết kiệm bandwidth)
- Giảm `quality` nếu không cần chất lượng cao
- Batch render: Gửi nhiều request song song (giới hạn theo plan)

### 3. Xử Lý Error
- Kiểm tra `design_image_url` có hợp lệ
- Đảm bảo API key chính xác
- Monitor credit balance

### 4. Lưu Trữ
- Render URLs có giới hạn giữ (7 ngày cho standard)
- Download & lưu ảnh vĩnh viễn nếu cần
- Lưu `render_id` để tracking

---

## ❌ Troubleshooting

### Error: "API key not configured"

**Giải pháp:**
```env
# .env
SUDOMOCK_API_KEY=sm_your_actual_key
```

Restart server sau khi thêm env

### Error: "Design image URL is not accessible"

**Nguyên nhân:**
- URL không công khai
- URL hết hạn
- Server không thể kết nối

**Giải pháp:**
- Kiểm tra URL bằng browser
- Đảm bảo CORS nếu từ domain khác
- Sử dụng base64 thay vì URL (API hỗ trợ)

### Error: "Smart object UUID not found"

**Giải pháp:**
- Kiểm tra UUID từ template response
- Đảm bảo UUID chính xác
- Lấy lại danh sách templates

### Error: "Insufficient credits"

**Giải pháp:**
1. Nâng cấp plan trên [Sudomock Pricing](https://sudomock.com/pricing)
2. Hoặc đợi reset credits (tùy plan)
3. Free tier: 500 credits test, unlimited dashboard

### Render Chậm

**Giải pháp:**
- Giảm `image_size`
- Chuyển sang WebP
- Giảm `quality`
- Kiểm tra network

---

## 📊 Thông Tin Giá

| Plan | Giá | Credits | Parallel Limit |
|------|-----|---------|----------------|
| Free | Miễn phí | 500 test + unlimited dashboard | 1 |
| Starter | $19/tháng | Unlimited | 3 |
| Pro | $99/tháng | Unlimited | 10 |
| Scale | $499/tháng | Unlimited | 25 |

**Lưu ý:** $0.002 per render (Pro plan) - rẻ hơn 75x so với competitors

---

## 📚 Tài Liệu Liên Quan

- [Sudomock Docs](https://sudomock.com/docs)
- [API Reference](https://sudomock.com/docs/api/render)
- [PSD Preparation](https://sudomock.com/docs/psd-preparation)
- [Dashboard](https://sudomock.com/dashboard)

---

## 💬 Hỗ Trợ

- **Email:** hello@sudomock.com
- **Dashboard:** Liên hệ từ [sudomock.com](https://sudomock.com)
- **Playground:** Test renders tại [Sudomock Playground](https://sudomock.com/dashboard/playground)

---

**Last Updated:** April 17, 2026
