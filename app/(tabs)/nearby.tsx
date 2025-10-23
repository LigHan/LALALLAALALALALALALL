import { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Mock данные для мест рядом
const NEARBY_PLACES = [
  {
    id: '1',
    categoryId: 'park',
    name: 'Парк Горького',
    category: 'Парк',
    address: 'ул. Крымский Вал, 9',
    rating: 4.7,
    reviews: 1243,
    image: 'https://picsum.photos/300/200?park1',
    isOpen: true,
    distance: '0.8 км',
    features: ['wi-fi', 'парковка', 'еда'],
    description: 'Крупнейший парк культуры и отдыха в центре Москвы с красивыми аллеями, фонтанами и разнообразными развлечениями.',
    phone: '+7 (495) 995-00-00',
    website: 'park-gorkogo.com',
    coordinates: { latitude: 55.7289, longitude: 37.6014 }
  },
  {
    id: '2',
    categoryId: 'cafe',
    name: 'Кофейня "Уют"',
    category: 'Кафе',
    address: 'ул. Арбат, 25',
    rating: 4.5,
    reviews: 892,
    image: 'https://picsum.photos/300/200?coffee1',
    isOpen: true,
    distance: '1.2 км',
    features: ['wi-fi', 'с собой', 'завтраки'],
    description: 'Уютная кофейня с авторским кофе и свежей выпечкой. Идеальное место для работы и встреч.',
    phone: '+7 (495) 123-45-67',
    website: 'cozy-cafe.ru',
    coordinates: { latitude: 55.7495, longitude: 37.5924 }
  },
  {
    id: '3',
    categoryId: 'museum',
    name: 'Музей современного искусства',
    category: 'Музей',
    address: 'ул. Петровка, 25',
    rating: 4.8,
    reviews: 567,
    image: 'https://picsum.photos/300/200?museum1',
    isOpen: false,
    distance: '2.1 км',
    features: ['экскурсии', 'магазин'],
    description: 'Коллекция современного искусства российских и зарубежных художников. Регулярные выставки и мероприятия.',
    phone: '+7 (495) 234-56-78',
    website: 'modern-art-museum.ru',
    coordinates: { latitude: 55.7649, longitude: 37.6146 }
  },
  {
    id: '4',
    categoryId: 'shop',
    name: 'Торговый центр "Европейский"',
    category: 'Шоппинг',
    address: 'пл. Киевского Вокзала, 2',
    rating: 4.3,
    reviews: 2341,
    image: 'https://picsum.photos/300/200?mall1',
    isOpen: true,
    distance: '3.5 км',
    features: ['парковка', 'фуд-корт', 'кино'],
    description: 'Крупный торговый центр с брендовыми магазинами, кинотеатром и фуд-кортом.',
    phone: '+7 (495) 777-77-77',
    website: 'evropeisky.ru',
    coordinates: { latitude: 55.7424, longitude: 37.5676 }
  },
  {
    id: '5',
    categoryId: 'restaurant',
    name: 'Ресторан "Белый лебедь"',
    category: 'Ресторан',
    address: 'ул. Тверская, 15',
    rating: 4.9,
    reviews: 678,
    image: 'https://picsum.photos/300/200?restaurant1',
    isOpen: true,
    distance: '0.5 км',
    features: ['высокая кухня', 'винный бар', 'терраса'],
    description: 'Элегантный ресторан европейской кухни с террасой и изысканной винной картой.',
    phone: '+7 (495) 888-88-88',
    website: 'white-swan.ru',
    coordinates: { latitude: 55.7610, longitude: 37.6075 }
  },
];

const CATEGORY_FILTERS = [
  { id: 'all', name: 'Все', icon: 'apps' },
  { id: 'cafe', name: 'Кафе', icon: 'cafe' },
  { id: 'park', name: 'Парки', icon: 'leaf' },
  { id: 'museum', name: 'Музеи', icon: 'school' },
  { id: 'shop', name: 'Магазины', icon: 'cart' },
  { id: 'restaurant', name: 'Рестораны', icon: 'restaurant' },
];

export default function NearbyScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  const animateSelection = () => {
    LayoutAnimation.configureNext({
      duration: 220,
      create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
      delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    });
  };

  const filteredPlaces =
    selectedCategory === 'all'
      ? NEARBY_PLACES
      : NEARBY_PLACES.filter(place => place.categoryId === selectedCategory);

  const handleCategorySelect = (categoryId: string) => {
    animateSelection();
    setSelectedCategory(categoryId);
    setSelectedPlace(null);
  };

  const handlePlaceSelect = (placeId: string) => {
    animateSelection();
    setSelectedPlace(prev => (prev === placeId ? null : placeId));
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleOpenWebsite = (website: string) => {
    Linking.openURL(`https://${website}`);
  };

  const handleOpenMap = (place: typeof NEARBY_PLACES[0]) => {
    const url = `https://maps.google.com/?q=${encodeURIComponent(place.address)}`;
    Linking.openURL(url);
  };

  const renderPlaceItem = ({ item }: { item: typeof NEARBY_PLACES[0] }) => (
    <TouchableOpacity 
      style={[
        styles.placeCard,
        selectedPlace === item.id && styles.placeCardSelected
      ]}
      activeOpacity={0.9}
      onPress={() => handlePlaceSelect(item.id)}
    >
      <Image source={{ uri: item.image }} style={styles.placeImage} />
      
      <View style={styles.placeInfo}>
        <View style={styles.placeHeader}>
          <View style={styles.placeTitleContainer}>
            <ThemedText type="defaultSemiBold" style={styles.placeName}>
              {item.name}
            </ThemedText>
            <View style={styles.distanceBadge}>
              <Ionicons name="location-outline" size={12} color="#8E8E93" />
              <ThemedText style={styles.distanceText}>{item.distance}</ThemedText>
            </View>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <ThemedText style={styles.rating}>{item.rating}</ThemedText>
            <ThemedText style={styles.reviews}>({item.reviews})</ThemedText>
          </View>
        </View>
        
        <ThemedText style={styles.placeCategory}>{item.category}</ThemedText>
        <ThemedText style={styles.placeAddress}>{item.address}</ThemedText>
        
        <View style={styles.placeFooter}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.isOpen ? '#4CD964' : '#FF3B30' }
          ]}>
            <ThemedText style={styles.statusText}>
              {item.isOpen ? 'Открыто' : 'Закрыто'}
            </ThemedText>
          </View>
        </View>

        {/* Особенности места */}
        <View style={styles.featuresContainer}>
          {item.features.map(feature => (
            <View key={`${item.id}-${feature}`} style={styles.featureTag}>
              <ThemedText style={styles.featureText}>
                #{feature.replace(/\s+/g, '').toLowerCase()}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Детальная информация (показывается при выборе) */}
        {selectedPlace === item.id && (
          <View style={styles.detailsContainer}>
            <ThemedText style={styles.description}>{item.description}</ThemedText>
            
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#007AFF' }]}
                onPress={() => handleOpenMap(item)}
              >
                <Ionicons name="navigate" size={18} color="#fff" />
                <ThemedText style={styles.actionButtonText}>Маршрут</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#4CD964' }]}
                onPress={() => handleCall(item.phone)}
              >
                <Ionicons name="call" size={18} color="#fff" />
                <ThemedText style={styles.actionButtonText}>Позвонить</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#5856D6' }]}
                onPress={() => handleOpenWebsite(item.website)}
              >
                <Ionicons name="globe" size={18} color="#fff" />
                <ThemedText style={styles.actionButtonText}>Сайт</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Хедер */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <ThemedText type="title" style={styles.title}>
            Места рядом
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Откройте для себя интересные места вокруг
          </ThemedText>
        </View>

        {/* Фильтры по категориям */}
        <View style={styles.categoriesSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {CATEGORY_FILTERS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === item.id && styles.categoryButtonActive
                ]}
                onPress={() => handleCategorySelect(item.id)}
              >
                <Ionicons 
                  name={item.icon as any} 
                  size={18} 
                  color={selectedCategory === item.id ? '#007AFF' : '#6c6c70'}
                />
                <ThemedText style={[
                  styles.categoryText,
                  selectedCategory === item.id && styles.categoryTextActive
                ]}>
                  {item.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Список мест */}
      <FlatList
        data={filteredPlaces}
        keyExtractor={(item) => item.id}
        renderItem={renderPlaceItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.placesList}
        ListHeaderComponent={
          <ThemedText style={styles.placesCount}>
            Найдено {filteredPlaces.length} мест поблизости
          </ThemedText>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons 
              name="location-outline" 
              size={64} 
              color="#c6c6c8"
            />
            <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
              Ничего не найдено
            </ThemedText>
            <ThemedText style={styles.emptyText}>
              Попробуйте выбрать другую категорию
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 16,
    paddingTop: 60,
  },
  headerTop: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    color: '#475569',
  },
  categoriesSection: {
    marginBottom: 16,
  },
  categoriesList: {
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff',
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
  },
  categoryTextActive: {
    color: '#007AFF',
  },
  placesList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 8,
  },
  placesCount: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 16,
    color: '#475569',
  },
  placeCard: {
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOpacity: 0.12,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 16 },
    elevation: 14,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.12)',
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  placeCardSelected: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  placeImage: {
    width: '100%',
    height: 180,
  },
  placeInfo: {
    padding: 16,
  },
  placeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  placeTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  placeName: {
    fontSize: 20,
    marginBottom: 6,
    color: '#0f172a',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  reviews: {
    fontSize: 12,
    opacity: 0.7,
    color: '#475569',
  },
  placeCategory: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
    color: '#475569',
  },
  placeAddress: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
    color: '#0f172a',
  },
  placeFooter: {
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  featureTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  featureText: {
    fontSize: 12,
    color: '#1d4ed8',
    fontWeight: '600',
    textTransform: 'lowercase',
  },
  detailsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 16,
    color: '#475569',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    color: '#0f172a',
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 20,
    color: '#475569',
  },
});
