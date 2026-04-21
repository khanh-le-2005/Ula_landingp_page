/**
 * Chuyển đổi một object lồng nhau thành FormData.
 * Hỗ trợ các trường hợp có File (để upload) xen kẽ với dữ liệu JSON.
 */
export const flattenToFormData = (data: any, formData = new FormData(), parentKey = ''): FormData => {
  if (data === null || data === undefined) return formData;

  if (data instanceof File || data instanceof Blob) {
    formData.append(parentKey, data);
  } else if (Array.isArray(data)) {
    data.forEach((val, i) => {
      // Đối với mảng kiểu nguyên thủy, ta có thể dùng key[index] 
      // Nhưng để nhất quán với cách Backend unflatten, ta dùng key[index] hoặc key.index
      flattenToFormData(val, formData, `${parentKey}[${i}]`);
    });
  } else if (typeof data === 'object' && !(data instanceof Date)) {
    Object.keys(data).forEach((key) => {
      const fullKey = parentKey ? `${parentKey}[${key}]` : key;
      flattenToFormData(data[key], formData, fullKey);
    });
  } else {
    formData.append(parentKey, data);
  }

  return formData;
};
