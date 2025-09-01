import type React from "react"
interface FormSectionProps {
  title: string
  children: React.ReactNode
}

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="space-y-1 md:space-y-2">
      <h2 className="text-xs md:text-sm font-semibold text-gray-900">{title}</h2>
      {children}
    </div>
  )
}
