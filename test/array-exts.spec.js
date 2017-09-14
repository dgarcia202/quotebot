var assert = require('chai').assert;

require('../src/array-exts');

describe('Array extensions', () => {
  it('first() returns first element of the collection', () => {
    var numbers = [1, 2, 3, 4, 5];
    assert.equal(numbers.first(), numbers[0], 'Is not the first element of the array.');
  });

  it('first() must return null on empty array', () => {
    var arr = [];
    assert.isNull(arr.first(), 'Returned element must be null.');
  });

  it('last() returns last element of the collection', () => {
    var numbers = [1, 2, 3, 4, 5];
    assert.equal(numbers.last(), numbers[numbers.length - 1], 'Is not the last element of the array.');
  });

  it('last() must return null on empty array', () => {
    var arr = [];
    assert.isNull(arr.last(), 'Returned element must be null.')
  });

  it('elementAt() retrieves first element of the array', () => {
    var numbers = [1, 2, 3, 4, 5];
    assert.equal(numbers.elementAt(0), numbers[0], 'Is the element from the wrong position.');
  });

  it('elementAt() retrieves last element of the array', () => {
    var numbers = [1, 2, 3, 4, 5];
    assert.equal(numbers.elementAt(numbers.length - 1), numbers[numbers.length - 1], 'Is the element from the wrong position.');
  });

  it('elementAt() retrieves random middle element of the array', () => {
    var numbers = [1, 2, 3, 4, 5];
    assert.equal(numbers.elementAt(2), numbers[2], 'Is the element from the wrong position.');
  });

  it('diff() can substract two arrays', () => {
    var a1 = [1, 2, 3, 4, 5];
    var a2 = [1, 2, 3];
    var r = a1.diff(a2);

    assert.include(r, 4, 'diff() substracted a non common element');
    assert.include(r, 5, 'diff() substracted a non common element');
    assert.notInclude(r, 1, 'diff() didn\'t substract a common element');
    assert.notInclude(r, 2, 'diff() didn\'t substract a common element');
    assert.notInclude(r, 3, 'diff() didn\'t substract a common element');
  });
});
