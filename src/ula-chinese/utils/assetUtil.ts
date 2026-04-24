/**
 * Phân giải URL ảnh từ nhiều nguồn: 
 * 1. URL tuyệt đối (http..., blob:, data:)
 * 2. Asset cục bộ (/src/assets/..., ./, ../)
 * 3. Database Image ID (24 ký tự hex) -> Chuyển thành link API
 */
export const resolveAssetUrl = (pathOrId: any): string | undefined => {
  if (typeof pathOrId === 'object' && pathOrId instanceof File) {
    return URL.createObjectURL(pathOrId);
  }
  if (typeof pathOrId !== 'string' || !pathOrId || !pathOrId.trim()) return undefined;

  const trimmed = pathOrId.trim();

  // 1. Phác thảo các URL có sẵn (Absolute/Blob/Data)
  if (trimmed.startsWith('http') || trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // 2. Các đường dẫn tương đối hoặc tuyệt đối tới file tĩnh trong project
  if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
    return trimmed;
  }

  // 3. Phân biệt MongoDB ObjectID (thường là 24 ký tự hex)
  // Nếu là ID, ta chuyển hướng về API images
  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').replace(/\/$/, '') || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3002' : '');
  
  // Regex kiểm tra 24 ký tự hex
  const isMongoId = /^[0-9a-fA-F]{24}$/.test(trimmed);
  
  if (isMongoId) {
    return `${API_BASE_URL}/api/images/${trimmed}`;
  }

  // Nếu không khớp gì, trả về nguyên bản (tránh làm hỏng các trường hợp đặc biệt khác)
  return trimmed;
};
