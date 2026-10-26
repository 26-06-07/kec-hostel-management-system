const Notice = require('../models/Notice');

exports.getNotices = async (req, res, next) => {
  try {
    const notices = await Notice.findAll();
    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices
    });
  } catch (error) {
    next(error);
  }
};

exports.createNotice = async (req, res, next) => {
  try {
    const { title, category, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Notice title and content are required.'
      });
    }

    const notice = await Notice.create({
      title,
      category: category || 'General',
      published_by: req.user.name || 'Warden Office',
      content
    });

    res.status(201).json({
      success: true,
      message: 'Official notice published successfully.',
      data: notice
    });
  } catch (error) {
    next(error);
  }
};

exports.getMessMenu = (req, res) => {
  const menu = Notice.getMessMenu();
  res.status(200).json({
    success: true,
    data: menu
  });
};
