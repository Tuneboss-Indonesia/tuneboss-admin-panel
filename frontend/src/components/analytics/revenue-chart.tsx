"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

type RevenueDataPoint = { name: string; total: number }

export function RevenueChart({ revenueData, revenueChartConfig }: { revenueData: RevenueDataPoint[]; revenueChartConfig: ChartConfig }) {
  return (
    <ChartContainer config={revenueChartConfig} className="h-[300px] w-full">
      <AreaChart
        data={revenueData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tickMargin={10}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          tickFormatter={(value: number) => `Rp ${value / 1000000}M`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area 
          type="monotone" 
          dataKey="total" 
          stroke="var(--color-total)" 
          fillOpacity={1} 
          fill="url(#fillRevenue)" 
        />
      </AreaChart>
    </ChartContainer>
  )
}
