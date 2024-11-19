// memory addresses:
const MEM_INDEX_ADDRESS = 0x2F

const START_USER_MEMORY = 0x30
const END_USER_MEMORY = 0xFF

// keys:
const TAPE_KEY = 84
const INSPECT_KEY = 73
const SETUP_KEY = 83
const EXECUTE_KEY = 69

// procedures:
const SETUP_MEM_INDEX = 0x00
const LOOP_MEM_INDEX = 0x05

const WRITE_MEM = 0x11
const INSPECT_MEM = 0x19
const MAIN = 0x1C

const system = [
    // SETUP_MEM_INDEX
        0x4, START_USER_MEMORY - 1,
        0x5, MEM_INDEX_ADDRESS,
        0xD,

    // LOOP_MEM_INDEX
        0x2, MEM_INDEX_ADDRESS,
        0x4, END_USER_MEMORY,
        0xE, MAIN,

        0x4, 1,
        0x7,
        0x5, MEM_INDEX_ADDRESS,

        0xD,

    // WRITE_MEM
        0xC, LOOP_MEM_INDEX,
        0x0,

        0x2, MEM_INDEX_ADDRESS,
        0x6,

        0xC, WRITE_MEM,

    // INSPECT_MEM
        0xC, LOOP_MEM_INDEX,
        0x3,

    // MAIN
        0x0,

        0x1, TAPE_KEY,
        0xE, WRITE_MEM,

        0x1, INSPECT_KEY,
        0xE, INSPECT_MEM,

        0x1, SETUP_KEY,
        0xE, SETUP_MEM_INDEX,

        0x1, EXECUTE_KEY,
        0xE, START_USER_MEMORY,

        0xC, MAIN
]