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
export const enum QRErrorCorrectLevel {
    L = 1,
    M = 0,
    Q = 3,
    H = 2
}


/**
 * A mask is a pattern of black and white squares that is used to improve the
 * readability of a QR Code. There are eight different mask patterns
 * available, and each one has a different effect on the appearance of the
 * QR Code.
 *
 * - 0 | No mask is applied. This is the default mask pattern.
 *
 * - 1 | The dark modules in the QR Code are inverted. This can make the
 *       QR Code easier to read in low-light conditions.
 *
 * - 2 | The dark modules in the QR Code are rotated by 90 degrees. This
 *       can make the QR Code easier to read if it is rotated.
 *
 * - 3 | The dark modules in the QR Code are mirrored. This can make the
 *       QR Code easier to read if it is upside down.
 *
 * - 4 | The dark modules in the QR Code are a combination of inversion,
 *       rotation, and mirroring. This can make the QR Code easier to read
 *       in a variety of conditions.
 *
 * - 5 | The dark modules in the QR Code are a random pattern. This can
 *       make the QR Code more difficult to read, but it can also make
 *       it more resistant to tampering.
 *
 * - 6 | The dark modules in the QR Code are a repeating pattern. This can
 *       make the QR Code easier to read, but it can also make it more
 *       vulnerable to tampering.
 *
 * The best mask pattern to use for a particular QR Code depends on the
 * environment in which the QR Code will be used. For example, if the QR
 * Code will be used in a low-light environment, then you should use mask
 * pattern 1. If the QR Code will be used in a variety of conditions, then
 * you should use mask pattern 4.
 *
 * It is important to note that the mask pattern is only one factor that
 * affects the readability of a QR Code. The other factors include the size
 * of the QR Code, the quality of the print, and the angle at which the QR
 * Code is scanned.
 */
export const enum QRMaskPattern {
    PATTERN000 = 0,
    PATTERN001 = 1,
    PATTERN010 = 2,
    PATTERN011 = 3,
    PATTERN100 = 4,
    PATTERN101 = 5,
    PATTERN110 = 6,
    PATTERN111 = 7
}