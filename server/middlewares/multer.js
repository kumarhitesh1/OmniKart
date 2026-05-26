const multer=require("multer");

const storage=multer.memoryStorage();
const uploadFiles=multer({storage}).array("files",10);

module.exports={uploadFiles};