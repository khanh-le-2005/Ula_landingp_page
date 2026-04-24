# 🚀 ULA Marketing System - Tài Liệu API & JSON Chi Tiết (Full Reference)

Tài liệu này cung cấp định dạng dữ liệu (JSON) chi tiết từng trường cho đội ngũ Frontend và Admin.

---

## 1. Cấu Trúc Nội Dung Landing Page (JSON Response)

Khi gọi `GET /api/landing-page`, bạn sẽ nhận được một Object lớn. Dưới đây là mô tả chi tiết các trường trong từng phần (Section).

### A. Section: Hero (`hero`)
Dùng để hiển thị phần đầu trang.
```json
{
  "badge": "Chuỗi văn bản nổi bật trên cùng (ví dụ: GIẢM 50%)",
  "headlineTop": "Dòng tiêu đề chính hàng 1",
  "headlineHighlight": "Phần tiêu đề được tô màu/highlight",
  "headlineBottom": "Dòng tiêu đề chính hàng 2",
  "description": "Đoạn văn mô tả ngắn dưới tiêu đề",
  "primaryCta": "Văn bản trên nút bấm chính (Đăng ký)",
  "secondaryCta": "Văn bản trên nút bấm phụ (Xem thêm)",
  "heroImageUrl": "ID của ảnh hoặc URL ảnh làm nền/nổi bật"
}
```

### B. Section: Nỗi đau khách hàng (`section_2_painpoints`)
```json
{
  "sectionTitle": "Tiêu đề nhỏ phía trên",
  "sectionSubtitle": "Tiêu đề phụ màu nhạt",
  "mainTitleTop": "Tiêu đề chính hàng 1",
  "mainTitleHighlight": "Tiêu đề chính phần nổi bật",
  "bubbles": [
    { "text": "Nội dung của từng bong bóng lỗi lo/vấn đề" }
  ]
}
```

---

## 2. API Tạo Tag Chiến Dịch (Campaign Tags)

Dùng để tạo ra các bản biến thể Landing Page.

- **URL**: `POST /api/campaigns`
- **Headers**:
    - `Content-Type`: `application/json`
    - `X-Site-Key`: `tieng-duc` (hoặc `tieng-trung`)

### Mẫu JSON "Thay Đổi Toàn Bộ" (Full Tag Template)
Bạn hãy copy mẫu này, đây là mẫu đầy đủ các phần từ đầu trang đến cuối trang, kèm cả quà tặng riêng.

