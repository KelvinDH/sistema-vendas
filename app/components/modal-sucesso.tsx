import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"

interface ModalSucessoProps {
  isOpen: boolean
  onClose: () => void
}

export function ModalSucesso({ isOpen, onClose }: ModalSucessoProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Venda Adicionada com Sucesso
          </DialogTitle>
        </DialogHeader>
        <p>A nova venda foi registrada no sistema.</p>
      </DialogContent>
    </Dialog>
  )
}

