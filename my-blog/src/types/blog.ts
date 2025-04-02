export interface Blog {
  id: string; 
  title: string;
  slug: string;
  content: string;
  category?: string;
  thumbnail?: string; 
  createdAt: string; 
}