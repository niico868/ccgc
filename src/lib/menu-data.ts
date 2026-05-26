import salads from "@/assets/section-salads.jpg";
import meals from "@/assets/section-meals.jpg";
import juices from "@/assets/section-juices.jpg";

export type MenuItem = {
  id: string;
  name: string;
  category: "salad" | "meal" | "juice";
  price: number;
  image: string;
  ingredients: string;
  description: string;
  benefits?: string;
  proteinOptions?: string[];
  juiceOptions?: string[];
  seafood?: boolean;
  pack?: string;
  size?: string;
};

export const SALAD_PROTEINS = ["Chicken", "Fish", "Shrimp", "Vegan"];

export const SALADS: MenuItem[] = [
  {
    id: "salad-broccoli-power",
    category: "salad",
    name: "Broccoli Power Bowl",
    price: 85,
    image: salads,
    description: "A hearty green salad built on romaine lettuce with chopped broccoli, fruit, seeds, sweet corn, and diced chicken breast.",
    ingredients: "Romaine lettuce, chopped broccoli, grapes, dried cranberry, pumpkin seeds, red onions, sweet corn, diced chicken breast.",
    benefits: "Hearty. Crunchy. Energizing.",
    proteinOptions: SALAD_PROTEINS,
  },
  {
    id: "salad-chopped",
    category: "salad",
    name: "Chopped Salad",
    price: 80,
    image: salads,
    description: "A crisp chopped salad with fresh vegetables, feta, olives, radishes, sweet corn, and layered chicken.",
    ingredients: "Olives, lettuce, tomato, sweet corn, cucumber, red onion, feta cheese, radishes, layered chicken.",
    benefits: "Crisp. Briny. Fresh.",
    proteinOptions: SALAD_PROTEINS,
  },
  {
    id: "salad-protein-packed",
    category: "salad",
    name: "Protein Packed Bowl",
    price: 90,
    image: salads,
    description: "A filling salad bowl with quinoa, egg, feta, fresh vegetables, nuts, grains, and clean protein energy.",
    ingredients: "Quinoa, red onions, nuts and grains, lettuce, cucumber slices, fresh parsley, feta cheese, egg, bell pepper.",
    benefits: "Filling. Balanced. Clean.",
    proteinOptions: [...SALAD_PROTEINS, "Egg"],
  },
  {
    id: "salad-grilled-bowl",
    category: "salad",
    name: "Grilled Salad Bowl",
    price: 85,
    image: salads,
    description: "A warm and fresh salad bowl with roasted vegetables, chickpeas, pickled onions, cucumber, parsley, and greens.",
    ingredients: "Sweet potato, cauliflower or broccoli, chickpeas, pickled red onions, cucumber, chopped parsley, kale or lettuce.",
    benefits: "Warm. Roasted. Wholesome.",
    proteinOptions: SALAD_PROTEINS,
  },
];

