"use client";

import InstallPrompt from "~/components/InstallPrompt";
import { globalSubscribeMethod, globalUnsubscribeMethod, publicSendNotification } from "~/lib/utils/serviceWorkerManager.ts";
import { Button } from "antd-mobile";
import { useEffect, useState } from "react";

export default function NotifyPage() {
  const [visible, setVisible] = useState(false);

  // ✅ 发送通知
  const handleSendNotification = () => {
    publicSendNotification("/api/other/notify");
  };

  // ✅ 订阅
  const handleSubscribe = () => {
    const vapidPublicKey = "BI1DH5Pe73fMpZWhXOohot5UB85QlttiTW5CBgDflA_d3FM7iAX2LdPU7ZtaNMXIKFUuyBHkH2FEkHAuLqE4950";
    globalSubscribeMethod("/api/other/subscribe", vapidPublicKey);
    console.log("✅ 订阅");
    
  };

  // ✅ 取消订阅
  const handleUnsubscribe = () => {
    globalUnsubscribeMethod("/api/other/unsubscribe");
  };

  // ✅ 监听页面焦点变化，类似 `useFocusEffect`
  useEffect(() => {
    setVisible(true);
    return () => setVisible(false);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <div>
        <p>Install Prompt: {JSON.stringify(visible)}</p>
        <InstallPrompt />
      </div>

      <div>
        <p>Subscribe</p>
        <Button color="warning" onClick={handleSubscribe}>
          Subscribe
        </Button>
      </div>

      <div>
        <p>Send Notification</p>
        <Button color="warning" onClick={handleSendNotification}>
          Send Notification
        </Button>
      </div>

      <div>
        <p>Unsubscribe</p>
        <Button color="warning" onClick={handleUnsubscribe}>
          Unsubscribe
        </Button>
      </div>

    </div>
  );
}
