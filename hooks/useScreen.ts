import { useWindowDimensions } from "react-native";

export function useScaleSize() {
    const { width, height } = useWindowDimensions();
    return (size: number) => {
        const arr = [height, width];
        const w = Math.min(...arr);
        const h = Math.max(...arr);

        let w2 = 402 / 1;
        let h2 = 874 / 1;

        let scale_portrait = w / w2;
        // if (!isHdMode()) {
        let scale_portrait_real = Math.min(h / h2, w / w2);
        // } else {
        //     const realH = w;
        //     const realW = (realH / 4) * 3;
        //     scale_portrait_real = Math.min(realH / h2, realW / w2);
        // }



        let finalSize = 0;
        if (size !== 0) {
            finalSize = size * scale_portrait;
        }
        return finalSize;
    }
}

