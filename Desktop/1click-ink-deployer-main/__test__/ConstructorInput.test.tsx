import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react'
import ConstructorInput from '@/components/ConstructorInput'

const mockConstructor = {
  label: 'new',
  args: [
    { label: 'recipient', type: { type: 'AccountId', displayName: ['AccountId'] } },
    { label: 'amount', type: { type: 'Balance', displayName: ['Balance'] } }
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
  expect(mockOnChange).toHaveBeenCalledWith(0, '5F3sa2TJ...mocked')
})