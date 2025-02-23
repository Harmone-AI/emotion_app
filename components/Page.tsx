import React, { ForwardedRef, RefObject } from "react";
import {
  ScrollView,
  ScrollViewProps,
  TouchableOpacityProps,
  View,
} from "react-native";
import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";

export default React.memo(
  React.forwardRef(
    (
      props: ScrollViewProps & { children?: React.ReactNode } & {
        safeAreaProps: SafeAreaViewProps;
      },
      ref: ForwardedRef<ScrollView>
    ) => {
      const { style, children, safeAreaProps, ...rest } = props;
      const PageContainer = rest.scrollEnabled === false ? View : ScrollView;
      return (
        <PageContainer
          ref={ref}
          style={[{ backgroundColor: "#fff", flex: 1 }, style]}
          {...rest}
        >
          <SafeAreaView style={{ flex: 1 }} {...safeAreaProps}>
            {children}
          </SafeAreaView>
        </PageContainer>
      );
    }
  )
);
