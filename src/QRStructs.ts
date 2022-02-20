/**
 * Error correction level for QR Code (ignored for other code types)
 * can be set to 4 different values and higher values may cause the
 * image to be decoded slightly slower. The 4 values can be explained
 * like this:
 *
 * - Low (L): Up to 7% of errors can be corrected.
 * - Medium-Low (M): Up to 15% of errors can be corrected.
 * - Medium-High (Q): Up to 25% of errors can be corrected.
 * - High (H): Up to 30% of errors can be corrected.
 *
 * @type {Readonly<{Q: number, H: number, L: number, M: number}>}
 */
export const QRErrorCorrectLevel = Object.freeze({
    L: 1,
    M: 0,
    Q: 3,
    H: 2
});

export const QRMaskPattern = Object.freeze({
    PATTERN000: 0,
    PATTERN001: 1,
    PATTERN010: 2,
    PATTERN011: 3,
    PATTERN100: 4,
    PATTERN101: 5,
    PATTERN110: 6,
    PATTERN111: 7
});