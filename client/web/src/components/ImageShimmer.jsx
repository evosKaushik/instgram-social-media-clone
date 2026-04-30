import { useState } from "react";
import { ShimmerDiv } from "shimmer-effects-react";
import { useTheme } from "../context/ThemeProvider";

const ImageWithShimmer = ({ src, alt, className }) => {
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  // detect dark mode (based on your `.dark` class)
  const isDark = theme === "dark" ? true : false;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* ✅ Shimmer only when loading */}
      {loading && (
        <ShimmerDiv
          mode={isDark ? "dark" : "light"}
          width="100%"
          height="100%"
          rounded={9999}
          loading={loading}
          className="absolute inset-0 z-20 bg-background!"
        />
      )}

      {/* ✅ Image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoading(false)} // ✅ FIXED
        onError={() => setLoading(false)}
        className={`w-full h-full object-cover transition-all duration-500 ${
          loading
            ? "opacity-0 scale-105 blur-sm"
            : "opacity-100 scale-100 blur-0"
        }`}
      />
    </div>
  );
};

export default ImageWithShimmer;
