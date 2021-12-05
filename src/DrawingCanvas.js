// android 2.x doesn't support Data-URI spec
export function _getAndroid() {
    var android = false;
    var sAgent = navigator.userAgent;

    if (/android/i.test(sAgent)) { // android
        android = true;
        var aMat = sAgent.toString().match(/android ([0-9]\.[0-9])/i);

        if (aMat && aMat[1]) {
            android = parseFloat(aMat[1]);
        }
    }

    return android;
}

/**
 * Drawing QRCode by using canvas
 *
 * @constructor
 * @param {HTMLElement} el
 * @param {Object} htOption QRCode Options
 */
export var DrawingCanvas = function (el, htOption) {
    this._bIsPainted = false;
    this._android = _getAndroid();

    this._htOption = htOption;
    this._elCanvas = document.createElement("canvas");
    this._elCanvas.width = htOption.width;
    this._elCanvas.height = htOption.height;
    el.appendChild(this._elCanvas);
    this._el = el;
    this._oContext = this._elCanvas.getContext("2d");
    this._bIsPainted = false;
    this._elImage = document.createElement("img");
    this._elImage.alt = "Scan me!";
    this._elImage.style.display = "none";
    this._el.appendChild(this._elImage);
    this._bSupportDataURI = null;
};

/**
 * Draw the QRCode
 *
 * @param {QRCode} oQRCode
 */
DrawingCanvas.prototype.draw = function (oQRCode) {
    var _elImage = this._elImage;
    var _oContext = this._oContext;
    var _htOption = this._htOption;

    var nCount = oQRCode.getModuleCount();
    var nWidth = _htOption.width / nCount;
    var nHeight = _htOption.height / nCount;
    var nRoundedWidth = Math.round(nWidth);
    var nRoundedHeight = Math.round(nHeight);

    _elImage.style.display = "none";
    this.clear();

    for (var row = 0; row < nCount; row++) {
        for (var col = 0; col < nCount; col++) {
            var bIsDark = oQRCode.isDark(row, col);
            var nLeft = col * nWidth;
            var nTop = row * nHeight;
            _oContext.strokeStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;
            _oContext.lineWidth = 1;
            _oContext.fillStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;
            _oContext.fillRect(nLeft, nTop, nWidth, nHeight);

            // 안티 앨리어싱 방지 처리
            _oContext.strokeRect(
                Math.floor(nLeft) + 0.5,
                Math.floor(nTop) + 0.5,
                nRoundedWidth,
                nRoundedHeight
            );

            _oContext.strokeRect(
                Math.ceil(nLeft) - 0.5,
                Math.ceil(nTop) - 0.5,
                nRoundedWidth,
                nRoundedHeight
            );
        }
    }

    this._bIsPainted = true;
};

/**
 * Make the image from Canvas if the browser supports Data URI.
 */
DrawingCanvas.prototype.makeImage = function () {
    if (this._bIsPainted) {
        _safeSetDataURI.call(this, _onMakeImage);
    }
};

/**
 * Return whether the QRCode is painted or not
 *
 * @return {Boolean}
 */
DrawingCanvas.prototype.isPainted = function () {
    return this._bIsPainted;
};

/**
 * Clear the QRCode
 */
DrawingCanvas.prototype.clear = function () {
    this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height);
    this._bIsPainted = false;
};

/**
 * @private
 * @param {Number} nNumber
 */
DrawingCanvas.prototype.round = function (nNumber) {
    if (!nNumber) {
        return nNumber;
    }

    return Math.floor(nNumber * 1000) / 1000;
};

function _onMakeImage() {
    this._elImage.src = this._elCanvas.toDataURL("image/png");
    this._elImage.style.display = "block";
    this._elCanvas.style.display = "none";
}

/**
 * Check whether the user's browser supports Data URI or not
 *
 * @private
 * @param {Function} fSuccess Occurs if it supports Data URI
 * @param {Function} fFail Occurs if it doesn't support Data URI
 */
function _safeSetDataURI(fSuccess, fFail) {
    var self = this;
    self._fFail = fFail;
    self._fSuccess = fSuccess;

    // Check it just once
    if (self._bSupportDataURI === null) {
        var el = document.createElement("img");
        var fOnError = function () {
            self._bSupportDataURI = false;

            if (self._fFail) {
                self._fFail.call(self);
            }
        };
        var fOnSuccess = function () {
            self._bSupportDataURI = true;

            if (self._fSuccess) {
                self._fSuccess.call(self);
            }
        };

        el.onabort = fOnError;
        el.onerror = fOnError;
        el.onload = fOnSuccess;
        el.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="; // the Image contains 1px data.
        return;
    } else if (self._bSupportDataURI === true && self._fSuccess) {
        self._fSuccess.call(self);
    } else if (self._bSupportDataURI === false && self._fFail) {
        self._fFail.call(self);
    }
}