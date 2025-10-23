import { Ionicons } from '@expo/vector-icons';

export type WorkingHours = {
  label: string;
  value: string;
};

export type Review = {
  id: string;
  author: string;
  comment: string;
  rating: number;
  date: string;
};

export type ContactInfo = {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export type Story = {
  id: string;
  userName: string;
  avatar: string;
  image: string;
  text: string;
  postId: string;
};

export type Post = {
  id: string;
  user: string;
  userAvatar: string;
  userHandle: string;
  place: string;
  address: string;
  image: string;
  gallery: string[];
  likes: number;
  totalLikes: number;
  followers: number;
  rating: number;
  tags: string[];
  bio: string;
  workingHours: WorkingHours[];
  reviews: Review[];
  contact: ContactInfo[];
};

export const posts: Post[] = [
  {
    id: '1',
    user: 'Парк имени Щербакова',
    userAvatar: 'https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=400&q=80',
    userHandle: 'scherbakovpark',
    place: 'Парк Щербакова',
    address: 'ул. Университетская, 14, Донецк',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Donetsk_Scherbakov_Park.jpg',
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Donetsk_Scherbakov_Park.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Donetsk_Scherbakov_Park.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Donetsk_Scherbakov_Park.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Donetsk_Scherbakov_Park.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Donetsk_Scherbakov_Park.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Donetsk_Scherbakov_Park.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Donetsk_Scherbakov_Park.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Donetsk_Scherbakov_Park.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Donetsk_Scherbakov_Park.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Donetsk_Scherbakov_Park.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Donetsk_Scherbakov_Park.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/6/62/Donetsk_Scherbakov_Park.jpg',
    ],
    likes: 12,
    totalLikes: 1480,
    followers: 26800,
    rating: 4.8,
    tags: ['Парк', 'Семейный отдых', 'Озеро'],
    bio: 'Парк Щербакова — зелёный оазис для прогулок, занятий спортом и семейного отдыха. Здесь проходят фестивали, концерты и кинопоказы под открытым небом.',
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
    contact: [
      { label: 'Официальный сайт', value: 'https://gorkiypark.com', icon: 'globe-outline' },
      { label: 'Телефон', value: '+7 (495) 995-00-20', icon: 'call-outline' },
      { label: 'Email', value: 'info@gorkiypark.com', icon: 'mail-outline' },
    ],
  },
  {
    id: '2',
    user: 'ВДНХ',
    userAvatar: 'https://images.unsplash.com/photo-1528901166007-3784c7dd3653?auto=format&fit=crop&w=400&q=80',
    userHandle: 'vdnhofficial',
    place: 'ВДНХ',
    address: 'просп. Мира, 119, Москва',
    image: 'https://picsum.photos/600/400?2',
    gallery: [
      'https://picsum.photos/600/400?2',
      'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1455906876003-298dd8c44dc0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    ],
    likes: 7,
    totalLikes: 2140,
    followers: 42150,
    rating: 4.5,
    tags: ['Культура', 'Выставки', 'АРТ'],
    bio: 'ВДНХ — крупнейший выставочный комплекс, объединяющий павильоны, музеи и фестивальные площадки. Мы рассказываем о главных событиях и новинках.',
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
    contact: [
      { label: 'Официальный сайт', value: 'https://vdnh.ru', icon: 'globe-outline' },
      { label: 'Телефон', value: '+7 (495) 544-34-00', icon: 'call-outline' },
      { label: 'Email', value: 'info@vdnh.ru', icon: 'mail-outline' },
    ],
  },
  {
    id: '3',
    user: 'Красная площадь',
    userAvatar: 'https://images.unsplash.com/photo-1505843864240-89971962f889?auto=format&fit=crop&w=400&q=80',
    userHandle: 'redsquare_official',
    place: 'Красная площадь',
    address: 'Красная площадь, Москва',
    image: 'https://picsum.photos/600/400?3',
    gallery: [
      'https://picsum.photos/600/400?3',
      'https://images.unsplash.com/photo-1528901166007-3784c7dd3653?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505843864240-89971962f889?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1494475673543-6a6a27143b16?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    ],
    likes: 25,
    totalLikes: 5630,
    followers: 98200,
    rating: 4.9,
    tags: ['История', 'Главные места', 'События'],
    bio: 'Официальный гид по Красной площади. Делимся историей, событиями и авторскими маршрутами по сердцу столицы.',
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
    contact: [
      { label: 'Сайт', value: 'https://kremlin.ru', icon: 'globe-outline' },
      { label: 'Телефон', value: '+7 (495) 620-65-65', icon: 'call-outline' },
      { label: 'Email', value: 'info@redsquare.ru', icon: 'mail-outline' },
    ],
  },
];

export const stories: Story[] = [
  {
    id: 's1',
    userName: 'Парк Щербакова',
    avatar: posts[0].userAvatar,
    image: posts[0].gallery[1],
    text: 'Успейте пройтись по набережной в этот солнечный день!',
    postId: '1',
  },
  {
    id: 's2',
    userName: 'Urban explorer',
    avatar: posts[1].userAvatar,
    image: posts[1].gallery[1],
    text: 'Побывал в арт-кластере Хлебозавод — это настоящий город в городе. Делюсь атмосферой.',
    postId: '2',
  },
  {
    id: 's3',
    userName: 'Coffee time',
    avatar: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=400&q=80',
    image: posts[1].gallery[2],
    text: 'Нашли кофейню с невероятными десертами и видом на Тверскую. Лайфхак для сладкоежек.',
    postId: '2',
  },
  {
    id: 's4',
    userName: 'City walker',
    avatar: posts[2].userAvatar,
    image: posts[2].gallery[1],
    text: 'Вечерняя прогулка по Замоскворечью — тихие улицы, старинные дома и уютные лавочки.',
    postId: '3',
  },
];
