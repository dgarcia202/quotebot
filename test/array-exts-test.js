var chai = require('chai');
var expect = chai.expect;

require('../src/array-exts');

describe('Array extensions', () => {
  it('first() returns first element of the collection', () => {
    var numbers = [1, 2, 3, 4, 5];
    expect(numbers.first()).to.equal(numbers[0]);
  });

  it('last() returns last element of the collection', () => {
    var numbers = [1, 2, 3, 4, 5];
    expect(numbers.last()).to.equal(numbers[numbers.length - 1]);
  });

  it('elementAt() retrieves first element of the array', () => {
    var numbers = [1, 2, 3, 4, 5];
    expect(numbers.elementAt(0)).to.equal(numbers[0]);
  });

  it('elementAt() retrieves last element of the array', () => {
    var numbers = [1, 2, 3, 4, 5];
    expect(numbers.elementAt(numbers.length - 1)).to.equal(numbers[numbers.length - 1]);
  });

  it('elementAt() retrieves random middle element of the array', () => {
    var numbers = [1, 2, 3, 4, 5];
    expect(numbers.elementAt(2)).to.equal(numbers[2]);
  });

  it('diff() can substract two arrays', () => {
    var a1 = [1, 2, 3, 4, 5];
    var a2 = [1, 2, 3];
    var r = a1.diff(a2);

    expect(r).to.be.an('array').that.does.include(4);
    expect(r).to.be.an('array').that.does.include(5);
    expect(r).to.be.an('array').that.does.not.include(1);
    expect(r).to.be.an('array').that.does.not.include(2);
    expect(r).to.be.an('array').that.does.not.include(3);
  });
});
