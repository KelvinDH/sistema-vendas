"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"

interface PrintButtonProps {
  contentRef: React.RefObject<HTMLDivElement>
}

export function PrintButton({ contentRef }: PrintButtonProps) {
  const handlePrint = () => {
    if (contentRef.current) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write("<html><head><title>Relatório de Vendas</title>")
        printWindow.document.write("<style>body { font-family: Arial, sans-serif; }</style>")
        printWindow.document.write("</head><body>")
        printWindow.document.write(contentRef.current.innerHTML)
        printWindow.document.write("</body></html>")
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  return (
    <Button variant="secondary" onClick={handlePrint} className="flex items-center gap-2">
      <FileDown className="h-4 w-4" />
      Baixar PDF
    </Button>
  )
}

