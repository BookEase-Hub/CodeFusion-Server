const Workspace = require('../models/workspaceModel');
const Diagram = require('../models/diagramModel');
const aiService = require('../services/aiService'); // I will create this next
const AppError = require('../utils/errorHandler');

exports.processChatMessage = async (req, res, next) => {
  try {
    const { message, workspaceId, context } = req.body;
    const userId = req.user.id;

    // Verify workspace access
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      $or: [
        { owner: userId },
        { 'collaborators.user': userId }
      ]
    }).populate('project'); // Populate the project to get file data

    if (!workspace) {
      return next(new AppError('Workspace not found or you do not have access', 404));
    }

    if (!workspace.project) {
        return next(new AppError('The workspace is not linked to a valid project.', 404));
    }

    // Process the AI task
    const result = await aiService.processAITask({
      userId,
      workspaceId,
      message,
      context: {
        ...context,
        fileTree: workspace.project.files // Pass the file tree from the populated project
      }
    });

    // If the result contains a diagram, save it
    if (result.type === 'diagram') {
      await Diagram.findOneAndUpdate(
        { workspace: workspaceId, name: result.diagramName || 'Untitled Diagram' },
        {
          mermaidCode: result.content,
          lastGenerated: Date.now()
        },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({
      status: 'success',
      data: {
        result
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.runAgentTask = async (req, res, next) => {
  try {
    const { task, workspaceId } = req.body;
    const userId = req.user.id;

    // Verify workspace access
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      $or: [
        { owner: userId },
        { 'collaborators.user': userId }
      ]
    }).populate('project');

    if (!workspace || !workspace.project) {
      return next(new AppError('Workspace or associated project not found, or you do not have access', 404));
    }

    // Process the agent task (multi-step)
    const steps = await aiService.processAITask({
      userId,
      workspaceId,
      message: task,
      isAgentTask: true,
      context: {
        fileTree: workspace.project.files
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        steps
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getTaskHistory = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.id;

    // Verify workspace access
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      $or: [
        { owner: userId },
        { 'collaborators.user': userId }
      ]
    });

    if (!workspace) {
      return next(new AppError('Workspace not found or you do not have access', 404));
    }

    // In a real app, you'd have a Task model to store history
    // For now we'll return a mock response
    const history = [
      {
        id: '1',
        type: 'chat',
        input: 'Create a React component',
        output: 'I created a functional component',
        timestamp: new Date()
      }
    ];

    res.status(200).json({
      status: 'success',
      data: {
        history
      }
    });
  } catch (err) {
    next(err);
  }
};
