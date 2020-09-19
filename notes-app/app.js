const chalk = require("chalk");
const notes = require("./notes");
const note = require("./notes")

const argv = process.argv
const command = argv[2]

if (command === 'add') {
    if (/--title=/.test(argv[3]) && /--body=/.test(argv[4])) {
        const title = argv[3].split("=")[1]
        const body = argv[4].split("=")[1]

        note.addNote(title, body)
    } else {
        console.log(chalk.red.inverse("Title and body are required fields!"))
    }
} else if (command === 'remove') {
    if (/--title=/.test(argv[3])) {
        const title = argv[3].split("=")[1]

        notes.removeNote(title)
    } else {
        console.log(chalk.red.inverse("Title is required fields!"))
    }
} else if (command === 'list') {
    notes.listNotes()
} else if (command === 'read') {
    if (/--title=/.test(argv[3])) {
        const title = argv[3].split("=")[1]

        notes.readNote(title)
    } else {
        console.log(chalk.red.inverse("Title is required fields!"))
    }
} else {
    console.log(chalk.red.inverse("Wrong command!"))
}