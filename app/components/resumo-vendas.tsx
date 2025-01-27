"use client"

import { useState, useEffect } from "react"
import { type Venda, formatarMoeda, type TipoVenda } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Cake, Coffee, DollarSign, AlertCircle } from "lucide-react"
import { db } from "../db"

export function ResumoVendas() {
  const [vendas, setVendas] = useState<Venda[]>([])

  useEffect(() => {
    const carregarVendas = async () => {
      const vendasCarregadas = await db.obterVendas()
      setVendas(vendasCarregadas)
    }
    carregarVendas()
  }, [])

  const totalVendas = vendas.reduce((total, venda) => total + venda.quantidade * venda.preco, 0)
  const quantidadeTotal = vendas.reduce((total, venda) => total + venda.quantidade, 0)

  const vendasPorTipo = (tipo: TipoVenda) =>
    vendas.filter((venda) => venda.tipo === tipo).reduce((total, venda) => total + venda.quantidade, 0)

  const totalPago = vendas
    .filter((venda) => venda.statusPagamento === "pago")
    .reduce((total, venda) => total + venda.quantidade * venda.preco, 0)

  const totalPendente = totalVendas - totalPago

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatarMoeda(totalVendas)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quantidade Total</CardTitle>
          <Cake className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{quantidadeTotal}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fatias Vendidas</CardTitle>
          <Coffee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{vendasPorTipo("fatia")}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tortas Inteiras Vendidas</CardTitle>
          <Cake className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{vendasPorTipo("inteira")}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatarMoeda(totalPago)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatarMoeda(totalPendente)}</div>
        </CardContent>
      </Card>
    </div>
  )
}

