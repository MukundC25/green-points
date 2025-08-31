# Social Media Icons

This directory contains SVG icons for social media platforms used in the referral sharing feature.

## Current Icon Files

The following SVG icon files are included and ready to use:

### 1. whatsapp.svg ✅
- **Status**: Included
- **Format**: SVG with clean line art
- **Color**: Automatically inverted to white via CSS
- **Description**: Message bubble icon representing WhatsApp

### 2. x-twitter.svg ✅
- **Status**: Included
- **Format**: SVG with official X logo design
- **Color**: Automatically inverted to white via CSS
- **Description**: Updated X logo (formerly Twitter)

### 3. facebook.svg ✅
- **Status**: Included
- **Format**: SVG with official Facebook logo
- **Color**: Automatically inverted to white via CSS
- **Description**: Facebook "f" logo

### 4. email.svg ✅
- **Status**: Included
- **Format**: SVG with envelope icon
- **Color**: Automatically inverted to white via CSS
- **Description**: Generic email envelope icon

## CSS Styling

The icons are styled with the following CSS classes:
- `w-8 h-8`: Sets width and height to 32px
- `object-contain`: Maintains aspect ratio
- `filter brightness-0 invert`: Converts icons to white color

## Fallback Behavior

If an icon file fails to load, the system will automatically fall back to emoji representations:
- WhatsApp: 📱
- X (Twitter): 𝕏
- Facebook: 📘
- Email: 📧

## Recommended Icon Sources

1. **Official Brand Assets**:
   - [WhatsApp Brand Center](https://www.whatsappbrand.com/)
   - [X Brand Toolkit](https://about.x.com/en/who-we-are/brand-toolkit)
   - [Facebook Brand Resources](https://about.meta.com/brand/resources/)

2. **Free Icon Libraries**:
   - [Heroicons](https://heroicons.com/)
   - [Feather Icons](https://feathericons.com/)
   - [Lucide Icons](https://lucide.dev/)
   - [Tabler Icons](https://tabler-icons.io/)

3. **Premium Icon Libraries**:
   - [Font Awesome](https://fontawesome.com/)
   - [Iconify](https://iconify.design/)

## File Naming Convention

- Use lowercase names with hyphens for multi-word platforms
- Use `.png` extension
- Examples: `whatsapp.png`, `x-twitter.png`, `facebook.png`, `email.png`

## Testing

After adding the icon files:
1. Navigate to `/referral` page
2. Check that all social media buttons display proper icons
3. Verify hover effects work correctly
4. Test fallback behavior by temporarily renaming an icon file
