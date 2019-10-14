const utils = require('../utils');
const expect = require('chai').expect;

const review = {
    productId: '8422445173'
};

describe('#utils', function() {
    describe('validateEmail', function(){
        it('should return true if valid email', function(){
            expect(utils.validateEmail('+12abc@mail.com')).to.be.false;
            expect(utils.validateEmail('12abc@mail.com')).to.be.true;
        });
    });
    describe('checkProduct', function(){
        it('should return name if product exists', function(){
            expect(utils.checkProduct(review).name).to.be.equal('Blue T-Shirt');
        });
    });
});