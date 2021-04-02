interface IPoint {
    x: number;
    y: number;
    time?: number;
}

interface IRect {
    smallest: IPoint;
    largest: IPoint;
    height?: number;
    width?: number;
}

class Point implements IPoint {
    public time: number;

    constructor(public x: number, public y: number, time?: number) {
        this.time = time || Date.now();
    }

    public distanceTo(start: IPoint): number {
        return Math.sqrt(Math.pow(this.x - start.x, 2)) + Math.pow(this.y - start.y, 2);
    }

    public velocityFrom(start: IPoint): number {
        if (this.time === start.time) {
            return 0;
        }
        return this.distanceTo(start) / (this.time - start.time);
    }

    public equalTo(other: IPoint): boolean {
        return this.x === other.x && this.y === other.y && this.time === other.time;
    }
}

class Rect implements IRect {
    public width: number;
    public height: number;

    constructor(public smallest: IPoint, public largest: IPoint) {
        this.width = largest.x - smallest.x;
        this.height = largest.y - smallest.y;
    }

    static createFromPointArray(points: IPoint[]): IRect {
        let sx = 99999,
            sy = 99999;
        let bx = -1,
            by = -1;
        for (let point of points) {
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
        return new Rect({ x: sx, y: sy }, { x: bx, y: by });
    }
}
