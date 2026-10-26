const Room = require('../models/Room');

exports.getRooms = async (req, res, next) => {
  try {
    const { hostel } = req.query;
    const rooms = await Room.findAll({ hostel });
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
};
