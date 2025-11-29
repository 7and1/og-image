"use client";

import { createContext, useContext, useState, useRef, type ReactNode, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  tabValues: string[];
  registerTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
}

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [tabValues, setTabValues] = useState<string[]>([]);

  const activeTab = value ?? internalValue;
  const setActiveTab = (newValue: string) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  const registerTab = (tabValue: string) => {
    setTabValues((prev) => {
      if (prev.includes(tabValue)) return prev;
      return [...prev, tabValue];
    });
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, tabValues, registerTab }}>
      <div className={cn("", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-neutral-800/50 p-1",
        className
      )}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function TabsTrigger({
  value,
  children,
  className,
  disabled,
}: TabsTriggerProps) {
  const { activeTab, setActiveTab, tabValues, registerTab } = useTabsContext();
  const isActive = activeTab === value;
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Register this tab on mount
  useState(() => {
    registerTab(value);
  });

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = tabValues.indexOf(value);
    let newIndex: number | null = null;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        newIndex = currentIndex < tabValues.length - 1 ? currentIndex + 1 : 0;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabValues.length - 1;
        break;
      case "Home":
        e.preventDefault();
        newIndex = 0;
        break;
      case "End":
        e.preventDefault();
        newIndex = tabValues.length - 1;
        break;
    }

    if (newIndex !== null) {
      setActiveTab(tabValues[newIndex]);
      // Focus the new tab button
      const buttons = buttonRef.current?.parentElement?.querySelectorAll('[role="tab"]');
      (buttons?.[newIndex] as HTMLButtonElement)?.focus();
    }
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-neutral-700 text-white shadow-sm"
          : "text-neutral-400 hover:text-white hover:bg-neutral-700/50",
        className
      )}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      tabIndex={0}
      className={cn(
        "mt-4 animate-fade-in focus-visible:outline-none",
        className
      )}
    >
      {children}
    </div>
  );
}
