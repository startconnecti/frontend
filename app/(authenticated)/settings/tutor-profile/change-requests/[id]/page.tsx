import { ChangeRequestDetailPage } from '@/features/tutor-profile/components/change-request-detail-page';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ChangeRequestDetailPage id={resolvedParams.id} />;
}
