"use server"

import { db } from "./db"
import type { Venda, TipoVenda, StatusPagamento } from "@/lib/utils"

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
    sabor,
    tipo,
    quantidade,
    preco,
    data: new Date().toISOString(),
    cliente,
    statusPagamento,
  }

  try {
    await db.vendas.add(novaVenda)
    return { success: true }
  } catch (error) {
    console.error("Erro ao adicionar venda:", error)
    return { error: "Erro ao adicionar venda" }
  }
}

export async function obterVendas(startDate?: string, endDate?: string) {
  try {
    let vendas = await db.vendas.toArray()

    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999) // Set to end of day

      vendas = vendas.filter((venda) => {
        const vendaDate = new Date(venda.data)
        return vendaDate >= start && vendaDate <= end
      })
    }

    return vendas
  } catch (error) {
    console.error("Erro ao obter vendas:", error)
    return []
  }
}

export async function atualizarStatusPagamento(id: string, novoStatus: StatusPagamento) {
  try {
    await db.vendas.update(id, { statusPagamento: novoStatus })
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar status de pagamento:", error)
    return { error: "Erro ao atualizar status de pagamento" }
  }
}

