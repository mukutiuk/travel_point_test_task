import type { ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: 'button' | 'span'
  variant?: 'primary' | 'soft' | 'text'
}
