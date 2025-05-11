/* global self clients caches Notification fetch event request response */
let unreadCount = 0; // 未读消息数量

self.addEventListener("push", (event) => {
  try {
    const data = event.data ? event.data.json() : {};
    const title = data.title || "通知";
    const options = {
      body: data.body || "您有新消息！",
      icon: "/icon.png",
      data: { url: data.url || "/" }, // ✅ 确保 `data.url` 可用
    };

    unreadCount += data.count || 1;

    event.waitUntil(
      self.registration.showNotification(title, options).then(() => {
        return self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: "UPDATE_BADGE", unreadCount });
          });
        });
      })
    );
  } catch (error) {
    console.error("❌ Push 事件处理失败:", error);
  }
});

// ✅ 监听通知点击事件
self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // 关闭通知
  const url = event.notification.data?.url || "/";

  unreadCount = Math.max(0, unreadCount - 1); // ✅ 防止未读消息小于 0

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus(); // ✅ 如果 PWA 已打开，则聚焦
        }
      }
      return self.clients.openWindow(url); // ✅ 否则新开 PWA 内部窗口
    })
  );
});

// ✅ 监听安装事件
self.addEventListener("install", (event) => {
  console.log("✅ Service Worker 正在安装...", event);
//   event.waitUntil(
//     caches.open("my-cache").then((cache) => {
//       return cache.addAll([
//         "/",
//         "/manifest.json",
//         "/logo192.png",
//         "/logo512.png",
//       ]);
//     })
//   );
});

// ✅ 监听 `activate` 事件，确保更新生效
self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker 激活成功");
  event.waitUntil(self.clients.claim()); // ✅ 确保新 Service Worker 立即控制页面
});
