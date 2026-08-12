# Chit Chats Shipping Integration — Implementation Guide

## Goal

Add shipping to a Next.js ecommerce project using **Chit Chats** so that:

* the customer can see shipping cost during checkout,
* the order can be sent to Chit Chats for label creation,
* the admin can view shipping status and tracking,
* the customer receives tracking details after fulfillment.

This document explains **what needs to be built**, **where it should live in the app**, and **how the flow should work end to end**.

---

## What the integration should do

At a minimum, the system should support these steps:

1. Customer enters shipping address at checkout.
2. Your backend calculates shipping options or a shipping fee.
3. Customer pays for the order.
4. After payment, your backend creates a shipment in Chit Chats.
5. Chit Chats returns a label and tracking number.
6. Your app stores the shipment data.
7. The admin can print the label, mark the order as fulfilled, and share tracking with the customer.

---

## Recommended architecture

Use a **server-controlled shipping flow**. Do not call Chit Chats directly from the browser.

### Frontend

* Next.js checkout page
* Shipping address form
* Shipping method selector or fixed shipping fee display
* Order confirmation page
* Order tracking page for customers
* Admin order details page

### Backend

* API route or server action to calculate shipping
* API route or server action to create shipment draft
* API route or server action to purchase label
* API route or server action to update shipment status
* Webhook handler if Chit Chats sends status updates

### Database

Store:

* orders
* order items
* shipping address
* shipping quote
* shipment status
* label URL or label identifier
* tracking number
* carrier name
* fulfillment timestamp

---

## The flow you should build

## 1) Checkout begins

The customer fills in:

* name
* email
* phone number
* shipping address
* city
* state / province
* postal code
* country

You should validate:

* required fields are present
* postal code format is acceptable
* country is one you support
* the address can be used for shipping

If your products have different weights or sizes, calculate the order package weight here.

---

## 2) Calculate shipping

Your backend should calculate shipping using one of these approaches:

### Option A: Fixed shipping fee

Use a flat fee like:

* standard shipping: $X
* express shipping: $Y

This is easiest to launch.

### Option B: Live rate from Chit Chats

Send package and destination details to Chit Chats and retrieve the available rate.

This is better if you want prices to reflect real postage.

### Option C: Hybrid

* use live rates for shipping cost
* add a handling fee on top if needed

This is often the best real-world approach.

---

## 3) Create the order locally

Before talking to Chit Chats, save the order in your own database with a status like:

* `pending_payment`
* `paid`
* `awaiting_shipping`
* `label_created`
* `fulfilled`
* `cancelled`

This is important so you never lose track of an order if the shipping request fails.

---

## 4) After payment succeeds

When payment is successful:

1. lock the order so it is not paid twice,
2. create a shipment request in Chit Chats,
3. attach the shipment response to the order,
4. store the tracking number and label info,
5. update order status.

If Chit Chats fails, keep the order as `paid` and retry later.

---

## 5) Buy the label

Once the shipment is ready:

* purchase postage / label through Chit Chats,
* store the label download link or label ID,
* store the final tracking number,
* update the shipment state.

You should also allow the admin to re-download the label from the admin dashboard.

---

## 6) Fulfill the order

After the package is handed over to the shipping provider or dropped off:

* mark order as fulfilled,
* show tracking to the customer,
* send email notification,
* optionally send SMS notification.

---

## Data model you will likely need

Below is a practical database shape. Adapt it to your stack.

### Order

* id
* userId or customerEmail
* status
* subtotal
* shippingFee
* tax
* total
* paymentStatus
* createdAt
* updatedAt

### OrderItem

* id
* orderId
* productId
* quantity
* unitPrice
* weight
* name

### ShippingAddress

* id
* orderId
* fullName
* phone
* address1
* address2
* city
* state
* postalCode
* country

### Shipment

* id
* orderId
* provider = `chitchats`
* externalShipmentId
* externalLabelId
* trackingNumber
* labelUrl
* serviceName
* shippingCost
* status
* rawResponse
* createdAt
* updatedAt

### ShipmentEvent (optional)

* id
* shipmentId
* status
* description
* location
* eventTime
* rawPayload

---

## Environment variables

Keep Chit Chats secrets only on the server.

Example env variables:

```env
CHITCHATS_CLIENT_ID=
CHITCHATS_API_TOKEN=
CHITCHATS_BASE_URL=
CHITCHATS_WEBHOOK_SECRET=
APP_URL=
```

Also keep your payment provider keys and database credentials in the server environment.

---

## Backend modules to create

## A. Shipping service

Create a dedicated service that wraps all Chit Chats communication.

Responsibilities:

* authenticate requests
* build shipment payloads
* request shipping rates
* create shipment
* buy label
* fetch tracking details
* handle errors and retries

Keep all Chit Chats-specific code in one place.

---

## B. Shipping controller or route handlers

Create endpoints such as:

* `POST /api/shipping/quote`
* `POST /api/shipping/create-shipment`
* `POST /api/shipping/buy-label`
* `GET /api/shipping/:orderId/tracking`
* `POST /api/webhooks/chitchats`

