import ApiClient from './api'
import { BOOKING_ENDPOINT, TIMESLOT_ENDPOINT } from './consts'
import {
	CreateBookingPayload,
	IBooking,
	IService,
	ITimeSlot,
} from './interface'
import ReserveKit from './main'

export default class ServiceClient {
	public id: number
	public provider_id: string
	public name: string
	public description: string | null
	public timezone: string
	public version: number
	public created_at: Date
	public updated_at: Date
	private apiClient: ApiClient | null
	private host: string
	private apiVersion: string

	constructor(reserveKitClient: ReserveKit, service: IService) {
		this.id = service.id
		this.provider_id = service.provider_id
		this.name = service.name
		this.timezone = service.timezone
		this.description = service.description
		this.created_at = service.created_at
		this.updated_at = service.updated_at
		this.version = service.version
		this.apiClient = reserveKitClient.apiClient
		this.host = reserveKitClient.host
		this.apiVersion = reserveKitClient.version
	}

	/**
	 * Get available time slots for the service
	 * @returns Promise that resolves to an array of time slots
	 * @throws Error if time slots cannot be retrieved
	 */
	public async getTimeSlots() {
		const res = await this.apiClient?.request<{
			time_slots: ITimeSlot[]
			pagination: null
		}>({
			type: 'get',
			url: this.buildUrl(TIMESLOT_ENDPOINT, {
				service_id: this.id,
				no_pagination: true,
			}),
		})

		if (res?.data) {
			return res.data.time_slots
		}

		throw new Error(res?.error || "can't retrieve time slots")
	}

	/**
	 * Create a new booking for the service
	 * @param payload - The booking details
	 * @param payload.customer_name - Name of the customer
	 * @param payload.customer_email - Email of the customer
	 * @param payload.customer_phone - Phone number of the customer
	 * @param payload.date - Date of the booking (YYYY-MM-DD)
	 * @param payload.time_slot_id - ID of the selected time slot
	 * @returns Promise that resolves to the created booking
	 * @throws Error if booking creation fails
	 */
	public async createBooking(payload: CreateBookingPayload) {
		const res = await this.apiClient?.request<IBooking>({
			type: 'post',
			url: this.buildUrl(BOOKING_ENDPOINT, { service_id: this.id }),
			payload,
		})

		if (res?.data) {
			return res.data
		}

		throw new Error(res?.error || 'create booking error')
	}

	private buildUrl(
		endpoint: string,
		queryParams?: Record<string, string | number | Boolean>,
	) {
		const baseUrl = `${this.host}/${this.apiVersion}/${endpoint}`
		if (!queryParams) return baseUrl

		const params = new URLSearchParams()
		Object.entries(queryParams).forEach(([key, value]) => {
			params.append(key, String(value))
		})

		return `${baseUrl}?${params.toString()}`
	}
}
