/// <reference path="./point.ts"/>

interface IStroke {
    lineWidth: number;
    strokeStyle: string;
    shadowColor: string;
    shadowBlur: number;
}
class ISignatureCanvasOptions {
    drawLeadingLine: boolean;
    leadingLineStyle: IStroke;
}

class SignatureCanvas {
    protected canvasContext: CanvasRenderingContext2D;

    constructor(
        public canvas: HTMLCanvasElement, 
        protected baseOptions: ISignatureCanvasOptions = { 
            drawLeadingLine: true,
            leadingLineStyle: {
                lineWidth: 1.5,
                strokeStyle: '#3498db',
                shadowBlur: 0,
                shadowColor: '#1f98ed'
            }
        }) {
        this.init();
    }

    public init() {
        this.canvasContext = this.canvas.getContext("2d");
        if(this.baseOptions.drawLeadingLine) {
            this.drawLeadingLine();
        }
    }

    private drawLeadingLine() {
        let start: IPoint = {x: 0, y: this.canvas.height - (this.canvas.height / 3)};
        let end: IPoint = {x: this.canvas.width, y: this.canvas.height - (this.canvas.height / 3)};

        let prevStroke = this.getCurrentContextStroke();
        this.setStrokeStyle(this.baseOptions.leadingLineStyle);
        this.drawSimpleLine(start, end);
        this.setStrokeStyle(prevStroke);
    }

    public clear() {
        this.canvasContext.clearRect(0 ,0, this.canvas.width, this.canvas.height);
        if(this.baseOptions.drawLeadingLine) {
            this.drawLeadingLine();
        }
    }

    public drawSimpleLine(start: IPoint, end: IPoint) {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(start.x, start.y);
        this.canvasContext.lineTo(end.x, end.y);
        this.canvasContext.stroke();
        this.canvasContext.closePath();
    }

    protected setStrokeStyle(style: IStroke) {
        this.canvasContext.lineWidth = style.lineWidth;
        this.canvasContext.strokeStyle = style.strokeStyle;
        this.canvasContext.shadowColor = style.shadowColor;
        this.canvasContext.shadowBlur = style.shadowBlur;
    }

    protected getCurrentContextStroke(): IStroke {
        return {
            lineWidth: this.canvasContext.lineWidth,
            strokeStyle: this.canvasContext.strokeStyle as string,
            shadowBlur: this.canvasContext.shadowBlur,
            shadowColor: this.canvasContext.shadowColor
        }
    }
}