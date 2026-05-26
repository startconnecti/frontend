import { EditChangeRequestPage } from '@/features/tutor-profile/components/edit-change-request-page';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <EditChangeRequestPage id={resolvedParams.id} />;
}
