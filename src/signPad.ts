/// <reference path="./point.ts"/>
/// <reference path="./signatureCanvas.ts"/>

enum MouseAction {
    DOWN,
    UP,
    MOVE,
    OUT,
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
            docReference: document,
        }
    ) {
        super(canvas, {
            stroke: {
                lineWidth: options.lineWidth,
            },
        });
        this.options.docReference = this.options.docReference || document;
        this.mouseEvents();
    }

    private mouseEvents() {
        let self = this;
        this.viewCanvas.canvas.addEventListener(
            'mousemove',
            function (event) {
                self.handleMouseEvent(MouseAction.MOVE, event);
            },
            false
        );
        this.viewCanvas.canvas.addEventListener(
            'mousedown',
            function (event) {
                self.handleMouseEvent(MouseAction.DOWN, event);
            },
            false
        );
        this.options.docReference.addEventListener(
            'mouseup',
            function (event) {
                self.handleMouseEvent(MouseAction.UP, event);
            },
            false
        );
    }

    private handleMouseEvent(action: MouseAction, event: MouseEvent) {
        switch (action) {
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
                if (this.isMouseDown) {
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
        if (this.data.length == 0) {
            return new Point(0, 0);
        } else if (this.data.length == 1) {
            return this.data[0];
        } else {
            return this.data[this.data.length - 1];
        }
    }

    private createPoint(event: MouseEvent): IPoint {
        let rect = this.viewCanvas.canvas.getBoundingClientRect();
        return new Point(event.clientX - rect.left, event.clientY - rect.top);
    }

    public save(type: string = 'image/png', encoderOptions?: number) {
        return super.saveCropped(Rect.createFromPointArray(this.data), type, encoderOptions);
    }

    public save2(type: string = 'image/png', encoderOptions?: number) {
        let tmpCanvas = document.createElement('canvas');
        let tmpCtx = tmpCanvas.getContext('2d');
        let data = super.save();
        let img = new Image();
        img.onload = () => {
            tmpCtx.drawImage(img, 0, 0);
        };

        img.src = data;
        let range = this.getRectRange();
        var imageData = tmpCtx.getImageData(range.smallest.x, range.smallest.y, range.biggest.x, range.biggest.y);
        var canvas1 = document.createElement('canvas');
        canvas1.width = range.biggest.x - range.smallest.x;
        canvas1.height = range.biggest.y - range.smallest.y;
        var ctx1 = canvas1.getContext('2d');
        ctx1.rect(0, 0, range.biggest.x - range.smallest.x, range.biggest.y - range.smallest.y);
        ctx1.fillStyle = 'white';
        ctx1.fill();
        ctx1.putImageData(imageData, 0, 0);
        return canvas1.toDataURL(type, encoderOptions);
    }

    private getRectRange(): {
        smallest: IPoint;
        biggest: IPoint;
        width?: number;
        height?: number;
    } {
        console.log(this.data);
        let sx = 99999,
            sy = 99999;
        let bx = -1,
            by = -1;
        for (let point of this.data) {
            if (sx >= point.x) {
                sx = point.x;
            }
            if (sy >= point.y) {
                sy = point.y;
            }
            if (bx <= point.x) {
                bx = point.x;
            }
            if (by <= point.y) {
                by = point.y;
            }
        }
        return {
            smallest: new Point(sx, sy),
            biggest: new Point(bx, by),
            width: bx - sx,
            height: by - sy,
        };
    }
}
