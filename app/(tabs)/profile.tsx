import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { normalizePost, posts } from '@/constants/content';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  clearUserSession,
  enrichPostsByIds,
  getUserSession,
  type UserSession,
} from '@/lib/user-session';

export default function ProfileScreen() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(getUserSession());

  useFocusEffect(
    useCallback(() => {
      const nextSession = getUserSession();
      if (!nextSession) {
        router.replace('/login');
        return;
      }
      setSession(nextSession);
    }, [router])
  );

  const sessionHandle = session?.handle ?? '';
  const isCompany = session?.accountType === 'company';

  const favorites = useMemo(
    () => enrichPostsByIds(session?.favorites ?? [], posts),
    [session]
  );
  const liked = useMemo(
    () => enrichPostsByIds(session?.liked ?? [], posts),
    [session]
  );
  const companyPosts = useMemo(
    () =>
      isCompany
        ? posts
            .filter(post => post.userHandle === sessionHandle)
            .map(normalizePost)
        : [],
    [isCompany, sessionHandle]
  );
  const companyFollowers = companyPosts[0]?.followers ?? 0;
  const companyTotalLikes = companyPosts.reduce((sum, post) => sum + post.totalLikes, 0);
  const companyRecentLikes = companyPosts.reduce((sum, post) => sum + post.likes, 0);
  const companyReviews = useMemo(
    () =>
      isCompany
        ? companyPosts.flatMap(post =>
            post.reviews.map(review => ({
              ...review,
              postId: post.id,
              place: post.place,
            }))
          )
        : [],
    [companyPosts, isCompany]
  );

  const headerStats = useMemo(() => {
    if (isCompany) {
      return [
        { label: 'Постов', value: formatNumber(companyPosts.length) },
        { label: 'Лайков', value: formatNumber(companyTotalLikes) },
        { label: 'Подписчиков', value: formatNumber(companyFollowers) },
      ];
    }

    const followingCount = session?.following?.length ?? 0;

    return [
      { label: 'Избранное', value: formatNumber(favorites.length) },
      { label: 'Понравилось', value: formatNumber(liked.length) },
      { label: 'Отслеживает', value: formatNumber(followingCount) },
    ];
  }, [companyFollowers, companyPosts.length, companyTotalLikes, favorites.length, isCompany, liked.length, session?.following?.length]);

  const handleOpenCompany = (id: string) => {
    router.push({ pathname: '/company/[id]', params: { id } });
  };

  const handleUploadPost = () => {
    Alert.alert('Выложить пост', 'Скоро здесь появится форма публикации поста для вашей компании.');
  };

  const handlePublishHighlight = () => {
    Alert.alert('Выложить новинку', 'Скоро вы сможете делиться новинками и акциями напрямую с подписчиками.');
  };

  const handleLogout = () => {
    clearUserSession();
    setSession(null);
    router.replace('/login');
  };

  if (!session) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerCard}>
          <Image source={{ uri: session.avatar }} style={styles.avatar} />
          <ThemedText type="title" style={styles.displayName}>
            {session.name}
          </ThemedText>
          <Text style={styles.handle}>@{session.handle}</Text>
          <View style={styles.accountTag}>
            <Ionicons name={session.accountType === 'company' ? 'business' : 'person'} size={16} color="#2563eb" />
            <Text style={styles.accountTagText}>
              {session.accountType === 'company' ? 'Аккаунт компании' : 'Личный аккаунт'}
            </Text>
          </View>
          <View style={styles.statsRow}>
            {headerStats.map(stat => (
              <View key={stat.label} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
          {isCompany && (
            <Text style={styles.subStatNote}>
              {`+${formatNumber(companyRecentLikes)} лайков на последних постах`}
            </Text>
          )}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
            <Ionicons name="log-out-outline" size={18} color="#ef4444" />
            <Text style={styles.logoutText}>Выйти из аккаунта</Text>
          </TouchableOpacity>
        </View>

        {isCompany ? (
          <>
            <View style={styles.companyActions}>
              <TouchableOpacity style={styles.companyActionPrimary} onPress={handleUploadPost} activeOpacity={0.85}>
                <Ionicons name="cloud-upload-outline" size={18} color="#f8fafc" />
                <Text style={styles.companyActionPrimaryText}>Выложить пост</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.companyActionSecondary} onPress={handlePublishHighlight} activeOpacity={0.85}>
                <Ionicons name="sparkles-outline" size={18} color="#2563eb" />
                <Text style={styles.companyActionSecondaryText}>Выложить новинку</Text>
              </TouchableOpacity>
            </View>

            <ProfileSection
              title="Мои публикации"
              subtitle={`${companyPosts.length} постов`}
              emptyText="Создайте первый пост, чтобы рассказать о своих новостях."
              isEmpty={companyPosts.length === 0}
            >
              {companyPosts.length > 0 ? (
                <HorizontalCollection
                  items={companyPosts.map(item => ({
                    id: item.id,
                    title: item.place,
                    subtitle: item.tags.join(' • '),
                    image: item.image,
                  }))}
                  onPress={handleOpenCompany}
                />
              ) : null}
            </ProfileSection>

            <ProfileSection
              title="Отзывы посетителей"
              subtitle={`${companyReviews.length} отзывов`}
              emptyText="Публикуйте посты и делитесь новинками, чтобы собирать отзывы."
              isEmpty={companyReviews.length === 0}
            >
              <View style={styles.companyReviewsList}>
                {companyReviews.map(review => (
                  <TouchableOpacity
                    key={`${review.postId}-${review.id}`}
                    style={styles.companyReviewCard}
                    activeOpacity={0.85}
                    onPress={() => handleOpenCompany(review.postId)}
                  >
                    <View style={styles.companyReviewHeader}>
                      <Ionicons name="person-circle-outline" size={20} color="#2563eb" />
                      <View style={styles.companyReviewMeta}>
                        <Text style={styles.companyReviewAuthor}>{review.author}</Text>
                        <Text style={styles.companyReviewPlace}>{review.place}</Text>
                      </View>
                      <View style={styles.companyReviewRating}>
                        <Ionicons name="star" size={14} color="#f59e0b" />
                        <Text style={styles.companyReviewRatingText}>{review.rating.toFixed(1)}</Text>
                      </View>
                    </View>
                    <Text style={styles.companyReviewComment}>{review.comment}</Text>
                    <Text style={styles.companyReviewDate}>{review.date}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ProfileSection>
          </>
        ) : (
          <>
            <ProfileSection
              title="Избранное"
              subtitle={`${favorites.length} мест`}
              emptyText="Сохраняйте интересные места, чтобы быстро возвращаться к ним."
              isEmpty={favorites.length === 0}
            >
              {favorites.length > 0 ? (
                <HorizontalCollection
                  items={favorites.map(item => ({
                    id: item.id,
                    title: item.place,
                    subtitle: item.user,
                    image: item.image,
                  }))}
                  onPress={handleOpenCompany}
                />
              ) : null}
            </ProfileSection>

            <ProfileSection
              title="Понравилось"
              subtitle={`${liked.length} мест`}
              emptyText="Отмечайте понравившиеся локации, чтобы они не потерялись."
              isEmpty={liked.length === 0}
            >
              {liked.length > 0 ? (
                <HorizontalCollection
                  items={liked.map(item => ({
                    id: item.id,
                    title: item.place,
                    subtitle: item.user,
                    image: item.gallery[0] ?? item.image,
                  }))}
                  onPress={handleOpenCompany}
                />
              ) : null}
            </ProfileSection>

            <ProfileSection
              title="Отслеживаемые места"
              subtitle={`${session.following.length} подписок`}
              emptyText="Подписывайтесь на места, чтобы следить за обновлениями."
              isEmpty={session.following.length === 0}
            >
              {session.following.length > 0 ? (
                <View style={styles.followingList}>
                  {session.following.map(place => (
                    <TouchableOpacity
                      key={place.id}
                      style={styles.followingCard}
                      activeOpacity={0.85}
                      onPress={() => handleOpenCompany(place.id)}
                    >
                      <Image source={{ uri: place.avatar }} style={styles.followingAvatar} />
                      <View style={styles.followingInfo}>
                        <Text style={styles.followingName}>{place.name}</Text>
                        <Text style={styles.followingHandle}>@{place.handle}</Text>
                        <Text style={styles.followingDescription} numberOfLines={2}>
                          {place.description}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
            </ProfileSection>
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

type HorizontalItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
};

function HorizontalCollection({
  items,
  onPress,
}: {
  items: HorizontalItem[];
  onPress: (id: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalList}
    >
      {items.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.collectionCard}
          activeOpacity={0.85}
          onPress={() => onPress(item.id)}
        >
          <Image source={{ uri: item.image }} style={styles.collectionImage} />
          <Text style={styles.collectionTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.collectionSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function ProfileSection({
  title,
  subtitle,
  children,
  emptyText,
  isEmpty,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  emptyText: string;
  isEmpty: boolean;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          {title}
        </ThemedText>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>
      {isEmpty ? <Text style={styles.emptyStateText}>{emptyText}</Text> : children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  scroll: {
    padding: 20,
    gap: 24,
  },
  headerCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 24,
    gap: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 18 },
    elevation: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  displayName: {
    color: '#0f172a',
  },
  handle: {
    fontSize: 14,
    color: '#64748b',
  },
  accountTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  accountTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  subStatNote: {
    fontSize: 12,
    color: '#94a3b8',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    marginTop: 8,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ef4444',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    gap: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#0f172a',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  horizontalList: {
    gap: 16,
  },
  collectionCard: {
    width: 180,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  collectionImage: {
    width: '100%',
    height: 110,
  },
  collectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  collectionSubtitle: {
    fontSize: 13,
    color: '#64748b',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  followingList: {
    gap: 12,
  },
  followingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    padding: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  followingAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  followingInfo: {
    flex: 1,
    gap: 4,
  },
  followingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  followingHandle: {
    fontSize: 13,
    color: '#64748b',
    textTransform: 'lowercase',
  },
  followingDescription: {
    fontSize: 13,
    color: '#475569',
  },
  companyActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companyActionPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  companyActionPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
  },
  companyActionSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  companyActionSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  companyReviewsList: {
    gap: 12,
  },
  companyReviewCard: {
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    padding: 16,
    gap: 10,
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  companyReviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  companyReviewMeta: {
    flex: 1,
  },
  companyReviewAuthor: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  companyReviewPlace: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },
  companyReviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  companyReviewRatingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#b45309',
  },
  companyReviewComment: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
  },
  companyReviewDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
});

function formatNumber(value: number) {
  return value.toLocaleString('ru-RU');
}