If you are using Next.js App Router, these can be route handlers in `app/api/...`.

---

## C. Order service

Your order service should:

* create the order
* store shipping data
* update payment status
* update shipment state
* expose admin-safe order views

---

## Frontend changes

## Checkout page

Add these UI pieces:

* shipping address form
* shipping method section
* shipping fee display
* delivery estimate if available
* validation messages

### Recommended checkout flow

1. customer fills address,
2. app requests a shipping quote,
3. shipping fee is shown,
4. customer confirms,
5. payment is completed,
6. order confirmation page appears.

---

## Order confirmation page

Show:

* order number
* amount paid
* shipping method
* expected shipping status
* tracking link once available

If label is not ready yet, display something like:

> Your order was placed successfully. Shipping is being prepared.

---

## Customer order tracking page

If you support customer order lookup:

* order number
* email address or phone number
* latest shipment status
* tracking number
* tracking link

---

## Admin dashboard changes

Your admin should be able to:

* view all orders with shipping status
* see addresses and package details
* create or retry shipment
* buy or re-download label
* mark order as fulfilled
* copy tracking number
* resend shipment email

### Useful admin statuses

* `Pending shipping quote`
* `Ready for shipment`
* `Label created`
* `In transit`
* `Delivered`
* `Failed`

---

## Error handling

You need to handle these cases carefully:

### 1. Invalid address

Show an error and ask the customer to correct the address.

### 2. No shipping rate returned

Fallback to a manual shipping fee or display a “shipping unavailable” message.

### 3. Payment succeeded but shipment failed

Keep the order paid and retry later from admin.

### 4. Label purchase failed

Do not mark the order fulfilled.
Log the error and let admin retry.

### 5. Duplicate shipment creation

Use idempotency or a unique order shipment lock so you do not create two labels for one order.

---

## Important business rules to decide early

You and the client should agree on these before building:

* Is shipping fixed or live-rate?
* Does the store charge handling fees?
* Are there zones or countries you do not ship to?
* What package sizes are supported?
* Who prints the label?
* Who pays for return shipping?
* Do partial refunds include shipping?
* What happens if the customer enters an invalid address?

---

## Suggested implementation phases

## Phase 1: Order and checkout foundation

* complete order schema
* shipping address form
* shipping fee field
* payment flow

## Phase 2: Chit Chats quote integration

* backend shipping quote route
* store shipping quote in database
* display quote on checkout

## Phase 3: Label creation

* create shipment after payment
* store tracking number and label data
* update admin dashboard

## Phase 4: Notifications

* email tracking number to customer
* notify admin
* show tracking in order page

## Phase 5: Webhooks and automation

* receive shipment updates
* auto-update order status
* auto-mark delivered orders if supported

---

## Testing checklist

### Checkout

* [ ] shipping address validates correctly
* [ ] shipping quote is returned
* [ ] fee shows correctly
* [ ] payment still works after shipping changes

### Chit Chats integration

* [ ] API auth works
* [ ] quote request succeeds
* [ ] shipment creation succeeds
* [ ] label download works
* [ ] tracking number is saved

### Admin

* [ ] order status updates properly
* [ ] retry shipment works
* [ ] label can be re-downloaded
* [ ] tracking is visible

### Failure cases

* [ ] invalid address
* [ ] no shipping rate
* [ ] shipment API timeout
* [ ] duplicate label prevention
* [ ] webhook replay protection

---

## Security considerations

* never expose Chit Chats API tokens to the browser
* verify webhook signatures if webhooks are used
* restrict admin endpoints
* log only the minimum necessary personal data
* store shipping data securely

---

## Recommended implementation pattern for Next.js

### Server actions or route handlers

Use server-side code for:

* quote calculation
* shipment creation
* label purchase
* webhook handling

### Client-side only

Use the browser only for:

* form input
* showing shipping prices
* rendering checkout UI

### Do not

* call Chit Chats directly from React components
* store shipping secrets in client code
* trust shipping totals calculated only on the client

---

## Practical order lifecycle

A good lifecycle is:

1. `draft`
2. `pending_payment`
3. `paid`
4. `shipping_pending`
5. `label_created`
6. `shipped`
7. `delivered`
8. `closed`

Optional failure states:

* `shipping_failed`
* `payment_failed`
* `cancelled`
* `refunded`

---

## What to confirm with the client

Before coding, ask the client these questions:

* Which shipping countries should be supported?
* Do they want live Chit Chats rates or a flat shipping fee?
* Who is responsible for printing labels?
* Do they want the customer to see tracking automatically?
* Should shipping be added before or after payment?
* Do they need SMS notifications or only email?

---

## Recommended first build

If you want the simplest working version, build this first:

* fixed shipping fee
* order saved in database
* payment completed
* shipment created after payment
* tracking number stored in admin
* email sent to customer

Then upgrade to live rates later.

---

## Final note

The safest approach is to treat Chit Chats as a **post-payment fulfillment system** first, then add live shipping quotes after the core checkout is stable. That keeps the ecommerce site working even if the shipping provider is temporarily unavailable.
