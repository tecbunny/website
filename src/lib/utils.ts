export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function generateOrderId(): string {
  return 'TB' + Date.now().toString() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Cloudinary helper functions
export function getCloudinaryImageUrl(
  publicId: string,
  options: {
    width?: number | string;
    height?: number | string;
    crop?: string;
    quality?: string | number;
    format?: string;
  } = {}
): string {
  const {
    width = 800,
    height = 600,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options;

  const baseUrl = `https://res.cloudinary.com/doudaqth/image/upload`;
  const transformations: string[] = [];

  if (width || height) {
    transformations.push(`w_${width || 'auto'},h_${height || 'auto'},c_${crop}`);
  }
  if (quality) {
    transformations.push(`q_${quality}`);
  }
  if (format) {
    transformations.push(`f_${format}`);
  }

  const transformationString = transformations.length > 0 ? `/${transformations.join(',')}` : '';
  return `${baseUrl}${transformationString}/${publicId}`;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File too large. Please upload an image under 5MB.',
    };
  }

  return { valid: true };
}

// Email utility functions
export async function sendEmailNotification(type: string, to: string, data: Record<string, unknown>) {
  try {
    const response = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        to,
        data,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return await response.json();
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export function generateResetToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function isValidEmailDomain(email: string): boolean {
  // Add any domain restrictions here if needed
  const blockedDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? !blockedDomains.includes(domain) : false;
}
