"use client";

import { useState, useEffect } from "react";
// import {  getRealViewportHeight } from "~/lib/utils/common";
import styles from "./styles.module.scss";
import { useRouter, usePathname } from "next/navigation";




export default function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ✅ 初始值设定为 `null`，确保 SSR 渲染不影响 HTML 结构
  // const [realHeight, setRealHeight] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);


  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    console.log("当前 URL:", router);
    console.log("当前 URL Name:", pathName);
  }, [router, pathName]);

  // ✅ 获取真实可用高度
  
  useEffect(() => {
    setIsClient(true);
    /*
    if (typeof window !== "undefined") {
      const updateHeight = () => {
        setRealHeight(getRealViewportHeight()); // ✅ 获取真实可用高度
      };

      updateHeight(); // ✅ 页面加载时立即计算真实高度
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }
    */
  }, []);
  

  const tabs = [
    {
      key: "/mobile/home",
      label: "home",
    },
    {
      key: "/mobile/chats",
      label: "chats",
    },
    {
      key: "/mobile/message",
      label: "message",
    },
    {
      key: "/mobile/settings",
      label: "settings",
    },
    
  ];

  const handleAction = (item: typeof tabs[0]) => {
    router.push(item.key)

  }

  const handleBack = () => {
    router.back();
  }

  if (!isClient) return null; // 避免 SSR 期间渲染不匹配

  return (
    <>{children}</>
      
  );
}
