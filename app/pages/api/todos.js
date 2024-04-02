// pages/api/todos.js
let todos = [];

export default function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json(todos);
    } else if (req.method === 'POST') {
        const { text } = req.body;
        const newTodo = { id: Date.now(), text };
        todos.push(newTodo);
        res.status(201).json(newTodo);
    } else if (req.method === 'DELETE') {
        const { id } = req.query;
        todos = todos.filter((todo) => todo.id !== parseInt(id));
        res.status(200).json({ message: 'Todo deleted successfully' });
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}