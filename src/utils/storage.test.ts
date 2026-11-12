import test from 'node:test';
import assert from 'node:assert/strict';
import { StorageService } from './storage';

test('StorageService.calculateStats derives all dashboard numbers directly from records', () => {
  const stats = StorageService.calculateStats();
  const reports = StorageService.getReports();
  const matches = StorageService.getMatches();
  const notifs = StorageService.getNotifications();

  assert.equal(stats.totalLost, reports.filter((r) => r.type === 'lost').length);
  assert.equal(stats.totalFound, reports.filter((r) => r.type === 'found').length);
  assert.equal(stats.successfullyReunited, reports.filter((r) => r.status === 'Resolved').length);
  assert.equal(stats.potentialMatches, matches.filter((m) => m.status === 'Potential').length);
  assert.equal(stats.unreadNotifications, notifs.filter((n) => !n.read).length);
});
