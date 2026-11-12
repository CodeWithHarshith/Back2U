import { ItemReport, MatchRecord } from '../types';

/**
 * Tokenizes text into lowercase normalized words, removing punctuation.
 */
export function tokenize(text?: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

/**
 * Computes Jaccard word similarity between two text snippets (0 to 1).
 */
export function computeWordOverlap(text1?: string, text2?: string): number {
  const tokens1 = new Set(tokenize(text1));
  const tokens2 = new Set(tokenize(text2));
  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  let intersection = 0;
  for (const t of tokens1) {
    if (tokens2.has(t)) intersection++;
  }
  const union = new Set([...tokens1, ...tokens2]).size;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Calculates days between two date strings (YYYY-MM-DD).
 */
export function daysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  if (isNaN(d1) || isNaN(d2)) return 999;
  return Math.abs(Math.round((d1 - d2) / (1000 * 60 * 60 * 24)));
}

/**
 * Evaluates similarity between a Lost item report and a Found item report.
 * Returns a score between 0 and 100, and a list of specific match reasons.
 */
export function calculateMatchScore(lost: ItemReport, found: ItemReport): {
  percentage: number;
  reasons: string[];
} {
  // If types are not complementary, score is 0
  if (lost.type !== 'lost' || found.type !== 'found') {
    return { percentage: 0, reasons: [] };
  }

  // If one is missing person and other is not, no match
  if (Boolean(lost.isMissingPerson) !== Boolean(found.isMissingPerson)) {
    return { percentage: 0, reasons: [] };
  }

  let totalScore = 0;
  const reasons: string[] = [];

  // 1. Category Match (Weight: 25)
  if (lost.category === found.category) {
    totalScore += 25;
    reasons.push(`Exact Category match: ${lost.category}`);
  } else {
    // If category is completely different, penalty
    return { percentage: 0, reasons: [] };
  }

  // 2. Name & Title Similarity (Weight: 25)
  const nameOverlap = computeWordOverlap(lost.name, found.name);
  if (nameOverlap >= 0.5) {
    totalScore += 25;
    reasons.push(`High item name similarity ("${lost.name}" / "${found.name}")`);
  } else if (nameOverlap > 0.15) {
    const points = Math.round(nameOverlap * 25);
    totalScore += points;
    reasons.push(`Partial item name keyword match`);
  } else if (lost.name.toLowerCase().includes(found.name.toLowerCase()) || found.name.toLowerCase().includes(lost.name.toLowerCase())) {
    totalScore += 20;
    reasons.push(`Item name substring match`);
  }

  // 3. Brand Match (Weight: 15)
  if (lost.brand && found.brand) {
    if (lost.brand.trim().toLowerCase() === found.brand.trim().toLowerCase()) {
      totalScore += 15;
      reasons.push(`Exact brand match: ${lost.brand}`);
    } else if (
      lost.brand.toLowerCase().includes(found.brand.toLowerCase()) ||
      found.brand.toLowerCase().includes(lost.brand.toLowerCase())
    ) {
      totalScore += 10;
      reasons.push(`Similar brand identifier (${lost.brand})`);
    }
  } else if (!lost.brand && !found.brand) {
    // Neutral
    totalScore += 5;
  }

  // 4. Colour Match (Weight: 10)
  if (lost.colour && found.colour) {
    const lostColors = tokenize(lost.colour);
    const foundColors = tokenize(found.colour);
    const sharedColor = lostColors.some((c) => foundColors.includes(c));
    if (sharedColor) {
      totalScore += 10;
      reasons.push(`Matching color tones (${lost.colour})`);
    }
  }

  // 5. Location Proximity (Weight: 15)
  const sameCity = lost.city.trim().toLowerCase() === found.city.trim().toLowerCase();
  const sameState = lost.state.trim().toLowerCase() === found.state.trim().toLowerCase();

  if (sameCity && sameState) {
    totalScore += 15;
    reasons.push(`Same City & State: ${lost.city}, ${lost.state}`);
    if (lost.landmark && found.landmark) {
      const landmarkOverlap = computeWordOverlap(lost.landmark, found.landmark);
      if (landmarkOverlap > 0.2) {
        reasons.push(`Nearby landmark mentioned: ${lost.landmark}`);
      }
    }
  } else if (sameState) {
    totalScore += 7;
    reasons.push(`Same State: ${lost.state}`);
  }

  // 6. Date Proximity (Weight: 10)
  const daysDiff = daysDifference(lost.date, found.date);
  // An item must usually be found on or after it was lost, but allow +/- 1 day leeway for reporting delays
  if (daysDiff <= 2) {
    totalScore += 10;
    reasons.push(`Dates closely aligned (${daysDiff === 0 ? 'Same day' : `${daysDiff} day(s) apart`})`);
  } else if (daysDiff <= 7) {
    totalScore += 6;
    reasons.push(`Reported within the same week (${daysDiff} days apart)`);
  } else if (daysDiff <= 21) {
    totalScore += 3;
  }

  // 7. Identification Features & Description Keywords (Bonus: up to 10)
  const descOverlap = computeWordOverlap(
    `${lost.description} ${lost.identificationFeatures}`,
    `${found.description} ${found.identificationFeatures}`
  );
  if (descOverlap > 0.15) {
    const bonus = Math.min(10, Math.round(descOverlap * 20));
    totalScore += bonus;
    reasons.push(`Matching descriptive keywords and physical traits`);
  }

  // Cap score at 98% (never 100% automated certainty without manual verification)
  const finalPercentage = Math.min(98, Math.max(0, totalScore));

  return {
    percentage: finalPercentage,
    reasons,
  };
}

/**
 * Finds all potential matches across a list of reports.
 * Returns matches that score at or above threshold (default: 50%).
 */
export function generatePotentialMatches(
  reports: ItemReport[],
  threshold = 50
): MatchRecord[] {
  const lostReports = reports.filter((r) => r.type === 'lost' && r.status !== 'Closed');
  const foundReports = reports.filter((r) => r.type === 'found' && r.status !== 'Closed');

  const matches: MatchRecord[] = [];

  for (const lost of lostReports) {
    for (const found of foundReports) {
      const { percentage, reasons } = calculateMatchScore(lost, found);
      if (percentage >= threshold) {
        matches.push({
          id: `MATCH-${lost.id.replace(/[^0-9]/g, '')}-${found.id.replace(/[^0-9]/g, '')}`,
          lostReportId: lost.id,
          foundReportId: found.id,
          matchPercentage: percentage,
          reasons,
          status: 'Potential',
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  // Sort by highest match percentage first
  return matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
}
