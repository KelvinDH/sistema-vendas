import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "./components/theme-toggle"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Sistema de Vendas de Tortas",
  description: "Gerencie suas vendas de tortas de forma eficiente",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} bg-background min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <header className="bg-primary text-primary-foreground shadow-md">
              <div className="container mx-auto py-4 px-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold">Sistema de Vendas de Tortas</h1>
                <ThemeToggle />
              </div>
            </header>
            <main className="flex-grow">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

