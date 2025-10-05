# FitMe Backend

Backend demo cho FitMe

## 🚀 Cách chạy

```bash
# Cài dependencies
npm install

# Chạy server
node server.js
```

Tạo file `.env` ( ib tôi lấy file nhé ):

```env
PORT=5000
RAPIDAPI_KEY=your_rapidapi_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

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
