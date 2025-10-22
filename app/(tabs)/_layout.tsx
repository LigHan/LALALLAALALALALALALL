import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Tabs, useRouter } from 'expo-router';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ROUTE_ICONS: Record<
  string,
  { focused: ComponentProps<typeof Ionicons>['name']; default: ComponentProps<typeof Ionicons>['name'] }
> = {
  index: { focused: 'home', default: 'home-outline' },
  nearby: { focused: 'location', default: 'location-outline' },
  profile: { focused: 'person', default: 'person-outline' },
};

const QUICK_ACTIONS: Array<{
  routeName: string;
  label: string;
  iconFocused: ComponentProps<typeof Ionicons>['name'];
  iconDefault: ComponentProps<typeof Ionicons>['name'];
  variation?: 'primary';
}> = [
  { routeName: 'map', label: 'Карта', iconFocused: 'map', iconDefault: 'map-outline' },
  { routeName: 'search', label: 'Поиск места', iconFocused: 'search', iconDefault: 'search-outline', variation: 'primary' },
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
      <Tabs.Screen name="map" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="nearby" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const quickActionNames = new Set(QUICK_ACTIONS.map(action => action.routeName));
  const primaryRoutes = state.routes.filter(route => !quickActionNames.has(route.name));
  const splitIndex = Math.ceil(primaryRoutes.length / 2);
  const leftRoutes = primaryRoutes.slice(0, splitIndex);
  const rightRoutes = primaryRoutes.slice(splitIndex);

  const renderTabIcon = (routeName: string, routeKey: string) => {
    const routeIndex = state.routes.findIndex(route => route.key === routeKey);
    const isFocused = state.index === routeIndex;
    const icons = ROUTE_ICONS[routeName] ?? { focused: 'ellipse', default: 'ellipse-outline' };
    const iconName = isFocused ? icons.focused : icons.default;
    const color = isFocused ? '#007AFF' : '#9E9E9E';

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: routeKey,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(routeName as never);
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: routeKey,
      });
    };

    return (
      <TouchableOpacity
        key={routeKey}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={descriptors[routeKey]?.options.tabBarAccessibilityLabel}
        onPress={onPress}
        onLongPress={onLongPress}
        style={[styles.iconButton, isFocused && styles.iconButtonActive]}
      >
        <Ionicons name={iconName} size={24} color={color} />
      </TouchableOpacity>
    );
  };

  const renderQuickAction = ({
    routeName,
    label,
    iconFocused,
    iconDefault,
    variation,
  }: typeof QUICK_ACTIONS[number]) => {
    const route = state.routes.find(r => r.name === routeName);
    if (!route) {
      return null;
    }
    const routeIndex = state.routes.findIndex(r => r.key === route.key);
    const isFocused = state.index === routeIndex;
    const iconName = isFocused ? iconFocused : iconDefault;
    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(routeName as never);
      }
    };

    return (
      <TouchableOpacity key={routeName} style={styles.quickActionButton} onPress={onPress} activeOpacity={0.9}>
        <View style={[styles.quickActionPill, variation === 'primary' && styles.primaryQuickAction]}>
          <View style={styles.quickActionIconContainer}>
            <Ionicons name={iconName} size={18} color={variation === 'primary' ? '#fff' : '#1c1c1e'} />
          </View>
          <Text
            style={[
              styles.quickActionLabel,
              variation === 'primary' ? styles.quickActionLabelPrimary : styles.quickActionLabelSecondary,
            ]}
          >
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.islandShadow}>
        <BlurView intensity={70} tint="light" style={styles.islandBlur}>
          <View style={styles.islandOverlay} />
          <View style={styles.islandContent}>
            <View style={styles.iconGroup}>{leftRoutes.map(route => renderTabIcon(route.name, route.key))}</View>
          <View style={styles.centerActions}>
            <TouchableOpacity
              style={styles.searchPlaceholder}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('search' as never)}
            >
              <Ionicons name="search" size={18} color="#1c1c1e" />
            </TouchableOpacity>
          </View>
            <TouchableOpacity
              style={styles.profileShortcut}
              activeOpacity={0.85}
              onPress={() => {
                const isGuest = !(globalThis as { __CITY_GUIDE_USER__?: unknown }).__CITY_GUIDE_USER__;
                if (isGuest) {
                  router.push('/login');
                } else {
                  navigation.navigate('profile' as never);
                }
              }}
            >
              <Ionicons name="person-circle" size={26} color="#fff" />
            </TouchableOpacity>
            <View style={styles.iconGroup}>{rightRoutes.map(route => renderTabIcon(route.name, route.key))}</View>
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
    gap: 12,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  centerActions: {
    flex: 1,
    flexDirection: 'row',
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
  quickActions: {
    display: 'none',
  },
  searchPlaceholder: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(12,23,42,0.12)',
  },
  searchPlaceholderText: {
    fontSize: 13,
    color: '#1c1c1e',
  },
  profileShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 122, 255, 0.65)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  profileShortcutLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  primaryQuickAction: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 28,
  },
  quickActionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionLabelPrimary: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionLabelSecondary: {
    color: '#1c1c1e',
  },
});
