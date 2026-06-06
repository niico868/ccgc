# Plan

## What I’ll update
1. Fix the current preview runtime blocker so the app loads cleanly again before making the image swap.
2. Replace the salad and healthy meal photos across the site, not just on menu cards.
3. Keep the uploaded images exactly as provided, including any text already on them.
4. Reuse the closest available uploaded photo for the two menu items that do not yet have exact matches.

## Photo mapping
### Salads
- CCGC Specialty Salad — Chef's Choice → `chefs choice.png`
- Broccoli Power Bowl → `Broccoli power bowl.jpeg`
- Chopped Salad → `chopped salad.png`
- Protein Packed Bowl → `protein packed bowl.jpeg`
- Grilled Salad Bowl → closest available salad photo (best-fit fallback)

### Healthy Meals
- Chinese-Style Quinoa Chow Mein Bowl → `Fluffy quinoa sautéed chow mein–style...png`
- Sweet Potato Basil Mash with Chimichurri Chicken → `Sweet Potato Basil Mash with Chimichurri Chicken.png`
- Cumin Basmati Rice with Tandoori Chicken → `Cumin Basmati Rice with Tandoori Chicken.png`
- Roasted Vegetable Medley with Thai Butter Chicken → closest available healthy meal photo (best-fit fallback)

## Where the replacements will appear
- Salad and healthy meal product cards
- Shared section imagery that pulls from those menu assets
- Any related featured/gallery usage that currently shows those food categories

## Technical details
- Add the uploaded images as proper app assets instead of leaving them as temporary files.
- Update the menu data so each matched item points to its own new image instead of the single shared category photo.
- Update any other page/component that still relies on the old shared salad/meal images where these products are represented.
- Verify the preview after the changes so the images render correctly and the app loads without the dynamic import error.

## Fallback handling
- Because the archive doesn’t include exact replacements for `Grilled Salad Bowl` and `Roasted Vegetable Medley with Thai Butter Chicken`, I’ll use the closest uploaded image for each for now, per your instruction.