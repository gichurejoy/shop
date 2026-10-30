export interface Product {
  id: string;
  name: string;
  category: 'jewelry' | 'sweater';
  type: 'physical' | 'digital';
  price: number;
  mrp: number;
  discount: number;
  image: string;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
{
  id: '1',
  name: 'Classic Gold Band Ring',
  category: 'jewelry',
  type: 'physical',
  price: 299,
  mrp: 399,
  discount: 25,
  image:
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
  rating: 4.8,
  reviews: 234
},
{
  id: '2',
  name: 'Diamond Stud Earrings',
  category: 'jewelry',
  type: 'physical',
  price: 549,
  mrp: 799,
  discount: 31,
  image:
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
  rating: 4.9,
  reviews: 456
},
{
  id: '3',
  name: 'Cashmere Turtleneck Sweater',
  category: 'sweater',
  type: 'physical',
  price: 189,
  mrp: 249,
  discount: 24,
  image:
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop',
  rating: 4.7,
  reviews: 189
},
{
  id: '4',
  name: 'Pearl Strand Necklace',
  category: 'jewelry',
  type: 'physical',
  price: 429,
  mrp: 599,
  discount: 28,
  image:
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
  rating: 4.8,
  reviews: 312
},
{
  id: '5',
  name: 'Cable Knit Cardigan',
  category: 'sweater',
  type: 'physical',
  price: 159,
  mrp: 219,
  discount: 27,
  image:
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
  rating: 4.6,
  reviews: 267
},
{
  id: '6',
  name: 'Tennis Bracelet',
  category: 'jewelry',
  type: 'physical',
  price: 379,
  mrp: 499,
  discount: 24,
  image:
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
  rating: 4.9,
  reviews: 401
},
{
  id: '7',
  name: 'Merino Wool Crewneck',
  category: 'sweater',
  type: 'physical',
  price: 139,
  mrp: 189,
  discount: 26,
  image:
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop',
  rating: 4.7,
  reviews: 198
},
{
  id: '8',
  name: 'Rose Gold Hoop Earrings',
  category: 'jewelry',
  type: 'physical',
  price: 229,
  mrp: 299,
  discount: 23,
  image:
  'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=400&h=400&fit=crop',
  rating: 4.8,
  reviews: 345
},
{
  id: '9',
  name: 'Digital Styling Consultation',
  category: 'jewelry',
  type: 'digital',
  price: 79,
  mrp: 99,
  discount: 20,
  image:
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop',
  rating: 5.0,
  reviews: 89
},
{
  id: '10',
  name: 'Lumière Care Kit Voucher',
  category: 'jewelry',
  type: 'digital',
  price: 49,
  mrp: 69,
  discount: 29,
  image:
  'https://images.unsplash.com/photo-1522199710521-72d69614c702?w=400&h=400&fit=crop',
  rating: 4.9,
  reviews: 124
},
{
  id: '11',
  name: 'Custom Jewelry Design Session',
  category: 'jewelry',
  type: 'digital',
  price: 199,
  mrp: 249,
  discount: 20,
  image:
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
  rating: 5.0,
  reviews: 67
}];