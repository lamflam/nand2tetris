
"use strict";

var Parser = require('./parser');
var Code   = require('./code');
var SymbolTable = require('./symbol_table');

module.exports = Assembler;

function Assembler(filename) {
  this.basename = filename.match(/([^\/]*).asm$/)[1];
  this.dirname = filename.slice(0, filename.indexOf(this.basename));
  this.parser = new Parser(filename);
  this.symbolTable = new SymbolTable(filename);
}


Assembler.prototype.assemble = function() {

  var sym;
  var parser = this.parser;
  var table = this.symbolTable;
  table.build();

  while (parser.hasMoreCommands()) {
    parser.advance();
    
    switch (parser.commandType()) {
      case 'A':
        sym = parser.symbol();
        this.write('0' + Code.address(table.get(sym)));
        this.write('\r\n');
        break;
      case 'C':
        this.write('111');
        this.write(Code.comp(parser.comp()));
        this.write(Code.dest(parser.dest()));
        this.write(Code.jump(parser.jump()));
        this.write('\r\n');
    }
  }
  this.close();
};

Assembler.prototype.filename = function() {
  return this.dirname + this.basename + '.hack';
};

Assembler.prototype.write = function(text) {
  if (!this.stream) {
    this.stream = fs.createWriteStream(this.filename());
  }
  this.stream.write(text);
};

Assembler.prototype.close = function() {
  this.stream.end();
};