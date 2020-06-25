interface IPoint {
    x: number;
    y: number;
    time?: number;
}
interface IRect {
    smallest: IPoint;
    largest: IPoint;
    height?: number;
    width?: number;
}
declare class Point implements IPoint {
    x: number;
    y: number;
    time: number;
    constructor(x: number, y: number, time?: number);
    distanceTo(start: IPoint): number;
    velocityFrom(start: IPoint): number;
    equalTo(other: IPoint): boolean;
}
declare class Rect implements IRect {
    smallest: IPoint;
    largest: IPoint;
    width: number;
    height: number;
    constructor(smallest: IPoint, largest: IPoint);
    static createFromPointArray(points: IPoint[]): IRect;
}
interface IStroke {
    lineWidth?: number;
    lineDash?: number[];
    strokeStyle?: string;
    shadowColor?: string;
    shadowBlur?: number;
}
interface ICanvas2DSaveOptions {
    type: 'base64' | 'bytes' | 'imageData';
    options?: any;
    cropTo?: IRect;
}
declare class Canvas2D {
    canvas: HTMLCanvasElement;
    private _hasData;
    context: CanvasRenderingContext2D;
    constructor(canvas: HTMLCanvasElement, context?: {
        context: CanvasRenderingContext2D;
        stroke?: IStroke;
        font?: string;
    });
    drawLine(start: IPoint, end: IPoint): void;
    drawDot(point: IPoint): void;
    drawText(text: string, point: IPoint, font?: string): void;
    drawImage(image: any, point?: IPoint): void;
    uploadImage(fileEvent: any): void;
    clear(): void;
    setStroke(stroke: IStroke): void;
    getStroke(): IStroke;
    getFont(): string;
    setFont(font: string): void;
    copy(): Canvas2D;
    hasData(): boolean;
    save(options?: ICanvas2DSaveOptions): any;
    saveBase64(type?: string, encoderOptions?: number): string;
    saveArrayBuffer(): ArrayBuffer;
    saveImageData(): ImageData;
    saveCropped(rect: IRect, type?: string, encoderOptions?: number): string;
    static copyFrom(canvas: Canvas2D): Canvas2D;
}
declare class ISignatureCanvasOptions {
    leadingLines?: ILeadingLine[];
    stroke?: IStroke;
}
interface ILeadingLine {
    start: IPoint;
    end: IPoint;
    stroke: IStroke;
}
declare class SignatureCanvas {
    protected baseOptions: ISignatureCanvasOptions;
    protected baseCanvasElement: HTMLCanvasElement;
    protected viewCanvas: Canvas2D;
    protected dataCanvas: Canvas2D;
    protected leadingLines: ILeadingLine[];
    constructor(canvas: HTMLCanvasElement, baseOptions?: ISignatureCanvasOptions);
    init(): void;
    addLeadingLine(leadingLine: ILeadingLine): void;
    protected drawLeadingLines(): void;
    clear(redrawLines?: boolean): void;
    drawLine(start: IPoint, end: IPoint): void;
    drawDot(point: IPoint): void;
    setFont(font: string): void;
    hasData(): boolean;
    save(): string;
    saveCropped(rect: IRect, type?: string, encoderOptions?: number): string;
}
declare enum MouseAction {
    DOWN = 0,
    UP = 1,
    MOVE = 2,
    OUT = 3
}
interface SignPadOptions {
    lineWidth: number;
    docReference?: Document;
}
declare class SignPad extends SignatureCanvas {
    private options;
    data: IPoint[];
    isMouseDown: boolean;
    constructor(canvas: HTMLCanvasElement, options?: SignPadOptions);
    private mouseEvents;
    private handleMouseEvent;
    clear(redrawLines?: boolean): void;
    private getPreviousPoint;
    private createPoint;
    save(type?: string, encoderOptions?: number): string;
    save2(type?: string, encoderOptions?: number): string;
    private getRectRange;
}
interface TextSignatureOptions {
    fontSize: string;
    fontFamily: string;
    docReference?: Document;
}
declare class TextSignature extends SignatureCanvas {
    private options;
    constructor(canvas: HTMLCanvasElement, options?: TextSignatureOptions);
    drawText(text: string, dataOnly?: boolean, font?: string): void;
    private getFont;
    setFont(font: string): void;
    private loadFont;
}
//# sourceMappingURL=signature.d.ts.map