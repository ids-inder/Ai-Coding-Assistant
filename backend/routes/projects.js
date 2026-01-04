const express = require('express');
const Project = require('../models/Project');
const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .select('-conversations -files')
      .sort({ updatedAt: -1 });

    res.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Error fetching projects' });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Error fetching project' });
  }
});

// Create project
router.post('/', async (req, res) => {
  try {
    const { name, description, projectType, language } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const project = new Project({
      userId: 'anonymous', // No authentication
      name,
      description,
      projectType,
      language
    });

    await project.save();

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Error creating project' });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const { name, description, projectType, language } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, projectType, language },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Error updating project' });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Error deleting project' });
  }
});

// Add file to project
router.post('/:id/files', async (req, res) => {
  try {
    const { name, content, language } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.files.push({ name, content, language });
    await project.save();

    res.json({
      message: 'File added successfully',
      project
    });
  } catch (error) {
    console.error('Error adding file:', error);
    res.status(500).json({ error: 'Error adding file' });
  }
});

module.exports = router;
