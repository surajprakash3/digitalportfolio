/**
 * Robust image URL constructor that handles Cloudinary URLs, 
 * local paths, and potential missing slashes.
 */
export const getImageUrl = (url) => {
  if (!url) return '';
  
  // If it's already a full URL (Cloudinary or external), return as is
  if (url.startsWith('http') || url.startsWith('https') || url.startsWith('data:')) {
    return url;
  }
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  // Remove trailing slashes and the /api suffix to get the base server URL
  const baseUrl = apiUrl.replace(/\/api\/?$/, '');
  
  // Ensure the URL path starts with a single leading slash
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  
  return `${baseUrl}${normalizedPath}`;
};
