import {Render} from "./IDrawer";
import {QROptions} from "../QRCode";
import {QRCodeModel} from "../QRCodeModel";

export class DrawingHack implements Render {
    private readonly options: QROptions;
    private root: HTMLElement | undefined;

    constructor(options: Readonly<QROptions>) {
        this.options = options;
    }

    public drawAt(oQRCode: QRCodeModel, root: HTMLElement) {
        this.root = root;

        const nCount = oQRCode.getModuleCount();
        const nWidth = Math.floor(this.options.width / nCount);
        const nHeight = Math.floor(this.options.height / nCount);
        const aHTML = ['<table style="border:0;border-collapse:collapse;">'];

        for (let row = 0; row < nCount; row++) {
            aHTML.push('<tr>');

            for (let col = 0; col < nCount; col++) {
                aHTML.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + nWidth + 'px;height:' + nHeight + 'px;background-color:' + (oQRCode.isDark(row, col) ? this.options.colorDark : this.options.colorLight) + ';"></td>');
            }

            aHTML.push('</tr>');
        }

        aHTML.push('</table>');
        root.innerHTML = aHTML.join('');

        // Fix the margin values as real size.
        const elTable = root.childNodes[0] as HTMLTableElement;
        const nLeftMarginTable = (this.options.width - elTable.offsetWidth) / 2;
        const nTopMarginTable = (this.options.height - elTable.offsetHeight) / 2;

        if (nLeftMarginTable > 0 && nTopMarginTable > 0) {
            elTable.style.margin = nTopMarginTable + "px " + nLeftMarginTable + "px";
        }
    };

    /**
     * Clear the QRCode
     */
    public clear() {
        if (this.root) {
            this.root.innerHTML = '';
            this.root = undefined;
        }
    };
}
