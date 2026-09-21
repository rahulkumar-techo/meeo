import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ZoomableImageProps {
  uri: string;
  isActive: boolean;
}

function ZoomableImage({ uri, isActive }: ZoomableImageProps) {
  const scale = useSharedValue(1);
  const startScale = useSharedValue(1);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startTranslateX = useSharedValue(0);
  const startTranslateY = useSharedValue(0);

  // Reset zoom when swiping between different slides
  useEffect(() => {
    if (!isActive) {
      scale.value = withTiming(1, { duration: 200 });
      translateX.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(0, { duration: 200 });
    }
  }, [isActive]);

  // Smooth Double Tap to toggle between 1x and 2.5x
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(250)
    .onEnd(() => {
      'worklet';
      if (scale.value > 1.2) {
        // Zoom back out smoothly
        scale.value = withTiming(1, {
          duration: 250,
          easing: Easing.out(Easing.ease),
        });
        translateX.value = withTiming(0, {
          duration: 250,
          easing: Easing.out(Easing.ease),
        });
        translateY.value = withTiming(0, {
          duration: 250,
          easing: Easing.out(Easing.ease),
        });
      } else {
        // Zoom in to 2.5x
        scale.value = withTiming(2.5, {
          duration: 250,
          easing: Easing.out(Easing.ease),
        });
      }
    });

  // Smooth Pinch-to-Zoom Gesture running 100% on Native UI Thread
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      'worklet';
      startScale.value = scale.value;
    })
    .onUpdate((e) => {
      'worklet';
      const targetScale = startScale.value * e.scale;
      // Clamp scale smoothly between 1 and 4.5
      scale.value = Math.min(Math.max(targetScale, 0.95), 4.5);
    })
    .onEnd(() => {
      'worklet';
      if (scale.value < 1.05) {
        // Snap back to 1x without bounce
        scale.value = withTiming(1, {
          duration: 200,
          easing: Easing.out(Easing.ease),
        });
        translateX.value = withTiming(0, { duration: 200 });
        translateY.value = withTiming(0, { duration: 200 });
      } else if (scale.value > 4) {
        scale.value = withTiming(4, {
          duration: 200,
          easing: Easing.out(Easing.ease),
        });
      }
    });

  // Pan gesture for dragging when zoomed in
  const panGesture = Gesture.Pan()
    .minDistance(5)
    .onStart(() => {
      'worklet';
      startTranslateX.value = translateX.value;
      startTranslateY.value = translateY.value;
    })
    .onUpdate((e) => {
      'worklet';
      if (scale.value > 1.05) {
        const maxBoundX = ((scale.value - 1) * SCREEN_WIDTH) / 2;
        const maxBoundY = ((scale.value - 1) * (SCREEN_HEIGHT * 0.7)) / 2;

        const rawNextX = startTranslateX.value + e.translationX;
        const rawNextY = startTranslateY.value + e.translationY;

        translateX.value = Math.min(Math.max(rawNextX, -maxBoundX), maxBoundX);
        translateY.value = Math.min(Math.max(rawNextY, -maxBoundY), maxBoundY);
      }
    })
    .onEnd(() => {
      'worklet';
      if (scale.value <= 1.05) {
        translateX.value = withTiming(0, { duration: 150 });
        translateY.value = withTiming(0, { duration: 150 });
      }
    });

  const composedGestures = Gesture.Simultaneous(
    pinchGesture,
    Gesture.Race(doubleTapGesture, panGesture)
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={styles.imageContainer}>
      <GestureDetector gesture={composedGestures}>
        <Animated.View style={[styles.imageWrapper, animatedStyle]}>
          <Image
            source={{ uri }}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export interface ProductImageModalProps {
  visible: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

export function ProductImageModal({
  visible,
  images,
  initialIndex = 0,
  onClose,
}: ProductImageModalProps) {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const modalScrollRef = useRef<ScrollView>(null);
  const isProgrammatic = useRef(false);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      setTimeout(() => {
        modalScrollRef.current?.scrollTo({
          x: initialIndex * SCREEN_WIDTH,
          animated: false,
        });
      }, 50);
    }
  }, [visible, initialIndex]);

  const handleScroll = (e: any) => {
    if (isProgrammatic.current) return;
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== currentIndex && index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  };

  const handleSelectThumbnail = (index: number) => {
    if (index === currentIndex) return;
    isProgrammatic.current = true;
    setCurrentIndex(index);
    modalScrollRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true,
    });
    setTimeout(() => {
      isProgrammatic.current = false;
    }, 350);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.modalRoot}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />

        {/* Top Controls Bar */}
        <View
          style={[
            styles.topBar,
            { paddingTop: Math.max(insets.top, 16) + 6 },
          ]}
        >
          {/* Close Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.closeBtn}
          >
            <X size={22} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Page Counter */}
          <View style={styles.counterPill}>
            <Text style={styles.counterText}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>

          {/* Placeholder to balance layout */}
          <View style={{ width: 40 }} />
        </View>

        {/* Gesture-driven Image Slider */}
        <ScrollView
          ref={modalScrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {images.map((imgUrl, idx) => (
            <ZoomableImage
              key={idx}
              uri={imgUrl}
              isActive={idx === currentIndex}
            />
          ))}
        </ScrollView>

        {/* Bottom Thumbnail Strip */}
        {images.length > 1 && (
          <View
            style={[
              styles.bottomStrip,
              { paddingBottom: Math.max(insets.bottom, 16) + 8 },
            ]}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailContent}
            >
              {images.map((imgUrl, idx) => {
                const isSelected = idx === currentIndex;
                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.8}
                    onPress={() => handleSelectThumbnail(idx)}
                    style={[
                      styles.thumbnailBtn,
                      {
                        borderColor: isSelected ? '#3B82F6' : 'rgba(255,255,255,0.2)',
                        transform: [{ scale: isSelected ? 1.08 : 1 }],
                      },
                    ]}
                  >
                    <Image
                      source={{ uri: imgUrl }}
                      style={styles.thumbnailImg}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.96)',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 20,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  bottomStrip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingTop: 10,
    zIndex: 20,
  },
  thumbnailContent: {
    paddingHorizontal: 16,
    gap: 10,
    alignItems: 'center',
  },
  thumbnailBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    padding: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
});

export default ProductImageModal;
