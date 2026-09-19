import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControlProps,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";
import { useTheme, layout } from "@/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  keyboard?: boolean;
  safeArea?: Edge[] | boolean;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollProps?: ScrollViewProps;
  stickyHeaderIndices?: number[];
  horizontalPadding?: number | boolean;
  trackTabBarOnScroll?: boolean;
  overlay?: ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

export default function Screen({
  children,
  scroll = false,
  keyboard = true,
  safeArea = ["top"],
  backgroundColor,
  style,
  contentContainerStyle,
  stickyHeaderIndices,
  scrollProps,
  horizontalPadding,
  overlay,
  refreshControl,
}: ScreenProps) {
  const { theme } = useTheme();

  const finalBackgroundColor = backgroundColor ?? theme.background;

  const padding =
    typeof horizontalPadding === "number"
      ? horizontalPadding
      : horizontalPadding === false
        ? 0
        : layout.screenPadding;

  const containerStyle: StyleProp<ViewStyle> = [
    { paddingHorizontal: padding },
    scroll ? { flexGrow: 1 } : { flex: 1 },
    contentContainerStyle,
  ];

  const scrollSpecificProps = scroll
    ? {
        keyboardShouldPersistTaps: "handled" as const,
        showsVerticalScrollIndicator: false,
        stickyHeaderIndices,
        scrollEventThrottle: 16,
        refreshControl,
        ...scrollProps,
      }
    : {};

  const renderContent = () => {
    if (scroll) {
      if (keyboard) {
        return (
          <KeyboardAwareScrollView
            contentContainerStyle={containerStyle}
            bottomOffset={20}
            {...(scrollSpecificProps as any)}
          >
            {children}
          </KeyboardAwareScrollView>
        );
      }
      return (
        <ScrollView
          contentContainerStyle={containerStyle}
          {...scrollSpecificProps}
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View style={containerStyle}>
        {children}
      </View>
    );
  };

  const content = renderContent();

  const wrappedContent =
    keyboard && !scroll ? (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {content}
      </KeyboardAvoidingView>
    ) : (
      content
    );

  const edges: Edge[] = Array.isArray(safeArea)
    ? safeArea
    : safeArea === true
    ? ["top", "bottom"]
    : [];

  const isSafeAreaActive = edges.length > 0;

  if (isSafeAreaActive) {
    return (
      <SafeAreaView
        edges={edges}
        style={[{ flex: 1, backgroundColor: finalBackgroundColor }, style]}
      >
        {wrappedContent}
        {overlay}
      </SafeAreaView>
    );
  }

  return (
    <View
      style={[{ flex: 1, backgroundColor: finalBackgroundColor }, style]}
    >
      {wrappedContent}
      {overlay}
    </View>
  );
}