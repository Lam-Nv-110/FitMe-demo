// =======================
// server.js - FIXED VERSION
// =======================

const express = require("express");
const cors = require("cors");
const https = require("https");
const qs = require("querystring");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Tạo thư mục uploads nếu chưa tồn tại
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cấu hình Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:5500", "http://localhost:5500"],
    credentials: true
}));
app.use(express.json());
app.use(express.static('.')); // Phục vụ file tĩnh

// Route test
app.get("/ping", (req, res) => {
    console.log("✅ Ping received");
    res.json({ 
        message: "pong",
        timestamp: new Date().toISOString(),
        status: "active"
    });
});

// Route Try-On chính
app.post("/tryon", upload.fields([
    { name: "userImage", maxCount: 1 },
    { name: "productImage", maxCount: 1 }
]), async (req, res) => {
    console.log("🔄 Try-on request received");
    
    try {
        // Kiểm tra file
        if (!req.files?.userImage || !req.files?.productImage) {
            console.log("❌ Missing files");
            return res.status(400).json({ 
                error: "Cần upload cả userImage và productImage",
                received: req.files ? Object.keys(req.files) : 'none'
            });
        }

        console.log("📁 Files received:", {
            userImage: req.files.userImage[0].filename,
            productImage: req.files.productImage[0].filename
        });

        // Upload lên Cloudinary
        console.log("☁️ Uploading to Cloudinary...");
        const [userUpload, productUpload] = await Promise.all([
            cloudinary.uploader.upload(req.files.userImage[0].path),
            cloudinary.uploader.upload(req.files.productImage[0].path)
        ]);

        const userImageUrl = userUpload.secure_url;
        const productImageUrl = productUpload.secure_url;

        console.log("✅ Cloudinary upload successful:", {
            userImage: userImageUrl.substring(0, 50) + "...",
            productImage: productImageUrl.substring(0, 50) + "..."
        });

        // Chuẩn bị data cho RapidAPI
        const postData = qs.stringify({
            avatar_image_url: userImageUrl,
            clothing_image_url: productImageUrl
        });

        console.log("🚀 Calling RapidAPI...");

        const options = {
            method: "POST",
            hostname: "try-on-diffusion.p.rapidapi.com",
            path: "/try-on-url",
            headers: {
                "x-rapidapi-key": process.env.RAPIDAPI_KEY,
                "x-rapidapi-host": "try-on-diffusion.p.rapidapi.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": Buffer.byteLength(postData)
            },
            timeout: 30000 // 30s timeout
        };

        // Gọi RapidAPI
        const apiRequest = https.request(options, (apiResponse) => {
            console.log(`📡 RapidAPI response status: ${apiResponse.statusCode}`);
            
            let data = [];
            apiResponse.on('data', (chunk) => {
                data.push(chunk);
            });

            apiResponse.on('end', async () => {
                try {
                    const buffer = Buffer.concat(data);
                    
                    if (apiResponse.statusCode !== 200) {
                        console.log("❌ RapidAPI error:", buffer.toString());
                        return res.status(500).json({ 
                            error: `RapidAPI error: ${apiResponse.statusCode}` 
                        });
                    }

                    console.log("✅ RapidAPI success, uploading result to Cloudinary...");

                    // Upload kết quả lên Cloudinary
                    cloudinary.uploader.upload_stream(
                        { resource_type: "image" },
                        (error, result) => {
                            if (error) {
                                console.error("❌ Cloudinary upload error:", error);
                                return res.status(500).json({ 
                                    error: "Failed to upload result image" 
                                });
                            }

                            console.log("🎉 Try-on completed successfully!");
                            
                            // Xóa file tạm
                            try {
                                fs.unlinkSync(req.files.userImage[0].path);
                                fs.unlinkSync(req.files.productImage[0].path);
                            } catch (cleanupError) {
                                console.log("⚠️ Could not delete temp files:", cleanupError);
                            }

                            res.json({ 
                                generated_image_url: result.secure_url,
                                message: "Thử đồ thành công!"
                            });
                        }
                    ).end(buffer);

                } catch (error) {
                    console.error("❌ Error processing RapidAPI response:", error);
                    res.status(500).json({ error: "Error processing AI result" });
                }
            });
        });

        apiRequest.on('error', (error) => {
            console.error("❌ RapidAPI request error:", error);
            res.status(500).json({ 
                error: `RapidAPI connection failed: ${error.message}` 
            });
        });

        apiRequest.on('timeout', () => {
            console.error("❌ RapidAPI timeout");
            apiRequest.destroy();
            res.status(500).json({ error: "RapidAPI timeout" });
        });

        apiRequest.write(postData);
        apiRequest.end();

    } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).json({ 
            error: "Server error: " + error.message 
        });
    }
});

// Health check
app.get("/health", (req, res) => {
    res.json({ 
        status: "healthy",
        timestamp: new Date().toISOString(),
        cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? "configured" : "missing",
        rapidapi: process.env.RAPIDAPI_KEY ? "configured" : "missing"
    });
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
    console.log(`📡 Endpoints:`);
    console.log(`   GET  http://localhost:${PORT}/ping`);
    console.log(`   GET  http://localhost:${PORT}/health`);
    console.log(`   POST http://localhost:${PORT}/tryon`);
    console.log(`🔑 Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? '✅' : '❌'}`);
    console.log(`🔑 RapidAPI: ${process.env.RAPIDAPI_KEY ? '✅' : '❌'}`);
});