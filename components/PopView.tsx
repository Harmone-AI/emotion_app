import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Portal } from '@gorhom/portal';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useRef, useState } from 'react';
import {

    View,
    Image,
    Animated
} from 'react-native';
const animalImage = require("@/assets/animal.png")

export default function PopView({ navigation, children }: any) {

    const [rotation, setRotation] = useState(new Animated.Value(0));

    const clickAdd = () => {
        console.log("clickadd");
        // 创建一个平移 + 透明度的动画
        Animated.timing(rotation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            // rotation.setValue(0); // 重置旋转
        });
    }

    const clickInput = () => {

    }


    return (
        <View style={{ position: "absolute" ,left:0,top:0,width:"100%",height:"100%"}}>
            {children}
        </View>
    );
}
