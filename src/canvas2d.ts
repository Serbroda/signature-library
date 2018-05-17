/// <reference path="./point.ts"/>

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

class Canvas2D {
    private _hasData: boolean = false;

    public context: CanvasRenderingContext2D;

    constructor(public canvas: HTMLCanvasElement, context?: { context: CanvasRenderingContext2D, stroke?: IStroke, font?: string }) {
        if(context) {
            this.context = context.context;
        } else {
            this.context = this.canvas.getContext("2d");
        }
        if(context && context.stroke) {
            this.setStroke(context.stroke);
        }
        if(context && context.font) {
            this.setFont(context.font);
        }
        this._hasData = false;
    }

    public drawLine(start: IPoint, end: IPoint) {
        this.context.beginPath();
        this.context.moveTo(start.x, start.y);
        this.context.lineTo(end.x, end.y);
        this.context.stroke();
        this.context.closePath();
        this._hasData = true;
    }

    public drawDot(point: IPoint) {
        this.context.beginPath();
        this.context.fillStyle = "black";
        this.context.fillRect(point.x, point.y, this.context.lineWidth, this.context.lineWidth);
        this.context.closePath();
        this._hasData = true;
    }

    public drawText(text: string, point: IPoint, font?: string) {
        let fnt = font || this.getFont();
        this.setFont(fnt);
        this.context.fillText(text, point.x, point.y);
        this._hasData = true;
    }

    public drawImage(image: any, point?: IPoint) {
        let pt: IPoint = point || {x: 0, y: 0};
        this.context.putImageData(image, pt.x, pt.y);
    }

    public uploadImage(fileEvent: any) {
        var reader = new FileReader();
        reader.onload = (e: any) => {
            let img = new Image();
            img.onload = () => {
                this.canvas.width = img.width;
                this.canvas.height = img.height;
                this.context.drawImage(img, 0, 0);
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(fileEvent.target.files[0]);
    }

    public clear() {
        this.context.clearRect(0 ,0, this.canvas.width, this.canvas.height);
        this._hasData = false;
    }

    public setStroke(stroke: IStroke) {
        this.context.lineWidth = stroke.lineWidth || this.context.lineWidth;
        this.context.strokeStyle = stroke.strokeStyle || this.context.strokeStyle;
        this.context.shadowColor = stroke.shadowColor || this.context.shadowColor;
        this.context.shadowBlur = stroke.shadowBlur || this.context.shadowBlur;
        if(stroke.lineDash) {
            this.context.setLineDash(stroke.lineDash);
        }
    }

    public getStroke(): IStroke {
        return {
            lineWidth: this.context.lineWidth,
            lineDash: this.context.getLineDash(),
            strokeStyle: this.context.strokeStyle as string,
            shadowBlur: this.context.shadowBlur,
            shadowColor: this.context.shadowColor,
        }
    }

    public getFont(): string {
        return this.context.font;
    }

    public setFont(font: string) {
        this.context.font = font;
    }

    public copy(): Canvas2D {
        return Canvas2D.copyFrom(this);
    }

    public hasData(): boolean {
        return this._hasData;
    }

    public save(options?: ICanvas2DSaveOptions): any {
        let opt = options || {type: 'base64'};
        switch(opt.type) {
            case 'imageData':
                return this.saveImageData();
            case 'bytes':
                return this.saveArrayBuffer();
            default:
                return this.saveBase64();
        }
    }

    public saveBase64(type: string = "image/png", encoderOptions?: number) {
        return this.canvas.toDataURL(type, encoderOptions);
    }

    public saveArrayBuffer() {
        let base64 = this.save();
        let binary_string =  window.atob(base64);
        let len = binary_string.length;
        let bytes = new Uint8Array( len );
        for (let i = 0; i < len; i++)        {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    public saveImageData() {
        return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    public saveCropped(rect: IRect, type: string = "image/png", encoderOptions?: number) {
        let img = this.context.getImageData(
            rect.smallest.x, 
            rect.smallest.y, 
            rect.width, 
            rect.height
        );

        let tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = img.width;
        tmpCanvas.height = img.height;
        tmpCanvas.style.border = "1px solid black";
        let tmpContext = tmpCanvas.getContext("2d");
        tmpContext.putImageData(img, 0, 0);
        document.getElementsByTagName("body")[0].appendChild(tmpCanvas);
        return tmpCanvas.toDataURL(type, encoderOptions);
    }

    static copyFrom(canvas: Canvas2D): Canvas2D {
        let element = document.createElement("canvas");
        element.width = canvas.canvas.width;
        element.height = canvas.canvas.height;
        let ctx = element.getContext("2d");
        ctx.lineWidth = canvas.context.lineWidth;
        ctx.strokeStyle = canvas.context.strokeStyle;
        ctx.shadowColor = canvas.context.shadowColor;
        ctx.shadowBlur = canvas.context.shadowBlur;
        ctx.setLineDash(canvas.context.getLineDash());
        ctx.font = canvas.context.font;
        return new Canvas2D(element, {context: ctx });
    }
}
