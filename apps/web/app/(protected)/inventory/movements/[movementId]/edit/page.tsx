import { InventoryEditMovementPage } from "@/components/inventory/inventory-edit-movement-page"

export default async function InventoryEditMovementRoute({
  params,
}: {
  params: Promise<{ movementId: string }>
}) {
  const { movementId } = await params

  return <InventoryEditMovementPage movementId={movementId} />
}
