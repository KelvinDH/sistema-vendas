import { type Venda, formatarMoeda } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ListaVendas({ vendas }: { vendas: Venda[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Vendas</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sabor</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Preço Unitário</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Pagamento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendas.map((venda) => (
              <TableRow key={venda.id}>
                <TableCell>{venda.sabor}</TableCell>
                <TableCell>{venda.tipo === "fatia" ? "Fatia" : "Torta Inteira"}</TableCell>
                <TableCell>{venda.quantidade}</TableCell>
                <TableCell>{formatarMoeda(venda.preco)}</TableCell>
                <TableCell>{formatarMoeda(venda.quantidade * venda.preco)}</TableCell>
                <TableCell>{venda.cliente}</TableCell>
                <TableCell>{venda.data.toLocaleString("pt-BR")}</TableCell>
                <TableCell>
                  <Badge variant={venda.statusPagamento === "pago" ? "success" : "destructive"}>
                    {venda.statusPagamento === "pago" ? "Pago" : "Pendente"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

