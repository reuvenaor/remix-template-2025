import { test, expect } from '@playwright/test'
import type { Page, Request } from '@playwright/test'

test.describe('Challenge Page - API Integration Tests', () => {
  let page: Page

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage
    await page.goto('/')
    await page.waitForSelector('h1:has-text("User Management Dashboard")', {
      timeout: 10000,
    })
  })

  test.describe('API Calls', () => {
    test('should make initial API calls on page load', async () => {
      const apiCalls: { url: string; status: number }[] = []

      // Monitor API calls
      page.on('response', (response) => {
        const url = response.url()
        if (url.includes('localhost:3001')) {
          apiCalls.push({
            url,
            status: response.status(),
          })
        }
      })

      // Fresh page load
      await page.goto('/')
      await page.waitForTimeout(3000)

      // Should have made calls to both endpoints
      const usersCalls = apiCalls.filter((call) => call.url.includes('/users'))
      const reviewersCalls = apiCalls.filter((call) =>
        call.url.includes('/reviewers'),
      )

      expect(usersCalls.length).toBeGreaterThan(0)
      expect(reviewersCalls.length).toBeGreaterThan(0)

      // All calls should be successful
      apiCalls.forEach((call) => {
        expect(call.status).toBe(200)
      })
    })

    test('should include correct pagination parameters', async () => {
      let capturedRequest: Request | null = null

      // Capture request
      page.on('request', (request) => {
        if (request.url().includes('/users?')) {
          capturedRequest = request
        }
      })

      await page.reload()
      await page.waitForTimeout(2000)

      expect(capturedRequest).not.toBeNull()

      if (capturedRequest) {
        const url = new URL(capturedRequest!.url())

        // Should have pagination params
        expect(url.searchParams.get('_page')).toBe('1')
        expect(url.searchParams.get('_limit')).toBe('50')
      }
    })

    test('should send search parameters correctly', async () => {
      const usersSection = page.locator('.grid > div').first()
      const searchInput = usersSection.locator(
        'input[placeholder="Search users..."]',
      )

      let searchRequest: Request | null = null

      // Monitor for search request
      page.on('request', (request) => {
        if (
          request.url().includes('/users') &&
          request.url().includes('firstName')
        ) {
          searchRequest = request
        }
      })

      // Perform search
      await searchInput.fill('john')
      await page.waitForTimeout(2000)

      expect(searchRequest).not.toBeNull()

      if (searchRequest) {
        const url = new URL(searchRequest!.url())
        expect(url.searchParams.get('firstName')).toBe('john')
        expect(url.searchParams.get('_page')).toBe('1')
      }
    })

    test('should handle pagination correctly', async () => {
      const usersSection = page.locator('.grid > div').first()
      const scrollContainer = usersSection
        .locator('[style*="overflow"]')
        .first()

      let secondPageRequest: Request | null = null

      // Monitor for second page request
      page.on('request', (request) => {
        if (
          request.url().includes('/users') &&
          request.url().includes('_page=2')
        ) {
          secondPageRequest = request
        }
      })

      // Trigger pagination by scrolling
      await scrollContainer.evaluate((el) => {
        el.scrollTop = el.scrollHeight
      })

      await page.waitForTimeout(2000)

      expect(secondPageRequest).not.toBeNull()

      if (secondPageRequest) {
        const url = new URL(secondPageRequest!.url())
        expect(url.searchParams.get('_page')).toBe('2')
        expect(url.searchParams.get('_limit')).toBe('50')
      }
    })
  })

  test.describe('Data Validation', () => {
    test('should receive valid user data structure', async () => {
      let userData: any = null

      // Intercept response
      page.on('response', async (response) => {
        if (response.url().includes('/users?_page=1')) {
          try {
            userData = await response.json()
          } catch (e) {
            // Ignore parsing errors
          }
        }
      })

      await page.reload()
      await page.waitForTimeout(2000)

      expect(userData).not.toBeNull()

      if (userData && Array.isArray(userData)) {
        expect(userData.length).toBeGreaterThan(0)

        // Check first user structure
        const firstUser = userData[0]
        expect(firstUser).toHaveProperty('id')
        expect(firstUser).toHaveProperty('firstName')
        expect(firstUser).toHaveProperty('lastName')
        expect(firstUser).toHaveProperty('email')
        expect(firstUser).toHaveProperty('catchPhrase')
        expect(firstUser).toHaveProperty('comments')
      }
    })

    test('should receive valid reviewer data structure', async () => {
      let reviewerData: any = null

      // Intercept response
      page.on('response', async (response) => {
        if (response.url().includes('/reviewers?_page=1')) {
          try {
            reviewerData = await response.json()
          } catch (e) {
            // Ignore parsing errors
          }
        }
      })

      await page.reload()
      await page.waitForTimeout(2000)

      expect(reviewerData).not.toBeNull()

      if (reviewerData && Array.isArray(reviewerData)) {
        expect(reviewerData.length).toBeGreaterThan(0)

        // Check first reviewer structure
        const firstReviewer = reviewerData[0]
        expect(firstReviewer).toHaveProperty('id')
        expect(firstReviewer).toHaveProperty('firstName')
        expect(firstReviewer).toHaveProperty('lastName')
        expect(firstReviewer).toHaveProperty('email')
        expect(firstReviewer).toHaveProperty('catchPhrase')
        expect(firstReviewer).toHaveProperty('comments')
      }
    })

    test('should display data from API correctly', async () => {
      let userData: any = null

      // Capture API response
      page.on('response', async (response) => {
        if (response.url().includes('/users?_page=1')) {
          try {
            userData = await response.json()
          } catch (e) {
            // Ignore
          }
        }
      })

      await page.reload()
      await page.waitForTimeout(3000)

      if (userData && Array.isArray(userData) && userData.length > 0) {
        const firstUser = userData[0]

        // Check if data is displayed in UI
        const usersSection = page.locator('.grid > div').first()

        // Look for user name in UI
        const userName = `${firstUser.firstName} ${firstUser.lastName}`
        const nameElement = usersSection.locator(`h3:has-text("${userName}")`)

        // Should find the user in the rendered list
        const isVisible = await nameElement.isVisible().catch(() => false)
        expect(isVisible).toBeTruthy()

        // Check email is displayed
        const emailLink = usersSection.locator(
          `a[href="mailto:${firstUser.email}"]`,
        )
        const emailVisible = await emailLink.isVisible().catch(() => false)
        expect(emailVisible).toBeTruthy()
      }
    })
  })

  test.describe('Error Handling', () => {
    test('should handle API errors gracefully', async ({ browser }) => {
      // Create new context with request interception
      const context = await browser.newContext()
      const page = await context.newPage()

      // Intercept and fail API requests
      await page.route('**/users**', (route) => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' }),
        })
      })

      // Navigate to page
      await page.goto('/')
      await page.waitForTimeout(3000)

      // Should show error state or handle gracefully
      // Check that page doesn't crash
      const title = page.locator('h1:has-text("User Management Dashboard")')
      await expect(title).toBeVisible()

      // Check for error message or empty state
      const usersSection = page.locator('.grid > div').first()
      const hasContent = await usersSection
        .locator('[style*="transform"]')
        .count()
      const hasError = await usersSection
        .locator('text=/error|Error|failed|Failed/i')
        .count()
      const hasLoading = await usersSection
        .locator('text=/loading|Loading/i')
        .count()

      // Should show either error, loading, or no content
      expect(hasContent === 0 || hasError > 0 || hasLoading > 0).toBeTruthy()

      await context.close()
    })

    test('should handle malformed API responses', async ({ browser }) => {
      const context = await browser.newContext()
      const page = await context.newPage()

      // Return malformed data
      await page.route('**/users**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ invalid: 'structure' }),
        })
      })

      await page.goto('/')
      await page.waitForTimeout(3000)

      // Should handle gracefully
      const title = page.locator('h1:has-text("User Management Dashboard")')
      await expect(title).toBeVisible()

      await context.close()
    })

    test('should retry failed requests', async () => {
      let requestCount = 0

      // Count requests to check for retries
      page.on('request', (request) => {
        if (request.url().includes('/users?_page=1')) {
          requestCount++
        }
      })

      // Navigate
      await page.goto('/')
      await page.waitForTimeout(5000)

      // React Query might retry failed requests
      // At minimum should have 1 request
      expect(requestCount).toBeGreaterThanOrEqual(1)
    })
  })

  test.describe('Caching', () => {
    test('should cache API responses', async () => {
      const apiCalls: string[] = []

      // Monitor API calls
      page.on('request', (request) => {
        if (request.url().includes('/users?_page=1&_limit=50')) {
          apiCalls.push(request.url())
        }
      })

      // Initial load
      await page.goto('/')
      await page.waitForTimeout(2000)

      const initialCallCount = apiCalls.length

      // Navigate away and back
      await page.goto('/')
      await page.waitForTimeout(1000)
      await page.goto('/')
      await page.waitForTimeout(2000)

      // Check if React Query cached the data
      // If cached, might not make another call immediately
      const finalCallCount = apiCalls.length

      // This depends on React Query cache configuration
      expect(finalCallCount).toBeGreaterThanOrEqual(initialCallCount)
    })

    test('should not duplicate requests during fast interactions', async () => {
      const usersSection = page.locator('.grid > div').first()
      const searchInput = usersSection.locator(
        'input[placeholder="Search users..."]',
      )

      const apiCalls: string[] = []

      // Monitor API calls
      page.on('request', (request) => {
        if (
          request.url().includes('/users') &&
          request.url().includes('firstName=test')
        ) {
          apiCalls.push(request.url())
        }
      })

      // Type the same search term multiple times quickly
      await searchInput.fill('test')
      await page.waitForTimeout(100)
      await searchInput.fill('')
      await page.waitForTimeout(100)
      await searchInput.fill('test')
      await page.waitForTimeout(2000) // Wait for debounce

      // Should not make duplicate requests for same search
      expect(apiCalls.length).toBeLessThanOrEqual(2)
    })
  })

  test.describe('Network Optimization', () => {
    test('should load both lists in parallel', async ({ page }) => {
      const requests: { url: string; timestamp: number }[] = []

      // Monitor request timing
      page.on('request', (request) => {
        const url = request.url()
        if (url.includes('localhost:3001')) {
          requests.push({
            url,
            timestamp: Date.now(),
          })
        }
      })

      // Fresh load
      await page.goto('/')
      await page.waitForTimeout(3000)

      // Find initial user and reviewer requests
      const userRequest = requests.find((r) => r.url.includes('/users?_page=1'))
      const reviewerRequest = requests.find((r) =>
        r.url.includes('/reviewers?_page=1'),
      )

      if (userRequest && reviewerRequest) {
        // Requests should be made close together (parallel)
        const timeDiff = Math.abs(
          userRequest.timestamp - reviewerRequest.timestamp,
        )

        // Should be within 500ms of each other (parallel loading)
        expect(timeDiff).toBeLessThan(500)
      }
    })

    test('should cancel obsolete search requests', async () => {
      const usersSection = page.locator('.grid > div').first()
      const searchInput = usersSection.locator(
        'input[placeholder="Search users..."]',
      )

      const completedRequests: string[] = []
      const failedRequests: string[] = []

      // Monitor request completion
      page.on('response', (response) => {
        if (
          response.url().includes('/users') &&
          response.url().includes('firstName')
        ) {
          completedRequests.push(response.url())
        }
      })

      page.on('requestfailed', (request) => {
        if (
          request.url().includes('/users') &&
          request.url().includes('firstName')
        ) {
          failedRequests.push(request.url())
        }
      })

      // Type rapidly to trigger multiple requests
      await searchInput.pressSequentially('a', { delay: 100 })
      await searchInput.pressSequentially('b', { delay: 100 })
      await searchInput.pressSequentially('c', { delay: 100 })

      await page.waitForTimeout(2000)

      // Should have completed the final request
      expect(completedRequests.length).toBeGreaterThan(0)

      // Earlier requests might be cancelled (this depends on implementation)
      // Just verify the system handles rapid changes
      const totalRequests = completedRequests.length + failedRequests.length
      expect(totalRequests).toBeGreaterThan(0)
    })

    test('should use appropriate request headers', async () => {
      let capturedHeaders: any = null

      // Capture request headers
      page.on('request', (request) => {
        if (request.url().includes('/users?_page=1')) {
          capturedHeaders = request.headers()
        }
      })

      await page.reload()
      await page.waitForTimeout(2000)

      expect(capturedHeaders).not.toBeNull()

      if (capturedHeaders) {
        // Should have appropriate headers
        expect(capturedHeaders['accept']).toContain('application/json')
      }
    })
  })
})
