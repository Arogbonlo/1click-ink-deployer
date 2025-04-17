import { render, screen, fireEvent } from '@testing-library/react'
import ConstructorInput from '@/components/ConstructorInput'

const mockConstructor = {
  args: [
    { label: 'recipient', type: { type: 'AccountId', displayName: ['AccountId'] } },
    { label: 'amount', type: { type: 'u32', displayName: ['u32'] } }
  ]
}

test('renders input fields for constructor args', () => {
  const mockOnChange = jest.fn()
  render(<ConstructorInput constructor={mockConstructor} onChange={mockOnChange} />)

  expect(screen.getByPlaceholderText('Enter recipient')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Enter amount')).toBeInTheDocument()

  fireEvent.change(screen.getByPlaceholderText('Enter recipient'), {
    target: { value: '5F3sa2TJ...mocked' }
  })
  at async t.<anonymous> (/home/bestnyah/1click-ink-deployer/node_modules/playwright-core/lib/cli/program.js:122:7)
  expect(mockOnChange).toHaveBeenCalledWith(0, '5F3sa2TJ...mocked')
})