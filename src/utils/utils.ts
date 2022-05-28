import { getRepository } from "typeorm";
import XLSX from "xlsx";
import fs from "fs";
import path from "path";


const writeFile = (headers, data, name) => {
  let ws = XLSX.utils.json_to_sheet(data, { header: headers });
  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
  let exportFileName = `files/${name}.xls`;
  XLSX.writeFile(wb, exportFileName);
};

const deleteFile = (path) => {
  fs.unlink(path, function (err) {
    if (err) throw err;
  });
};

const deleteAllFileOfFolder = async (directory) => {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
};

export {
  writeFile,
  deleteAllFileOfFolder,
  deleteFile
};
