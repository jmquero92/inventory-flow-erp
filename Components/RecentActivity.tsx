import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { ArrowUpRight, ArrowDownRight, Package, History } from "lucide-react"; // Iconos

export async function RecentActivity() {
  // 1. Buscamos los últimos 10 movimientos (aumentamos a 10 porque tenemos scroll)
  const logs = await prisma.stockLog.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      product: true
    }
  });

  return (
    <Card className="col-span-1 h-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Actividad Reciente
        </CardTitle>
        <CardDescription>
          Últimos movimientos de inventario registrados.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[400px] pr-4"> {/* Altura fija con scroll elegante */}
          <div className="space-y-4">
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay movimientos registrados aún.
              </p>
            ) : (
              logs.map((log) => {
                const isPositive = log.change > 0;
                
                return (
                  <div key={log.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      {/* Icono dinámico según si sube o baja */}
                      <div className={`
                        p-2 rounded-full 
                        ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
                      `}>
                        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {log.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {log.reason}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {/* Badge con color condicional */}
                      <Badge variant={isPositive ? "outline" : "destructive"} className={isPositive ? "text-green-600 border-green-600 bg-green-50" : ""}>
                        {isPositive ? "+" : ""}{log.change}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}