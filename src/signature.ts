interface IPoint {
    x: number;
    y: number;
    time: number;
}

class Point implements IPoint {
    public time: number;

    constructor(public x: number, public y: number, time?: number) {
        this.time = time || Date.now();
    }

    distanceTo(start: IPoint): number {
        return Math.sqrt(Math.pow(this.x - start.x, 2)) + Math.pow(this.y - start.y, 2);
    }

    velocityFrom(start: IPoint): number {
        if(this.time === start.time) {
            return 0;
        }
        return this.distanceTo(start) / (this.time - start.time);
    }

    equalTo(other: IPoint): boolean {
        return this.x === other.x && this.y === other.y && this.time === other.time;
    }
}

enum MouseAction {
    DOWN,
    UP,
    MOVE,
    OUT
}

interface SignatureOptions {
    lineWidth: number;
}

class Signature {
    canvasContext: CanvasRenderingContext2D | null = null;
    points: IPoint[] = [];
    isMouseDown = false;

    constructor(
        private canvas: HTMLCanvasElement, 
        private options: SignatureOptions = {
            lineWidth: 2
        }) {

        this.canvasContext = this.canvas.getContext("2d");
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
                this.points.push(point);
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
                    this.drawPoints(this.getPreviousPoint(), point);
                }
                this.points.push(point);
                break;
            }
        }
    }

    private getPreviousPoint(): IPoint {
        if(this.points.length == 0) {
            return new Point(0, 0);
        } else if (this.points.length == 1) {
            return this.points[0];
        } else {
            return this.points[this.points.length - 1];
        }
    }

    private createPoint(event: MouseEvent): IPoint {
        return new Point(
            event.clientX - this.canvas.offsetLeft, 
            event.clientY - this.canvas.offsetTop
        );
    }

    private drawPoints(start: IPoint, end: IPoint) {
        if(this.canvasContext != null) {
            this.canvasContext.beginPath();
            this.canvasContext.moveTo(start.x, start.y);
            this.canvasContext.lineTo(end.x, end.y);
            this.canvasContext.lineWidth = this.options.lineWidth;
            this.canvasContext.stroke();
            this.canvasContext.closePath();
        }
    }

    private drawDot(point: IPoint) {
        if(this.canvasContext != null) {
            this.canvasContext.beginPath();
            this.canvasContext.fillStyle = "black";
            this.canvasContext.fillRect(point.x, point.y, this.options.lineWidth, this.options.lineWidth);
            this.canvasContext.closePath();
        }
    }

    clear() {
        if(this.canvasContext != null) {
            this.canvasContext.clearRect(0 ,0, this.canvas.width, this.canvas.height);
        }
    }

}