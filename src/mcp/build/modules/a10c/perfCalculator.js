export class PerfCalculator {
    name;
    correctionTable;
    constructor(name, correctionTable) {
        this.name = name;
        this.correctionTable = correctionTable;
    }
    getName() {
        return this.name;
    }
}
