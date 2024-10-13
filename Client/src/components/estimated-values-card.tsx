'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EstimatedValuesCard() {
  return (
    <Card className="w-[300px] mb-4">
      <CardHeader>
        <CardTitle>Estimated Values</CardTitle>
        <p className="text-sm text-muted-foreground">Generated in 10s</p>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Estimated Print Cost</span>
          <span className="text-lg font-semibold text-orange-500">Rs. 5000.00</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Print Duration</span>
          <span className="text-sm">6hr 18m</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Material Weight</span>
          <span className="text-sm">300g</span>
        </div>
      </CardContent>
    </Card>
  )
}