// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.jsx'

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  cleanup()
})


describe('Todo app', () => {
  it('adds a new task', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText('Enter a task'), 'Study React')
    await user.click(screen.getByRole('button', { name: 'Add Task' }))

    expect(screen.getByText('Study React')).toBeInTheDocument()
  })

  it('deletes a task', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText('Enter a task'), 'Delete me')
    await user.click(screen.getByRole('button', { name: 'Add Task' }))

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(screen.queryByText('Delete me')).not.toBeInTheDocument()
  })

  it('completes a task', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText('Enter a task'), 'Study React')
    await user.click(screen.getByRole('button', { name: 'Add Task' }))

    await user.click(screen.getByRole('checkbox'))

    expect(screen.getByText('Completed: Study React')).toBeInTheDocument()
  })

  it('filters active and completed tasks', async () => {
    const user = userEvent.setup()
    render(<App />)

    const input = screen.getByPlaceholderText('Enter a task')
    const addButton = screen.getByRole('button', { name: 'Add Task' })

    await user.type(input, 'Active task')
    await user.click(addButton)

    await user.type(input, 'Completed task')
    await user.click(addButton)

    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[1])

    await user.click(screen.getByRole('button', { name: 'Active' }))

    expect(screen.getByText('Active task')).toBeInTheDocument()
    expect(screen.queryByText('Completed: Completed task')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Completed' }))

    expect(screen.getByText('Completed: Completed task')).toBeInTheDocument()
    expect(screen.queryByText('Active task')).not.toBeInTheDocument()
  })
  it('saves tasks to localStorage', async () => {
  const user = userEvent.setup()

  render(<App />)

  const input = screen.getByPlaceholderText('Enter a task')
  const addButton = screen.getByRole('button', { name: 'Add Task' })

  await user.type(input, 'Saved task')
  await user.click(addButton)

  expect(localStorage.getItem('tasks')).toContain('Saved task')
})

})
