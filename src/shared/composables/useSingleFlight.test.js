import test from 'node:test';
import assert from 'node:assert/strict';
import { useSingleFlight } from './useSingleFlight.js';

test('pending calls share one promise and release after resolve or reject', async () => {
  const flight = useSingleFlight();
  let calls = 0;
  const first = flight.run(async () => { calls += 1; return 'done'; });
  const second = flight.run(async () => { calls += 1; return 'wrong'; });
  assert.strictEqual(first, second);
  assert.equal(await first, 'done');
  assert.equal(calls, 1);
  assert.equal(flight.isPending.value, false);
  await assert.rejects(flight.run(async () => { throw new Error('failed'); }), /failed/);
  assert.equal(flight.isPending.value, false);
  await flight.run(async () => { calls += 1; });
  assert.equal(calls, 2);
});
