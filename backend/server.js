// =======================
// server.js
// =======================

// 1️⃣ Import thư viện cần thiết
const express = require("express");       // Tạo server backend
const cors = require("cors");             // Cho phép frontend gọi API từ domain khác
const https = require("https");           // Dùng để gọi RapidAPI (HTTPS request)
const qs = require("querystring");        // Encode dữ liệu dạng form-urlencoded
const multer = require("multer");         // Nhận file upload từ frontend
const cloudinary = require("cloudinary").v2; // Upload ảnh lên Cloudinary
require("dotenv").config();               // Đọc biến môi trường từ file .env

// 2️⃣ Cấu hình Cloudinary bằng thông tin từ .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Tên cloud (dashboard)
  api_key: process.env.CLOUDINARY_API_KEY,       // API Key (dashboard)
  api_secret: process.env.CLOUDINARY_API_SECRET  // API Secret (dashboard)
});

// 3️⃣ Cấu hình Multer để lưu file tạm (trong thư mục /uploads)
// Backend chỉ cần file tạm để upload lên Cloudinary, sau đó có thể xoá
const upload = multer({ dest: "uploads/" });

// 4️⃣ Khởi tạo ứng dụng Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());          // Cho phép mọi origin gọi API
app.use(express.json());  // Parse body JSON (cho route khác nếu cần)
app.use(express.static("frontend")); // Phục vụ file tĩnh (nếu cần)
// =======================
// 5️⃣ Route test nhanh
// =======================
app.get("/ping", (req, res) => {
  res.json({ message: "pong" }); // Test server hoạt động
});

// =======================
// 6️⃣ Route Try-On chính
// =======================
// Frontend sẽ upload 2 file: userImage (ảnh người), productImage (ảnh áo/quần)
// Backend sẽ upload ảnh đó lên Cloudinary để có URL
// Sau đó gọi RapidAPI (/try-on-url) với URL ảnh
// Nhận kết quả ảnh → upload lại Cloudinary → trả URL cho frontend
app.post(
  "/tryon",
  upload.fields([
    { name: "userImage", maxCount: 1 },     // Nhận 1 file userImage
    { name: "productImage", maxCount: 1 }   // Nhận 1 file productImage
  ]),
  async (req, res) => {
    try {
      // 6.1 Kiểm tra xem có file được gửi lên không
      if (!req.files?.userImage || !req.files?.productImage) {
        return res.status(400).json({ error: "Cần upload userImage và productImage" });
      }

      console.log("📂 Nhận file từ frontend:", Object.keys(req.files));

      // 6.2 Lấy đường dẫn file tạm
      const userImagePath = req.files.userImage[0].path;
      const productImagePath = req.files.productImage[0].path;

      // 6.3 Upload file tạm lên Cloudinary để có URL công khai
      const userUpload = await cloudinary.uploader.upload(userImagePath, { resource_type: "image" });
      const productUpload = await cloudinary.uploader.upload(productImagePath, { resource_type: "image" });

      const userImageUrl = userUpload.secure_url;       // URL ảnh người
      const productImageUrl = productUpload.secure_url; // URL ảnh áo/quần

      console.log("☁️ Upload lên Cloudinary thành công:", { userImageUrl, productImageUrl });

      // 6.4 Chuẩn bị dữ liệu cho RapidAPI (/try-on-url)
      const postData = qs.stringify({
        avatar_image_url: userImageUrl,
        clothing_image_url: productImageUrl
      });

      const options = {
        method: "POST",
        hostname: "try-on-diffusion.p.rapidapi.com",
        path: "/try-on-url", // RapidAPI endpoint (chỉ nhận URL ảnh)
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,   // Key lấy từ .env
          "x-rapidapi-host": "try-on-diffusion.p.rapidapi.com",
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(postData)
        }
      };

      // 6.5 Tạo request đến RapidAPI
      const apiReq = https.request(options, (apiRes) => {
        const chunks = [];

        // Nhận từng phần dữ liệu ảnh (binary)
        apiRes.on("data", (chunk) => chunks.push(chunk));

        // Khi đã nhận xong toàn bộ dữ liệu
        apiRes.on("end", () => {
          const buffer = Buffer.concat(chunks); // Gom tất cả binary thành buffer

          // 6.6 Upload ảnh kết quả lên Cloudinary để có URL
          cloudinary.uploader
            .upload_stream({ resource_type: "image" }, (error, result) => {
              if (error) {
                console.error("❌ Upload Cloudinary lỗi:", error);
                return res.status(500).json({ error: "Không upload được ảnh kết quả" });
              }

              // 6.7 Trả URL ảnh kết quả về cho frontend
              res.json({ generated_image_url: result.secure_url });
            })
            .end(buffer); // Gửi buffer ảnh vào stream upload
        });
      });

      // 6.8 Bắt lỗi nếu request RapidAPI fail
      apiReq.on("error", (err) => {
        console.error("❌ Lỗi gọi RapidAPI:", err.message);
        res.status(500).json({ error: err.message });
      });

      // 6.9 Gửi dữ liệu (URL ảnh) cho RapidAPI
      apiReq.write(postData);
      apiReq.end();
    } catch (err) {
      console.error("❌ Backend error:", err);
      res.status(500).json({ error: "Có lỗi khi xử lý" });
    }
  }
);

// =======================
// 7️⃣ Khởi động server
// =======================
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
