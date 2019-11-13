const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter.js');
const Promise = require('bluebird');
const readdir = Promise.promisify(fs.readdir);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = counter.getNextUniqueId( (err, id) => {
    dataFile = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(dataFile, text, (err) => {
      items[id] = text;
      callback(null, { id, text });
    });
  });
};
exports.readAll = (callback) => {
  let todos = [];
  let todo;
  return readdir(exports.dataDir)
    .then( (files) => {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fp = path.join(exports.dataDir, file);
        files[i] = new Promise( (resolve, reject) => {
          fs.readFile(fp, (err, text) => {
            if (err) {
              reject(err);
            } else {
              id = file.split('.')[0];
              resolve({ id, text: text.toString()});
            }
          });
        });
      }
      Promise.all(files)
        .then((files) => {
          callback(null, files);
        });
    })
    .catch((err) => callback(err));
};
// => {
//   return
//     files.forEach((file) =>{
//       if (err) {
//         reject(err);
//       } else {
//         resolve(file);
//       }
//     })
//   );
// })
// exports.readAll = (callback) => {
//   let todos = [];
//   let todo;
//   fs.readdir(exports.dataDir, (err, files) => {
//     if (err) {
//       callback(new Error(`Error accessing ${datDir}`));
//     } else if (files.length) {
//       files.forEach( (file, index) => {
//         id = file.split('.')[0];
//         exports.readOne(id, (err, todo) => {
//           if (err) {
//             console.log(`${file} has been moved or deleted.`);
//           } else {
//             todos.push(todo);
//             if (index === files.length - 1) {
//               callback(null, todos);
//             }
//           }
//         });
//       });
//     } else {
//       callback(null, []);
//     }
//   });
// };

exports.readOne = (id, callback) => {
  file = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(file, (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: text.toString() });
    }
  });
};

// writefile w/ r+ flag to ensure file exists
exports.update = (id, text, callback) => {
  file = path.join(exports.dataDir, `${id}.txt`);
  fs.truncate(file, 0, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(file, text, {flag: 'r+'}, (err) => {
        callback(null, { id: id, text: text});
      });
    }
  });
};

exports.delete = (id, callback) => {
  file = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(file, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
