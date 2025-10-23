import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function MapScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Карта
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Здесь скоро появится интерактивная карта города.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    backgroundColor: '#ffffff',
  },
  title: {
    marginBottom: 12,
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
});
