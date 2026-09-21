import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';

export interface ProductSpecificationsProps {
  specifications?: Record<string, any>;
}

export function ProductSpecifications({
  specifications,
}: ProductSpecificationsProps) {
  const { theme, isDark } = useTheme();

  if (!specifications || Object.keys(specifications).length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.heading,
          { color: isDark ? '#F8FAFC' : '#0F172A' },
        ]}
      >
        Specifications & Details
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderColor: isDark ? '#334155' : '#E2E8F0',
          },
        ]}
      >
        {Object.entries(specifications).map(([categoryName, specsObj], catIdx) => {
          if (!specsObj || typeof specsObj !== 'object') return null;

          return (
            <View key={catIdx} style={styles.categoryBlock}>
              <Text
                style={[
                  styles.categoryTitle,
                  { color: theme.primary },
                ]}
              >
                {categoryName.toUpperCase()}
              </Text>

              {Object.entries(specsObj).map(([key, val], specIdx) => (
                <View
                  key={specIdx}
                  style={[
                    styles.specRow,
                    {
                      borderBottomColor: isDark ? '#334155' : '#F1F5F9',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.specKey,
                      { color: isDark ? '#94A3B8' : '#64748B' },
                    ]}
                  >
                    {key}
                  </Text>
                  <Text
                    style={[
                      styles.specVal,
                      { color: isDark ? '#F8FAFC' : '#0F172A' },
                    ]}
                  >
                    {String(val)}
                  </Text>
                </View>
              ))}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 6,
  },
  heading: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  categoryBlock: {
    gap: 6,
  },
  categoryTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  specKey: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  specVal: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
});

export default ProductSpecifications;
