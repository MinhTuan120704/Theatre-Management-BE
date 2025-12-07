export interface ProductUpdateDto {
  name?: string;
  price?: number;
  category?: 'food' | 'drink';
  image?: string;
}
