import ApiClient from '../api'
import { RESPONSE_STATUS } from '../interface'
import ReserveKit from '../main'

describe('ApiClient', () => {
	const mockReserveKit = new ReserveKit('test-key')
	let apiClient: ApiClient

	beforeEach(() => {
		apiClient = new ApiClient(mockReserveKit)
		;(global.fetch as jest.Mock).mockClear()
	})

	describe('request', () => {
		const mockSuccessResponse = {
			data: { test: true },
			status: RESPONSE_STATUS.SUCCESS,
		}

		it('should handle GET request successfully', async () => {
			;(global.fetch as jest.Mock).mockImplementationOnce(() =>
				Promise.resolve({
					ok: true,
					status: 200,
					json: () => Promise.resolve(mockSuccessResponse),
				}),
			)

			const response = await apiClient.request({
				type: 'get',
				url: 'test-url',
			})

			expect(response.data).toEqual({ test: true })
			expect(response.error).toBeNull()
		})

		it('should handle POST request successfully', async () => {
			;(global.fetch as jest.Mock).mockImplementationOnce(() =>
				Promise.resolve({
					ok: true,
					status: 200,
					json: () => Promise.resolve(mockSuccessResponse),
				}),
			)

			const response = await apiClient.request({
				type: 'post',
				url: 'test-url',
				payload: { data: 'test' },
			})

			expect(response.data).toEqual({ test: true })
			expect(response.error).toBeNull()
		})

		it('should handle network errors', async () => {
			;(global.fetch as jest.Mock).mockImplementationOnce(() =>
				Promise.reject(new Error('Network error')),
			)

			const response = await apiClient.request({
				type: 'get',
				url: 'test-url',
			})

			expect(response.data).toBeNull()
			expect(response.error).toBe('Network error')
		})

		it('should handle API errors', async () => {
			;(global.fetch as jest.Mock).mockImplementationOnce(() =>
				Promise.resolve({
					ok: false,
					status: 400,
					json: () =>
						Promise.resolve({
							status: RESPONSE_STATUS.ERROR,
							error: 'Bad Request',
							data: null,
						}),
				}),
			)

			const response = await apiClient.request({
				type: 'get',
				url: 'test-url',
			})

			expect(response.data).toBeNull()
			expect(response.error).toBe('Bad Request')
		})
	})
})
