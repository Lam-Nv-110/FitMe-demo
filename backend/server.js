// Nạp thư viện cần thiết
const express = require("express");   // Framework để tạo server và định nghĩa API
const cors = require("cors");         // Cho phép frontend (React/Next.js) gọi API từ backend
const axios = require("axios");       // Thư viện để gọi API bên ngoài (ở đây là RapidAPI)
require("dotenv").config();           // Đọc biến môi trường từ file .env

// Khởi tạo ứng dụng Express
const app = express();
const PORT = process.env.PORT || 5000; // Lấy PORT từ .env, mặc định 5000

// Middleware
app.use(cors());           // Bật CORS để frontend gọi API không bị chặn
app.use(express.json());   // Cho phép server hiểu dữ liệu JSON trong body request

// ✅ Route test đơn giản để check server có chạy hay không
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
  // Khi bạn gọi http://localhost:5000/ping
  // Nó sẽ trả về {"message":"pong"}
});

// ✅ Route chính để gọi Try-On Diffusion API từ RapidAPI
app.post("/tryon", async (req, res) => {
  // Lấy dữ liệu user gửi lên (ảnh người và ảnh sản phẩm)
  // Frontend sẽ gửi JSON dạng:
  // { "userImage": "https://...", "productImage": "https://..." }
  const { userImage, productImage } = req.body;

  try {
    // Cấu hình request để gửi lên RapidAPI
    const options = {
      method: 'POST',
      url: 'https://try-on-diffusion.p.rapidapi.com/try-on-url',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,   // Lấy key từ file .env
        'X-RapidAPI-Host': 'try-on-diffusion.p.rapidapi.com'
      },
      data: {
        cloth_image_url: productImage, // URL ảnh áo quần
        human_image_url: userImage     // URL ảnh người dùng
      }
    };

    // Gửi request đến RapidAPI
    const response = await axios.request(options);

    // Trả kết quả từ RapidAPI về cho frontend
    res.json(response.data);

  } catch (error) {
    // Nếu có lỗi, in ra console và trả về status 500
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: "API call failed" });
  }
});

// ✅ Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
