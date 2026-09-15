/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#F5F5F2',
    tint: '#A8B6A2',
    background: '#090A09',
    foreground: '#F5F5F2',
    card: '#141715',
    cardForeground: '#F5F5F2',
    primary: '#D8E5D2',
    primaryForeground: '#111311',
    secondary: '#202620',
    secondaryForeground: '#E4EBE0',
    muted: '#202420',
    mutedForeground: '#858C84',
    accent: '#355A49',
    accentForeground: '#F0F7ED',
    destructive: '#B46F78',
    destructiveForeground: '#FFF4F4',
    border: '#2A312B',
    input: '#313A31',
    success: '#B9D9AE',
    warning: '#E0AD9A',
    deepCard: '#101310',
    brightCard: '#294F42',
  },

  dark: {
    text: '#F5F5F2',
    tint: '#A8B6A2',
    background: '#090A09',
    foreground: '#F5F5F2',
    card: '#141715',
    cardForeground: '#F5F5F2',
    primary: '#D8E5D2',
    primaryForeground: '#111311',
    secondary: '#202620',
    secondaryForeground: '#E4EBE0',
    muted: '#202420',
    mutedForeground: '#858C84',
    accent: '#355A49',
    accentForeground: '#F0F7ED',
    destructive: '#B46F78',
    destructiveForeground: '#FFF4F4',
    border: '#2A312B',
    input: '#313A31',
    success: '#B9D9AE',
    warning: '#E0AD9A',
    deepCard: '#101310',
    brightCard: '#294F42',
  },

  radius: 22,
};

export default colors;
