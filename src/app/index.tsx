import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  Sparkles,
  ShoppingBag,
  SlidersHorizontal,
  Layers,
  Palette,
  Package,
  Check,
  Flame,
  Zap,
} from 'lucide-react-native';
import { useTheme } from '../theme';
import {
  Header,
  Button,
  Input,
  SearchBar,
  Badge,
  Chip,
  PriceBlock,
  Rating,
  ProductCard,
  CategoryCard,
  CartItemCard,
  OrderCard,
  BottomSheet,
  Modal,
  Tabs,
  Skeleton,
  SkeletonCircle,
  SkeletonProductCard,
  EmptyState,
  ErrorState,
} from '../components/ui';

export default function DesignSystemShowcase() {
  const { isDark, toggleTheme } = useTheme();

  // Navigation / Tabs state
  const [activeTab, setActiveTab] = useState('tokens');

  // Interactive component states
  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>(['electronics', 'trending']);
  const [userRating, setUserRating] = useState(4.5);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(2);
  const [cartCount, setCartCount] = useState(3);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleChip = (id: string) => {
    if (selectedChips.includes(id)) {
      setSelectedChips(selectedChips.filter((c) => c !== id));
    } else {
      setSelectedChips([...selectedChips, id]);
    }
  };

  const navTabs = [
    { id: 'tokens', label: 'Tokens', icon: <Palette size={15} color={activeTab === 'tokens' ? '#2563EB' : '#64748B'} /> },
    { id: 'components', label: 'UI Primitives', icon: <Layers size={15} color={activeTab === 'components' ? '#2563EB' : '#64748B'} /> },
    { id: 'commerce', label: 'Commerce', icon: <ShoppingBag size={15} color={activeTab === 'commerce' ? '#2563EB' : '#64748B'} /> },
    { id: 'cart-orders', label: 'Cart & Orders', icon: <Package size={15} color={activeTab === 'cart-orders' ? '#2563EB' : '#64748B'} /> },
    { id: 'states-sheets', label: 'Feedback & Modals', icon: <SlidersHorizontal size={15} color={activeTab === 'states-sheets' ? '#2563EB' : '#64748B'} /> },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-slate-950">
      {/* Top Meeo App Bar */}
      <Header
        title="Meeo Design System"
        showThemeToggle
        cartCount={cartCount}
        notificationCount={2}
        onCartPress={() => setActiveTab('cart-orders')}
      />

      {/* Hero Banner with Theme & System Status */}
      <View className="px-4 pt-3 pb-2">
        <View className="p-4 rounded-card bg-primary-light/40 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <View className="flex-row items-center gap-1.5 mb-1">
              <Sparkles size={16} color="#2563EB" />
              <Text className="text-body-sm font-bold text-primary dark:text-blue-400 uppercase tracking-wider">
                Meeo Core v1.0
              </Text>
            </View>
            <Text className="text-body-sm text-text-secondary dark:text-slate-300">
              Active Mode:{' '}
              <Text className="font-bold text-text-primary dark:text-white capitalize">
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </Text>
          </View>

          <Button
            variant="primary"
            size="sm"
            onPress={toggleTheme}
            className="self-center"
          >
            {isDark ? 'Switch Light' : 'Switch Dark'}
          </Button>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View className="px-4 py-2">
        <Tabs
          tabs={navTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="pill"
          isScrollable
        />
      </View>

      <ScrollView
        className="flex-1 px-4 pt-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* =========================================================================
            TAB 1: DESIGN TOKENS & FOUNDATIONS
        ========================================================================= */}
        {activeTab === 'tokens' && (
          <View className="gap-6 pb-6">
            {/* Color System */}
            <View className="gap-3">
              <Text className="text-h3 font-bold text-text-primary dark:text-slate-100">
                Color Palette & Semantic Tokens
              </Text>
              <Text className="text-body-sm text-text-secondary dark:text-slate-400">
                Defined tokens with automatic high-contrast dark mode adaptability.
              </Text>

              {/* Brand Colors */}
              <View className="gap-2">
                <Text className="text-caption font-bold text-text-secondary uppercase tracking-wider">
                  Brand & Accents
                </Text>
                <View className="flex-row flex-wrap gap-2.5">
                  <ColorTile name="Primary" hex="#2563EB" bgClass="bg-primary" textClass="text-white" />
                  <ColorTile name="Primary Dark" hex="#1D4ED8" bgClass="bg-[#1D4ED8]" textClass="text-white" />
                  <ColorTile name="Primary Light" hex="#DBEAFE" bgClass="bg-[#DBEAFE]" textClass="text-blue-900" />
                  <ColorTile name="Secondary" hex="#7C3AED" bgClass="bg-secondary" textClass="text-white" />
                  <ColorTile name="Accent" hex="#F59E0B" bgClass="bg-accent" textClass="text-white" />
                </View>
              </View>

              {/* Feedback Colors */}
              <View className="gap-2 pt-2">
                <Text className="text-caption font-bold text-text-secondary uppercase tracking-wider">
                  Feedback & Status
                </Text>
                <View className="flex-row flex-wrap gap-2.5">
                  <ColorTile name="Success" hex="#16A34A" bgClass="bg-success" textClass="text-white" />
                  <ColorTile name="Warning" hex="#D97706" bgClass="bg-warning" textClass="text-white" />
                  <ColorTile name="Error" hex="#DC2626" bgClass="bg-error" textClass="text-white" />
                  <ColorTile name="Info" hex="#0284C7" bgClass="bg-info" textClass="text-white" />
                </View>
              </View>

              {/* Surface & Text Colors */}
              <View className="gap-2 pt-2">
                <Text className="text-caption font-bold text-text-secondary uppercase tracking-wider">
                  Surfaces & Typography
                </Text>
                <View className="flex-row flex-wrap gap-2.5">
                  <ColorTile name="Background" hex={isDark ? '#0B0F17' : '#F8FAFC'} bgClass="bg-background" textClass="text-text-primary dark:text-white" border />
                  <ColorTile name="Surface" hex={isDark ? '#161F30' : '#FFFFFF'} bgClass="bg-surface" textClass="text-text-primary dark:text-white" border />
                  <ColorTile name="Text Primary" hex={isDark ? '#F8FAFC' : '#0F172A'} bgClass="bg-[#0F172A]" textClass="text-white" />
                  <ColorTile name="Text Sec." hex={isDark ? '#94A3B8' : '#64748B'} bgClass="bg-[#64748B]" textClass="text-white" />
                  <ColorTile name="Border" hex={isDark ? '#1E293B' : '#E2E8F0'} bgClass="bg-[#E2E8F0]" textClass="text-slate-800" />
                </View>
              </View>
            </View>

            {/* Typography Hierarchy */}
            <View className="gap-3 pt-2">
              <Text className="text-h3 font-bold text-text-primary dark:text-slate-100">
                Inter Typography Scale
              </Text>

              <View className="p-4 rounded-card bg-surface dark:bg-slate-800/90 border border-border dark:border-slate-700/60 gap-4">
                <View className="pb-3 border-b border-border dark:border-slate-700/60">
                  <Text className="text-display text-text-primary dark:text-white">
                    Display 32px
                  </Text>
                  <Text className="text-caption text-text-secondary">32px / 700 bold</Text>
                </View>

                <View className="pb-3 border-b border-border dark:border-slate-700/60">
                  <Text className="text-h1 text-text-primary dark:text-white">
                    Heading 1 28px
                  </Text>
                  <Text className="text-caption text-text-secondary">28px / 700 bold</Text>
                </View>

                <View className="pb-3 border-b border-border dark:border-slate-700/60">
                  <Text className="text-h2 text-text-primary dark:text-white">
                    Heading 2 24px
                  </Text>
                  <Text className="text-caption text-text-secondary">24px / 700 bold</Text>
                </View>

                <View className="pb-3 border-b border-border dark:border-slate-700/60">
                  <Text className="text-h3 text-text-primary dark:text-white">
                    Heading 3 20px
                  </Text>
                  <Text className="text-caption text-text-secondary">20px / 600 semibold</Text>
                </View>

                <View className="pb-3 border-b border-border dark:border-slate-700/60">
                  <Text className="text-body-lg text-text-primary dark:text-white">
                    Body Large 16px - High readability product descriptions
                  </Text>
                  <Text className="text-caption text-text-secondary">16px / 400 regular</Text>
                </View>

                <View className="pb-3 border-b border-border dark:border-slate-700/60">
                  <Text className="text-body text-text-primary dark:text-white">
                    Body 14px - Standard UI text and metadata
                  </Text>
                  <Text className="text-caption text-text-secondary">14px / 400 regular</Text>
                </View>

                <View className="pb-3 border-b border-border dark:border-slate-700/60">
                  <Text className="text-btn text-primary dark:text-blue-400">
                    Button 14px - Interactive action labels
                  </Text>
                  <Text className="text-caption text-text-secondary">14px / 600 semibold</Text>
                </View>

                <View>
                  <Text className="text-caption text-text-secondary dark:text-slate-400">
                    Caption 11px - Micro badges, timestamps, SKU tags
                  </Text>
                  <Text className="text-[10px] text-text-muted">11px / 500 medium</Text>
                </View>
              </View>
            </View>

            {/* Border Radius & Spacing */}
            <View className="gap-3 pt-2">
              <Text className="text-h3 font-bold text-text-primary dark:text-slate-100">
                Border Radius & 4px Spacing Scale
              </Text>

              <View className="p-4 rounded-card bg-surface dark:bg-slate-800/90 border border-border dark:border-slate-700/60 gap-4">
                <Text className="text-body-sm font-semibold text-text-secondary">
                  Border Radius Tokens
                </Text>
                <View className="flex-row flex-wrap gap-3">
                  <View className="p-3 bg-primary-light dark:bg-blue-950/60 rounded-sm border border-blue-300 dark:border-blue-800 items-center min-w-[70px]">
                    <Text className="text-caption font-bold text-primary dark:text-blue-300">Small (6px)</Text>
                  </View>
                  <View className="p-3 bg-primary-light dark:bg-blue-950/60 rounded-md border border-blue-300 dark:border-blue-800 items-center min-w-[70px]">
                    <Text className="text-caption font-bold text-primary dark:text-blue-300">Medium (10px)</Text>
                  </View>
                  <View className="p-3 bg-primary-light dark:bg-blue-950/60 rounded-lg border border-blue-300 dark:border-blue-800 items-center min-w-[70px]">
                    <Text className="text-caption font-bold text-primary dark:text-blue-300">Large (14px)</Text>
                  </View>
                  <View className="p-3 bg-primary-light dark:bg-blue-950/60 rounded-card border border-blue-300 dark:border-blue-800 items-center min-w-[70px]">
                    <Text className="text-caption font-bold text-primary dark:text-blue-300">Card (16px)</Text>
                  </View>
                  <View className="p-3 bg-primary-light dark:bg-blue-950/60 rounded-pill border border-blue-300 dark:border-blue-800 items-center min-w-[70px]">
                    <Text className="text-caption font-bold text-primary dark:text-blue-300">Pill (999px)</Text>
                  </View>
                </View>

                <Text className="text-body-sm font-semibold text-text-secondary pt-2">
                  4px Spacing Visualizer
                </Text>
                <View className="flex-row items-end gap-2">
                  {[4, 8, 12, 16, 20, 24, 32, 40, 48].map((s) => (
                    <View key={s} className="items-center gap-1">
                      <View
                        style={{ height: s, width: 22 }}
                        className="bg-primary rounded-sm opacity-80"
                      />
                      <Text className="text-[10px] text-text-secondary">{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* =========================================================================
            TAB 2: UI PRIMITIVES (BUTTONS, INPUTS, SEARCH, BADGES, CHIPS)
        ========================================================================= */}
        {activeTab === 'components' && (
          <View className="gap-6 pb-6">
            {/* Buttons Section */}
            <View className="gap-3">
              <Text className="text-h3 font-bold text-text-primary dark:text-slate-100">
                Buttons & Action Triggers
              </Text>
              <Text className="text-body-sm text-text-secondary dark:text-slate-400">
                High-conversion CTA hierarchy with micro-interaction states.
              </Text>

              <View className="p-4 rounded-card bg-surface dark:bg-slate-800/90 border border-border dark:border-slate-700/60 gap-4">
                {/* Variants */}
                <View className="flex-row flex-wrap gap-2.5">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </View>

                {/* Sizes */}
                <Text className="text-caption font-bold text-text-secondary uppercase tracking-wider pt-2">
                  Button Sizes
                </Text>
                <View className="flex-row items-center flex-wrap gap-2.5">
                  <Button size="sm" variant="primary">Small (36px)</Button>
                  <Button size="md" variant="primary">Medium (44px)</Button>
                  <Button size="lg" variant="primary">Large (52px)</Button>
                </View>

                {/* States & Icons */}
                <Text className="text-caption font-bold text-text-secondary uppercase tracking-wider pt-2">
                  With Icons & Loading State
                </Text>
                <View className="flex-row flex-wrap gap-2.5">
                  <Button
                    variant="primary"
                    leftIcon={<ShoppingBag size={16} color="#FFFFFF" />}
                  >
                    Add to Bag
                  </Button>
                  <Button
                    variant="outline"
                    rightIcon={<Sparkles size={16} color={isDark ? '#F8FAFC' : '#0F172A'} />}
                  >
                    Quick View
                  </Button>
                  <Button variant="primary" isLoading>
                    Processing
                  </Button>
                  <Button variant="primary" disabled>
                    Disabled
                  </Button>
                </View>
              </View>
            </View>

            {/* Inputs & Search Section */}
            <View className="gap-3">
              <Text className="text-h3 font-bold text-text-primary dark:text-slate-100">
                Form Inputs & Search Bar
              </Text>

              <View className="p-4 rounded-card bg-surface dark:bg-slate-800/90 border border-border dark:border-slate-700/60 gap-4">
                <SearchBar
                  value={searchValue}
                  onChangeText={setSearchValue}
                  showFilter
                  onFilterPress={() => setIsSheetOpen(true)}
                  placeholder="Search Meeo catalog..."
                />

                <Input
                  label="Email Address"
                  placeholder="name@example.com"
                  value={inputValue}
                  onChangeText={(val) => {
                    setInputValue(val);
                    if (val && !val.includes('@')) {
                      setInputError('Please enter a valid email address');
                    } else {
                      setInputError('');
                    }
                  }}
                  isClearable
                  error={inputError}
                  helperText={!inputError ? "We'll send your order receipts here." : undefined}
                />

                <Input
                  label="Promo Code"
                  placeholder="e.g. MEEO20"
                  defaultValue="SUMMER2026"
                  rightIcon={
                    <Badge variant="success" size="sm">
                      Applied
                    </Badge>
                  }
                />

                <Input
                  label="Disabled Input"
                  value="Read-only field"
                  disabled
                />
              </View>
            </View>

            {/* Badges & Chips Section */}
            <View className="gap-3">
              <Text className="text-h3 font-bold text-text-primary dark:text-slate-100">
                Badges & Filter Chips
              </Text>

              <View className="p-4 rounded-card bg-surface dark:bg-slate-800/90 border border-border dark:border-slate-700/60 gap-4">
                <Text className="text-caption font-bold text-text-secondary uppercase tracking-wider">
                  Status Badges
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  <Badge variant="primary">New Arrival</Badge>
                  <Badge variant="secondary">Exclusive</Badge>
                  <Badge variant="success" icon={<Check size={11} color="#16A34A" />}>
                    In Stock
                  </Badge>
                  <Badge variant="warning">Low Stock</Badge>
                  <Badge variant="error">Sold Out</Badge>
                  <Badge variant="discount">-35% OFF</Badge>
                  <Badge variant="neutral">SKU-8921</Badge>
                </View>

                <Text className="text-caption font-bold text-text-secondary uppercase tracking-wider pt-2">
                  Interactive Filter Chips (Tap to Toggle)
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Items', count: 128 },
                    { id: 'trending', label: 'Trending', icon: <Flame size={14} color={selectedChips.includes('trending') ? '#FFF' : '#F59E0B'} /> },
                    { id: 'electronics', label: 'Electronics', count: 42 },
                    { id: 'fashion', label: 'Fashion', count: 56 },
                    { id: 'deals', label: 'Flash Deals', icon: <Zap size={14} color={selectedChips.includes('deals') ? '#FFF' : '#7C3AED'} /> },
                  ].map((chip) => (
                    <Chip
                      key={chip.id}
                      label={chip.label}
                      icon={chip.icon}
                      count={chip.count}
                      selected={selectedChips.includes(chip.id)}
                      onPress={() => toggleChip(chip.id)}
                    />
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* =========================================================================
            TAB 3: COMMERCE COMPONENTS (PRODUCT CARDS, CATEGORIES, PRICING, RATINGS)
        ========================================================================= */}
        {activeTab === 'commerce' && (
          <View className="gap-6 pb-6">
            {/* Category Cards Showcase */}
            <View className="gap-3">
              <Text className="text-h3 font-bold text-text-primary dark:text-slate-100">
                Category Navigation Cards
              </Text>

              {/* Circle Avatars */}
              <Text className="text-caption font-bold text-text-secondary uppercase tracking-wider">
                Circle Avatar Variant
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-4">
                <CategoryCard
                  label="Audio"
                  imageUrl="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80"
                  selected
                  className="mr-3"
                />
                <CategoryCard
                  label="Watches"
                  imageUrl="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80"
                  className="mr-3"
                />
                <CategoryCard
                  label="Footwear"
                  imageUrl="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80"
                  className="mr-3"
                />
                <CategoryCard
                  label="Cameras"
                  imageUrl="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80"
                  className="mr-3"
                />
                <CategoryCard
                  label="Eyewear"
                  imageUrl="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&q=80"
                  className="mr-3"
                />
              </ScrollView>

              {/* Tiles */}
              <Text className="text-caption font-bold text-text-secondary uppercase tracking-wider pt-2">
                Grid Tile Variant
              </Text>
              <View className="flex-row gap-3">
                <CategoryCard
                  label="Smartphones"
                  itemCount={142}
                  variant="tile"
                  imageUrl="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80"
                  className="flex-1"
                />
                <CategoryCard
                  label="Accessories"
                  itemCount={88}
                  variant="tile"
                  imageUrl="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&q=80"
                  className="flex-1"
                />
              </View>
            </View>

            {/* Product Cards (Grid & Horizontal) */}
            <View className="gap-3">
              <Text className="text-h3 font-bold text-text-primary dark:text-slate-100">
                Product Cards (High Conversion)
              </Text>

              {/* Vertical Grid Cards */}
              <Text className="text-caption font-bold text-text-secondary uppercase tracking-wider">
                Vertical Grid Cards
              </Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <ProductCard
                    id="1"
                    title="Meeo Spatial Pro Wireless Headphones"
                    brand="Meeo Studio"
                    price={249.0}
                    originalPrice={329.0}
                    rating={4.9}
                    reviewCount={1240}
                    tag="Best Seller"
                    isWishlisted={isWishlisted}
                    onWishlistToggle={() => setIsWishlisted(!isWishlisted)}
                    imageUrl="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"
                    onAddToCart={() => setCartCount((prev) => prev + 1)}
                  />
                </View>

                <View className="flex-1">
                  <ProductCard
                    id="2"
                    title="Minimal Chronograph Titanium Watch"
                    brand="Meeo Horology"
                    price={189.5}
                    originalPrice={240.0}
                    rating={4.7}
                    reviewCount={412}
                    tag="New"
                    imageUrl="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"
                    onAddToCart={() => setCartCount((prev) => prev + 1)}
                  />
                </View>
              </View>

              {/* Horizontal List Card */}
              <Text className="text-caption font-bold text-text-secondary uppercase tracking-wider pt-2">
                Horizontal List Card
              </Text>
              <ProductCard
                id="3"
                title="Ultra-Light Aero Runner Sneakers - Edition 2"
                brand="Meeo Active"
                price={120.0}
                originalPrice={160.0}
                variant="horizontal"
                tag="Trending"
                imageUrl="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
                onAddToCart={() => setCartCount((prev) => prev + 1)}
              />
            </View>

            {/* Price Blocks & Interactive Ratings */}
            <View className="gap-3">
              <Text className="text-h3 font-bold text-text-primary dark:text-slate-100">
                Price Blocks & Ratings
              </Text>

              <View className="p-4 rounded-card bg-surface dark:bg-slate-800/90 border border-border dark:border-slate-700/60 gap-4">
                <Text className="text-caption font-bold text-text-secondary uppercase tracking-wider">
                  Price Block Formats
                </Text>
                <View className="gap-2">
                  <PriceBlock price={299.99} originalPrice={399.99} size="lg" />
                  <PriceBlock price={89.0} originalPrice={120.0} size="md" />
                  <PriceBlock price={24.5} size="sm" />
                </View>

                <Text className="text-caption font-bold text-text-secondary uppercase tracking-wider pt-2">
                  Interactive Rating Component (Tap stars to rate)
                </Text>
                <Rating
                  rating={userRating}
                  reviewCount={8540}
                  interactive
                  onRatingChange={(score) => setUserRating(score)}
                  size="lg"
                />
              </View>
            </View>
          </View>
        )}

        {/* =========================================================================
            TAB 4: CART & ORDER ITEMS
        ========================================================================= */}
        {activeTab === 'cart-orders' && (
          <View className="gap-6 pb-6">
            <View className="gap-3">
              <Text className="text-h3 font-bold text-text-primary dark:text-slate-100">
                Cart Items & Order History
              </Text>
              <Text className="text-body-sm text-text-secondary dark:text-slate-400">
                Interactive checkout components with steppers and status badges.
              </Text>

              {/* Cart Item Card */}
              <Text className="text-caption font-bold text-text-secondary uppercase tracking-wider">
                Cart Item Row
              </Text>
              <CartItemCard
                id="c1"
                title="Meeo Spatial Pro Wireless Headphones"
                variantInfo="Color: Space Black • Over-Ear"
                price={249.0}
                quantity={cartQuantity}
                onIncrement={() => setCartQuantity((q) => q + 1)}
                onDecrement={() => setCartQuantity((q) => Math.max(1, q - 1))}
                onRemove={() => alert('Removed from cart')}
                imageUrl="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
              />

              <CartItemCard
                id="c2"
                title="Minimal Chronograph Titanium Watch"
                variantInfo="Strap: Italian Leather • 40mm"
                price={189.5}
                quantity={1}
                onIncrement={() => {}}
                onDecrement={() => {}}
                onRemove={() => alert('Removed from cart')}
                imageUrl="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
              />

              {/* Order Cards */}
              <Text className="text-caption font-bold text-text-secondary uppercase tracking-wider pt-2">
                Order Tracking & History Cards
              </Text>
              <OrderCard
                orderId="#MEO-98421"
                date="Sep 18, 2026"
                status="in_transit"
                totalAmount={438.5}
                itemCount={2}
                itemImages={[
                  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80',
                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80',
                ]}
                onTrackPress={() => setIsModalOpen(true)}
                onDetailsPress={() => setIsSheetOpen(true)}
              />

              <OrderCard
                orderId="#MEO-84210"
                date="Aug 24, 2026"
                status="delivered"
                totalAmount={120.0}
                itemCount={1}
                itemImages={[
                  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80',
                ]}
                onDetailsPress={() => setIsSheetOpen(true)}
              />
            </View>
          </View>
        )}

        {/* =========================================================================
            TAB 5: FEEDBACK, MODALS, SHEETS, SKELETONS & STATES
        ========================================================================= */}
        {activeTab === 'states-sheets' && (
          <View className="gap-6 pb-6">
            {/* Modal & BottomSheet Triggers */}
            <View className="gap-3">
              <Text className="text-h3 font-bold text-text-primary dark:text-slate-100">
                Modals & Bottom Sheet Actions
              </Text>

              <View className="p-4 rounded-card bg-surface dark:bg-slate-800/90 border border-border dark:border-slate-700/60 gap-3">
                <Button
                  variant="primary"
                  fullWidth
                  onPress={() => setIsSheetOpen(true)}
                >
                  Open Bottom Sheet
                </Button>

                <Button
                  variant="outline"
                  fullWidth
                  onPress={() => setIsModalOpen(true)}
                >
                  Open Confirmation Dialog
                </Button>
              </View>
            </View>

            {/* Skeletons Section */}
            <View className="gap-3">
              <Text className="text-h3 font-bold text-text-primary dark:text-slate-100">
                Skeleton Loaders
              </Text>

              <View className="p-4 rounded-card bg-surface dark:bg-slate-800/90 border border-border dark:border-slate-700/60 gap-4">
                <View className="flex-row items-center gap-3">
                  <SkeletonCircle size={48} />
                  <View className="flex-1 gap-1.5">
                    <Skeleton height={16} width="60%" />
                    <Skeleton height={12} width="40%" />
                  </View>
                </View>

                <SkeletonProductCard />
              </View>
            </View>

            {/* Empty & Error States */}
            <View className="gap-3">
              <Text className="text-h3 font-bold text-text-primary dark:text-slate-100">
                Zero States & Error Banners
              </Text>

              <View className="rounded-card bg-surface dark:bg-slate-800/90 border border-border dark:border-slate-700/60 overflow-hidden">
                <EmptyState
                  title="Your Bag is Empty"
                  description="Explore our curated collection of premium products and add your favorites."
                  actionText="Start Shopping"
                  onActionPress={() => setActiveTab('commerce')}
                  secondaryActionText="View Wishlist"
                  onSecondaryActionPress={() => {}}
                />
              </View>

              <View className="rounded-card bg-surface dark:bg-slate-800/90 border border-border dark:border-slate-700/60 overflow-hidden mt-3">
                <ErrorState
                  title="Connection Interrupted"
                  message="We could not sync your cart with the server. Please check your internet connection."
                  onRetry={() => alert('Retrying connection...')}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Interactive Bottom Sheet */}
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Filter Products"
      >
        <View className="gap-5 pb-6">
          <View className="gap-2">
            <Text className="text-body-sm font-bold text-text-primary dark:text-slate-100">
              Categories
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {['All', 'Headphones', 'Watches', 'Footwear', 'Apparel'].map((cat, i) => (
                <Chip key={cat} label={cat} selected={i === 1} />
              ))}
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-body-sm font-bold text-text-primary dark:text-slate-100">
              Price Range
            </Text>
            <View className="flex-row gap-2">
              <Chip label="$0 - $100" />
              <Chip label="$100 - $300" selected />
              <Chip label="$300+" />
            </View>
          </View>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            onPress={() => setIsSheetOpen(false)}
          >
            Apply Filters
          </Button>
        </View>
      </BottomSheet>

      {/* Interactive Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Track Package"
        description="Your order #MEO-98421 has departed the logistics hub in San Francisco and is expected to arrive on Sep 21, 2026."
        confirmText="Got It"
        onConfirm={() => setIsModalOpen(false)}
      />
    </SafeAreaView>
  );
}

function ColorTile({
  name,
  hex,
  bgClass,
  textClass,
  border = false,
}: {
  name: string;
  hex: string;
  bgClass: string;
  textClass: string;
  border?: boolean;
}) {
  return (
    <View
      className={`p-2.5 rounded-md min-w-[100px] flex-1 ${bgClass} ${
        border ? 'border border-border dark:border-slate-700' : ''
      } shadow-sm`}
    >
      <Text className={`text-caption font-bold ${textClass}`}>{name}</Text>
      <Text className={`text-[10px] opacity-80 ${textClass} mt-0.5`}>{hex}</Text>
    </View>
  );
}
