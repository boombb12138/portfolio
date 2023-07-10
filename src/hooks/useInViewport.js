import { useEffect, useState } from 'react';

// 检测元素是否在视口中可见
export function useInViewport(
  elementRef,
  unobserveOnIntersect,
  options = {},
  shouldObserve = true
) {
  const [intersect, setIntersect] = useState(false);
  const [isUnobserved, setIsUnobserved] = useState(false);

  useEffect(() => {
    if (!elementRef?.current) return;

    // IntersectionObserver 的主要作用是提供一种有效的方式来检测元素是否进入视口或离开视口，
    // 并在相应的交叉状态发生变化时触发回调函数
    // 它在实现可见性检测、懒加载、无限滚动等场景中非常有用。
    const observer = new IntersectionObserver(([entry]) => {
      //  isIntersecting表示元素是否进入视口
      //  target表示被观察的目标元素
      const { isIntersecting, target } = entry;

      setIntersect(isIntersecting);

      if (isIntersecting && unobserveOnIntersect) {
        observer.unobserve(target); //将指定的目标元素从观察列表中移除
        setIsUnobserved(true);
      }
    }, options);

    if (!isUnobserved && shouldObserve) {
      observer.observe(elementRef.current); ////将指定的目标元素添加到观察列表
    }

    return () => observer.disconnect(); //停止观察所有目标元素的交叉状态，并释放资源
  }, [elementRef, unobserveOnIntersect, options, isUnobserved, shouldObserve]);

  return intersect;
}
