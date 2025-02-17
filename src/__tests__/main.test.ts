import ReserveKit from '../main'
import { RESPONSE_STATUS } from '../interface'

describe('ReserveKit', () => {
	const mockPublicKey = 'test-key'
	let reserveKit: ReserveKit

	beforeEach(() => {
		reserveKit = new ReserveKit(mockPublicKey)
		;(global.fetch as jest.Mock).mockClear()
	})

	describe('constructor', () => {
		it('should initialize with default options', () => {
			expect(reserveKit.secretKey).toBe(mockPublicKey)
			expect(reserveKit.host).toBe('https://api.reservekit.io')
			expect(reserveKit.version).toBe('v1')
		})

		it('should throw error if secretKey is missing', () => {
			expect(() => new ReserveKit('')).toThrow(
				'ReserveKit: secretKey is missing',
			)
		})
	})

	describe('initService', () => {
		const mockServiceResponse = {
			data: {
				id: 1,
				name: 'Test Service',
				provider_id: 'test-provider',
				description: null,
				version: 1,
				created_at: new Date(),
				updated_at: new Date(),
			},
			status: RESPONSE_STATUS.SUCCESS,
		}

		beforeEach(() => {
			;(global.fetch as jest.Mock).mockImplementationOnce(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockServiceResponse),
				}),
			)
		})

		it('should initialize service successfully', async () => {
			await reserveKit.initService(1)
			expect(reserveKit.service).toBeTruthy()
			expect(reserveKit.service?.id).toBe(1)
		})
	})
})
