import {
	ApiResponse,
	Dictionary,
	HandleRequest,
	RESPONSE_STATUS,
} from './interface'
import ReserveKit from './main'
import { getResponsePayload } from './utils'

export default class ApiClient {
	private config: ReserveKit

	constructor(config: ReserveKit) {
		this.config = config
	}

	private getHeaders() {
		const headers = {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + this.config.publicApiKey,
		}

		return headers
	}

	private requestApiInstance(reqData: HandleRequest) {
		switch (reqData.type) {
			case 'get':
				return this.get(reqData.url)
			case 'post':
				return this.post(reqData.url, reqData.payload || {})
			default:
				return this.get(reqData.url)
		}
	}

	private get(url: string) {
		return fetch(url, {
			method: 'GET',
			headers: this.getHeaders(),
		})
	}

	private post(url: string, payload: Dictionary) {
		return fetch(url, {
			method: 'POST',
			headers: this.getHeaders(),
			body: JSON.stringify(payload),
		})
	}

	async request<T>(reqData: HandleRequest): Promise<ApiResponse<T>> {
		try {
			const res = await this.requestApiInstance(reqData)
			const resData = await res.json()

			const resStatus =
				resData?.status ||
				(res.ok ? RESPONSE_STATUS.SUCCESS : RESPONSE_STATUS.ERROR)

			return getResponsePayload({
				status: resStatus,
				body: resData.data,
				statusCode: res.status,
				errorMessage: resData?.error,
			})
		} catch (err: any) {
			if (err instanceof Error) {
				console.error(err.message)
				return getResponsePayload({
					status: RESPONSE_STATUS.ERROR,
					statusCode: 500,
					errorMessage: err.message,
				})
			}
			// Handle unknown errors
			return getResponsePayload({
				status: RESPONSE_STATUS.ERROR,
				statusCode: 500,
				errorMessage: 'Unknown error occurred',
			})
		}
	}
}
