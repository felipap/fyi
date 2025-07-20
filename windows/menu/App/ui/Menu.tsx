// Components that mimic the macOS menu UI.

import { twMerge } from 'tailwind-merge'

interface MenuItemProps {
  label: string
  disabled?: boolean
  onClick?: () => void
  shortcut?: string
}

export function MenuItem({
  label,
  disabled,
  onClick,
  shortcut,
}: MenuItemProps) {
  return (
    <div
      className={twMerge(
        '[app-region:no-drag] h-[23px] mx-[5px] px-[6px] flex items-center justify-between cursor-default group',
        onClick && 'hover:bg-[#1044de] hover:text-white rounded-[5px]',
        disabled && 'text-contrast/50'
      )}
      onClick={onClick}
    >
      <span className="text-[13.5px] font-display-3p">{label}</span>
      {shortcut && (
        <span className="text-[13px] font-display-3p text-contrast/30 group-hover:text-white">
          {shortcut}
        </span>
      )}
    </div>
  )
}

export function MenuSeparator() {
  return (
    <div className="h-[1px] my-[3px] mx-[10px] bg-black/10 dark:bg-white/10" />
  )
}

export function Menu({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={twMerge(
        'py-[3px] select-none',
        'flex flex-col gap-0',
        'border border-white/20 h-full rounded-[10px] ',
        className
      )}
    >
      {children}
    </div>
  )
}
