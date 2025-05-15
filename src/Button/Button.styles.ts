import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

const buttonStyles = cva(
  [
    'flex',
    'flex-wrap',
    'justify-between',
    'items-center',
    'font-normal',
    'border',
    'transition-all',
    'duration-300',
    'outline-none',
    'active:enabled:outline',
    'active:enabled:outline-4',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
  ],
  {
    variants: {
      color: {
        red: '',
        orange: '',
        amber: '',
        yellow: '',
        lime: '',
        green: '',
        emerald: '',
        teal: '',
        cyan: '',
        sky: '',
        blue: '',
        indigo: '',
        violet: '',
        purple: '',
        fuchsia: '',
        pink: '',
        rose: '',
        slate: '',
        gray: '',
        zinc: '',
        neutral: '',
        stone: '',
      },
      loading: {
        false: undefined,
        true: 'relative cursor-not-allowed opacity-50',
      },
      size: {
        sm: 'text-xs py-0 px-3 gap-3 h-[37px] rounded',
        md: 'text-sm py-0 px-3 gap-3 h-[42px] rounded-md',
        lg: 'text-base py-0 px-5 gap-3 h-[52px] rounded-lg',
      },
      variant: {
        primary: 'text-white/85',
        secondary: 'bg-transparent',
        ghost:
          'bg-transparent border-0 active:enabled:outline-none rounded-none',
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        color: 'red',
        className:
          'bg-red-500 border-red-500 hover:enabled:bg-red-600 hover:enabled:border-red-600 active:enabled:outline-red-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'orange',
        className:
          'bg-orange-500 border-orange-500 hover:enabled:bg-orange-600 hover:enabled:border-orange-600 active:enabled:outline-orange-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'amber',
        className:
          'bg-amber-500 border-amber-500 hover:enabled:bg-amber-600 hover:enabled:border-amber-600 active:enabled:outline-amber-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'yellow',
        className:
          'bg-yellow-500 border-yellow-500 hover:enabled:bg-yellow-600 hover:enabled:border-yellow-600 active:enabled:outline-yellow-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'lime',
        className:
          'bg-lime-500 border-lime-500 hover:enabled:bg-lime-600 hover:enabled:border-lime-600 active:enabled:outline-lime-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'green',
        className:
          'bg-green-500 border-green-500 hover:enabled:bg-green-600 hover:enabled:border-green-600 active:enabled:outline-green-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'emerald',
        className:
          'bg-emerald-500 border-emerald-500 hover:enabled:bg-emerald-600 hover:enabled:border-emerald-600 active:enabled:outline-emerald-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'teal',
        className:
          'bg-teal-500 border-teal-500 hover:enabled:bg-teal-600 hover:enabled:border-teal-600 active:enabled:outline-teal-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'cyan',
        className:
          'bg-cyan-500 border-cyan-500 hover:enabled:bg-cyan-600 hover:enabled:border-cyan-600 active:enabled:outline-cyan-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'sky',
        className:
          'bg-sky-500 border-sky-500 hover:enabled:bg-sky-600 hover:enabled:border-sky-600 active:enabled:outline-sky-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'blue',
        className:
          'bg-blue-500 border-blue-500 hover:enabled:bg-blue-600 hover:enabled:border-blue-600 active:enabled:outline-blue-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'indigo',
        className:
          'bg-indigo-500 border-indigo-500 hover:enabled:bg-indigo-600 hover:enabled:border-indigo-600 active:enabled:outline-indigo-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'violet',
        className:
          'bg-violet-500 border-violet-500 hover:enabled:bg-violet-600 hover:enabled:border-violet-600 active:enabled:outline-violet-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'purple',
        className:
          'bg-purple-500 border-purple-500 hover:enabled:bg-purple-600 hover:enabled:border-purple-600 active:enabled:outline-purple-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'fuchsia',
        className:
          'bg-fuchsia-500 border-fuchsia-500 hover:enabled:bg-fuchsia-600 hover:enabled:border-fuchsia-600 active:enabled:outline-fuchsia-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'pink',
        className:
          'bg-pink-500 border-pink-500 hover:enabled:bg-pink-600 hover:enabled:border-pink-600 active:enabled:outline-pink-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'rose',
        className:
          'bg-rose-500 border-rose-500 hover:enabled:bg-rose-600 hover:enabled:border-rose-600 active:enabled:outline-rose-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'slate',
        className:
          'bg-slate-500 border-slate-500 hover:enabled:bg-slate-600 hover:enabled:border-slate-600 active:enabled:outline-slate-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'gray',
        className:
          'bg-gray-500 border-gray-500 hover:enabled:bg-gray-600 hover:enabled:border-gray-600 active:enabled:outline-gray-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'zinc',
        className:
          'bg-zinc-500 border-zinc-500 hover:enabled:bg-zinc-600 hover:enabled:border-zinc-600 active:enabled:outline-zinc-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'neutral',
        className:
          'bg-neutral-500 border-neutral-500 hover:enabled:bg-neutral-600 hover:enabled:border-neutral-600 active:enabled:outline-neutral-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'primary',
        color: 'stone',
        className:
          'bg-stone-500 border-stone-500 hover:enabled:bg-stone-600 hover:enabled:border-stone-600 active:enabled:outline-stone-200 [&_#spinner]:border-white/75 [&_#spinner]:border-r-white/25',
      },
      {
        variant: 'secondary',
        color: 'red',
        className:
          'border-red-500 text-red-500 hover:enabled:bg-red-500 hover:enabled:border-red-500 hover:enabled:text-red-100 active:enabled:outline-red-200 [&_#spinner]:border-red-500/75 [&_#spinner]:border-r-red-500/25',
      },
      {
        variant: 'secondary',
        color: 'orange',
        className:
          'border-orange-500 text-orange-500 hover:enabled:bg-orange-500 hover:enabled:border-orange-500 hover:enabled:text-orange-100 active:enabled:outline-orange-200 [&_#spinner]:border-orange-500/75 [&_#spinner]:border-r-orange-500/25',
      },
      {
        variant: 'secondary',
        color: 'amber',
        className:
          'border-amber-500 text-amber-500 hover:enabled:bg-amber-500 hover:enabled:border-amber-500 hover:enabled:text-amber-100 active:enabled:outline-amber-200 [&_#spinner]:border-amber-500/75 [&_#spinner]:border-r-amber-500/25',
      },
      {
        variant: 'secondary',
        color: 'yellow',
        className:
          'border-yellow-500 text-yellow-500 hover:enabled:bg-yellow-500 hover:enabled:border-yellow-500 hover:enabled:text-yellow-100 active:enabled:outline-yellow-200 [&_#spinner]:border-yellow-500/75 [&_#spinner]:border-r-yellow-500/25',
      },
      {
        variant: 'secondary',
        color: 'lime',
        className:
          'border-lime-500 text-lime-500 hover:enabled:bg-lime-500 hover:enabled:border-lime-500 hover:enabled:text-lime-100 active:enabled:outline-lime-200 [&_#spinner]:border-lime-500/75 [&_#spinner]:border-r-lime-500/25',
      },
      {
        variant: 'secondary',
        color: 'green',
        className:
          'border-green-500 text-green-500 hover:enabled:bg-green-500 hover:enabled:border-green-500 hover:enabled:text-green-100 active:enabled:outline-green-200 [&_#spinner]:border-green-500/75 [&_#spinner]:border-r-green-500/25',
      },
      {
        variant: 'secondary',
        color: 'emerald',
        className:
          'border-emerald-500 text-emerald-500 hover:enabled:bg-emerald-500 hover:enabled:border-emerald-500 hover:enabled:text-emerald-100 active:enabled:outline-emerald-200 [&_#spinner]:border-emerald-500/75 [&_#spinner]:border-r-emerald-500/25',
      },
      {
        variant: 'secondary',
        color: 'teal',
        className:
          'border-teal-500 text-teal-500 hover:enabled:bg-teal-500 hover:enabled:border-teal-500 hover:enabled:text-teal-100 active:enabled:outline-teal-200 [&_#spinner]:border-teal-500/75 [&_#spinner]:border-r-teal-500/25',
      },
      {
        variant: 'secondary',
        color: 'cyan',
        className:
          'border-cyan-500 text-cyan-500 hover:enabled:bg-cyan-500 hover:enabled:border-cyan-500 hover:enabled:text-cyan-100 active:enabled:outline-cyan-200 [&_#spinner]:border-cyan-500/75 [&_#spinner]:border-r-cyan-500/25',
      },
      {
        variant: 'secondary',
        color: 'sky',
        className:
          'border-sky-500 text-sky-500 hover:enabled:bg-sky-500 hover:enabled:border-sky-500 hover:enabled:text-sky-100 active:enabled:outline-sky-200 [&_#spinner]:border-sky-500/75 [&_#spinner]:border-r-sky-500/25',
      },
      {
        variant: 'secondary',
        color: 'blue',
        className:
          'border-blue-500 text-blue-500 hover:enabled:bg-blue-500 hover:enabled:border-blue-500 hover:enabled:text-blue-100 active:enabled:outline-blue-200 [&_#spinner]:border-blue-500/75 [&_#spinner]:border-r-blue-500/25',
      },
      {
        variant: 'secondary',
        color: 'indigo',
        className:
          'border-indigo-500 text-indigo-500 hover:enabled:bg-indigo-500 hover:enabled:border-indigo-500 hover:enabled:text-indigo-100 active:enabled:outline-indigo-200 [&_#spinner]:border-indigo-500/75 [&_#spinner]:border-r-indigo-500/25',
      },
      {
        variant: 'secondary',
        color: 'violet',
        className:
          'border-violet-500 text-violet-500 hover:enabled:bg-violet-500 hover:enabled:border-violet-500 hover:enabled:text-violet-100 active:enabled:outline-violet-200 [&_#spinner]:border-violet-500/75 [&_#spinner]:border-r-violet-500/25',
      },
      {
        variant: 'secondary',
        color: 'purple',
        className:
          'border-purple-500 text-purple-500 hover:enabled:bg-purple-500 hover:enabled:border-purple-500 hover:enabled:text-purple-100 active:enabled:outline-purple-200 [&_#spinner]:border-purple-500/75 [&_#spinner]:border-r-purple-500/25',
      },
      {
        variant: 'secondary',
        color: 'fuchsia',
        className:
          'border-fuchsia-500 text-fuchsia-500 hover:enabled:bg-fuchsia-500 hover:enabled:border-fuchsia-500 hover:enabled:text-fuchsia-100 active:enabled:outline-fuchsia-200 [&_#spinner]:border-fuchsia-500/75 [&_#spinner]:border-r-fuchsia-500/25',
      },
      {
        variant: 'secondary',
        color: 'pink',
        className:
          'border-pink-500 text-pink-500 hover:enabled:bg-pink-500 hover:enabled:border-pink-500 hover:enabled:text-pink-100 active:enabled:outline-pink-200 [&_#spinner]:border-pink-500/75 [&_#spinner]:border-r-pink-500/25',
      },
      {
        variant: 'secondary',
        color: 'rose',
        className:
          'border-rose-500 text-rose-500 hover:enabled:bg-rose-500 hover:enabled:border-rose-500 hover:enabled:text-rose-100 active:enabled:outline-rose-200 [&_#spinner]:border-rose-500/75 [&_#spinner]:border-r-rose-500/25',
      },
      {
        variant: 'secondary',
        color: 'slate',
        className:
          'border-slate-500 text-slate-500 hover:enabled:bg-slate-500 hover:enabled:border-slate-500 hover:enabled:text-slate-100 active:enabled:outline-slate-200 [&_#spinner]:border-slate-500/75 [&_#spinner]:border-r-slate-500/25',
      },
      {
        variant: 'secondary',
        color: 'gray',
        className:
          'border-gray-500 text-gray-500 hover:enabled:bg-gray-500 hover:enabled:border-gray-500 hover:enabled:text-gray-100 active:enabled:outline-gray-200 [&_#spinner]:border-gray-500/75 [&_#spinner]:border-r-gray-500/25',
      },
      {
        variant: 'secondary',
        color: 'zinc',
        className:
          'border-zinc-500 text-zinc-500 hover:enabled:bg-zinc-500 hover:enabled:border-zinc-500 hover:enabled:text-zinc-100 active:enabled:outline-zinc-200 [&_#spinner]:border-zinc-500/75 [&_#spinner]:border-r-zinc-500/25',
      },
      {
        variant: 'secondary',
        color: 'neutral',
        className:
          'border-neutral-500 text-neutral-500 hover:enabled:bg-neutral-500 hover:enabled:border-neutral-500 hover:enabled:text-neutral-100 active:enabled:outline-neutral-200 [&_#spinner]:border-neutral-500/75 [&_#spinner]:border-r-neutral-500/25',
      },
      {
        variant: 'secondary',
        color: 'stone',
        className:
          'border-stone-500 text-stone-500 hover:enabled:bg-stone-500 hover:enabled:border-stone-500 hover:enabled:text-stone-100 active:enabled:outline-stone-200 [&_#spinner]:border-stone-500/75 [&_#spinner]:border-r-stone-500/25',
      },
      {
        variant: 'ghost',
        color: 'red',
        className: 'text-red-500 active:enabled:outline-none',
      },
      {
        variant: 'ghost',
        color: 'orange',
        className: 'text-orange-500 active:enabled:outline-none',
      },
      {
        variant: 'ghost',
        color: 'amber',
        className: 'text-amber-500',
      },
      {
        variant: 'ghost',
        color: 'yellow',
        className: 'text-yellow-500',
      },
      {
        variant: 'ghost',
        color: 'lime',
        className: 'text-lime-500',
      },
      {
        variant: 'ghost',
        color: 'green',
        className: 'text-green-500',
      },
      {
        variant: 'ghost',
        color: 'emerald',
        className: 'text-emerald-500',
      },
      {
        variant: 'ghost',
        color: 'teal',
        className: 'text-teal-500',
      },
      {
        variant: 'ghost',
        color: 'cyan',
        className: 'text-cyan-500',
      },
      {
        variant: 'ghost',
        color: 'sky',
        className: 'text-sky-500',
      },
      {
        variant: 'ghost',
        color: 'blue',
        className: 'text-blue-500',
      },
      {
        variant: 'ghost',
        color: 'indigo',
        className: 'text-indigo-500',
      },
      {
        variant: 'ghost',
        color: 'violet',
        className: 'text-violet-500',
      },
      {
        variant: 'ghost',
        color: 'purple',
        className: 'text-purple-500',
      },
      {
        variant: 'ghost',
        color: 'fuchsia',
        className: 'text-fuchsia-500',
      },
      {
        variant: 'ghost',
        color: 'pink',
        className: 'text-pink-500',
      },
      {
        variant: 'ghost',
        color: 'rose',
        className: 'text-rose-500',
      },
      {
        variant: 'ghost',
        color: 'slate',
        className: 'text-slate-500',
      },
      {
        variant: 'ghost',
        color: 'gray',
        className: 'text-gray-500',
      },
      {
        variant: 'ghost',
        color: 'zinc',
        className: 'text-zinc-500',
      },
      {
        variant: 'ghost',
        color: 'neutral',
        className: 'text-neutral-500',
      },
      {
        variant: 'ghost',
        color: 'stone',
        className: 'text-stone-500',
      },
    ],
    defaultVariants: {
      size: 'md',
      variant: 'primary',
      loading: false,
      color: 'stone',
    },
  }
)

export type VariantButtonProps = VariantProps<typeof buttonStyles>

export default buttonStyles
