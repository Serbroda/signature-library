/// <reference path="./point.ts"/>
/// <reference path="./canvas2d.ts"/>

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
    protected canvasGroup: Canvas2DGroup;
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
        let visibleCanvas = new Canvas2D(this.canvas);
        this.canvasGroup = new Canvas2DGroup(visibleCanvas, visibleCanvas.copy());

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
        let prevStroke = this.canvasGroup.visibleCanvas.getStroke();
        for(let line of this.leadingLines) {
            this.canvasGroup.visibleCanvas.setStroke(line.stroke);
            this.canvasGroup.drawLine(line.start, line.end, Canvas2DGroupDraw.VISIBLE);
        }
        this.canvasGroup.visibleCanvas.setStroke(prevStroke);
    }

    public clear(redrawLines: boolean = true) {
        this.canvasGroup.clear();
        if(redrawLines) {
            this.drawLeadingLines();
        }
    }

    public drawLine(start: IPoint, end: IPoint) {
        this.canvasGroup.drawLine(start, end);
    }

    public drawDot(point: IPoint) {
        this.canvasGroup.drawDot(point);
    }
}