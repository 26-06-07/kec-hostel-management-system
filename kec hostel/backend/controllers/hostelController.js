const Hostel = require('../models/Hostel');

exports.getAllHostels = async (req, res, next) => {
  try {
    const hostels = await Hostel.findAll();
    res.status(200).json({
      success: true,
      count: hostels.length,
      data: hostels
    });
  } catch (error) {
    next(error);
  }
};

exports.getHostelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hostel = await Hostel.findById(id);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: `Hostel with ID "${id}" was not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: hostel
    });
  } catch (error) {
    next(error);
  }
};
