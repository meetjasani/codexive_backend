
export const uploadImage = async (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!file) {
        reject("No image file");
      }
      var filePath = file.path.replace("\\", "/");
      const url = filePath;
      resolve(url);
    } catch (error) {
      reject(error);
    }
  });
};

