interface IPoint {
    x: number;
    y: number;
    time?: number;
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
