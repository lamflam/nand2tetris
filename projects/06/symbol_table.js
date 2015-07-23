
"use strict";

var util = require('util');
var Parser = require('./parser');

module.exports = SymbolTable;

var TABLE = {
  SP: 0, LCL: 1, ARG: 2, THIS: 3, THAT: 4, 
  R0: 0, R1: 1, R2: 2, R3: 3, R4: 4, R5: 5,
  R6: 6, R7: 7, R8: 8, R9: 9, R10: 10, R11: 11, 
  R12: 12, R13: 13, R14: 14, R15: 15,
  SCREEN: 16384, KBD: 24576
};

function SymbolTable(filename) {
  this.parser = new Parser(filename);
  this._table = util._extend({}, TABLE);
  this._mem = 16;
}

SymbolTable.prototype.build = function() {

  var parser = this.parser;
  var ins = 0;
  var sym;

  while (parser.hasMoreCommands()) {
    parser.advance();
    
    switch (parser.commandType()) {
      case 'L':
        sym = parser.symbol();
        this._put(sym, ins);
        break;
      default:
        ins++;
    }
  }
}

SymbolTable.prototype._put = function(symbol, addr) {
  this._table[symbol] = addr;
};

SymbolTable.prototype.get = function(symbol) {
  
  var addr;

  if (/^[a-zA-Z].*$/.test(symbol)) {
    addr = this._table[symbol];
    if (addr == undefined) {
      addr = this._mem;
      this._put(symbol, addr);
      this._mem++;
    }
  }
  else {
    addr = symbol;
  }
  
  return addr;
}