export default function TutorDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-20 text-center">
      <h1 className="text-4xl font-bold">Tutor Detail: {params.id}</h1>
      <p className="mt-4 text-muted-foreground text-lg">Under Construction</p>
    </div>
  );
}
