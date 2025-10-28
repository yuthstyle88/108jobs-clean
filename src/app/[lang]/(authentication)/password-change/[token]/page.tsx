import ChangePasswordLayout from "@/components/Authentication/ChangePasswordLayout";

export default async function Page({
  params,
}: {
  params: Promise<{token: string}>;
}) {
  const resolvedParams = await params;
  return <ChangePasswordLayout token={resolvedParams.token}/>;
}
