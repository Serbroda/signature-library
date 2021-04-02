var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Point = /** @class */ (function () {
    function Point(x, y, time) {
        this.x = x;
        this.y = y;
        this.time = time || Date.now();
    }
    Point.prototype.distanceTo = function (start) {
        return Math.sqrt(Math.pow(this.x - start.x, 2)) + Math.pow(this.y - start.y, 2);
    };
    Point.prototype.velocityFrom = function (start) {
        if (this.time === start.time) {
            return 0;
        }
        return this.distanceTo(start) / (this.time - start.time);
    };
    Point.prototype.equalTo = function (other) {
        return this.x === other.x && this.y === other.y && this.time === other.time;
    };
    return Point;
}());
var Rect = /** @class */ (function () {
    function Rect(smallest, largest) {
        this.smallest = smallest;
        this.largest = largest;
        this.width = largest.x - smallest.x;
        this.height = largest.y - smallest.y;
    }
    Rect.createFromPointArray = function (points) {
        var sx = 99999, sy = 99999;
        var bx = -1, by = -1;
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var point = points_1[_i];
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
    };
    return Rect;
}());
/// <reference path="./point.ts"/>
var Canvas2D = /** @class */ (function () {
    function Canvas2D(canvas, context) {
        this.canvas = canvas;
        this._hasData = false;
        if (context) {
            this.context = context.context;
        }
        else {
            this.context = this.canvas.getContext('2d');
        }
        if (context && context.stroke) {
            this.setStroke(context.stroke);
        }
        if (context && context.font) {
            this.setFont(context.font);
        }
        if (canvas.className.indexOf('signature-fullwidth') !== -1) {
            canvas.width = canvas.parentElement.clientWidth;
        }
        if (canvas.className.indexOf('signature-fullwidth-responsive') !== -1) {
            var self_1 = this;
            window.addEventListener('resize', function () {
                var image = self_1.saveImageData();
                self_1.canvas.width = canvas.parentElement.clientWidth;
                self_1.context.putImageData(image, 0, 0);
            });
        }
        this._hasData = false;
    }
    Canvas2D.prototype.drawLine = function (start, end) {
        this.context.beginPath();
        this.context.moveTo(start.x, start.y);
        this.context.lineTo(end.x, end.y);
        this.context.stroke();
        this.context.closePath();
        this._hasData = true;
    };
    Canvas2D.prototype.drawDot = function (point) {
        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.fillRect(point.x, point.y, this.context.lineWidth, this.context.lineWidth);
        this.context.closePath();
        this._hasData = true;
    };
    Canvas2D.prototype.drawText = function (text, point, font) {
        var fnt = font || this.getFont();
        this.setFont(fnt);
        this.context.fillText(text, point.x, point.y);
        this._hasData = true;
    };
    Canvas2D.prototype.drawImage = function (image, point) {
        var pt = point || { x: 0, y: 0 };
        this.context.putImageData(image, pt.x, pt.y);
    };
    Canvas2D.prototype.uploadImage = function (fileEvent) {
        var _this = this;
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = new Image();
            img.onload = function () {
                _this.canvas.width = img.width;
                _this.canvas.height = img.height;
                _this.context.drawImage(img, 0, 0);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(fileEvent.target.files[0]);
    };
    Canvas2D.prototype.clear = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this._hasData = false;
    };
    Canvas2D.prototype.setStroke = function (stroke) {
        this.context.lineWidth = stroke.lineWidth || this.context.lineWidth;
        this.context.strokeStyle = stroke.strokeStyle || this.context.strokeStyle;
        this.context.shadowColor = stroke.shadowColor || this.context.shadowColor;
        this.context.shadowBlur = stroke.shadowBlur || this.context.shadowBlur;
        if (stroke.lineDash) {
            this.context.setLineDash(stroke.lineDash);
        }
    };
    Canvas2D.prototype.getStroke = function () {
        return {
            lineWidth: this.context.lineWidth,
            lineDash: this.context.getLineDash(),
            strokeStyle: this.context.strokeStyle,
            shadowBlur: this.context.shadowBlur,
            shadowColor: this.context.shadowColor
        };
    };
    Canvas2D.prototype.getFont = function () {
        return this.context.font;
    };
    Canvas2D.prototype.setFont = function (font) {
        this.context.font = font;
    };
    Canvas2D.prototype.copy = function () {
        return Canvas2D.copyFrom(this);
    };
    Canvas2D.prototype.hasData = function () {
        return this._hasData;
    };
    Canvas2D.prototype.save = function (options) {
        var opt = options || { type: 'base64' };
        switch (opt.type) {
            case 'imageData':
                return this.saveImageData();
            case 'bytes':
                return this.saveArrayBuffer();
            default:
                return this.saveBase64();
        }
    };
    Canvas2D.prototype.saveBase64 = function (type, encoderOptions) {
        if (type === void 0) { type = 'image/png'; }
        return this.canvas.toDataURL(type, encoderOptions);
    };
    Canvas2D.prototype.saveArrayBuffer = function () {
        var base64 = this.save();
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    };
    Canvas2D.prototype.saveImageData = function () {
        return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    };
    Canvas2D.prototype.saveCropped = function (rect, type, encoderOptions) {
        if (type === void 0) { type = 'image/png'; }
        var img = this.context.getImageData(rect.smallest.x, rect.smallest.y, rect.width, rect.height);
        var tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = img.width;
        tmpCanvas.height = img.height;
        var tmpContext = tmpCanvas.getContext('2d');
        tmpContext.putImageData(img, 0, 0);
        return tmpCanvas.toDataURL(type, encoderOptions);
    };
    Canvas2D.copyFrom = function (canvas) {
        var element = document.createElement('canvas');
        element.width = canvas.canvas.width;
        element.height = canvas.canvas.height;
        var ctx = element.getContext('2d');
        ctx.lineWidth = canvas.context.lineWidth;
        ctx.strokeStyle = canvas.context.strokeStyle;
        ctx.shadowColor = canvas.context.shadowColor;
        ctx.shadowBlur = canvas.context.shadowBlur;
        ctx.setLineDash(canvas.context.getLineDash());
        ctx.font = canvas.context.font;
        return new Canvas2D(element, { context: ctx });
    };
    return Canvas2D;
}());
/// <reference path="./point.ts"/>
/// <reference path="./canvas2d.ts"/>
var ISignatureCanvasOptions = /** @class */ (function () {
    function ISignatureCanvasOptions() {
    }
    return ISignatureCanvasOptions;
}());
var SignatureCanvas = /** @class */ (function () {
    function SignatureCanvas(canvas, baseOptions) {
        if (baseOptions === void 0) { baseOptions = {}; }
        this.baseOptions = baseOptions;
        this.leadingLines = [];
        this.baseCanvasElement = canvas;
        if (baseOptions.leadingLines) {
            this.leadingLines = baseOptions.leadingLines;
        }
        this.init();
    }
    SignatureCanvas.prototype.init = function () {
        this.viewCanvas = new Canvas2D(this.baseCanvasElement);
        this.dataCanvas = this.viewCanvas.copy();
        this.addLeadingLine({
            start: { x: 0, y: this.baseCanvasElement.height - this.baseCanvasElement.height / 4 },
            end: {
                x: this.baseCanvasElement.width,
                y: this.baseCanvasElement.height - this.baseCanvasElement.height / 4
            },
            stroke: {
                lineWidth: 1.5,
                lineDash: [],
                strokeStyle: '#3498db',
                shadowBlur: 0,
                shadowColor: '#3498db'
            }
        });
        this.addLeadingLine({
            start: { x: 0, y: this.baseCanvasElement.height / 2 },
            end: { x: this.baseCanvasElement.width, y: this.baseCanvasElement.height / 2 },
            stroke: {
                lineWidth: 1.5,
                lineDash: [5, 4],
                strokeStyle: '#e8e8e8',
                shadowBlur: 0,
                shadowColor: '#e8e8e8'
            }
        });
        this.addLeadingLine({
            start: { x: 0, y: this.baseCanvasElement.height / 4 },
            end: { x: this.baseCanvasElement.width, y: this.baseCanvasElement.height / 4 },
            stroke: {
                lineWidth: 1.5,
                lineDash: [2, 1],
                strokeStyle: '#e8e8e8',
                shadowBlur: 0,
                shadowColor: '#e8e8e8'
            }
        });
        this.drawLeadingLines();
        if (this.baseOptions.stroke) {
            this.viewCanvas.setStroke(this.baseOptions.stroke);
            this.dataCanvas.setStroke(this.baseOptions.stroke);
        }
    };
    SignatureCanvas.prototype.addLeadingLine = function (leadingLine) {
        this.leadingLines.push(leadingLine);
    };
    SignatureCanvas.prototype.drawLeadingLines = function () {
        var prevStroke = this.viewCanvas.getStroke();
        for (var _i = 0, _a = this.leadingLines; _i < _a.length; _i++) {
            var line = _a[_i];
            this.viewCanvas.setStroke(line.stroke);
            this.viewCanvas.drawLine(line.start, line.end);
        }
        this.viewCanvas.setStroke(prevStroke);
    };
    SignatureCanvas.prototype.clear = function (redrawLines) {
        if (redrawLines === void 0) { redrawLines = true; }
        this.viewCanvas.clear();
        this.dataCanvas.clear();
        if (redrawLines) {
            this.drawLeadingLines();
        }
    };
    SignatureCanvas.prototype.drawLine = function (start, end) {
        this.viewCanvas.drawLine(start, end);
        this.dataCanvas.drawLine(start, end);
    };
    SignatureCanvas.prototype.drawDot = function (point) {
        this.viewCanvas.drawDot(point);
        this.dataCanvas.drawDot(point);
    };
    SignatureCanvas.prototype.setFont = function (font) {
        this.viewCanvas.setFont(font);
        this.dataCanvas.setFont(font);
    };
    SignatureCanvas.prototype.hasData = function () {
        return this.dataCanvas.hasData();
    };
    SignatureCanvas.prototype.save = function () {
        return this.dataCanvas.save();
    };
    SignatureCanvas.prototype.saveCropped = function (rect, type, encoderOptions) {
        if (type === void 0) { type = 'image/png'; }
        return this.dataCanvas.saveCropped(rect, type, encoderOptions);
    };
    return SignatureCanvas;
}());
/// <reference path="./point.ts"/>
/// <reference path="./signatureCanvas.ts"/>
var MouseAction;
/// <reference path="./point.ts"/>
/// <reference path="./signatureCanvas.ts"/>
(function (MouseAction) {
    MouseAction[MouseAction["DOWN"] = 0] = "DOWN";
    MouseAction[MouseAction["UP"] = 1] = "UP";
    MouseAction[MouseAction["MOVE"] = 2] = "MOVE";
    MouseAction[MouseAction["OUT"] = 3] = "OUT";
})(MouseAction || (MouseAction = {}));
var SignPad = /** @class */ (function (_super) {
    __extends(SignPad, _super);
    function SignPad(canvas, options) {
        if (options === void 0) { options = {
            lineWidth: 2,
            docReference: document
        }; }
        var _this = _super.call(this, canvas, {
            stroke: {
                lineWidth: options.lineWidth
            }
        }) || this;
        _this.options = options;
        _this.data = [];
        _this.isMouseDown = false;
        _this.options.docReference = _this.options.docReference || document;
        _this.mouseEvents();
        return _this;
    }
    SignPad.prototype.mouseEvents = function () {
        var self = this;
        this.viewCanvas.canvas.addEventListener('mousemove', function (event) {
            self.handleMouseEvent(MouseAction.MOVE, event);
        }, false);
        this.viewCanvas.canvas.addEventListener('mousedown', function (event) {
            self.handleMouseEvent(MouseAction.DOWN, event);
        }, false);
        this.options.docReference.addEventListener('mouseup', function (event) {
            self.handleMouseEvent(MouseAction.UP, event);
        }, false);
    };
    SignPad.prototype.handleMouseEvent = function (action, event) {
        switch (action) {
            case MouseAction.DOWN: {
                this.isMouseDown = true;
                var point = this.createPoint(event);
                this.data.push(point);
                this.drawDot(point);
                break;
            }
            case MouseAction.UP:
            case MouseAction.OUT:
                this.isMouseDown = false;
                break;
            case MouseAction.MOVE: {
                var point = this.createPoint(event);
                if (this.isMouseDown) {
                    this.drawLine(this.getPreviousPoint(), point);
                    this.data.push(point);
                }
                break;
            }
        }
    };
    SignPad.prototype.clear = function (redrawLines) {
        if (redrawLines === void 0) { redrawLines = true; }
        _super.prototype.clear.call(this, redrawLines);
        this.data = [];
    };
    SignPad.prototype.getPreviousPoint = function (data) {
        var _data = data || this.data;
        if (this.data.length == 0) {
            return new Point(0, 0);
        }
        else if (this.data.length == 1) {
            return this.data[0];
        }
        else {
            return this.data[this.data.length - 1];
        }
    };
    SignPad.prototype.createPoint = function (event) {
        var rect = this.viewCanvas.canvas.getBoundingClientRect();
        return new Point(event.clientX - rect.left, event.clientY - rect.top);
    };
    SignPad.prototype.save = function (type, encoderOptions) {
        if (type === void 0) { type = 'image/png'; }
        return _super.prototype.saveCropped.call(this, Rect.createFromPointArray(this.data), type, encoderOptions);
    };
    SignPad.prototype.save2 = function (type, encoderOptions) {
        if (type === void 0) { type = 'image/png'; }
        var tmpCanvas = document.createElement('canvas');
        var tmpCtx = tmpCanvas.getContext('2d');
        var data = _super.prototype.save.call(this);
        var img = new Image();
        img.onload = function () {
            tmpCtx.drawImage(img, 0, 0);
        };
        img.src = data;
        var range = this.getRectRange();
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
    };
    SignPad.prototype.getRectRange = function () {
        console.log(this.data);
        var sx = 99999, sy = 99999;
        var bx = -1, by = -1;
        for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
            var point = _a[_i];
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
            height: by - sy
        };
    };
    return SignPad;
}(SignatureCanvas));
/// <reference path="./signatureCanvas.ts"/>
var TextSignature = /** @class */ (function (_super) {
    __extends(TextSignature, _super);
    function TextSignature(canvas, options) {
        if (options === void 0) { options = {
            fontSize: '70px',
            fontFamily: 'Signature',
            docReference: document
        }; }
        var _this = _super.call(this, canvas) || this;
        _this.options = options;
        _this.options.docReference = _this.options.docReference || document;
        _this.loadFont(_this.options.fontFamily);
        return _this;
    }
    TextSignature.prototype.drawText = function (text, dataOnly, font) {
        var fnt = font || this.getFont();
        this.viewCanvas.setFont(fnt);
        this.dataCanvas.setFont(fnt);
        this.clear();
        if (typeof dataOnly == 'undefined' || !dataOnly) {
            this.viewCanvas.drawText(text, {
                x: 10,
                y: this.viewCanvas.canvas.height - this.viewCanvas.canvas.height / 4 - 5
            });
        }
        var textWidth = this.dataCanvas.context.measureText(text).width;
        if (textWidth > this.viewCanvas.canvas.width) {
            this.dataCanvas.canvas.width = this.dataCanvas.context.measureText(text).width + 10;
            this.viewCanvas.setFont(fnt);
            this.dataCanvas.setFont(fnt);
        }
        else {
            if (this.dataCanvas.canvas.width < this.viewCanvas.canvas.width) {
                this.dataCanvas.canvas.width = this.viewCanvas.canvas.width + 10;
                this.viewCanvas.setFont(fnt);
                this.dataCanvas.setFont(fnt);
            }
        }
        this.dataCanvas.drawText(text, {
            x: 10,
            y: this.dataCanvas.canvas.height - this.dataCanvas.canvas.height / 4 - 5
        });
    };
    TextSignature.prototype.getFont = function () {
        return this.options.fontSize + ' ' + this.options.fontFamily;
    };
    TextSignature.prototype.setFont = function (font) {
        _super.prototype.setFont.call(this, font);
    };
    TextSignature.prototype.loadFont = function (name) {
        var paragraph = document.createElement('p');
        paragraph.id = '__fontFamilyLoad' + name;
        paragraph.style.fontFamily = name;
        paragraph.innerText = 'test';
        var bod = document.getElementsByTagName('body')[0].appendChild(paragraph);
        setTimeout(function () {
            if (typeof paragraph.remove !== 'undefined') {
                paragraph.remove();
            }
            else {
                paragraph.style.display = 'none';
            }
        }, 1);
    };
    return TextSignature;
}(SignatureCanvas));
