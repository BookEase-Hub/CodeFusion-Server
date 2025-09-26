const express = require('express');
const router = express.Router();
const { validateUser, validateLogin, validateFile } = require('../middlewares/validation');
const {
  signup,
  login,
  protect,
  getCurrentUser,
  updateProfile,
  updateAvatar
} = require('../controllers/authController');
const {
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  importProject,
  exportProject,
  syncProject
} = require('../controllers/projectController');
const {
  getIntegrations,
  createIntegration,
  updateIntegration,
  deleteIntegration
} = require('../controllers/integrationController');
const {
  processChatMessage,
  runAgentTask,
  getTaskHistory
} = require('../controllers/aiController');
const {
  getFiles,
  createFile,
  updateFile,
  executeCommand
} = require('../controllers/fileController');
const workspaceController = require('../controllers/workspaceController');

// Auth routes
router.post('/register', validateUser, signup);
router.post('/login', validateLogin, login);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, updateAvatar);

// Project routes
router.route('/projects')
  .get(protect, listProjects)
  .post(protect, createProject);

router.route('/projects/import').post(protect, importProject);

router.route('/projects/:id')
  .get(protect, getProject)
  .patch(protect, updateProject) // Using PATCH for partial updates is more conventional
  .delete(protect, deleteProject);

router.route('/projects/:id/export').get(protect, exportProject);
router.route('/projects/:id/sync').post(protect, syncProject);

// File routes
router.route('/files')
  .get(protect, getFiles)
  .post(protect, validateFile, createFile);

router.route('/files/:id')
  .put(protect, updateFile);

router.post('/execute', protect, executeCommand);

// Integration routes
router.route('/integrations')
  .get(protect, getIntegrations)
  .post(protect, createIntegration);

router.route('/integrations/:id')
  .put(protect, updateIntegration)
  .delete(protect, deleteIntegration);

// AI routes
router.post('/ai/chat', protect, processChatMessage);
router.post('/ai/agent', protect, runAgentTask);
router.get('/ai/history/:workspaceId', protect, getTaskHistory);

// Workspace routes
router.route('/workspaces')
    .get(protect, workspaceController.listWorkspaces)
    .post(protect, workspaceController.createWorkspace);

router.route('/workspaces/:id')
    .get(protect, workspaceController.getWorkspace)
    .patch(protect, workspaceController.updateWorkspace)
    .delete(protect, workspaceController.deleteWorkspace);


module.exports = router;
