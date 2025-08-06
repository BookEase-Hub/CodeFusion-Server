const Project = require('../models/Project');
const User = require('../models/User');
const projectService = require('../services/projectService'); // I will create this service next
const AppError = require('../utils/errorHandler');

exports.createProject = async (req, res, next) => {
  try {
    const { name, description, primaryLanguage, template, files } = req.body;
    const userId = req.user.id;

    const project = await Project.create({
      name,
      description,
      primaryLanguage,
      template,
      files: files || [],
      owner: userId
    });

    // Add project to user's projects list
    await User.findByIdAndUpdate(userId, {
      $push: { projects: project._id }
    });

    res.status(201).json({
      status: 'success',
      data: {
        project
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user.id },
        { 'collaborators.user': req.user.id }
      ]
    }).populate('owner collaborators.user', 'username email avatar');

    if (!project) {
      return next(new AppError('Project not found or you do not have access', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        project
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const { files, name, description } = req.body;

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [
          { owner: req.user.id },
          { 'collaborators.user': req.user.id, 'collaborators.role': 'editor' }
        ]
      },
      {
        files,
        name,
        description,
        lastModified: Date.now(),
        syncStatus: 'local'
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!project) {
      return next(new AppError('Project not found or you do not have permission to edit', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        project
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!project) {
      return next(new AppError('Project not found or you do not have permission to delete', 404));
    }

    // Remove project from user's projects list
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { projects: project._id }
    });

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

exports.listProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'collaborators.user': req.user.id }
      ]
    }).select('name owner description primaryLanguage template lastModified syncStatus');

    res.status(200).json({
      status: 'success',
      results: projects.length,
      data: {
        projects
      }
    });
  } catch (err) {
    next(err);
  }
};

// --- Import/Export/Sync ---

exports.exportProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    // Add access control check here
    if (!project) {
        return next(new AppError('Project not found', 404));
    }
    const exportData = await projectService.exportProject(project);
    res.status(200).json({
      status: 'success',
      data: {
        exportData
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.importProject = async (req, res, next) => {
  try {
    const { exportData } = req.body;
    const userId = req.user.id;
    const project = await projectService.importProject(exportData, userId);
    res.status(201).json({
      status: 'success',
      data: {
        project
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.syncProject = async (req, res, next) => {
  try {
    const project = await projectService.syncProjectToCloud(req.params.id, req.user.id);
    res.status(200).json({
      status: 'success',
      data: {
        project
      }
    });
  } catch (err) {
    next(err);
  }
};
