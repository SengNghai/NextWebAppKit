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
      console.log("开启调试工具");
      import("eruda").then((eruda) => eruda.default.init()); // ✅ 仅在客户端动态加载 `eruda`
    }

    // ✅ 初始化 rem 适配
    setRemBase();

    // ✅ 使用 debounce 优化 resize 触发 ✅ 监听 `resize` 和 `orientationchange` 确保适配
    const handleResize = debounce(setRemBase, 100);

    window.addEventListener("resize", () => {
      requestAnimationFrame(handleResize); // ✅ 替代 `setTimeout`，确保无延迟优化
    });
    window.addEventListener("orientationchange", () => {
      requestAnimationFrame(handleResize); // ✅ 替代 `setTimeout`，确保无延迟优化
    });
    // **页面加载时初始化**
    document.addEventListener("DOMContentLoaded", () => {
      requestAnimationFrame(handleResize); // ✅ 替代 `setTimeout`，确保无延迟优化
    });

    return () => {
      window.removeEventListener("resize", () => {
        requestAnimationFrame(handleResize); // ✅ 替代 `setTimeout`，确保无延迟优化
      });
      window.removeEventListener("orientationchange", () => {
        requestAnimationFrame(handleResize); // ✅ 替代 `setTimeout`，确保无延迟优化
      });
    };
  }, [setRemBase, searchParams]);

  useEffect(() => {
    const registerServiceWorker = async () => {
      if (!("serviceWorker" in navigator)) {
        console.warn("Service Worker is not supported in this browser.");
        return;
      }
  
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("✅ Service Worker registered:", registration);
  
        // ✅ 监听 `controllerchange` 事件，确保 Service Worker 激活
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          console.log("✅ Service Worker 控制变更，已激活");
        });
  
      } catch (error) {
        console.error("❌ Service Worker 注册失败:", error);
      }
    };
  
    registerServiceWorker();
  }, []);
  

  return <>{children}</>;
}
