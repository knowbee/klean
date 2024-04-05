const fs = require("fs")
const path = require("path")
const ora = require("ora")
const { cachesDirs } = require("../config/folders")


const cacheCheckerAsync = async (dir) => {
  try {
    let sum = 0;
    const traverseDirectory = async (dir) => {
      const files = await fs.promises.readdir(dir);

      await Promise.all(files.map(async (file) => {
        const filePath = path.join(dir, file);
        const stat = await fs.promises.stat(filePath);

        if (stat.isDirectory()) {
          await traverseDirectory(filePath);
        } else {
          if (stat.size > 0) {
            sum += stat.size;
          }
        }
      }));
    };

    await traverseDirectory(dir);

    return sum;
  } catch (error) {
    throw new Error(`Error checking cache directory: ${error.message}`);
  }
};

// Get total size of cached media asynchronously
const getTotalSizeAsync = async () => {
  let total = 0;
  try {
    for (const cacheDir of cachesDirs) {
      if (fs.existsSync(cacheDir.path)) {
        total += await cacheCheckerAsync(cacheDir.path);
      }
    }
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (total === 0) {
      return "OB";
    }
    const i = parseInt(Math.floor(Math.log(total) / Math.log(1024)));
    if (i === 0) return `${total} ${sizes[i]}`;
    console.log(total)
    return `${(total / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  } catch (error) {
    throw new Error(`Error getting total size: ${error.message}`);
  }
};

// Delete cached media from the system asynchronously
const deleteCacheAsync = async () => {
  try {
    for (const cacheDir of cachesDirs) {
      if (fs.existsSync(cacheDir.path)) {
        const files = await fs.promises.readdir(cacheDir.path);
        const spinner = ora(`Cleaning ${cacheDir.name} cache...`).start();
        await Promise.all(files.map(async (file) => {
          const filePath = path.join(cacheDir.path, file);
          if ((await fs.promises.lstat(filePath)).isDirectory()) {
            // Delete hidden folders inside cached dirs
            await fs.promises.rmdir(filePath, { recursive: true });
          } else {
            await fs.promises.unlink(filePath);
          }
        }));
        spinner.succeed(`Finished cleaning ${cacheDir.name} cache`);
      }
    }
    ora().succeed("Cleanup completed");
  } catch (error) {
    throw new Error(`An error occurred while cleaning the cache: ${error.message}`);
  }
};


module.exports = {
  getTotalSizeAsync,
  deleteCacheAsync,
};
