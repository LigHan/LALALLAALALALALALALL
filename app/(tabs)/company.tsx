import { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function CompanyScreen() {
  const colorScheme = useColorScheme();
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: 'Кофейня "Уютный уголок"',
    category: 'Кафе и рестораны',
    description: 'Уютная кофейня в центре города с лучшим кофе и домашней выпечкой. Идеальное место для встреч с друзьями и работы.',
    address: 'ул. Центральная, 15',
    phone: '+7 (912) 345-67-90',
    website: 'www.cozycorner.ru',
    email: 'info@cozycorner.ru',
    hours: 'Пн-Вс: 8:00 - 23:00',
  });

  const stats = [
    { label: 'Отзывы', value: '156', icon: 'chatbubble-outline' },
    { label: 'Рейтинг', value: '4.8', icon: 'star-outline' },
    { label: 'Фото', value: '89', icon: 'camera-outline' },
  ];

  const amenities = [
    { name: 'Wi-Fi', icon: 'wifi' },
    { name: 'Карта', icon: 'card-outline' },
    { name: 'Веранда', icon: 'home-outline' },
    { name: 'Парковка', icon: 'car-outline' },
  ];

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Успех', 'Информация о компании обновлена');
  };

  const handleCall = () => {
    Linking.openURL(`tel:${companyData.phone}`);
  };

  const handleOpenWebsite = () => {
    Linking.openURL(`https://${companyData.website}`);
  };

  const handleOpenMap = () => {
    const url = `https://maps.google.com/?q=${encodeURIComponent(companyData.address)}`;
    Linking.openURL(url);
  };

  const isDark = colorScheme === 'dark';

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Хедер компании */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://picsum.photos/400/200?company' }}
            style={styles.coverImage}
          />
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://picsum.photos/100/100?logo' }}
              style={styles.logo}
            />
          </View>
        </View>

        {/* Основная информация */}
        <View style={styles.mainInfo}>
          <View style={styles.titleSection}>
            {isEditing ? (
              <TextInput
                style={[
                  styles.companyNameInput,
                  { color: isDark ? '#fff' : '#000' }
                ]}
                value={companyData.name}
                onChangeText={(text) => setCompanyData({...companyData, name: text})}
                placeholder="Название компании"
                placeholderTextColor="#999"
              />
            ) : (
              <ThemedText type="title" style={styles.companyName}>
                {companyData.name}
              </ThemedText>
            )}
            <ThemedText style={styles.category}>{companyData.category}</ThemedText>
          </View>

          {/* Статистика */}
          <View style={[
            styles.statsContainer,
            { backgroundColor: isDark ? '#1c1c1e' : '#f8f9fa' }
          ]}>
            {stats.map((stat, index) => (
              <View key={stat.label} style={styles.statItem}>
                <Ionicons name={stat.icon as any} size={20} color="#007AFF" />
                <ThemedText type="defaultSemiBold" style={styles.statValue}>
                  {stat.value}
                </ThemedText>
                <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Описание */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            О компании
          </ThemedText>
          {isEditing ? (
            <TextInput
              style={[
                styles.descriptionInput,
                { 
                  color: isDark ? '#fff' : '#000',
                  backgroundColor: isDark ? '#2c2c2e' : '#fff'
                }
              ]}
              value={companyData.description}
              onChangeText={(text) => setCompanyData({...companyData, description: text})}
              placeholder="Опишите вашу компанию..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          ) : (
            <ThemedText style={styles.description}>{companyData.description}</ThemedText>
          )}
        </View>

        {/* Удобства */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Удобства
          </ThemedText>
          <View style={styles.amenitiesGrid}>
            {amenities.map((amenity) => (
              <View key={amenity.name} style={styles.amenityItem}>
                <Ionicons name={amenity.icon as any} size={20} color="#007AFF" />
                <ThemedText style={styles.amenityName}>{amenity.name}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Контактная информация */}
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Контакты
          </ThemedText>
          <View style={styles.contactItem}>
            <Ionicons name="location-outline" size={20} color="#007AFF" />
            <View style={styles.contactInfo}>
              <ThemedText style={styles.contactLabel}>Адрес</ThemedText>
              <ThemedText style={styles.contactText}>{companyData.address}</ThemedText>
            </View>
            <TouchableOpacity onPress={handleOpenMap}>
              <Ionicons name="navigate-outline" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.contactItem}>
            <Ionicons name="call-outline" size={20} color="#007AFF" />
            <View style={styles.contactInfo}>
              <ThemedText style={styles.contactLabel}>Телефон</ThemedText>
              <ThemedText style={styles.contactText}>{companyData.phone}</ThemedText>
            </View>
            <TouchableOpacity onPress={handleCall}>
              <Ionicons name="call" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.contactItem}>
            <Ionicons name="globe-outline" size={20} color="#007AFF" />
            <View style={styles.contactInfo}>
              <ThemedText style={styles.contactLabel}>Сайт</ThemedText>
              <ThemedText style={styles.contactText}>{companyData.website}</ThemedText>
            </View>
            <TouchableOpacity onPress={handleOpenWebsite}>
              <Ionicons name="open-outline" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.contactItem}>
            <Ionicons name="time-outline" size={20} color="#007AFF" />
            <View style={styles.contactInfo}>
              <ThemedText style={styles.contactLabel}>Часы работы</ThemedText>
              <ThemedText style={styles.contactText}>{companyData.hours}</ThemedText>
            </View>
          </View>
        </View>

        {/* Действия */}
        <View style={styles.actionsSection}>
          {isEditing ? (
            <View style={styles.editActions}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsEditing(false)}
              >
                <ThemedText style={styles.cancelButtonText}>Отмена</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <ThemedText style={styles.saveButtonText}>Сохранить</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.button, styles.editButton]}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="create-outline" size={18} color="#007AFF" />
              <ThemedText style={styles.editButtonText}>Редактировать</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    position: 'relative',
    marginBottom: 80,
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  logoContainer: {
    position: 'absolute',
    bottom: -40,
    left: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  mainInfo: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  titleSection: {
    marginBottom: 16,
  },
  companyName: {
    fontSize: 24,
    marginBottom: 4,
  },
  companyNameInput: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
    padding: 0,
  },
  category: {
    fontSize: 16,
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    opacity: 0.8,
  },
  descriptionInput: {
    fontSize: 16,
    lineHeight: 22,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  amenityName: {
    fontSize: 14,
    color: '#007AFF',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  contactText: {
    fontSize: 16,
  },
  actionsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  editButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  editButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(142, 142, 147, 0.3)',
  },
  cancelButtonText: {
    color: '#8E8E93',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
