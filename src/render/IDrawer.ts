import {QRCodeModel} from "../QRCodeModel";

export interface Render {
    clear(): void,

    draw(model: QRCodeModel): void,
}