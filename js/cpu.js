class Memory {
    constructor(size) {
        this.memory = new Uint8Array(size);
    }

    read(address) {
            return this.memory[address];
    }

    write(address, value) {
        this.memory[address] = value & 0xFF; // Keep it a byte
    }

    load(startAddress, program) {
        if (program.length > 208) return

        for (let i = 0; i < program.length; i++) {
            this.write(startAddress + i, program[i] & 0xFF)
        }
    }
}

class CPU {
    constructor() {
        this.ram = new Memory(0x100)
        this.reset()
    }

    clock() {
        if (!this.clockRunning) return
        this.do(this.ram.read(this.Counter))

        setTimeout(() => this.clock(), 50)
    }

    do(opcode) {
        const operations = [
            this.WAIT,
            this.SETX, this.LDX, this.LDXA, this.SETA, this.STA, this.STAX,
            this.ADD,
            this.AND, this.XOR, this.ASL, this.ASR,
            this.GO, this.RET, this.JEQ, this.JOV
        ];

        if (opcode < operations.length) {
            operations[opcode].call(this); // Use call to bind `this` correctly
        }

        this.updateDisplay()
        console.log(`opcode: ${this.ram.read(this.Counter)}, value ${this.ram.read(this.Counter+1)}, counter: ${this.Counter}, A: ${this.A}, X: ${this.X}`)
    }

    input(value) {
        if (this.Idle === false) return

        cpu.Idle = false
        cpu.A = value
        cpu.Counter++
    }

    loadTape() {
        this.tapeRunning = true
        const instructionBytes = document.getElementById('tape-instructions')
            .value
            .replace('/\n/g', ' ')
            .split(',')
            .map(line => parseInt(line, 16));

        let index = 0;
        const tapeInterval = setInterval(() => {
            if (index < instructionBytes.length) {
                this.input(instructionBytes[index++])
            } else {
                clearInterval(tapeInterval)
                this.reset()
            }
        }, 2000)
    }

    reset() {
        this.A = 0;
        this.X = 0;
        this.Counter = MAIN;              // start of the main sequence
        this.Stack = 0;

        this.Equal = false;
        this.Idle = false;
        this.Overflow = false;

        this.tapeRunning = false;
        this.ram.write(MEM_INDEX_ADDRESS, START_USER_MEMORY - 1)    // auto-set the memory index

        this.updateDisplay();
    }

    start() {
        this.clockRunning = true
        this.clock()
        this.updateDisplay()
    }

    stop() {
        this.clockRunning = false
        this.updateDisplay();
    }

    updateDisplay() {
        this.Equal = (this.A === this.X)
        this.Overflow = (this.A > 0xFF);

        updateFlag('overflow-flag', this.Overflow)
        updateFlag('idle-flag', this.Idle)
        updateFlag('clock-flag', this.clockRunning)
        updateFlag('tape-button', this.tapeRunning)

        this.A &= 0xFF

        updateDiodeDisplay('register-x', this.X)
        updateDiodeDisplay('register-a', this.A)
        updateDiodeDisplay('memory-index', this.ram.read(MEM_INDEX_ADDRESS))
    }

    // -- OPERATIONS
    // waits for new input
    WAIT() {
        if (this.Idle === true) return
        this.Idle = true
    }

    // Set X to value
    SETX() {
        this.Counter++
        this.X = this.ram.read(this.Counter++)
    }

    // LDX address
    LDX() {
        this.Counter++
        this.X = this.ram.read(this.ram.read(this.Counter++))
    }

    // LDX indexed by A
    LDXA() {
        this.X = this.ram.read(this.A)
        this.Counter++
    }

    // Set A to value
    SETA() {
        this.Counter++
        this.A = this.ram.read(this.Counter++)
        this.Equal = (this.A === 0)
    }

    // STA address
    STA() {
        this.Counter++
        this.ram.write(this.ram.read(this.Counter++), this.A);
    }

    // STA indexed by X
    STAX() {
        this.Counter++
        this.ram.write(this.X, this.A);
    }

    // ADD (A = A + X)
    ADD() {
        this.A += this.X
        this.Counter++
    }

    // AND (modifies A)
    AND() {
        this.A &= this.X
        this.Counter++
    }

    // XOR (modifies A)
    XOR() {
        this.A ^= this.X
        this.Counter++
    }

    // ASL (modifies A, moves it up a bit - so 1 becomes 10, and 11 becomes 110.)
    ASL() {
        this.A = (this.A << 1) & 0xFF
        this.Counter++
    }

    // ASL (modifies A, moves it up a bit - so 1 becomes 10, and 11 becomes 110.)
    ASR() {
        this.A = (this.A >> 1) & 0xFF
        this.Counter++
    }

    // GO
    GO() {
        this.Stack = this.Counter + 2
        this.Counter++              
        this.Counter = this.ram.read(this.Counter++)
    }

    // RET
    RET() {
        this.Counter = this.Stack
        this.Stack = 0;
    }

    // CONDITIONAL JUMP (if A and X are equal)
    JEQ() {
        this.Counter++
        if (this.Equal) {
            this.Stack = this.Counter + 1                   // saves the return point to stack
            this.Counter = this.ram.read(this.Counter++)    // jumps
            return
        }      
        this.Counter++       
    }

    // OVERFLOW JUMP (if A and X are equal)
    JOV() {
        this.Counter++
        if (this.Overflow) {
            this.Stack = this.Counter + 1                   // saves the return point to stack
            this.Counter = this.ram.read(this.Counter++)    // jumps
            return
        }      
        this.Counter++               // or moves on.           
    }
}