// Components that mimic the macOS menu UI.

import { twMerge } from 'tailwind-merge'

export function ExampleMenu() {
  return (
    <div className="flex flex-col h-screen text-contrast [app-region:drag] bg-white/50 dark:bg-transparent">
      <Menu>
        <MenuItem label="Something that the AI." onClick={() => {}} />
        <MenuSeparator />
        <MenuItem label="Settings..." shortcut="⌘ ," onClick={() => {}} />
        <MenuSeparator />
        <MenuItem disabled label="Version 1.0.0" onClick={() => {}} />
        <MenuItem label="Check for updates..." onClick={() => {}} />
        <MenuItem label="Quit" shortcut="⌘ Q" onClick={() => {}} />
      </Menu>
    </div>
  )
}

interface MenuItemProps {
  label: string
  disabled?: boolean
  onClick?: () => void
  shortcut?: string
  className?: string
}

export function MenuItem({
  label,
  disabled,
  onClick,
  shortcut,
  className,
}: MenuItemProps) {
  return (
    <div
      className={twMerge(
        '[app-region:no-drag] h-[23px] mx-[5px] px-[6px] flex items-center justify-between cursor-default group',
        onClick && 'hover:bg-[#1044de] hover:text-white rounded-[5px]',
        disabled && 'text-contrast/50',
        className
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
