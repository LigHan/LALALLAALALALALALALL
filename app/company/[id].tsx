import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

import { posts } from '@/constants/content';

export default function CompanyScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { width: windowWidth } = useWindowDimensions();

  const company = useMemo(() => posts.find(post => post.id === id) ?? posts[0], [id]);
  const [isGalleryVisible, setGalleryVisible] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isContactVisible, setContactVisible] = useState(false);
  const galleryRef = useRef<FlatList<string>>(null);
  const isWeb = Platform.OS === 'web';
  const galleryGap = 0;
  const columns = 5;
  const gridWidth = isWeb ? Math.max(windowWidth - 24 * 2, 0) : Math.max(windowWidth - 16, 0);
  const thumbnailWidth = Math.max(
    Math.min((gridWidth - galleryGap * (columns - 1)) / columns, isWeb ? 22 : 15),
    90
  );
  const modalWidth = Math.min(windowWidth - 32, 420);
  const modalHeight = modalWidth * 0.72;

  const handleFollow = () => {
    // TODO: integrate with backend later
    console.log(`follow ${company.userHandle}`);
  };

  const handleContact = (value: string) => {
    if (value.startsWith('+')) {
      Linking.openURL(`tel:${value.replace(/\s+/g, '')}`).catch(() => undefined);
    } else if (value.includes('@') && value.includes('.')) {
      Linking.openURL(`mailto:${value}`).catch(() => undefined);
    } else if (value.startsWith('http')) {
      Linking.openURL(value).catch(() => undefined);
    }
  };

  const handleOpenGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryVisible(true);
  };

  useEffect(() => {
    if (isGalleryVisible) {
      setTimeout(() => {
        galleryRef.current?.scrollToIndex({ index: galleryIndex, animated: false });
      }, 50);
    }
  }, [isGalleryVisible, galleryIndex]);

  return (
    <>
      <Stack.Screen
        options={{
          title: company.user,
          headerBackTitle: 'Назад',
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerCard}>
          <Image source={{ uri: company.userAvatar }} style={styles.avatar} />
          <Text style={styles.name}>{company.user}</Text>
          <Text style={styles.handle}>@{company.userHandle}</Text>
          <View style={styles.tagRow}>
            {company.tags.map(tag => (
              <View key={`${company.id}-${tag}`} style={styles.tagChip}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.followButton} onPress={handleFollow} activeOpacity={0.85}>
              <Ionicons name="add-circle-outline" size={18} color="#fff" />
              <Text style={styles.followButtonText}>Отслеживать</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => setContactVisible(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="mail-outline" size={18} color="#0f172a" />
              <Text style={styles.contactButtonText}>Связаться</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Описание</Text>
          <Text style={styles.description}>{company.bio}</Text>
        </View>

        <View style={[styles.section, styles.gallerySection]}>
          <View style={styles.galleryHeader}>
            <Text style={styles.sectionTitle}>Галерея</Text>
          </View>
          <View style={[styles.galleryGrid, { paddingHorizontal: isWeb ? 0 : 0 }]}
          >
            {company.gallery.map((uri, index) => (
              <TouchableOpacity
                key={`${uri}-${index}`}
                onPress={() => handleOpenGallery(index)}
                activeOpacity={0.85}
                style={[
                  styles.galleryTile,
                  {
                    width: thumbnailWidth,
                    height: thumbnailWidth,
                    marginRight: ((index + 1) % columns === 0 ? 0 : galleryGap),
                  },
                ]}
              >
                <Image source={{ uri }} style={styles.galleryImage} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.85}>
          <Ionicons name="arrow-back-circle-outline" size={22} color="#1d4ed8" />
          <Text style={styles.backButtonText}>Вернуться к ленте</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={isGalleryVisible} transparent animationType="fade" onRequestClose={() => setGalleryVisible(false)}>
        <Pressable style={styles.galleryModalOverlay} onPress={() => setGalleryVisible(false)}>
          <Pressable
            style={[styles.galleryModalContent, { width: modalWidth, height: modalHeight }]}
            onPress={event => event.stopPropagation()}
          >
            <FlatList
              ref={galleryRef}
              data={company.gallery}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={[styles.galleryFullImage, { width: modalWidth, height: modalHeight }]} />
              )}
              keyExtractor={(uri, index) => `${uri}-${index}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={modalWidth}
              decelerationRate="fast"
              getItemLayout={(_, index) => ({ length: modalWidth, offset: modalWidth * index, index })}
            />
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={isContactVisible} transparent animationType="fade" onRequestClose={() => setContactVisible(false)}>
        <Pressable style={styles.contactModalOverlay} onPress={() => setContactVisible(false)}>
          <View style={styles.contactModalContent}>
            <Text style={styles.contactModalTitle}>Контактная информация</Text>
            {company.contact.map(contact => (
              <TouchableOpacity
                key={`${company.id}-modal-${contact.label}`}
                style={styles.contactItem}
                onPress={() => handleContact(contact.value)}
                activeOpacity={0.85}
              >
                <View style={styles.contactIcon}>
                  <Ionicons name={contact.icon} size={18} color="#2563eb" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>{contact.label}</Text>
                  <Text style={styles.contactValue}>{contact.value}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.contactModalClose} onPress={() => setContactVisible(false)} activeOpacity={0.85}>
              <Text style={styles.contactModalCloseText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
    gap: 24,
    backgroundColor: '#ffffff',
  },
  headerCard: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  handle: {
    fontSize: 15,
    color: '#64748b',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#2563eb',
  },
  followButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    gap: 16,
    shadowColor: '#1f2937',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  gallerySection: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    shadowOpacity: 0,
    elevation: 0,
    gap: 0,
  },
  galleryHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1f2937',
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 24,
    justifyContent: 'center',
  },
  galleryTile: {
    marginBottom: 0,
    backgroundColor: 'transparent',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(226, 232, 240, 0.5)',
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  contactInfo: {
    flex: 1,
    gap: 4,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  contactValue: {
    fontSize: 13,
    color: '#475569',
  },
  galleryModalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  galleryModalContent: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
  },
  galleryFullImage: {
    resizeMode: 'cover',
  },
  contactModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 11, 23, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  contactModalContent: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    gap: 16,
  },
  contactModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  contactModalClose: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
  },
  contactModalCloseText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#1f2937',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1d4ed8',
  },
});
