var express = require('express');
var { getDatabase } = require('../db');

var router = express.Router();

function fetchMileageData(username) {
    const db = getDatabase();
    return db.collection('mileage').find({ username }).toArray();
}

/* GET user information */
router.get('/api/user', function(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json(req.user);
});

/* POST mileage data */
router.post('/api/mileage', async function(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const mileageData = req.body;
    if (!Array.isArray(mileageData)) {
        return res.status(400).json({ error: 'Invalid data format, expected an array' });
    }
    try {
        const db = getDatabase();
        const username = req.user.username;
        
        // First, delete all existing records for this user
        await db.collection('mileage').deleteMany({ username: username });
        
        // Then insert the updated data
        if (mileageData.length > 0) {
            const dataToInsert = mileageData.map(entry => {
                const { _id, ...cleanEntry } = entry;
                return {
                    ...cleanEntry,
                    username: username
                };
            });
            await db.collection('mileage').insertMany(dataToInsert);
        }
        
        res.status(200).json({ message: 'Mileage data updated successfully' });
    } catch (error) {
        console.error('Error storing mileage data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/* GET user mileage data */
router.get('/api/mileage', async function(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const mileageData = await fetchMileageData(req.user.username);
        res.status(200).json(mileageData);
    } catch (error) {
        console.error('Error fetching mileage data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

/* GET user info */
router.get('/api/user', function(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(200).json({
        id: req.user.id,
        username: req.user.username,
        displayName: req.user.displayName
    });
});

/* POST logout */
router.post('/api/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

module.exports = router;

