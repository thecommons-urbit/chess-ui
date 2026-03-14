declare module 'urbit-ob' {
  function isValidPatp(ship: string): boolean;
  function clan(ship: string): string;
}

declare module '*.svg' {
  const content: string
  export default content
}
