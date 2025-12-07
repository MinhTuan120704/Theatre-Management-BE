export interface ProductResponseDto {
  product_id: number;
  name: string;
  price: number;
  category: 'food' | 'drink';
  image: string;
}
