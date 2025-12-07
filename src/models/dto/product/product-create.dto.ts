export interface ProductCreateDto {
  name: string;
  price: number;
  category: 'food' | 'drink';
  image: string;
}
