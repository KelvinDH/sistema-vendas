import Dexie, { type Table } from "dexie"
import type { Venda, StatusPagamento } from "@/lib/utils"

class VendasDatabase extends Dexie {
  vendas!: Table<Venda>

  constructor() {
    super("VendasDatabase")
    this.version(1).stores({
      vendas: "++id, sabor, tipo, quantidade, preco, data, cliente, statusPagamento",
    })
  }

  async adicionarVenda(venda: Omit<Venda, "id">) {
    try {
      console.log("Tentando adicionar venda:", JSON.stringify(venda, null, 2))
      const id = await this.vendas.add(venda)
      console.log("Venda adicionada com sucesso, ID:", id)
      return { success: true, id }
    } catch (error) {
      console.error("Erro ao adicionar venda:", error)
      return {
        error: "Erro ao adicionar venda",
        details: error instanceof Error ? error.message : String(error),
      }
    }
  }

  async obterVendas(startDate?: string, endDate?: string) {
    try {
      let vendas = await this.vendas.toArray()

      if (startDate && endDate) {
        const start = new Date(startDate)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)

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

  async atualizarVenda(id: string, venda: Partial<Venda>) {
    try {
      await this.vendas.update(id, venda)
      return { success: true }
    } catch (error) {
      console.error("Erro ao atualizar venda:", error)
      return { error: "Erro ao atualizar venda" }
    }
  }

  async atualizarStatusPagamento(id: string, novoStatus: StatusPagamento) {
    return this.atualizarVenda(id, { statusPagamento: novoStatus })
  }
}

export const db = new VendasDatabase()

