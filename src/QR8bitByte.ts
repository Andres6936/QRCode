//---------------------------------------------------------------------
// QRCode for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//   http://www.opensource.org/licenses/mit-license.php
//
// The word "QR Code" is registered trademark of
// DENSO WAVE INCORPORATED
//   http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------
import {QRMode} from "./QRMode";

export class QR8bitByte {
    public readonly mode = QRMode.MODE_8BIT_BYTE;
    private readonly parsedData;

    /**
     * Sure. This code is a constructor for a class that parses UTF-8
     * encoded strings into arrays of bytes. The constructor function
     * takes a Readonly<string> parameter called dataInput. The Readonly
     * type ensures that the dataInput parameter cannot be modified after
     * it is passed to the constructor.
     */
    constructor(dataInput: Readonly<string>) {
        // The first part of the constructor creates an empty array called
        // this.parsedData. This array will be used to store the parsed data.
        this.parsedData = [];

        // The next part of the constructor is a loop that iterates over the
        // characters in dataInput. For each character, the loop calls the
        // charCodeAt() method to get the Unicode code point for the character.
        // The Unicode code point is a number that represents the character.

        // Added to support UTF-8 Characters
        for (let i = 0, l = dataInput.length; i < l; i++) {
            const byteArray = [];
            const code = dataInput.charCodeAt(i);

            // The loop then uses the code variable to determine how many bytes
            // are needed to represent the character. If the code is greater
            // than 0x10000, then the character is a surrogate pair. A surrogate
            // pair is two characters that represent a single code point.
            // The loop creates an array of four bytes to represent the surrogate
            // pair.
            // The first byte is set to 0xF0, the second byte is set to the upper
            // 6 bits of the code, the third byte is set to the middle 6 bits of
            // the code, and the fourth byte is set to the lower 6 bits of the code.
            if (code > 0x10000) {
                byteArray[0] = 0xF0 | ((code & 0x1C0000) >>> 18);
                byteArray[1] = 0x80 | ((code & 0x3F000) >>> 12);
                byteArray[2] = 0x80 | ((code & 0xFC0) >>> 6);
                byteArray[3] = 0x80 | (code & 0x3F);
            } else if (code > 0x800) {
                // If the code is greater than 0x800, but less than 0x10000, then
                // the character is a two-byte character. The loop creates an array
                // of three bytes to represent the character. The first byte is
                // set to 0xE0, the second byte is set to the upper 6 bits of the
                // code, and the third byte is set to the lower 6 bits of the code.

                byteArray[0] = 0xE0 | ((code & 0xF000) >>> 12);
                byteArray[1] = 0x80 | ((code & 0xFC0) >>> 6);
                byteArray[2] = 0x80 | (code & 0x3F);
            } else if (code > 0x80) {
                // If the code is greater than 0x80, but less than 0x800, then the
                // character is a three-byte character. The loop creates an array
                // of two bytes to represent the character. The first byte is set
                // to 0xC0, and the second byte is set to the lower 6 bits of the
                // code.

                byteArray[0] = 0xC0 | ((code & 0x7C0) >>> 6);
                byteArray[1] = 0x80 | (code & 0x3F);
            } else {
                // If the code is less than 0x80, then the character is a
                // single-byte character. The loop simply creates an array with a
                // single byte, set to the code.

                byteArray[0] = code;
            }

            // The loop then pushes the array of bytes onto the this.parsedData array.
            this.parsedData.push(byteArray);
        }

        // The next part of the constructor calls the concat() method on the
        // this.parsedData array. The concat() method merges two or more arrays
        // into a single array. This ensures that the this.parsedData array is
        // a single, continuous array of bytes.
        this.parsedData = Array.prototype.concat.apply([], this.parsedData);

        // The final part of the constructor checks to see if the length of the
        // this.parsedData array is equal to the length of the dataInput string.
        // If the lengths are not equal, then the constructor adds three bytes to
        // the beginning of the this.parsedData array. The three bytes are set
        // to 191, 187, and 239. These bytes are used to indicate that the data
        // is UTF-8 encoded.
        if (this.parsedData.length != dataInput.length) {
            this.parsedData.unshift(191);
            this.parsedData.unshift(187);
            this.parsedData.unshift(239);
        }
    }

    getLength() {
        return this.parsedData.length;
    }

    write(buffer) {
        for (let i = 0, l = this.parsedData.length; i < l; i++) {
            buffer.put(this.parsedData[i], 8);
        }
    }
}
