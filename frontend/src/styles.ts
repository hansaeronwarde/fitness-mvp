const btnBase = 'inline-flex items-center gap-1.5 text-sm font-medium px-3.5 py-1.5 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap no-underline cursor-pointer'

export const btn = {
  primary: `${btnBase} bg-blue-600 text-white border-blue-600 hover:bg-blue-700`,
  secondary: `${btnBase} bg-white text-gray-700 border-gray-300 hover:bg-gray-50`,
  ghost: `${btnBase} text-gray-600 border-transparent hover:bg-gray-100`,
  danger: `${btnBase} bg-red-600 text-white border-red-600 hover:bg-red-700`,
  dangerOutline: `${btnBase} text-red-600 border-red-300 hover:bg-red-50`,
}

export const input = 'w-full text-sm px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 box-border'

export const card = 'border border-gray-200 rounded-xl p-5'

export const cardTitle = 'text-xs font-semibold uppercase tracking-wider mb-3 text-gray-500'

export const errorMsg = 'text-sm text-red-600 m-0'

export const muted = 'text-sm text-gray-500 m-0'
