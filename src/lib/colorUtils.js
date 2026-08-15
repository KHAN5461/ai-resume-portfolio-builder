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
