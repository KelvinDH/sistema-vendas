"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { ModalSucesso } from "./modal-sucesso"
import { db } from "../db"
import type { TipoVenda, StatusPagamento, Venda } from "@/lib/utils"

export function AdicionarVenda() {
  const [error, setError] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [formValues, setFormValues] = useState({
    sabor: "",
    tipo: "fatia" as TipoVenda,
    quantidade: "",
    preco: "",
    cliente: "",
    statusPagamento: "pendente" as StatusPagamento,
    data: new Date(),
  })
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const { sabor, tipo, quantidade, preco, cliente, statusPagamento, data } = formValues

    if (!sabor || !tipo || !quantidade || !preco || !cliente || !statusPagamento || !data) {
      setError("Todos os campos são obrigatórios")
      return
    }

    const novaVenda: Omit<Venda, "id"> = {
      sabor,
      tipo,
      quantidade: Number(quantidade),
      preco: Number(preco),
      data: data.toISOString(),
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
        // Limpar os campos do formulário
        setFormValues({
          sabor: "",
          tipo: "fatia",
          quantidade: "",
          preco: "",
          cliente: "",
          statusPagamento: "pendente",
          data: new Date(),
        })
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
              <Input
                id="sabor"
                name="sabor"
                value={formValues.sabor}
                onChange={(e) => setFormValues((prev) => ({ ...prev, sabor: e.target.value }))}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Venda</Label>
              <Select
                onValueChange={(value) => setFormValues((prev) => ({ ...prev, tipo: value as TipoVenda }))}
                value={formValues.tipo}
              >
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
              <Input
                id="quantidade"
                name="quantidade"
                type="number"
                min="1"
                value={formValues.quantidade}
                onChange={(e) => setFormValues((prev) => ({ ...prev, quantidade: e.target.value }))}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preco">Preço Unitário (R$)</Label>
              <Input
                id="preco"
                name="preco"
                type="number"
                step="0.01"
                min="0"
                value={formValues.preco}
                onChange={(e) => setFormValues((prev) => ({ ...prev, preco: e.target.value }))}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cliente">Nome do Cliente</Label>
              <Input
                id="cliente"
                name="cliente"
                value={formValues.cliente}
                onChange={(e) => setFormValues((prev) => ({ ...prev, cliente: e.target.value }))}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="statusPagamento">Status do Pagamento</Label>
              <Select
                onValueChange={(value) =>
                  setFormValues((prev) => ({ ...prev, statusPagamento: value as StatusPagamento }))
                }
                value={formValues.statusPagamento}
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
            <div className="space-y-2">
              <Label htmlFor="data">Data da Venda</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formValues.data && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formValues.data ? (
                      format(formValues.data, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formValues.data}
                    onSelect={(date) => setFormValues((prev) => ({ ...prev, data: date || new Date() }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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

