const sharp = require('sharp');
const path = require('path');
const shortId = require('shortId')
class ResizeMain {
  constructor(folder) {
    this.folder = folder;
  }
  async save(buffer) {
    const filename = ResizeMain.filename();
    const filepath = this.filepath(filename);

    await sharp(buffer)
      .resize(536, 639, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile(filepath);
    
    return filename;
  }
  static filename() {
    return `${shortId.generate()}.png`;
  }
  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`)
  }
}
module.exports = ResizeMain;