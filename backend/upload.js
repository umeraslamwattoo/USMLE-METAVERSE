  const multer = require('multer'); 
  const fs = require('fs');

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let uploadDir = 'uploads/';
      if (file.mimetype.startsWith('video/')) {
        uploadDir += 'videos/';
      } else if (file.mimetype.startsWith('image/')) {
        uploadDir += 'images/';
      }
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only videos and images are allowed!'), false);
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024 * 1024 // 5GB
    }
  });

  module.exports = upload;
