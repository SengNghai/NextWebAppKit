'use client';

import { useEffect, useRef, useState } from 'react';

export default function Page() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const headRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLInputElement>(null);
  const [mainHeight, setMainHeight] = useState<number>(0);
  const [originalMainHeight, setOriginalMainHeight] = useState<number>(0);

  useEffect(() => {
    const updateLayout = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      setKeyboardHeight(window.innerHeight - viewportHeight);

      // 移除 Safari 自动滚动，确保输入框可见
      window.scrollTo(0, 0);

      // 限制 `body` 高度，防止页面整体滚动
      document.body.style.height = `${viewportHeight}px`;
      document.body.style.overflow = 'hidden';

      // 调整输入框位置，使其始终在键盘上方
      if (footRef.current) {
        footRef.current.style.bottom = `${keyboardHeight}px`;
      }
    };

    window.visualViewport?.addEventListener('resize', updateLayout);
    window.addEventListener('resize', updateLayout);
    updateLayout();

    return () => {
      window.visualViewport?.removeEventListener('resize', updateLayout);
      window.removeEventListener('resize', updateLayout);
      document.body.style.height = '';
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const disableBodyScroll = (event: TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target || !target.closest('main')) {
        event.preventDefault(); // 禁止 `body` 滚动，仅允许 `main` 滚动
      }
    };

    document.addEventListener('touchmove', disableBodyScroll, { passive: false });

    return () => {
      document.removeEventListener('touchmove', disableBodyScroll);
    };
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      if (footRef.current) {
        const inputHeight = footRef.current.getBoundingClientRect().height;
        setMainHeight(originalMainHeight - keyboardHeight - inputHeight);
      }
    };

    const handleBlur = () => {
      setMainHeight(originalMainHeight); // 恢复原始高度
    };

    footRef.current?.addEventListener('focus', handleFocus);
    footRef.current?.addEventListener('blur', handleBlur);

    return () => {
      footRef.current?.removeEventListener('focus', handleFocus);
      footRef.current?.removeEventListener('blur', handleBlur);
    };
  }, [keyboardHeight, originalMainHeight]);

  useEffect(() => {
    const updateMainHeight = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      if (headRef.current && footRef.current) {
        const headerHeight = headRef.current.getBoundingClientRect().height;
        const footerHeight = footRef.current.getBoundingClientRect().height;
        const calculatedHeight = viewportHeight - headerHeight - footerHeight;

        setMainHeight(calculatedHeight);
        setOriginalMainHeight(calculatedHeight); // 记录原始高度
      }
    };

    window.addEventListener('resize', updateMainHeight);
    updateMainHeight();
    return () => window.removeEventListener('resize', updateMainHeight);
  }, []);

  return (
    <>
      {/* 固定头部 */}
      <header ref={headRef} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '1rem',
        background: '#333',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '.24rem',
        zIndex: 10000
      }}>
        固定头部
      </header>

      {/* 仅让内容区域滚动 */}
      <main style={{
        flexGrow: 1,
        overflowY: 'auto',
        marginTop: `${headRef?.current?.getBoundingClientRect().height}px`,
        height: mainHeight,
        background: 'red',
        WebkitOverflowScrolling: 'touch',
      }}>
        <p>这里是页面内容...</p>
        {[...Array(20)].map((_, i) => <p key={i}>滚动测试 {i + 1}</p>)}
      </main>

      {/* 固定底部输入框 */}
      <input
        ref={footRef}
        type="text"
        placeholder="在这里输入..."
        style={{
          position: 'fixed', // 兼容 WebView
          bottom: keyboardHeight > 0 ? `${keyboardHeight}px` : '0px',
          left: 0,
          width: '100%',
          padding: '0.1rem',
          boxSizing: 'border-box',
          background: '#fff',
          borderTop: '0.1rem solid #ccc',
          transition: 'bottom 0.3s ease', // 平滑过渡
          zIndex: 9999,
          fontSize: '0.48rem',
          color: 'red'
        }}
      />
    </>
  );
}
