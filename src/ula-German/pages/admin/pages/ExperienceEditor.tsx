import React from 'react';
import { RefreshCw, Save, Brain, Layout, Image as ImageIcon, Sparkles } from 'lucide-react';
import { experienceDefault, type ExperienceContent } from '../adminData';
import { ADMIN_SECTION_KEYS } from '../adminSections';
import { useLandingSection } from '../hooks/useLandingSection';
import { adminCard, adminInput, adminLabel, adminPrimaryButton, adminSecondaryButton, adminAccentText } from '../adminTheme';
import { ImageUploadField } from '../components/ImageUploadField';
import { flattenToFormData } from '../utils/formDataUtil';

export default function ExperienceEditor() {
  const { content, setContent, isLoading, isSaving, lastSavedAt, reload, save } = useLandingSection<ExperienceContent>(
    ADMIN_SECTION_KEYS.experience,
    experienceDefault,
  );

  const handleSave = async () => {
    try {
      // 1. Tạo một bản sao để "rửa" dữ liệu trước khi lưu
      const cleanContent = { ...content };

      // 2. KIỂM TRA & BẢO VỆ ẢNH AI PRONUNCIATION
      // Nếu trường này đang chứa File (người dùng vừa upload ảnh mới) -> Giữ nguyên để upload
      const isNewFile = cleanContent.aiPronunciationImageUrl instanceof File;
      
      // Nếu là URL hợp lệ (chữ, không rỗng, không phải chữ "null" hay "[object Object]") -> Giữ nguyên
      const isOldValidUrl = typeof cleanContent.aiPronunciationImageUrl === 'string' && 
                            cleanContent.aiPronunciationImageUrl.trim() !== '' && 
                            cleanContent.aiPronunciationImageUrl !== 'null' && 
                            !cleanContent.aiPronunciationImageUrl.includes('[object Object]');

      // Nếu không rơi vào 2 trường hợp trên (VD: bị rỗng, null, xóa đi) -> Xóa trường này khỏi Payload
      // Việc xóa khỏi Payload sẽ giúp Backend (hàm $set) KHÔNG ghi đè trường này, giữ nguyên ảnh cũ trong DB!
      if (!isNewFile && !isOldValidUrl) {
        delete cleanContent.aiPronunciationImageUrl;
      }

      // 3. Đóng gói và Gửi lên
      const formData = flattenToFormData(cleanContent);
      await save(formData);
      
      alert('Đã lưu thay đổi thành công!');
    } catch (err) {
      alert('Có lỗi xảy ra khi lưu: ' + (err instanceof Error ? err.message : 'Lỗi không xác định'));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className={adminCard}>
        <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
              <Sparkles className="h-3 w-3 text-indigo-500" />
              Góc Học tập Công nghệ
            </div>
            <h2 className="text-3xl font-black tracking-tight text-black">
              Soạn thảo <span className={adminAccentText}>Trải nghiệm</span>
            </h2>
            {lastSavedAt && (
              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Tự động đồng bộ: {new Date(lastSavedAt).toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => void reload()} className={adminSecondaryButton}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Đồng bộ
            </button>
            <button onClick={handleSave} disabled={isSaving} className={adminPrimaryButton}>
              <Save className="h-4 w-4" />
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid gap-8 md:grid-cols-1">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className={adminLabel}>Tiêu đề chính</div>
                <input
                  className={adminInput}
                  value={content.sectionTitle || ''}
                  onChange={(e) => setContent(prev => ({ ...prev, sectionTitle: e.target.value }))}
                  placeholder="HỌC TẬP KHÔNG GIỚI HẠN CÙNG ULA..."
                />
              </div>
              <div className="space-y-2">
                <div className={adminLabel}>Tiêu đề phụ (In nghiêng)</div>
                <input
                  className={adminInput}
                  value={content.sectionSubtitle || ''}
                  onChange={(e) => setContent(prev => ({ ...prev, sectionSubtitle: e.target.value }))}
                  placeholder="Demo bài tập tương tác ngay trên hệ thống..."
                />
              </div>
            </div>

            <div className="rounded-[2rem] bg-indigo-500/5 p-8 border border-indigo-500/10">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Phương tiện Phát âm AI</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hình ảnh hiển thị trong Tab AI Sửa Phát Âm</p>
                </div>
              </div>

              <ImageUploadField
                label="Hình ảnh hiển thị"
                value={content.aiPronunciationImageUrl || ''}
                onChange={(val) => setContent(prev => ({ ...prev, aiPronunciationImageUrl: val }))}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}