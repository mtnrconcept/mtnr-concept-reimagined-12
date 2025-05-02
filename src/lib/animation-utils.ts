
/**
 * Ensures that animation values like blur are always positive
 * to prevent "Invalid keyframe value" errors
 * @param value The value to ensure is positive
 * @param fallback Optional fallback value if original is negative (defaults to 0)
 */
export function ensurePositiveValue(value: number, fallback = 0): number {
  return value >= 0 ? value : fallback;
}

/**
 * Creates a safe blur filter string that prevents negative values
 * @param blurAmount The blur amount in pixels
 */
export function safeBlur(blurAmount: number): string {
  return `blur(${Math.max(0, blurAmount)}px)`;
}

/**
 * Creates filter string with multiple effects while ensuring all values are positive
 * @param options Filter options
 */
export function createSafeFilter({
  blur = 0,
  contrast = 100,
  brightness = 100,
  saturate = 100,
  dropShadowX = 0,
  dropShadowY = 0,
  dropShadowBlur = 0,
  dropShadowColor = 'rgba(0,0,0,0.5)'
}: {
  blur?: number;
  contrast?: number;
  brightness?: number;
  saturate?: number;
  dropShadowX?: number;
  dropShadowY?: number;
  dropShadowBlur?: number;
  dropShadowColor?: string;
}): string {
  const safeBlurValue = Math.max(0, blur);
  const safeContrast = Math.max(0, contrast);
  const safeBrightness = Math.max(0, brightness); 
  const safeSaturate = Math.max(0, saturate);
  const safeDropShadowBlur = Math.max(0, dropShadowBlur);
  
  let filter = '';
  
  if (safeBlurValue > 0) filter += `blur(${safeBlurValue}px) `;
  if (safeContrast !== 100) filter += `contrast(${safeContrast}%) `;
  if (safeBrightness !== 100) filter += `brightness(${safeBrightness}%) `;
  if (safeSaturate !== 100) filter += `saturate(${safeSaturate}%) `;
  if (safeDropShadowBlur > 0) {
    filter += `drop-shadow(${dropShadowX}px ${dropShadowY}px ${safeDropShadowBlur}px ${dropShadowColor})`;
  }
  
  return filter.trim();
}
