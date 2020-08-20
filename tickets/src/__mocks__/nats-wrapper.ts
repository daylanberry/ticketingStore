export const natsWrapper = {
  client: {
    publish: (subjct: string, data: string, callback: () => void) => {
      callback()
    },
  },
}