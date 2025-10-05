// =======================
// server.js
// =======================

// 1️⃣ Nạp các thư viện cần thiết
const express = require("express");       // Framework tạo server và API
const cors = require("cors");             // Bật CORS để frontend gọi API
const https = require("https");           // Client HTTPS native của Node.js
const qs = require("querystring");        // Encode dữ liệu dạng x-www-form-urlencoded
require("dotenv").config();               // Đọc biến môi trường từ file .env

// 2️⃣ Khởi tạo Express app
const app = express();
const PORT = process.env.PORT || 5000;

// 3️⃣ Middleware
app.use(cors());            // Cho phép frontend gọi API
app.use(express.json());    // Parse JSON body từ request

// =======================
// 4️⃣ Route test nhanh
// =======================
app.get("/ping", (req, res) => {
  res.json({ message: "pong" }); // Test server có chạy không
});

// =======================
// 5️⃣ Route Try-On Diffusion (trả base64)
// =======================
app.post("/tryon", (req, res) => {
  // 5.1 Lấy dữ liệu từ frontend
  const { userImage, productImage } = req.body;

  if (!userImage || !productImage) {
    // Nếu frontend gửi thiếu dữ liệu, trả về 400
    return res.status(400).json({ error: "userImage và productImage là bắt buộc" });
  }

  console.log("Received from frontend:", { userImage, productImage });

  // 5.2 Encode dữ liệu theo chuẩn x-www-form-urlencoded
  const postData = qs.stringify({
    human_image_url: userImage,   // URL ảnh người dùng
    cloth_image_url: productImage // URL ảnh sản phẩm
  });

  // 5.3 Cấu hình request HTTPS
  const options = {
    method: "POST",
    hostname: "try-on-diffusion.p.rapidapi.com",
    path: "/try-on-url", // endpoint trả ảnh
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,   // Key RapidAPI từ .env
      "x-rapidapi-host": "try-on-diffusion.p.rapidapi.com",
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData)
    }
  };

  // 5.4 Tạo request đến RapidAPI
  const apiReq = https.request(options, (apiRes) => {
    const chunks = [];

    // 5.5 Khi nhận dữ liệu từ RapidAPI (dạng binary)
    apiRes.on("data", (chunk) => {
      chunks.push(chunk);
    });

    // 5.6 Khi dữ liệu nhận xong
    apiRes.on("end", () => {
      const buffer = Buffer.concat(chunks); // Gom tất cả chunk lại thành Buffer

      // ⚡ Chuyển Buffer ảnh sang base64
      const base64Image = buffer.toString("base64");

      // Trả về frontend dưới dạng JSON
      res.json({ generated_image_base64: base64Image });
    });
  });

  // 5.7 Bắt lỗi request
  apiReq.on("error", (err) => {
    console.error("Request error:", err.message);
    res.status(500).json({ error: err.message });
  });

  // 5.8 Gửi dữ liệu lên RapidAPI
  apiReq.write(postData);
  apiReq.end();
});

// =======================
// 6️⃣ Khởi động server
// =======================
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
