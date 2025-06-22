"use client";

import React, { useState, useEffect, useCallback } from 'react';

const LOCAL_STORAGE_KEY = 'forgejo_next_todos';

// Helper function for HTML escaping (simplified)
const escapeHtml = (unsafe) => {
    if (typeof unsafe !== 'string') return '';
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
};


export default function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [todoTitle, setTodoTitle] = useState('');
    const [todoDescription, setTodoDescription] = useState('');
    const [todoPriority, setTodoPriority] = useState('medium');

    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');

    // Load todos from localStorage on initial render
    useEffect(() => {
        try {
            const storedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedTodos) {
                setTodos(JSON.parse(storedTodos));
            }
        } catch (error) {
            console.error("Error loading todos from localStorage:", error);
            setTodos([]); // Fallback to empty array on error
        }
    }, []);

    // Save todos to localStorage whenever todos state changes
    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
        } catch (error) {
            console.error("Error saving todos to localStorage:", error);
        }
    }, [todos]);

    const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

    const handleAddTodo = (e) => {
        e.preventDefault();
        if (!todoTitle.trim()) {
            alert('TODOのタイトルを入力してください'); // Replace with better notification
            return;
        }
        const newTodo = {
            id: generateId(),
            title: todoTitle.trim(),
            description: todoDescription.trim(),
            priority: todoPriority,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null,
            updatedAt: new Date().toISOString(),
        };
        setTodos(prevTodos => [newTodo, ...prevTodos]);
        setTodoTitle('');
        setTodoDescription('');
        setTodoPriority('medium');
    };

    const toggleTodoComplete = (id) => {
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id
                    ? { ...todo, completed: !todo.completed, completedAt: !todo.completed ? new Date().toISOString() : null, updatedAt: new Date().toISOString() }
                    : todo
            )
        );
    };

import Modal from './Modal'; // Modalコンポーネントをインポート

