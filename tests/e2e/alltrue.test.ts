import { expect, test } from '#tests/playwright-utils.ts'



test('Simple passing test', async () => {
    // This test simply waits for 1 second and then asserts "true" is true.
    // This ensures Playwright is working and the test runner is executing.
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(true).toBe(true);
});
  