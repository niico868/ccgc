# Cathy's Clean Classics

logo attached:
web builder prompt:
Build a clean, premium, warm food-ordering website for Fine Time for Cathy’s Clean Green Classics.

The brand sells customizable salads, healthy meals, cold-pressed juices, wellness shots, catering, and meal prep subscription plans. The visual direction should feel fresh, crisp, regal, light, sun-kissed, clean, and premium, using greens, yellows, white space, fresh salad imagery, natural food textures, stainless steel prep counters, and warm family-style kitchen energy.

Use polished stock food images and strong placeholder menu copy for now. The real menu photos and real item names will be uploaded later, so build the framework to be easy to update.

Business contact:
Phone/WhatsApp: +1 868-488-4248
Instagram: @finelivingbycathy

Main business rules:
- Daily orders close at 9:00 AM.
- Delivery starts at 2:00 PM.
- Delivery fee is $40.
- Delivery covers the east-west corridor from Arima to Port of Spain, not too far off route.
- Pickup location 1: Sinclair, Port of Spain, 9:00 AM to 12:00 PM.
- Pickup location 2: Lopinot/home restaurant location, 2:00 PM to 5:00 PM.
- Seafood meals cost $5 more.
- Website ordering is the main ordering method.
- WhatsApp message handoff is used as a recommended backup/confirmation channel after checkout.
- WhatsApp Catalog may be linked, but customers should mainly be guided to order through the website.

Website pages:
1. Homepage
2. Salads section/page
3. Healthy Meals section/page
4. Cold-Pressed Juices section/page
5. Meal Prep Plans page
6. Gallery page
7. Catering page/section
8. FAQ page
9. Contact page
10. Checkout page
11. Private Admin Dashboard

Homepage layout:

Hero section:
- Use a strong premium food image as the hero background.
- Place the logo on top of the hero image.
- Add a main CTA button: “Order Now”
- Add a secondary CTA near it: “Request Catering”
- The catering CTA should be near the top, not hidden at the bottom, because catering is planned in advance and handled separately from daily orders.
- Include a WhatsApp button near the top, but avoid button overload. The main action should still be website ordering.

Directly below hero:
Add a clear notice label:
“Daily orders close at 9AM. Delivery starts at 2PM.”

Homepage food sections:
Show three main food sections in this order:
1. Salads
2. Healthy Meals
3. Cold-Pressed Juices

Each section/card should include:
- Product/section image
- Section title
- Brief premium selling description
- Benefits in 10 words or fewer
- Clickable link to open that section/page

Design behavior:
- On desktop, show 3–4 menu cards per row where appropriate.
- On mobile, show 2 menu cards per row where appropriate.
- Menu labels and item titles should stay compact and take up one line only.
- Keep cards clean, premium, and easy to scan.
- Do not create clutter.
- Use short copy, strong food imagery, and clear CTAs.

Homepage section example copy:

Salads:
Title: “Custom Salads”
Description: “Fresh greens, grilled proteins, crisp toppings, and bold house-style flavor.”
Benefits: “Fresh. Filling. Built your way.”

Healthy Meals:
Title: “Healthy Meals”
Description: “Balanced gourmet-style lunches made for clean eating and real satisfaction.”
Benefits: “Wholesome. Convenient. Affordable.”

Cold-Pressed Juices:
Title: “Cold-Pressed Juices”
Description: “Fresh fruit and vegetable blends made to refresh, fuel, and restore.”
Benefits: “Fresh. Natural. Energizing.”

After main food sections:
Add a Meal Prep Subscription Plans section with three package cards:
1. 5 Meal Plan
2. 8 Meal Plan
3. 12 Meal Plan

Each plan card should include:
- Placeholder image
- Short description
- Price placeholder
- CTA: “View Meal Plan”
- Note below section: “Seafood meals cost $5 more.”

Meal prep section copy:
“Plan your week with fresh, affordable meals made for convenience, balance, and flavor.”

Customer review section:
Add a homepage customer review/testimonial section with clean cards and placeholder reviews. Keep it warm and credible.

