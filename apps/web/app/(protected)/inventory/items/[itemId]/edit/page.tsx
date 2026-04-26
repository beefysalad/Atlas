import { InventoryEditItemPage } from "@/components/inventory/inventory-edit-item-page"

export default async function InventoryEditItemRoute({
  params,
}: {
  params: Promise<{ itemId: string }>
}) {
  const { itemId } = await params

  return <InventoryEditItemPage itemId={itemId} />
}
