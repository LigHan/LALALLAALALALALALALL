import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type WorkingHours = {
  label: string;
  value: string;
};

type Review = {
  id: string;
  author: string;
  comment: string;
  rating: number;
  date: string;
};

type Post = {
  id: string;
  user: string;
  place: string;
  image: string;
  likes: number;
  rating: number;
  workingHours: WorkingHours[];
  reviews: Review[];
};

const initialPosts: Post[] = [
  {
    id: '1',
    user: 'Анна',
    place: 'Парк Горького',
    image: 'https://picsum.photos/600/400?1',
    likes: 12,
    rating: 4.8,
    workingHours: [
      { label: 'Пн - Пт', value: '08:00 - 23:00' },
      { label: 'Сб - Вс', value: '10:00 - 01:00' },
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Екатерина',
        comment: 'Люблю этот парк — особенно вечером, когда включают подсветку фонтанов.',
        rating: 5,
        date: '12 мая 2024',
      },
      {
        id: 'r2',
        author: 'Максим',
        comment: 'Хорошо оборудованные дорожки, много кафе. Единственный минус — многолюдно по выходным.',
        rating: 4,
        date: '8 мая 2024',
      },
    ],
  },
  {
    id: '2',
    user: 'Илья',
    place: 'ВДНХ',
    image: 'https://picsum.photos/600/400?2',
    likes: 7,
    rating: 4.5,
    workingHours: [
      { label: 'Пн - Пт', value: '09:00 - 20:00' },
      { label: 'Сб - Вс', value: '10:00 - 22:00' },
    ],
    reviews: [
      {
        id: 'r3',
        author: 'Артём',
        comment: 'Отлично для семейных прогулок и изучения павильонов, есть чем заняться целый день.',
        rating: 5,
        date: '4 мая 2024',
      },
      {
        id: 'r4',
        author: 'Ольга',
        comment: 'Зимой красиво, но некоторые павильоны закрыты. Летом обязательно вернусь.',
        rating: 4,
        date: '18 апреля 2024',
      },
    ],
  },
  {
    id: '3',
    user: 'Мария',
    place: 'Красная площадь',
    image: 'https://picsum.photos/600/400?3',
    likes: 25,
    rating: 4.9,
    workingHours: [{ label: 'Ежедневно', value: 'Круглосуточно' }],
    reviews: [
      {
        id: 'r5',
        author: 'Сергей',
        comment: 'Вечером невероятно красиво, обязательно загляните на смену караула.',
        rating: 5,
        date: '1 мая 2024',
      },
      {
        id: 'r6',
        author: 'Виктория',
        comment: 'Главная площадь города, стоит посетить каждому туристу.',
        rating: 5,
        date: '22 апреля 2024',
      },
    ],
  },
];

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [isScheduleVisible, setScheduleVisible] = useState(false);
  const [reviewsPost, setReviewsPost] = useState<Post | null>(null);
  const [isReviewsVisible, setReviewsVisible] = useState(false);

  const handleLike = (id: string) => {
    setPosts(prev =>
      prev.map(p => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };
  const handleComment = (id: string) => {
    // TODO: navigate to comments or open modal
    console.log(`comment on ${id}`);
  };
  const handleFavorite = (id: string) => {
    // TODO: persist favorites or show feedback
    console.log(`favorite ${id}`);
  };
  const handleOpenMap = (id: string) => {
    // TODO: navigate to map detail
    console.log(`open map for ${id}`);
  };
  const handleDownload = (id: string) => {
    // TODO: trigger download or share sheet
    console.log(`download for ${id}`);
  };
  const handleOpenHours = (post: Post) => {
    setActivePost(post);
    setScheduleVisible(true);
  };
  const handleCloseHours = () => {
    setScheduleVisible(false);
  };
  const handleOpenReviews = (post: Post) => {
    setReviewsPost(post);
    setReviewsVisible(true);
  };
  const handleCloseReviews = () => {
    setReviewsVisible(false);
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (!isScheduleVisible && activePost) {
      timeout = setTimeout(() => setActivePost(null), 220);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isScheduleVisible, activePost]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (!isReviewsVisible && reviewsPost) {
      timeout = setTimeout(() => setReviewsPost(null), 220);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isReviewsVisible, reviewsPost]);

  const renderFooter = () =>
    posts.length > 0 ? (
      <View style={styles.listFooter}>
        <Ionicons name="sad-outline" size={20} color="#9AA1AE" />
        <Text style={styles.listFooterText}>Посты закончились…</Text>
      </View>
    ) : null;

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={renderFooter}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <View style={styles.placeRow}>
                  <Text style={styles.place}>{item.place}</Text>
                  <TouchableOpacity
                    style={styles.ratingBadge}
                    onPress={() => handleOpenReviews(item)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="star" size={16} color="#FFB800" />
                    <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.user}>от {item.user}</Text>
              </View>
            <View style={styles.actions}>
              <View style={styles.actionGroup}>
                <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.likeBtn}>
                  <Ionicons name="heart-outline" size={24} color="#FF2D55" />
                  <Text style={styles.likeCount}>{item.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleComment(item.id)} style={styles.actionButton}>
                  <Ionicons name="chatbubble-ellipses-outline" size={24} color="#1C1C1E" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleOpenMap(item.id)} style={styles.actionButton}>
                  <Ionicons name="map-outline" size={24} color="#1C1C1E" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDownload(item.id)} style={styles.actionButton}>
                  <Ionicons name="download-outline" size={24} color="#1C1C1E" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleOpenHours(item)}
                  style={[styles.actionButton, styles.scheduleButton]}
                >
                  <Ionicons name="time-outline" size={24} color="#005AC1" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => handleFavorite(item.id)}
                style={[styles.actionButton, styles.favoriteButton]}
              >
                <Ionicons name="bookmark-outline" size={24} color="#1C1C1E" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Modal visible={isScheduleVisible} transparent animationType="fade" onRequestClose={handleCloseHours}>
        <Pressable style={styles.modalOverlay} onPress={handleCloseHours}>
          <Pressable style={styles.modalCard} onPress={event => event.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{activePost?.place}</Text>
              {activePost && (
                <View style={styles.modalRating}>
                  <Ionicons name="star" size={18} color="#FFB800" />
                  <Text style={styles.modalRatingText}>{activePost.rating.toFixed(1)}</Text>
                </View>
              )}
            </View>
            <Text style={styles.modalSubtitle}>Время работы заведения</Text>
            <View style={styles.modalHours}>
              {activePost?.workingHours.map((slot, index) => (
                <View key={`${slot.label}-${index}`} style={styles.hoursRow}>
                  <Text style={styles.hoursLabel}>{slot.label}</Text>
                  <Text style={styles.hoursValue}>{slot.value}</Text>
                </View>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      <Modal visible={isReviewsVisible} transparent animationType="fade" onRequestClose={handleCloseReviews}>
        <Pressable style={styles.modalOverlay} onPress={handleCloseReviews}>
          <Pressable style={styles.modalCard} onPress={event => event.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Отзывы о {reviewsPost?.place}</Text>
              {reviewsPost && (
                <View style={styles.modalRating}>
                  <Ionicons name="star" size={18} color="#FFB800" />
                  <Text style={styles.modalRatingText}>{reviewsPost.rating.toFixed(1)}</Text>
                </View>
              )}
            </View>
            <Text style={styles.modalSubtitle}>Что говорят посетители</Text>
            <View style={styles.reviewsList}>
              {reviewsPost?.reviews.map(review => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewAuthor}>{review.author}</Text>
                    <View style={styles.reviewRating}>
                      <Ionicons name="star" size={14} color="#FFB800" />
                      <Text style={styles.reviewRatingText}>{review.rating.toFixed(1)}</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#edf0f5', paddingHorizontal: 10, paddingTop: '5%' },
  listContent: {
    paddingBottom: 200,
    paddingTop: 10,
  },
  listFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 28,
  },
  listFooterText: {
    color: '#9AA1AE',
    fontSize: 15,
  },
  post: {
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.15)',
    shadowColor: '#0f172a',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 16 },
    elevation: 12,
  },
  image: { width: '100%', height: 300 },
  info: { padding: 10 },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  place: { fontSize: 18, fontWeight: '600' },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 184, 0, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B45309',
  },
  user: { color: '#777', marginTop: 4 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
    gap: 12,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  favoriteButton: {
    marginLeft: 'auto',
  },
  scheduleButton: {
    backgroundColor: 'rgba(0, 90, 193, 0.12)',
  },
  likeCount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 16, 26, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#0b101a',
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 18 },
    elevation: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  modalRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 184, 0, 0.12)',
  },
  modalRatingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400e',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#334155',
    marginTop: 12,
    marginBottom: 10,
  },
  modalHours: {
    gap: 12,
  },
  reviewsList: {
    gap: 16,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(148, 163, 184, 0.35)',
  },
  hoursLabel: {
    fontSize: 15,
    color: '#475569',
  },
  hoursValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  reviewItem: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    backgroundColor: 'rgba(248, 250, 252, 0.85)',
    gap: 6,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 184, 0, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reviewRatingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B45309',
  },
  reviewComment: {
    fontSize: 15,
    lineHeight: 21,
    color: '#1e293b',
  },
  reviewDate: {
    fontSize: 13,
    color: '#64748b',
  },
});
