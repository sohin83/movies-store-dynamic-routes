export function pickFields<T extends object>(
   data: T,
   allowed: string[] | readonly string[]
) {
   return Object.fromEntries(
      Object.entries(data).filter(([key]) => allowed.includes(key))
   );
}
