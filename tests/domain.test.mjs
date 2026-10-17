import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeDomain } from '../lib/domain.mjs';

test('normalizes URLs without tracking paths or query strings', () => {
  assert.equal(normalizeDomain(' HTTPS://EXAMPLE.COM/store?token=secret '), 'example.com');
  assert.equal(normalizeDomain('Shop.Example'), 'shop.example');
  assert.equal(normalizeDomain('example.com.'), 'example.com');
});
test('rejects internal targets, IPs, credentials and exotic protocols', () => {
  for (const input of ['localhost', 'service.local', '127.0.0.1', 'http://[::1]', 'file:///etc/passwd', 'https://user:pass@example.com', 'https://example.com:8080']) {
    assert.throws(() => normalizeDomain(input), input);
  }
});
