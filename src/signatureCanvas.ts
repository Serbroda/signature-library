/// <reference path="./point.ts"/>

interface IStroke {
    lineWidth: number;
    lineDash: number[];
    strokeStyle: string;
    shadowColor: string;
    shadowBlur: number;
}
class ISignatureCanvasOptions {
    leadingLines?: ILeadingLine[];
}

interface ILeadingLine {
    start: IPoint;
    end: IPoint;
    stroke: IStroke;
}

class SignatureCanvas {
    protected canvasContext: CanvasRenderingContext2D;
    protected leadingLines: ILeadingLine[] = [];

    constructor(
        public canvas: HTMLCanvasElement, 
        protected baseOptions: ISignatureCanvasOptions = { }) {
        if(baseOptions.leadingLines) {
            this.leadingLines = baseOptions.leadingLines;
        }
        this.init();
    }

    public init() {
        this.canvasContext = this.canvas.getContext("2d");
        this.addLeadingLine({
            start: {x: 0, y: this.canvas.height - (this.canvas.height / 4)},
            end: {x: this.canvas.width, y: this.canvas.height - (this.canvas.height / 4)},
            stroke: {
                lineWidth: 1.5,
                lineDash: [],
                strokeStyle: '#3498db',
                shadowBlur: 0,
                shadowColor: '#3498db'
            }
        });
        this.addLeadingLine({
            start: {x: 0, y: this.canvas.height / 2},
            end: {x: this.canvas.width, y: this.canvas.height / 2},
            stroke: {
                lineWidth: 1.5,
                lineDash: [5, 4],
                strokeStyle: '#e8e8e8',
                shadowBlur: 0,
                shadowColor: '#e8e8e8'
            }
        });
        this.addLeadingLine({
            start: {x: 0, y: this.canvas.height / 4},
            end: {x: this.canvas.width, y: this.canvas.height / 4},
            stroke: {
                lineWidth: 1.5,
                lineDash: [2, 1],
                strokeStyle: '#e8e8e8',
                shadowBlur: 0,
                shadowColor: '#e8e8e8'
            }
        });
        this.drawLeadingLines();
    }

    public addLeadingLine(leadingLine: ILeadingLine) {
        this.leadingLines.push(leadingLine);
    }

    protected drawLeadingLines() {
        let prevStroke = this.getCurrentContextStroke();
        for(let line of this.leadingLines) {
            this.setStrokeStyle(line.stroke);
            this.drawLine(line.start, line.end);
        }
        
        this.setStrokeStyle(prevStroke);
    }

    public clear(redrawLines: boolean = true) {
        this.canvasContext.clearRect(0 ,0, this.canvas.width, this.canvas.height);
        if(redrawLines) {
            this.drawLeadingLines();
        }
    }

    public drawLine(start: IPoint, end: IPoint) {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(start.x, start.y);
        this.canvasContext.lineTo(end.x, end.y);
        this.canvasContext.stroke();
        this.canvasContext.closePath();
    }

    public drawDot(point: IPoint) {
        if(this.canvasContext != null) {
            this.canvasContext.beginPath();
            this.canvasContext.fillStyle = "black";
            this.canvasContext.fillRect(point.x, point.y, this.canvasContext.lineWidth, this.canvasContext.lineWidth);
            this.canvasContext.closePath();
        }
    }

    protected setStrokeStyle(style: IStroke) {
        this.canvasContext.lineWidth = style.lineWidth;
        this.canvasContext.strokeStyle = style.strokeStyle;
        this.canvasContext.shadowColor = style.shadowColor;
        this.canvasContext.shadowBlur = style.shadowBlur;
        this.canvasContext.setLineDash(style.lineDash);
    }

    protected getCurrentContextStroke(): IStroke {
        return {
            lineWidth: this.canvasContext.lineWidth,
            lineDash: this.canvasContext.getLineDash(),
            strokeStyle: this.canvasContext.strokeStyle as string,
            shadowBlur: this.canvasContext.shadowBlur,
            shadowColor: this.canvasContext.shadowColor,
        }
    }
}