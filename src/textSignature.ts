interface TextSignatureOptions {
    fontSize: string;
    fontFamily: string;
}

class TextSignature {
    canvasContext: CanvasRenderingContext2D | null = null;

    constructor(
        private canvas: HTMLCanvasElement, 
        private options: TextSignatureOptions = {
            fontSize: "30px",
            fontFamily: "Signature"
        }) {
        this.loadFont(this.options.fontFamily);
        this.canvasContext = this.canvas.getContext("2d");
    }

    drawText(text: string, font?: string) {
        let fnt = font || this.getFont();
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasContext.font = fnt;
        this.canvasContext.fillText(text, 10, 50);
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
            paragraph.remove();
        }, 1);
    }
}