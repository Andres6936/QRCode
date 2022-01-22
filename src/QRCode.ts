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

function _isSupportCanvas() {
    return typeof CanvasRenderingContext2D != "undefined";
}

const useSVG = document.documentElement.tagName.toLowerCase() === "svg";

// Drawing in DOM by using Table tag
let Drawing = useSVG ? DrawingSVG : !_isSupportCanvas() ? DrawingHack : DrawingCanvas;

/**
 * Get the type by string length
 *
 * @private
 * @param {String} sText
 * @param {Number} nCorrectLevel
 * @return {Number} type
 */
function _getTypeNumber(sText, nCorrectLevel) {
    var nType = 1;
    var length = _getUTF8Length(sText);

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

    _android = undefined
    _el = undefined
    _oQRCode = undefined
    _oDrawing = undefined

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
    constructor(el, vOption) {
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

        if (typeof el == "string") {
            el = document.getElementById(el);
        }

        if (this._htOption.useSVG) {
            Drawing = DrawingSVG;
        }

        this._android = _getAndroid();
        this._el = el;
        this._oQRCode = null;
        this._oDrawing = new Drawing(this._el, this._htOption);

        if (this._htOption.text) {
            this.makeCode(this._htOption.text);
        }
    }

    /**
     * Make the QRCode
     *
     * @param {String} sText link data
     */
    makeCode(sText) {
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
    makeImage() {
        if (typeof this._oDrawing.makeImage == "function" && (!this._android || this._android >= 3)) {
            this._oDrawing.makeImage();
        }
    };

    /**
     * Clear the QRCode
     */
    clear() {
        this._oDrawing.clear();
    };
}
