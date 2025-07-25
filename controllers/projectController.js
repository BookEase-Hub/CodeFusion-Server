const Project = require('../models/Project');

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort('-lastUpdated');
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { name, description, language } = req.body;

    const project = new Project({  
      name,  
      description,  
      language,  
      userId: req.user.id  
    });  

    await project.save();  
    res.json(project);  
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const { name, description, progress } = req.body;

    const project = await Project.findOneAndUpdate(  
      { _id: req.params.id, userId: req.user.id },  
      { name, description, progress, lastUpdated: Date.now() },  
      { new: true }  
    );  

    if (!project) {  
      return res.status(404).json({ error: 'Project not found' });  
    }  

    res.json(project);  
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!project) {  
      return res.status(404).json({ error: 'Project not found' });  
    }  

    res.json({ message: 'Project removed' });  
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
