import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  FlatList,
  GestureResponderEvent,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { posts as sourcePosts, stories, type Post, type Story } from '@/constants/content';
import { triggerMapSearch } from '@/lib/map-search';

export default function FeedScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(sourcePosts);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [isScheduleVisible, setScheduleVisible] = useState(false);
  const [reviewsPost, setReviewsPost] = useState<Post | null>(null);
  const [isReviewsVisible, setReviewsVisible] = useState(false);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isStoryVisible, setStoryVisible] = useState(false);
  const [storyLikes, setStoryLikes] = useState<Record<string, boolean>>({});
  const [detailPost, setDetailPost] = useState<Post | null>(null);
  const [isDetailVisible, setDetailVisible] = useState(false);

  const handleLike = (id: string) => {
    setPosts(prev =>
      prev.map(p => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };
  const handleFavorite = (id: string) => {
    // TODO: persist favorites or show feedback
    console.log(`favorite ${id}`);
  };
  const handleOpenMap = (post: Post) => {
    router.push('/map');
    triggerMapSearch(post.address);
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
  const handleOpenProfile = (post: Post) => {
    router.push({ pathname: '/company/[id]', params: { id: post.id } });
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
      setDetailPost(relatedPost);
      setDetailVisible(true);
    }
  };
  const toggleStoryLike = (storyId: string) => {
    setStoryLikes(prev => ({
      ...prev,
      [storyId]: !prev[storyId],
    }));
  };
  const handleOpenDetail = (post: Post) => {
    setDetailPost(post);
    setDetailVisible(true);
  };
  const handleCloseDetail = () => {
    setDetailVisible(false);
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

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (!isDetailVisible && detailPost) {
      timeout = setTimeout(() => setDetailPost(null), 220);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isDetailVisible, detailPost]);

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
          <TouchableOpacity
            activeOpacity={0.92}
            style={styles.post}
            onPress={() => handleOpenDetail(item)}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <View style={styles.authorRow}>
                <TouchableOpacity onPress={() => handleOpenProfile(item)} activeOpacity={0.8}>
                  <Image source={{ uri: item.userAvatar }} style={styles.authorAvatar} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.authorDetails}
                  onPress={() => handleOpenProfile(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.authorName}>{item.user}</Text>
                  <Text style={styles.authorHandle}>@{item.userHandle}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.placeRow}>
                <Text style={styles.place}>{item.place}</Text>
                <TouchableOpacity
                  style={styles.ratingBadge}
                  onPress={(event: GestureResponderEvent) => {
                    event.stopPropagation();
                    handleOpenReviews(item);
                  }}
                  activeOpacity={0.85}
                >
                  <Ionicons name="star" size={16} color="#FFB800" />
                  <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.userCaption}>от {item.user}</Text>
              <TouchableOpacity
                style={styles.addressRow}
                onPress={(event: GestureResponderEvent) => {
                  event.stopPropagation();
                  handleOpenMap(item);
                }}
                activeOpacity={0.85}
              >
                <Ionicons name="location-outline" size={16} color="#2563eb" />
                <Text style={styles.addressText}>{item.address}</Text>
              </TouchableOpacity>
              <View style={styles.tagRow}>
                {item.tags.map(tag => (
                  <View key={`${item.id}-${tag}`} style={styles.tagChip}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.actions}>
              <View style={styles.actionGroup}>
                <TouchableOpacity
                  onPress={(event: GestureResponderEvent) => {
                    event.stopPropagation();
                    handleLike(item.id);
                  }}
                  style={styles.likeBtn}
                >
                  <Ionicons name="heart-outline" size={24} color="#FF2D55" />
                  <Text style={styles.likeCount}>{item.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={(event: GestureResponderEvent) => {
                    event.stopPropagation();
                    handleOpenMap(item);
                  }}
                  style={styles.actionButton}
                >
                  <Ionicons name="map-outline" size={24} color="#1C1C1E" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={(event: GestureResponderEvent) => {
                    event.stopPropagation();
                    handleDownload(item.id);
                  }}
                  style={styles.actionButton}
                >
                  <Ionicons name="download-outline" size={24} color="#1C1C1E" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={(event: GestureResponderEvent) => {
                  event.stopPropagation();
                  handleFavorite(item.id);
                }}
                style={[styles.actionButton, styles.favoriteButton]}
              >
                <Ionicons name="bookmark-outline" size={24} color="#1C1C1E" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
      <Modal visible={isDetailVisible} transparent animationType="fade" onRequestClose={handleCloseDetail}>
        <Pressable style={styles.detailOverlay} onPress={handleCloseDetail}>
          {detailPost && (
            <Pressable style={styles.detailCard} onPress={event => event.stopPropagation()}>
              <Image source={{ uri: detailPost.image }} style={styles.detailImage} />
              <View style={styles.detailContent}>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailTitle}>{detailPost.place}</Text>
                  <View style={styles.detailRating}>
                    <Ionicons name="star" size={18} color="#FFB800" />
                    <Text style={styles.detailRatingText}>{detailPost.rating.toFixed(1)}</Text>
                  </View>
                </View>
                <Text style={styles.detailSubtitle}>Гид по локации</Text>
                <View style={styles.detailTags}>
                  {detailPost.tags.map(tag => (
                    <View key={`${detailPost.id}-detail-${tag}`} style={styles.detailTagChip}>
                      <Text style={styles.detailTagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.detailDescription}>
                  {detailPost.reviews[0]?.comment ??
                    'Здесь вы найдете лучшие впечатления города: маршруты, атмосферные пространства и события рядом.'}
                </Text>
                <TouchableOpacity
                  style={styles.detailAddressRow}
                  activeOpacity={0.85}
                  onPress={() => {
                    if (!detailPost) {
                      return;
                    }
                    setDetailVisible(false);
                    handleOpenMap(detailPost);
                  }}
                >
                  <Ionicons name="location-outline" size={18} color="#2563eb" />
                  <Text style={styles.detailAddressText}>{detailPost.address}</Text>
                </TouchableOpacity>
                <View style={styles.detailMetaRow}>
                  <TouchableOpacity
                    style={styles.detailMeta}
                    activeOpacity={0.85}
                    onPress={() => {
                      if (!detailPost) {
                        return;
                      }
                      setDetailVisible(false);
                      handleOpenHours(detailPost);
                    }}
                  >
                    <Ionicons name="time-outline" size={18} color="#1e293b" />
                    <Text style={styles.detailMetaText}>
                      {detailPost.workingHours[0]?.value ?? 'Нет данных'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.detailMeta}
                    activeOpacity={0.85}
                    onPress={() => {
                      if (!detailPost) {
                        return;
                      }
                      setDetailVisible(false);
                      handleOpenMap(detailPost);
                    }}
                  >
                    <Ionicons name="map-outline" size={18} color="#1e293b" />
                    <Text style={styles.detailMetaText}>На карте</Text>
                  </TouchableOpacity>
                  <View style={styles.detailMeta}>
                    <Ionicons name="heart-outline" size={18} color="#FF2D55" />
                    <Text style={styles.detailMetaText}>{`${detailPost.likes} отметок`}</Text>
                  </View>
                </View>
              </View>
                <View style={styles.detailUserBar}>
                  <TouchableOpacity
                    style={styles.detailUserInfo}
                    activeOpacity={0.85}
                    onPress={() => handleOpenProfile(detailPost)}
                  >
                    <Image source={{ uri: detailPost.userAvatar }} style={styles.detailUserAvatar} />
                    <View style={styles.detailUserText}>
                      <Text style={styles.detailUserName}>{detailPost.user}</Text>
                      <Text style={styles.detailUserCaption}>Автор публикации</Text>
                    </View>
                  </TouchableOpacity>
                </View>
            </Pressable>
          )}
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', paddingHorizontal: 10, paddingTop: '9%' },
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
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  authorHandle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
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
  userCaption: { color: '#777', marginTop: 4 },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  addressText: {
    fontSize: 14,
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1d4ed8',
  },
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
  detailOverlay: {
    flex: 1,
    backgroundColor: 'rgba(12, 15, 26, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  detailCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
    shadowColor: '#0f172a',
    shadowOpacity: 0.24,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 18 },
    elevation: 20,
  },
  detailImage: {
    width: '100%',
    height: 260,
  },
  detailContent: {
    paddingHorizontal: 24,
    paddingVertical: 22,
    gap: 14,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  detailRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 184, 0, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  detailRatingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400e',
  },
  detailSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: '#475569',
    textTransform: 'uppercase',
  },
  detailTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailTagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  detailTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  detailDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1f2937',
  },
  detailAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  detailAddressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  detailMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    flexWrap: 'wrap',
  },
  detailMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  detailMetaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  detailUserBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#e2e8f0',
  },
  detailUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  detailUserAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  detailUserText: {
    gap: 4,
  },
  detailUserName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  detailUserCaption: {
    fontSize: 13,
    color: '#475569',
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
