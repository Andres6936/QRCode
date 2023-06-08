/**
 * The code then uses these functions to populate the EXP_TABLE and
 * LOG_TABLE arrays. The EXP_TABLE array is populated by calculating
 * the exponential of each number from 0 to 255.
 *
 * The LOG_TABLE array is populated by calculating the logarithm of
 * each number in the EXP_TABLE array.
 *
 * The QRMath library uses these tables to encode and decode data
 * in QR Codes. For example, to encode a number in a QR Code, the
 * library would first look up the logarithm of the number in the
 * LOG_TABLE array. The library would then use the exponential
 * function to convert the logarithm back into a number.
 * The library would then store the number in the QR Code.
 *
 * The QRMath library is a powerful tool for generating QR Codes.
 * It provides a number of functions for encoding and decoding data
 * in QR Codes. The library is also relatively easy to use.
 */
export var QRMath = {

    /**
     * This function is used to calculate the logarithm of a number,
     * modulo 256. The logarithm is a mathematical function that returns
     * the power to which a number must be raised to equal another number.
     * In this case, the logarithm is calculated modulo 256, which means
     * that the result is a number between 0 and 255.
     */
    glog: function (n: number) {
        if (n < 1) {
            throw new Error("glog(" + n + ")");
        }
        return QRMath.LOG_TABLE[n];
    },

    /**
     * This function is used to calculate the exponential of a number,
     * modulo 256. The exponential is a mathematical function that returns
     * the product of a number and itself, raised to a certain power.
     * In this case, the exponential is calculated modulo 256, which means
     * that the result is a number between 0 and 255.
     */
    gexp: function (n) {
        while (n < 0) {
            n += 255;
        }
        while (n >= 256) {
            n -= 255;
        }
        return QRMath.EXP_TABLE[n];
    },

    /**
     * This is an array that stores the exponentials of all numbers from 0 to 255.
     */
    EXP_TABLE: new Array(256),

    /**
     * This is an array that stores the logarithms of all numbers from 0 to 255.
     */
    LOG_TABLE: new Array(256)
};

for (var i = 0; i < 8; i++) {
    QRMath.EXP_TABLE[i] = 1 << i;
}
for (var i = 8; i < 256; i++) {
    QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
}
for (var i = 0; i < 255; i++) {
    QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
}