import {Render} from "./IDrawer";
import {QROptions} from "../QRCode";

export class DrawingSVG implements Render {
    private readonly element: HTMLElement
    private readonly options: QROptions

    constructor(element: HTMLElement, options: Readonly<QROptions>) {
        this.element = element;
        this.options = options;
    }

    public draw(oQRCode): void {
        const nCount = oQRCode.getModuleCount();

        this.clear();

        function makeSVG(tag, attrs) {
            var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (var k in attrs)
                if (attrs.hasOwnProperty(k)) el.setAttribute(k, attrs[k]);
            return el;
        }

        var svg = makeSVG("svg", {
            'viewBox': '0 0 ' + String(nCount) + " " + String(nCount),
            'width': '100%',
            'height': '100%',
            'fill': this.options.colorLight
        });
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        this.element.appendChild(svg);

        svg.appendChild(makeSVG("rect", {
            "fill": this.options.colorLight,
            "width": "100%",
            "height": "100%"
        }));
        svg.appendChild(makeSVG("rect", {
            "fill": this.options.colorDark,
            "width": "1",
            "height": "1",
            "id": "template"
        }));

        for (var row = 0; row < nCount; row++) {
            for (var col = 0; col < nCount; col++) {
                if (oQRCode.isDark(row, col)) {
                    var child = makeSVG("use", {"x": String(col), "y": String(row)});
                    child.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template")
                    svg.appendChild(child);
                }
            }
        }
    };

    public clear(): void {
        while (this.element.hasChildNodes())
            this.element.removeChild(this.element.lastChild);
    };

    public makeImage(): void {

    }
}

