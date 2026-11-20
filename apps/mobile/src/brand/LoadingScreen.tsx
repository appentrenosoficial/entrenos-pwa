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
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
  const { width } = useWindowDimensions();
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
  if (Platform.OS === "web" && width >= 960)
    return (
      <DesktopLoading
        rotation={rotation}
        error={error}
        onRetry={onRetry}
        onArtworkLoad={onArtworkLoad}
      />
    );
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
              style={box(150, 640, 230, 149)}
            />
            <Image
              source={artwork.wordmark}
              accessible={false}
              resizeMode="contain"
              style={box(410, 678, 380, 70)}
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

function DesktopLoading({
  rotation,
  error,
  onRetry,
  onArtworkLoad,
}: {
  rotation: Animated.Value;
  error?: string | null;
  onRetry?: () => void;
  onArtworkLoad?: () => void;
}) {
  return (
    <View
      style={StyleSheet.absoluteFill}
      accessibilityLabel="EntreNós. Carregando o aplicativo."
      accessibilityRole="progressbar"
    >
      <LinearGradient
        colors={["#080511", "#13091f", "#090511"]}
        locations={[0, 0.52, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={desktopStyles.glowTop} />
      <View pointerEvents="none" style={desktopStyles.glowBottom} />
      <View style={desktopStyles.center}>
        <View style={desktopStyles.brand}>
          <Image
            source={artwork.symbol}
            accessible={false}
            resizeMode="contain"
            onLoad={onArtworkLoad}
            style={desktopStyles.symbol}
          />
          <Image
            source={artwork.wordmark}
            accessible={false}
            resizeMode="contain"
            style={desktopStyles.wordmark}
          />
        </View>
        <View style={desktopStyles.agePill}>
          <Text style={desktopStyles.ageText}>18+</Text>
          <View style={desktopStyles.ageDivider} />
          <Text style={desktopStyles.ageCaption}>REDE SOCIAL PARA ADULTOS</Text>
        </View>
        <View style={desktopStyles.loadingGroup}>
          <Animated.View
            style={[
              desktopStyles.spinner,
              {
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
          />
          <Text style={desktopStyles.loadingText}>Carregando...</Text>
        </View>
        <Text style={desktopStyles.footer}>
          Conexões reais começam com respeito.
        </Text>
        {error && (
          <View style={desktopStyles.errorBox}>
            <Text accessibilityRole="alert" style={desktopStyles.errorText}>
              {error}
            </Text>
            <Pressable
              onPress={onRetry}
              accessibilityRole="button"
              style={desktopStyles.retryButton}
            >
              <Text style={desktopStyles.retryText}>Tentar novamente</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const desktopStyles = StyleSheet.create({
  center: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  glowTop: {
    position: "absolute",
    top: -300,
    left: -240,
    width: 820,
    height: 820,
    borderRadius: 410,
    backgroundColor: "rgba(180, 0, 220, 0.12)",
    shadowColor: "#d000d5",
    shadowOpacity: 0.55,
    shadowRadius: 130,
  },
  glowBottom: {
    position: "absolute",
    right: -300,
    bottom: -440,
    width: 920,
    height: 920,
    borderRadius: 460,
    backgroundColor: "rgba(218, 0, 120, 0.10)",
    shadowColor: "#f500a6",
    shadowOpacity: 0.5,
    shadowRadius: 140,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginBottom: 34,
  },
  symbol: { width: 112, height: 73 },
  wordmark: { width: 310, height: 57 },
  agePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(225, 74, 219, 0.42)",
    borderRadius: 24,
    backgroundColor: "rgba(28, 15, 39, 0.8)",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  ageText: { color: "#fff", fontSize: 13, fontWeight: "800", letterSpacing: 0.8 },
  ageDivider: { width: 1, height: 18, backgroundColor: "#6e587c" },
  ageCaption: { color: "#c8b8d3", fontSize: 11, fontWeight: "700", letterSpacing: 1.8 },
  loadingGroup: { alignItems: "center", gap: 18, marginTop: 56 },
  spinner: {
    width: 58,
    height: 58,
    borderWidth: 5,
    borderRadius: 29,
    borderColor: "rgba(214, 42, 217, 0.22)",
    borderTopColor: "#ec19bc",
    borderRightColor: "#8c2de9",
  },
  loadingText: { color: "#f7f1fa", fontSize: 18, fontWeight: "600", letterSpacing: 0.2 },
  footer: { color: "#94869e", fontSize: 13, marginTop: 45, letterSpacing: 0.3 },
  errorBox: {
    maxWidth: 520,
    marginTop: 26,
    padding: 18,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 102, 158, 0.25)",
    borderRadius: 14,
    backgroundColor: "rgba(22, 11, 35, 0.94)",
  },
  errorText: { color: "#fff", textAlign: "center", lineHeight: 20 },
  retryButton: { paddingHorizontal: 12, paddingVertical: 8 },
  retryText: { color: "#ff24c5", textAlign: "center", fontWeight: "700" },
});
