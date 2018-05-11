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
}

class SignPad extends SignatureCanvas {
    canvasContext: CanvasRenderingContext2D | null = null;
    data: IPoint[] = [];
    isMouseDown = false;

    constructor(
        public canvas: HTMLCanvasElement, 
        private options: SignPadOptions = {
            lineWidth: 2
        }) {
        super(canvas);

        this.canvasContext = this.canvas.getContext("2d");
        this.canvasContext.lineWidth = options.lineWidth;
        this.mouseEvents();
    }

    private mouseEvents() {
        let self = this;
        this.canvas.addEventListener("mousemove", function (event) {
            self.handleMouseEvent(MouseAction.MOVE, event);
        }, false);
        this.canvas.addEventListener("mousedown", function (event) {
            self.handleMouseEvent(MouseAction.DOWN, event);
        }, false);
        document.addEventListener("mouseup", function (event) {
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
        return new Point(
            event.clientX - this.canvas.offsetLeft, 
            event.clientY - this.canvas.offsetTop
        );
    }

    public save(type: string = "image/png", encoderOptions?: number): string {
        super.clear(false);
        let last: IPoint = null;
        for(let i = 0; i < this.data.length; i++) {
            if(i == 0) {
                last = this.data[i];
            } else {
                this.drawLine(last, this.data[i]);
                last = this.data[i];
            }
        }
        let img = this.canvas.toDataURL(type, encoderOptions);
        super.drawLeadingLines();
        return img;
    }
}