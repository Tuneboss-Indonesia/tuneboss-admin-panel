"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

type ProductDataPoint = { name: string; sales: number }

export function TopProductsChart({ productData, productChartConfig }: { productData: ProductDataPoint[]; productChartConfig: ChartConfig }) {
  return (
    <ChartContainer config={productChartConfig} className="h-[300px] w-full">
      <BarChart data={productData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          axisLine={false}
          tickLine={false}
          width={100}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Bar 
          dataKey="sales" 
          fill="var(--color-sales)" 
          radius={[0, 4, 4, 0]}
          barSize={32}
        />
      </BarChart>
    </ChartContainer>
  )
}
