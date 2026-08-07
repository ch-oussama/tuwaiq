"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, Loader2, Check, ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  onUpload?: (url: string) => void;
  multiple?: boolean;
  onUploadAll?: (urls: string[]) => void;
  path?: string;
  label?: string;
  className?: string;
}

interface UploadingFile {
  file: File;
  progress: "compressing" | "uploading" | "done" | "error";
  originalSize: number;
  compressedSize?: number;
  url?: string;
  error?: string;
}

async function compressImage(file: File, maxDim = 1200, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height / width) * maxDim);
          width = maxDim;
        } else {
          width = Math.round((width / height) * maxDim);
          height = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Compression failed"));
        },
        "image/webp",
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

async function uploadToCloudinary(file: Blob, fileName: string, folder: string): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", file, fileName);
  formData.append("upload_preset", uploadPreset || "tuwaiq_projects");
  formData.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Upload failed");
  }

  const data = await res.json();
  return data.secure_url;
}

export default function ImageUploader({
  onUpload,
  multiple = false,
  onUploadAll,
  path = "uploads",
  label,
  className = "",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const processFiles = useCallback(
    async (selected: FileList | File[]) => {
      const imageFiles = Array.from(selected).filter((f) =>
        f.type.startsWith("image/")
      );
      if (imageFiles.length === 0) return;

      const entries: UploadingFile[] = imageFiles.map((file) => ({
        file,
        progress: "compressing" as const,
        originalSize: file.size,
      }));

      setFiles((prev) => [...prev, ...entries]);

      const urls: string[] = [];

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const idx = files.length + i;

        try {
          const compressed = await compressImage(entry.file);

          setFiles((prev) => {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], progress: "uploading", compressedSize: compressed.size };
            return copy;
          });

          const safeName = entry.file.name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.[^.]+$/, ".webp");
          const url = await uploadToCloudinary(compressed, safeName, path);

          setFiles((prev) => {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], progress: "done", url };
            return copy;
          });

          urls.push(url);
          onUpload?.(url);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Unknown error";
          setFiles((prev) => {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], progress: "error", error: message };
            return copy;
          });
        }
      }

      if (multiple && onUploadAll && urls.length > 0) {
        onUploadAll(urls);
      }
    },
    [files.length, multiple, onUpload, onUploadAll, path]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const savings = files.filter((f) => f.compressedSize).reduce(
    (acc, f) => ({
      original: acc.original + f.originalSize,
      compressed: acc.compressed + (f.compressedSize || 0),
    }),
    { original: 0, compressed: 0 }
  );

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          if (e.target.files) processFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          dragOver
            ? "border-brand-gold bg-brand-gold/10 scale-[1.02]"
            : "border-border hover:border-brand-gold/50 hover:bg-surface"
        }`}
      >
        <Upload className="mx-auto mb-2 text-foreground/40" size={28} />
        <p className="text-sm font-bold text-foreground/60">
          {label || "اسحب الصور هنا أو اضغط لاختيارها"}
        </p>
        <p className="text-xs text-foreground/40 mt-1">
          WebP • ضغط تلقائي حتى 90%
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((f, i) => (
            <div
              key={`${f.file.name}-${i}`}
              className="flex items-center gap-3 bg-surface border border-border rounded-xl px-3 py-2 text-sm"
            >
              <ImageIcon size={16} className="text-foreground/40 flex-shrink-0" />
              <span className="truncate flex-1 font-medium">{f.file.name}</span>

              {f.progress === "compressing" && (
                <span className="text-brand-gold text-xs font-bold flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" /> ضغط...
                </span>
              )}
              {f.progress === "uploading" && (
                <span className="text-brand-gold text-xs font-bold flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" /> رفع...
                </span>
              )}
              {f.progress === "done" && (
                <span className="text-green-500 text-xs font-bold flex items-center gap-1">
                  <Check size={12} />
                  {formatSize(f.originalSize!)} → {formatSize(f.compressedSize!)}
                  <span className="text-green-600/70">
                    ({Math.round((1 - (f.compressedSize || 0) / (f.originalSize || 1)) * 100)}%)
                  </span>
                </span>
              )}
              {f.progress === "error" && (
                <span className="text-red-500 text-xs font-bold">{f.error}</span>
              )}

              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="text-foreground/30 hover:text-red-500 transition p-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {savings.original > 0 && (
            <div className="text-xs text-brand-gold font-bold bg-brand-gold/10 rounded-xl px-3 py-2 text-center">
              وفّرت {formatSize(savings.original - savings.compressed)} •{" "}
              {Math.round((1 - savings.compressed / savings.original) * 100)}% أصغر
            </div>
          )}
        </div>
      )}
    </div>
  );
}
