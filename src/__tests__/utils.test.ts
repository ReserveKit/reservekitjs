import { getResponsePayload } from '../utils'
import { RESPONSE_STATUS } from '../interface'

describe('getResponsePayload', () => {
	it('should return empty response when no options provided', () => {
		const result = getResponsePayload({
			status: RESPONSE_STATUS.SUCCESS,
		})

		expect(result).toEqual({
			data: null,
			error: null,
		})
	})

	it('should set data when body is provided', () => {
		const mockData = { id: 1, name: 'Test' }
		const result = getResponsePayload({
			status: RESPONSE_STATUS.SUCCESS,
			body: mockData,
		})

		expect(result).toEqual({
			data: mockData,
			error: null,
		})
	})

	it('should set error when errorMessage is provided', () => {
		const errorMessage = 'Something went wrong'
		const result = getResponsePayload({
			status: RESPONSE_STATUS.ERROR,
			errorMessage,
		})

		expect(result).toEqual({
			data: null,
			error: errorMessage,
		})
	})

	it('should handle both data and error when provided', () => {
		const mockData = { id: 1, name: 'Test' }
		const errorMessage = 'Partial error'
		const result = getResponsePayload({
			status: RESPONSE_STATUS.ERROR,
			body: mockData,
			errorMessage,
		})

		expect(result).toEqual({
			data: mockData,
			error: errorMessage,
		})
	})

	it('should handle different data types for body', () => {
		// Test with array
		expect(
			getResponsePayload({
				status: RESPONSE_STATUS.SUCCESS,
				body: [1, 2, 3],
			}),
		).toEqual({
			data: [1, 2, 3],
			error: null,
		})

		// Test with string
		expect(
			getResponsePayload({
				status: RESPONSE_STATUS.SUCCESS,
				body: 'test string',
			}),
		).toEqual({
			data: 'test string',
			error: null,
		})

		// Test with number
		expect(
			getResponsePayload({
				status: RESPONSE_STATUS.SUCCESS,
				body: 42,
			}),
		).toEqual({
			data: 42,
			error: null,
		})
	})

	it('should handle optional statusCode', () => {
		const result = getResponsePayload({
			status: RESPONSE_STATUS.SUCCESS,
			statusCode: 200,
			body: { success: true },
		})

		expect(result).toEqual({
			data: { success: true },
			error: null,
		})
	})

	it('should handle optional errorType', () => {
		const result = getResponsePayload({
			status: RESPONSE_STATUS.ERROR,
			errorType: 'ValidationError',
			errorMessage: 'Invalid input',
		})

		expect(result).toEqual({
			data: null,
			error: 'Invalid input',
		})
	})

	it('should maintain type safety with generics', () => {
		interface TestType {
			id: number
			name: string
		}

		const result = getResponsePayload<TestType>({
			status: RESPONSE_STATUS.SUCCESS,
			body: {
				id: 1,
				name: 'Test',
			},
		})

		// TypeScript should recognize this as ApiResponse<TestType>
		expect(result.data?.id).toBe(1)
		expect(result.data?.name).toBe('Test')
	})
})
