import {QRPolynomial} from "../src/QRPolynomial.js";
import {QRMath} from "../src/math/QRMath.ts";
import * as assert from "assert";

describe('Polynomial', function () {
    it('should return the polynomial', function () {
        const errorCorrectLength = 22;
        var a = new QRPolynomial([1], 0);
        for (var i = 0; i < errorCorrectLength; i++) {
            a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
        }

        assert.equal(a.getLength(), 23);
        assert.deepEqual(a.num, [1, 89, 179, 131, 176, 182, 244, 19, 189, 69, 40, 28,
            137, 29, 123, 67, 253, 86, 218, 230, 26, 145, 245])
    });
});