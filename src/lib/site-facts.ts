/**
 * One source of truth for the business facts that appear on the facts page,
 * dish pages, llms.txt and structured data. Update here, not in copies.
 */
export const SITE_URL = "https://cathyscleangreenclassics.com";

export const FACTS = {
  name: "Cathy's Clean Green Classics",
  legalName: "Fine Time for Cathy's Clean Green Classics",
  summary:
    "A Trinidad and Tobago kitchen making fresh custom salads, healthy homestyle meals and diabetic-friendly cold-pressed juices with no added sugar, for delivery and pickup.",
  country: "Trinidad and Tobago",
  phone: "+1 868-488-4248",
  phoneE164: "+1-868-488-4248",
  whatsapp: "https://wa.me/18684884248",
  email: "dfinetimerestaurant@gmail.com",
  instagram: "https://www.instagram.com/finelivingbycathy",
  instagramHandle: "@finelivingbycathy",
  orderDays: "Monday, Wednesday and Friday",
  cutoff: "8:00 AM Trinidad time on the day of delivery or pickup",
  bookAhead: "up to six months ahead",
  delivery: "11 AM to about 2 PM along the East–West Corridor",
  deliveryFees:
    "Curepe to Arima $30 TTD; Trincity and environs $20 TTD (confirmed by Cathy's team)",
  pickup: ["Trincity, 2 PM to 5 PM", "St. Clair, 11 AM to 1 PM"],
  prices: {
    salad: "$45 TTD each",
    meal: "$50 TTD each",
    juice: "$18 TTD per 300 ml bottle",
    gingerShot: "$8 TTD per 2 oz shot",
    premiumProtein: "Beef, fish or shrimp add $5 TTD per item",
  },
  minimums:
    "Delivery needs at least 5 food items (salads and meals can be combined) or 6 drinks (juices and ginger shots can be combined). Pickup has no minimum.",
  proteins: "Chicken, beef, fish, shrimp or vegetarian on every salad and meal",
  rotation:
    "Healthy meals alternate weekly between two menus (Menu A and Menu B); the menu switches every Friday at 8 AM. Salads and juices are available every order day.",
  diabetic:
    "All cold-pressed juices and ginger shots are made with no added sugar from specially sourced produce. Fruit and vegetables still contain natural sugars, so people managing diabetes should check portions with their doctor.",
  vegetarian:
    "Vegetarian options contain no meat or seafood but may include dairy (such as feta) and egg.",
  catering:
    "Steady meal-prep and delivery for shut-ins, the elderly and people with health conditions.",
  ordering:
    "Order online at cathyscleangreenclassics.com (account optional) or on WhatsApp. Cathy's team reviews every order and confirms availability, delivery fee and payment.",
} as const;
