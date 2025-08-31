import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

test.describe('Challenge Page - Component Rendering', () => {
  let page: Page

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage
    await page.goto('/')
    // Wait for initial load
    await page.waitForSelector('h1:has-text("User Management Dashboard")', {
      timeout: 10000,
    })
  })

  test('should render main page layout correctly', async () => {
    // Check main title and description
    await expect(page.locator('h1')).toContainText('User Management Dashboard')
    await expect(page.locator('p').first()).toContainText(
      'Browse and search through users and reviewers',
    )

    // Check grid layout exists
    const grid = page.locator('.grid')
    await expect(grid).toBeVisible()
    await expect(grid).toHaveClass(/grid-cols-1.*lg:grid-cols-2/)
  })

  test('should render Users section with all components', async () => {
    const usersSection = page.locator('.grid > div').first()

    // Check Users header
    const usersHeader = usersSection.locator('h3:has-text("Users")')
    await expect(usersHeader).toBeVisible()

    // Check Users icon is present
    const usersIcon = usersSection.locator('h3 img, h3 svg').first()
    await expect(usersIcon).toBeVisible()

    // Check search box
    const searchBox = usersSection.locator(
      'input[placeholder="Search users..."]',
    )
    await expect(searchBox).toBeVisible()
    await expect(searchBox).toBeEnabled()

    // Check sort dropdown
    const sortButton = usersSection.locator('button:has-text("First Name")')
    await expect(sortButton).toBeVisible()

    // Wait for data to load and check list container
    await page.waitForTimeout(2000) // Allow time for data fetch
    // Check for either overflow container or list items
    const usersList = usersSection
      .locator('.overflow-auto, [style*="overflow"], [style*="transform"]')
      .first()
    await expect(usersList).toBeVisible()
  })

  test('should render Reviewers section with all components', async () => {
    const reviewersSection = page.locator('.grid > div').nth(1)

    // Check Reviewers header
    const reviewersHeader = reviewersSection.locator('h3:has-text("Reviewers")')
    await expect(reviewersHeader).toBeVisible()

    // Check Reviewers icon
    const reviewersIcon = reviewersSection.locator('h3 img, h3 svg').first()
    await expect(reviewersIcon).toBeVisible()

    // Check search box
    const searchBox = reviewersSection.locator(
      'input[placeholder="Search reviewers..."]',
    )
    await expect(searchBox).toBeVisible()
    await expect(searchBox).toBeEnabled()

    // Check sort dropdown
    const sortButton = reviewersSection.locator('button:has-text("First Name")')
    await expect(sortButton).toBeVisible()

    // Wait for data and check list container
    await page.waitForTimeout(2000)
    // Check for either overflow container or list items
    const reviewersList = reviewersSection
      .locator('.overflow-auto, [style*="overflow"], [style*="transform"]')
      .first()
    await expect(reviewersList).toBeVisible()
  })

  test('should render user/reviewer cards with correct structure', async () => {
    // Wait for data to load completely
    await page.waitForTimeout(3000)

    // Check Users cards
    const usersSection = page.locator('.grid > div').first()

    // Wait for content to be fully loaded
    await page.waitForSelector('.grid > div:first-child h3', { timeout: 10000 })

    // Check user names are visible
    const userNames = await usersSection.locator('h3').count()
    expect(userNames).toBeGreaterThan(0)

    // Check for user emails
    const userEmails = await usersSection.locator('a[href^="mailto:"]').count()
    expect(userEmails).toBeGreaterThan(0)

    // Check for images (avatars and icons)
    const userImages = await usersSection.locator('img, svg').count()
    expect(userImages).toBeGreaterThan(0)

    // Check Reviewers cards
    const reviewersSection = page.locator('.grid > div').nth(1)

    // Check reviewer names
    const reviewerNames = await reviewersSection.locator('h3').count()
    expect(reviewerNames).toBeGreaterThan(0)

    // Check for reviewer emails
    const reviewerEmails = await reviewersSection
      .locator('a[href^="mailto:"]')
      .count()
    expect(reviewerEmails).toBeGreaterThan(0)

    // Check for images in reviewer section
    const reviewerImages = await reviewersSection.locator('img, svg').count()
    expect(reviewerImages).toBeGreaterThan(0)
  })

  test('should display loading state initially', async ({ page }) => {
    // Fresh page load to catch loading state
    await page.goto('/')

    // Check for loading indicators (they appear briefly)
    const loadingIndicators = page.locator('text="Loading items..."')

    // At least one should be visible initially
    const count = await loadingIndicators.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should have React Scan active', async () => {
    // Check console for React Scan messages
    const consoleLogs: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'log') {
        consoleLogs.push(msg.text())
      }
    })

    // Reload to capture console logs
    await page.reload()
    await page.waitForTimeout(2000)

    // Check for React Scan initialization message
    const hasReactScan = consoleLogs.some(
      (log) => log.includes('React Scan') || log.includes('react-scan'),
    )
    expect(hasReactScan).toBeTruthy()
  })

  test('should render search icons correctly', async () => {
    const usersSection = page.locator('.grid > div').first()
    const reviewersSection = page.locator('.grid > div').nth(1)

    // Check search icons in both sections
    const usersSearchIcon = usersSection
      .locator('input[placeholder="Search users..."]')
      .locator('..')
      .locator('img, svg')
      .first()
    const reviewersSearchIcon = reviewersSection
      .locator('input[placeholder="Search reviewers..."]')
      .locator('..')
      .locator('img, svg')
      .first()

    await expect(usersSearchIcon).toBeVisible()
    await expect(reviewersSearchIcon).toBeVisible()
  })

  test('should have proper card styling and shadows', async () => {
    await page.waitForTimeout(3000) // Wait for data

    const usersSection = page.locator('.grid > div').first()
    const card = usersSection.locator('[style*="transform"]').first()

    // Check if card has proper styling classes
    const cardContainer = card.locator('> div').first()
    const hasCardClasses = await cardContainer.evaluate((el) => {
      const classes = el.className
      return (
        classes.includes('rounded') ||
        classes.includes('border') ||
        classes.includes('shadow')
      )
    })

    expect(hasCardClasses).toBeTruthy()
  })

  test('should display email links with correct format', async () => {
    await page.waitForTimeout(3000) // Wait for data

    const emailLinks = page.locator('a[href^="mailto:"]')
    const count = await emailLinks.count()

    expect(count).toBeGreaterThan(0)

    // Check first email link
    const firstEmail = emailLinks.first()
    const href = await firstEmail.getAttribute('href')
    expect(href).toMatch(/^mailto:[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}$/)
  })

  test('should render company catchphrase with quotes', async () => {
    await page.waitForTimeout(3000) // Wait for data

    // Look for paragraphs containing quotes using xpath or filter
    const catchphrases = page.locator('p').filter({ hasText: /^".*"$/ })
    const count = await catchphrases.count()

    expect(count).toBeGreaterThan(0)

    // Check format of catchphrase
    const firstCatchphrase = await catchphrases.first().textContent()
    expect(firstCatchphrase).toMatch(/^".*"$/)
  })
})
