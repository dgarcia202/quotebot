  describe('Foo module', () => {

    const proxyquire = require('proxyquire');
    const assert = require('chai').assert;
    const sinon = require('sinon');

    let pathStub, barStub, sut;

    beforeEach(() => {
      pathStub = {
        extname: sinon.stub().returns('Exterminate, exterminate the FILE.TXT')
      };

      barStub = {
        asyncFunc: sinon.stub().resolves('I\'m big')
      }

      sut = proxyquire('./foo', { 'path': pathStub, './bar': barStub });
    });

    it('does things', () => {

      // path.extname now behaves as we told it to
      assert.equal(sut.extnameAllCaps('file.txt'), 'EXTERMINATE, EXTERMINATE THE FILE.TXT');
      assert(pathStub.extname.called, 'Was not called!!');

      // path.basename and all other path module methods still function as before
      assert.equal(sut.basenameAllCaps('/a/b/file.txt'), 'FILE.TXT');
    });

    it('resolve promises', done => {
      sut.asyncTask(msg => {
        assert.equal(msg, 'I\'m big');
        done();
      });
    });
  });
