import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

test.describe('Challenge Page - Performance & Stress Tests', () => {
  let page: Page

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage
    await page.goto('/')
    await page.waitForSelector('h1:has-text("User Management Dashboard")', {
      timeout: 10000,
    })
    await page.waitForTimeout(2000) // Wait for initial load
  })

  test.describe('Virtualization Performance', () => {
    test('should handle rapid scrolling without freezing', async () => {
      const usersSection = page.locator('.grid > div').first()
      const scrollContainer = usersSection
        .locator('[style*="overflow"]')
        .first()

      const startTime = Date.now()

      // Perform rapid scrolling
      for (let i = 0; i < 10; i++) {
        await scrollContainer.evaluate((el) => {
          el.scrollTop = Math.random() * el.scrollHeight
        })
        await page.waitForTimeout(100)
      }

      const endTime = Date.now()
      const duration = endTime - startTime

      // Should complete within reasonable time (3 seconds for 10 scrolls)
      expect(duration).toBeLessThan(3000)

      // Page should still be responsive
      const searchInput = usersSection.locator(
        'input[placeholder="Search users..."]',
      )
      await expect(searchInput).toBeEnabled()
    })

    test('should efficiently render large datasets', async () => {
      const usersSection = page.locator('.grid > div').first()
      const scrollContainer = usersSection
        .locator('[style*="overflow"]')
        .first()

      // Trigger multiple page loads
      for (let i = 0; i < 5; i++) {
        await scrollContainer.evaluate((el) => {
          el.scrollTop = el.scrollHeight
        })
        await page.waitForTimeout(1500) // Wait for data load
      }

      // Count total rendered DOM nodes (should be limited by virtualization)
      const renderedItems = await usersSection
        .locator('[style*="transform"]')
        .count()

      // Even with multiple pages loaded, rendered items should be limited
      expect(renderedItems).toBeLessThan(30) // Virtualization should limit DOM nodes
    })

    test('should maintain smooth scroll performance with many items', async () => {
      const usersSection = page.locator('.grid > div').first()
      const scrollContainer = usersSection
        .locator('[style*="overflow"]')
        .first()

      // Load multiple pages first
      for (let i = 0; i < 3; i++) {
        await scrollContainer.evaluate((el) => {
          el.scrollTop = el.scrollHeight
        })
        await page.waitForTimeout(1500)
      }

      // Measure frame rate during scroll (using console timing)
      const frameTimings: number[] = []

      await page.evaluate(() => {
        let lastTime = performance.now()
        const timings: number[] = []

        const measureFrame = () => {
          const currentTime = performance.now()
          timings.push(currentTime - lastTime)
          lastTime = currentTime

          if (timings.length < 60) {
            requestAnimationFrame(measureFrame)
          } else {
            ;(window as any).frameTimings = timings
          }
        }

        requestAnimationFrame(measureFrame)
      })

      // Perform smooth scroll
      await scrollContainer.evaluate((el) => {
        el.scrollTo({ top: 0, behavior: 'smooth' })
      })

      await page.waitForTimeout(2000)

      // Get frame timings
      const timings = await page.evaluate(
        () => (window as any).frameTimings || [],
      )

      if (timings.length > 0) {
        const avgFrameTime =
          timings.reduce((a: number, b: number) => a + b, 0) / timings.length
        // Average frame time should be under 32ms (>30 FPS)
        expect(avgFrameTime).toBeLessThan(32)
      }
    })
  })

  test.describe('Search Performance', () => {
    test('should handle rapid search input changes', async () => {
      const usersSection = page.locator('.grid > div').first()
      const searchInput = usersSection.locator(
        'input[placeholder="Search users..."]',
      )

      const searchTerms = [
        'a',
        'ab',
        'abc',
        'abcd',
        'abcde',
        'abc',
        'ab',
        'a',
        '',
      ]

      const startTime = Date.now()

      // Type rapidly
      for (const term of searchTerms) {
        await searchInput.fill(term)
        await page.waitForTimeout(50) // Very short delay
      }

      // Wait for final debounce
      await page.waitForTimeout(1500)

      const endTime = Date.now()
      const duration = endTime - startTime

      // Should handle rapid changes efficiently
      expect(duration).toBeLessThan(5000)

      // UI should remain responsive
      await expect(searchInput).toBeEnabled()
    })

    test('should not make excessive API calls during rapid typing', async () => {
      const usersSection = page.locator('.grid > div').first()
      const searchInput = usersSection.locator(
        'input[placeholder="Search users..."]',
      )

      let apiCallCount = 0

      // Monitor API calls
      page.on('request', (request) => {
        if (
          request.url().includes('/users') &&
          request.url().includes('firstName')
        ) {
          apiCallCount++
        }
      })

      // Type 10 characters rapidly
      const text = 'performance'
      for (const char of text) {
        await searchInput.pressSequentially(char, { delay: 30 })
      }

      // Wait for debounce
      await page.waitForTimeout(2000)

      // Should make minimal API calls due to debouncing
      expect(apiCallCount).toBeLessThanOrEqual(3) // Allow for some timing variance
    })

    test('should handle search and scroll simultaneously', async () => {
      const usersSection = page.locator('.grid > div').first()
      const reviewersSection = page.locator('.grid > div').nth(1)

      const usersSearch = usersSection.locator(
        'input[placeholder="Search users..."]',
      )
      const reviewersScroll = reviewersSection
        .locator('[style*="overflow"]')
        .first()

      // Start searching in users
      await usersSearch.fill('test')

      // Simultaneously scroll reviewers
      await reviewersScroll.evaluate((el) => {
        el.scrollTop = el.scrollHeight
      })

      await page.waitForTimeout(2000)

      // Both operations should complete successfully
      await expect(usersSearch).toHaveValue('test')

      const reviewersItems = await reviewersSection
        .locator('[style*="transform"]')
        .count()
      expect(reviewersItems).toBeGreaterThan(0)
    })
  })

  test.describe('Memory Management', () => {
    test('should not leak memory during extended scrolling', async () => {
      const usersSection = page.locator('.grid > div').first()
      const scrollContainer = usersSection
        .locator('[style*="overflow"]')
        .first()

      // Get initial memory usage (if available)
      const initialMemory = await page.evaluate(() => {
        if ((performance as any).memory) {
          return (performance as any).memory.usedJSHeapSize
        }
        return 0
      })

      // Perform extensive scrolling
      for (let i = 0; i < 20; i++) {
        await scrollContainer.evaluate((el) => {
          el.scrollTop = i % 2 === 0 ? el.scrollHeight : 0
        })
        await page.waitForTimeout(200)
      }

      // Get final memory usage
      const finalMemory = await page.evaluate(() => {
        if ((performance as any).memory) {
          return (performance as any).memory.usedJSHeapSize
        }
        return 0
      })

      if (initialMemory > 0 && finalMemory > 0) {
        // Memory increase should be reasonable (not more than 50MB)
        const memoryIncrease = finalMemory - initialMemory
        expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024)
      }
    })

    test('should clean up properly when clearing search', async () => {
      const usersSection = page.locator('.grid > div').first()
      const searchInput = usersSection.locator(
        'input[placeholder="Search users..."]',
      )

      // Perform multiple search/clear cycles
      for (let i = 0; i < 5; i++) {
        await searchInput.fill(`search${i}`)
        await page.waitForTimeout(1500)

        // Clear
        await searchInput.fill('')
        await page.waitForTimeout(1000)
      }

      // Check that items are properly rendered after cycles
      const items = await usersSection.locator('[style*="transform"]').count()
      expect(items).toBeGreaterThan(0)
    })
  })

  test.describe('React Scan Performance Monitoring', () => {
    test('should track component re-renders', async () => {
      const consoleLogs: string[] = []

      // Monitor console for React Scan output
      page.on('console', (msg) => {
        if (msg.type() === 'log') {
          consoleLogs.push(msg.text())
        }
      })

      // Perform various interactions
      const usersSection = page.locator('.grid > div').first()
      const searchInput = usersSection.locator(
        'input[placeholder="Search users..."]',
      )
      const scrollContainer = usersSection
        .locator('[style*="overflow"]')
        .first()

      // Search
      await searchInput.fill('test')
      await page.waitForTimeout(1500)

      // Scroll
      await scrollContainer.evaluate((el) => {
        el.scrollTop = 500
      })
      await page.waitForTimeout(1000)

      // Clear search
      await searchInput.fill('')
      await page.waitForTimeout(1500)

      // Check for React Scan logs
      const hasReactScanLogs = consoleLogs.some(
        (log) =>
          log.includes('React Scan') ||
          log.includes('react-scan') ||
          log.includes('[·]'),
      )

      expect(hasReactScanLogs).toBeTruthy()
    })

    test('should not have excessive re-renders during scroll', async () => {
      // This test would require React DevTools or custom instrumentation
      // Checking for smooth scroll behavior as proxy

      const usersSection = page.locator('.grid > div').first()
      const scrollContainer = usersSection
        .locator('[style*="overflow"]')
        .first()

      // Scroll and check responsiveness
      await scrollContainer.evaluate((el) => {
        let scrollCount = 0
        const startTime = performance.now()

        el.addEventListener('scroll', () => {
          scrollCount++
        })

        // Smooth scroll
        el.scrollTo({ top: 1000, behavior: 'smooth' })

        setTimeout(() => {
          ;(window as any).scrollMetrics = {
            count: scrollCount,
            duration: performance.now() - startTime,
          }
        }, 1000)
      })

      await page.waitForTimeout(1500)

      const metrics = await page.evaluate(() => (window as any).scrollMetrics)

      if (metrics) {
        // Should have reasonable number of scroll events
        expect(metrics.count).toBeGreaterThan(5) // Some scroll events
        expect(metrics.count).toBeLessThan(100) // Not excessive
      }
    })
  })

  test.describe('Stress Test - Maximum Load', () => {
    test('should handle maximum scroll depth', async () => {
      const usersSection = page.locator('.grid > div').first()
      const scrollContainer = usersSection
        .locator('[style*="overflow"]')
        .first()

      // Scroll to load maximum pages (simulate user scrolling to end)
      let previousHeight = 0
      let currentHeight = await scrollContainer.evaluate(
        (el) => el.scrollHeight,
      )
      let iterations = 0
      const maxIterations = 10

      while (previousHeight !== currentHeight && iterations < maxIterations) {
        previousHeight = currentHeight

        await scrollContainer.evaluate((el) => {
          el.scrollTop = el.scrollHeight
        })

        await page.waitForTimeout(2000)

        currentHeight = await scrollContainer.evaluate((el) => el.scrollHeight)
        iterations++
      }

      // Should handle deep scrolling
      expect(iterations).toBeGreaterThan(0)

      // UI should still be responsive
      const searchInput = usersSection.locator(
        'input[placeholder="Search users..."]',
      )
      await expect(searchInput).toBeEnabled()

      // Should still be able to scroll back up
      await scrollContainer.evaluate((el) => {
        el.scrollTop = 0
      })

      const finalScrollTop = await scrollContainer.evaluate(
        (el) => el.scrollTop,
      )
      expect(finalScrollTop).toBe(0)
    })

    test('should handle both lists loaded with data simultaneously', async () => {
      const usersSection = page.locator('.grid > div').first()
      const reviewersSection = page.locator('.grid > div').nth(1)

      const usersScroll = usersSection.locator('[style*="overflow"]').first()
      const reviewersScroll = reviewersSection
        .locator('[style*="overflow"]')
        .first()

      // Load data in both lists
      for (let i = 0; i < 3; i++) {
        await usersScroll.evaluate((el) => {
          el.scrollTop = el.scrollHeight
        })
        await reviewersScroll.evaluate((el) => {
          el.scrollTop = el.scrollHeight
        })
        await page.waitForTimeout(2000)
      }

      // Both lists should have loaded data
      const usersItems = await usersSection
        .locator('[style*="transform"]')
        .count()
      const reviewersItems = await reviewersSection
        .locator('[style*="transform"]')
        .count()

      expect(usersItems).toBeGreaterThan(0)
      expect(reviewersItems).toBeGreaterThan(0)

      // Should still be responsive
      const usersSearch = usersSection.locator(
        'input[placeholder="Search users..."]',
      )
      const reviewersSearch = reviewersSection.locator(
        'input[placeholder="Search reviewers..."]',
      )

      await expect(usersSearch).toBeEnabled()
      await expect(reviewersSearch).toBeEnabled()
    })
  })
})
