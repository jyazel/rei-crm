require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5173'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use('/api/auth',         require('./routes/auth'));
app.use('/api/contacts',     require('./routes/contacts'));
app.use('/api/properties',   require('./routes/properties'));
app.use('/api/boards',       require('./routes/boards'));
app.use('/api/deals',        require('./routes/deals'));
app.use('/api/campaigns',    require('./routes/campaigns'));
app.use('/api/inboxes',      require('./routes/inboxes'));
app.use('/api/tasks',        require('./routes/tasks'));
app.use('/api/action-plans', require('./routes/actionPlans'));
app.use('/api/templates',    require('./routes/templates'));
app.use('/api/dashboard',    require('./routes/dashboard'));

// Serve Vite-built frontend in production
if (process.env.NODE_ENV === 'production') {
    const clientDist = path.join(__dirname, '../../client/dist');
    app.use(express.static(clientDist));
    app.get('*', (req, res) => {
          res.sendFile(path.join(clientDist, 'index.html'));
    });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
