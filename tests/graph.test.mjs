import test from 'node:test';
import assert from 'node:assert/strict';
import { findDemoConnections } from '../lib/graph.mjs';

test('returns only shared signals with fictional linked domains', () => {
  const result = findDemoConnections('aurora-deals.example');
  assert.equal(result.demo, true);
  assert.equal(result.connections.length, 2);
  assert.equal(result.signals.length, 2);
  assert.equal(result.connections.find(x => x.domain === 'polar-shop.example')?.sharedSignalIds.length, 1);
});
test('never invents connections for unknown domain', () => {
  const result = findDemoConnections('real-store.com');
  assert.deepEqual(result, { demo: false, connections: [], signals: [] });
});
