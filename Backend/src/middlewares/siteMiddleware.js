/**
 * Middleware để nhận diện Trang (Site Identification)
 * Dựa trên Subdomain hoặc Header X-Site-Key (Dành cho Admin)
 */
const siteMiddleware = (req, res, next) => {
  const host = req.headers.host || "";
  let siteKey = "main"; // Mặc định

  // 1. Nhận diện theo Subdomain (Dành cho khách hàng truy cập)
  if (host.includes("german.") || host.includes("tieng-duc.")) {
    siteKey = "tieng-duc";
  } else if (host.includes("china.") || host.includes("tieng-trung.")) {
    siteKey = "tieng-trung";
  }

  // 1.5 Nhận diện theo Path (Mới: hỗ trợ go.ulaedu.com/german)
  const path = req.originalUrl.toLowerCase();
  if (path.startsWith("/german") || path.startsWith("/tieng-duc")) {
    siteKey = "tieng-duc";
  } else if (path.startsWith("/chinese") || path.startsWith("/tieng-trung")) {
    siteKey = "tieng-trung";
  }

  // 2. Nhận diện theo Header (Dành cho Admin khi chuyển đổi giữa các trang quản trị)
  const headerSiteKey = req.headers["x-site-key"];
  if (headerSiteKey) {
    siteKey = headerSiteKey;
  }

  // 3. Nhận diện theo Query Param hoặc Body (Dành cho Postman/Admin)
  const siteInRequest = req.query.site || req.query.siteKey || req.body?.siteKey || req.body?.site;
  if (siteInRequest) {
    siteKey = siteInRequest;
  }

  // 4. Gán vào request object để sử dụng ở các controller
  req.siteKey = siteKey;
  
  next();
};

module.exports = siteMiddleware;
