import { useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useCallback, useRef } from 'react';

export function useScrollToHash() {
  const scrollTimeout = useRef();
  // push 函数用于在 Next.js 应用程序中进行页面导航，push('/about') 将导航到 /about 页面。
  const { asPath, push } = useRouter();
  const reduceMotion = useReducedMotion(); //返回布尔值 检查用户系统是否减少动画效果 true为减少 false为正常使用动画效果

  const scrollToHash = useCallback(
    (hash, onDone) => {
      const id = hash.split('#')[1];
      const targetElement = document.getElementById(id);

      const route = asPath.split('#')[0];

      const newPath = `${route}#${id}`;

      targetElement.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });

      // 滚动发生时会清除定时器
      // 用户停止滚动一定时间后才触发最终的事件
      const handleScroll = () => {
        clearTimeout(scrollTimeout.current);

        scrollTimeout.current = setTimeout(() => {
          window.removeEventListener('scroll', handleScroll);

          if (window.location.pathname === route) {
            onDone?.();
            push(newPath, null, { scroll: false });
          }
        }, 50);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout.current);
      };
    },
    [push, reduceMotion, asPath]
  );

  return scrollToHash;
}
