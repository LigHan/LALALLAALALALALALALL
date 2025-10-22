import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const initialPosts = [
  {
    id: '1',
    user: 'Анна',
    place: 'Парк Горького',
    image: 'https://picsum.photos/600/400?1',
    likes: 12,
  },
  {
    id: '2',
    user: 'Илья',
    place: 'ВДНХ',
    image: 'https://picsum.photos/600/400?2',
    likes: 7,
  },
  {
    id: '3',
    user: 'Мария',
    place: 'Красная площадь',
    image: 'https://picsum.photos/600/400?3',
    likes: 25,
  },
];

export default function FeedScreen() {
  const [posts, setPosts] = useState(initialPosts);

  const handleLike = (id: string) => {
    setPosts(prev =>
      prev.map(p => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.place}>{item.place}</Text>
              <Text style={styles.user}>от {item.user}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.likeBtn}>
                <Ionicons name="heart-outline" size={24} color="#FF2D55" />
                <Text style={styles.likeCount}>{item.likes}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#edf0f5', paddingHorizontal: 10, paddingTop: '5%' },
  listContent: {
    paddingBottom: 200,
    paddingTop: 10,
  },
  post: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#1a1a1c',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  image: { width: '100%', height: 300 },
  info: { padding: 10 },
  place: { fontSize: 18, fontWeight: '600' },
  user: { color: '#777', marginTop: 4 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  likeCount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});
