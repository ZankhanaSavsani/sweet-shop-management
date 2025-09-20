const express = require('express');
const Sweet = require('../models/Sweet');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

// Get all sweets
router.get('/', protect, async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.status(200).json({
      status: 'success',
      results: sweets.length,
      data: { sweets }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a sweet (admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const sweet = await Sweet.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { sweet }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Search sweets
router.get('/search', protect, async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    let query = {};
    
    if (name) query.name = { $regex: name, $options: 'i' };
    if (category) query.category = { $regex: category, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    const sweets = await Sweet.find(query);
    res.status(200).json({
      status: 'success',
      results: sweets.length,
      data: { sweets }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a sweet (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }
    
    res.status(200).json({
      status: 'success',
      data: { sweet }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a sweet (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);
    
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Purchase a sweet
router.post('/:id/purchase', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const sweet = await Sweet.findById(req.params.id);
    
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }
    
    if (sweet.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough stock' });
    }
    
    sweet.quantity -= quantity;
    await sweet.save();
    
    res.status(200).json({
      status: 'success',
      data: { sweet }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Restock a sweet (admin only)
router.post('/:id/restock', protect, admin, async (req, res) => {
  try {
    const { quantity } = req.body;
    const sweet = await Sweet.findById(req.params.id);
    
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }
    
    sweet.quantity += quantity;
    await sweet.save();
    
    res.status(200).json({
      status: 'success',
      data: { sweet }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;