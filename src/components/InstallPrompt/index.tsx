"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // ✅ 判断是否是 iOS 设备
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream: boolean }).MSStream
    );

    // ✅ 检查是否已安装 PWA
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone) {
    return null; // ✅ 如果已安装，则不显示安装提示
  }

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2 style={{ color: "red" }}>Install App</h2>
      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add to Home Screen
      </button>

      {isIOS && (
        <div style={{ marginTop: 10 }}>
          <p>
            To install this app on your iOS device, tap the share button{" "}
            <span role="img" aria-label="share icon">⎋</span> and then Add to Home Screen{" "}
            <span role="img" aria-label="plus icon">➕</span>.
          </p>
        </div>
      )}
    </div>
  );
}
