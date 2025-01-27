import Dexie, { type Table } from "dexie"
import type { Venda } from "@/lib/utils"

class VendasDatabase extends Dexie {
  vendas!: Table<Venda>

  constructor() {
    super("VendasDatabase")
    this.version(1).stores({
      vendas: "++id, sabor, tipo, quantidade, preco, data, cliente, statusPagamento",
    })
  }
}

export const db = new VendasDatabase()

