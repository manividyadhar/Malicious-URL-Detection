# Extension Icons

The browser extension requires icon files for proper display. You need to create the following icon files:

- `icon16.png` - 16x16 pixels (toolbar icon)
- `icon48.png` - 48x48 pixels (extension management page)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

## Quick Solution

You can:

1. **Use placeholder icons**: Create simple colored squares with text using any image editor
2. **Download free icons**: Use icon libraries like:
   - [Flaticon](https://www.flaticon.com)
   - [Icons8](https://icons8.com)
   - [Font Awesome](https://fontawesome.com)

3. **Temporary workaround**: Comment out the icon references in `manifest.json` for testing:
   ```json
   // Remove or comment these sections:
   // "default_icon": { ... }
   // "icons": { ... }
   ```

## Icon Design Suggestions

- Use a shield or lock icon to represent security
- Use colors like blue (#667eea) or red (#dc3545) for visibility
- Ensure icons are clear at small sizes (16x16)

## Creating Icons with Python (Optional)

You can use PIL/Pillow to create simple placeholder icons:

```python
from PIL import Image, ImageDraw, ImageFont

def create_icon(size, filename):
    img = Image.new('RGB', (size, size), color='#667eea')
    draw = ImageDraw.Draw(img)
    # Add text or shapes
    img.save(filename)

create_icon(16, 'icon16.png')
create_icon(48, 'icon48.png')
create_icon(128, 'icon128.png')
```
