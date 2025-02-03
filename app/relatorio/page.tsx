"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ResumoVendas } from "../components/resumo-vendas"
import { ListaVendas } from "../components/lista-vendas"
import { FiltrosRelatorio } from "../components/filtros-relatorio"
import { PrintButton } from "../components/print-button"
import { obterVendas } from "../actions"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { Venda } from "@/lib/utils"

export default function RelatorioPage() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const componentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchVendas = async () => {
      setIsLoading(true)
      const vendasIniciais = await obterVendas()
      setVendas(vendasIniciais)
      setIsLoading(false)
    }
    fetchVendas()
  }, [])

  const handleFilterChange = async (startDate: Date | undefined, endDate: Date | undefined) => {
    setIsLoading(true)
    const vendasFiltradas = await obterVendas(startDate?.toISOString(), endDate?.toISOString())
    setVendas(vendasFiltradas)
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Relatório de Vendas</h1>
        <div className="flex gap-4">
          <PrintButton contentRef={componentRef} />
          <Link href="/">
            <Button variant="secondary" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>
      </div>
      <FiltrosRelatorio onFilterChange={handleFilterChange} />
      {isLoading ? (
        <div className="text-center">Carregando...</div>
      ) : (
        <div ref={componentRef}>
          <section>
            <h2 className="text-2xl font-semibold mb-6">Resumo das Vendas</h2>
            <ResumoVendas vendas={vendas} />
          </section>
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-6">Lista de Vendas</h2>
            <ListaVendas vendas={vendas} />
          </section>
        </div>
      )}
    </div>
  )
}

