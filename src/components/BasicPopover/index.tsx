"use client";

import { useState, ReactNode, useEffect, useRef } from "react";

interface PopoverProps {
  content: ReactNode;
  trigger?: "click" | "hover";
  placement?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
}

export default function Popover({ content, trigger = "click", placement = "right", children }: PopoverProps) {
  const [visible, setVisible] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [adjustedStyles, setAdjustedStyles] = useState<Record<string, string>>({});

  const handleToggle = () => setVisible(!visible);
  const handleMouseEnter = () => trigger === "hover" && setVisible(true);
  const handleMouseLeave = () => trigger === "hover" && setVisible(false);

  // ✅ 监听全局点击事件，点击空白处关闭 Popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ 计算 Popover 位置，防止内容溢出屏幕
  useEffect(() => {
    if (!popoverRef.current || !buttonRef.current) return;

    const popoverRect = popoverRef.current.getBoundingClientRect();
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = buttonRect.left + buttonRect.width / 2 - popoverRect.width / 2; // 默认居中
    let top = buttonRect.bottom + 10; // 默认下方弹出

    // ✅ 按钮贴近左侧时，固定 Popover 在 `left: 10px`
    if (buttonRect.left < 20) {
      left = 10;
    }

    // ✅ 按钮贴近右侧时，避免 Popover 过度溢出
    if (popoverRect.right > viewportWidth) {
      left = viewportWidth - popoverRect.width - 10;
    }

    // ✅ 按钮贴近底部时，调整 Popover 到按钮上方
    if (popoverRect.bottom > viewportHeight) {
      top = buttonRect.top - popoverRect.height - 10;
    }

    setAdjustedStyles({ top: `${top}px`, left: `${left}px` });
  }, [visible]);



  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={buttonRef} onClick={handleToggle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="relative">
        {children}
        {/* ✅ 气泡箭头，始终对齐按钮中心 */}

        {visible && (
          <div
            style={{
              position: "absolute",
              width: "10px",
              height: "10px",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              zIndex: 999,
              left: "50%",
              transform: "translateX(-50%) rotate(45deg)"
              // ...(placement === "bottom" && { top: "-5px", left: "50%", transform: "translateX(-50%) rotate(45deg)" }),
              // ...(placement === "top" && { bottom: "15px", left: "50%", transform: "translateX(-50%) rotate(45deg)" }),
              // ...(placement === "bottom" && { top: "-5px", left: "50%", transform: "translateX(-50%) rotate(45deg)" }),
              // ...(placement === "left" && { right: "-5px", top: "50%", transform: "translateY(-50%) rotate(45deg)" }),
              // ...(placement === "right" && { left: "-5px", top: "50%", transform: "translateY(-50%) rotate(45deg)" }),
            }}
          />
        )}

      </div>

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
            maxWidth: "250px", // ✅ 限制最大宽度，避免超出屏幕
            overflow: "hidden",
            ...adjustedStyles, // ✅ 调整 Popover 位置，防止溢出
            ...(placement === "top" && { bottom: "100%", left: "50%", transform: "translateX(-50%)" }),
            ...(placement === "bottom" && { top: "120%", left: "50%", transform: "translateX(-50%)" }),
            ...(placement === "left" && { right: "100%", top: "50%", transform: "translateY(-50%)" }),
            ...(placement === "right" && { left: "100%", top: "50%", transform: "translateY(-50%)" }),
          }}
        >

          {content}
        </div>
      )}
    </div>
  );
}
