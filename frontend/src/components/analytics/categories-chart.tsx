"use client"

import * as React from "react"
import { PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

type CategoryDataPoint = { name: string; value: number; color: string }

export function CategoriesChart({ categoryData, categoryChartConfig }: { categoryData: CategoryDataPoint[]; categoryChartConfig: ChartConfig }) {
  return (
    <ChartContainer config={categoryChartConfig} className="h-[250px] w-full">
      <PieChart>
        <Pie
          data={categoryData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
        >
          {categoryData.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={entry.color} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
      </PieChart>
    </ChartContainer>
  )
}
