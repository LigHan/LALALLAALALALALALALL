import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState, type ComponentProps } from 'react';
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

import { normalizePost, posts } from '@/constants/content';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export default function CompanyScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { width: windowWidth } = useWindowDimensions();

  const company = useMemo(() => normalizePost(posts.find(post => post.id === id) ?? posts[0]), [id]);
  const [isGalleryVisible, setGalleryVisible] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isContactVisible, setContactVisible] = useState(false);
  const [isReviewsVisible, setReviewsVisible] = useState(false);
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

  const handleViewReviews = () => {
    setReviewsVisible(true);
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

  const companyStats = useMemo(
    () =>
      [
        { label: 'Подписчиков', value: formatNumber(company.followers), icon: 'people-outline' as IoniconName },
        { label: 'Всего лайков', value: formatNumber(company.totalLikes), icon: 'heart' as IoniconName },
      ],
    [company.followers, company.totalLikes]
  );

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
          <View style={styles.statsRow}>
            {companyStats.map(stat => (
              <View key={stat.label} style={styles.statCard}>
                <Ionicons name={stat.icon} size={18} color="#2563eb" />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.tagRow}>
            {company.tags.map(tag => (
              <View key={`${company.id}-${tag}`} style={styles.tagChip}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
          <View style={styles.actionsRow}>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Отзывы посетителей</Text>
          <View style={styles.reviewsPreview}>
            {company.reviews.slice(0, 2).map(review => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Ionicons name="person-circle-outline" size={20} color="#2563eb" />
                  <Text style={styles.reviewAuthor}>{review.author}</Text>
                  <View style={styles.reviewRating}>
                    <Ionicons name="star" size={14} color="#f59e0b" />
                    <Text style={styles.reviewRatingText}>{review.rating.toFixed(1)}</Text>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
            ))}
            {company.reviews.length > 2 && (
              <TouchableOpacity style={styles.reviewMoreButton} onPress={handleViewReviews} activeOpacity={0.85}>
                <Text style={styles.reviewMoreText}>Смотреть все отзывы</Text>
                <Ionicons name="chevron-forward" size={16} color="#2563eb" />
              </TouchableOpacity>
            )}
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

      <Modal visible={isReviewsVisible} transparent animationType="fade" onRequestClose={() => setReviewsVisible(false)}>
        <Pressable style={styles.contactModalOverlay} onPress={() => setReviewsVisible(false)}>
          <View style={[styles.contactModalContent, styles.reviewsModalContent]}>
            <Text style={styles.contactModalTitle}>Отзывы о {company.place}</Text>
            <ScrollView contentContainerStyle={styles.reviewsModalList} showsVerticalScrollIndicator={false}>
              {company.reviews.map(review => (
                <View key={`${company.id}-modal-${review.id}`} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Ionicons name="person-circle-outline" size={20} color="#2563eb" />
                    <Text style={styles.reviewAuthor}>{review.author}</Text>
                    <View style={styles.reviewRating}>
                      <Ionicons name="star" size={14} color="#f59e0b" />
                      <Text style={styles.reviewRatingText}>{review.rating.toFixed(1)}</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.contactModalClose} onPress={() => setReviewsVisible(false)} activeOpacity={0.85}>
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 18,
    width: '100%',
    marginTop: 12,
    marginBottom: 4,
  },
  statCard: {
    flex: 1,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
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
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    width: '100%',
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
  reviewsPreview: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 16,
    gap: 10,
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewAuthor: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  reviewRatingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#b45309',
  },
  reviewComment: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  reviewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  reviewMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
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
  reviewsModalContent: {
    maxHeight: 480,
  },
  reviewsModalList: {
    gap: 16,
    paddingBottom: 12,
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

function formatNumber(value: number) {
  return value.toLocaleString('ru-RU');
}
