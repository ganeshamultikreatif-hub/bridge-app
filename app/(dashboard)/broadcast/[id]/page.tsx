import { BroadcastDetailView } from "@/components/broadcast/broadcast-detail-view";

interface BroadcastDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BroadcastDetailPage({
  params,
}: BroadcastDetailPageProps) {
  const { id } = await params;
  return <BroadcastDetailView id={id} />;
}
