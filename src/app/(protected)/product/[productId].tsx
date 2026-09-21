import { useLocalSearchParams } from 'expo-router'

import ProductDetailsScreen from '@/features/products/screens/ProductDetails.screen';

const ProductDetails = () => {
    const { productId } = useLocalSearchParams();
    return <ProductDetailsScreen productId={productId as string} />
}

export default ProductDetails;

