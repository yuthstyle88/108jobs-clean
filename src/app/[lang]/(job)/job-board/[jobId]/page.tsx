import JobBoardDetail from "@/components/JobBoardDetail";

export default async function Categories({
  params,
}: {
  params: Promise<{jobId: number}>;
}) {
  const resolvedParams = await params;
  return (
    <main className="w-full min-h-screen bg-[#F6F9FE] pt-16">
      <JobBoardDetail jobId={resolvedParams.jobId}/>
    </main>
  );
}

