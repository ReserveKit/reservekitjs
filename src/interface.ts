export type Dictionary = Record<string, unknown>

export enum RESPONSE_STATUS {
	SUCCESS = 'success',
	ERROR = 'error',
}

export interface ReserveKitOptions {
	host?: string
	version?: string
}

export interface HandleRequest {
	type: 'get' | 'post'
	url: string
	payload?: Dictionary
}

export interface ResponseOptions {
	status: RESPONSE_STATUS.ERROR | RESPONSE_STATUS.SUCCESS
	statusCode?: number
	body?: any
	errorMessage?: string
	errorType?: string
}

export interface Envelope<T> {
	data?: T | null
	error: string | null
}

export interface ApiResponse<T> extends Envelope<T> {}

export interface IService {
	id: number
	name: string
	description: string | null
	version: number
	provider_id: string
	created_at: Date
	updated_at: Date
}

export interface ITimeSlot {
	id: number
	service_id: number
	day_of_week: number
	start_time: Date
	end_time: Date
	max_bookings: number
	created_ad: Date
	updated_at: Date
}

export interface IBooking {
	id: number
	date: Date
	version: number
	service_id: number
	userId: string
	customer_id: number
	time_slot_id: number
	created_at: Date
	updated_at: Date
}

export interface CreateBookingPayload extends Dictionary {
	customer_name?: string | null
	customer_email?: string | null
	customer_phone?: string | null
	date: Date | string
	time_slot_id: number
}
