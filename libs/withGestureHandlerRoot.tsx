import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export function withGestureHandlerRoot<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function WithGestureHandlerRoot(props: P) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Component {...props} />
      </GestureHandlerRootView>
    );
  };
}
