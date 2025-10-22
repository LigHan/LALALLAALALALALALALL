import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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

type Story = {
  id: string;
  userName: string;
  avatar: string;
  image: string;
  text: string;
  postId: string;
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

const stories: Story[] = [
  {
    id: 's1',
    userName: 'Moscow guides',
    avatar: 'https://i.pravatar.cc/120?img=12',
    image: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80',
    text: 'Новый маршрут вдоль Москвы-реки уже доступен. Захватывающие виды и уютные места по пути!',
    postId: '1',
  },
  {
    id: 's2',
    userName: 'Urban explorer',
    avatar: 'https://i.pravatar.cc/120?img=32',
    image: 'https://images.unsplash.com/photo-1470123808288-1e59739bc221?auto=format&fit=crop&w=800&q=80',
    text: 'Побывал в арт-кластере Хлебозавод — это настоящий город в городе. Делюсь атмосферой.',
    postId: '2',
  },
  {
    id: 's3',
    userName: 'Coffee time',
    avatar: 'https://i.pravatar.cc/120?img=56',
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
    text: 'Нашли кофейню с невероятными десертами и видом на Тверскую. Лайфхак для сладкоежек.',
    postId: '2',
  },
  {
    id: 's4',
    userName: 'City walker',
    avatar: 'https://i.pravatar.cc/120?img=14',
    image: 'https://images.unsplash.com/photo-1529429617124-aee341f3b7a0?auto=format&fit=crop&w=800&q=80',
    text: 'Вечерняя прогулка по Замоскворечью — тихие улицы, старинные дома и уютные лавочки.',
    postId: '3',
  },
];

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
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isStoryVisible, setStoryVisible] = useState(false);
  const [storyLikes, setStoryLikes] = useState<Record<string, boolean>>({});

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
  const handleOpenStory = (story: Story) => {
    setActiveStory(story);
    setStoryVisible(true);
  };
  const handleCloseStory = () => {
    setStoryVisible(false);
  };
  const handleOpenStoryDetails = (story: Story) => {
    const relatedPost = posts.find(post => post.id === story.postId);
    if (relatedPost) {
      setStoryVisible(false);
      setActivePost(relatedPost);
      setScheduleVisible(true);
    }
  };
  const toggleStoryLike = (storyId: string) => {
    setStoryLikes(prev => ({
      ...prev,
      [storyId]: !prev[storyId],
    }));
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

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (!isStoryVisible && activeStory) {
      timeout = setTimeout(() => setActiveStory(null), 220);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isStoryVisible, activeStory]);

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
        ListHeaderComponent={
          <View style={styles.storiesSection}>
            <Text style={styles.storiesTitle}>Новинки</Text>
            <FlatList
              data={stories}
              keyExtractor={story => story.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storiesList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.storyItem}
                  onPress={() => handleOpenStory(item)}
                  activeOpacity={0.85}
                >
                  <View style={styles.storyRing}>
                    <Image source={{ uri: item.avatar }} style={styles.storyAvatar} />
                  </View>
                  <Text style={styles.storyName} numberOfLines={1}>
                    {item.userName}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        }
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
      <Modal visible={isStoryVisible} transparent animationType="fade" onRequestClose={handleCloseStory}>
        <Pressable style={styles.storyOverlay} onPress={handleCloseStory}>
          <Pressable style={styles.storyCard} onPress={event => event.stopPropagation()}>
            <Image source={{ uri: activeStory?.image }} style={styles.storyImage} />
            <View style={styles.storyHeader}>
              <Image source={{ uri: activeStory?.avatar }} style={styles.storyHeaderAvatar} />
              <Text style={styles.storyHeaderName}>{activeStory?.userName}</Text>
            </View>
            <View style={styles.storyFooter}>
              <Text style={styles.storyText}>{activeStory?.text}</Text>
              <View style={styles.storyFooterActions}>
                <TouchableOpacity
                  style={[
                    styles.storyLikeButton,
                    activeStory && storyLikes[activeStory.id] && styles.storyLikeButtonActive,
                  ]}
                  onPress={() => activeStory && toggleStoryLike(activeStory.id)}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={activeStory && storyLikes[activeStory.id] ? 'heart' : 'heart-outline'}
                    size={22}
                    color={activeStory && storyLikes[activeStory.id] ? '#FF2D55' : '#F8FAFC'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.storyDetailsButton}
                  onPress={() => activeStory && handleOpenStoryDetails(activeStory)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="information-circle-outline" size={22} color="#F8FAFC" />
                  <Text style={styles.storyDetailsLabel}>Подробнее о локации</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#edf0f5', paddingHorizontal: 10, paddingTop: '9%' },
  listContent: {
    paddingBottom: 200,
    paddingTop: 20,
  },
  storiesSection: {
    marginBottom: 24,
    gap: 16,
  },
  storiesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    paddingHorizontal: 4,
  },
  storiesList: {
    gap: 16,
    paddingHorizontal: 4,
  },
  storyItem: {
    width: 74,
    alignItems: 'center',
    gap: 8,
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  storyAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  storyName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1e293b',
    textAlign: 'center',
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
  storyOverlay: {
    flex: 1,
    backgroundColor: 'rgba(12, 15, 26, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  storyCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  storyImage: {
    width: '100%',
    height: 420,
  },
  storyHeader: {
    position: 'absolute',
    top: 18,
    left: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  storyHeaderAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  storyHeaderName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  storyFooter: {
    padding: 20,
    gap: 18,
    backgroundColor: '#111827',
  },
  storyText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#E2E8F0',
  },
  storyFooterActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  storyLikeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  storyLikeButtonActive: {
    backgroundColor: 'rgba(255,45,85,0.16)',
  },
  storyDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  storyDetailsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
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
