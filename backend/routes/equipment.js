const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Equipment = require('../models/Equipment');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/equipment
// @desc    Add new equipment (owner only)
// @access  Private (Owner)
router.post('/', [
  auth,
  requireRole(['owner']),
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('type').trim().notEmpty().withMessage('Type is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
  body('price_per_day').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('location').trim().notEmpty().withMessage('Location is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, type, description, price_per_day, location, image_url } = req.body;

    const equipment = new Equipment({
      name,
      type,
      description,
      price_per_day,
      location,
      image_url: image_url || '',
      owner_id: req.user._id
    });

    await equipment.save();

    res.status(201).json({
      message: 'Equipment added successfully',
      equipment
    });
  } catch (error) {
    console.error('Add equipment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/equipment
// @desc    Get all equipment with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, location, availability_status, search } = req.query;
    
    let filter = {};
    
    if (type) filter.type = { $regex: type, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (availability_status) filter.availability_status = availability_status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const equipment = await Equipment.find(filter)
      .populate('owner_id', 'name location')
      .sort({ createdAt: -1 });

    res.json(equipment);
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/equipment/owner/my-equipment
// @desc    Get current user's equipment (owner only)
// @access  Private (Owner)
router.get('/owner/my-equipment', [auth, requireRole(['owner'])], async (req, res) => {
  try {
    const equipment = await Equipment.find({ owner_id: req.user._id })
      .sort({ createdAt: -1 });

    res.json(equipment);
  } catch (error) {
    console.error('Get my equipment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/equipment/:id
// @desc    Get equipment by ID or slug
// @access  Public
router.get('/:idOrSlug', async (req, res) => {
  try {
    const idOrSlug = req.params.idOrSlug;
    let equipment;
    
    // Check if the parameter is a valid MongoDB ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
    
    if (isValidObjectId) {
      // If it's a valid ObjectId, search by ID
      equipment = await Equipment.findById(idOrSlug)
        .populate('owner_id', 'name location phone');
    } else {
      // Otherwise, search by slug
      equipment = await Equipment.findOne({ slug: idOrSlug })
        .populate('owner_id', 'name location phone');
    }

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json(equipment);
  } catch (error) {
    console.error('Get equipment by ID/slug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/equipment/:id
// @desc    Update equipment (owner only)
// @access  Private (Owner)
router.put('/:id', [
  auth,
  requireRole(['owner']),
  body('name').optional().trim().isLength({ min: 2 }),
  body('type').optional().trim().notEmpty(),
  body('description').optional().trim().isLength({ min: 10 }),
  body('price_per_day').optional().isFloat({ min: 0 }),
  body('location').optional().trim().notEmpty(),
  body('availability_status').optional().isIn(['available', 'rented', 'maintenance'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const equipment = await Equipment.findById(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Check if user owns this equipment
    if (equipment.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this equipment' });
    }

    const updatedEquipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Equipment updated successfully',
      equipment: updatedEquipment
    });
  } catch (error) {
    console.error('Update equipment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/equipment/:id
// @desc    Delete equipment (owner only)
// @access  Private (Owner)
router.delete('/:id', [auth, requireRole(['owner'])], async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Check if user owns this equipment
    if (equipment.owner_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this equipment' });
    }

    await Equipment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Delete equipment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route moved to the top of the file, before the /:idOrSlug route

module.exports = router;
