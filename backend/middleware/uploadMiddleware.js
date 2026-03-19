const multer = require('multer');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg and .png formats are allowed'), false);
  }
};

// [SECURITY] Add file size limit to prevent denial-of-service via large uploads
// [IMPROVE] Sanitize file.originalname to prevent path traversal (e.g. strip ../ and special chars)
const upload = multer({ storage, fileFilter /* , limits: { fileSize: 5 * 1024 * 1024 } */ });

module.exports = upload;
