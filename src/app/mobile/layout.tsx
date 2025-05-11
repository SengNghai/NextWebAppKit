"use client";

import { useState, useEffect, useRef } from "react";
import { pxToRem, getRealViewportHeight } from "~/lib/utils/common";
import styles from "./styles.module.scss";
import { Button } from "antd-mobile";
import BasicPopover from "~/components/BasicPopover";
import Link from 'next/link'
import { useRouter, usePathname } from "next/navigation";




export default function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ✅ 初始值设定为 `null`，确保 SSR 渲染不影响 HTML 结构
  const [realHeight, setRealHeight] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  const popoverRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string>('/mobile/home')
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    console.log("当前 URL:", router);
    console.log("当前 URL Name:", pathName);
  }, [router]);

  // ✅ 获取真实可用高度
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const updateHeight = () => {
        setRealHeight(getRealViewportHeight()); // ✅ 获取真实可用高度
      };

      updateHeight(); // ✅ 页面加载时立即计算真实高度
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }
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
    <div className={styles.mobile}>
      <div className={styles.header} style={{ position: "sticky", top: 0, zIndex: 1000, backgroundColor: "pink", width: "100%" }} onClick={handleBack}>
        header
      </div>

      {/* ✅ 仅在浏览器环境渲染 `content`，避免 SSR 错误 */}
      <div className={pathName !== "/mobile/message" ? styles.contentOne: styles.contentTown} >
        {/*         
        <div>
          <p>{realHeight}</p>
          <Button color="primary" style={{ width: pxToRem(200), height: pxToRem(50), fontSize: pxToRem(16) }}>Button</Button>


          <BasicPopover content="Hello, this is a custom popover!" placement="bottom">
            <Button color="primary">点我</Button>
          </BasicPopover>

        </div>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-</p>
        <p>content-我到底了</p> */}
        {children}
      </div>
   
      {pathName !== "/mobile/message" ? (
        <div className={styles.footer} style={{ position: "sticky", bottom: 0, zIndex: 1000, backgroundColor: "pink", width: "100%" }}>
          <div>
            <ul className="flex flex-row justify-between pl-5 pr-5">
              {tabs.map((item) => {
                return (
                  <li 
                    onClick={() => handleAction(item)} 
                    key={item.key} 
                    style={{
                      color: item.key === pathName ? "red" : "green"
                    }}
                  >
                    {/* <Link href={`${item.key}`}  style={{
                      color: item.key === pathName ? "red" : "green"
                    }}>{item.label}</Link> */}
                    {item.label}
                    </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : (
        <div style={{ position: "sticky", bottom: 0, zIndex: 1000, backgroundColor: "pink", width: "100%", fontSize: 16 }}>
            我是其它位置
        </div>
      )}    
      
    </div>
  );
}
