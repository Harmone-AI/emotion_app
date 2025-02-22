import React, { ForwardedRef, RefObject } from "react";
import {
  ScrollView,
  ScrollViewProps,
  TouchableOpacityProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default React.memo(
  React.forwardRef(
    (
      props: ScrollViewProps & { children?: React.ReactNode },
      ref: ForwardedRef<ScrollView>
    ) => {
      const { style, children, ...rest } = props;
      return (
        <ScrollView
          ref={ref}
          style={[{ backgroundColor: "#fff" }, style]}
          {...rest}
        >
          {children}
        </ScrollView>
      );
    }
  )
);
