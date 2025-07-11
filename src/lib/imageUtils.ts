// Utility functions for Cloudinary image uploads with organized folder structure

export interface UploadResult {
  url: string;
  public_id: string;
}

export interface UploadConfig {
  type: 'logo' | 'banner' | 'product' | 'avatar' | 'website' | 'general';
  productId?: string;
  maxSizeInMB?: number;
  allowedTypes?: string[];
}

/**
 * Upload an image to Cloudinary with organized folder structure
 */
export async function uploadImage(
  file: File, 
  config: UploadConfig
): Promise<UploadResult> {
  const { type, productId, maxSizeInMB = 5, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] } = config;

  // Validate file
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    throw new Error(`File too large. Maximum size is ${maxSizeInMB}MB.`);
  }

  // Prepare form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  if (productId && type === 'product') {
    formData.append('productId', productId);
  }

  // Upload to API
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Upload failed');
  }

  const data = await response.json();
  return {
    url: data.url,
    public_id: data.public_id
  };
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/upload?publicId=${encodeURIComponent(publicId)}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      console.error('Failed to delete image:', await response.text());
      return false;
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * Get optimized Cloudinary URL with transformations
 */
export function getOptimizedImageUrl(
  publicId: string, 
  transformations: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'limit';
    quality?: 'auto' | number;
    format?: 'auto' | 'jpg' | 'png' | 'webp';
  } = {}
): string {
  const { width, height, crop = 'limit', quality = 'auto', format = 'auto' } = transformations;
  
  const transforms: string[] = [];
  
  if (width || height) {
    transforms.push(`w_${width || 'auto'},h_${height || 'auto'},c_${crop}`);
  }
  
  transforms.push(`q_${quality},f_${format}`);
  const transformString = transforms.join(',');
  
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transformString}/${publicId}`;
}

/**
 * Validate image file before upload
 */
export function validateImageFile(
  file: File, 
  options: {
    maxSizeInMB?: number;
    allowedTypes?: string[];
  } = {}
): string | null {
  const { maxSizeInMB = 5, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] } = options;

  if (!allowedTypes.includes(file.type)) {
    return `Invalid file type. Please upload one of: ${allowedTypes.map(type => type.replace('image/', '')).join(', ').toUpperCase()}`;
  }

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return `File too large. Please upload an image under ${maxSizeInMB}MB.`;
  }

  return null;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
