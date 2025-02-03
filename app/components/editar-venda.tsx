"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { db } from "../db"
import type { Venda } from "@/lib/utils"

interface EditarVendaProps {
  venda: Venda
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export function EditarVenda({ venda, isOpen, onClose, onSave }: EditarVendaProps) {
  const [editedVenda, setEditedVenda] = useState<Venda>(venda)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedVenda((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setEditedVenda((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await db.vendas.update(editedVenda.id, editedVenda)
      onSave()
      onClose()
    } catch (error) {
      console.error("Erro ao atualizar venda:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Venda</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sabor" className="text-right">
                Sabor
              </Label>
              <Input id="sabor" name="sabor" value={editedVenda.sabor} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipo" className="text-right">
                Tipo
              </Label>
              <Select onValueChange={(value) => handleSelectChange("tipo", value)} defaultValue={editedVenda.tipo}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fatia">Fatia</SelectItem>
                  <SelectItem value="inteira">Torta Inteira</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantidade" className="text-right">
                Quantidade
              </Label>
              <Input
                id="quantidade"
                name="quantidade"
                type="number"
                value={editedVenda.quantidade}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="preco" className="text-right">
                Preço
              </Label>
              <Input
                id="preco"
                name="preco"
                type="number"
                step="0.01"
                value={editedVenda.preco}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cliente" className="text-right">
                Cliente
              </Label>
              <Input
                id="cliente"
                name="cliente"
                value={editedVenda.cliente}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="statusPagamento" className="text-right">
                Status
              </Label>
              <Select
                onValueChange={(value) => handleSelectChange("statusPagamento", value)}
                defaultValue={editedVenda.statusPagamento}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

