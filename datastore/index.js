const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter.js');

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
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(new Error(`Error accessing ${datDir}`));
    } else {
      files.forEach( file => {
        id = file.split('.')[0];
        todo = {
          id: id,
          text: id
        };
        todos.push(todo);
      });
      callback(null, todos);
    }
  });

};

exports.readOne = (id, callback) => {
  file = path.join(exports.dataDir, id, '.txt');
  fs.readFile(file, (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
