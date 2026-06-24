import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { debounce } from './debounce.js';

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe('debounce', () => {
  it('coalesces rapid calls into one call', async () => {
    let calls = 0;
    const debounced = debounce(() => {
      calls += 1;
    }, 10);

    debounced();
    debounced();
    debounced();

    await sleep(25);

    assert.equal(calls, 1);
  });

  it('passes the latest arguments', async () => {
    let value;
    const debounced = debounce((nextValue) => {
      value = nextValue;
    }, 10);

    debounced('first');
    debounced('latest');

    await sleep(25);

    assert.equal(value, 'latest');
  });

  it('cancels a pending call', async () => {
    let calls = 0;
    const debounced = debounce(() => {
      calls += 1;
    }, 10);

    debounced();
    debounced.cancel();

    await sleep(25);

    assert.equal(calls, 0);
  });
});
