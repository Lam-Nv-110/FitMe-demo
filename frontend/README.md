👗 FitMe - Ứng dụng Thử đồ AI & Mua sắm Thời trang
Frontend của ứng dụng FitMe, một nền tảng thương mại điện tử thời trang tích hợp công nghệ Thử đồ AI (AI Try-on) để mang lại trải nghiệm mua sắm ảo chân thực và cá nhân hóa.
# ⚙️ Cài đặt và Chạy
## Yêu cầu
Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge).
FitMe Backend đang chạy 

## Các bước:
1.Chạy Backend (BẮT BUỘC):
Đảm bảo rằng Backend đang chạy và khả dụng tại http://localhost:5000 trước khi chạy Frontend.

2.Mở trang web:
```bash
# cài http-server
npm install -g http-server
# chạy html
http-server
```
# 🚀 Tính năng nổi bật

1.Thử đồ AI (AI Try-on): Cho phép người dùng tải lên ảnh và xem trước trang phục mới trên người mẫu ảo một cách thực tế.

2.Mua sắm (Shopping): Trưng bày các sản phẩm thời trang với thông tin chi tiết.

3.Tích hợp Chatbot: Cung cấp hỗ trợ và đề xuất thời trang cá nhân hóa.

# 🛠️ Công nghệ sử dụng
Dự án frontend này được xây dựng bằng các công nghệ web cơ bản, tập trung vào việc xử lý giao diện và giao tiếp với Backend:

## HTML5: 
Cấu trúc chính của trang web (index.html).

## CSS3: 
Định kiểu và thiết kế giao diện (style.css), sử dụng các kỹ thuật bố cục hiện đại như Flexbox/Grid.

## JavaScript (ES6+): 
Xử lý tương tác người dùng, quản lý trạng thái, và quan trọng nhất là gửi yêu cầu AJAX (sử dụng Fetch API hoặc Axios) để giao tiếp với FitMe Backend.

## Font Awesome: 
Thư viện biểu tượng.

# ⚙️ Quy trình Tích hợp Backend: Thử đồ AI
Tính năng cốt lõi Thử đồ AI được thực hiện thông qua giao tiếp với FitMe Backend, giúp Frontend tập trung vào giao diện mà không cần xử lý các tác vụ API nặng.

Chi tiết Luồng Dữ liệu:
Thu thập đầu vào (Frontend): Người dùng chọn hoặc chụp 2 tệp ảnh:

userImage: Ảnh người mẫu hoặc ảnh cá nhân.

productImage: Ảnh sản phẩm quần áo muốn thử.

Gửi yêu cầu (Frontend): Frontend đóng gói 2 tệp ảnh này thành đối tượng form-data và gửi yêu cầu POST đến endpoint /tryon của Backend.

Endpoint: http://localhost:5000/tryon

Body: form-data chứa userImage (file) và productImage (file).

Xử lý (Backend): Backend tiếp nhận yêu cầu, xử lý luồng phức tạp (lưu tạm → Upload lên Cloudinary → Gọi RapidAPI /try-on-url → Nhận kết quả → Upload kết quả lên Cloudinary).

Hiển thị kết quả (Frontend): Frontend nhận được phản hồi JSON từ Backend:

JSON

{
  "generated_image_url": "https://res.cloudinary.com/.../result.png"
}
Frontend sau đó sử dụng URL này để hiển thị ảnh kết quả thử đồ AI đã được tạo ra.

# 📁 Cấu trúc Dự án
Dưới đây là cấu trúc thư mục cốt lõi của dự án:
```
fitme-frontend/
├── css/
│   ├── style.css             # Tập tin CSS chính cho giao diện
├── js/
│   ├── main.js               # Các hàm JavaScript chung
│   ├── ai-tryon.js           # Logic cụ thể cho việc giao tiếp với POST /tryon
│   ├── chatbot.js            # Logic cho Chatbot
│   └── assistant.js          # (Các script hỗ trợ khác)
├── images/
└── index.html                # Trang chủ và cấu trúc chính
└── README.md                 # Tệp này
```
