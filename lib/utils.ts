import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type TipoVenda = "fatia" | "inteira"
export type StatusPagamento = "pendente" | "pago"

export type Venda = {
  id: string
  sabor: string
  tipo: TipoVenda
  quantidade: number
  preco: number
  data: Date
  cliente: string
  statusPagamento: StatusPagamento
}

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor)
}

