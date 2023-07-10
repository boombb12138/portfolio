import { forwardRef, useId } from 'react';
import { classes } from 'utils/style';
import styles from './Monogram.module.css';

export const Monogram = forwardRef(({ highlight, className, ...props }, ref) => {
  const id = useId();
  const clipId = `${id}monogram-clip`;

  return (
    // <svg
    //   aria-hidden
    //   className={classes(styles.monogram, className)}
    //   width="46"
    //   height="29"
    //   viewBox="0 0 46 29"
    //   ref={ref}
    //   {...props}
    // >
    //   <defs>
    //     <clipPath id={clipId}>
    //       <path d="M16.525 28.462l7.18-18.35.003-.001 9.72 18.442a.838.838 0 001.524-.093l3.39-8.824a.846.846 0 00-.04-.686L30.307 3.605A6.698 6.698 0 0024.367 0h-4.6a.84.84 0 00-.74 1.23l3.63 6.887-3.655 9.15-7.12-13.662A6.698 6.698 0 005.942 0h-4.6a.842.842 0 00-.748 1.23L15 28.554a.839.839 0 001.524-.092zM42.392 8.806a.835.835 0 00.387-.446v.001l2.67-7.23a.838.838 0 00-.785-1.129h-6.578a.837.837 0 00-.736 1.238l3.907 7.226c.22.41.729.56 1.135.34z" />
    //     </clipPath>
    //   </defs>
    //   <rect clipPath={`url(#${clipId})`} width="100%" height="100%" />
    //   {highlight && (
    //     <g clipPath={`url(#${clipId})`}>
    //       <rect className={styles.highlight} width="100%" height="100%" />
    //     </g>
    //   )}
    // </svg>

    <svg
      aria-hidden
      className={classes(styles.monogram, className)}
      width="46"
      height="29"
      viewBox="0 0 58 57"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M57 1V56H42.1689L12.2511 16.241V44.7349L1 29.494V1H12.2511L45.7489 44.7349V1H57Z"
        fill="#070707"
      />
      <path d="M12.2511 56H1V41.753L12.2511 56Z" fill="#070707" />
      <path
        d="M57 1V56H42.1689L12.2511 16.241V44.7349L1 29.494V1H12.2511L45.7489 44.7349V1H57Z"
        stroke="black"
      />
      <path d="M12.2511 56H1V41.753L12.2511 56Z" stroke="black" />
    </svg>
  );
});
