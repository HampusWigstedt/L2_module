
import fs from 'fs';

export class Converter {

    readTextFile(file) {
        const text = fs.readFileSync(file, 'utf8');

        console.log(text);
        return text
    }

    writeMdFile(file, text) {

    }
}

const converter = new Converter();
const filePath = './test.txt';
converter.readTextFile(filePath);