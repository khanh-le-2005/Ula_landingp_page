export const getUserFacingErrorMessage = (error: any) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return "Đã có lỗi xảy ra. Vui lòng thử lại sau.";
};
