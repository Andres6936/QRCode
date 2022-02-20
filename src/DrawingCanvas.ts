// android 2.x doesn't support Data-URI spec
import {Options, Render} from "./IDrawer";
import {QRCodeModel} from "./QRCodeModel";

export function _getAndroid() {
    var android = false;
    var sAgent = navigator.userAgent;

    if (/android/i.test(sAgent)) { // android
        android = true;
        var aMat = sAgent.toString().match(/android ([0-9]\.[0-9])/i);

        if (aMat && aMat[1]) {
            // @ts-ignore
            android = parseFloat(aMat[1]);
        }
    }

    return android;
}

/**
 * Drawing QRCode by using canvas
 *
 * @constructor
 * @param {HTMLElement} el
 * @param {Object} htOption QRCode Options
 */
export class DrawingCanvas implements Render {
    private readonly element: HTMLElement;
    private readonly canvas: HTMLCanvasElement
    private readonly image: HTMLImageElement;
    private readonly options: Options;
    private readonly context2D: CanvasRenderingContext2D;
    _bIsPainted
    _android
    _bSupportDataURI

    constructor(element: HTMLElement, options: Readonly<Options>) {
        this._bIsPainted = false;
        this._android = _getAndroid();

        this.options = options;
        this.canvas = document.createElement("canvas");
        this.canvas.width = options.width;
        this.canvas.height = options.height;
        element.appendChild(this.canvas);
        this.element = element;
        this.context2D = this.canvas.getContext("2d");
        this._bIsPainted = false;
        this.image = document.createElement("img");
        this.image.alt = "Scan me!";
        this.image.style.display = "none";
        this.element.appendChild(this.image);
        this._bSupportDataURI = null;
    }

    /**
     * Draw the QRCode
     *
     * @param {QRCode} oQRCode
     */
    public draw(oQRCode: QRCodeModel) {
        const _elImage = this.image;
        const _oContext = this.context2D;
        const _htOption = this.options;

        const nCount = oQRCode.getModuleCount();
        const nWidth = _htOption.width / nCount;
        const nHeight = _htOption.height / nCount;
        const nRoundedWidth = Math.round(nWidth);
        const nRoundedHeight = Math.round(nHeight);

        _elImage.style.display = "none";
        this.clear();

        for (let row = 0; row < nCount; row++) {
            for (let col = 0; col < nCount; col++) {
                const bIsDark = oQRCode.isDark(row, col);
                const nLeft = col * nWidth;
                const nTop = row * nHeight;
                _oContext.strokeStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;
                _oContext.lineWidth = 1;
                _oContext.fillStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;
                _oContext.fillRect(nLeft, nTop, nWidth, nHeight);

                // 안티 앨리어싱 방지 처리
                _oContext.strokeRect(
                    Math.floor(nLeft) + 0.5,
                    Math.floor(nTop) + 0.5,
                    nRoundedWidth,
                    nRoundedHeight
                );

                _oContext.strokeRect(
                    Math.ceil(nLeft) - 0.5,
                    Math.ceil(nTop) - 0.5,
                    nRoundedWidth,
                    nRoundedHeight
                );
            }
        }

        this._bIsPainted = true;
    };

    /**
     * Make the image from Canvas if the browser supports Data URI.
     */
    makeImage() {
        if (this._bIsPainted) {
            _safeSetDataURI.call(this, _onMakeImage);
        }
    };

    /**
     * Return whether the QRCode is painted or not
     *
     * @return {Boolean}
     */
    isPainted() {
        return this._bIsPainted;
    };

    /**
     * Clear the QRCode
     */
    clear() {
        this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this._bIsPainted = false;
    };

    /**
     * @private
     * @param {Number} nNumber
     */
    round(nNumber) {
        if (!nNumber) {
            return nNumber;
        }

        return Math.floor(nNumber * 1000) / 1000;
    };


}

function _onMakeImage() {
    this._elImage.src = this._elCanvas.toDataURL("image/png");
    this._elImage.style.display = "block";
    this._elCanvas.style.display = "none";
}

/**
 * Check whether the user's browser supports Data URI or not
 *
 * @private
 * @param {Function} fSuccess Occurs if it supports Data URI
 * @param {Function} fFail Occurs if it doesn't support Data URI
 */
function _safeSetDataURI(fSuccess, fFail) {
    var self = this;
    self._fFail = fFail;
    self._fSuccess = fSuccess;

    // Check it just once
    if (self._bSupportDataURI === null) {
        var el = document.createElement("img");
        var fOnError = () => {
            self._bSupportDataURI = false;

            if (self._fFail) {
                self._fFail.call(self);
            }
        };
        var fOnSuccess = () => {
            self._bSupportDataURI = true;

            if (self._fSuccess) {
                self._fSuccess.call(self);
            }
        };

        el.onabort = fOnError;
        el.onerror = fOnError;
        el.onload = fOnSuccess;
        el.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="; // the Image contains 1px data.
        return;
    } else if (self._bSupportDataURI === true && self._fSuccess) {
        self._fSuccess.call(self);
    } else if (self._bSupportDataURI === false && self._fFail) {
        self._fFail.call(self);
    }
}