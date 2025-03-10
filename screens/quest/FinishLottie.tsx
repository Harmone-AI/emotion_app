import LottieView from "lottie-react-native";
import React, { useRef } from "react";

export default function FinishLottie() {
  const ref = useRef<LottieView>(null);
  React.useEffect(() => {
    ref.current?.play();
    return () => {
      ref.current?.pause();
      ref.current?.reset();
    };
  }, []);
  return (
    <LottieView
      ref={ref}
      source={require("./fireworks.json")}
      autoPlay={true}
      loop={false}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}
