import type { Task } from '@domain/models/cycle/task'

export function orderTasks(tasks: Task[]): Task[] {
  return tasks
    .map((task, index) => ({ task, index }))
    .sort((left, right) => {
      const group = taskGroup(left.task) - taskGroup(right.task)
      if (group !== 0) return group
      return right.index - left.index
    })
    .map((item) => item.task)
}

function taskGroup(task: Task): number {
  if (task.done) return 2
  if (task.focusCount >= task.plannedFocuses) return 1
  return 0
}
