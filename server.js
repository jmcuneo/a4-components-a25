import express from "express";
import ViteExpress from "vite-express";

const app = express();

app.use(express.json());

let vinyls = [
    { vinyl: "Test Album", artist: "Test Artist", owned: false, link: "", slug: "test-album-test-artist" }
];

function makeSlug(vinyl, artist) {
    return `${vinyl.toLowerCase().replace(/\s+/g, "-")}-${artist.toLowerCase().replace(/\s+/g, "-")}`;
}

app.get("/read", (req, res) => {
    res.json(vinyls);
});

app.post("/add", (req, res) => {
    const newVinyl = req.body;
    const slug = makeSlug(newVinyl.vinyl, newVinyl.artist);

    if (vinyls.find((v) => v.slug === slug)) {
        res.status(400).json({ error: "This vinyl already exists" });
        return;
    }

    const record = {
        vinyl: newVinyl.vinyl,
        artist: newVinyl.artist,
        owned: Boolean(newVinyl.owned),
        link: newVinyl.owned ? "" : (newVinyl.link || ""),
        slug,
        dateAdded: new Date().toISOString(),
    };

    vinyls.push(record);
    res.json(vinyls);
});

app.post("/update", (req, res) => {
    const updated = req.body;
    const index = vinyls.findIndex((v) => v.slug === updated.slug);

    if (index !== -1) {
        vinyls[index].vinyl = updated.vinyl;
        vinyls[index].artist = updated.artist;
        vinyls[index].owned = updated.owned;
        vinyls[index].link = updated.owned ? "" : updated.link;
        vinyls[index].slug = makeSlug(updated.vinyl, updated.artist);
    }

    res.json(vinyls);
});

app.post("/delete", (req, res) => {
    const { slug } = req.body;
    vinyls = vinyls.filter((v) => v.slug !== slug);
    res.json(vinyls);
});

ViteExpress.listen(app, process.env.PORT || 3000, () =>
    console.log("Server running on http://localhost:3000")
);
