"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ModalSucesso } from "./modal-sucesso"
import { db } from "../db"
import type { TipoVenda, StatusPagamento, Venda } from "@/lib/utils"

export function AdicionarVenda() {
  const [error, setError] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [tipo, setTipo] = useState<TipoVenda>("fatia")
  const [statusPagamento, setStatusPagamento] = useState<StatusPagamento>("pendente")
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)
    const sabor = formData.get("sabor") as string
    const quantidade = Number(formData.get("quantidade"))
    const preco = Number(formData.get("preco"))
    const cliente = formData.get("cliente") as string

    if (!sabor || !tipo || isNaN(quantidade) || isNaN(preco) || !cliente || !statusPagamento) {
      setError("Todos os campos são obrigatórios")
      return
    }

    const novaVenda: Omit<Venda, "id"> = {
      sabor,
      tipo,
      quantidade,
      preco,
      data: new Date().toISOString(),
      cliente,
      statusPagamento,
    }

    try {
      console.log("Enviando nova venda:", JSON.stringify(novaVenda, null, 2))
      const result = await db.adicionarVenda(novaVenda)
      console.log("Resultado da adição:", JSON.stringify(result, null, 2))
      if ("error" in result) {
        throw new Error(result.error)
      } else {
        console.log("Venda adicionada com sucesso:", result)
        setShowSuccessModal(true)
        router.refresh()
        if (event.currentTarget instanceof HTMLFormElement) {
          event.currentTarget.reset()
        }
        setTipo("fatia")
        setStatusPagamento("pendente")
      }
    } catch (error) {
      console.error("Erro ao adicionar venda:", error)
      setError(
        error instanceof Error ? error.message : "Ocorreu um erro ao adicionar a venda. Por favor, tente novamente.",
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Venda</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </CardContent>
      <ModalSucesso isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
    </Card>
  )
}

