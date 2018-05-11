/// <reference path="./signatureCanvas.ts"/>

interface TextSignatureOptions {
    fontSize: string;
    fontFamily: string;
}

class TextSignature extends SignatureCanvas {
    constructor(
        public canvas: HTMLCanvasElement, 
        private options: TextSignatureOptions = {
            fontSize: "30px",
            fontFamily: "Signature"
        }) {
        super(canvas);
        this.loadFont(this.options.fontFamily);
    }

    drawText(text: string, font?: string) {
        this.canvasGroup.drawText(text);
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