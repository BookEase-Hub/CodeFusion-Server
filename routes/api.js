const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { validateUser, validateLogin, validateFile, validateProject, validateIntegration } = require('../middlewares/validation');
const cacheMiddleware = require('../middlewares/caching');
const {
  register,
  login,
  getCurrentUser,
  updateProfile,
  updateAvatar,
  updateSubscription
} = require('../controllers/authController');
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const {
  getIntegrations,
  createIntegration,
  updateIntegration,
  deleteIntegration
} = require('../controllers/integrationController');
const {
  getMessages,
  createMessage,
  generateCode
} = require('../controllers/aiController');
const {
  getFiles,
  createFile,
  updateFile,
  executeCommand
} = require('../controllers/fileController');
const {
  createSubscription,
  handleWebhook
} = require('../controllers/billingController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', validateUser, register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Bad request
 */
router.post('/login', validateLogin, login);

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get the current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The current user
 *       401:
 *         description: Unauthorized
 */
router.get('/me', protect, getCurrentUser);

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update the user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated user
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', protect, updateProfile);

/**
 * @swagger
 * /avatar:
 *   put:
 *     summary: Update the user avatar
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated user
 *       401:
 *         description: Unauthorized
 */
router.put('/avatar', protect, updateAvatar);

/**
 * @swagger
 * /subscription:
 *   put:
 *     summary: Update the user subscription
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plan:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated user
 *       401:
 *         description: Unauthorized
 */
router.put('/subscription', protect, updateSubscription);

// Project routes
router.route('/projects')
  .get(protect, cacheMiddleware(30), getProjects)
  .post(protect, validateProject, createProject);

router.route('/projects/:id')
  .put(protect, updateProject)
  .delete(protect, deleteProject);

// File routes
router.route('/files')
  .get(protect, cacheMiddleware(30), getFiles)
  .post(protect, validateFile, createFile);

router.route('/files/:id')
  .put(protect, updateFile);

router.post('/projects/:id/execute', protect, executeCommand);

// Integration routes
router.route('/integrations')
  .get(protect, getIntegrations)
  .post(protect, validateIntegration, createIntegration);

router.route('/integrations/:id')
  .put(protect, updateIntegration)
  .delete(protect, deleteIntegration);

// AI routes
router.route('/ai/messages')
  .get(protect, getMessages)
  .post(protect, createMessage);

router.post('/ai/code', protect, generateCode);

// Billing routes
router.post('/subscribe', protect, createSubscription);
router.post('/webhook', handleWebhook);

module.exports = router;
