import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';
import { CameraModal } from './CameraModal';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

interface ImageUploaderProps {
  selectedImage: File | null;
  imagePreview: string | null;
  onImageSelected: (file: File, previewUrl: string) => void;
  onImageRemoved: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  selectedImage,
  imagePreview,
  onImageSelected,
  onImageRemoved
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const { t } = useLanguage();

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validExtension = /\.(jpe?g|png|webp)$/i.test(file.name);
    if (!validTypes.includes(file.type) && !validExtension) {
      showToast('Please upload a valid image file (JPG, JPEG, PNG, or WebP)', 'error');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showToast('Image size exceeds 15MB. Please choose a smaller photo.', 'error');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onImageSelected(file, previewUrl);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleCameraCapture = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    onImageSelected(file, previewUrl);
    showToast('Photo captured successfully!', 'success');
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={e => handleFiles(e.target.files)}
        accept="image/jpeg,image/png,image/jpg,image/webp"
        className="hidden"
      />

      {imagePreview ? (
        /* Image Preview Area */
        <div className="relative rounded-2xl overflow-hidden border-2 border-agri-500/30 bg-stone-900 shadow-md group">
          <img
            src={imagePreview}
            alt="Leaf Preview"
            className="w-full max-h-[380px] object-contain mx-auto"
          />

          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={onImageRemoved}
              className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
              title={t('detect.removeImage')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between text-white text-xs">
            <span className="flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {selectedImage ? selectedImage.name : 'Crop Photo Ready'}
            </span>
            {selectedImage && (
              <span className="text-stone-300 text-[11px]">
                {(selectedImage.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Dropzone Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-4 ${
            isDragging
              ? 'border-agri-500 bg-agri-50/50 dark:bg-agri-950/30 scale-[1.01]'
              : 'border-stone-300 dark:border-darkbg-border bg-white/60 dark:bg-darkbg-card/60 hover:border-agri-500 hover:bg-agri-50/20 dark:hover:bg-darkbg-input'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-agri-100 dark:bg-agri-950/70 text-agri-700 dark:text-agri-400 flex items-center justify-center shadow-xs">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <p className="text-base font-semibold text-stone-800 dark:text-stone-100">
              {t('detect.uploadBox')}
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {t('detect.uploadFormats')}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2" onClick={e => e.stopPropagation()}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              icon={<ImageIcon className="w-4 h-4" />}
            >
              Browse Files
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsCameraOpen(true)}
              icon={<Camera className="w-4 h-4" />}
            >
              {t('detect.useCamera')}
            </Button>
          </div>
        </div>
      )}

      {/* Live Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
};
