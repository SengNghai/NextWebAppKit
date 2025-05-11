"use client";

import { useState, ReactNode, useEffect, useRef } from "react";

interface PopoverProps {
  content: ReactNode; // 气泡内容
  trigger?: "click" | "hover"; // 触发方式
  placement?: "top" | "bottom" | "left" | "right"; // 位置
  children: ReactNode; // 触发 Popover 的组件
}

export default function Popover({ content, trigger = "click", placement = "right", children }: PopoverProps) {
  const [visible, setVisible] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setVisible(!visible);
  const handleMouseEnter = () => trigger === "hover" && setVisible(true);
  const handleMouseLeave = () => trigger === "hover" && setVisible(false);

  // ✅ 监听全局点击事件，点击空白处自动关闭 Popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={buttonRef} onClick={handleToggle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {visible && (
        <div
          ref={popoverRef}
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "8px",
            zIndex: 1000,
            whiteSpace: "nowrap",
            ...(placement === "top" && { bottom: "100%", left: "50%", transform: "translateX(-50%)" }),
            ...(placement === "bottom" && { top: "100%", left: "50%", transform: "translateX(-50%)" }),
            ...(placement === "left" && { right: "100%", top: "50%", transform: "translateY(-50%)" }),
            ...(placement === "right" && { left: "100%", top: "50%", transform: "translateY(-50%)" }),
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "10px",
              height: "10px",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              transform: "rotate(45deg)",
              borderBottom: 'none',
              borderRight: 'none',
              ...(placement === "top" && { bottom: "-5px", left: "50%", transform: "translateX(-50%) rotate(45deg)" }),
              ...(placement === "bottom" && { top: "-5px", left: "50%", transform: "translateX(-50%) rotate(45deg)" }),
              ...(placement === "left" && { right: "-5px", top: "50%", transform: "translateY(-50%) rotate(45deg)" }),
              ...(placement === "right" && { left: "-5px", top: "50%", transform: "translateY(-50%) rotate(45deg)" }),
            }}
          />
          {content}
        </div>
      )}
    </div>
  );
}