```json
{
  "tag": "chien_dich_tong_luc_2024",
  "name": "Chiến Dịch Tổng Lực - Mega Sale",
  "siteKey": "tieng-duc",
  "isActive": true,
  "sections": {
    "hero": {
      "badge": "KHUYẾN MÃI CỰC HẠN 🔥",
      "headlineTop": "HÀNH TRÌNH TỚI ĐỨC",
      "headlineHighlight": "DỄ DÀNG HƠN",
      "headlineBottom": "VỚI ƯU ĐÃI 50%",
      "description": "Lộ trình học chuẩn B1 trong 6 tháng. Đăng ký ngay hôm nay để nhận học bổng toàn phần.",
      "primaryCta": "ĐĂNG KÝ NHẬN ƯU ĐÃI",
      "secondaryCta": "XEM LỘ TRÌNH HỌC",
      "heroImageUrl": "ID_ANH_HERO_MOI"
    },
    "section_2_painpoints": {
      "sectionTitle": "XÓA TAN MỌI TRỞ NGẠI",
      "sectionSubtitle": "CHÚNG TÔI ĐỒNG HÀNH CÙNG BẠN",
      "mainTitleTop": "Vấn đề lớn nhất",
      "mainTitleHighlight": "của bạn là gì?",
      "bubbles": [
        { "text": "Phát âm không chuẩn" },
        { "text": "Sợ giao tiếp" },
        { "text": "Thi mãi không đỗ B1" },
        { "text": "Học phí quá cao" }
      ]
    },
    "section_3_solution": [
      {
        "category": "Lộ Trình Tối Ưu",
        "title": "Học nhanh - Nhớ lâu",
        "bullets": ["Tiết kiệm 30% thời gian", "Học cùng giảng viên chuẩn"],
        "mediaUrl": "ID_ANH_GIAI_PHAP",
        "isVideo": false,
        "gradient": "from-red-600/40 to-blue-500/10"
      }
    ],
    "section_4_methodology": {
      "mainCard": {
        "number": "01",
        "title": "PHƯƠNG PHÁP HIỆN ĐẠI",
        "subTitle": "Học qua trải nghiệm thực tế",
        "imgSrc": "ID_ANH_MO_PHONG"
      },
      "cards": [
        {
          "number": "02",
          "title": "TƯƠNG TÁC AI",
          "subTitle": "Sửa lỗi phát âm 24/7",
          "imgSrc": "ID_ANH_PHU_1"
        }
      ]
    },
    "luckyspin": {
      "headline": "QUAY LÀ TRÚNG - QUÀ KHỦNG LIỀN TAY 🎁",
      "description": "Cơ hội nhận duy nhất hôm nay: Macbook, Voucher 2Tr và nhiều phần quà khác."
    }
  },
  "prizes": [
    { 
      "option": "Macbook Air M3", 
      "code": "MACBOOK", 
      "probability": 0.5, 
      "backgroundColor": "#000000", 
      "textColor": "white" 
    },
    { 
      "option": "Sách Tiếng Đức B1", 
      "code": "SACHB1", 
      "probability": 20, 
      "backgroundColor": "#ba0a0d", 
      "textColor": "white" 
    },
    { 
      "option": "Voucher 500k", 
      "code": "ULA500", 
      "probability": 79.5, 
      "backgroundColor": "#2563eb", 
      "textColor": "white" 
    }
  ]
}
```

### Giải thích các thành phần quan trọng trong JSON:
1. **tag**: Đây là cái tên xuất hiện trên URL của bạn (ví dụ: `?campaign=chien_dich_tong_luc_2024`). Hãy đặt tên không dấu, không khoảng cách.
2. **sections**: Đây là nơi bạn "đè" nội dung lên bản gốc.
    - Bộ key bên trong (như `hero`, `section_2_painpoints`) phải viết chính xác 100% giống như các phần trong Landing Page.
    - Nếu bạn chỉ muốn sửa `hero`, bạn chỉ cần khai báo mỗi `hero` trong `sections`, các phần khác sẽ tự động lấy từ bản gốc.
3. **prizes**: Nếu bạn điền mảng này, vòng quay của chiến dịch này sẽ thay đổi toàn bộ sang bộ quà mới này. Nếu bạn xóa hẳn phần này trong JSON, nó sẽ lấy quà mặc định của trang.
4. **Kết quả nhận được**: Sau khi nhấn **Send**, hệ thống sẽ trả về một Link hoàn chỉnh ở trường `fullUrl`. Bạn chỉ cần copy link đó gửi cho khách hàng là xong! 🚀🦾

---

## 3. Hệ Thống Tracking (Dành cho KOC/UTM)

### API: `GET /api/track`
Frontend nên gọi API này ngay khi phát hiện URL có tham số marketing.

**Tham số truyền lên (Query):**
- `ref`: Mã định danh KOC (Ví dụ: `KOC_YONCY`).
- `utm_source`: Nguồn (Ví dụ: `facebook`, `tiktok`).
- `fbc` & `fbp`: Mã định danh từ Facebook Pixel.

---

## 4. API Vòng Quay - Spin Result

### `POST /api/prizes/spin`
Dùng để lấy kết quả quay từ Server. Trả về:
```json
{
  "prizeId": "ID_TRONG_DB",
  "option": "Voucher 500k",
  "code": "KM500"
}
```

---

## 5. Báo Cáo Marketing (Analytics)

### `GET /api/leads/stats/summary`
Trả về thống kê: SL truy cập/đơn hàng theo từng Tag, từng KOC, từng nguồn UTM.
