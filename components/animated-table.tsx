"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface AnimatedTableProps {
  rows: number
  cols: number
  isLoading?: boolean
}

interface CellData {
  id: string
  content: string
  isLoading: boolean
}

export function AnimatedTable({ rows, cols, isLoading = false }: AnimatedTableProps) {
  const [cellData, setCellData] = useState<CellData[][]>([])
  const [loadingCells, setLoadingCells] = useState<Set<string>>(new Set())

  // Generate cell data when dimensions change
  useEffect(() => {
    const newData: CellData[][] = []
    for (let i = 0; i < rows; i++) {
      const row: CellData[] = []
      for (let j = 0; j < cols; j++) {
        const id = `cell-${i}-${j}`
        row.push({
          id,
          content: `${i + 1},${j + 1}`,
          isLoading: false,
        })
      }
      newData.push(row)
    }
    setCellData(newData)
  }, [rows, cols])

  // Handle loading animation trigger
  useEffect(() => {
    if (isLoading) {
      const newLoadingCells = new Set<string>()

      // Randomly select cells to animate
      const totalCells = rows * cols
      const cellsToAnimate = Math.min(Math.floor(totalCells * 0.6), 20)

      for (let i = 0; i < cellsToAnimate; i++) {
        const randomRow = Math.floor(Math.random() * rows)
        const randomCol = Math.floor(Math.random() * cols)
        const cellId = `cell-${randomRow}-${randomCol}`
        newLoadingCells.add(cellId)
      }

      setLoadingCells(newLoadingCells)

      // Stagger the loading completion
      Array.from(newLoadingCells).forEach((cellId, index) => {
        setTimeout(
          () => {
            setLoadingCells((prev) => {
              const newSet = new Set(prev)
              newSet.delete(cellId)
              return newSet
            })
          },
          1000 + index * 200,
        )
      })
    }
  }, [isLoading, rows, cols])

  return (
    <div className="overflow-hidden rounded-lg border border-border shadow-lg">
      <div
        className="grid gap-0 transition-all duration-700 ease-out"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(80px, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(60px, 1fr))`,
        }}
      >
        {cellData.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <AnimatedCell
              key={cell.id}
              content={cell.content}
              isLoading={loadingCells.has(cell.id)}
              delay={rowIndex * 50 + colIndex * 30}
              isHeader={rowIndex === 0 || colIndex === 0}
            />
          )),
        )}
      </div>
    </div>
  )
}

interface AnimatedCellProps {
  content: string
  isLoading: boolean
  delay: number
  isHeader: boolean
}

function AnimatedCell({ content, isLoading, delay, isHeader }: AnimatedCellProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={cn(
        "relative border-r border-b border-border transition-all duration-500 ease-out",
        "hover:bg-accent/50 hover:scale-105 hover:z-10 hover:shadow-md",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
        isHeader ? "bg-muted font-semibold" : "bg-card",
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="h-full w-full flex items-center justify-center p-3 relative overflow-hidden">
        {isLoading ? (
          <LoadingAnimation />
        ) : (
          <span className={cn("transition-all duration-300", isHeader ? "text-muted-foreground" : "text-foreground")}>
            {content}
          </span>
        )}
      </div>
    </div>
  )
}

function LoadingAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer" />

      {/* Pulsing dots */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
      </div>

      {/* Rotating border */}
      <div className="absolute inset-0 border-2 border-transparent border-t-primary rounded animate-spin" />
    </div>
  )
}
