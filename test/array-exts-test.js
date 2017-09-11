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
});
