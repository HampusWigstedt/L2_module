import fs from 'fs'

export class Converter {

    readTextFile(file) {
        const text = fs.readFileSync(file, 'utf8')

        console.log(text)
        return text
    }

    writeMdFile(file, text) {
        fs.writeFileSync(file, text, 'utf8')
        console.log(`Content written to ${file}`)
    }
}