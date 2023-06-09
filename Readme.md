# QRCode.js

QRCode is Javascript/Typescript library for making QRCode. QRCode supports 
Cross-browser with HTML5 Canvas, SVG and table tag in DOM. QRCode has no
dependencies.

## Screenshot

<p align="center">
    <img width="414" src="./docs/Screenshoot.png" alt="Screenshot"/>
</p>

## Basic Usages

```html
<div id="qrcode"></div>
<script type="text/javascript">
new QRCode(document.getElementById("qrcode"), "http://jindo.dev.naver.com/collie");
</script>
```

or with some options

```html
<div id="qrcode"></div>
<script type="text/javascript">
var qrcode = new QRCode(document.getElementById("qrcode"), {
	text: "http://jindo.dev.naver.com/collie",
	width: 128,
	height: 128,
	colorDark : "#000000",
	colorLight : "#ffffff",
	correctLevel : QRCode.CorrectLevel.H
});
</script>
```

and you can use some methods

```javascript
qrcode.clear(); // clear the code.
qrcode.makeCode("http://naver.com"); // make another code.
```

## Browser Compatibility

IE6~10, Chrome, Firefox, Safari, Opera, Mobile Safari, Android, Windows Mobile, ETC.

## License

MIT License

## Contact

twitter @davidshimjs
