This website is designed to help you prioritize what assignments you should
complete first by ordering them by "stress score." This website supports
account creation, logging in, logging out, and user associated persistent data.

Link to website: https://a4-elijahgray-a25.onrender.com/

This website has been converted to utilize react technologies instead of ejs as in the previous project.
This is a total conversion as now every aspect of this website uses react including the login and registration page.
This was a lot more involved than I previously thought, but it wasnt too surprising given that my previous model
was server based. This had a lot of implications for how I was doing other things like login. This ultimately exposed
a lot of weaknesses in my previous project and gave me an opportunity to improve them.

React was little difficult at first to learn. I was struggling to get started which took me alot of reading.
After some experimentation and seeing some examples from videos, AI, and other ones I found on github I got a better feel to use it.
For me, it did not hurt the development experience. I feel that I can make much more powerful websites now with dynamic content.

AI notice: I utilized chatgpt, gemini to give me examples for various things such as getting started with a react app, displaying dynamic data
and how/why it works with react. I asked for some help with debugging, it pointed out some common pitfalls I
was making with react when I first started out. I think it was very helpful at one point because I
had many typos/syntax errors in my html when trying to do some dynamic content for the first time that was
driving me nuts trying to find.

WARNING: accounts are not locally stored in the server files but in the mongodb database so you MUST have a mongodb database connected or the server
will not work.
Moreover, You must build the my-react-app folder as it has its own package.json folder!

To login, please create an account using the registration page or use some of my premade account for my database:
{user: test1, password: 123}
{user: test2, password: 123}
{user: test3, password: 123}

If you would like access to my database, please email me at egray1@wpi.edu and I will send you my mongodb .env details.

MongoDB setup instructions:
After you make an account on mongoDB, go to the Mongoose section and create a cluster.
After creating a cluster,
go to database --> clusters --> click connect --> drivers at the top --> driver --> Mongoose
--> scroll down slightly and some Node.js code will be generated with a URI for you to use.

Look toward the top and you will see the line:
const uri = "mongodb+srv://MONGO_USER:<db_password>@MONGO_HOST/MONGO_OPTIONS";

Take components of this URL and use them in my .env file.

The password will be the associated cluster's password. If you forget your password, head to Security --> databse access and select your cluster.
You can change the password there.

No quotes needed.
.env file format:

MONGO_USER=
MONGO_PASS=
MONGO_HOST=
MONGO_OPTIONS=?

You must build the my-react-app folder as it has its own package.json folder.






