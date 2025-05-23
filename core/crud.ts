import fs from 'fs' // ES6
import { v4 as uuid } from 'uuid'
// const fs = require("fs"); - CommonJS
const DB_FILE_PATH = './core/db'

console.log('[CRUD]')

interface Todo {
  id: string
  date: string
  content: string
  done: boolean
}

function create(content: string): Todo {
  const todo: Todo = {
    id: uuid(),
    date: new Date().toISOString(),
    content: content,
    done: false
  }

  const todos: Array<Todo> = [...read(), todo]

  // salvar o content no sistema
  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
        dogs: []
      },
      null,
      2
    )
  )
  return todo
}

function read(): Array<Todo> {
  const dbString = fs.readFileSync(DB_FILE_PATH, 'utf-8')
  const db = JSON.parse(dbString || '{}')
  if (!db.todos) {
    // Fail Fast Validations
    return []
  }

  return db.todos
}

function update(id: string, partialTodo: Partial<Todo>): Todo {
  let updatedTodo
  const todos = read()
  todos.forEach(currentTodo => {
    const isToUpdate = currentTodo.id === id
    if (isToUpdate) {
      updatedTodo = Object.assign(currentTodo, partialTodo)
    }
  })

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos
      },
      null,
      2
    )
  )

  if (!updatedTodo) {
    throw new Error('Please, provide another ID!')
  }

  return updatedTodo
}

function updateContentById(id: string, content: string): Todo {
  return update(id, {
    content
  })
}

function CLEAR_DB() {
  fs.writeFileSync(DB_FILE_PATH, '')
}

// [SIMULATION]
CLEAR_DB()
create('Primeira TODO')
create('Primeira TODO')
const terceiraTodo = create('Segunda TODO')
// update(terceiraTodo.id, {
//   content: "Atualizada!",
//   done: true,
// });
updateContentById(terceiraTodo.id, 'Atualizada!')
console.log(read())
