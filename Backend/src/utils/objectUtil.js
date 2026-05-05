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

// Các field ảnh được bảo vệ không bị ghi đè bằng chuỗi rỗng
const IMAGE_FIELDS = ['imageUrl', 'heroImageUrl', 'mediaUrl', 'imgSrc', 'mascotImageUrl', 'backgroundUrl'];

/**
 * Merge đệ quy data mới lên data cũ.
 * - Nếu field ảnh gửi lên là "" -> giữ giá trị cũ từ DB
 * - Object -> merge đệ quy; Array -> thay thế theo index
 */
const deepMergePreserveImages = (oldData, newData) => {
  if (!oldData || typeof oldData !== 'object') return newData;
  if (!newData || typeof newData !== 'object') return newData;

  if (Array.isArray(newData)) {
    if (!Array.isArray(oldData)) return newData;
    return newData.map((item, i) => deepMergePreserveImages(oldData[i], item));
  }

  const result = { ...oldData };
  for (const key of Object.keys(newData)) {
    const newVal = newData[key];
    const oldVal = oldData[key];

    if (IMAGE_FIELDS.includes(key) && newVal === '') {
      result[key] = oldVal; // giữ ảnh cũ
      continue;
    }

    if (newVal && typeof newVal === 'object' && !Array.isArray(newVal) &&
        oldVal && typeof oldVal === 'object' && !Array.isArray(oldVal)) {
      result[key] = deepMergePreserveImages(oldVal, newVal);
      continue;
    }

    result[key] = newVal;
  }
  return result;
};

module.exports = { unflatten, getNestedValue, deepMergePreserveImages };
