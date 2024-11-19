# Yhyno 2E: a silly 8-bit computer emulator

This is a tiny, minimalist 8-bit computer emulator I created for fun.
The computer runs in your browser, has 208 bytes of user memory, and uses a fake tape reader as the main input. For output, it uses a simple control panel.

The input is interrupt-based: the computer will show "idle" when it's ready to accept input. Then, the input will overwrite the A register.

## Memory Map
- `0x00 - 0x2E`: System memory  
- `0x2F`: Memory loop index  
- `0x30 - 0xFF`: User memory (208 bytes)

## Architecture
The computer has two registers:
- **X**: a general-purpose register, used to load from memory
- **A**: an accumulator, used to save data to memory; holds results of arithmetic operations

There are also:
- **Flags**: Overflow, Equality (`A = X`)
- One-element stack for managing subroutine calls

## Instruction Set
When writing your own instructions, you will need to use hex values. The following table contains the entire list of available instructions:

| Opcode | Mnemonic       | Description                     |
|--------|----------------|---------------------------------|
| `0x0`  | `WAIT`         | Wait for interrupt              |
| `0x1`  | `SETX val`     | Set X to immediate value        |
| `0x2`  | `LDX addr`     | Load address into X             |
| `0x3`  | `LDXA`         | Load from address in A into X   |
| `0x4`  | `SETA val`     | Set A to immediate value        |
| `0x5`  | `STA addr`     | Store A in address              |
| `0x6`  | `STAX`         | Store A in address in X         |
| `0x7`  | `ADD`          | A = A + X                    |
| `0x8`  | `AND`          | Bitwise AND                     |
| `0x9`  | `XOR`          | Bitwise XOR                     |
| `0xA`  | `ASL`          | Shift A left                    |
| `0xB`  | `ASR`          | Shift A right                   |
| `0xC`  | `GO addr`      | Jump to address (save return)   |
| `0xD`  | `RET`          | Return from jump                |
| `0xE`  | `JEQ addr`     | Jump if X = A (save return)     |
| `0xF`  | `JOV addr`     | Jump if A overflows (save return)            |

## Additional information
Remember to read the short instructions under the computer!