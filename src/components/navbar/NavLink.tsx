import type { MouseEvent, ReactNode } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

interface NavLinkProps {
  to: string
  isActive: boolean
  children: ReactNode
  onClick?: () => void
}

export function NavLink({ to, isActive, children, onClick }: NavLinkProps) {
  const isReservation = children === "Réservation"

  const handleClick = (event: MouseEvent) => {
    if (isActive) {
      event.preventDefault()
      return
    }

    if (onClick) onClick()
  }

  return (
    <Link
      to={to}
      className={cn(
        "px-3 py-2 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group hover:text-yellow-300",
        isActive ? "text-primary" : "text-white/80",
        isReservation && "hover:text-black"
      )}
      onClick={handleClick}
    >
      {isReservation && (
        <span className="absolute inset-0 bg-[#D2FF3F] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 z-0"></span>
      )}
      <span className="relative z-10">{children}</span>
    </Link>
  )
}
