/**
 * QR Codes can encode data in four different modes:
 *
 * - Numeric: This mode can store up to 7,089 digits.
 * - Alphanumeric: This mode can store up to 4,296 alphanumeric characters
 *   (letters, numbers, and some symbols).
 * - Kanji: This mode can store up to 1,817 Kanji characters.
 * - Byte: This mode can store any type of data, up to 2,953 bytes.
 *
 * The mode that is used to encode the data in a QR Code depends on the
 * type of data being encoded. For example, if the data is a phone number,
 * then the numeric mode would be used. If the data is a URL, then the
 * alphanumeric mode would be used.
 *
 * It is important to note that the mode that is used to encode the data
 * in a QR Code also affects the size of the QR Code. For example, the
 * numeric mode will create a smaller QR Code than the alphanumeric mode.
 *
 * Here are some additional details about the four modes of QR Codes:
 *
 * - Numeric mode: This mode is the most efficient way to encode digits.
 *   It uses a single bit to represent each digit, which means that it
 *   can store up to 7,089 digits in a single QR Code.
 *
 * - Alphanumeric mode: This mode is a more flexible mode that can store
 *   a variety of characters, including letters, numbers, and some symbols.
 *   It uses two bits to represent each character, which means that it can
 *   store up to 4,296 alphanumeric characters in a single QR Code.
 *
 * - Kanji mode: This mode is specifically designed for storing Japanese
 *   characters. It uses four bits to represent each character, which means
 *   that it can store up to 1,817 Kanji characters in a single QR Code.
 *
 * - Byte mode: This mode is the most versatile mode and can store any type
 *   of data. It uses eight bits to represent each byte, which means that it
 *   can store up to 2,953 bytes of data in a single QR Code.
 */
export const enum QRMode {
    MODE_NUMBER = 1 << 0,
    MODE_ALPHA_NUM = 1 << 1,
    MODE_8BIT_BYTE = 1 << 2,
    MODE_KANJI = 1 << 3
}