export interface ProductResponseDto {
  id: number;
  name: string;
  price: number;
  category: 'food' | 'drink';
  image: string;
}
