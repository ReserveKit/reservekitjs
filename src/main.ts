import ApiClient from './api'
import { DEFAULT_HOST, DEFAULT_VERSION, SERVICE_ENDPOINT } from './consts'
import { IService, ReserveKitOptions } from './interface'
import ServiceClient from './service'

export default class ReserveKit {
	public host: string
	public version: string
	public secretKey: string
	public apiClient: ApiClient
	public service: ServiceClient | null = null

	public serviceId: number

	constructor(secretKey: string, opts: ReserveKitOptions = {}) {
		if (!secretKey) {
			throw new Error('ReserveKit: secretKey is missing')
		}

		this.secretKey = secretKey
		this.host = opts.host || DEFAULT_HOST
		this.version = opts.version || DEFAULT_VERSION
		this.apiClient = new ApiClient(this)
	}

	public async initService(serviceId: number) {
		const res = await this.apiClient?.request<IService>({
			type: 'get',
			url:
				this.host +
				'/' +
				this.version +
				'/' +
				SERVICE_ENDPOINT +
				'/' +
				serviceId,
		})

		if (res?.data) {
			this.service = new ServiceClient(this, res.data)
			return
		} else {
			throw new Error(res?.error || 'service error')
		}
	}
}
