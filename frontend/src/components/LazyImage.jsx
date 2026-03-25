import { useState, useEffect, useRef } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  width,
  height,
  cloudinaryTransform = true,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Optimize Cloudinary URLs with auto format/quality
  const getOptimizedSrc = (url) => {
    if (!cloudinaryTransform || !url || !url.includes('cloudinary')) return url;
    
    // Insert f_auto,q_auto transformations
    return url.replace('/upload/', '/upload/f_auto,q_auto,w_800/');
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before visible
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden bg-slate-200 dark:bg-dark-700 ${className}`}
      style={{ width, height }}
    >
      {/* Blur placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-dark-700 dark:to-dark-600 animate-pulse" />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-slate-600">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
          </svg>
        </div>
      )}

      {/* Actual image */}
      {isInView && !hasError && (
        <img
          src={getOptimizedSrc(src)}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
