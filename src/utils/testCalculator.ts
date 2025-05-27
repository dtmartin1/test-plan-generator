/**
 * Calculate sample size needed for each variant in an A/B test
 *
 * @param baselineConversionRate - The current conversion rate as a percentage (e.g., 5 for 5%)
 * @param minimumDetectableEffect - The relative lift you want to detect as a percentage (e.g., 10 for 10% lift)
 * @param significance - The statistical significance level (default: 0.95 for 95%)
 * @param power - The statistical power (default: 0.80 for 80%)
 * @param variants - Number of variants including control (default: 2)
 * @returns The required sample size per variant
 */
export function calculateSampleSize(
  baselineConversionRate: number,
  minimumDetectableEffect: number,
  significance: number = 0.95,
  power: number = 0.80,
  variants: number = 2
): number {
  // Convert percentages to proportions
  const p1 = baselineConversionRate / 100;
  const mde = minimumDetectableEffect / 100;
  const p2 = p1 * (1 + mde);

  // Z-scores for significance level and power
  const zAlpha = 1.96; // for 95% significance
  const zBeta = 0.84;  // for 80% power

  // Calculate pooled probability
  const p = (p1 + p2) / 2;

  // Calculate sample size per variant
  const sampleSize = Math.ceil(
    ((Math.pow(zAlpha + zBeta, 2) * p * (1 - p) * variants) /
    Math.pow(p2 - p1, 2))
  );

  return sampleSize;
}

/**
 * Calculate test duration based on sample size and traffic
 *
 * @param sampleSizePerVariant - The required sample size for each variant
 * @param weeklyUsers - The number of users per week who will be part of the experiment
 * @param variants - Number of variants including control (default: 2)
 * @returns The estimated test duration in weeks
 */
export function calculateTestDuration(
  sampleSizePerVariant: number,
  weeklyUsers: number,
  variants: number = 2
): number {
  const totalRequiredSample = sampleSizePerVariant * variants;
  return Math.ceil((totalRequiredSample / weeklyUsers) * 1); // Result in weeks
}

/**
 * Calculate baseline conversion rate from historical data
 *
 * @param weeklyConversions - The number of weekly conversions
 * @param weeklyUsers - The total number of weekly users
 * @returns The baseline conversion rate as a percentage
 */
export function calculateBaselineConversionRate(
  weeklyConversions: number,
  weeklyUsers: number
): number {
  return (weeklyConversions / weeklyUsers) * 100;
}

/**
 * Format the sample size with commas
 * 
 * @param sampleSize - The sample size to format
 * @returns Formatted sample size with commas (e.g., 1,234)
 */
export function formatSampleSize(sampleSize: number): string {
  return sampleSize.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Format the test duration as weeks or days
 * 
 * @param durationInWeeks - The duration in weeks
 * @returns Formatted duration string (e.g., "4 weeks" or "2-3 days")
 */
export function formatTestDuration(durationInWeeks: number): string {
  if (durationInWeeks < 0.25) {
    return "1-2 days";
  } else if (durationInWeeks < 0.5) {
    return "2-3 days";
  } else if (durationInWeeks < 1) {
    return "Less than a week";
  } else if (durationInWeeks === 1) {
    return "1 week";
  } else {
    return `${Math.ceil(durationInWeeks)} weeks`;
  }
}