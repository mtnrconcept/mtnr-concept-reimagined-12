
/**
 * Utilitaires pour la manipulation des couleurs des particules
 */

/**
 * Ajuste la luminosité d'une couleur
 */
export function adjustColorLightness(color: string, percent: number): string {
  // Pour simplifier, cette fonction ne fonctionne qu'avec les couleurs hex
  if (color.startsWith('#')) {
    // Convertir hex en RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Ajuster la luminosité
    const factor = 1 + percent / 100;
    const adjustR = Math.max(0, Math.min(255, Math.floor(r * factor)));
    const adjustG = Math.max(0, Math.min(255, Math.floor(g * factor)));
    const adjustB = Math.max(0, Math.min(255, Math.floor(b * factor)));
    
    // Reconvertir en hex
    return `#${adjustR.toString(16).padStart(2, '0')}${adjustG.toString(16).padStart(2, '0')}${adjustB.toString(16).padStart(2, '0')}`;
  }
  return color;
}

/**
 * Ajuste la saturation d'une couleur (conversion de hex à HSL puis HSL à hex)
 */
export function adjustColorSaturation(color: string, percent: number): string {
  if (color.startsWith('#')) {
    // Convertir hex en RGB
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;
    
    // Convertir RGB en HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    // Ajuster la saturation
    s = Math.min(1, s * (percent / 100));
    
    // Convertir HSL à RGB
    let r1 = 0, g1 = 0, b1 = 0;
    
    if (s === 0) {
      r1 = g1 = b1 = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r1 = hue2rgb(p, q, h + 1/3);
      g1 = hue2rgb(p, q, h);
      b1 = hue2rgb(p, q, h - 1/3);
    }
    
    // Convertir RGB à hex
    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`;
  }
  return color;
}
