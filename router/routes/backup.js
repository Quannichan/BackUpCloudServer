const express = require("express")
const Router = express.Router()
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const BUctrl = require("../../controller/backupCtrl")

const BACKUP_DIR = path.join(__dirname, '../../backup');

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, BACKUP_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, 'backup.zip'); // Ghi đè file cũ
  },
});
const upload = multer({ storage: storage });

Router.post('/upload', upload.single('file'), new BUctrl().ServiceBU);

Router.get('/download', new BUctrl().ServiceGBU);

// app.delete('/delete-backup', (req, res) => {
//   if (fs.existsSync(BACKUP_FILE)) {
//     fs.unlinkSync(BACKUP_FILE);
//     res.send('Đã xóa file sao lưu trên server.');
//   } else {
//     res.status(404).send('File sao lưu không tồn tại.');
//   }
// });

module.exports = Router