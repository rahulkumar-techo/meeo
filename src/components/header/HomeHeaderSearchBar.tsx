import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Search, Mic, QrCode } from 'lucide-react-native';

export interface HomeHeaderSearchBarProps {
  onSearchPress?: () => void;
  onScannerPress?: () => void;
  onMicPress?: () => void;
  onFilterPress?: () => void;
  placeholder?: string;
  showMic?: boolean;
  showScanner?: boolean;
}

export const HomeHeaderSearchBar = memo(function HomeHeaderSearchBar({
  onSearchPress,
  onScannerPress,
  onMicPress,
  placeholder = 'Search products, brands & categories...',
  showMic = true,
  showScanner = true,
}: HomeHeaderSearchBarProps) {
  return (
    <View style={styles.container}>
      {/* Search Input Pill */}
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={onSearchPress}
        style={styles.searchBar}
      >
        <Search size={19} color="#64748B" style={{ marginRight: 2 }} />
        <Text style={styles.placeholder} numberOfLines={1}>
          {placeholder}
        </Text>
        {showMic && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onMicPress}
            style={styles.innerMicBtn}
          >
            <Mic size={19} color="#64748B" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* QR / Scanner Button */}
      {showScanner && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onScannerPress}
          style={styles.scannerBtn}
        >
          <QrCode size={22} color="#FFFFFF" strokeWidth={2.2} />
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 44,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  placeholder: {
    flex: 1,
    fontSize: 13,
    fontWeight: '400',
    color: '#64748B',
  },
  innerMicBtn: {
    padding: 4,
  },
  scannerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
});

export default HomeHeaderSearchBar;
