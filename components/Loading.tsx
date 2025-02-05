import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Portal } from '@gorhom/portal';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import {

    View,
    Image,
    Animated
} from 'react-native';
const animalImage = require("@/assets/animal.png")

export default function Loading({ navigation, children }: any) {

    const [rotation, setRotation] = useState(new Animated.Value(0));

    const rotate = () => {
        console.log("clickadd");
        // 创建一个平移 + 透明度的动画
        Animated.timing(rotation, {
            toValue: 1,
            duration: 10000,
            useNativeDriver: true,
        }).start(() => {
            // rotation.setValue(0); // 重置旋转
        });
    }


    const rotateInterpolate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg',360*100+ 'deg'], // 从0度旋转到360度
    });


    useEffect(()=>{
        rotate();
    },[])
    return (
        <Animated.View style={{ transform: [{ "rotate": rotateInterpolate }],marginHorizontal:10}}>
            <Image style={{
                width: 30, height: 30,
               
            }} source={require("@/assets/loading.png")}></Image>
        </Animated.View>
    );
}
