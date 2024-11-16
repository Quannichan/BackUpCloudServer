const fs = require('fs');
const path = require('path');
const BACKUP_DIR = path.join(__dirname, '../backup');
const BACKUP_FILE = path.join(BACKUP_DIR, 'backup.zip');

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

class backupCtrl {
    
    async ServiceBU(req, res){
        console.log("donwload backup from " + req.ip);
        if (!req.file) {
            console.log("lỗi file");
            return res.status(400).send('Không có file tải lên.');
          }
          console.log("Backup from " + req.ip);
          res.status(200).send(`File ${req.file.filename} đã được tải lên thành công.`);
    }

    async ServiceGBU(req, res){
        if (fs.existsSync(BACKUP_FILE)) {
            console.log("donwload backup from " + req.ip);
            res.download(BACKUP_FILE, 'backup.zip', (err) => {
            if (err) {
                console.error('Lỗi khi tải file:', err);
                res.status(500).send('Lỗi khi tải file.');
            }
            });
        } else {
            console.log("File không tồn tại");
            console.error('File sao lưu không tồn tại: ');
            res.status(404).send('File sao lưu không tồn tại.');
        }
    }

}

module.exports = backupCtrl;