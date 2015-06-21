
"use strict";

fs = require('fs');

module.exports = Parser;

function Parser(filename) {
  this._data = fs.readFileSync(filename);
  this._cursor = 0;
  this._command = '';
  this._dest = '';
  this._comp = '';
  this._jump = '';
}

Parser.prototype.hasMoreCommands = function() {
  return this._cursor < this._data.length;
};

Parser.prototype.advance = function() {
  
  var line = this.readLine();
  var mnem;

  while (!line || this.isComment(line)) {
    line = this.readLine();
  }

  this._command = line.match(/([^/]*)(\/\/.*)?/)[1].trim();
  mnem = this._command.match(/([^=;]*)?=?([^;]*);?(.*)/);
  this._dest = mnem[1];
  this._comp = mnem[2];
  this._jump = mnem[3];

  if (!mnem[2]) {
    this._dest = '';
    this._comp = mnem[1];
  }
};

Parser.prototype.commandType = function() {

  switch (this._command[0]) {
    case '@':
      return 'A';
    case '(':
      return 'L';
    default:
      return 'C';
  }

};

Parser.prototype.symbol = function() {

  switch (this.commandType()) {
    case 'A':
      return this._command.match(/^@(.*)$/)[1];
    case 'L':
      return this._command.match(/^\((.*)\)$/)[1];
    default:
      return '';
  }
};

Parser.prototype.dest = function() {
  return this._dest;
};

Parser.prototype.comp = function() {
  return this._comp;
};

Parser.prototype.jump = function() {
  return this._jump;
};

Parser.prototype.readLine = function() {
  
  var start = this._cursor;
  var char = this._data.get(this._cursor);

  while (char && char !== 10 && char !== 13) {    
    try {
      char = this._data.get(++this._cursor); 
    }
    catch (RangeError) {
      char = null;
    }
  }

  while (char && char === 10 || char === 13) {
    try {
      char = this._data.get(++this._cursor); 
    }
    catch (RangeError) {
      char = null;
    }
  }

  return this._data.utf8Slice(start, this._cursor).trim();
};

Parser.prototype.isComment = function(line) { 
  return line && !!line.match(/^\/\/.*$/);
};

Parser.prototype.parse = function() {

  while (this.hasMoreCommands()) {
    this.advance();
    console.log('Command: ' + this._command);
    console.log('Command Type: '  + this.commandType());
    console.log('Symbol: ' + this.symbol());
    console.log('DEST: ' + this.dest());
    console.log('COMP: ' + this.comp());
    console.log('JUMP: ' + this.jump());
    console.log(' ');
  }
};