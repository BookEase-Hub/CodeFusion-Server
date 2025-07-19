function errorHandler(err, req, res, next) {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(400).json({
      error: 'Duplicate Key Error',
      details: 'This value already exists in the database'
    });
  }

  if (err.response?.data) {
    return res.status(502).json({
      error: 'External Service Error',
      details: err.response.data
    });
  }

  res.status(500).json({
    error: 'Server Error',
    message: 'An unexpected error occurred'
  });
}

module.exports = errorHandler;
