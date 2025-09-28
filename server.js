// ES module imports
import ViteExpress from 'vite-express';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'my-react-app/dist')));
app.use(express.json());
dotenv.config();
const PORT = 3000;


const logger = (req, res, next) => {
    console.log(req.method, req.url, req.body);
    next();
};
app.use(logger);

app.use(cookieSession({
    name: 'session',
    keys: ['randomKey1', 'randomKey2'],
    maxAge: 60 * 60 * 1000
}));


function check_login (req, res, next) {
    if (!req.session.userId) { // user not logged in
        console.log(req.session.userId+ ' is not logged in');
        return res.status(401).send('Not logged in');
    } else {
        console.log(req.session.userId+ ' is logged in');
    }
    next();
}


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'my-react-app/index.html'));
});

app.get('/login_status', (req, res) => {
    console.log("got request from user whether they are already logged in!")
    if (req.session.userId) {
        console.log("they are logged in!")
        return res.json({can_login: true, user: req.session.username});
    } else {
        console.log("they are not logged in!")
        return res.json({can_login: false});
    }
});

app.get("/user_info", check_login,  (req, res) => {
    if (req.session && req.session.userId) {
        return res.json({can_login: true, user: req.session.username});
    } else {
        return res.json({can_login: false});
    }
});

// mongoose setup
const uri = "mongodb+srv://"
    + process.env.MONGO_USER
    + ":"
    + process.env.MONGO_PASS
    + "@"
    + process.env.MONGO_HOST
    + "/"
    + process.env.MONGO_OPTIONS;


// copy-pasted directly from mongoDB's example for using mongoose w/ mongodb.
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
}
run().catch(console.dir);


//SCHEMAS
const User_schema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    password: {type: String, required: true},
});
const User = mongoose.model('User', User_schema);

