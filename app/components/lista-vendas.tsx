"use client"

import { useState, useEffect } from "react"
import { type Venda, formatarMoeda } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { atualizarStatusPagamento, obterVendas } from "../actions"
import { useRouter } from "next/navigation"

export function ListaVendas() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const router = useRouter()

  useEffect(() => {
    const carregarVendas = async () => {
      const vendasCarregadas = await obterVendas()
      setVendas(vendasCarregadas)
    }
    carregarVendas()
  }, [])

  const handleStatusChange = async (id: string, novoStatus: "pendente" | "pago") => {
    const result = await atualizarStatusPagamento(id, novoStatus)
    if (result.success) {
      setVendas(vendas.map((venda) => (venda.id === id ? { ...venda, statusPagamento: novoStatus } : venda)))
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Vendas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sabor</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Preço Unitário</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendas.map((venda) => (
              <TableRow key={venda.id}>
                <TableCell>{venda.sabor}</TableCell>
                <TableCell>{venda.tipo === "fatia" ? "Fatia" : "Torta Inteira"}</TableCell>
                <TableCell>{venda.quantidade}</TableCell>
                <TableCell>{formatarMoeda(venda.preco)}</TableCell>
                <TableCell>{formatarMoeda(venda.quantidade * venda.preco)}</TableCell>
                <TableCell>{venda.cliente}</TableCell>
                <TableCell>{new Date(venda.data).toLocaleString("pt-BR")}</TableCell>
                <TableCell>
                  <Badge variant={venda.statusPagamento === "pago" ? "success" : "destructive"}>
                    {venda.statusPagamento === "pago" ? "Pago" : "Pendente"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    defaultValue={venda.statusPagamento}
                    onValueChange={(value) => handleStatusChange(venda.id, value as "pendente" | "pago")}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Alterar status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

