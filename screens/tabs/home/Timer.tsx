import { View } from "react-native";
import React from "react";
import { HBase } from "@/components/HBase";
import { useScaleSize } from "@/hooks/useScreen";

function millisecondToTime(duration: number) {
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  const hours = Math.floor(minutes / 60);
  const hoursTen = Math.floor(hours / 10);
  const hoursOne = hours % 10;
  const minutesTen = Math.floor(minutes / 10);
  const minutesOne = minutes % 10;
  const secondsTen = Math.floor(seconds / 10);
  const secondsOne = seconds % 10;
  return [
    hoursTen,
    hoursOne,
    ":",
    minutesTen,
    minutesOne,
    ":",
    secondsTen,
    secondsOne,
  ];
}

export default React.memo(
  ({ returnHomeDuration }: { returnHomeDuration: number }) => {
    const scaleSize = useScaleSize();
    const [timer, setTimer] = React.useState<(string | number)[]>([]);
    React.useEffect(() => {
      const interval = setInterval(() => {
        setTimer(millisecondToTime(returnHomeDuration - Date.now()));
      }, 1000);
      return () => clearInterval(interval);
    }, []);
    return (
      <View style={{ flexDirection: "row" }}>
        {timer.map((item, index) => (
          <HBase
            key={index}
            style={{
              color: "#FF7C14",
              textAlign: "center",
              fontSize: scaleSize(40),
              fontStyle: "normal",
              fontWeight: 700,
              width: scaleSize(item === ":" ? 16 : 28),
              marginBottom: scaleSize(item === ":" ? 8 : 0),
            }}
          >
            {item}
          </HBase>
        ))}
      </View>
    );
  }
);
