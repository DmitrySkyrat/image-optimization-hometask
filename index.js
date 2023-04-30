const http = require("http");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const compress_images = require('compress-images');
const imgSizes = require("./formats");

fs.readdir(
  path.resolve(__dirname, "images"),
  { encoding: "utf-8" },
  (error, images) => {
    images.forEach((img) => {
      const imagePath = path.join(__dirname, `images/${img}`);
      imgSizes.forEach((size) => {
        const outputJPEG = path.join(__dirname, `assets/jpeg/${img.split(".")[0]}-${size}.jpeg`);
        const outputWEBPS = path.join(__dirname, `assets/webps/${img.split(".")[0]}-${size}.webp`);

        sharp(imagePath)
          .resize(size)
          .toFile(
            outputJPEG,
            (err, info) => {
              if (err) {
                console.log(err, info);
              }
            }
          )
          .toFormat("webp")
          .toFile(
            outputWEBPS,
            (err, info) => {
              if (err) {
                console.log(err, info);
              } else {
                compress_images(
                  "assets/jpeg/**/*.{jpg,JPG,jpeg,JPEG}",
                  "assets/compressed/",
                  { compress_force: false, statistic: true, autoupdate: true },
                  false,
                  { jpg: { engine: 'mozjpeg', command: ['-quality', '80'] }},
                  { png: { engine: false, command: false } },
                  { svg: { engine: false, command: false } },
                  { gif: { engine: false, command: false } },
                  (error, completed) => {
                    console.log(error, completed);
                  }
                );
              }
            }
          );
      });
    });
  }
);

http
  .createServer((req, res) => {
    fs.readFile("index.html", "utf-8", (error, data) => {
      res.end(data);
    });
  })
  .listen(2880);
