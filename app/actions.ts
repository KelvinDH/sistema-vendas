"use server"

import type { Venda, TipoVenda, StatusPagamento } from "@/lib/utils"

const vendas: Venda[] = []

export async function adicionarVenda(formData: FormData) {
  const sabor = formData.get("sabor") as string
  const tipo = formData.get("tipo") as TipoVenda
  const quantidade = Number(formData.get("quantidade"))
  const preco = Number(formData.get("preco"))
  const cliente = formData.get("cliente") as string
  const statusPagamento = formData.get("statusPagamento") as StatusPagamento

  if (!sabor || !tipo || isNaN(quantidade) || isNaN(preco) || !cliente || !statusPagamento) {
    return { error: "Todos os campos são obrigatórios" }
  }

  const novaVenda: Venda = {
    id: Date.now().toString(),
    sabor,
    tipo,
    quantidade,
    preco,
    data: new Date(),
    cliente,
    statusPagamento,
  }

  vendas.push(novaVenda)
  return { success: true }
}

export async function obterVendas(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) {
    return vendas
  }

  const start = new Date(startDate)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999) // Set to end of day

  return vendas.filter((venda) => {
    const vendaDate = new Date(venda.data)
    return vendaDate >= start && vendaDate <= end
  })
}

