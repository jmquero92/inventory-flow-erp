'use client'

import { Search as SearchIcon } from "lucide-react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useRef } from "react" // <--- 1. Importamos useRef

export function Search() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  
  // 2. Creamos una referencia para guardar el temporizador entre renderizados
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleSearch = (term: string) => {
    // 3. Si ya había un temporizador corriendo (el usuario sigue escribiendo), lo cancelamos
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // 4. Creamos un nuevo temporizador
    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      
      if (term) {
        params.set('query', term)
      } else {
        params.delete('query')
      }
      
      replace(`${pathname}?${params.toString()}`)
    }, 300) // Esperamos 300ms
  }

  return (
    <div className="relative flex flex-1 flex-shrink-0 w-full">
      <label htmlFor="search" className="sr-only">
        Buscar
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 shadow-sm"
        placeholder="Buscar..."
        defaultValue={searchParams.get('query')?.toString()}
        // 5. Ahora el onChange es limpio y simple
        onChange={(e) => handleSearch(e.target.value)}
      />
      <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  )
}