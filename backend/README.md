# FitMe Backend

Backend demo cho ứng dụng **FitMe** sử dụng RapidAPI.

## 🚀 Cách chạy

```bash
# Cài dependencies
npm install

# Chạy server
node server.js
```

Tạo file `.env` (ib tôi để lấy file):

```env
PORT=5000
RAPIDAPI_KEY=your_rapidapi_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## ⚙️ Cách hoạt động của backend

1. Frontend upload 2 file:
   - `userImage`: ảnh người
   - `productImage`: ảnh quần áo
2. Backend dùng **Multer** lưu tạm file.
3. Backend upload ảnh tạm lên **Cloudinary** để có URL công khai.
4. Gọi **RapidAPI `/try-on-url`** với URL ảnh vừa upload.
5. Nhận kết quả ảnh từ RapidAPI (base64/binary).
6. Upload kết quả lên Cloudinary để có URL.
7. Trả JSON chứa `generated_image_url` về cho frontend.

## 📡 API

### Test server
`GET /ping` → `{ "message": "pong" }`

### Try-On
`POST /tryon`  
Body (form-data):
- `userImage`: file ảnh người
- `productImage`: file ảnh quần áo

Response:
```json
{
  "generated_image_url": "https://res.cloudinary.com/.../result.png"
}
```

## 🧪 Test
Dùng Postman:
- Method: `POST`
- URL: `http://localhost:5000/tryon`
- Body: form-data → upload 2 file (`userImage`, `productImage`)
