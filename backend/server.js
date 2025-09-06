const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Storage directories
const IMAGES_DIR = path.join(__dirname, 'images');
const MEMBERS_DIR = path.join(__dirname, 'members');
const DATA_DIR = path.join(__dirname, 'data');

// Ensure directories exist
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
if (!fs.existsSync(MEMBERS_DIR)) fs.mkdirSync(MEMBERS_DIR, { recursive: true });
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.url === '/upload-image') {
      cb(null, IMAGES_DIR);
    } else if (req.url === '/upload-member') {
      cb(null, MEMBERS_DIR);
    } else {
      cb(null, DATA_DIR);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

// Data files
const imagesDataFile = path.join(DATA_DIR, 'images.json');
const membersDataFile = path.join(DATA_DIR, 'members.json');

// Helper to read JSON data
function readData(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

// Helper to write JSON data
function writeData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Serve static files
app.use('/images', express.static(IMAGES_DIR));
app.use('/members', express.static(MEMBERS_DIR));

// Upload image endpoint
app.post('/upload-image', upload.single('imageFile'), (req, res) => {
  try {
    const { name, date, time, location, description, photographer } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    const images = readData(imagesDataFile);
    const newImage = {
      id: Date.now(),
      filename: req.file.filename,
      url: `/images/${req.file.filename}`,
      name,
      date,
      time,
      location,
      description,
      photographer
    };
    images.push(newImage);
    writeData(imagesDataFile, images);
    res.json(newImage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Upload member endpoint
const memberUpload = upload.single('profileFile');
app.post('/upload-member', (req, res) => {
  memberUpload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to upload profile picture' });
    }
    try {
      const { name, phone, email, description } = req.body;
      if (!req.file) {
        return res.status(400).json({ error: 'Profile picture is required' });
      }
      const members = readData(membersDataFile);
      const newMember = {
        id: Date.now(),
        filename: req.file.filename,
        profileUrl: `/members/${req.file.filename}`,
        name,
        phone,
        email,
        description
      };
      members.push(newMember);
      writeData(membersDataFile, members);
      res.json(newMember);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save member data' });
    }
  });
});

// Get images metadata
app.get('/images', (req, res) => {
  const images = readData(imagesDataFile);
  res.json(images);
});

// Get members metadata
app.get('/members', (req, res) => {
  const members = readData(membersDataFile);
  res.json(members);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
