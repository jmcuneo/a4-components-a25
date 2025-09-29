import express from 'express';
export const router = express.Router();

router.get("/user", (req, res) => {
    res.status(200).json(req.user)
});