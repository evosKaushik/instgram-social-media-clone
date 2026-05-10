import { useEffect, useState } from "react";

const breakpoints = {
  xs: "(max-width: 375px)",
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
};

const useMedia = (size = "") => {
  const query = breakpoints[size];

  const [matches, setMatches] = useState(() => {
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);

    const listener = (e) => {
      setMatches(e.matches);
    };

    setMatches(media.matches);

    media.addEventListener("change", listener);

    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
};

export default useMedia;
