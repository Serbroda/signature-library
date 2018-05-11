/// <reference path="./signatureCanvas.ts"/>

interface TextSignatureOptions {
    fontSize: string;
    fontFamily: string;
}

class TextSignature extends SignatureCanvas {
    constructor(
        canvas: HTMLCanvasElement, 
        private options: TextSignatureOptions = {
            fontSize: "70px",
            fontFamily: "Signature"
        }) {
        super(canvas);
        this.loadFont(this.options.fontFamily);
    }

    drawText(text: string, font?: string) {
        let fnt = font || this.getFont();
        this.viewCanvas.setFont(fnt);
        this.dataCanvas.setFont(fnt);
        this.clear();
        this.viewCanvas.drawText(text, {x: 10, y: this.viewCanvas.canvas.height / 2});
        this.dataCanvas.drawText(text, {x: 10, y: this.viewCanvas.canvas.height / 2});
    }

    private getFont(): string {
        return this.options.fontSize + " " + this.options.fontFamily;
    }

    private loadFont(name: string) {
        let paragraph = document.createElement("p");
        paragraph.id = "__fontFamilyLoad" + name;
        paragraph.style.fontFamily = name;
        paragraph.innerText = "test"
        var bod = document.getElementsByTagName("body")[0].appendChild(paragraph);
        
        setTimeout(function() {
           // paragraph.remove();
        }, 1);
    }
}