const assert = require('assert');

describe('webpack.base.js test case', () => {
  const baseConfig = require('../../lib/webpack.base.js');

  console.log(baseConfig);
  it('entry', () => {
    assert.equal(baseConfig.entry.index, '/Users/andy/Documents/demo/webpack4-practice/builder-webpack/test/smoke/template/src/index/index.js');
    assert.equal(baseConfig.entry.search, '/Users/andy/Documents/demo/webpack4-practice/builder-webpack/test/smoke/template/src/search/index.js');
  });
});