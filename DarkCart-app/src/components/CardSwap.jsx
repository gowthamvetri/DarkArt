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
  ({ customClass, title, description, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`absolute top-1/2 left-1/2 rounded-xl border border-white bg-gradient-to-br from-gray-900 to-black shadow-2xl [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] overflow-hidden cursor-pointer card-carousel-card ${customClass ?? ""} ${rest.className ?? ""}`.trim()}
    >
      {rest.children}
      {(title || description) && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-2 sm:p-3 md:p-4 text-white transition-all duration-300 hover:from-black/100">
          {title && (
            <h3 className="text-xs sm:text-sm md:text-lg font-bold mb-1 md:mb-2 text-white leading-tight">{title}</h3>
          )}
          {description && (
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-200 leading-tight sm:leading-relaxed line-clamp-2 md:line-clamp-3">
              {description}
            </p>
          )}
        </div>
      )}
      
      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 hover:opacity-100 pointer-events-none" />
    </div>
  )
);
Card.displayName = "Card";

const makeSlot = (
  i,
  distX,
  distY,
  total
) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

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

  // Responsive calculations
  const getResponsiveValues = () => {
    if (!responsive) return { width, height, cardDistance, verticalDistance };
    
    const screenWidth = windowSize.width;
    
    if (screenWidth <= 480) {
      return {
        width: width * 0.75, // Increased from 0.6 to 0.75
        height: height * 0.75, // Increased from 0.6 to 0.75
        cardDistance: cardDistance * 0.6, // Increased from 0.5 to 0.6
        verticalDistance: verticalDistance * 0.6, // Increased from 0.5 to 0.6
      };
    } else if (screenWidth <= 768) {
      return {
        width: width * 0.85, // Increased from 0.75 to 0.85
        height: height * 0.85, // Increased from 0.75 to 0.85
        cardDistance: cardDistance * 0.75, // Increased from 0.7 to 0.75
        verticalDistance: verticalDistance * 0.75, // Increased from 0.7 to 0.75
      };
    } else if (screenWidth >= 1024) {
      // Large screens - make cards bigger and adjust spacing
      return {
        width: width * 1.2,
        height: height * 1.2,
        cardDistance: cardDistance * 1.1,
        verticalDistance: verticalDistance * 1.1,
      };
    }
    
    return { width, height, cardDistance, verticalDistance };
  };

  const responsiveValues = getResponsiveValues();

  useEffect(() => {
    const total = refs.length;
    const { cardDistance: respCardDistance, verticalDistance: respVerticalDistance } = responsiveValues;
    
    refs.forEach((r, i) =>
      placeNow(
        r.current,
        makeSlot(i, respCardDistance, respVerticalDistance, total),
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
        const slot = makeSlot(i, respCardDistance, respVerticalDistance, refs.length);
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
        refs.length
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
      className="z-0 absolute right-0 bottom-0 sm:bottom-6 sm:left-100 md:left-130 md:bottom-40 md:right-30 lg:left-180
transform origin-bottom-right perspective-[900px] overflow-visible z--1

translate-x-[-10%] translate-y-[20%]
sm:translate-x-[-15%] sm:translate-y-[18%]
md:translate-x-[-20%] md:translate-y-[16%]
lg:translate-x-[-35%] lg:translate-y-[15%]
xl:translate-x-[-45%] xl:translate-y-[10%]
2xl:translate-x-[-50%] 2xl:translate-y-[8%]

max-[768px]:translate-x-[5%] max-[768px]:translate-y-[5%] max-[768px]:scale-[0.95]
max-[480px]:translate-x-[2%] max-[480px]:translate-y-[2%] max-[480px]:scale-[0.85]"
      style={{ width: responsiveValues.width, height: responsiveValues.height }}
    >
      {rendered}
      
      {/* Responsive pause indicator */}
      {pauseOnHover && (
        <div className="absolute -top-8 left-0 text-xs text-gray-400 opacity-75 max-[768px]:text-[10px] max-[480px]:hidden">
        </div>
      )}
    </div>
  );
};

export default CardSwap;
