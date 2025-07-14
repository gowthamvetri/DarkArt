import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";

export const Card = forwardRef(
  ({ customClass, title, description, ...rest }, ref) => {
    const getCardDimensions = () => {
      const screenWidth = window.innerWidth;
      
      if (screenWidth <= 320) {
        return { width: '200px', height: '260px', minWidth: '180px', minHeight: '240px' };
      } else if (screenWidth <= 480) {
        return { width: '240px', height: '300px', minWidth: '220px', minHeight: '280px' };
      } else if (screenWidth <= 768) {
        return { width: '280px', height: '350px', minWidth: '260px', minHeight: '330px' };
      } else if (screenWidth <= 1024) {
        return { width: '340px', height: '430px', minWidth: '320px', minHeight: '400px' };
      } else if (screenWidth <= 1200) {
        return { width: '380px', height: '480px', minWidth: '360px', minHeight: '450px' };
      } else {
        return { width: '420px', height: '530px', minWidth: '400px', minHeight: '500px' };
      }
    };

    const cardDimensions = getCardDimensions();

    return (
      <div
        ref={ref}
        {...rest}
        className={`absolute top-1/2 left-1/2 rounded-xl border border-white bg-gradient-to-br from-gray-900 to-black shadow-2xl [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] overflow-hidden cursor-pointer card-carousel-card ${customClass ?? ""} ${rest.className ?? ""}`.trim()}
        style={{
          transform: 'translate(-50%, -50%)',
          width: cardDimensions.width,
          height: cardDimensions.height,
          minWidth: cardDimensions.minWidth,
          minHeight: cardDimensions.minHeight,
          ...rest.style
        }}
      >
      {rest.children}
      {(title || description) && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-2 sm:p-3 md:p-4 lg:p-6 text-white transition-all duration-300">
          {title && (
            <h3 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold mb-1 md:mb-2 text-white leading-tight drop-shadow-lg line-clamp-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-200 leading-tight sm:leading-relaxed line-clamp-2 md:line-clamp-3 drop-shadow-md">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
});
Card.displayName = "Card";

const makeSlot = (
  i,
  distX,
  distY,
  total,
  screenWidth = 1200
) => {
  // Adjust multiplier based on screen size for better distribution
  let multiplier = 1.8;
  let zDepthFactor = 0.6;
  
  if (screenWidth <= 320) {
    multiplier = 0.6; // Much tighter spacing for very small screens
    zDepthFactor = 0.2;
  } else if (screenWidth <= 480) {
    multiplier = 0.8; // Tighter spacing for mobile
    zDepthFactor = 0.3;
  } else if (screenWidth <= 768) {
    multiplier = 1.0; // Moderate spacing for tablets
    zDepthFactor = 0.4;
  } else if (screenWidth <= 1024) {
    multiplier = 1.3;
    zDepthFactor = 0.5;
  } else if (screenWidth <= 1200) {
    multiplier = 1.6;
    zDepthFactor = 0.55;
  } else {
    multiplier = 1.8;
    zDepthFactor = 0.6;
  }
  
  return {
    x: (i - (total - 1) / 2) * distX * multiplier,
    y: -i * distY * 0.8, // Reduce vertical spacing
    z: -i * distX * zDepthFactor,
    zIndex: total - i,
  };
};

const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
    left: "50%",
    top: "50%",
  });

const CardSwap = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = true,
  onCardClick,
  skewAmount = 6,
  easing = "elastic",
  responsive = true,
  children,
}) => {
  const config =
    easing === "elastic"
      ? {
        ease: "elastic.out(0.6,0.9)",
        durDrop: 2,
        durMove: 2,
        durReturn: 2,
        promoteOverlap: 0.9,
        returnDelay: 0.05,
      }
      : {
        ease: "power1.inOut",
        durDrop: 0.8,
        durMove: 0.8,
        durReturn: 0.8,
        promoteOverlap: 0.45,
        returnDelay: 0.2,
      };

  const childArr = useMemo(
    () => Children.toArray(children),
    [children]
  );
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(
    Array.from({ length: childArr.length }, (_, i) => i)
  );

  const tlRef = useRef(null);
  const intervalRef = useRef();
  const container = useRef(null);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  // Handle window resize for responsive updates
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Responsive calculations for all devices
  const getResponsiveValues = () => {
    if (!responsive) return { width, height, cardDistance, verticalDistance };
    
    const screenWidth = windowSize.width;
    const screenHeight = windowSize.height;
    
    // Use container dimensions instead of viewport
    const baseWidth = width || screenWidth;
    const baseHeight = height || screenHeight;
    
    // Extra small devices (phones, 320px and up)
    if (screenWidth <= 320) {
      return {
        width: baseWidth,
        height: baseHeight, 
        cardDistance: cardDistance * 0.3, // Much smaller distance for tiny screens
        verticalDistance: verticalDistance * 0.3, 
      };
    }
    // Small devices (phones, 480px and up)
    else if (screenWidth <= 480) {
      return {
        width: baseWidth,
        height: baseHeight, 
        cardDistance: cardDistance * 0.4, // Smaller distance for mobile
        verticalDistance: verticalDistance * 0.4, 
      };
    }
    // Medium devices (tablets, 768px and up)
    else if (screenWidth <= 768) {
      return {
        width: baseWidth,
        height: baseHeight, 
        cardDistance: cardDistance * 0.6, 
        verticalDistance: verticalDistance * 0.5, 
      };
    }
    // Large devices (small laptops, 1024px and up)
    else if (screenWidth <= 1024) {
      return {
        width: baseWidth,
        height: baseHeight, 
        cardDistance: cardDistance * 0.8, 
        verticalDistance: verticalDistance * 0.6, 
      };
    }
    // Extra large devices (large laptops and desktops, 1200px and up)
    else if (screenWidth <= 1200) {
      return {
        width: baseWidth,
        height: baseHeight,
        cardDistance: cardDistance * 1.2,
        verticalDistance: verticalDistance * 0.8,
      };
    }
    // XXL devices (large desktops, 1400px and up)
    else if (screenWidth <= 1400) {
      return {
        width: baseWidth,
        height: baseHeight,
        cardDistance: cardDistance * 1.4,
        verticalDistance: verticalDistance * 0.9,
      };
    }
    // Ultra wide screens (1920px and up)
    else {
      return {
        width: baseWidth,
        height: baseHeight,
        cardDistance: cardDistance * 1.6,
        verticalDistance: verticalDistance * 1.0,
      };
    }
  };

  const responsiveValues = getResponsiveValues();

  useEffect(() => {
    const total = refs.length;
    const { cardDistance: respCardDistance, verticalDistance: respVerticalDistance } = responsiveValues;
    const screenWidth = windowSize.width;
    
    refs.forEach((r, i) =>
      placeNow(
        r.current,
        makeSlot(i, respCardDistance, respVerticalDistance, total, screenWidth),
        skewAmount
      )
    );

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: "+=500",
        duration: config.durDrop,
        ease: config.ease,
      });

      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        const slot = makeSlot(i, respCardDistance, respVerticalDistance, refs.length, screenWidth);
        tl.set(el, { zIndex: slot.zIndex }, "promote");
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(
        refs.length - 1,
        respCardDistance,
        respVerticalDistance,
        refs.length,
        screenWidth
      );
      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        "return"
      );
      tl.set(elFront, { x: backSlot.x, z: backSlot.z }, "return");
      tl.to(
        elFront,
        {
          y: backSlot.y,
          duration: config.durReturn,
          ease: config.ease,
        },
        "return"
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    swap();
    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current;
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
      return () => {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        clearInterval(intervalRef.current);
      };
    }
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, responsiveValues.cardDistance, responsiveValues.verticalDistance, windowSize]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
        key: i,
        ref: refs[i],
        style: { 
          width: responsiveValues.width, 
          height: responsiveValues.height, 
          ...(child.props.style ?? {}) 
        },
        onClick: (e) => {
          child.props.onClick?.(e);
          onCardClick?.(i);
        },
      }) : child
  );

  return (
    <div
      ref={container}
      className="w-full h-full overflow-hidden perspective-[1000px] relative
                 /* Perfect centering for all devices */
                 flex items-center justify-center
                 /* Ensure no translations that could offset position */
                 translate-x-0 translate-y-0"
      style={{ 
        width: '100%', 
        height: '100%',
        minWidth: '100%',
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {rendered}
      </div>
      
      {/* Responsive pause indicator */}
      {pauseOnHover && (
        <div className="absolute top-4 left-4 text-xs text-white bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm opacity-75 max-[768px]:text-[10px] max-[480px]:hidden z-20">
          Hover to pause
        </div>
      )}
    </div>
  );
};

export default CardSwap;