Catering CTA section:
Add a visible catering request CTA near the upper part of the homepage and another clean section lower down if needed. It should be prominent but not overpower the daily ordering flow.

WhatsApp buttons:
Add WhatsApp buttons near the top and footer/bottom area, but do not overload the page with too many buttons. Use dynamic placement where it makes sense.
Suggested button text:
“Message Us on WhatsApp”
“Confirm via WhatsApp”

Footer:
Include:
- Phone/WhatsApp: +1 868-488-4248
- Instagram: @finelivingbycathy
- Email placeholder
- Pickup/delivery summary
- Order cutoff reminder

Menu section pages:

Create three dedicated section pages:
1. Salads
2. Healthy Meals
3. Cold-Pressed Juices

Each page should have:
- Page hero image
- Short intro
- Product grid
- Product photo
- Product name
- Full ingredients
- Selling description
- Add to Basket button
- Suggested links/photo cards to the other food sections
- Pickup/delivery/order rules at the bottom

Use the phrase “Add to Basket,” not “Add to Cart.”

Salads page:
Create 5 placeholder salad items.
Each salad item should include:
- Image
- Name
- Full ingredients
- Protein option
- Add-ons
- Add to Basket button

Use premium placeholder names such as:
1. Grilled Chicken Garden Salad
2. Seafood Harvest Salad
3. Quinoa Power Salad
4. Berry Cashew Green Salad
5. Classic Clean Green Salad

Healthy Meals page:
Create 5 placeholder healthy meal items.
Each item should include:
- Image
- Name
- Full ingredients
- Protein option
- Add-ons if relevant
- Add to Basket button

Use premium placeholder names such as:
1. Grilled Chicken Wellness Bowl
2. Baked Fish Clean Plate
3. Shrimp Quinoa Meal
4. Herb Chicken Vegetable Plate
5. Classic Healthy Lunch Plate

Cold-Pressed Juices page:
Create 3 placeholder juice items.
Each item should include:
- Image
- Name
- Ingredients
- Description
- Add to Basket button

Use placeholder juice options:
1. Pineapple Cucumber Refresher
2. Beetroot Energy Blend
3. Watermelon Clean Hydrator

Menu page rules:
- Customers must be able to choose add-ons.
- Customers must be able to choose protein size where relevant.
- Customers must be able to choose juice options where relevant.
- Basic ordering rules must be shown clearly:
  - Orders close at 9AM.
  - Delivery starts at 2PM.
  - Delivery fee is $40.
  - Pickup and delivery options available.

Basket and checkout flow:

Create a visible basket button at the top right of the website.
Customers should be able to:
- Add items to Basket
- View Basket
- Edit quantity
- Remove items
- Confirm Order

Create multiple clear routes to “Confirm Order,” but keep the interface clean.

Checkout page/order form:
When the customer confirms their basket, send them to a checkout/order form.

Checkout form fields:
- Customer name
- Contact number
- Email optional
- Selected food items from Basket
- Quantity
- Protein size
- Add-ons
- Juice options if applicable
- Pickup or delivery
- Delivery address if delivery
- Preferred pickup location if pickup
- Payment method: Cash, Bank Transfer, or Online Card Payment
- Customer notes
- Confirm Order button

After form submission:
1. Save order to Supabase.
2. Show confirmation message.
3. Generate a WhatsApp pre-filled message with the full order details.
4. Send/open customer to WhatsApp using wa.me link.
5. On mobile, open the WhatsApp app.
6. On desktop, open WhatsApp Web.
7. Customer must press send manually inside WhatsApp.

Use this WhatsApp number:
18684884248

WhatsApp pre-filled message format:

Hi, I’d like to confirm my order from Fine Time for Cathy’s Clean Green Classics.

Name:
Phone:
Email:

Order:
Items:
Quantity:
Protein Size:
Add-ons:
Juice Option:

Fulfillment:
Pickup or Delivery:
Pickup Location:
Delivery Address:
Delivery Fee:

