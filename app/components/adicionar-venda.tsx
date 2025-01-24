"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { adicionarVenda } from "../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TipoVenda, StatusPagamento } from "@/lib/utils"

export function AdicionarVenda() {
  const [error, setError] = useState<string | null>(null)
  const [tipo, setTipo] = useState<TipoVenda>("fatia")
  const [statusPagamento, setStatusPagamento] = useState<StatusPagamento>("pendente")
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    formData.append("tipo", tipo)
    formData.append("statusPagamento", statusPagamento)
    const result = await adicionarVenda(formData)
    if (result.error) {
      setError(result.error)
    } else {
      setError(null)
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Venda</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sabor">Sabor da Torta</Label>
              <Input id="sabor" name="sabor" required className="w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Venda</Label>
              <Select onValueChange={(value) => setTipo(value as TipoVenda)} defaultValue={tipo}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo de venda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fatia">Fatia</SelectItem>
                  <SelectItem value="inteira">Torta Inteira</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input id="quantidade" name="quantidade" type="number" min="1" required className="w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preco">Preço Unitário (R$)</Label>
              <Input id="preco" name="preco" type="number" step="0.01" min="0" required className="w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cliente">Nome do Cliente</Label>
              <Input id="cliente" name="cliente" required className="w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="statusPagamento">Status do Pagamento</Label>
              <Select
                onValueChange={(value) => setStatusPagamento(value as StatusPagamento)}
                defaultValue={statusPagamento}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o status do pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Adicionar Venda
          </Button>
          {error && <p className="text-destructive text-center">{error}</p>}
        </form>
      </CardContent>
    </Card>
  )
}

