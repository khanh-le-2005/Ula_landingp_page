/**
 * Chuyển đổi một object phẳng (từ form-data) thành object có cấu trúc phân cấp.
 * Ví dụ: { "tabs[0][name]": "A", "user.id": 1 } => { tabs: [{ name: "A" }], user: { id: 1 } }
 */
const unflatten = (data) => {
  const result = {};
  for (let key in data) {
    const keys = key.split(/[\[\].]+/).filter(k => k !== "");
    let current = result;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const isNextNumber = i + 1 < keys.length && /^\d+$/.test(keys[i + 1]);

      if (i === keys.length - 1) {
        current[k] = data[key];
      } else {
        if (!current[k]) {
          current[k] = isNextNumber ? [] : {};
        }
        current = current[k];
      }
    }
  }
  return result;
};

/**
 * Lấy giá trị từ một object lồng nhau dựa trên đường dẫn chuỗi (vd: "cards[0].imgSrc" hoặc "cards[0][imgSrc]")
 */
const getNestedValue = (obj, path) => {
  if (!obj || !path) return null;
  // Chuyển "cards[0][imgSrc]" thành "cards.0.imgSrc"
  const cleanPath = path.replace(/\[(\w+)\]/g, ".$1").replace(/^\./, "");
  return cleanPath.split(".").reduce((acc, part) => acc && acc[part], obj);
};

module.exports = { unflatten, getNestedValue };
