export interface DummyProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  brand: string;
  category?: string;
  tag?: string;
  rating: number;
  reviewCount: number;
}

const IMAGES = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80',
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80',
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
  'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
];

const BRANDS = [
  'Sony',
  'Apple',
  'Nike',
  'Nordic Craft',
  'Samsung',
  'Bose',
  'Xiaomi',
  'Adidas',
  'Puma',
  'Anker',
  'Marshall',
  'Logitech',
  'Dyson',
  'Fossil',
  'Zara',
];

const CATEGORIES = [
  'for-you',
  'electronics',
  'fashion',
  'home',
  'beauty',
  'deals',
  'sports',
];

const TAGS = ['Popular', 'Sale', '-20%', '-40%', 'Hot', 'Best Seller', 'New'];

const PRODUCT_NAMES = [
  'Wireless Noise Canceling Headphones',
  'Minimalist Chronograph Wristwatch',
  'Ultra-light Ergonomic Running Shoes',
  'Smart AMOLED Fitness Band Tracker',
  'Smartwatch with Heart Rate Monitor',
  'Studio Quality Over-Ear Pro Headphones',
  'Vintage Polaroid Instant Camera',
  'Essential Oil Diffuser & Humidifier',
  'Classic Urban Leather Sneakers',
  'Polarized UV400 Sunglasses',
  'Ergonomic Minimalist Office Chair',
  'Wireless Bluetooth High-Bass Speaker',
  'Premium Everyday Canvas Backpack',
  'Designer Aviator Metal Sunglasses',
  'Ceramic Matte Coffee Tumbler Mug',
  'Hardcover Minimalist Dotted Journal',
  'Mechanical RGB Gaming Keyboard',
  'Ultra-Precision Wireless Gaming Mouse',
  'MagSafe Fast Wireless Charger Stand',
  'Waterproof Portable Travel Speaker',
];

export const DUMMY_100_PRODUCTS: DummyProduct[] = Array.from({ length: 100 }, (_, index) => {
  const id = `prod-${index + 1}`;
  const brand = BRANDS[index % BRANDS.length];
  const name = PRODUCT_NAMES[index % PRODUCT_NAMES.length];
  const title = `${brand} ${name} v${(index % 5) + 1}`;
  const price = Math.floor(19 + ((index * 17) % 480));
  const hasDiscount = index % 3 === 0;
  const originalPrice = hasDiscount ? Math.round(price * 1.35) : undefined;
  const imageUrl = IMAGES[index % IMAGES.length];
  const category = CATEGORIES[index % CATEGORIES.length];
  const tag = index % 2 === 0 ? TAGS[index % TAGS.length] : undefined;
  const rating = +(4.0 + ((index * 7) % 10) / 10).toFixed(1);
  const reviewCount = Math.floor(45 + ((index * 83) % 2400));

  return {
    id,
    title,
    price,
    originalPrice,
    imageUrl,
    brand,
    category,
    tag,
    rating,
    reviewCount,
  };
});
