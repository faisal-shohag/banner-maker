import * as React from "react";

// Define breakpoints (aligned with Tailwind CSS defaults)
const SMALL_BREAKPOINT = 640;  // sm
const MEDIUM_BREAKPOINT = 768; // md
const LARGE_BREAKPOINT = 1024; // lg

export function useDeviceSize() {
  const [deviceSize, setDeviceSize] = React.useState<{
    isSmall: boolean;
    isMedium: boolean;
    isLarge: boolean;
  }>({
    isSmall: false,
    isMedium: false,
    isLarge: false,
  });

  React.useEffect(() => {
    const updateDeviceSize = () => {
      const width = window.innerWidth;
      setDeviceSize({
        isSmall: width < SMALL_BREAKPOINT,
        isMedium: width >= SMALL_BREAKPOINT && width < LARGE_BREAKPOINT,
        isLarge: width >= LARGE_BREAKPOINT,
      });
    };

    // Initial check
    updateDeviceSize();

    // Media query listeners
    const smallMql = window.matchMedia(`(max-width: ${SMALL_BREAKPOINT - 1}px)`);
    const mediumMql = window.matchMedia(
      `(min-width: ${SMALL_BREAKPOINT}px) and (max-width: ${LARGE_BREAKPOINT - 1}px)`
    );
    const largeMql = window.matchMedia(`(min-width: ${LARGE_BREAKPOINT}px)`);

    const onChange = () => updateDeviceSize();

    smallMql.addEventListener("change", onChange);
    mediumMql.addEventListener("change", onChange);
    largeMql.addEventListener("change", onChange);

    // Cleanup
    return () => {
      smallMql.removeEventListener("change", onChange);
      mediumMql.removeEventListener("change", onChange);
      largeMql.removeEventListener("change", onChange);
    };
  }, []);

  return deviceSize;
}

// Example usage
const ExampleComponent: React.FC = () => {
  const { isSmall, isMedium, isLarge } = useDeviceSize();

  return (
    <div>
      <p>Device size:</p>
      {isSmall && <p>Small (below {SMALL_BREAKPOINT}px)</p>}
      {isMedium && <p>Medium ({SMALL_BREAKPOINT}px - {LARGE_BREAKPOINT - 1}px)</p>}
      {isLarge && <p>Large ({LARGE_BREAKPOINT}px and above)</p>}
    </div>
  );
};

export default ExampleComponent;