const Homework_schema = new mongoose.Schema({
    ID: {type: Number, required: true},
    subject:{type: String, required: true},
    expectedtime: {type: Number, required: true},
    date: {type: Date, required: true},
    stress_score: {type: Number},
    // provided by mongodb's internal system "_id"
    user_id_owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

// help enforce that users can only have 1 homework with an ID (e.g #1) in their set
Homework_schema.index({ID: 1, user_id_owner: 1}, {unique: true});

const Homework = mongoose.model('Homework', Homework_schema);
// SCHEMAS


app.post('/login_user', async function (req, res) {


    let name = req.body.name;
    //console.log(req.body.name);
    let password = req.body.password;
    //console.log(req.body.password);

    if (!name) {
        console.log("Please enter a name");
        //return res.render('login',{error: "Please enter a name"});
        return res.json( {error: "Please enter a name",  can_login: false})

    } else if (!password) {
        console.log("Please enter a password");
        return res.json( {error: "Please enter a password",  can_login: false})
    }

    const user_login = await User.findOne(
        {name : name}
    );

    if (!user_login) {
        console.log("Username does not exist");
        return res.json( {error: "username doesn't exist",  can_login: false})
    }

    if (user_login.password !== password) {
        console.log("Passwords don't match");
        return res.json( {error: "password incorrect",  can_login: false})
    } else {

        req.session.userId = user_login._id;
        req.session.username = user_login.name;
        console.log("User: " + user_login.name + "has logged in!");

        return res.json( {error: "",  can_login: true})
    }

})

app.post('/register_user', async function (req, res) {

    let name = req.body.name;
    let password = req.body.password;

    if (!name) {
        console.log("Please enter a name");
        return res.json( {error: "Please enter a name",  can_login: false})
    } else if (!password) {
        console.log("Please enter a password");
        return res.json( {error: "Please enter a password",  can_login: false})
    }

    let exists = await User.findOne({name : name});

    if (exists !== null) {
        console.log("Username already taken");
        return res.json( {error: "Username already taken",  can_login: false})
    }

    const new_user = new User({name, password});

    //await User.insertOne(new_user);
    await new_user.save();

    req.session.userId = new_user._id;
    req.session.username = new_user.name;

    console.log("user registered!: ", new_user);

    return res.json( {error: "",  can_login: true})

})




app.post('/logout',check_login, function(req, res) {
    req.session = null;
    return res.json({logged_out: true});
});

// DATABASE MANAGEMENT //
// functions for user to send requests to the server for actions regarding data.
async function auto_update_table(req, res) {

    let user_id = req.session.userId;

    const all_of_the_homework = await Homework.find(
        {user_id_owner: user_id}
    );

    res.json(all_of_the_homework);
    console.log("Table sent: " + all_of_the_homework);
    console.log("\n\n\n")

}

// get the server's data
app.get('/data', check_login, function (req, res) {
    auto_update_table(req, res);
})


// handle update/add
app.post('/submit', check_login, async function (req, res) {

    let submitted_data = req.body;

    let user_id = req.session.userId;

    let result = await handle_new_data(submitted_data, user_id);

    if (result) {
        return res.json({operation_worked: true});
    } else {
        return res.json({operation_worked: false});
    }

})


//handle delete.
app.post('/delete', check_login, async function (req, res) {

    let submitted_data = req.body;

    let user_id = req.session.userId;

    let deleted = await delete_data(submitted_data, user_id);

    if (deleted) {
        return res.json({operation_worked: true});
    } else {
        return res.json({operation_worked: false});
    }

})



// check if theres an error with given data.
function error_with_new_data (dataJSON) {
    return !dataJSON || !dataJSON.ID || !dataJSON.date || !dataJSON.expectedtime;
}

function error_with_deletion (dataJSON) {
    return !dataJSON.ID;
}


async function add_homework(hw, user_id) {

    try {

        let stress_score = compute_stress_score(hw.date, hw.expectedtime);

        const newHomework = new Homework({
            ID: hw.ID,
            subject: hw.subject,
            expectedtime: hw.expectedtime,
            date: hw.date,
            stress_score: stress_score,
            user_id_owner: user_id
        });

        await newHomework.save();

        console.log("New homework saved: ", hw.ID);

        return true;

    } catch (err) {
        console.log(err);
        console.log("New homework not saved: ", hw.ID);
        return false;
    }

}

async function update_homework(hw, user_id) {

    try {

        const does_exist = await Homework.findOne(
            {ID: hw.ID, user_id_owner: user_id} // use keypair of user-id and hw-id to find exact item.
        );

        if (!does_exist) {
            console.log("cannot update non-existing homework")
            return false;
        }

        let different_date = false;
        let different_expectedtime = false;

        if (hw.subject !== null) {
            does_exist.subject = hw.subject;
        }

        if (hw.expectedtime != null) {
            does_exist.expectedtime = hw.expectedtime;
            different_expectedtime = true;
        }

        if (hw.date !== null) {
            does_exist.date = hw.date;
            different_date = true;
        }

        if (different_expectedtime || different_date) {
            does_exist.stress_score = compute_stress_score(hw.date, hw.expectedtime);
        }

        await does_exist.save();
        console.log(`Updated homework ID ${hw.ID}`);

        return true;
    } catch (err) {

        console.log(err);
        console.log("homework not updated: ", hw.ID);

        return false;
    }


}

async function delete_data(JSONObject, user_id) {

    if (error_with_deletion(JSONObject)) {
        console.log("failed to delete!")
        return false;
    }

    const HW_ID = JSONObject.ID;

    const existing = await Homework.findOne(
        {ID: HW_ID, user_id_owner: user_id}
    );

    if (!existing) {
        console.log("No existing homework found");
        return false
    } else {
        await Homework.deleteOne({ID: HW_ID, user_id_owner: user_id});
        console.log(`Homework ID ${HW_ID} deleted successfully.`);
        return true;
    }

}

const handle_new_data = async function (JSONObject, user_id) {

    if (error_with_new_data(JSONObject)) {
        console.log("faulty entry made")
        return false;
    }

    const user_homework = new Homework({
        ID: JSONObject.ID,
        subject: JSONObject.subject,
        expectedtime: JSONObject.expectedtime,
        date: new Date(JSONObject.date),
        user_id_owner: user_id
        // stresscore: stress score calculated by server
    });

    const existing = await Homework.findOne(
        {ID: JSONObject.ID, user_id_owner: user_id}
    );

    if (existing !== null) {
        const updated = await update_homework(user_homework, user_id);
        console.log("Updated:" + updated);
    } else {
        const added = await add_homework(user_homework, user_id);
        console.log("added:" + added);
    }
    return true;


}


// DATABASE MANAGEMENT //
function compute_stress_score(homework_date, homework_time) {
    const current_time = new Date();
    const due_date = new Date(homework_date);
    const time_left = (due_date.getTime() - current_time.getTime())
        / (1000 * 3600);
    let output = (homework_time * 100) - time_left;
    return Math.max(0,Math.floor(output));
}


//ViteExpress.listen(app, 3000, () =>
//    console.log("Server + Vite running at http://localhost:3000")
//);

app.listen(PORT, () => {
    console.log("Server listening on port: " + PORT);
});
