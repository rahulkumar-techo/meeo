import React, { ReactNode, useEffect, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { ChevronDown, LucideIcon } from 'lucide-react-native';

interface DropdownProps {
    title: string;
    subtitle?: string;

    icon?: LucideIcon;
    iconColor?: string;
    iconSize?: number;

    rightComponent?: ReactNode;

    children: ReactNode;

    defaultOpen?: boolean;
    disabled?: boolean;

    onToggle?: (open: boolean) => void;

    headerBg?: string;
    titleColor?: string;
    subtitleColor?: string;

    style?: ViewStyle;

    /**
     * Maximum height of dropdown content.
     * Increase this if your content is very large.
     */
    maxHeight?: number;
}

const DURATION = 250;

const Dropdown = ({
    title,
    subtitle,
    icon: LeftIcon,
    iconColor = '#6B7280',
    iconSize = 20,
    rightComponent,
    children,
    defaultOpen = false,
    disabled = false,
    onToggle,
    headerBg,
    titleColor,
    subtitleColor = '#9CA3AF',
    style,
    maxHeight = 1000,
}: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    /**
     * Animation progress:
     * 0 = closed
     * 1 = open
     */
    const progress = useSharedValue(defaultOpen ? 1 : 0);

    /**
     * Toggle
     */
    const handleToggle = () => {
        if (disabled) return;

        const nextOpen = !isOpen;

        setIsOpen(nextOpen);

        progress.value = withTiming(nextOpen ? 1 : 0, {
            duration: DURATION,
        });

        onToggle?.(nextOpen);
    };

    /**
     * Sync defaultOpen if parent changes it.
     */
    useEffect(() => {
        progress.value = withTiming(defaultOpen ? 1 : 0, {
            duration: DURATION,
        });

        setIsOpen(defaultOpen);
    }, [defaultOpen, progress]);

    /**
     * Content animation.
     *
     * We animate maxHeight instead of calculating
     * the exact content height.
     *
     * This prevents content clipping.
     */
    const animatedContentStyle = useAnimatedStyle(() => ({
        maxHeight: progress.value * maxHeight,
        opacity: progress.value,
    }));

    /**
     * Arrow rotation.
     */
    const animatedArrowStyle = useAnimatedStyle(() => ({
        transform: [
            {
                rotate: `${progress.value * 180}deg`,
            },
        ],
    }));

    const resolvedTitleColor =
        titleColor ?? (headerBg ? '#FFFFFF' : '#111827');

    const resolvedIconColor =
        headerBg ? '#FFFFFF' : iconColor;

    return (
        <View
            style={[
                styles.container,
                {
                    borderColor: headerBg
                        ? 'transparent'
                        : '#E5E7EB',
                },
                style,
            ]}
        >
            {/* HEADER */}
            <Pressable
                disabled={disabled}
                onPress={handleToggle}
                style={[
                    styles.header,
                    headerBg && {
                        backgroundColor: headerBg,
                    },
                    disabled && styles.disabled,
                ]}
            >
                {/* LEFT ICON */}
                {LeftIcon && (
                    <LeftIcon
                        size={iconSize}
                        color={resolvedIconColor}
                        strokeWidth={2}
                    />
                )}

                {/* TITLE */}
                <View style={styles.titleContainer}>
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.title,
                            {
                                color: resolvedTitleColor,
                            },
                        ]}
                    >
                        {title}
                    </Text>

                    {subtitle && (
                        <Text
                            numberOfLines={1}
                            style={[
                                styles.subtitle,
                                {
                                    color: subtitleColor,
                                },
                            ]}
                        >
                            {subtitle}
                        </Text>
                    )}
                </View>

                {/* RIGHT COMPONENT / CHEVRON */}
                {rightComponent ?? (
                    <Animated.View style={animatedArrowStyle}>
                        <ChevronDown
                            size={20}
                            color={resolvedIconColor}
                            strokeWidth={2.5}
                        />
                    </Animated.View>
                )}
            </Pressable>

            {/* CONTENT */}
            <Animated.View
                style={[
                    styles.contentContainer,
                    animatedContentStyle,
                ]}
            >
                <View style={styles.content}>
                    {children}
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
    },

    header: {
        minHeight: 52,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 10,
    },

    disabled: {
        opacity: 0.5,
    },

    titleContainer: {
        flex: 1,
    },

    title: {
        fontSize: 14,
        fontWeight: '700',
    },

    subtitle: {
        fontSize: 12,
        marginTop: 2,
    },

    contentContainer: {
        overflow: 'hidden',
    },

    content: {
        padding: 12,
    },
});

export default Dropdown;