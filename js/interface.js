const cpu = new CPU()

// prepare the system

cpu.ram.load(START_SYSTEM_CODE, system)

// I/O and reset processing

document.addEventListener('keydown', (event) => {
    // if the user is typing, ignore it.
    if (document.activeElement === document.getElementById('tape-instructions')) {
        return
    }

    // start the computer
    if (event.key === 'Shift') {
        cpu.start()
        return
    }

    // reset
    if (event.key === 'Escape') {
        cpu.reset();
        return;
    }

    // stops the clock
    if (event.key === ' ' && !clockRunning) {
        cpu.step()
        return
    }
    
    // stops the clock
    if (event.key === '=') {
        cpu.stop()
        return
    }

    // steps the CPU (only if the clock is stopped)
    if (event.key === ' ' && !cpu.clockRunning) {
        cpu.do(cpu.ram.read(cpu.Counter))
        return
    }

    cpu.input(event.key.toUpperCase().charCodeAt(0))
    cpu.updateDisplay()
})

document.getElementById('tape-button').addEventListener('click', () => {
    if (cpu.tapeRunning) return
    
    cpu.loadTape()
    cpu.updateDisplay()
});

// Helper function to update a register display (convert binary to diodes)
function updateDiodeDisplay(registerId, value) {
    const diodes = document.querySelectorAll(`#${registerId} .diode`);
    const binaryString = value.toString(2).padStart(8, '0');

    for (let i = 0; i < 8; i++) {
        if (binaryString[i] === '1') {
            diodes[i].classList.add('on');
            diodes[i].classList.remove('off');
        } else {
            diodes[i].classList.add('off');
            diodes[i].classList.remove('on');
        }
    }
}

// Helper function to update a flag diode (turn on or off)
function updateFlag(flagId, state) {
    const flag = document.getElementById(flagId);
    if (state) {
        flag.classList.add('on');
        flag.classList.remove('off');
    } else {
        flag.classList.add('off');
        flag.classList.remove('on');
    }
}