Payment Method:
Customer Notes:

Order placed through the website.

Important:
The website should remain the main ordering system. WhatsApp is used as a backup/confirmation handoff after the website order is saved.

Promo popup:
Create a once-per-day popup for visitors.

Popup title:
“Join the CGCC Healthy Community”

Popup copy:
“Get a discount on your first order — or gift it to someone else.”

Fields:
- Name
- Phone number
- Email optional

Small privacy/use note:
“We use your contact details for discounts, sales, events, feedback, and order-related updates.”

Do not frame this as a newsletter.

Save promo popup submissions to Supabase in a separate promo database/table.

Gallery page:
Create a gallery page with sections for:
- Finished food photos
- Previous meals
- Current meals
- Behind-the-scenes kitchen photos
- Staff/prep photos
- Fresh produce and ingredients
- Stainless steel prep counter/kitchen shots

Use placeholder images for now.

Catering page/section:
Create a prominent catering request section and dedicated catering page.

Catering form fields:
- Name
- Phone number
- Email
- Event date
- Event location
- Number of guests
- Type of event
- Preferred menu style
- Budget range
- Pickup or delivery
- Extra notes

Save catering requests to Supabase in a separate catering requests table.

Meal Prep Plans page:
Create a dedicated page for meal prep plans.

Plans:
1. 5 Meal Plan
2. 8 Meal Plan
3. 12 Meal Plan

Each plan should include:
- Image
- Price placeholder
- Short description
- What’s included
- Protein options
- Add-ons
- Pickup/delivery rules
- CTA: “Choose This Plan”

Add note:
“Seafood meals cost $5 more.”

FAQ page:
Create FAQ page with placeholder questions for now. Final questions and answers will be supplied later.

Contact page:
Include:
- Phone/WhatsApp: +1 868-488-4248
- Instagram: @finelivingbycathy
- Email placeholder
- Pickup information
- Delivery information
- Order cutoff information
- WhatsApp button

Private Admin Dashboard:

Create a private admin dashboard with login.

Admin dashboard sections should be separate:
1. Orders Dashboard
2. Customer Database
3. Promo Popup Database
4. Catering Requests
5. Reviews
6. CSV Export

Orders Dashboard:
Show:
- Order ID
- Customer name
- Phone number
- Email
- Order items
- Quantity
- Protein size
- Add-ons
- Juice options
- Pickup or delivery
- Pickup location
- Delivery address
- Order time
- Payment method
- Payment status
- Delivery status
- Customer notes
- Order status

Allow admin to update:
- Order status
- Payment status
- Delivery status
- Notes

Customer Database:
Show:
- Customer name
- Phone number
- Email
- Meal preferences
- Notes
- Past orders
- Promo status

Promo Popup Database:
Show:
- Name
- Phone number
- Email
- Date submitted
- Discount/gift interest status

Catering Requests:
Show:
- Name
- Phone
- Email
- Event date
- Location
- Guest count
- Event type
- Menu preference
- Budget
- Notes
- Request status

CSV Export:
Allow admin to export:
- Orders as CSV
- Customers as CSV
- Promo submissions as CSV
- Catering requests as CSV

Supabase:
Use Supabase to store:
- Orders
- Customers
- Promo popup submissions
- Catering requests
- Reviews
- Admin users/login data

Admin login:
Create a secure private admin login. The first admin should be able to set up the password. Any additional admin access should require approval or permission from the main admin if possible.

Design style:
- Clean
- Premium
- Warm
- Homemade
- Fresh
- Regal
- Food-first
- Not cluttered
- Not overly corporate
- Not too playful
- Use greens, yellows, whites, and natural food tones.
- Use clean spacing, soft cards, premium food photography, and clear CTA buttons.

Tone of copy:
Warm, clear, premium, and simple.
Avoid generic corporate language.
Avoid long paragraphs.
Make the food feel fresh, affordable, and convenient.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ccgc.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6ef1def7-4b2d-4123-a344-685ff58fb823).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
