Signature Library
=================================

A signature component written in typescript.

Installation
------

Add references to the css and javascript file.

```html
<link href="/your-custom-path/signature.css" />
<script src="/your-custom-path/signature.min.js"></script>
```

Usage
---------------

```html
<html>
<head>

</head>
<body>
    <!-- sign pad -->
    <canvas id="signature"></canvas>

    <!-- typed text to signature -->
    <div>
        <style>
            .signature-textinput__container {
                position: relative !important;
                width: 100% !important;
            }
            .signature-textinput__stextinput {
                bottom: 0 !important;
                left: 0 !important;
                position: absolute !important;
                width: 100% !important;
                height: 100% !important;
                background-color: transparent !important;
            }
            .signature-textinput__canvas {
                height: 100% !important;
                width: 100% !important;
            }
            input.clean {
                border: none !important;
                border-color: transparent !important;
                background-color: transparent !important;
            }
            .signature-fullwidth {

            }
        </style>

        <div class="clear signature-textinput__container">
            <canvas id="textSignature" class="clear signature-textinput__canvas signature-fullwidth signature-fullwidth-responsive" width="700"></canvas>
            <input id="textSignature-input" class="signature-textinput__textinput clear clean" type="text" style="font-size: 70px; font-family: Signature"/>
        </div>
    </div>

    <script >
        var signPad;
        var textSignature;
        (function() {
            // signa pad
            signPad = new SignPad(document.getElementById('signature'), {
                lineWidth: 2
            });

            // text signature
            textSignature = new TextSignature(
                document.getElementById('textSignature'), {
                    fontSize: "70px",
                    fontFamily: "Signature"
            });
            $("input#textSignature-input").change(function() {
                textSignature.drawText($(this).val());
            })
        })();
    </script>
</body>
```