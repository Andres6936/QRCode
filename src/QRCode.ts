/**
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
import {_getAndroid, DrawingCanvas} from "./DrawingCanvas.js";
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
 */
export class QRCode {

    /**
     * @name QRCode.CorrectLevel
     */
    CorrectLevel = QRErrorCorrectLevel;

    _htOption = {
        width: 256,
        height: 256,
        typeNumber: 4,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRErrorCorrectLevel.H,
        useSVG: false,
        text: "QRCode",
    };

    private _android = undefined
    private _oDrawing: Render
    private _oQRCode: QRCodeModel
    private readonly _el: HTMLElement

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
     * @param {HTMLElement|String} el target element or 'id' attribute of element.
     * @param {Object|String} vOption
     * @param {String} vOption.text QRCode link data
     * @param {Number} [vOption.width=256]
     * @param {Number} [vOption.height=256]
     * @param {String} [vOption.colorDark="#000000"]
     * @param {String} [vOption.colorLight="#ffffff"]
     * @param {QRCode.CorrectLevel} [vOption.correctLevel=QRCode.CorrectLevel.H] [L|M|Q|H]
     */
    constructor(el: HTMLElement, vOption) {
        if (typeof vOption === 'string') {
            vOption = {
                text: vOption
            };
        }

        // Overwrites options
        if (vOption) {
            for (var i in vOption) {
                this._htOption[i] = vOption[i];
            }
        }

        this._android = _getAndroid();
        this._el = el;
        this._oQRCode = null;

        if (this._htOption.useSVG) {
            this._oDrawing = new DrawingSVG(this._el, this._htOption);
        } else {
            if (_isSupportCanvas()) {
                this._oDrawing = new DrawingCanvas(this._el, this._htOption);
            } else {
                this._oDrawing = new DrawingHack(this._el, this._htOption);
            }
        }


        if (this._htOption.text) {
            this.makeCode(this._htOption.text);
        }
    }

    /**
     * Make the QRCode
     *
     * @param {String} sText link data
     */
    makeCode(sText: string): void {
        this._oQRCode = new QRCodeModel(_getTypeNumber(sText, this._htOption.correctLevel), this._htOption.correctLevel);
        this._oQRCode.addData(sText);
        this._oQRCode.make();
        this._el.title = sText;
        this._oDrawing.draw(this._oQRCode);
        this.makeImage();
    }

    /**
     * Make the Image from Canvas element
     * - It occurs automatically
     * - Android below 3 doesn't support Data-URI spec.
     *
     * @private
     */
    makeImage(): void {
        if (typeof this._oDrawing.makeImage == "function" && (!this._android || this._android >= 3)) {
            this._oDrawing.makeImage();
        }
    };

    /**
     * Clear the QRCode
     */
    clear(): void {
        this._oDrawing.clear();
    };
}
