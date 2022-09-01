type PossibleTypes = string | boolean | null | undefined
export type CXParams = (PossibleTypes | PossibleTypes[])[]

export function cx(...classes: CXParams): string {
  if (classes.length === 0) return ''

  return classes
    .flat()
    .map((cl) => {
      if (typeof cl === 'string') {
        const trimmed = cl.trim()
        if (trimmed !== '') return trimmed
      }
    })
    .filter(Boolean)
    .join(' ')
}
