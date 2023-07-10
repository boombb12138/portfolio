import { useTheme } from 'components/ThemeProvider';
import { Transition } from 'components/Transition';
import { useReducedMotion, useSpring } from 'framer-motion';
import { useInViewport, useWindowSize } from 'hooks';
import { startTransition, useEffect, useRef } from 'react';
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  SphereBufferGeometry,
  UniformsUtils,
  Vector2,
  WebGLRenderer,
  sRGBEncoding,
} from 'three';
import { media, rgbToThreeColor } from 'utils/style';
import { cleanRenderer, cleanScene, removeLights } from 'utils/three';
import styles from './DisplacementSphere.module.css';
import fragShader from './displacementSphereFragment.glsl';
import vertShader from './displacementSphereVertex.glsl';

const springConfig = {
  stiffness: 30, //动画的回弹速度 值越大，回弹越快
  damping: 20, //阻尼 值越小 阻碍越小 动画更快
  mass: 2, //惯性 受到外力作用时的响应速度，值越小，响应速度越快
};

export const DisplacementSphere = props => {
  const theme = useTheme();
  const { rgbBackground, themeId, colorWhite } = theme; //todo colorWhite是什么
  console.log(colorWhite, 'colorWhite');
  const start = useRef(Date.now());
  const canvasRef = useRef();
  const mouse = useRef();
  const renderer = useRef();
  const camera = useRef();
  const scene = useRef();
  const lights = useRef();
  const uniforms = useRef();
  const material = useRef();
  const geometry = useRef();
  const sphere = useRef();
  const reduceMotion = useReducedMotion();
  const isInViewport = useInViewport(canvasRef);
  const windowSize = useWindowSize();
  // useSpring 用于创建和控制弹簧动画，允许定义动画的初始状态，目标状态和过渡配置
  // 返回一个包含动画值和控制函数的对象
  const rotationX = useSpring(0, springConfig);
  const rotationY = useSpring(0, springConfig);

  // 处理基础的渲染器 相机 场景 着色器 材质 几何体
  useEffect(() => {
    const { innerWidth, innerHeight } = window;
    mouse.current = new Vector2(0.8, 0.5);
    renderer.current = new WebGLRenderer({
      canvas: canvasRef.current,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: true,
    });
    renderer.current.setSize(innerWidth, innerHeight);
    renderer.current.setPixelRatio(1);
    renderer.current.outputEncoding = sRGBEncoding;

    camera.current = new PerspectiveCamera(54, innerWidth / innerHeight, 0.1, 100);
    camera.current.position.z = 52;

    scene.current = new Scene();

    material.current = new MeshPhongMaterial();

    //onBeforeCompile作用： 在编译着色器之前，允许开发者对着色器进行自定义修改，以满足特定的渲染需求
    material.current.onBeforeCompile = shader => {
      // 合并原始着色器的uniforms和自定义的uniforms，并赋值给uniforms
      uniforms.current = UniformsUtils.merge([
        shader.uniforms,
        { time: { type: 'f', value: 0 } },
      ]);
      shader.uniforms = uniforms.current;

      // 将自定义的顶点着色器和片段着色器分别赋值给shader的vertexShader和fragmentShader
      shader.vertexShader = vertShader;
      shader.fragmentShader = fragShader;
    };

    //mark startTransition可以延迟更新，做渐进式渲染，确保浏览器可以更快响应用户交互
    startTransition(() => {
      geometry.current = new SphereBufferGeometry(32, 128, 128);
      sphere.current = new Mesh(geometry.current, material.current);
      sphere.current.position.z = 0;
      sphere.current.modifier = Math.random();
      scene.current.add(sphere.current);
    });

    return () => {
      // 卸载时清除场景中的几何体，材质和渲染器
      cleanScene(scene.current);
      cleanRenderer(renderer.current);
    };
  }, []);

  // 处理光
  useEffect(() => {
    // #EF4490
    const dirLight = new DirectionalLight(colorWhite, 0.6);

    // former color: colorWhite
    const ambientLight = new AmbientLight(colorWhite, themeId === 'light' ? 0.8 : 0.2);

    dirLight.position.z = 200;
    dirLight.position.x = 100;
    dirLight.position.y = 100;

    lights.current = [dirLight, ambientLight];
    // 当使用 RGB 值或字符串值来创建 Color 对象时，颜色通道的值范围应该是 0 到 1，而不是常见的 0 到 255 范围
    // 所以调用rgbToThreeColor函数来转换
    scene.current.background = new Color(...rgbToThreeColor(rgbBackground)); //rgbBackground
    lights.current.forEach(light => scene.current.add(light));

    return () => {
      removeLights(lights.current);
    };
  }, [rgbBackground, colorWhite, themeId]);

  // 设备适配 动画启用与否
  useEffect(() => {
    const { width, height } = windowSize;

    const adjustedHeight = height + height * 0.3;
    renderer.current.setSize(width, adjustedHeight);
    camera.current.aspect = width / adjustedHeight;
    // 当相机的视角，宽高比，远近面变化时，相机的投影矩阵也要变化
    camera.current.updateProjectionMatrix();

    // Render a single frame on resize when not animating
    // 有些系统用户禁用了动画，reduceMotion为true说明禁用动画，就只渲染一个帧
    if (reduceMotion) {
      renderer.current.render(scene.current, camera.current);
    }

    // 做各种设备的适配 修改几何体的位置
    if (width <= media.mobile) {
      sphere.current.position.x = 14;
      sphere.current.position.y = 10;
    } else if (width <= media.tablet) {
      sphere.current.position.x = 18;
      sphere.current.position.y = 14;
    } else {
      sphere.current.position.x = 22;
      sphere.current.position.y = 16;
    }
  }, [reduceMotion, windowSize]);

  // 控制花随着鼠标的移动而做旋转
  // a.设置rotationX
  useEffect(() => {
    const onMouseMove = event => {
      const position = {
        // 鼠标的坐标相对于创建窗口的位置
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      };

      // rotationX表示元素绕x轴旋转角度，通过调用set方法可以更新rotationX的值，从而实现元素在x轴上的旋转
      rotationX.set(position.y / 2);
      rotationY.set(position.x / 2);
    };

    // reduceMotion == false表示未开启禁用动画
    if (!reduceMotion && isInViewport) {
      window.addEventListener('mousemove', onMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [isInViewport, reduceMotion, rotationX, rotationY]);

  useEffect(() => {
    let animation;

    const animate = () => {
      animation = requestAnimationFrame(animate);

      if (uniforms.current !== undefined) {
        uniforms.current.time.value = 0.00005 * (Date.now() - start.current);
      }

      // b.将rotationX实际赋给几何体
      sphere.current.rotation.z += 0.001;
      sphere.current.rotation.x = rotationX.get();
      sphere.current.rotation.y = rotationY.get();

      renderer.current.render(scene.current, camera.current);
    };

    if (!reduceMotion && isInViewport) {
      animate();
    } else {
      renderer.current.render(scene.current, camera.current);
    }

    return () => {
      cancelAnimationFrame(animation);
    };
  }, [isInViewport, reduceMotion, rotationX, rotationY]);

  return (
    <Transition in timeout={3000}>
      {visible => (
        <canvas
          aria-hidden
          className={styles.canvas}
          data-visible={visible}
          ref={canvasRef}
          {...props}
        />
      )}
    </Transition>
  );
};
