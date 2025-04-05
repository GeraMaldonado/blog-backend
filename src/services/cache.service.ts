import NodeCache from 'node-cache'

export const cache = new NodeCache({ stdTTL: 300 })

export const setVerificationCache = (email: string, data: any): boolean => cache.set(email, data)

export const getVerificationCache = (email: string): string | undefined => cache.get(email)

export const deleteVerificationCache = (email: string): number => cache.del(email)
