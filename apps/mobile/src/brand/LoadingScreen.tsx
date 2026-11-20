import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Platform,
  StyleSheet,
  View,
  Text,
  Pressable,
} from "react-native";
import { artwork, REFERENCE_WIDTH, REFERENCE_HEIGHT } from "./artwork";
import { ReferenceScene, LOADING_SLICES } from "./ReferenceScene";
export function LoadingScreen({
  onArtworkLoad,
  onFirstCycle,
  error,
  onRetry,
}: {
  onArtworkLoad?: () => void;
  onFirstCycle?: () => void;
  error?: string | null;
  onRetry?: () => void;
}) {
  const rotation = useRef(new Animated.Value(0)).current;
  const [painted, setPainted] = useState(Platform.OS === "web");
  useEffect(() => {
    if (!painted) return;
    let live = true;
    const first = Animated.timing(rotation, {
      toValue: 1,
      duration: 1100,
      easing: Easing.linear,
      useNativeDriver: Platform.OS !== "web",
      isInteraction: false,
    });
    const rest = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== "web",
        isInteraction: false,
      }),
    );
    first.start(({ finished }) => {
      if (finished && live) {
        onFirstCycle?.();
        rotation.setValue(0);
        rest.start();
      }
    });
    return () => {
      live = false;
      first.stop();
      rest.stop();
    };
  }, [rotation, painted, onFirstCycle]);
  return (
    <View
      style={StyleSheet.absoluteFill}
      accessibilityLabel="EntreNós. Carregando o aplicativo."
      accessibilityRole="progressbar"
    >
      <ReferenceScene
        source={artwork.loading}
        slices={LOADING_SLICES}
        scroll={false}
        onLoad={() => {
          setPainted(true);
          onArtworkLoad?.();
        }}
      >
        {({ box, scale }) => (
          <>
            <Image
              source={artwork.symbol}
              accessible={false}
              resizeMode="contain"
              style={box(321, 485, 300, 194)}
            />
            <Image
              source={artwork.wordmark}
              accessible={false}
              resizeMode="contain"
              style={box(170, 720, 600, 110)}
            />
            <Animated.View
              pointerEvents="none"
              style={[
                box(411, 1122, 120, 122),
                {
                  overflow: "hidden",
                  transform: [
                    {
                      rotate: rotation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Image
                source={artwork.loading}
                accessible={false}
                resizeMode="stretch"
                style={{
                  position: "absolute",
                  width: REFERENCE_WIDTH * scale,
                  height: REFERENCE_HEIGHT * scale,
                  left: -411 * scale,
                  top: -1122 * scale,
                }}
              />
            </Animated.View>
            {error && (
              <View
                style={[
                  box(85, 1320, 771, 200),
                  {
                    backgroundColor: "#160b23",
                    borderRadius: 14,
                    padding: 12,
                    justifyContent: "center",
                    gap: 8,
                  },
                ]}
              >
                <Text
                  accessibilityRole="alert"
                  style={{ color: "#fff", textAlign: "center" }}
                >
                  {error}
                </Text>
                <Pressable
                  onPress={onRetry}
                  accessibilityRole="button"
                  style={{ padding: 12 }}
                >
                  <Text
                    style={{
                      color: "#ff24c5",
                      textAlign: "center",
                      fontWeight: "700",
                    }}
                  >
                    Tentar novamente
                  </Text>
                </Pressable>
              </View>
            )}
          </>
        )}
      </ReferenceScene>
    </View>
  );
}
