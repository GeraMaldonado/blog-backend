const createErrorFactory = (name: string): new (message: string) => Error => {
  return class CustomizedError extends Error {
    constructor (message: string) {
      super(message)
      this.name = name
      Object.setPrototypeOf(this, new.target.prototype)
    }
  }
}

export const ValidationError = createErrorFactory('ValidationError')
