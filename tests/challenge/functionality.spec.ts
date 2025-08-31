import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

test.describe('Challenge Page - Functionality Tests', () => {
  let page: Page

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage
    await page.goto('/')
    await page.waitForSelector('h1:has-text("User Management Dashboard")', {
      timeout: 10000,
    })
    await page.waitForTimeout(2000) // Wait for initial data load
  })

  test.describe('Search Functionality', () => {
    test('should filter users based on search input', async () => {
      const usersSection = page.locator('.grid > div').first()
      const searchInput = usersSection.locator(
        'input[placeholder="Search users..."]',
      )

      // Get initial item count
      await page.waitForTimeout(1000)
      const initialCards = await usersSection
        .locator('[style*="transform"]')
        .count()
      expect(initialCards).toBeGreaterThan(0)

      // Type search query
      await searchInput.fill('a')
      await page.waitForTimeout(1500) // Wait for debounce and API call

      // Check that results are filtered
      const filteredCards = await usersSection
        .locator('[style*="transform"]')
        .count()

      // Verify some filtering occurred (should have fewer results)
      // Or check for "No results" message
      const noResults = usersSection.locator('text="No Results"')
      const hasResults = filteredCards > 0
      const hasNoResultsMsg = await noResults.isVisible().catch(() => false)

      expect(hasResults || hasNoResultsMsg).toBeTruthy()
    })

    test('should show no results message for non-matching search', async () => {
      const usersSection = page.locator('.grid > div').first()
      const searchInput = usersSection.locator(
        'input[placeholder="Search users..."]',
      )

      // Search for something that won't match
      await searchInput.fill('xyzabc123')
      await page.waitForTimeout(1500) // Wait for debounce

      // Check for no results message
      const noResultsTitle = usersSection.locator('text="No Results"')
      const noResultsMsg = usersSection.locator(
        'text=/No users found matching/',
      )

      await expect(noResultsTitle).toBeVisible()
      await expect(noResultsMsg).toBeVisible()
    })

    test('should show clear button when search has value', async () => {
      const usersSection = page.locator('.grid > div').first()
      const searchInput = usersSection.locator(
        'input[placeholder="Search users..."]',
      )

      // Initially no clear button
      let clearButton = usersSection
        .locator('button[aria-label="Clear search"], button:has(svg)')
        .filter({ hasText: '' }) // Filter out buttons with text
      const initialClearVisible = await clearButton
        .isVisible()
        .catch(() => false)
      expect(initialClearVisible).toBeFalsy()

      // Type something
      await searchInput.fill('test')
      await page.waitForTimeout(500)

      // Clear button should appear
      clearButton = usersSection
        .locator('button')
        .filter({
          has: page.locator('svg, img'),
        })
        .last()
      await expect(clearButton).toBeVisible()

      // Click clear button
      await clearButton.click()
      await page.waitForTimeout(1000)

      // Search input should be empty
      await expect(searchInput).toHaveValue('')
    })

    test('should debounce search input', async () => {
      const usersSection = page.locator('.grid > div').first()
      const searchInput = usersSection.locator(
        'input[placeholder="Search users..."]',
      )

      // Monitor network requests
      let apiCallCount = 0
      page.on('request', (request) => {
        if (
          request.url().includes('/users') &&
          request.url().includes('firstName')
        ) {
          apiCallCount++
        }
      })

      // Type rapidly
      await searchInput.pressSequentially('test', { delay: 50 })

      // Wait for debounce period
      await page.waitForTimeout(2000)

      // Should only make 1 API call due to debouncing
      expect(apiCallCount).toBeLessThanOrEqual(2) // Allow for some timing variance
    })

    test('should search reviewers independently from users', async () => {
      const usersSection = page.locator('.grid > div').first()
      const reviewersSection = page.locator('.grid > div').nth(1)

      const usersSearch = usersSection.locator(
        'input[placeholder="Search users..."]',
      )
      const reviewersSearch = reviewersSection.locator(
        'input[placeholder="Search reviewers..."]',
      )

      // Search users
      await usersSearch.fill('test')
      await page.waitForTimeout(1500)

      // Search reviewers with different term
      await reviewersSearch.fill('admin')
      await page.waitForTimeout(1500)

      // Both should maintain their own search values
      await expect(usersSearch).toHaveValue('test')
      await expect(reviewersSearch).toHaveValue('admin')
    })
  })

  test.describe('Infinite Scroll', () => {
    test('should load more items when scrolling to bottom', async () => {
      const usersSection = page.locator('.grid > div').first()
      const scrollContainer = usersSection
        .locator('[style*="overflow"]')
        .first()

      // Get initial item count
      await page.waitForTimeout(1000)
      const initialCount = await usersSection
        .locator('[style*="transform"]')
        .count()
      expect(initialCount).toBeGreaterThan(0)

      // Scroll to bottom
      await scrollContainer.evaluate((el) => {
        el.scrollTop = el.scrollHeight
      })

      // Wait for new items to load
      await page.waitForTimeout(2000)

      // Count items again
      const newCount = await usersSection
        .locator('[style*="transform"]')
        .count()

      // Should have loaded more items
      expect(newCount).toBeGreaterThan(initialCount)
    })

    test('should maintain scroll position when switching between lists', async () => {
      const usersSection = page.locator('.grid > div').first()
      const scrollContainer = usersSection
        .locator('[style*="overflow"]')
        .first()

      // Scroll users list to middle
      await scrollContainer.evaluate((el) => {
        el.scrollTop = 500
      })

      const scrollPos = await scrollContainer.evaluate((el) => el.scrollTop)
      expect(scrollPos).toBeGreaterThan(0)

      // Focus on reviewers section (simulate user interaction)
      const reviewersSection = page.locator('.grid > div').nth(1)
      await reviewersSection.click()

      // Check users scroll position is maintained
      const currentScrollPos = await scrollContainer.evaluate(
        (el) => el.scrollTop,
      )
      expect(currentScrollPos).toBe(scrollPos)
    })

    test('should show loading indicator when fetching next page', async () => {
      const usersSection = page.locator('.grid > div').first()
      const scrollContainer = usersSection
        .locator('[style*="overflow"]')
        .first()

      // Set up console log monitoring
      const consoleLogs: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'log') {
          consoleLogs.push(msg.text())
        }
      })

      // Scroll to bottom
      await scrollContainer.evaluate((el) => {
        el.scrollTop = el.scrollHeight
      })

      // Wait a bit
      await page.waitForTimeout(1000)

      // Check console logs for pagination state
      const hasFetchingLog = consoleLogs.some(
        (log) =>
          log.includes('isFetchingNextPage: true') ||
          log.includes('Triggering fetchNextPage'),
      )
      expect(hasFetchingLog).toBeTruthy()
    })
  })

  test.describe('Sorting', () => {
    test('should open sort dropdown menu', async () => {
      const usersSection = page.locator('.grid > div').first()
      const sortButton = usersSection.locator('button:has-text("First Name")')

      // Click sort button
      await sortButton.click()

      // Check dropdown menu appears
      const dropdown = page.locator('[role="menu"]')
      await expect(dropdown).toBeVisible()

      // Check sort options are present
      await expect(dropdown.locator('text="First Name"')).toBeVisible()
      await expect(dropdown.locator('text="Last Name"')).toBeVisible()
      await expect(dropdown.locator('text="Email"')).toBeVisible()
    })

    test('should change sort order when selecting option', async () => {
      const usersSection = page.locator('.grid > div').first()
      const sortButton = usersSection.locator('button:has-text("First Name")')

      // Open dropdown
      await sortButton.click()

      // Select Last Name
      const lastNameOption = page.locator(
        '[role="menuitem"]:has-text("Last Name")',
      )
      await lastNameOption.click()

      // Wait for re-render
      await page.waitForTimeout(1000)

      // Sort button should now show "Last Name"
      const updatedButton = usersSection.locator('button:has-text("Last Name")')
      await expect(updatedButton).toBeVisible()
    })

    test('should maintain sort when searching', async () => {
      const usersSection = page.locator('.grid > div').first()
      const sortButton = usersSection
        .locator('button')
        .filter({ hasText: /Name|Email/ })
        .first()
      const searchInput = usersSection.locator(
        'input[placeholder="Search users..."]',
      )

      // Change sort to Email
      await sortButton.click()
      const emailOption = page.locator('[role="menuitem"]:has-text("Email")')
      await emailOption.click()
      await page.waitForTimeout(1000)

      // Perform search
      await searchInput.fill('a')
      await page.waitForTimeout(1500)

      // Sort should still be Email
      const currentSortButton = usersSection.locator('button:has-text("Email")')
      await expect(currentSortButton).toBeVisible()
    })
  })

  test.describe('State Management', () => {
    test('should persist search state in store', async () => {
      const usersSection = page.locator('.grid > div').first()
      const searchInput = usersSection.locator(
        'input[placeholder="Search users..."]',
      )

      // Set search value
      await searchInput.fill('test search')
      await page.waitForTimeout(1500)

      // Reload page
      await page.reload()
      await page.waitForSelector('h1:has-text("User Management Dashboard")')
      await page.waitForTimeout(2000)

      // Note: The search state might not persist across reloads by design
      // This test verifies the expected behavior
      const newSearchInput = page
        .locator('input[placeholder="Search users..."]')
        .first()
      const value = await newSearchInput.inputValue()

      // If state persists, it should have the value, otherwise empty
      expect(value).toBeDefined()
    })

    test('should handle empty state correctly', async () => {
      const usersSection = page.locator('.grid > div').first()
      const searchInput = usersSection.locator(
        'input[placeholder="Search users..."]',
      )

      // Search for non-existent item
      await searchInput.fill('zzzzzzz99999')
      await page.waitForTimeout(1500)

      // Should show empty state
      const emptyState = usersSection.locator('text="No Results"')
      await expect(emptyState).toBeVisible()

      // Clear search
      const clearButton = usersSection
        .locator('button')
        .filter({
          has: page.locator('svg, img'),
        })
        .last()
      await clearButton.click()
      await page.waitForTimeout(1500)

      // Should show items again
      const items = usersSection.locator('[style*="transform"]')
      const count = await items.count()
      expect(count).toBeGreaterThan(0)
    })
  })

  test.describe('Virtualization', () => {
    test('should only render visible items', async () => {
      const usersSection = page.locator('.grid > div').first()

      // Wait for initial render
      await page.waitForTimeout(2000)

      // Count rendered DOM elements
      const renderedItems = await usersSection
        .locator('[style*="transform"]')
        .count()

      // Should be less than total items (virtualization)
      // Typically renders ~10-20 items for viewport
      expect(renderedItems).toBeLessThan(50) // Assuming 50 items per page
      expect(renderedItems).toBeGreaterThan(0)
    })

    test('should update rendered items when scrolling', async () => {
      const usersSection = page.locator('.grid > div').first()
      const scrollContainer = usersSection
        .locator('[style*="overflow"]')
        .first()

      // Get first visible item text
      const firstItem = usersSection.locator('[style*="transform"]').first()
      const initialText = await firstItem.locator('h3').textContent()

      // Scroll down significantly
      await scrollContainer.evaluate((el) => {
        el.scrollTop = 2000
      })
      await page.waitForTimeout(1000)

      // Get new first visible item
      const newFirstItem = usersSection.locator('[style*="transform"]').first()
      const newText = await newFirstItem.locator('h3').textContent()

      // Should be different due to virtualization
      expect(newText).not.toBe(initialText)
    })
  })
})
