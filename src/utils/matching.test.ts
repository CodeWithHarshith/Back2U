import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMatchScore, computeWordOverlap, daysDifference } from './matching';
import { ItemReport } from '../types';

test('computeWordOverlap calculates jaccard token similarity accurately', () => {
  const overlap1 = computeWordOverlap('Samsung Galaxy S23 Ultra Black', 'Found Samsung Galaxy S23 phone');
  assert.ok(overlap1 > 0.4, `Expected overlap > 0.4, got ${overlap1}`);

  const overlap2 = computeWordOverlap('Leather brown wallet', 'Lost gold ring');
  assert.equal(overlap2, 0);
});

test('daysDifference calculates day count between dates correctly', () => {
  const diff1 = daysDifference('2026-11-10', '2026-11-12');
  assert.equal(diff1, 2);

  const diff2 = daysDifference('2026-11-10', '2026-11-10');
  assert.equal(diff2, 0);
});

test('calculateMatchScore gives high score and reasons for closely matching Lost and Found items', () => {
  const lostItem: ItemReport = {
    id: 'B2U-LST-101',
    type: 'lost',
    name: 'Samsung Galaxy Phone S23',
    category: 'Mobile Phones',
    brand: 'Samsung',
    colour: 'Phantom Black',
    description: 'Lost my Samsung Galaxy phone in auto-rickshaw',
    identificationFeatures: 'Tiny scratch on bottom left corner with Spigen case',
    date: '2026-11-10',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bangalore',
    landmark: 'Indiranagar Metro Station',
    photographs: ['/placeholder.jpg'],
    contactPreferences: {
      name: 'Rohan Sharma',
      phone: '9876543210',
      email: 'rohan@example.com',
      allowDirectCall: true,
      showPhonePublicly: false,
      preferredContactMethod: 'chat',
    },
    status: 'Active',
    userId: 'user-1',
    reporterName: 'Rohan Sharma',
    createdAt: '2026-11-10T10:00:00Z',
    updatedAt: '2026-11-10T10:00:00Z',
  };

  const foundItem: ItemReport = {
    id: 'B2U-FND-202',
    type: 'found',
    name: 'Samsung Galaxy Mobile Phone',
    category: 'Mobile Phones',
    brand: 'Samsung',
    colour: 'Black',
    description: 'Found black Samsung phone in rear seat of auto near metro',
    identificationFeatures: 'Protected with dark bumper case',
    date: '2026-11-10',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bangalore',
    landmark: 'Indiranagar 100ft Road Metro',
    photographs: ['/placeholder.jpg'],
    contactPreferences: {
      name: 'Priya Patel',
      phone: '9123456780',
      email: 'priya@example.com',
      allowDirectCall: true,
      showPhonePublicly: false,
      preferredContactMethod: 'chat',
    },
    status: 'Active',
    userId: 'user-2',
    reporterName: 'Priya Patel',
    createdAt: '2026-11-10T12:00:00Z',
    updatedAt: '2026-11-10T12:00:00Z',
  };

  const match = calculateMatchScore(lostItem, foundItem);
  assert.ok(match.percentage >= 70, `Expected match percentage >= 70, got ${match.percentage}`);
  assert.ok(match.reasons.some((r) => r.includes('Exact Category match')));
  assert.ok(match.reasons.some((r) => r.includes('Bangalore')));
  assert.ok(match.reasons.some((r) => r.includes('Samsung')));
});

test('calculateMatchScore returns 0 when categories differ', () => {
  const lostItem = {
    id: 'B2U-LST-1',
    type: 'lost',
    category: 'Wallets',
    name: 'Tommy Hilfiger Wallet',
    city: 'Bangalore',
    state: 'Karnataka',
    date: '2026-11-10',
  } as ItemReport;

  const foundItem = {
    id: 'B2U-FND-2',
    type: 'found',
    category: 'Electronics',
    name: 'Sony Headphones',
    city: 'Bangalore',
    state: 'Karnataka',
    date: '2026-11-10',
  } as ItemReport;

  const match = calculateMatchScore(lostItem, foundItem);
  assert.equal(match.percentage, 0);
  assert.equal(match.reasons.length, 0);
});
