import { forwardRef } from 'react';
import { classes } from 'utils/style';
import styles from './Section.module.css';

// forwardRef 可以得到子组件中的组件，React 使用 forwardRef 完成 ref 的转发。
// 直接使用ref是得到整个子组件
export const Section = forwardRef(
  ({ as: Component = 'div', children, className, ...rest }, ref) => (
    <Component className={classes(styles.section, className)} ref={ref} {...rest}>
      {children}
    </Component>
  )
);
