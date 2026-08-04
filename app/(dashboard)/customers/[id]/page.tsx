import { CustomerDetailView } from "@/components/customers/customer-detail-view";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { id } = await params;
  return <CustomerDetailView customerId={id} />;
}
