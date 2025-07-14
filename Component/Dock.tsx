import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  MotionValue,
} from "framer-motion";
import {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
  forwardRef,
  Ref,
} from "react";
import { VscHome, VscArchive, VscAccount, VscSettingsGear, VscColorMode, VscInfo } from "react-icons/vsc";
import "./Dock.css";

export interface DockProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onHome: () => void;
  onHistory: () => void;
  onSettings: () => void;
  onAbout: () => void;
  getHistoryButtonRect?: (rect: DOMRect | null) => void;
  className?: string;
  spring?: { mass: number; stiffness: number; damping: number };
  magnification?: number;
  distance?: number;
  panelHeight?: number;
  dockHeight?: number;
  baseItemSize?: number;
}

interface DockItemType {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

const DockItem = forwardRef<HTMLDivElement, {
  children: ReactNode;
  className?: string;
  onClick: () => void;
  mouseX: MotionValue<number>;
  spring: { mass: number; stiffness: number; damping: number };
  distance: number;
  magnification: number;
  baseItemSize: number;
}>(({ children, className = "", onClick, mouseX, spring, distance, magnification, baseItemSize }, ref) => {
  const localRef = useRef<HTMLDivElement>(null);
  const innerRef = (ref as React.RefObject<HTMLDivElement>) || localRef;
  const isHovered = useMotionValue<number>(0);

  const mouseDistance = useTransform(mouseX, (val: number) => {
    const rect = innerRef.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={innerRef}
      style={{
        width: size,
        height: size,
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`dock-item ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, (child) => {
        const element = child as React.ReactElement<{ isHovered?: MotionValue<number> }>;
        const type = element.type;
        if (
          typeof type === 'function' &&
          ((type as any).displayName === 'DockLabel' || (type as any).name === 'DockLabel')
        ) {
          return cloneElement(element, { isHovered });
        }
        return child;
      })}
    </motion.div>
  );
});

function DockLabel({ children, className = "", isHovered }: { children: ReactNode; className?: string; isHovered: MotionValue<number>; }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on("change", (latest: number) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`dock-label ${className}`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
DockLabel.displayName = 'DockLabel';

function DockIcon({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`dock-icon ${className}`}>{children}</div>;
}

export default function Dock({
  theme,
  onToggleTheme,
  onHome,
  onHistory,
  onSettings,
  onAbout,
  getHistoryButtonRect,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 68,
  dockHeight = 256,
  baseItemSize = 50,
}: DockProps) {
  const mouseX = useMotionValue<number>(Infinity);
  const isHovered = useMotionValue<number>(0);

  // Auto-hide logic
  const [visible, setVisible] = useState(true);
  let hideTimeout: ReturnType<typeof setTimeout> | null = null;
  const dockRef = useRef<HTMLDivElement>(null);
  const historyBtnRef = useRef<HTMLDivElement>(null);

  // Show dock when mouse is near bottom
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerHeight - e.clientY < 60) {
        setVisible(true);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Hide dock after delay when not hovered
  const startHideTimer = () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => setVisible(false), 1800);
  };
  const stopHideTimer = () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    setVisible(true);
  };

  // Expose history button rect
  useEffect(() => {
    if (getHistoryButtonRect && historyBtnRef.current) {
      getHistoryButtonRect(historyBtnRef.current.getBoundingClientRect());
    }
  }, [getHistoryButtonRect, visible]);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  const items: DockItemType[] = [
    {
      icon: <VscHome size={28} />, label: "Home", onClick: onHome, className: "dock-home"
    },
    {
      icon: <VscColorMode size={28} />, label: theme === 'dark' ? "Light Mode" : "Dark Mode", onClick: onToggleTheme, className: "dock-theme"
    },
    {
      icon: <VscSettingsGear size={28} />, label: "Settings", onClick: onSettings, className: "dock-settings"
    },
    {
      icon: <VscInfo size={28} />, label: "About", onClick: onAbout, className: "dock-about"
    },
  ];

  return (
    <motion.div
      ref={dockRef}
      style={{ height, scrollbarWidth: "none",
        transform: visible ? 'translateY(0)' : 'translateY(90px)',
        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)'
      }}
      className="dock-outer"
      onMouseEnter={stopHideTimer}
      onMouseLeave={startHideTimer}
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`dock-panel ${className}`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            ref={item.label === 'History' ? historyBtnRef : undefined}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel isHovered={isHovered}>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
} 