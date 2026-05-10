import { StudentFavoritesPage } from '@/features/favorites';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Favorites | Connecti',
  description: 'Manage your preferred tutors and book sessions quickly.',
};

export default function StudentFavorites() {
  return <StudentFavoritesPage />;
}
