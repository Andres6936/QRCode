export var DrawingHack = function (el, htOption) {
    this._el = el;
    this._htOption = htOption;
};

/**
 * Draw the QRCode
 *
 * @param {QRCode} oQRCode
 */
DrawingHack.prototype.draw = function (oQRCode) {
    var _htOption = this._htOption;
    var _el = this._el;
    var nCount = oQRCode.getModuleCount();
    var nWidth = Math.floor(_htOption.width / nCount);
    var nHeight = Math.floor(_htOption.height / nCount);
    var aHTML = ['<table style="border:0;border-collapse:collapse;">'];

    for (var row = 0; row < nCount; row++) {
        aHTML.push('<tr>');

        for (var col = 0; col < nCount; col++) {
            aHTML.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + nWidth + 'px;height:' + nHeight + 'px;background-color:' + (oQRCode.isDark(row, col) ? _htOption.colorDark : _htOption.colorLight) + ';"></td>');
        }

        aHTML.push('</tr>');
    }

    aHTML.push('</table>');
    _el.innerHTML = aHTML.join('');

    // Fix the margin values as real size.
    var elTable = _el.childNodes[0];
    var nLeftMarginTable = (_htOption.width - elTable.offsetWidth) / 2;
    var nTopMarginTable = (_htOption.height - elTable.offsetHeight) / 2;

    if (nLeftMarginTable > 0 && nTopMarginTable > 0) {
        elTable.style.margin = nTopMarginTable + "px " + nLeftMarginTable + "px";
    }
};

/**
 * Clear the QRCode
 */
DrawingHack.prototype.clear = function () {
    this._el.innerHTML = '';
};