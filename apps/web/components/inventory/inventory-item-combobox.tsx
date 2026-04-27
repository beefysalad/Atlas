"use client"

import { useMemo, useState } from "react"
import type { InventoryItem } from "@workspace/shared"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@workspace/ui/components/combobox"

interface InventoryItemComboboxProps {
  items: InventoryItem[]
  value?: string
  placeholder?: string
  emptyText?: string
  onValueChange: (value: string) => void
}

function formatItemLabel(item: InventoryItem): string {
  return `${item.name} (${item.onHandQuantity} on hand)`
}

export function InventoryItemCombobox({
  items,
  value,
  placeholder = "Select item…",
  emptyText = "No matching items",
  onValueChange,
}: InventoryItemComboboxProps) {
  const selectedItem = items.find((item) => item.id === value) ?? null
  const [query, setQuery] = useState("")
  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return items
    }

    return items.filter((item) => {
      const haystack = `${item.name} ${item.sku} ${item.category}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [items, query])

  return (
    <Combobox<InventoryItem>
      items={items}
      filteredItems={filteredItems}
      value={selectedItem}
      inputValue={query}
      itemToStringLabel={formatItemLabel}
      itemToStringValue={(item) => item.id}
      isItemEqualToValue={(item, selectedValue) => item.id === selectedValue.id}
      onInputValueChange={setQuery}
      onValueChange={(nextItem) => {
        if (nextItem) {
          onValueChange(nextItem.id)
          setQuery("")
        }
      }}
    >
      <ComboboxInput placeholder={placeholder} className="w-full" />
      <ComboboxContent>
        <ComboboxEmpty>{emptyText}</ComboboxEmpty>
        <ComboboxList>
          {filteredItems.map((item) => (
            <ComboboxItem
              key={item.id}
              value={item}
              className="items-start py-2.5"
            >
              <span className="min-w-0">
                <span className="block truncate font-medium">{item.name}</span>
                <span className="text-muted-foreground block truncate text-xs">
                  {item.sku} · {item.category} · {item.onHandQuantity} on hand
                </span>
              </span>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
