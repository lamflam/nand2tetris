// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input. 
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel. When no key is pressed, the
// program clears the screen, i.e. writes "white" in every pixel.

@SCREEN
D=A
@8192
D=D+A
@end
M=D
@RESET
0;JMP

(GETINPUT)
	@24576
	D=M
	@WHITE
	D;JEQ
	@BLACK
	0;JMP

(WHITE)
	@color
	M=0
	@LOOP
	0;JMP

(BLACK)
	@color
	M=-1
	@LOOP
	0;JMP

(LOOP)
	@color
	D=M
	@pixel
	A=M
	M=D
	D=A+1
	@pixel
	M=D
  @end
  D=D-M
  @RESET
  D;JEQ
	@LOOP
	0;JMP

(RESET)
	@SCREEN
	D=A
	@pixel
	M=D
	@GETINPUT
	0;JMP