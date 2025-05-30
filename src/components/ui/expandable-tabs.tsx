
"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOnClickOutside } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface TabBase {
  title?: string;
  icon?: LucideIcon;
  path?: string;
}

interface RegularTab extends TabBase {
  title: string;
  icon: LucideIcon;
  type?: never;
}

interface SeparatorTab extends TabBase {
  type: "separator";
  title?: never;
  icon?: never;
  path?: never;
}

export type TabItem = RegularTab | SeparatorTab;

interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  onChange?: (index: number | null) => void;
  onTabClick?: (path: string | undefined) => void;
  currentPath?: string;
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".25rem" : 0,
    paddingLeft: isSelected ? ".75rem" : ".5rem",
    paddingRight: isSelected ? ".75rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.05, type: "spring", bounce: 0, duration: 0.4 };

export function ExpandableTabs({
  tabs,
  className,
  activeColor = "text-primary",
  onChange,
  onTabClick,
  currentPath,
}: ExpandableTabsProps) {
  const [selected, setSelected] = React.useState<number | null>(
    currentPath ? tabs.findIndex(tab => 'path' in tab && tab.path === currentPath) : null
  );
  const outsideClickRef = React.useRef(null);
  const tabsContainerRef = React.useRef<HTMLDivElement>(null);
  const activeTabRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (currentPath) {
      const index = tabs.findIndex(tab => 'path' in tab && tab.path === currentPath);
      if (index !== -1) {
        setSelected(index);
      }
    }
  }, [currentPath, tabs]);

  // Auto-scroll to active tab
  React.useEffect(() => {
    if (activeTabRef.current && tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const activeTab = activeTabRef.current;
      
      // Calculate position to scroll to
      const scrollLeft = activeTab.offsetLeft - (container.clientWidth / 2) + (activeTab.clientWidth / 2);
      
      // Smooth scroll to the active tab
      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [selected, currentPath]);

  useOnClickOutside(outsideClickRef, () => {
    setSelected(null);
    onChange?.(null);
  });

  const handleSelect = (index: number) => {
    setSelected(index);
    onChange?.(index);
    
    const tab = tabs[index];
    if ('path' in tab && onTabClick) {
      onTabClick(tab.path);
    }
  };

  // Type guard function to check if a tab is a RegularTab
  const isRegularTab = (tab: TabItem): tab is RegularTab => {
    return !('type' in tab);
  };

  const Separator = () => (
    <div className="mx-1 h-[24px] w-[1.2px] bg-border" aria-hidden="true" />
  );

  return (
    <div
      ref={outsideClickRef}
      className={cn(
        "flex items-center gap-1 rounded-2xl border bg-background p-1 shadow-sm",
        className
      )}
    >
      <div 
        ref={tabsContainerRef}
        className="flex items-center overflow-x-auto scrollbar-hide"
      >
        {tabs.map((tab, index) => {
          if ('type' in tab && tab.type === "separator") {
            return <Separator key={`separator-${index}`} />;
          }

          if (isRegularTab(tab)) {
            const Icon = tab.icon;
            const isActive = selected === index || (tab.path && tab.path === currentPath);
            
            return (
              <motion.button
                key={tab.title}
                ref={isActive ? activeTabRef : null}
                variants={buttonVariants}
                initial={false}
                animate="animate"
                custom={isActive}
                onClick={() => handleSelect(index)}
                transition={transition}
                className={cn(
                  "relative flex items-center rounded-xl px-3 py-1.5 text-sm font-medium transition-colors duration-300",
                  isActive
                    ? cn("bg-muted", activeColor)
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon size={18} className="flex-shrink-0" />
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      variants={spanVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={transition}
                      className="overflow-hidden ml-1 text-xs sm:text-sm whitespace-nowrap"
                    >
                      {tab.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          }

          return null; // This should never happen but it makes TypeScript happy
        })}
      </div>
    </div>
  );
}