export default function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [todoTitle, setTodoTitle] = useState('');
    const [todoDescription, setTodoDescription] = useState('');
    const [todoPriority, setTodoPriority] = useState('medium');

    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');

    // Modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null); // Store the todo being edited
    // Edit form states
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editPriority, setEditPriority] = useState('medium');

    // Toast state
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    // Load todos from localStorage on initial render
    useEffect(() => {
        try {
            const storedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedTodos) {
                setTodos(JSON.parse(storedTodos));
            }
        } catch (error) {
            console.error("Error loading todos from localStorage:", error);
            setTodos([]); // Fallback to empty array on error
        }
    }, []);

    // Save todos to localStorage whenever todos state changes
    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
        } catch (error) {
            console.error("Error saving todos to localStorage:", error);
        }
    }, [todos]);

    // Show toast message
    const showToast = (message, type = 'info') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'info' });
        }, 3000);
    };

    const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

    const handleAddTodo = (e) => {
        e.preventDefault();
        if (!todoTitle.trim()) {
            showToast('TODOのタイトルを入力してください', 'error');
            return;
        }
        const newTodo = {
            id: generateId(),
            title: todoTitle.trim(),
            description: todoDescription.trim(),
            priority: todoPriority,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null,
            updatedAt: new Date().toISOString(),
        };
        setTodos(prevTodos => [newTodo, ...prevTodos]);
        setTodoTitle('');
        setTodoDescription('');
        setTodoPriority('medium');
        showToast('TODOを追加しました', 'success');
    };

    const toggleTodoComplete = (id) => {
        let todoTitleForMessage = "";
        setTodos(prevTodos =>
            prevTodos.map(todo => {
                if (todo.id === id) {
                    todoTitleForMessage = todo.title;
                    return { ...todo, completed: !todo.completed, completedAt: !todo.completed ? new Date().toISOString() : null, updatedAt: new Date().toISOString() };
                }
                return todo;
            })
        );
        const todo = todos.find(t => t.id === id);
        if (todo) { // Check if todo exists before accessing its properties
             showToast(todo.completed ? `「${todoTitleForMessage}」を未完了に戻しました` : `「${todoTitleForMessage}」を完了しました`, 'success');
        }
    };

    const deleteTodo = (id) => {
        const todoToDelete = todos.find(todo => todo.id === id);
        if (todoToDelete && confirm(`「${escapeHtml(todoToDelete.title)}」を削除しますか？`)) {
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
            showToast(`「${escapeHtml(todoToDelete.title)}」を削除しました`, 'success');
        }
    };

    const openEditModal = (todo) => {
        setEditingTodo(todo);
        setEditTitle(todo.title);
        setEditDescription(todo.description);
        setEditPriority(todo.priority);
        setIsEditModalOpen(true);
    };

    const handleUpdateTodo = (e) => {
        e.preventDefault();
        if (!editingTodo || !editTitle.trim()) {
            showToast('タイトルは必須です', 'error');
            return;
        }
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === editingTodo.id
                    ? {
                        ...todo,
                        title: editTitle.trim(),
                        description: editDescription.trim(),
                        priority: editPriority,
                        updatedAt: new Date().toISOString(),
                      }
                    : todo
            )
        );
        setIsEditModalOpen(false);
        setEditingTodo(null);
        showToast('TODOを更新しました', 'success');
    };

    const filteredTodos = todos.filter(todo => {
        const statusMatch = filterStatus === 'all' ||
            (filterStatus === 'completed' && todo.completed) ||
            (filterStatus === 'pending' && !todo.completed);
        const priorityMatch = filterPriority === 'all' || todo.priority === filterPriority;
        return statusMatch && priorityMatch;
    });

    const totalTodos = todos.length;
    const completedTodosCount = todos.filter(todo => todo.completed).length;
    const pendingTodosCount = totalTodos - completedTodosCount;
    const completionRate = totalTodos > 0 ? Math.round((completedTodosCount / totalTodos) * 100) : 0;

    const priorityText = { low: '低', medium: '中', high: '高' };

    return (
        <>
            {/* Toast Notification */}
            {toast.show && (
                <div className={`toast toast-${toast.type}`}>
                    {escapeHtml(toast.message)}
                </div>
            )}

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="TODO編集">
                {editingTodo && (
                    <form id="editTodoFormModal" onSubmit={handleUpdateTodo}>
                        <div className="form-group">
                            <label htmlFor="modalEditTitle">タイトル</label>
                            <input
                                type="text"
                                id="modalEditTitle"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="modalEditDescription">説明</label>
                            <textarea
                                id="modalEditDescription"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows="3"
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="modalEditPriority">優先度</label>
                            <select
                                id="modalEditPriority"
                                value={editPriority}
                                onChange={(e) => setEditPriority(e.target.value)}
                            >
                                <option value="low">低</option>
                                <option value="medium">中</option>
                                <option value="high">高</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button type="button" className="toggle-btn" onClick={() => setIsEditModalOpen(false)}>
                                キャンセル
                            </button>
                            <button type="submit" className="simple-login-btn" style={{marginTop: 0, marginBottom: 0}}> {/* simple-login-btnのスタイルを流用 */}
                                更新
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* TODO Form Section */}
            <div className="todo-form-container">
                <h2><i className="fas fa-plus-circle"></i> 新しいTODO</h2>
                <form id="todoForm" className="todo-form" onSubmit={handleAddTodo}>
                    <div className="form-row">
                        <input
                            type="text"
                            id="todoTitle"
                            placeholder="TODOのタイトルを入力..."
                            value={todoTitle}
                            onChange={(e) => setTodoTitle(e.target.value)}
                            required
                        />
                        <select
                            id="todoPriority"
                            value={todoPriority}
                            onChange={(e) => setTodoPriority(e.target.value)}
                        >
                            <option value="low">低</option>
                            <option value="medium">中</option>
                            <option value="high">高</option>
                        </select>
                        <button type="submit">
                            <i className="fas fa-plus"></i> 追加
                        </button>
                    </div>
                    <textarea
                        id="todoDescription"
                        placeholder="詳細説明（任意）"
                        value={todoDescription}
                        onChange={(e) => setTodoDescription(e.target.value)}
                        rows="3"
                    ></textarea>
                </form>
            </div>

            {/* TODO List Section */}
            <div className="todo-list-container">
                <div className="todo-list-header">
                    <h2><i className="fas fa-list"></i> TODOリスト</h2>
                    <div className="filter-controls">
                        <select id="filterStatus" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="all">全て</option>
                            <option value="pending">未完了</option>
                            <option value="completed">完了済み</option>
                        </select>
                        <select id="filterPriority" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                            <option value="all">全優先度</option>
                            <option value="high">高</option>
                            <option value="medium">中</option>
                            <option value="low">低</option>
                        </select>
                    </div>
                </div>

                <div id="todoList" className="todo-list">
                    {filteredTodos.length === 0 && (
                        <div id="emptyState" className="empty-state">
                            <i className="fas fa-clipboard-list"></i>
                            <h3>TODOがありません</h3>
                            <p>新しいTODOを追加して始めましょう！</p>
                        </div>
                    )}
                    {filteredTodos.map(todo => (
                        <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                            <div className="todo-header">
                                <div>
                                    <div className="todo-title">{escapeHtml(todo.title)}</div>
                                    <div className="todo-meta">
                                        <span className={`priority-badge priority-${todo.priority}`}>
                                            {priorityText[todo.priority] || todo.priority}
                                        </span>
                                        <span><i className="fas fa-calendar-plus"></i> {new Date(todo.createdAt).toLocaleString('ja-JP')}</span>
                                        {todo.completedAt && <span><i className="fas fa-check-circle"></i> {new Date(todo.completedAt).toLocaleString('ja-JP')}</span>}
                                    </div>
                                </div>
                                <div className="todo-actions">
                                    <button onClick={() => toggleTodoComplete(todo.id)} className="complete-btn" title={todo.completed ? '未完了に戻す' : '完了にする'}>
                                        <i className={`fas fa-${todo.completed ? 'undo' : 'check'}`}></i>
                                    </button>
                                    <button onClick={() => editTodo(todo.id)} className="edit-btn" title="編集">
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button onClick={() => deleteTodo(todo.id)} className="delete-btn" title="削除">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            {todo.description && <div className="todo-description" dangerouslySetInnerHTML={{ __html: escapeHtml(todo.description).replace(/\n/g, '<br>') }}></div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Section */}
            <div className="stats-container">
                <h2><i className="fas fa-chart-bar"></i> 統計</h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon"><i className="fas fa-tasks"></i></div>
                        <div className="stat-info">
                            <span className="stat-value" id="totalTodos">{totalTodos}</span>
                            <span className="stat-label">総TODO数</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><i className="fas fa-clock"></i></div>
                        <div className="stat-info">
                            <span className="stat-value" id="pendingTodos">{pendingTodosCount}</span>
                            <span className="stat-label">未完了</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
                        <div className="stat-info">
                            <span className="stat-value" id="completedTodos">{completedTodosCount}</span>
                            <span className="stat-label">完了済み</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><i className="fas fa-percentage"></i></div>
                        <div className="stat-info">
                            <span className="stat-value" id="completionRate">{completionRate}%</span>
                            <span className="stat-label">完了率</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
