const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const mysql = require("mysql");

const bcrypt = require("bcrypt"); // used for pasword hashing
const saltRounds = 10; // used for pasword hashing

//for JWT
const jwt = require("jsonwebtoken");


// dependencies required for sessions and cookies
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");


// when we don't use sessions of cookies, we can use cors policy like in the next line
//app.use(cors());
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT"],
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  key: "userId",
  secret: "someReallyLongSecretTextDidNotMatterWhatItIs",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 60 * 60 * 24
  }
}))


const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "logindb",
});

// identify the requests using get and post methods

// for testing purposes only
app.get("/test", (req, res) => {
  const sqlStatement =
    "INSERT INTO logininfo (firstName, lastName, email, password) VALUES ('alaya', 'gamlath', 'sample2@mail.com', 'password1234');";
  db.query(sqlStatement, (error, result) => {
    res.send("data inserted");
  });
});

// to verify that the token is valid also *we pass the token from the headers
const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"]
  if (!token) {
    res.send("need a token !");
  }
  else {
    jwt.verify(token, "jwtsecret", (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "faild to authenticate !"});
      } 
      else {
        req.userId = decoded.id;
        next();
      }
    })
  } 

// create a "end point" to perform requests using JWT token
app.get {"api/isAuthenticated", verifyJWT,(req, res) => {
  res.send(" Authenticated !")
}}



app.post("/api/insert", (req, res) => {

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  // hashing the password
  bcrypt.hash(password, saltRounds, (err, hash) => {
    const sqlStatement =
    "INSERT INTO logininfo (firstName, lastName, email, password) VALUES (?,?,?,?);";
    db.query(
      sqlStatement,
      [firstName, lastName, email, hash], // instead of passing password directly to the databash we pass the password hash into the database
      (error, result) => {
        console.log(result);
        res.send(result);
      }
    );
  })
  
});


// session related thing (keep the user loggedin even refreshed)

app.get("/api/signup", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

/* without using password hashing

app.post("/api/insert", (req, res) => {

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  const sqlStatement =
    "INSERT INTO logininfo (firstName, lastName, email, password) VALUES (?,?,?,?);";
  db.query(
    sqlStatement,
    [firstName, lastName, email, password],
    (error, result) => {
      console.log(result);
      res.send(result);
    }
  );
});



app.post("/api/signup", (req, res) => {
  //const studentId = req.body.studentId;
  //const studentName = req.body.studentName;
  //const studentDep = req.body.studentDep;
  
  const email = req.body.email;
  const password = req.body.password;

  const sqlStatement =
  "SELECT * FROM logininfo WHERE email = ? AND password = ?;";
  db.query(
    sqlStatement,
    [email, password],
    (error, result) => {
      if (error) {
        res.send(error);
      }
      else {
        if (result.length >0) {
          res.send(result);
        }
        else {
          res.send({message:"Wrong Combination"})
        }
      }
    }
  );
});

*/

app.post("/api/signup", (req, res) => {

  const email = req.body.email;
  const password = req.body.password;

  const sqlStatement =
  "SELECT * FROM logininfo WHERE email = ?";
  db.query(
    sqlStatement,
    email,
    (error, result) => {
      if (error) {
        res.send(error);
      }
      else {
        if (result.length >0) {
          // compare the password with selected results
          bcrypt.compare(password, result[0].password, (error, response) => {
            if (response) {
              
              //in here user successfully logged in
              const id = result[0].email; // used email to make the id
              // create a token using selected id
              const token = jwt.sign({id},"jwtsecret", {
                expiresIn: 300,
              }); // the jwt secret should be in a secure place than this (like dotenv file) for testing purposes I menctioned in here
              req.session.user = result;
              
              
              // instead of sending all the information from the user, we can use the token that we create instead
              //res.send(result);
              res.json({auth: true, token: token, result: result});
            }
            else {
              res.send({message: 'Wrong Password for the selected user'});
            }
          })
        }
        else {
          res.send({message:"Wrong Combination"})
        }
      }
    }
  );
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
