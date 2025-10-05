// =======================
// server.js
// =======================

// 1️⃣ Nạp các thư viện cần thiết
const express = require("express");       // Framework tạo server và API
const cors = require("cors");             // Bật CORS để frontend gọi API
const https = require("https");           // Client HTTPS native của Node.js
const qs = require("querystring");        // Encode dữ liệu dạng x-www-form-urlencoded
const fs = require("fs");                 // Lưu ảnh vào file
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
// 5️⃣ Route Try-On Diffusion (lưu file + trả base64)
// =======================
app.post("/tryon", (req, res) => {
  const { userImage, productImage } = req.body;

  if (!userImage || !productImage) {
    return res.status(400).json({ error: "userImage và productImage là bắt buộc" });
  }

  console.log("Received from frontend:", { userImage, productImage });

  // 5.1 Encode dữ liệu x-www-form-urlencoded
  const postData = qs.stringify({
    human_image_url: userImage,
    cloth_image_url: productImage
  });

  // 5.2 Cấu hình request HTTPS đến RapidAPI
  const options = {
    method: "POST",
    hostname: "try-on-diffusion.p.rapidapi.com",
    path: "/try-on-url", // endpoint trả ảnh
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "try-on-diffusion.p.rapidapi.com",
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData)
    }
  };

  // 5.3 Tạo request
  const apiReq = https.request(options, (apiRes) => {
    const chunks = [];

    // 5.4 Khi nhận dữ liệu từ RapidAPI (binary)
    apiRes.on("data", (chunk) => {
      chunks.push(chunk);
    });

    // 5.5 Khi dữ liệu nhận xong
    apiRes.on("end", () => {
      const buffer = Buffer.concat(chunks); // Gom chunk thành Buffer

      // 5.6 Lưu ảnh ra file
      const fileName = "tryon_result.jpg";
      fs.writeFile(fileName, buffer, (err) => {
        if (err) {
          console.error("Lỗi khi lưu file:", err);
          return res.status(500).json({ error: "Cannot save image" });
        }
        console.log("✅ Ảnh đã lưu vào", fileName);

        // 5.7 Chuyển Buffer sang base64 để frontend hiển thị trực tiếp
        const base64Image = buffer.toString("base64");

        // Trả về frontend: đường dẫn file + base64
        res.json({
          message: "Image saved successfully",
          fileName: fileName,
          generated_image_base64: base64Image
        });
      });
    });
  });

  // 5.8 Bắt lỗi request
  apiReq.on("error", (err) => {
    console.error("Request error:", err.message);
    res.status(500).json({ error: err.message });
  });

  // 5.9 Gửi dữ liệu lên RapidAPI
  apiReq.write(postData);
  apiReq.end();
});

// =======================
// 6️⃣ Khởi động server
// =======================
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
