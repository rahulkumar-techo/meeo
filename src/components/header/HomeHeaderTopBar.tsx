import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, ChevronDown, ScanLine, Bell, Sparkles } from 'lucide-react-native';

interface Props {
  address: string;
  points: number;
  onAddressPress?: () => void;
  onPointsPress?: () => void;
  onScannerPress?: () => void;
  onNotificationPress?: () => void;
}

export const HomeHeaderTopBar = memo(({
  address,
  points,
  onAddressPress,
  onPointsPress,
  onScannerPress,
  onNotificationPress,
}: Props) => {
  return (
    <View style={styles.container}>
      {/* Deliver To Address Button */}
      <TouchableOpacity activeOpacity={0.8} onPress={onAddressPress} style={styles.addressBtn}>
        <View style={styles.iconBadge}>
          <MapPin size={15} color="#FFFFFF" />
        </View>
        <View style={styles.addressTextWrapper}>
          <Text style={styles.addressLabel} numberOfLines={1}>
            Deliver to
          </Text>
          <View style={styles.addressRow}>
            <Text style={styles.addressValue} numberOfLines={1}>
              {address}
            </Text>
            <ChevronDown size={14} color="#FFFFFF" style={{ marginLeft: 2, opacity: 0.9 }} />
          </View>
        </View>
      </TouchableOpacity>

      {/* Action Icons */}
      <View style={styles.actionsRow}>
        {/* Points Badge */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPointsPress}
          style={styles.pointsPill}
        >
          <Sparkles size={13} color="#FDE047" />
          <Text style={styles.pointsText}>{points.toLocaleString()}</Text>
        </TouchableOpacity>

        {/* Scanner Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onScannerPress}
          style={styles.actionBtn}
        >
          <ScanLine size={17} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Notification Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onNotificationPress}
          style={styles.actionBtn}
        >
          <Bell size={17} color="#FFFFFF" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 42,
  },
  addressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  addressTextWrapper: { flex: 1 },
  addressLabel: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 13,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  addressRow: { flexDirection: 'row', alignItems: 'center' },
  addressValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    maxWidth: 155,
  },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  pointsText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
});
