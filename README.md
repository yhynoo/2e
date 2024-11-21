# Yhyno 2E: a silly 8-bit computer emulator

This is a tiny, minimalist 8-bit computer emulator I created for fun.
The computer runs in your browser, has 208 bytes of user memory, and uses a fake tape reader as the main input. For output, it uses a simple control panel.

The input is interrupt-based: the computer will show "idle" when it's ready to accept input. Then, the input will overwrite the A register.

## Memory Map
- `0x00 - 0xCF`: User memory (208 bytes)
- `0xD0 - 0xFE`: System code
- `0xFF`: Memory index

## Architecture
The computer has two registers:
- **X**: a general-purpose register, used to load from memory
- **A**: an arithmetic register (holds the results of operations), also used to save data to memory

There are also:
- **Flags**: Overflow, Equality (`A = X`)
- One-element stack for managing subroutine calls

## Output
The output panel consists of three rows of 8 diodes each. They display the values of the X and A registers, as well as the current memory index, in binary. 

The middle panel contains an overflow diode (A > 255), the "Idle" diode, showing whether the computer is waiting for input, and the "On" diode, showing the status of the clock.

## Instruction Set
When writing your own instructions, you will need to use hex values. The following table contains the entire list of available instructions:

| Opcode | Mnemonic       | Description                     |
|--------|----------------|---------------------------------|
| `0`  | `WAIT`         | Wait for interrupt              |
| `1`  | `SETX val`     | Set X to immediate value        |
| `2`  | `LDX addr`     | Load from address into X             |
| `3`  | `LDXA`         | Load into X from address indexed by A   |
| `4`  | `SETA val`     | Set A to immediate value        |
| `5`  | `STA addr`     | Store A in address              |
| `6`  | `STAX`         | Store A in address indexed by X         |
| `7`  | `ADD`          | A = A + X                    |
| `8`  | `AND`          | Bitwise AND (result in A)                    |
| `9`  | `XOR`          | Bitwise XOR (result in A)                   |
| `A`  | `ASL`          | Shift A left                    |
| `B`  | `ASR`          | Shift A right                   |
| `C`  | `GO addr`      | Jump to address (save return)   |
| `D`  | `RET`          | Return from jump                |
| `E`  | `JEQ addr`     | Jump if X = A (save return)     |
| `F`  | `JOV addr`     | Jump if A overflows (save return)            |

## Use
### Loading and running instructions
To load from tape, press `T`, and then press "Load Tape". Then wait until the tape finishes loading (the diode switches off). The instructions will be written starting from the currently indexed address, so you can later use this fact to correct mistakes in your code.
To execute loaded instructions starting from address 0x00, press `E`.

### Editing code
To inspect user memory, press `I`. The A register will show the currently inspected address, and X will show the value. If you want to overwrite the value, you can write it on tape and load it, so it overwrites the current one. To move to the next address, press `M`. The X register will show the previous address, and A - the current one.

The "home" address of the system (so, where it is waiting for the user's input) is `0xEA`. When writing programs, it is good to end them with a jump to that address: `0C, EA`.
