/// <reference path="./signatureCanvas.ts"/>

interface TextSignatureOptions {
    fontSize: string;
    fontFamily: string;
    docReference?: Document;
}

class TextSignature extends SignatureCanvas {
    constructor(
        canvas: HTMLCanvasElement,
        private options: TextSignatureOptions = {
            fontSize: '70px',
            fontFamily: 'Signature',
            docReference: document,
        }
    ) {
        super(canvas);
        this.options.docReference = this.options.docReference || document;
        this.loadFont(this.options.fontFamily);
    }

    public drawText(text: string, dataOnly?: boolean, font?: string) {
        let fnt = font || this.getFont();
        this.viewCanvas.setFont(fnt);
        this.dataCanvas.setFont(fnt);
        this.clear();
        if (typeof dataOnly == 'undefined' || !dataOnly) {
            this.viewCanvas.drawText(text, {
                x: 10,
                y: this.viewCanvas.canvas.height - this.viewCanvas.canvas.height / 4 - 5,
            });
        }
        let textWidth = this.dataCanvas.context.measureText(text).width;
        if (textWidth > this.viewCanvas.canvas.width) {
            this.dataCanvas.canvas.width = this.dataCanvas.context.measureText(text).width + 10;
            this.viewCanvas.setFont(fnt);
            this.dataCanvas.setFont(fnt);
        } else {
            if (this.dataCanvas.canvas.width < this.viewCanvas.canvas.width) {
                this.dataCanvas.canvas.width = this.viewCanvas.canvas.width + 10;
                this.viewCanvas.setFont(fnt);
                this.dataCanvas.setFont(fnt);
            }
        }

        this.dataCanvas.drawText(text, {
            x: 10,
            y: this.dataCanvas.canvas.height - this.dataCanvas.canvas.height / 4 - 5,
        });
    }

    private getFont(): string {
        return this.options.fontSize + ' ' + this.options.fontFamily;
    }

    public setFont(font: string) {
        super.setFont(font);
    }

    private loadFont(name: string) {
        let paragraph = document.createElement('p');
        paragraph.id = '__fontFamilyLoad' + name;
        paragraph.style.fontFamily = name;
        paragraph.innerText = 'test';
        var bod = document.getElementsByTagName('body')[0].appendChild(paragraph);

        setTimeout(function () {
            if (typeof paragraph.remove !== 'undefined') {
                paragraph.remove();
            } else {
                paragraph.style.display = 'none';
            }
        }, 1);
    }
}
