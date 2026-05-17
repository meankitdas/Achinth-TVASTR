import { ICON_MAP } from '@/constants/iconMap'

export function IconResolver({ iconId }) {
  const Icon = ICON_MAP[iconId]
  if (!Icon) return null
  return <Icon />
}