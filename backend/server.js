// =======================
// server.js
// =======================

// 1️⃣ Nạp các thư viện cần thiết
const express = require("express");       // Framework tạo server và API
const cors = require("cors");             // Cho phép frontend gọi API
const https = require("https");           // Client HTTPS native của Node.js
const fs = require("fs");                 // Đọc/ghi file
const path = require("path");             // Hỗ trợ xử lý đường dẫn
const multer = require("multer");         // Middleware nhận file từ request
const FormData = require("form-data");    // Gửi form-data lên RapidAPI
require("dotenv").config();               // Đọc biến môi trường từ file .env

// 2️⃣ Khởi tạo Express app
const app = express();
const PORT = process.env.PORT || 5000;

// 3️⃣ Middleware
app.use(cors());
app.use(express.json());

// 4️⃣ Cho phép phục vụ file tĩnh trong thư mục public/
app.use(express.static("public"));

// 5️⃣ Cấu hình multer (lưu file tạm trong thư mục uploads/)
const upload = multer({ dest: "uploads/" });

// =======================
// 6️⃣ Route test nhanh
// =======================
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// =======================
// 7️⃣ Route Try-On Diffusion (dùng file upload)
// =======================
//
// Expect: gửi form-data với 2 file
// - human_image_file
// - cloth_image_file
// =======================
app.post("/tryonfile", upload.fields([
  { name: "human_image_file", maxCount: 1 },
  { name: "cloth_image_file", maxCount: 1 }
]), (req, res) => {
  // 7.1 Kiểm tra file có được upload không
  if (!req.files || !req.files.human_image_file || !req.files.cloth_image_file) {
    return res.status(400).json({ error: "Thiếu file human_image_file hoặc cloth_image_file" });
  }

  console.log("✅ Files received:", req.files);

  // 7.2 Tạo form-data gửi lên RapidAPI
  const form = new FormData();
  form.append("human_image_file", fs.createReadStream(req.files.human_image_file[0].path));
  form.append("cloth_image_file", fs.createReadStream(req.files.cloth_image_file[0].path));

  // 7.3 Cấu hình request HTTPS đến RapidAPI
  const options = {
    method: "POST",
    hostname: "try-on-diffusion.p.rapidapi.com",
    path: "/try-on-file", // endpoint upload file
    headers: {
      ...form.getHeaders(),
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": "try-on-diffusion.p.rapidapi.com"
    }
  };

  // 7.4 Gửi request đến RapidAPI
  const apiReq = https.request(options, (apiRes) => {
    const chunks = [];

    apiRes.on("data", (chunk) => {
      chunks.push(chunk);
    });

    apiRes.on("end", () => {
      const buffer = Buffer.concat(chunks);

      // 7.5 Lưu file trả về vào public/
      const fileName = `output_${Date.now()}.png`;
      const filePath = path.join(__dirname, "public", fileName);

      fs.writeFile(filePath, buffer, (err) => {
        if (err) {
          console.error("❌ Lỗi khi lưu file:", err);
          return res.status(500).json({ error: "Không lưu được ảnh" });
        }

        // 7.6 Trả về URL ảnh cho frontend/Postman
        const imageUrl = `http://localhost:${PORT}/${fileName}`;
        res.json({ generated_image_url: imageUrl });
      });
    });
  });

  // 7.7 Gửi form-data lên RapidAPI
  form.pipe(apiReq);

  // 7.8 Bắt lỗi
  apiReq.on("error", (err) => {
    console.error("❌ Request error:", err.message);
    res.status(500).json({ error: err.message });
  });
});

// =======================
// 8️⃣ Khởi động server
// =======================
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
