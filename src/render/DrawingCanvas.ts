// android 2.x doesn't support Data-URI spec
import {Render} from "./IDrawer";
import {QRCodeModel} from "../QRCodeModel";
import {QROptions} from "../QRCode";

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
    private readonly canvas: HTMLCanvasElement
    private readonly options: QROptions;
    private image: HTMLImageElement;
    private context2D: CanvasRenderingContext2D;
    private supportDataURI: boolean;
    private _bIsPainted: boolean;
    private _android: boolean;

    constructor(options: Readonly<QROptions>) {
        this._bIsPainted = false;
        this._android = _getAndroid();

        this.options = options;
        this.canvas = document.createElement("canvas");
        this.canvas.width = options.width;
        this.canvas.height = options.height;
    }

    public drawAt(oQRCode: QRCodeModel, root: HTMLElement) {
        root.appendChild(this.canvas);
        this.context2D = this.canvas.getContext("2d");
        this._bIsPainted = false;
        this.image = document.createElement("img");
        this.image.alt = "Scan me!";
        this.image.style.display = "none";
        root.appendChild(this.image);
        this.supportDataURI = undefined;

        const nCount = oQRCode.getModuleCount();
        const nWidth = this.options.width / nCount;
        const nHeight = this.options.height / nCount;
        const nRoundedWidth = Math.round(nWidth);
        const nRoundedHeight = Math.round(nHeight);

        this.image.style.display = "none";
        this.clear();

        for (let row = 0; row < nCount; row++) {
            for (let col = 0; col < nCount; col++) {
                const bIsDark = oQRCode.isDark(row, col);
                const nLeft = col * nWidth;
                const nTop = row * nHeight;
                this.context2D.strokeStyle = bIsDark ? this.options.colorDark : this.options.colorLight;
                this.context2D.lineWidth = 1;
                this.context2D.fillStyle = bIsDark ? this.options.colorDark : this.options.colorLight;
                this.context2D.fillRect(nLeft, nTop, nWidth, nHeight);

                this.context2D.strokeRect(
                    Math.floor(nLeft) + 0.5,
                    Math.floor(nTop) + 0.5,
                    nRoundedWidth,
                    nRoundedHeight
                );

                this.context2D.strokeRect(
                    Math.ceil(nLeft) - 0.5,
                    Math.ceil(nTop) - 0.5,
                    nRoundedWidth,
                    nRoundedHeight
                );
            }
        }

        this._bIsPainted = true;
        if (this._bIsPainted) {
            this.image.onerror = () => {
                this.supportDataURI = false
            }
            this.image.onload = () => {
                this.supportDataURI = true
            }
            this.image.style.display = "block";
            this.image.src = this.canvas.toDataURL("image/png");
            this.image.style.display = "none";
        }
    };

    /**
     * Clear the QRCode
     */
    public clear() {
        this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this._bIsPainted = false;
    };
}