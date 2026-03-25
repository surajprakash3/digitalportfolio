import asyncHandler from 'express-async-handler';
import Analytics from '../models/Analytics.js';

// @desc    Track a page view
// @route   POST /api/analytics/track
// @access  Public
const trackPageView = asyncHandler(async (req, res) => {
  const { page, visitorId } = req.body;

  if (!page || !visitorId) {
    res.status(400);
    throw new Error('Page and visitorId are required');
  }

  await Analytics.create({
    page,
    visitorId,
    userAgent: req.headers['user-agent'] || '',
    referrer: req.headers.referer || '',
  });

  res.status(201).json({ message: 'Page view tracked' });
});

// @desc    Get analytics summary
// @route   GET /api/analytics/summary
// @access  Private/Admin
const getAnalyticsSummary = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Total page views
  const totalViews = await Analytics.countDocuments({
    createdAt: { $gte: startDate },
  });

  // Unique visitors
  const uniqueVisitors = await Analytics.distinct('visitorId', {
    createdAt: { $gte: startDate },
  });

  // Views by page
  const viewsByPage = await Analytics.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    { $group: { _id: '$page', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Views over time (daily)
  const viewsOverTime = await Analytics.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    totalViews,
    uniqueVisitors: uniqueVisitors.length,
    viewsByPage,
    viewsOverTime,
    period: `${days} days`,
  });
});

export { trackPageView, getAnalyticsSummary };
