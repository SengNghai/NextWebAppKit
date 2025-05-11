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
  const [adjustedPlacement, setAdjustedPlacement] = useState(placement);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => setVisible(!visible);
  const handleMouseEnter = () => trigger === "hover" && setVisible(true);
  const handleMouseLeave = () => trigger === "hover" && setVisible(false);

  // ✅ 点击空白处关闭 Popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ 确保气泡内容不会超出浏览器窗口
  useEffect(() => {
    if (!popoverRef.current || !buttonRef.current) return;

    const popoverRect = popoverRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (popoverRect.right > viewportWidth) {
      setAdjustedPlacement("left");
    } else if (popoverRect.left < 0) {
      setAdjustedPlacement("right");
    } else if (popoverRect.top < 0) {
      setAdjustedPlacement("bottom");
    } else if (popoverRect.bottom > viewportHeight) {
      setAdjustedPlacement("top");
    }
  }, [visible]);

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
            maxWidth: "200px", // ✅ 限制最大宽度，避免超出屏幕
            overflow: "hidden", // ✅ 处理气泡内部内容超长问题
            ...(adjustedPlacement === "top" && { bottom: "100%", left: "50%", transform: "translateX(-50%)" }),
            ...(adjustedPlacement === "bottom" && { top: "100%", left: "50%", transform: "translateX(-50%)" }),
            ...(adjustedPlacement === "left" && { right: "100%", top: "50%", transform: "translateY(-50%)" }),
            ...(adjustedPlacement === "right" && { left: "100%", top: "50%", transform: "translateY(-50%)" }),
          }}
        >
          {/* ✅ 添加三角箭头，并让它随 placement 自动调整 */}
          <div
            style={{
              position: "absolute",
              width: "10px",
              height: "10px",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              transform: "rotate(45deg)",
              borderBottom: "none",
              borderRight: "none",
              ...(adjustedPlacement === "top" && { bottom: "-5px", left: "50%", transform: "translateX(-50%) rotate(45deg)" }),
              ...(adjustedPlacement === "bottom" && { top: "-5px", left: "50%", transform: "translateX(-50%) rotate(45deg)" }),
              ...(adjustedPlacement === "left" && { right: "-5px", top: "50%", transform: "translateY(-50%) rotate(45deg)" }),
              ...(adjustedPlacement === "right" && { left: "-5px", top: "50%", transform: "translateY(-50%) rotate(45deg)" }),
            }}
          />
          {content}
        </div>
      )}
    </div>
  );
}

/*
import BasicPopover from "~/components/BasicPopover";

<BasicPopover content="Hello, this is a custom popover!" placement="bottom">
  <Button color="primary">点我</Button>
</BasicPopover>
*/
