import { NavLink } from "./NavLink"

interface DesktopNavProps {
  navLinks: Array<{ name: string; path: string }>
  currentPath: string
}

export function DesktopNav({ navLinks, currentPath }: DesktopNavProps) {
  return (
    <ul className="flex items-center justify-center space-x-1 lg:space-x-4">
      {navLinks.map((link) => (
        <li key={link.path}>
          <NavLink to={link.path} isActive={currentPath === link.path}>
            {link.name}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}
