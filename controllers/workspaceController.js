const Workspace = require('../models/workspaceModel');
const User = require('../models/User');
const AppError = require('../utils/errorHandler');

// Mock storage service for now
const storageService = {
    exportWorkspace: async (workspace) => ({ workspace }),
    importWorkspace: async (data, userId) => {
        const workspace = await Workspace.create({
            name: data.name,
            project: data.projectId,
            owner: userId,
        });
        return workspace;
    }
};


exports.createWorkspace = async (req, res, next) => {
  try {
    const { name, projectId } = req.body;
    const userId = req.user.id;

    if (!projectId) {
        return next(new AppError('A project ID is required to create a workspace.', 400));
    }

    const workspace = await Workspace.create({
      name,
      project: projectId,
      owner: userId,
    });

    // Add workspace to user's workspaces list
    await User.findByIdAndUpdate(userId, {
      $push: { workspaces: workspace._id }
    });

    res.status(201).json({
      status: 'success',
      data: {
        workspace
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user.id },
        { 'collaborators.user': req.user.id }
      ]
    }).populate('owner collaborators.user project', 'username email avatar name');

    if (!workspace) {
      return next(new AppError('Workspace not found or you do not have access', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        workspace
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateWorkspace = async (req, res, next) => {
  try {
    const { settings, name } = req.body;

    const workspace = await Workspace.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [
          { owner: req.user.id },
          { 'collaborators.user': req.user.id, 'collaborators.role': 'editor' }
        ]
      },
      {
        settings,
        name,
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!workspace) {
      return next(new AppError('Workspace not found or you do not have permission to edit', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        workspace
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!workspace) {
      return next(new AppError('Workspace not found or you do not have permission to delete', 404));
    }

    // Remove workspace from user's workspaces list
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { workspaces: workspace._id }
    });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

exports.listWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find({
      $or: [
        { owner: req.user.id },
        { 'collaborators.user': req.user.id }
      ]
    }).select('name owner project settings.autoSave syncStatus');

    res.status(200).json({
      status: 'success',
      results: workspaces.length,
      data: {
        workspaces
      }
    });
  } catch (err) {
    next(err);
  }
};

// Mock import/export until a proper service is built
exports.exportWorkspace = async (req, res, next) => {
    const workspace = await Workspace.findById(req.params.id);
    res.status(200).json({ data: await storageService.exportWorkspace(workspace) });
};

exports.importWorkspace = async (req, res, next) => {
    const workspace = await storageService.importWorkspace(req.body, req.user.id);
    res.status(201).json({ data: { workspace } });
};
