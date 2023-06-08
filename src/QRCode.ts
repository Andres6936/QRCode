/*
 * @fileoverview
 * - Using the 'QRCode for Javascript library'
 * - Fixed dataset of 'QRCode for Javascript library' for support full-spec.
 * - this library has no dependencies.
 *
 * @author davidshimjs
 * @see <a href="http://www.d-project.com/" target="_blank">http://www.d-project.com/</a>
 * @see <a href="http://jeromeetienne.github.com/jquery-qrcode/" target="_blank">http://jeromeetienne.github.com/jquery-qrcode/</a>
 */

import {QRCodeModel} from "./QRCodeModel";
import {QRErrorCorrectLevel} from "./enums/QRStructs";
import {QRCodeLimitLength} from "./QRCodeLimitLength";
import {DrawingHack} from "./interface/DrawerHack";
import {DrawingCanvas} from "./interface/DrawingCanvas";
import {DrawingSVG} from "./interface/DrawingSVG";
import {Render} from "./interface/IDrawer";

function _isSupportCanvas(): boolean {
    return typeof CanvasRenderingContext2D != "undefined";
}

/**
 * Get the type by string length
 *
 * @private
 * @param {String} sText
 * @param {Number} nCorrectLevel
 * @return {Number} type
 */
function _getTypeNumber(sText: string, nCorrectLevel: QRErrorCorrectLevel): number {
    let nType = 1;
    const lengthBytesOfUTF8: number = (new TextEncoder().encode(sText)).length;

    for (var i = 0, len = QRCodeLimitLength.length; i <= len; i++) {
        var nLimit = 0;

        switch (nCorrectLevel) {
            case QRErrorCorrectLevel.L :
                nLimit = QRCodeLimitLength[i][0];
                break;
            case QRErrorCorrectLevel.M :
                nLimit = QRCodeLimitLength[i][1];
                break;
            case QRErrorCorrectLevel.Q :
                nLimit = QRCodeLimitLength[i][2];
                break;
            case QRErrorCorrectLevel.H :
                nLimit = QRCodeLimitLength[i][3];
                break;
        }

        if (lengthBytesOfUTF8 <= nLimit) {
            break;
        } else {
            nType++;
        }
    }

    if (nType > QRCodeLimitLength.length) {
        throw new Error("Too long data");
    }

    return nType;
}

export interface QROptions {
    text: string,
    width?: number,
    height?: number,
    typeNumber?: number,
    colorDark?: string,
    colorLight?: string,
    correctLevel?: QRErrorCorrectLevel,
    useSVG?: boolean,
}

/**
 * QR Code encoding is the process of converting data into a format that can
 * be stored in a QR Code. The data is encoded in a series of black and white
 * squares, which are arranged in a specific pattern. The pattern is
 * determined by the type of data being encoded, the amount of data, and the
 * error correction level.
 *
 * There are four types of data that can be encoded in QR Codes:
 *
 * - Numeric: This type of data can store up to 7,089 digits.
 * - Alphanumeric: This type of data can store up to 4,296 alphanumeric
 *   characters (letters, numbers, and some symbols).
 * - Kanji: This type of data can store up to 1,817 Kanji characters.
 * - Byte: This type of data can store any type of data, up to 2,953 bytes.
 *
 * The error correction level determines how much data can be lost and still
 * be able to be decoded. There are four levels of error correction:
 *
 * - L: This level provides the least amount of error correction, but it also
 *   allows for the smallest QR Codes.
 * - M: This level provides a medium amount of error correction.
 * - Q: This level provides a good amount of error correction.
 * - H: This level provides the most error correction, but it also requires
 *   the largest QR Codes.
 *
 * The process of QR Code encoding is as follows:
 *
 * 1. The data is converted into a binary format.
 * 2. The binary data is divided into blocks of 8 bits.
 * 3. Each block is encoded using a specific algorithm.
 * 4. The encoded blocks are arranged in a specific pattern.
 * 5. The pattern is converted into a QR Code image.
 */
export class QRCode {

    private readonly options: QROptions = {
        width: 256,
        height: 256,
        typeNumber: 4,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRErrorCorrectLevel.H,
        useSVG: false,
        text: "QRCode",
    };

    private readonly element: HTMLElement
    private render: Render
    private model: QRCodeModel

    /**
     * @class QRCode
     * @constructor
     * @example
     * new QRCode(document.getElementById("test"), "http://jindo.dev.naver.com/collie");
     *
     * @example
     * var oQRCode = new QRCode("test", {
     *    text : "http://naver.com",
     *    width : 128,
     *    height : 128
     * });
     *
     * oQRCode.clear(); // Clear the QRCode.
     * oQRCode.makeCode("http://map.naver.com"); // Re-create the QRCode.
     *
     * @param {HTMLElement|String} element target element or 'id' attribute of element.
     * @param {Object|String} options The options to render this QR Code
     */
    constructor(element: HTMLElement, options: Readonly<QROptions>) {
        // Overwrites options
        this.options = {...this.options, ...options};
        this.element = element;

        if (this.options.useSVG) {
            this.render = new DrawingSVG(this.element, this.options);
        } else {
            if (_isSupportCanvas()) {
                this.render = new DrawingCanvas(this.element, this.options);
            } else {
                this.render = new DrawingHack(this.element, this.options);
            }
        }

        this.makeCode(this.options.text);
    }

    /**
     * Make the QRCode
     *
     * @param {String} sText link data
     */
    public makeCode(sText: Readonly<string>): void {
        this.model = new QRCodeModel(_getTypeNumber(sText, this.options.correctLevel), this.options.correctLevel);
        this.model.addData(sText);
        this.model.make();
        this.element.title = sText;
        this.render.draw(this.model);
        this.makeImage();
    }

    /**
     * Clear the QRCode
     */
    public clear(): void {
        this.render.clear();
    };

    /**
     * Make the Image from Canvas element
     * - It occurs automatically
     */
    private makeImage(): void {
        this.render.makeImage();
    };
}
