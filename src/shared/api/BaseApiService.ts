import type { AxiosInstance, AxiosRequestConfig } from 'axios'

export abstract class BaseApiService {
  protected readonly http: AxiosInstance

  constructor(http: AxiosInstance) {
    this.http = http
  }

  protected _get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.http.get<T>(url, config).then((r) => r.data)
  }

  protected _post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return this.http.post<T>(url, data, config).then((r) => r.data)
  }

  protected _patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return this.http.patch<T>(url, data, config).then((r) => r.data)
  }

  protected _delete(url: string, config?: AxiosRequestConfig): Promise<void> {
    return this.http.delete(url, config).then(() => undefined)
  }
}
