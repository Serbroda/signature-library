/// <reference path="./point.ts"/>

interface IStroke {
    lineWidth?: number;
    lineDash?: number[];
    strokeStyle?: string;
    shadowColor?: string;
    shadowBlur?: number;
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

    public save(type: string = "image/png", encoderOptions?: number): string {
        
        return this.canvas.toDataURL(type, encoderOptions);
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
