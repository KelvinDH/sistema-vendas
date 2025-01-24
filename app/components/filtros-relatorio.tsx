"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

type FiltrosRelatorioProps = {
  onFilterChange: (startDate: Date | undefined, endDate: Date | undefined) => void
}

export function FiltrosRelatorio({ onFilterChange }: FiltrosRelatorioProps) {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const handleFilter = () => {
    onFilterChange(startDate, endDate)
  }

  const handleReset = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    onFilterChange(undefined, undefined)
  }

  return (
    <div className="flex flex-wrap gap-4 items-end mb-6">
      <div className="flex-1 space-y-2">
        <label className="text-sm font-medium">Data Inicial</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex-1 space-y-2">
        <label className="text-sm font-medium">Data Final</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>
      <Button onClick={handleFilter}>Filtrar</Button>
      <Button variant="outline" onClick={handleReset}>
        Limpar Filtros
      </Button>
    </div>
  )
}

