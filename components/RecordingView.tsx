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

export default function RecordingView({ navigation, children }: any) {

    const lines = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    const [blackStart, setBlackStart] = useState(0);
    const blackNum = 5;
    const [flag, setFlag] = useState(0);


    useEffect(() => {
        const timer = setTimeout(() => {
            setBlackStart((blackStart + 1) % lines.length);
        }, 300);

        return () => clearTimeout(timer);
    }, [blackStart]); // 每次 `count` 改变时都会重启定时器



    return (
        <View style={{ alignItems: "center", marginTop: 50, flexDirection: "row" }}>
            {lines.map((item, index) => {
                return <View key={index} style={{ backgroundColor: index > (blackStart) && index < (blackStart + blackNum) ? "#000" : "#fff", marginRight: 8, width: 4, height: 20 }}></View>;
            })}
        </View>
    );
}
