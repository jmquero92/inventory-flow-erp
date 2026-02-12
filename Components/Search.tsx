'use client'

import { Input } from "@/Components/ui/input"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export function Search() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    
    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }
    
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <div className="w-full max-w-sm">
       <Input
        placeholder="🔍 Buscar por nombre o SKU..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  )
}