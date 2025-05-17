interface SigilProps {
  point: string
  size: number
  detail: string
  space: string
  background: string
  foreground: string
}

export { }

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'urbit-sigil': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & SigilProps,
        HTMLElement
      >
    }
  }
}
