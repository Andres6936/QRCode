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
import {QRErrorCorrectLevel} from "./QRStructs";
import {QRCodeLimitLength} from "./QRCodeLimitLength";
import {DrawingHack} from "./DrawerHack";
import {DrawingCanvas} from "./DrawingCanvas";
import {DrawingSVG} from "./DrawingSVG";
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
    correctLevel?: number,
    useSVG?: boolean,
}

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
