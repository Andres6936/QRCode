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

import {QRCodeModel} from "./QRCodeModel.js";
import {QRErrorCorrectLevel} from "./QRStructs.js";
import {QRCodeLimitLength} from "./QRCodeLimitLength.js";
import {DrawingHack} from "./DrawerHack.js";
import {DrawingCanvas} from "./DrawingCanvas.js";
import {DrawingSVG} from "./DrawingSVG.js";
import {Render} from "./IDrawer";

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
function _getTypeNumber(sText: string, nCorrectLevel: number): number {
    let nType = 1;
    const length = _getUTF8Length(sText);

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

        if (length <= nLimit) {
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

function _getUTF8Length(sText) {
    var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, 'a');
    return replacedText.length + (replacedText.length != sText ? 3 : 0);
}

export interface QROptions {
    text: string,
    width?: number,
    height?: number,
    typeNumber?: number,
    colorDark?: string,
    colorLight?: string,
    correctLevel?: number,
    useSVG?: boolean,
}

/**
 * Quick Response (QR) codes are two-dimensional (2-D) barcodes that can
 * contain information such as URL links (e.g. a link to YouTube video,
 * website link) and text (e.g. contact details, product details). These
 * square pattern codes consist of black modules on a white background.
 * QR code generator is software that stores data (e.g. URL link, text,
 * Google maps location) into a QR code. This encoded data can be decoded
 * by scanning the QR code symbol with a mobile device that is equipped
 * with a camera and a QR code reader software. QR codes have a number
 * of purposes; they are mostly used in manufacturing (e.g. product
 * traceability, process control, inventory and equipment management),
 * warehousing and logistics (e.g. item tracking), retailing (e.g. sales
 * management), healthcare (e.g. medical records management, patient
 * identification, equipment and device tracking), transportation (e.g.
 * ticketing and boarding passes), office automation (e.g. document
 * management), marketing and advertising (e.g. mobile marketing,
 * electronic tickets, coupons, payments).
 *
 * Quick Response (QR) codes are two-dimensional (2-
 * D) barcodes that can contain all types of data, such as
 * numeric and alphabetic characters, Kanji, Kana, Hiragana,
 * symbols, binary and control codes. Up to 7,089 characters
 * can be encoded in one code. These square pattern codes
 * consist of black modules on a white background.
 *
 * The main features of QR codes are: high capacity data
 * storage, small printout size, Kanji and Kana character set
 * capability, dirt and damage resistant (QR codes have an
 * error correction capability), readable from any direction in
 * 360 degrees and with a structured appending feature. One
 * QR code can be divided into up to 16 smaller QR
 * symbols. Information stored in multiple QR code symbols
 * can be reconstructed as a single data symbol.
 *
 * @note Version of QR Code 3
 */
export class QRCode {

    private options: QROptions = {
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
        if (typeof options === 'string') {
            options = {
                text: options
            };
        }

        // Overwrites options
        if (options) {
            for (const i in options) {
                this.options[i] = options[i];
            }
        }

        this.element = element;
        this.model = null;

        if (this.options.useSVG) {
            this.render = new DrawingSVG(this.element, this.options);
        } else {
            if (_isSupportCanvas()) {
                this.render = new DrawingCanvas(this.element, this.options);
            } else {
                this.render = new DrawingHack(this.element, this.options);
            }
        }


        if (this.options.text) {
            this.makeCode(this.options.text);
        }
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
