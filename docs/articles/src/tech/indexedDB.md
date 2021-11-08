---
date: 1970-01-01
tags: 
  - indexedDB
---

# indexDB

## 源代码

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://unpkg.com/react@16.12.0/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@16.12.0/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
    <title>Document</title>
</head>
<body>
    <div class="todo-container"></div>
    <script type="text/babel">
        // const todos = [
        //     { id: "444-44-4444", content: "earn money", completed: false, createTime: '2020/3/2'},
        //     { id: "555-55-5555", content: "earn money", completed: false, createTime: '2020/3/2'}
        // ]
        let db
        if(window.indexedDB) {
            getTodos().then(initialTodos => {
                const Todo = function() {
                    const [todos, setTodos] = React.useState(initialTodos)
                    const [value, setValue] = React.useState('')
                    const [filter, setFilter] = React.useState('all')
                    // const textareaRef = React.useRef()
                    function toggleTodo(id, completed) {
                        updateTodo(id, {completed: !completed}).then(newTodo => {
                            setTodos(todos.map(todo => {
                                if(todo.id === newTodo.id) {
                                    return newTodo
                                } else {
                                    return todo
                                }
                            }))
                        })
                    }
                    function _deleteTodo(id) {
                        deleteTodo(id).then(() => {
                            setTodos(todos.filter(todo => todo.id !== id))
                        })
                    }
                    function _addTodo() {
                        addTodo(value).then((todo) => {
                            setTodos([todo].concat(todos))
                        })
                    }
                    function changeValue(e) {
                        setValue(e.target.value)
                    }
                    return (
                        <React.Fragment>
                            <textarea value={value} onChange={(e) => changeValue(e)} name="content" id="content" cols="30" rows="10"></textarea>
                            <button className="add_btn" onClick={() => _addTodo()}>新建</button>
                            <hr />
                            <div className="filter_area">
                                筛选：
                                <button className="filter_btn_all" onClick={() => {setFilter('all')}}>全部</button>
                                <button className="filter_btn_completed" onClick={() => {setFilter('completed')}}>已完成</button>
                                <button className="filter_btn_uncompleted" onClick={() => {setFilter('uncompleted')}}>未完成</button>
                            </div>
                            <hr />
                            <ul className="todos">
                                {todos.filter(todo => {
                                    if(filter === 'all') {
                                        return true
                                    } else {
                                        return todo.completed === (filter === 'completed')
                                    }
                                }).map(todo => (
                                    <li className="todo" key={todo.id}>
                                        <div className="todo_header">
                                            <span className="todo_header_createtime">创建时间：{todo.createTime.toString()}</span>
                                            <span className="todo_header_state">状态：{todo.completed? '已完成': '未完成'}</span>
                                        </div>
                                        <div className="todo_body">
                                            <p className="todo_content">{todo.content}</p>
                                        </div>
                                        <div className="todo_footer">
                                            <button className="toggle_btn" onClick={() => toggleTodo(todo.id, todo.completed)}>{todo.completed? '取消完成': '完成'}</button>
                                            <button className="delete_btn" onClick={() => _deleteTodo(todo.id)}>删除</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </React.Fragment>
                    )
                }
                ReactDOM.render(<Todo />, document.getElementsByClassName('todo-container')[0])
            })
            .catch(err => {console.error(err)})
        } else {
            alert(`your browser doesn't support indexDB`)
        }
        function initIndexDB() {
            return new Promise((resolve, reject) => {
                const request = window.indexedDB.open('test_db')
                request.onsuccess = (event) => {
                    console.log('onsuccess')
                    db = event.target.result
                    resolve()
                }
                request.onerror = (event) => {
                    alert('open indexDB error', event.target.errorCode)
                    reject()
                }
                request.onupgradeneeded = (event) => {
                    console.log('onupgradeneeded')
                    db = event.target.result
                    db.onerror = (event) => {
                        alert('indexDB request error', event.target.errorCode)
                    }
                    db.onversionchange = (event) => {
                        db.close()
                        alert('please reload current tab')
                    }
                    const objectStore = db.createObjectStore('todo', {keyPath: 'id'})
                    objectStore.transaction.oncomplete = (event) => {}
                }
            })
        }
        function getTodos() {
            if(!db || !(db instanceof IDBDatabase)) {
                return initIndexDB().then(getTodos)
            }
            return new Promise((resolve, reject) => {
                const todoObjectStore = db.transaction("todo", "readwrite").objectStore("todo")
                const todos =  []
                const openCursorRequest = todoObjectStore.openCursor()
                openCursorRequest.onsuccess = event => {
                    const cursor = event.target.result
                    if(cursor) {
                        console.log('get', cursor.value)
                        todos.push(cursor.value)
                        cursor.continue()
                    } else {
                        resolve(todos)
                    }
                }
                openCursorRequest.onerror = event => {
                    reject(event.result.errorCode)
                }
            })
        }
        function updateTodo(id, change) {
            if(!db || !(db instanceof IDBDatabase)) {
                return initIndexDB().then(updateTodos)
            }
            return new Promise((resolve, reject) => {
                const todoObjectStore = db.transaction("todo", "readwrite").objectStore("todo")
                const getRequest = todoObjectStore.get(id)
                getRequest.onsuccess = event => {
                    let todo = event.target.result
                    Object.assign(todo, change)
                    const putRequest = todoObjectStore.put(todo)
                    putRequest.onsuccess = event => {
                        resolve(todo)
                    }
                    putRequest.onerror = event => {
                        reject(event.result.errorCode)
                    }
                }
                getRequest.onerror = event => {
                    reject(event.result.errorCode)
                }
            })
        }
        function addTodo(content) {
            if(!db || !(db instanceof IDBDatabase)) {
                return initIndexDB().then(addTodo)
            }
            return new Promise((resolve, reject) => {
                const todoObjectStore = db.transaction("todo", "readwrite").objectStore("todo")
                const todo = {}
                todo.id = randomId()
                todo.completed = false
                todo.createTime = new Date()
                todo.content = content
                const addRequest = todoObjectStore.add(todo)
                addRequest.onsuccess = event => {
                    resolve(todo)
                }
                addRequest.onerror = event => {
                    reject(event.result.errorCode)
                }
            })
        }
        function deleteTodo(id) {
            if(!db || !(db instanceof IDBDatabase)) {
                return initIndexDB().then(deleteTodos)
            }
            return new Promise((resolve, reject) => {
                const todoObjectStore = db.transaction("todo", "readwrite").objectStore("todo")
                const deleteRequest = todoObjectStore.delete(id)
                deleteRequest.onsuccess = event => {
                    resolve(id)
                }
                deleteRequest.onerror = event => {
                    reject(event.result.errorCode)
                }
            })
        }
        function randomId() {
            return Math.random().toString().substring(2)
        }
    </script>
</body>
</html>
```

## 项目地址

<https://cunzaizhimi.top/static/indexDB.html>
