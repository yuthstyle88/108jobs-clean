import MessageClient from "./MessageClient";

export default async function ChatMessage({
  params,
}: {
  params: Promise<{roomId: string}>;
}) {
  const {roomId} = await params;
  return (
    <MessageClient roomId={roomId}/>
  );
}
