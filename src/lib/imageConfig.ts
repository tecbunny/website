// Centralized image configuration for Cloudinary URLs
// This replaces local SVG files with Cloudinary hosted images

export const CLOUDINARY_CONFIG = {
  baseUrl: 'https://res.cloudinary.com/tecbunny-solutions/image/upload',
  folders: {
    icons: 'website/icons',
    products: 'website/products',
    logos: 'website/logos'
  }
};

// Category icons - uploaded to Cloudinary
export const CATEGORY_ICONS = {
  computer: `${CLOUDINARY_CONFIG.baseUrl}/${CLOUDINARY_CONFIG.folders.icons}/computer.svg`,
  network: `${CLOUDINARY_CONFIG.baseUrl}/${CLOUDINARY_CONFIG.folders.icons}/network.svg`,
  mobile: `${CLOUDINARY_CONFIG.baseUrl}/${CLOUDINARY_CONFIG.folders.icons}/mobile.svg`,
  personal: `${CLOUDINARY_CONFIG.baseUrl}/${CLOUDINARY_CONFIG.folders.icons}/personal.svg`,
};

// Product images - uploaded to Cloudinary
export const PRODUCT_IMAGES = {
  webcam: `${CLOUDINARY_CONFIG.baseUrl}/${CLOUDINARY_CONFIG.folders.products}/webcam.svg`,
  speaker: `${CLOUDINARY_CONFIG.baseUrl}/${CLOUDINARY_CONFIG.folders.products}/speaker.svg`,
  phoneCase: `${CLOUDINARY_CONFIG.baseUrl}/${CLOUDINARY_CONFIG.folders.products}/phone-case.svg`,
  keyboard: `${CLOUDINARY_CONFIG.baseUrl}/${CLOUDINARY_CONFIG.folders.products}/keyboard.svg`,
  headphones: `${CLOUDINARY_CONFIG.baseUrl}/${CLOUDINARY_CONFIG.folders.products}/headphones.svg`,
  gamingMouse: `${CLOUDINARY_CONFIG.baseUrl}/${CLOUDINARY_CONFIG.folders.products}/gaming-mouse.svg`,
  airpods: `${CLOUDINARY_CONFIG.baseUrl}/${CLOUDINARY_CONFIG.folders.products}/airpods.svg`,
  router: `${CLOUDINARY_CONFIG.baseUrl}/${CLOUDINARY_CONFIG.folders.products}/router.svg`,
};

// Brand logos
export const BRAND_LOGOS = {
  tecbunny: `${CLOUDINARY_CONFIG.baseUrl}/${CLOUDINARY_CONFIG.folders.logos}/logo.svg`,
};

// Fallback images for when Cloudinary images fail to load
export const FALLBACK_IMAGES = {
  categoryIcon: '/api/placeholder/60/60',
  productImage: '/api/placeholder/300/300',
  logo: '/api/placeholder/150/50',
};

// Helper function to get image URL with fallback
export const getImageUrl = (imageUrl: string, fallback: string) => {
  return imageUrl || fallback;
};

// Helper function to get optimized Cloudinary URL
export const getOptimizedImageUrl = (publicId: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png' | 'svg';
} = {}) => {
  const { width = 300, height = 300, quality = 80, format = 'auto' } = options;
  
  const transformations = [
    width && `w_${width}`,
    height && `h_${height}`,
    `q_${quality}`,
    `f_${format}`,
    'c_fill'
  ].filter(Boolean).join(',');
  
  return `${CLOUDINARY_CONFIG.baseUrl}/${transformations}/${publicId}`;
};
