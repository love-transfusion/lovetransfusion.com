type util_scrollToSection_Types =
  | {
      clElementRef: React.RefObject<HTMLElement>
      clIDOrClass?: never
    }
  | {
      clIDOrClass: `#${string}` | `.${string}`
      clElementRef?: never
    }

export const util_scrollToSection = ({
  clIDOrClass,
  clElementRef,
}: util_scrollToSection_Types): void => {
  if (clIDOrClass) {
    const element = document.querySelector<HTMLElement>(clIDOrClass)
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  } else if (clElementRef?.current) {
    clElementRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}