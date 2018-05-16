/// <reference path="./point.ts"/>
/// <reference path="./canvas2d.ts"/>

class ISignatureCanvasOptions {
    leadingLines?: ILeadingLine[];
    stroke?: IStroke;
}

interface ILeadingLine {
    start: IPoint;
    end: IPoint;
    stroke: IStroke;
}

class SignatureCanvas {
    protected baseCanvasElement: HTMLCanvasElement;
    protected viewCanvas: Canvas2D;
    protected dataCanvas: Canvas2D;

    protected leadingLines: ILeadingLine[] = [];

    constructor(canvas: HTMLCanvasElement, protected baseOptions: ISignatureCanvasOptions = { }) {
        this.baseCanvasElement = canvas;
        if(baseOptions.leadingLines) {
            this.leadingLines = baseOptions.leadingLines;
        }
        this.init();
    }

    public init() {
        this.viewCanvas = new Canvas2D(this.baseCanvasElement);
        this.dataCanvas = this.viewCanvas.copy();

        this.addLeadingLine({
            start: {x: 0, y: this.baseCanvasElement.height - (this.baseCanvasElement.height / 4)},
            end: {x: this.baseCanvasElement.width, y: this.baseCanvasElement.height - (this.baseCanvasElement.height / 4)},
            stroke: {
                lineWidth: 1.5,
                lineDash: [],
                strokeStyle: '#3498db',
                shadowBlur: 0,
                shadowColor: '#3498db'
            }
        });
        this.addLeadingLine({
            start: {x: 0, y: this.baseCanvasElement.height / 2},
            end: {x: this.baseCanvasElement.width, y: this.baseCanvasElement.height / 2},
            stroke: {
                lineWidth: 1.5,
                lineDash: [5, 4],
                strokeStyle: '#e8e8e8',
                shadowBlur: 0,
                shadowColor: '#e8e8e8'
            }
        });
        this.addLeadingLine({
            start: {x: 0, y: this.baseCanvasElement.height / 4},
            end: {x: this.baseCanvasElement.width, y: this.baseCanvasElement.height / 4},
            stroke: {
                lineWidth: 1.5,
                lineDash: [2, 1],
                strokeStyle: '#e8e8e8',
                shadowBlur: 0,
                shadowColor: '#e8e8e8'
            }
        });
        this.drawLeadingLines();
         if(this.baseOptions.stroke) {
            console.log(this.baseOptions.stroke);
            this.viewCanvas.setStroke(this.baseOptions.stroke);
            this.dataCanvas.setStroke(this.baseOptions.stroke);
        }
    }

    public addLeadingLine(leadingLine: ILeadingLine) {
        this.leadingLines.push(leadingLine);
    }

    protected drawLeadingLines() {
        let prevStroke = this.viewCanvas.getStroke();
        for(let line of this.leadingLines) {
            this.viewCanvas.setStroke(line.stroke);
            this.viewCanvas.drawLine(line.start, line.end);
        }
        this.viewCanvas.setStroke(prevStroke);
    }

    public clear(redrawLines: boolean = true) {
        this.viewCanvas.clear();
        this.dataCanvas.clear();
        if(redrawLines) {
            this.drawLeadingLines();
        }
    }

    public drawLine(start: IPoint, end: IPoint) {
        this.viewCanvas.drawLine(start, end);
        this.dataCanvas.drawLine(start, end);
    }

    public drawDot(point: IPoint) {
        this.viewCanvas.drawDot(point);
        this.dataCanvas.drawDot(point);
    }

    public hasData(): boolean {
        return this.dataCanvas.hasData();
    }

    public save(type: string = "image/png", encoderOptions?: number): string {
        return this.dataCanvas.save(type, encoderOptions);
    }

    public saveCropped(rect: IRect, type: string = "image/png", encoderOptions?: number) {
        return this.dataCanvas.saveCropped(rect, type, encoderOptions);
    }
}