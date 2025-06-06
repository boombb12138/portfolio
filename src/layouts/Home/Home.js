import puffBackgroundDetail from 'assets/puff-background2.png';
import puffBackground from 'assets/puff-background.png';
import sliceTextureLarge from 'assets/novery-background.png';
import sliceTexturePlaceholder from 'assets/novery-background.png';
import sliceTexture from 'assets/novery-background.png';
import sprTextureLarge from 'assets/floating-diamond.png';
import sprTexturePlaceholder from 'assets/floating-diamond.png';
import sprTexture from 'assets/floating-diamond.png';
import { Footer } from 'components/Footer';
import { Meta } from 'components/Meta';
import { Intro } from 'layouts/Home/Intro';
import { Profile } from 'layouts/Home/Profile';
import { ProjectSummary } from 'layouts/Home/ProjectSummary';
import { useEffect, useRef, useState } from 'react';
import styles from './Home.module.css';

const disciplines = ['Designer', 'Writer', 'Animator'];

export const Home = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef();
  const projectOne = useRef();
  const projectTwo = useRef();
  const projectThree = useRef();
  const details = useRef();

  useEffect(() => {
    const sections = [intro, projectOne, projectTwo, projectThree, details];

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            if (visibleSections.includes(section)) return;
            setVisibleSections(prevSections => [...prevSections, section]);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    // mark IntersectionObserver  滚轮滑动一定的距离鼠标就不见
    // IntersectionObserver用于检测intro与整个html的交叉状态
    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        // entry.isIntersecting表示intro是否在视口内
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      // -100%表示目标元素在进入视口之前需要有100%的偏移量 换句话说
      //intro的顶部边界需要超过视口顶部边界的100%的高度 才被视为进入视口
      // 才会触发回调
      { rootMargin: '-100% 0px 0px 0px' }
    );

    sections.forEach(section => {
      sectionObserver.observe(section.current);
    });

    // intro就是要观察的元素
    indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections]);

  return (
    <div className={styles.home}>
      {/* //mark Home main content */}
      <Meta
        title="Designer + Developer"
        ogImage="../../public/favicon.png"
        description="Design portfolio of Naomi — a programmer working on web & mobile
          apps with a focus on motion, experience design, and accessibility."
      />
      <Intro
        id="intro"
        sectionRef={intro}
        disciplines={disciplines}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />
      {/* //mark modify projects in here */}
      <ProjectSummary
        id="project-1"
        sectionRef={projectOne}
        visible={visibleSections.includes(projectOne.current)}
        index={1}
        title="Novery"
        description="Transform your notes into lasting memories"
        buttonText="View website"
        buttonLink="https://www.novery.ai/"
        model={{
          type: 'laptop',
          alt: '',
          textures: [
            {
              srcSet: [sliceTexture, sliceTextureLarge],
              placeholder: sliceTexturePlaceholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-2"
        alternate
        sectionRef={projectTwo}
        visible={visibleSections.includes(projectTwo.current)}
        index={2}
        title="Prediction Market"
        description="Predict, Participate, Profit! A blockchain-based prediction market."
        buttonText="View project"
        buttonLink="https://puffbet.io/"
        model={{
          type: 'phone',
          alt: 'A blockchain-based prediction market',
          textures: [
            {
              srcSet: [puffBackground],
              placeholder: puffBackground,
            },
            {
              srcSet: [puffBackgroundDetail],
              placeholder: puffBackgroundDetail,
            },
          ],
        }}
      />
      {/* //mark project config here */}
      <ProjectSummary
        id="project-3"
        sectionRef={projectThree}
        visible={visibleSections.includes(projectThree.current)}
        index={3}
        title="Three.js Showreel"
        description="Projects made with three.js, r3f, drei and gsap"
        buttonText="View project"
        buttonLink="https://www.capcut.cn/share/7225616662869939489?t=1&id=7225628904520733985"
        model={{
          type: 'laptop',
          alt: 'Three.js Showreel',
          textures: [
            {
              // srcSet是屏幕显示的内容
              srcSet: [sprTexture, sprTextureLarge],
              placeholder: sprTexturePlaceholder,
            },
          ],
        }}
      />
      <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current)}
        id="details"
      />
      <Footer />
    </div>
  );
};
