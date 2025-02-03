"use client"

import { useState, useEffect } from "react"
import { type Venda, formatarMoeda } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { db } from "../db"
import { EditarVenda } from "./editar-venda"
import { format } from "date-fns"

export function ListaVendas() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [filteredVendas, setFilteredVendas] = useState<Venda[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingVenda, setEditingVenda] = useState<Venda | null>(null)
  const router = useRouter()

  useEffect(() => {
    const carregarVendas = async () => {
      const vendasCarregadas = await db.obterVendas()
      setVendas(vendasCarregadas)
      setFilteredVendas(vendasCarregadas)
    }
    carregarVendas()
  }, [])

  useEffect(() => {
    const filtered = vendas.filter(
      (venda) =>
        venda.sabor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venda.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venda.statusPagamento.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredVendas(filtered)
  }, [searchTerm, vendas])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleEdit = (venda: Venda) => {
    setEditingVenda(venda)
  }

  const handleSave = async () => {
    const vendasAtualizadas = await db.obterVendas()
    setVendas(vendasAtualizadas)
    setFilteredVendas(vendasAtualizadas)
    router.refresh()
  }

  const groupVendasByDate = (vendas: Venda[]) => {
    const grouped = vendas.reduce(
      (acc, venda) => {
        const date = format(new Date(venda.data), "dd/MM/yyyy")
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(venda)
        return acc
      },
      {} as Record<string, Venda[]>,
    )

    return Object.entries(grouped).sort(([dateA], [dateB]) => {
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })
  }

  const groupedVendas = groupVendasByDate(filteredVendas)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Vendas</CardTitle>
        <div className="mt-2">
          <Input placeholder="Buscar por sabor, cliente ou status..." value={searchTerm} onChange={handleSearch} />
        </div>
      </CardHeader>
      <CardContent>
        {groupedVendas.map(([date, vendas]) => (
          <div key={date} className="mb-8">
            <h3 className="text-lg font-semibold mb-2">{date}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sabor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Preço Unitário</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendas.map((venda) => (
                  <TableRow
                    key={venda.id}
                    onClick={() => handleEdit(venda)}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>{venda.sabor}</TableCell>
                    <TableCell>{venda.tipo === "fatia" ? "Fatia" : "Torta Inteira"}</TableCell>
                    <TableCell>{venda.quantidade}</TableCell>
                    <TableCell>{formatarMoeda(venda.preco)}</TableCell>
                    <TableCell>{formatarMoeda(venda.quantidade * venda.preco)}</TableCell>
                    <TableCell>{venda.cliente}</TableCell>
                    <TableCell>
                      <Badge variant={venda.statusPagamento === "pago" ? "success" : "destructive"}>
                        {venda.statusPagamento === "pago" ? "Pago" : "Pendente"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(venda)
                        }}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </CardContent>
      {editingVenda && (
        <EditarVenda
          venda={editingVenda}
          isOpen={!!editingVenda}
          onClose={() => setEditingVenda(null)}
          onSave={handleSave}
        />
      )}
    </Card>
  )
}

