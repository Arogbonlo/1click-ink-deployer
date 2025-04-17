import { test, expect } from '@playwright/test'

test('user uploads a contract and deploys', async ({ page }) => {
  await page.goto('http://localhost:3000')

  await page.getByText('Upload Form')
  const fileInput = await page.locator('input[type="file"]')
  await fileInput.setInputFiles('contracts/flipper.contract')

  await page.getByText('Select Network')
  await page.selectOption('select', { label: 'Astar Shibuya' })

  await page.getByText('Deploy Contract')
  expect(await page.locator('button:has-text("Deploy Contract")')).toBeDisabled()
})
