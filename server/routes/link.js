const express = require('express');
const router = express.Router();

// validators
const { linkCreateValidator, linkUpdateValidator } = require('../validators/link');
const { runValidation } = require('../validators');

// controllers
const { requireSignin, authMiddleware, adminMiddleware, canUpdateDeleteLink } = require('../controllers/auth');
const { create, list, read, update, remove, clickCount, popular, popularInCategory } = require('../controllers/link');

// routes
router.post('/link', linkCreateValidator, runValidation, requireSignin, authMiddleware, create);
router.post('/links', requireSignin, adminMiddleware, list);
router.put('/click-count', clickCount);
router.get('/link/popular', popular);
router.get('/link/popular/:slug', popularInCategory);
router.get('/link/:id', read);
router.put('/link/:id', linkUpdateValidator, runValidation, requireSignin, authMiddleware, canUpdateDeleteLink, update);
router.put('/link/admin/:id', linkUpdateValidator, runValidation, requireSignin, adminMiddleware, update);
router.delete('/link/:id', requireSignin, authMiddleware, canUpdateDeleteLink, remove);
router.delete('/link/admin/:id', requireSignin, adminMiddleware, remove);

module.exports = router;
