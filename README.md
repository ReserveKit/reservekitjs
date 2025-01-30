# ReserveKit JS SDK

A JS library for ReserveKit API

## Usage

```js
const reserveKitClient = new ReserveKit('xXXxXXXxx')

// Get a service by its ID
await reserveKitClient.initService(1)

const serviceName = reserveKitClient.service.name
const serviceDescription = reserveKitClient.service.description
// ....other props

// Get time slots by its Service ID
const timeSlots = await reserveKitClient.service.getTimeSlots()

// Create a booking under that service
const booking = reserveKitClient.service.createBooking({
 customer_name: 'John',
 customer_email: 'john@example.com',
 customer_phone: '+111222334',
 date: '2020-10-10',
 timeSlotId: 1,
})
```
