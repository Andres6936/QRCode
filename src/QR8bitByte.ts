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
    private readonly parsedData: Uint8Array;

    /**
     * Sure. This code is a constructor for a class that parses UTF-8
     * encoded strings into arrays of bytes. The constructor function
     * takes a Readonly<string> parameter called dataInput. The Readonly
     * type ensures that the dataInput parameter cannot be modified after
     * it is passed to the constructor.
     */
    constructor(dataInput: Readonly<string>) {
        this.parsedData = new TextEncoder().encode(dataInput);
    }

    public getLength() {
        return this.parsedData.length;
    }

    public write(buffer) {
        for (let i = 0, l = this.parsedData.length; i < l; i++) {
            buffer.put(this.parsedData[i], 8);
        }
    }
}
