export function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    return [r, g, b];
}

export function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
}

export function getLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(hex1, hex2) {
    if (!hex1 || !hex2) return 1;
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    const l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
    const l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return (brightest + 0.05) / (darkest + 0.05);
}

export function adjustColorForContrast(hex, bgHex, targetRatio = 4.5) {
    if (!hex || !bgHex) return hex;
    let currentHex = hex;
    let ratio = getContrastRatio(currentHex, bgHex);
    if (ratio >= targetRatio) return currentHex;

    const bgRgb = hexToRgb(bgHex);
    const bgLum = getLuminance(bgRgb[0], bgRgb[1], bgRgb[2]);
    const isBgDark = bgLum < 0.5;

    let [r, g, b] = hexToRgb(hex);
    const step = 5;
    
    for (let i = 0; i < 50; i++) {
        if (isBgDark) {
            r = Math.min(255, r + step);
            g = Math.min(255, g + step);
            b = Math.min(255, b + step);
        } else {
            r = Math.max(0, r - step);
            g = Math.max(0, g - step);
            b = Math.max(0, b - step);
        }
        currentHex = rgbToHex(Math.round(r), Math.round(g), Math.round(b));
        ratio = getContrastRatio(currentHex, bgHex);
        if (ratio >= targetRatio) {
            break;
        }
    }
    
    return currentHex;
}

export function hexToHslString(hex) {
    if (!hex) return '0 0% 0%';
    let [r, g, b] = hexToRgb(hex);
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function getForegroundHsl(hex) {
    if (!hex) return '0 0% 100%';
    const [r, g, b] = hexToRgb(hex);
    const lum = getLuminance(r, g, b);
    // If the background is light, return dark text. If dark, return light text.
    return lum > 0.5 ? '220 20% 12%' : '0 0% 100%';
}
