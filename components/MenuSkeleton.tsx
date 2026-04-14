/**
 * Menu Skeleton Loader Component
 * Improves perceived performance while menu items are loading
 * Uses shimmer animation for better UX
 */

export default function MenuSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden p-0 shadow-lg rounded-lg bg-white flex flex-col h-full animate-pulse"
        >
          {/* Image skeleton */}
          <div className="relative w-full h-44 md:h-48 overflow-hidden shrink-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" 
            style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite',
            }}
          />

          {/* Content skeleton */}
          <div className="p-4 flex flex-col justify-between flex-1">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex flex-col justify-center flex-1 min-w-0 gap-2">
                {/* Title placeholder */}
                <div className="h-4 bg-gray-300 rounded w-full" />
                <div className="h-3 bg-gray-300 rounded w-2/3" />
                {/* Price placeholder */}
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2" />
              </div>
              {/* Button placeholder */}
              <div className="w-10 h-10 bg-gray-300 rounded-md shrink-0" />
            </div>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes shimmer {
          0% {
            backgroundPosition: '-200% 0';
          }
          100% {
            backgroundPosition: '200% 0';
          }
        }
      `}</style>
    </div>
  );
}
