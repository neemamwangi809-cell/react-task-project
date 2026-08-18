import { useEffect, useState } from 'react'

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })

  const [taskText, setTaskText] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  function addTask(e) {
    e.preventDefault()

   const text = taskText.trim()

if (!text) return

if (tasks.some((task) => task.text.toLowerCase() === text.toLowerCase())) {
  return
}



    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: text,
        completed: false,
      },
    ])

    setTaskText('')
  }

  function toggleTask(id) {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed }
        }

        return task
      })
    )
  }

  function getVisibleTasks() {
    if (filter === 'active') {
      return tasks.filter((task) => !task.completed)
    }

    if (filter === 'completed') {
      return tasks.filter((task) => task.completed)
    }

    return tasks
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <main>
      <h1>My Tasks</h1>

      <p aria-live="polite">
  Total tasks: {tasks.length} | Completed: {tasks.filter((task) => task.completed).length}
</p>

      <form onSubmit={addTask} aria-label="Add a new task">
        <label htmlFor="task">New task</label>

        <input
          id="task"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Enter a task"
          aria-describedby="task-help"
        />

        <small id="task-help">
          Enter a task you want to remember.
        </small>

        <button type="submit">Add Task</button>
      </form>

      <div aria-label="Task filters">
        <button
          type="button"
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => setFilter('active')}
          aria-pressed={filter === 'active'}
        >
          Active
        </button>

        <button
          type="button"
          onClick={() => setFilter('completed')}
          aria-pressed={filter === 'completed'}
        >
          Completed
        </button>
      </div>

      <h2>Tasks</h2>
      <p aria-live="polite">
  Showing: {filter === 'all' ? 'All tasks' : filter === 'active' ? 'Active tasks' : 'Completed tasks'}
</p>

      <ul aria-label="Task list">
        {getVisibleTasks().length === 0 ? (
          <li>
            {filter === 'active'
              ? 'No active tasks.'
              : filter === 'completed'
                ? 'No completed tasks.'
                : 'No tasks yet. Add a task to get started!'}
          </li>
        ) : (
          getVisibleTasks().map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />

              <span>
                {task.completed ? 'Completed: ' + task.text : task.text}
              </span>

              <button type="button" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </main>
  )
}

export default App