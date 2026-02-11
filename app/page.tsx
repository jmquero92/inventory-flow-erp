import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
      <h1 className="text-4xl font-bold tracking-tight">Inventory Flow ERP</h1>
      <div className="flex gap-4">
        <Button>Login</Button>
        <Button variant="secondary">Documentation</Button>
        <Button variant="destructive">Panic Button</Button>
      </div>
    </main>
  )
}