export const MEALS: MenuItem[] = [
  {
    id: "meal-green-quinoa",
    category: "meal",
    name: "Green Power Quinoa Bowl",
    price: 80,
    image: meals,
    description: "Fluffy quinoa with roasted broccoli and cauliflower, garlic-seasoned black beans, pumpkin seeds, sunflower seeds, and avocado slices when in season.",
    ingredients: "Quinoa, roasted broccoli, roasted cauliflower, black beans, garlic seasoning, pumpkin seeds, sunflower seeds, avocado slices when in season.",
    benefits: "Plant-powered. Filling. Balanced.",
  },
  {
    id: "meal-sweet-potato-lentil",
    category: "meal",
    name: "Sweet Potato and Lentil Wellness Plate",
    price: 80,
    image: meals,
    description: "Roasted sweet potato wedges with lightly seasoned lentils, steamed string beans, mixed nuts, and chia seeds.",
    ingredients: "Sweet potato wedges, seasoned lentils, steamed string beans, mixed nuts, chia seeds.",
    benefits: "Hearty. Clean. Nourishing.",
  },
  {
    id: "meal-couscous-garden",
    category: "meal",
    name: "Grilled Garden Couscous Bowl",
    price: 80,
    image: meals,
    description: "Fluffy couscous with grilled vegetables, broccoli, sweet potato, zucchini, sprouts, pumpkin seeds, and sliced almonds.",
    ingredients: "Couscous, grilled broccoli, sweet potato, zucchini, mixed sprouts, pumpkin seeds, sliced almonds.",
    benefits: "Fresh. Light. Flavorful.",
  },
  {
    id: "meal-power-rice",
    category: "meal",
    name: "Power Rice Bowl",
    price: 80,
    image: meals,
    description: "Brown rice or quinoa topped with steamed broccoli, roasted cauliflower, black beans, pumpkin seeds, sunflower seeds, and lemon olive oil drizzle.",
    ingredients: "Brown rice or quinoa, steamed broccoli, roasted cauliflower, black beans, pumpkin seeds, sunflower seeds, lemon olive oil drizzle.",
    benefits: "Balanced. Energizing. Clean.",
  },
  {
    id: "meal-sweet-potato-power",
    category: "meal",
    name: "Sweet Potato Power Bowl",
    price: 85,
    image: meals,
    description: "Brown rice or lentils topped with roasted garlic butter sweet potato, beetroot cubes, steamed string beans, mixed nuts, and healthy seeds.",
    ingredients: "Brown rice or lentils, roasted garlic butter sweet potato, beetroot cubes, steamed string beans, mixed nuts, healthy seeds.",
    benefits: "Warm. Filling. Restorative.",
  },
  {
    id: "meal-couscous-wellness",
    category: "meal",
    name: "Couscous Wellness Bowl",
    price: 80,
    image: meals,
    description: "Hearty couscous topped with roasted Parmesan zucchini, sweet potato cubes, cucumber strips, shredded carrots, cranberries, and walnuts.",
    ingredients: "Couscous, roasted Parmesan zucchini, sweet potato cubes, cucumber strips, shredded carrots, dried cranberries, walnuts.",
    benefits: "Fresh. Textured. Satisfying.",
  },
];

export const JUICES: MenuItem[] = [
  {
    id: "juice-melon",
    category: "juice",
    name: "Melon",
    price: 90,
    image: juices,
    size: "300 ml",
    pack: "6 bottles",
    description: "A fresh melon-based cold-pressed drink made to hydrate, cool, and refresh.",
    ingredients: "Fresh melon.",
    benefits: "Hydrating. Light. Refreshing.",
  },
  {
    id: "juice-beet",
    category: "juice",
    name: "Beet",
    price: 114,
    image: juices,
    size: "300 ml",
    pack: "6 bottles",
    description: "A rich beetroot cold-pressed drink made for deep earthy flavor, natural energy, and wellness support.",
    ingredients: "Fresh beetroot.",
    benefits: "Rich. Restorative. Energizing.",
  },
  {
    id: "juice-mixer",
    category: "juice",
    name: "Mixer",
    price: 96,
    image: juices,
    size: "300 ml",
    pack: "6 bottles",
    description: "A bright mixed cold-pressed blend with carrot, beet, apple, pineapple, and melon.",
    ingredients: "Carrot, beet, apple, pineapple, melon.",
    benefits: "Balanced. Fruity. Fresh.",
  },
  {
    id: "juice-green-supreme",
    category: "juice",
    name: "Green Supreme",
    price: 102,
    image: juices,
    size: "300 ml",
    pack: "6 bottles",
    description: "A clean green blend with celery, cucumber, spinach, kale, and Granny Smith apple.",
    ingredients: "Celery, cucumber, spinach, kale, Granny Smith apple.",
    benefits: "Green. Clean. Restoring.",
  },
];

export const SALAD_INGREDIENTS = {
  "Greens and Vegetables": "Kale, romaine lettuce, broccoli, cauliflower, zucchini, bell pepper, celery, radish, cress, beetroot, red onions, cucumber, cucumber pickles, sweet corn, grilled butter squash, sweet potato.",
  "Extras": "Olives, tomato, feta cheese.",
  "Fruits": "Mango, pineapple, grapes, apple, organic raisins, dried cranberry.",
  "Nuts, Seeds, and Grains": "Almonds, pecans, cashews, sesame seeds, chia seeds, sunflower seeds, pumpkin seeds, quinoa.",
  "Proteins": "Chicken, fish, shrimp, egg, vegan option.",
};

export const ALL_ITEMS = [...SALADS, ...MEALS, ...JUICES];
export const findItem = (id: string) => ALL_ITEMS.find((i) => i.id === id);
