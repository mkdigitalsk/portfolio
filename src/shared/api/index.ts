import { AdminApi } from './AdminApi'
import { AuthApi } from './AuthApi'
import { LeadApi } from './LeadApi'
import { client } from './client'

export const adminApi = new AdminApi(client)
export const authApi = new AuthApi(client)
export const leadApi = new LeadApi(client)

export { httpStatus } from './httpStatus'
