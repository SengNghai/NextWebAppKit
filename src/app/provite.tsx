"use client";

import { useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { setRemBase as rawSetRemBase } from "~/lib/utils/common";

export default function Provider({ children }: { children: React.ReactNode }) {
  const setRemBase = useCallback(() => {
    rawSetRemBase();
  }, []);

  useEffect(() => {
    // ✅ 确保 `window` 可用 (防止 SSR 运行)
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      import("eruda").then((eruda) => eruda.default.init()); // ✅ 仅在客户端动态加载 `eruda`
    }

    // ✅ 初始化 rem 适配
    setRemBase();

    // ✅ 使用 debounce 优化 resize 触发 ✅ 监听 `resize` 和 `orientationchange` 确保适配
    const handleResize = debounce(setRemBase, 100);

    window.addEventListener("resize", () => {
      requestAnimationFrame(setRemBase); // ✅ 替代 `setTimeout`，确保无延迟优化
    });
    window.addEventListener("orientationchange", () => {
      requestAnimationFrame(setRemBase); // ✅ 替代 `setTimeout`，确保无延迟优化
    });
    // **页面加载时初始化**
    document.addEventListener("DOMContentLoaded", () => {
      requestAnimationFrame(setRemBase); // ✅ 替代 `setTimeout`，确保无延迟优化
    });

    return () => {
      window.removeEventListener("resize", () => {
        requestAnimationFrame(setRemBase); // ✅ 替代 `setTimeout`，确保无延迟优化
      });
      window.removeEventListener("orientationchange", () => {
        requestAnimationFrame(setRemBase); // ✅ 替代 `setTimeout`，确保无延迟优化
      });
    };
  }, [setRemBase]);

  return <>{children}</>;
}
