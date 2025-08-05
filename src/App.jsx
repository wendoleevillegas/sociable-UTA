import { Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import Register from './Register.jsx';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}

export default App;