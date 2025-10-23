import { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  Keyboard,
  Modal,
  Pressable,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Mock данные для поиска
const SEARCH_DATA = [
  {
    id: '1',
    name: 'Парк Горького',
    category: 'Парк',
    address: 'ул. Крымский Вал, 9',
    rating: 4.7,
    reviews: 1243,
    image: 'https://picsum.photos/300/200?park',
    isOpen: true,
    distance: '0.8 км',
  },
  {
    id: '2',
    name: 'Кофейня "Уют"',
    category: 'Кафе',
    address: 'ул. Арбат, 25',
    rating: 4.5,
    reviews: 892,
    image: 'https://picsum.photos/300/200?coffee',
    isOpen: true,
    distance: '1.2 км',
  },
  {
    id: '3',
    name: 'Музей современного искусства',
    category: 'Музей',
    address: 'ул. Петровка, 25',
    rating: 4.8,
    reviews: 567,
    image: 'https://picsum.photos/300/200?museum',
    isOpen: false,
    distance: '2.1 км',
  },
  {
    id: '4',
    name: 'Торговый центр "Европейский"',
    category: 'Шоппинг',
    address: 'пл. Киевского Вокзала, 2',
    rating: 4.3,
    reviews: 2341,
    image: 'https://picsum.photos/300/200?mall',
    isOpen: true,
    distance: '3.5 км',
  },
  {
    id: '5',
    name: 'Ресторан "Белый лебедь"',
    category: 'Ресторан',
    address: 'ул. Тверская, 15',
    rating: 4.9,
    reviews: 678,
    image: 'https://picsum.photos/300/200?restaurant',
    isOpen: true,
    distance: '0.5 км',
  },
];

const CATEGORIES = [
  { id: 'all', name: 'Все', icon: 'apps' },
  { id: 'cafe', name: 'Кафе', icon: 'cafe' },
  { id: 'park', name: 'Парки', icon: 'leaf' },
  { id: 'museum', name: 'Музеи', icon: 'school' },
  { id: 'shop', name: 'Магазины', icon: 'cart' },
  { id: 'restaurant', name: 'Рестораны', icon: 'restaurant' },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(SEARCH_DATA);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [activePlace, setActivePlace] = useState<typeof SEARCH_DATA[0] | null>(null);
  const [isDetailVisible, setDetailVisible] = useState(false);
  
  const searchInputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setSearchResults(SEARCH_DATA);
      setIsSearching(false);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      const filtered = SEARCH_DATA.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()) ||
        item.category.toLowerCase().includes(text.toLowerCase()) ||
        item.address.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      setSearchResults(SEARCH_DATA);
    } else {
      const filtered = SEARCH_DATA.filter(item =>
        item.category.toLowerCase().includes(
          CATEGORIES.find(cat => cat.id === categoryId)?.name.toLowerCase() || ''
        )
      );
      setSearchResults(filtered);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(SEARCH_DATA);
    setIsSearching(false);
    setSelectedCategory('all');
    Keyboard.dismiss();
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (!isDetailVisible && activePlace) {
      const timeout = setTimeout(() => setActivePlace(null), 220);
      return () => clearTimeout(timeout);
    }
  }, [isDetailVisible, activePlace]);

  const handleCloseDetails = () => {
    setDetailVisible(false);
  };

  const renderPlaceItem = ({ item }: { item: typeof SEARCH_DATA[0] }) => (
    <TouchableOpacity
      style={styles.placeCard}
      activeOpacity={0.9}
      onPress={() => {
        setActivePlace(item);
        setDetailVisible(true);
      }}
    >
      <Image source={{ uri: item.image }} style={styles.placeImage} />
      <View style={styles.placeInfo}>
        <View style={styles.placeHeader}>
          <ThemedText type="defaultSemiBold" style={styles.placeName}>
            {item.name}
          </ThemedText>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <ThemedText style={styles.rating}>{item.rating}</ThemedText>
          </View>
        </View>
        
        <ThemedText style={styles.placeCategory}>{item.category}</ThemedText>
        <ThemedText style={styles.placeAddress}>{item.address}</ThemedText>
        <View style={styles.tagRow}>
          <View style={styles.tagChip}>
            <Text style={styles.tagText}>#{item.category.toLowerCase()}</Text>
          </View>
          <View style={styles.tagChip}>
            <Text style={styles.tagText}>#{item.distance.replace(/\s+/g, '')}</Text>
          </View>
        </View>
        
        <View style={styles.placeFooter}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.isOpen ? '#4CD964' : '#FF3B30' }
          ]}>
            <ThemedText style={styles.statusText}>
              {item.isOpen ? 'Открыто' : 'Закрыто'}
            </ThemedText>
          </View>
          <View style={styles.distanceContainer}>
            <Ionicons name="location-outline" size={14} color="#8E8E93" />
            <ThemedText style={styles.distance}>{item.distance}</ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Хедер поиска */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <Ionicons 
            name="search" 
            size={20} 
            color="#8e8e93"
            style={styles.searchIcon}
          />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Поиск мест, ресторанов, мероприятий..."
            placeholderTextColor="#8e8e93"
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons 
                name="close-circle" 
                size={20}
                color="#8e8e93"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Категории */}
      <View style={styles.categoriesSection}>
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => (
            <TouchableOpacity
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
          )}
        />
      </View>

      {/* Результаты поиска */}
      <Animated.View style={[styles.resultsContainer, { opacity: fadeAnim }]}>
        <View style={styles.resultsHeader}>
          <ThemedText type="defaultSemiBold" style={styles.resultsTitle}>
            Найдено {searchResults.length} мест
          </ThemedText>
          {searchQuery.length > 0 && (
            <ThemedText style={styles.searchQueryText}>
              по запросу "{searchQuery}"
            </ThemedText>
          )}
        </View>

        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={renderPlaceItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons 
                name="search-outline" 
                size={64} 
                color="#c6c6c8"
              />
              <ThemedText type="defaultSemiBold" style={styles.emptyTitle}>
                Ничего не найдено
              </ThemedText>
              <ThemedText style={styles.emptyText}>
                Попробуйте изменить запрос или выбрать другую категорию
              </ThemedText>
            </View>
          }
        />
      </Animated.View>

      {/* Подсказка при пустом поиске */}
      {!isSearching && (
        <View style={styles.placeholderContainer}>
          <Ionicons 
            name="search" 
            size={48} 
            color="#c6c6c8"
          />
          <ThemedText type="defaultSemiBold" style={styles.placeholderTitle}>
            Найдите интересные места
          </ThemedText>
          <ThemedText style={styles.placeholderText}>
            Ищите рестораны, парки, музеи и другие места вокруг вас
          </ThemedText>
        </View>
      )}

      <Modal
        visible={isDetailVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseDetails}
      >
        <Pressable style={styles.detailOverlay} onPress={handleCloseDetails}>
          {activePlace && (
            <Pressable style={styles.detailCard} onPress={event => event.stopPropagation()}>
              <Image source={{ uri: activePlace.image }} style={styles.detailImage} />
              <View style={styles.detailContent}>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailTitle}>{activePlace.name}</Text>
                  <View style={styles.detailRating}>
                    <Ionicons name="star" size={18} color="#FFB800" />
                    <Text style={styles.detailRatingText}>{activePlace.rating.toFixed(1)}</Text>
                  </View>
                </View>
                <Text style={styles.detailSubtitle}>{activePlace.category}</Text>
                <Text style={styles.detailAddress}>{activePlace.address}</Text>
                <View style={styles.detailTagRow}>
                  <View style={styles.detailTagChip}>
                    <Text style={styles.detailTagText}>#{activePlace.category.toLowerCase()}</Text>
                  </View>
                  <View style={styles.detailTagChip}>
                    <Text style={styles.detailTagText}>
                      #{activePlace.distance.replace(/\s+/g, '')}
                    </Text>
                  </View>
                  <View style={styles.detailTagChip}>
                    <Text style={styles.detailTagText}>
                      {activePlace.isOpen ? '#open' : '#closed'}
                    </Text>
                  </View>
                </View>
                <View style={styles.detailMetaRow}>
                  <View style={styles.detailMeta}>
                    <Ionicons name="location-outline" size={18} color="#1e293b" />
                    <Text style={styles.detailMetaText}>{activePlace.distance} от вас</Text>
                  </View>
                  <View style={styles.detailMeta}>
                    <Ionicons
                      name={activePlace.isOpen ? 'checkmark-circle' : 'close-circle'}
                      size={18}
                      color={activePlace.isOpen ? '#22c55e' : '#ef4444'}
                    />
                    <Text
                      style={[
                        styles.detailMetaText,
                        activePlace.isOpen ? styles.detailMetaTextPositive : styles.detailMetaTextNegative,
                      ]}
                    >
                      {activePlace.isOpen ? 'Открыто сейчас' : 'Закрыто'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.detailActionButton} onPress={handleCloseDetails}>
                  <Text style={styles.detailActionButtonText}>Вернуться к поиску</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          )}
        </Pressable>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  searchHeader: {
    padding: 16,
    paddingTop: 60,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    color: '#0f172a',
  },
  clearButton: {
    padding: 4,
  },
  categoriesSection: {
    paddingHorizontal: 16,
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
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    marginBottom: 4,
    color: '#0f172a',
  },
  searchQueryText: {
    fontSize: 14,
    opacity: 0.7,
    color: '#475569',
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 8,
    gap: 0,
  },
  placeCard: {
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.12)',
    shadowColor: '#0f172a',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
  },
  placeImage: {
    width: '100%',
    height: 160,
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
  placeName: {
    fontSize: 18,
    flex: 1,
    marginRight: 8,
    color: '#0f172a',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  placeCategory: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
    color: '#0f172a',
  },
  placeAddress: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
    color: '#0f172a',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1d4ed8',
    textTransform: 'lowercase',
  },
  placeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 12,
    opacity: 0.7,
    color: '#475569',
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
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  placeholderTitle: {
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    color: '#0f172a',
  },
  placeholderText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 22,
    color: '#475569',
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
    maxWidth: 360,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
    shadowColor: '#0f172a',
    shadowOpacity: 0.24,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 18,
  },
  detailImage: {
    width: '100%',
    height: 240,
  },
  detailContent: {
    paddingHorizontal: 22,
    paddingVertical: 20,
    gap: 14,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
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
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  detailSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  detailAddress: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  detailTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailTagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  detailTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1d4ed8',
    textTransform: 'lowercase',
  },
  detailMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailMeta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
  },
  detailMetaText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1e293b',
  },
  detailMetaTextPositive: {
    color: '#15803d',
  },
  detailMetaTextNegative: {
    color: '#dc2626',
  },
  detailActionButton: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: '#1d4ed8',
    alignItems: 'center',
  },
  detailActionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f8fafc',
  },
});
