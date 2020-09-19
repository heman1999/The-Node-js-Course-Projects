const chalk = require("chalk")
const fs = require("fs")
const {
    title
} = require("process")

const getNotes = function () {
    try {
        const dataBuffer = fs.readFileSync("notes.json")
        return JSON.parse(dataBuffer.toString())
    } catch (e) {
        return []
    }

}

const addNote = function (title, body) {
    const notes = getNotes()
    const duplicate = notes.find(function (note) {
        return title === note.title
    })
    debugger

    if (!duplicate) {
        notes.push({
            title,
            body
        })
        console.log(chalk.green.inverse("Note added!"))
    } else {
        console.log(chalk.red.inverse("Title already taken"))
    }
    saveNotes(notes)
}

const removeNote = function (title) {
    const notes = getNotes()
    const notesToKeep = notes.filter(function (note) {
        return title !== note.title
    })

    if (notes.length > notesToKeep.length) {
        saveNotes(notesToKeep)
        console.log(chalk.green.inverse("Note removed!"))
    } else {
        console.log(chalk.red.inverse("Note not found!"))
    }
}

const listNotes = () => {
    const notes = getNotes()
    const arr = notes.map((note, i) => (i + 1) + '.' + note.title)
    console.log(chalk.inverse("Your Notes:"))
    arr.length > 0 ? arr.forEach(element => console.log(element)) : console.log("No notes exist")
}

const readNote = (title) => {
    const notes = getNotes()
    const note = notes.find((note) => note.title === title)

    debugger
    if (note) {
        console.log(chalk.inverse(note.title))
        console.log(note.body)
    } else {
        console.log(chalk.red.inverse("Note not found!"))
    }
}

const saveNotes = function (notes) {
    notes = JSON.stringify(notes)
    fs.writeFileSync("notes.json", notes)
}

module.exports = {
    addNote,
    removeNote,
    listNotes,
    readNote
}