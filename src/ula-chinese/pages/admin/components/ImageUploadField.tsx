import React, { useRef, useState } from 'react';
import { Upload, X, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { resolveAssetUrl } from '../../../utils/assetUtil';

interface ImageUploadFieldProps {
  label: string;
  value: string | File;
  onChange: (value: string | File) => void;
  className?: string;
  type?: 'image' | 'video';
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  className = '',
  type = 'image',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const clear = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const previewUrl = value instanceof File ? URL.createObjectURL(value) : value;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 flex items-center gap-2">
        <ImageIcon className="w-3 h-3 text-indigo-500" />
        {label}
      </label>

      <div className="flex flex-col gap-3">
        {/* URL Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
            <LinkIcon className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-950 transition-all font-medium"
            placeholder="Paste direct image/video URL..."
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>

        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden
            ${isDragging ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10'}
            ${previewUrl ? 'aspect-video' : 'py-8'}
          `}
        >
          {previewUrl ? (
            <div className="absolute inset-0 group">
              {type === 'video' && typeof previewUrl === 'string' && previewUrl.includes('mp4') ? (
                <video src={previewUrl} className="w-full h-full object-cover" muted loop autoPlay />
              ) : (
                <img src={resolveAssetUrl(previewUrl)} alt="Preview" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <div className="bg-white/10 p-2 rounded-full border border-white/20">
                  <Upload className="w-5 h-5 text-white" />
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); clear(); }}
                className="absolute top-3 right-3 p-1.5 bg-rose-500/80 hover:bg-rose-500 rounded-full text-white shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="p-3 rounded-2xl bg-slate-900 border border-white/5 text-indigo-400 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-slate-300">Drag & drop or Click</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Local media files supported</p>
              </div>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept={type === 'image' ? 'image/*' : 'video/*,image/*'}
          />
        </div>
      </div>
    </div>
  );
};
export default ImageUploadField;
