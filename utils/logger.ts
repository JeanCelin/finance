export function logger(message: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.log(message)
  }
}