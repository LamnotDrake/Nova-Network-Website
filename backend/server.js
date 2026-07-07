'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');

const config = require('./config');
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const forumRoutes = require('./routes/forum');
const staffRoutes = require('./routes/staff');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const app = express();
app.set('trust proxy', 1); // needed for req.ip to be correct behind a reverse proxy (Render,Nginx,etc.)

app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use(express.static(PUBLIC_DIR));

app.use('/api/admin', adminRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api', publicRoutes);


// Anything under /api that didn't match a route is a real 404 not a page to redirect to the SPA shell.
app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found.' });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

const PORT = process.env.PORT || config.get().backend?.port || 3001;
app.listen(PORT, () => {
  console.log(`RealmCraft server listening on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin.html`);
});

module.exports = app;