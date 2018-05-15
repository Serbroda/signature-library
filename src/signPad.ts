/// <reference path="./point.ts"/>
/// <reference path="./signatureCanvas.ts"/>

enum MouseAction {
    DOWN,
    UP,
    MOVE,
    OUT
}

interface SignPadOptions {
    lineWidth: number;
    docReference?: Document;
}

class SignPad extends SignatureCanvas {
    data: IPoint[] = [];
    isMouseDown = false;

    constructor(
        canvas: HTMLCanvasElement, 
        private options: SignPadOptions = {
            lineWidth: 2,
            docReference: document
        }) {
        super(canvas, {
            stroke: {
                lineWidth: options.lineWidth
            }
        });
        this.options.docReference = this.options.docReference || document;
        this.mouseEvents();
    }

    private mouseEvents() {
        
        let self = this;
        this.viewCanvas.canvas.addEventListener("mousemove", function (event) {
            self.handleMouseEvent(MouseAction.MOVE, event);
        }, false);
        this.viewCanvas.canvas.addEventListener("mousedown", function (event) {
            self.handleMouseEvent(MouseAction.DOWN, event);
        }, false);
        this.options.docReference.addEventListener("mouseup", function (event) {
            self.handleMouseEvent(MouseAction.UP, event);
        }, false);
    }

    private handleMouseEvent(action: MouseAction, event: MouseEvent) {
        switch(action) {
            case MouseAction.DOWN: {
                this.isMouseDown = true;
                const point = this.createPoint(event);
                this.data.push(point);
                this.drawDot(point);
                break;
            }
            case MouseAction.UP:
            case MouseAction.OUT:
                this.isMouseDown = false;
                break;
            case MouseAction.MOVE: {
                const point = this.createPoint(event);
                if(this.isMouseDown) {
                    this.drawLine(this.getPreviousPoint(), point);
                    this.data.push(point);
                }
                break;
            }
        }
    }
    
    public clear(redrawLines: boolean = true) {
        super.clear(redrawLines);
        this.data = [];
    }

    private getPreviousPoint(data?: IPoint[]): IPoint {
        let _data: IPoint[] = data || this.data;
        if(this.data.length == 0) {
            return new Point(0, 0);
        } else if (this.data.length == 1) {
            return this.data[0];
        } else {
            return this.data[this.data.length - 1];
        }
    }

    private createPoint(event: MouseEvent): IPoint {
        let rect = this.viewCanvas.canvas.getBoundingClientRect();
        return new Point(
            event.clientX - rect.left, 
            event.clientY - rect.top
        );
    }

}