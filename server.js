import express from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import ViteExpress from "vite-express"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const DATA_FILE = path.join(__dirname, "data.json")

let appdata = []
try {
    if (fs.existsSync(DATA_FILE)) {
        appdata = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"))
    }
} catch (err) {
    console.error("Error loading data file:", err)
    appdata = []
}

function saveData() {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(appdata, null, 2))
    } catch (err) {
        console.error("Error saving data file:", err)
    }
}

function makeSlug(vinyl, artist) {
    return `${vinyl.toLowerCase().replace(/\s+/g, "-")}-${artist.toLowerCase().replace(/\s+/g, "-")}`
}

app.use(express.json())


app.get("/results", (req, res) => {
    res.status(200).json(appdata)
})

app.post("/submit", (req, res) => {
    const newVinyl = req.body
    const slug = makeSlug(newVinyl.vinyl, newVinyl.artist)

    if (appdata.find(v => v.slug === slug)) {
        return res.status(400).json({ error: "This vinyl already exists" })
    }

    const record = {
        vinyl: newVinyl.vinyl,
        artist: newVinyl.artist,
        owned: Boolean(newVinyl.owned),
        link: newVinyl.owned ? "" : (newVinyl.link || ""),
        slug,
        dateAdded: new Date().toISOString()
    }

    appdata.push(record)
    saveData()
    res.status(200).json(appdata)
})

app.post("/update", (req, res) => {
    const updated = req.body
    const index = appdata.findIndex(v => v.slug === updated.slug)

    if (index !== -1) {
        appdata[index].vinyl = updated.vinyl
        appdata[index].artist = updated.artist
        appdata[index].owned = updated.owned
        appdata[index].link = updated.owned ? "" : updated.link
        appdata[index].slug = makeSlug(updated.vinyl, updated.artist)
        saveData()
    }

    res.status(200).json(appdata)
})

app.post("/delete", (req, res) => {
    const { slug } = req.body
    appdata = appdata.filter(v => v.slug !== slug)
    saveData()
    res.status(200).json(appdata)
})

ViteExpress.listen(app, 3000, () => console.log("Server running on http://localhost:3000"))
