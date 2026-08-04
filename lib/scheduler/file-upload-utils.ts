/** Must match `experimental.proxyClientMaxBodySize` & `serverActions.bodySizeLimit` in next.config.ts */
export const MAX_SERVER_UPLOAD_BYTES = 25 * 1024 * 1024;

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileKey(file: File): string {
  return `${file.name}-${file.lastModified}-${file.size}`;
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

export type CompletionFileMeta = {
  id?: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  format?: string | null;
};

export function toCompletionFileMeta(file: File): CompletionFileMeta {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
  };
}

export function getPerFileUploadSizeError(files: File[]): string | null {
  const oversized = files.find((file) => file.size > MAX_SERVER_UPLOAD_BYTES);

  if (oversized) {
    return `File "${oversized.name}" (${formatFileSize(oversized.size)}) melebihi batas upload ${formatFileSize(MAX_SERVER_UPLOAD_BYTES)} per file. Upload manual ke Google Drive dan tempel link.`;
  }

  return null;
}

export function getUploadSizeError(files: File[]): string | null {
  const perFileError = getPerFileUploadSizeError(files);

  if (perFileError) {
    return perFileError;
  }

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);

  if (totalBytes > MAX_SERVER_UPLOAD_BYTES) {
    return `Total ukuran file (${formatFileSize(totalBytes)}) melebihi batas upload ${formatFileSize(MAX_SERVER_UPLOAD_BYTES)}. Kurangi jumlah atau ukuran file.`;
  }

  return null;
}
