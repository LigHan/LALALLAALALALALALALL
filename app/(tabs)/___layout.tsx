import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Tabs, useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_CONFIG = [
  {
    name: 'index',
    label: 'Главная',
    iconFocused: 'home',
    iconDefault: 'home-outline',
    position: 'left'
  },
  {
    name: 'search',
    label: 'Поиск',
    iconFocused: 'search',
    iconDefault: 'search-outline', 
    position: 'center',
    variation: 'primary'
  },
  {
    name: 'login',
    label: 'Профиль',
    iconFocused: 'person',
    iconDefault: 'person-outline',
    position: 'right'
  },
  {
    name: 'nearby',
    label: 'Рядом',
    iconFocused: 'location',
    iconDefault: 'location-outline',
    position: 'right'
  }
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <FloatingTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="nearby" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const renderTabButton = (tab: typeof TAB_CONFIG[number]) => {
    const route = state.routes.find(r => r.name === tab.name);
    if (!route) return null;

    const routeIndex = state.routes.findIndex(r => r.key === route.key);
    const isFocused = state.index === routeIndex;
    const iconName = isFocused ? tab.iconFocused : tab.iconDefault;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        if (tab.name === 'profile') {
          const isGuest = !(globalThis as { __CITY_GUIDE_USER__?: unknown }).__CITY_GUIDE_USER__;
          if (isGuest) {
            router.push('/login');
            return;
          }
        }
        navigation.navigate(tab.name as never);
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };

    // Центральная кнопка поиска (широкая)
    if (tab.position === 'center') {
      return (
        <TouchableOpacity
          key={tab.name}
          style={[
            styles.searchButton,
            tab.variation === 'primary' && styles.primarySearchButton,
            isFocused && styles.searchButtonActive
          ]}
          onPress={onPress}
          onLongPress={onLongPress}
          activeOpacity={0.85}
        >
          <View style={styles.searchButtonContent}>
            <Ionicons 
              name={iconName} 
              size={20} 
              color={tab.variation === 'primary' ? '#fff' : '#1c1c1e'} 
            />
            <Text style={[
              styles.searchButtonText,
              tab.variation === 'primary' ? styles.searchButtonTextPrimary : styles.searchButtonTextSecondary
            ]}>
              {tab.label}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    // Обычные иконки (главная, профиль, рядом)
    return (
      <TouchableOpacity
        key={tab.name}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={descriptors[route.key]?.options.tabBarAccessibilityLabel}
        onPress={onPress}
        onLongPress={onLongPress}
        style={[styles.iconButton, isFocused && styles.iconButtonActive]}
      >
        <Ionicons 
          name={iconName} 
          size={24} 
          color={isFocused ? '#007AFF' : '#9E9E9E'} 
        />
      </TouchableOpacity>
    );
  };

  // Группируем табы по позициям
  const leftTabs = TAB_CONFIG.filter(tab => tab.position === 'left');
  const centerTabs = TAB_CONFIG.filter(tab => tab.position === 'center');
  const rightTabs = TAB_CONFIG.filter(tab => tab.position === 'right');

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.islandShadow}>
        <BlurView intensity={70} tint="light" style={styles.islandBlur}>
          <View style={styles.islandOverlay} />
          <View style={styles.islandContent}>
            {/* Левая группа: Главная */}
            <View style={styles.iconGroup}>
              {leftTabs.map(renderTabButton)}
            </View>

            {/* Центральная группа: Поиск */}
            <View style={styles.centerGroup}>
              {centerTabs.map(renderTabButton)}
            </View>

            {/* Правая группа: Профиль и Рядом */}
            <View style={styles.iconGroup}>
              {rightTabs.map(renderTabButton)}
            </View>
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'box-none',
  },
  islandShadow: {
    width: '86%',
    maxWidth: 420,
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 18 },
    elevation: 16,
  },
  islandBlur: {
    borderRadius: 40,
    overflow: 'hidden',
  },
  islandOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  islandContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  centerGroup: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 120,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(12,23,42,0.12)',
  },
  primarySearchButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  searchButtonActive: {
    backgroundColor: '#0056CC',
  },
  searchButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  searchButtonTextPrimary: {
    color: '#fff',
  },
  searchButtonTextSecondary: {
    color: '#1c1c1e',
  },
});
