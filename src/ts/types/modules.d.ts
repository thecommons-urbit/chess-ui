declare module '*.svg' {
  const content: string
  export default content
}

declare module 'urbit-ob' {
  function isValidPatp(ship: string): boolean;
}
