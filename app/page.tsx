import { AdicionarVenda } from "./components/adicionar-venda"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PieChart } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-end">
        <Link href="/relatorio">
          <Button variant="outline" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Ver Relatório
          </Button>
        </Link>
      </div>
      <section className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Adicionar Nova Venda</h2>
        <AdicionarVenda />
      </section>
    </div>
  )
}

