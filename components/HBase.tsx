import React, { ReactChild, ReactText } from 'react';
import { StyleProp, StyleSheet, Text, TextProps, TextStyle, Platform } from 'react-native';

interface H8TextProps extends TextProps {
    children?: ReactChild | ReactChild[];
    style?: TextStyle;
}
export const HBase = React.memo(
    React.forwardRef(({ children, style = {}, ...other }: H8TextProps, ref) => {
        // 让默认的行高等于字体大小
        // style.lineHeight = style?.fontSize;
        // styles.default.lineHeight = style?.fontSize;
        if (!style.lineHeight) {
            style.lineHeight = style.fontSize;
        }
        return (
            <Text {...other} ref={ref} style={[{ color: '#3c3c43' }, style, {}]}>
                {children}
            </Text>
        );
    })
);