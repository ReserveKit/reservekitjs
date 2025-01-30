import ServiceClient from '../service'
import ReserveKit from '../main'
import { IService, RESPONSE_STATUS } from '../interface'
import { DEFAULT_HOST, DEFAULT_VERSION } from '../consts'

describe('ServiceClient', () => {
	let serviceClient: ServiceClient
	let mockReserveKit: ReserveKit

	const mockService: IService = {
		id: 1,
		provider_id: 'provider-123',
		name: 'Test Service',
		description: 'Test Description',
		version: 1,
		created_at: new Date('2024-01-01'),
		updated_at: new Date('2024-01-01'),
	}

	beforeEach(() => {
		mockReserveKit = new ReserveKit('test-api-key')
		serviceClient = new ServiceClient(mockReserveKit, mockService)
		;(global.fetch as jest.Mock).mockClear()
	})

	describe('constructor', () => {
		it('should initialize with correct service data', () => {
			expect(serviceClient.id).toBe(mockService.id)
			expect(serviceClient.provider_id).toBe(mockService.provider_id)
			expect(serviceClient.name).toBe(mockService.name)
			expect(serviceClient.description).toBe(mockService.description)
			expect(serviceClient.version).toBe(mockService.version)
			expect(serviceClient.created_at).toEqual(mockService.created_at)
			expect(serviceClient.updated_at).toEqual(mockService.updated_at)
		})
	})

	describe('getTimeSlots', () => {
		const mockTimeSlots = {
			data: {
				time_slots: [
					{
						id: 1,
						service_id: 1,
						day_of_week: 1,
						start_time: new Date('2024-01-01T09:00:00'),
						end_time: new Date('2024-01-01T10:00:00'),
						max_bookings: 5,
						created_at: new Date('2024-01-01'),
						updated_at: new Date('2024-01-01'),
					},
				],
				pagination: null,
			},
			status: RESPONSE_STATUS.SUCCESS,
		}

		it('should fetch time slots successfully', async () => {
			;(global.fetch as jest.Mock).mockImplementationOnce(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockTimeSlots),
				}),
			)

			const timeSlots = await serviceClient.getTimeSlots()

			expect(timeSlots).toEqual(mockTimeSlots.data.time_slots)
			expect(global.fetch).toHaveBeenCalledWith(
				expect.stringContaining(
					`${DEFAULT_HOST}/${DEFAULT_VERSION}/time-slots`,
				),
				expect.any(Object),
			)
		})

		it('should throw error when API request fails', async () => {
			const errorMessage = 'Failed to fetch time slots'
			;(global.fetch as jest.Mock).mockImplementationOnce(() =>
				Promise.resolve({
					ok: false,
					json: () =>
						Promise.resolve({
							status: RESPONSE_STATUS.ERROR,
							error: errorMessage,
						}),
				}),
			)

			await expect(serviceClient.getTimeSlots()).rejects.toThrow(errorMessage)
		})
	})

	describe('createBooking', () => {
		const mockBookingPayload = {
			customer_name: 'John Doe',
			customer_email: 'john@example.com',
			customer_phone: '+1234567890',
			date: '2024-01-01',
			time_slot_id: 1,
		}

		const mockBookingResponse = {
			data: {
				id: 1,
				date: new Date('2024-01-01'),
				version: 1,
				service_id: 1,
				userId: 'user-123',
				customer_id: 1,
				time_slot_id: 1,
				created_at: new Date('2024-01-01'),
				updated_at: new Date('2024-01-01'),
			},
			status: RESPONSE_STATUS.SUCCESS,
		}

		it('should create booking successfully', async () => {
			;(global.fetch as jest.Mock).mockImplementationOnce(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockBookingResponse),
				}),
			)

			const booking = await serviceClient.createBooking(mockBookingPayload)

			expect(booking).toEqual(mockBookingResponse.data)
			expect(global.fetch).toHaveBeenCalledWith(
				expect.stringContaining(`${DEFAULT_HOST}/${DEFAULT_VERSION}/bookings`),
				expect.objectContaining({
					method: 'POST',
					body: JSON.stringify(mockBookingPayload),
				}),
			)
		})

		it('should throw error when booking creation fails', async () => {
			const errorMessage = 'Booking creation failed'
			;(global.fetch as jest.Mock).mockImplementationOnce(() =>
				Promise.resolve({
					ok: false,
					json: () =>
						Promise.resolve({
							status: RESPONSE_STATUS.ERROR,
							error: errorMessage,
						}),
				}),
			)

			await expect(
				serviceClient.createBooking(mockBookingPayload),
			).rejects.toThrow(errorMessage)
		})
	})

	describe('buildUrl', () => {
		it('should build URL without query parameters', () => {
			const url = (serviceClient as any).buildUrl('test-endpoint')
			expect(url).toBe(`${DEFAULT_HOST}/${DEFAULT_VERSION}/test-endpoint`)
		})

		it('should build URL with query parameters', () => {
			const url = (serviceClient as any).buildUrl('test-endpoint', {
				param1: 'value1',
				param2: 123,
				param3: true,
			})

			expect(url).toContain(`${DEFAULT_HOST}/${DEFAULT_VERSION}/test-endpoint?`)
			expect(url).toContain('param1=value1')
			expect(url).toContain('param2=123')
			expect(url).toContain('param3=true')
		})

		it('should handle special characters in query parameters', () => {
			const url = (serviceClient as any).buildUrl('test-endpoint', {
				email: 'test@example.com',
				name: 'John Doe',
			})

			expect(url).toContain('email=test%40example.com')
			expect(url).toContain('name=John+Doe')
		})
	})
})
