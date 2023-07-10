import { useEffect, useRef } from 'react';

// 当颜色主题改变或延迟时间改变的时候，重新setInterval
export function useInterval(callback, delay, reset) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      // tick实际上就是delay回调函数
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, reset]);
}
