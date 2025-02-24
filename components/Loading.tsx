import * as React from "react";
import Svg, { SvgProps, RadialGradient, Stop, Circle } from "react-native-svg";

import { Animated, useAnimatedValue } from "react-native";

interface AnimationNode {
  animation: Animated.CompositeAnimation;
  values: Animated.AnimatedInterpolation[];
}

export interface Props<T extends string> {
  initAnimation: () => Record<T, (value: Animated.Value) => AnimationNode>;
  children: (
    interpolationsByKey: Record<T, Animated.AnimatedInterpolation[]>
  ) => React.ReactNode;
  animating: boolean;
}

class AnimationContainer<T extends string> extends React.Component<Props<T>> {
  animation: Animated.CompositeAnimation;
  animatedValuesByKey: Record<T, Animated.Value> = {} as Record<
    T,
    Animated.Value
  >;
  interpolationsByKey: Record<T, Animated.AnimatedInterpolation[]> =
    {} as Record<T, Animated.AnimatedInterpolation[]>;

  static defaultProps = {
    animating: true,
  };

  constructor(props: Props<T>) {
    super(props);
    const { initAnimation } = props;

    const animationInitializersByKey = initAnimation();
    const animations: Animated.CompositeAnimation[] = [];

    for (const key in animationInitializersByKey) {
      const animationInitializer = animationInitializersByKey[key];
      const animationValue = new Animated.Value(0);
      this.animatedValuesByKey[key] = animationValue;
      const { animation, values } = animationInitializer(animationValue);
      animations.push(animation);
      this.interpolationsByKey[key] = values;
    }

    if (animations.length === 1) {
      this.animation = animations[0];
    } else {
      this.animation = Animated.parallel(animations);
    }
  }

  componentDidMount() {
    if (this.props.animating) {
      this.startAnimation();
    }
  }

  componentDidUpdate(prevProps: Props<T>) {
    const { animating } = this.props;

    if (animating !== prevProps.animating) {
      if (animating) {
        this.startAnimation();
      } else {
        this.stopAnimation();
      }
    }
  }

  startAnimation = () => {
    this.animation.start();
  };

  stopAnimation = () => {
    this.animation.reset();

    for (const key in this.animatedValuesByKey) {
      this.animatedValuesByKey[key].setValue(0);
    }
  };

  componentWillUnmount() {
    this.animation.stop();
  }

  render() {
    const { children } = this.props;
    return children ? children(this.interpolationsByKey) : null;
  }
}

/* SVGR has dropped some elements not supported by react-native-svg: div */
const AppLoading = React.memo(
  (props: SvgProps & { borderSize?: number; color?: string }) => {
    const {
      borderSize = 35,
      width = 30,
      height = 30,
      color = "rgba(255, 124, 20, 1)",
      ...rest
    } = props;
    const rotate = useAnimatedValue(0);
    React.useEffect(() => {
      const animation = Animated.loop(
        Animated.timing(rotate, {
          toValue: 360,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      animation.start();
      return () => {
        animation.stop();
        animation.reset();
      };
    }, []);
    return (
      <Animated.View
        style={{
          width,
          height,
          transform: [
            {
              rotate: rotate.interpolate({
                inputRange: [0, 360],
                outputRange: ["0deg", "360deg"],
              }),
            },
          ],
        }}
      >
        <Svg viewBox="0 0 200 200" width={width} height={height} {...props}>
          <RadialGradient
            id="a"
            cx={0.66}
            cy={0.313}
            fx={0.66}
            fy={0.313}
            gradientTransform="scale(1.5)"
          >
            <Stop offset={0} stopColor={color} stopOpacity={0} />
            {/* <Stop offset={0.3} stopColor="#FF156D" stopOpacity={0.9} />
        <Stop offset={0.6} stopColor="#FF156D" stopOpacity={0.6} />
        <Stop offset={0.8} stopColor="#FF156D" stopOpacity={0.3} /> */}
            <Stop offset={1} stopColor={color} stopOpacity={0.9} />
          </RadialGradient>
          <Circle
            cx={100}
            cy={100}
            r={70}
            fill="none"
            stroke="url(#a)"
            strokeDasharray="200 1000"
            strokeLinecap="round"
            strokeWidth={borderSize}
            transform-origin="center"
          ></Circle>
          <Circle
            cx={100}
            cy={100}
            r={70}
            fill="none"
            stroke="rgba(255, 124, 20, 1)"
            strokeLinecap="round"
            strokeWidth={borderSize}
            opacity={0.1}
            transform-origin="center"
          />
        </Svg>
      </Animated.View>
    );
  }
);
export default AppLoading;

// import * as React from "react"
// import Svg, { SvgProps, RadialGradient, Stop, Circle } from "react-native-svg"
// /* SVGR has dropped some elements not supported by react-native-svg: animateTransform */
// const SvgComponent = (props: SvgProps) => (
//   <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" {...props}>
//     <RadialGradient
//       id="a"
//       cx={0.66}
//       cy={0.313}
//       fx={0.66}
//       fy={0.313}
//       gradientTransform="scale(1.5)"
//     >
//       <Stop offset={0} stopColor="#FF156D" />
//       <Stop offset={0.3} stopColor="#FF156D" stopOpacity={0.9} />
//       <Stop offset={0.6} stopColor="#FF156D" stopOpacity={0.6} />
//       <Stop offset={0.8} stopColor="#FF156D" stopOpacity={0.3} />
//       <Stop offset={1} stopColor="#FF156D" stopOpacity={0} />
//     </RadialGradient>
//     <Circle
//       cx={100}
//       cy={100}
//       r={70}
//       fill="none"
//       stroke="url(#a)"
//       strokeDasharray="200 1000"
//       strokeLinecap="round"
//       strokeWidth={15}
//       transform-origin="center"
//     ></Circle>
//     <Circle
//       cx={100}
//       cy={100}
//       r={70}
//       fill="none"
//       stroke="#FF156D"
//       strokeLinecap="round"
//       strokeWidth={15}
//       opacity={0.2}
//       transform-origin="center"
//     />
//   </Svg>
// )
// export default SvgComponent
