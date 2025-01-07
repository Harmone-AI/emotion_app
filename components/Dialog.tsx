import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { withGestureHandlerRoot } from '../libs/withGestureHandlerRoot';

export interface DialogRef {
  present: () => void;
  dismiss: () => void;
}

interface DialogProps {
  children: React.ReactNode;
}

const DialogComponent = React.forwardRef<DialogRef, DialogProps>(({ children }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    present: () => {
      console.log('presenting...');
      setIsOpen(true);
      bottomSheetRef.current?.expand();
    },
    dismiss: () => {
      setIsOpen(false);
      bottomSheetRef.current?.close();
    },
  }));

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <BottomSheet 
      ref={bottomSheetRef}
      snapPoints={['50%']}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      index={isOpen ? 0 : -1}
      onChange={(index) => {
        if (index === -1) {
          setIsOpen(false);
        }
      }}
    >
      <View style={{ flex: 1, padding: 24 }}>{children}</View>
    </BottomSheet>
  );
});

DialogComponent.displayName = 'Dialog';

export const Dialog = withGestureHandlerRoot(DialogComponent);
