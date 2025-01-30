import { ApiResponse, ResponseOptions } from './interface'

export function getResponsePayload<T>(options: ResponseOptions) {
	const response: ApiResponse<T> = { data: null, error: null }

	if (options.body) {
		response.data = options.body
	}

	if (options.errorMessage) {
		response.error = options.errorMessage
	}

	return response
}
