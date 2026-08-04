/** Resize wallpaper uploads for localStorage quota — no HEIC / optimize toggle. */

const DEFAULT_QUALITY = 0.82;

function readFileAsDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Failed to read image file."));
        return;
      }

      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
}

function scaleDimensions(
  width: number,
  height: number,
  maxEdge: number,
): { width: number; height: number } {
  const largestEdge = Math.max(width, height);

  if (largestEdge <= maxEdge) {
    return { width, height };
  }

  const scale = maxEdge / largestEdge;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

function loadImageFromFile(file: File | Blob): Promise<HTMLImageElement> {
  const objectUrl = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("This image could not be previewed in your browser."));
    };

    image.src = objectUrl;
  });
}

function supportsWebpEncoding(): boolean {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL("image/webp").startsWith("data:image/webp");
  } catch {
    return false;
  }
}

export async function prepareWallpaperImageDataUrl(
  file: File,
  options: { maxEdgePx: number },
): Promise<string> {
  if (file.type === "image/gif") {
    return readFileAsDataUrl(file);
  }

  const image = await loadImageFromFile(file);
  const { width, height } = scaleDimensions(
    image.naturalWidth,
    image.naturalHeight,
    options.maxEdgePx,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Your browser does not support image processing.");
  }

  context.drawImage(image, 0, 0, width, height);

  if (supportsWebpEncoding()) {
    const webp = canvas.toDataURL("image/webp", DEFAULT_QUALITY);
    if (webp.startsWith("data:image/webp")) {
      return webp;
    }
  }

  const jpeg = canvas.toDataURL("image/jpeg", DEFAULT_QUALITY);
  if (!jpeg.startsWith("data:image/jpeg")) {
    throw new Error("Failed to prepare image.");
  }

  return jpeg;
}
