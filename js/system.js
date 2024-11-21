// memory addresses:
const MEM_INDEX_ADDRESS = 0xFF

const START_USER_MEMORY = 0x0
const END_USER_MEMORY = 0xCF

// keys:
const TAPE_KEY = 84
const INSPECT_KEY = 73
const STEP_KEY = 77
const EXECUTE_KEY = 69

// procedures:
const START_SYSTEM_CODE = 0xD0
const LOOP_MEM_INDEX = START_SYSTEM_CODE

const WRITE_MEM = START_SYSTEM_CODE     + 12
const INSPECT_MEM = START_SYSTEM_CODE   + 12 + 8
const MAIN = START_SYSTEM_CODE          + 12 + 8 + 6

const system = [
    // LOOP_MEM_INDEX (12 bytes)
        0x2, MEM_INDEX_ADDRESS,         // Load the current memory index into X, and set A to the end of user memory. If they're equal, get out.
        0x4, END_USER_MEMORY,
        0xE, MAIN,

        0x4, 1,                         // Otherwise, increment the index and save it.
        0x7,
        0x5, MEM_INDEX_ADDRESS,

        0xD,

    // WRITE_MEM (8 bytes)
        0xC, LOOP_MEM_INDEX,            // Increment the index.
        0x0,                            // Wait for the interrupting value from the tape.

        0x2, MEM_INDEX_ADDRESS,         // Load the current memory address into X and store A (the interrupting value) there
        0x6,

        0xC, WRITE_MEM,                 // Loop back until the whole tape is loaded.

    // INSPECT_MEM (6 bytes)
        0x2, MEM_INDEX_ADDRESS,         // Load the current memory index into X, pass it to A.
        0x4, 0,
        0x7,

        0x3,                            // Load the value of that address into X. A holds the inspected address.

    // MAIN (23 bytes)
        0x0,                            // Wait for the interrupting value.

        0x1, TAPE_KEY,                  // Write from tape.
        0xE, WRITE_MEM + 2,             // In the first run, don't do the increment: so we can overwrite the currently indexed address, and thus correct mistakes.

        0x1, INSPECT_KEY,               // Inspect the current memory index.
        0xE, INSPECT_MEM,

        0x1, EXECUTE_KEY,               // Execute the instructions from 0x00.
        0xE, START_USER_MEMORY,

        0x1, STEP_KEY,                  // Move to the next memory address.
        0xE, LOOP_MEM_INDEX,

        0xC, MAIN
]