import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ComponentRef,
} from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  REFERENCE_WIDTH,
  REFERENCE_HEIGHT,
  REFERENCE_STATUS_HEIGHT,
} from "./artwork";
export type Slice = { from: number; to: number; grow: number };
export type ReferenceBox = {
  position: "absolute";
  left: number;
  top: number;
  width: number;
  height: number;
};
export type ReferenceLayout = {
  scale: number;
  box: (x: number, y: number, width: number, height: number) => ReferenceBox;
  mapY: (y: number) => number;
};
const LOGIN_SLICES: Slice[] = [
  { from: 80, to: 520, grow: 0 },
  { from: 520, to: 545, grow: 0.5 },
  { from: 545, to: 736, grow: 0 },
  { from: 736, to: 760, grow: 0.5 },
  { from: 760, to: 1672, grow: 0 },
];
export const LOADING_SLICES: Slice[] = [
  { from: 80, to: 460, grow: 0 },
  { from: 460, to: 480, grow: 0 },
  { from: 480, to: 980, grow: 0 },
  { from: 980, to: 1110, grow: 0 },
  { from: 1110, to: 1310, grow: 0 },
  { from: 1310, to: 1672, grow: 1 },
];
// As artes permanecem intactas. Em telas mais altas, só os intervalos decorativos
// recebem espaço extra; logo, letras e controles não são esticados.
export function ReferenceScene({
  source,
  slices = LOGIN_SLICES,
  children,
  onLoad,
  focusY = null,
  scroll = true,
}: {
  source: ImageSourcePropType;
  slices?: Slice[];
  children?: (layout: ReferenceLayout) => ReactNode;
  onLoad?: () => void;
  focusY?: number | null;
  scroll?: boolean;
}) {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const canvasWidth =
    Platform.OS === "web" ? Math.min(viewport.width, 600) : viewport.width;
  const scale = canvasWidth / REFERENCE_WIDTH;
  const base = (REFERENCE_HEIGHT - REFERENCE_STATUS_HEIGHT) * scale;
  const extra = Math.max(0, viewport.height - base);
  const canvasHeight = Math.max(viewport.height, base);
  const mapY = (y: number) => {
    let result = 0;
    for (const part of slices) {
      if (y >= part.to) {
        result += (part.to - part.from) * scale + extra * part.grow;
        continue;
      }
      if (y >= part.from) {
        result +=
          (y - part.from) * scale +
          (extra * part.grow * (y - part.from)) / (part.to - part.from);
      }
      break;
    }
    return result;
  };
  const box = (
    x: number,
    y: number,
    width: number,
    height: number,
  ): ReferenceBox => ({
    position: "absolute",
    left: x * scale,
    top: mapY(y),
    width: width * scale,
    height: height * scale,
  });
  useEffect(() => {
    if (focusY === null) return;
    let result = 0;
    for (const part of slices) {
      if (focusY >= part.to) {
        result += (part.to - part.from) * scale + extra * part.grow;
        continue;
      }
      if (focusY >= part.from)
        result +=
          (focusY - part.from) * scale +
          (extra * part.grow * (focusY - part.from)) / (part.to - part.from);
      break;
    }
    const frame = requestAnimationFrame(() =>
      scrollRef.current?.scrollTo({
        y: Math.max(0, result - viewport.height * 0.4),
        animated: true,
      }),
    );
    return () => cancelAnimationFrame(frame);
  }, [focusY, scale, extra, viewport.height, slices]);
  let top = 0;
  const canvas = (
    <View
      style={{
        width: canvasWidth,
        height: canvasHeight,
        alignSelf: "center",
      }}
    >
      {viewport.width > 0 &&
        slices.map((part, index) => {
          const height = (part.to - part.from) * scale + extra * part.grow;
          const imageScaleY = height / (part.to - part.from);
          const position = top;
          top += height;
          return (
            <View
              key={part.from}
              pointerEvents="none"
              style={{
                position: "absolute",
                top: position,
                left: 0,
                width: canvasWidth,
                height,
                overflow: "hidden",
              }}
            >
              <Image
                source={source}
                accessible={false}
                importantForAccessibility="no"
                resizeMode="stretch"
                onLoad={index === 0 ? onLoad : undefined}
                style={{
                  position: "absolute",
                  width: canvasWidth,
                  height: REFERENCE_HEIGHT * imageScaleY,
                  top: -part.from * imageScaleY,
                  left: 0,
                }}
              />
            </View>
          );
        })}
      {viewport.width > 0 && children?.({ scale, box, mapY })}
    </View>
  );
  return (
    <SafeAreaView
      style={sceneStyles.root}
      edges={["top", "bottom", "left", "right"]}
    >
      <View
        style={{ flex: 1 }}
        onLayout={(event) =>
          setViewport({
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height,
          })
        }
      >
        {scroll ? (
          <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ minHeight: canvasHeight }}
          >
            {canvas}
          </ScrollView>
        ) : (
          canvas
        )}
      </View>
    </SafeAreaView>
  );
}
const sceneStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#090210" },
});
