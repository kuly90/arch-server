/**
 * To get started install
 * express bodyparser jsonwebtoken express-jwt
 * via npm
 * command :-
 * npm install express bodyparser jsonwebtoken express-jwt --save
 */

// Bringing all the dependencies in
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
var dateTime = require('node-datetime');
const sgMail = require('@sendgrid/mail'); //sendgrid library to send emails 
const nodemailer = require('nodemailer');

const app = express(); //alias from the express function

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'archvietnam'
});

connection.connect(err => {
	if (err) {
		return err;
	}
});


app.use(cors());
// Setting up bodyParser to use json and set it to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send('go to arch Viet Nam');
});

// Send email with mail send is gmail....
app.get('/send-email', (req, res) => {
	const { name, email, subject, message } = req.query;
	//get current datetime format
	var dt = dateTime.create();
	var date_create = dt.format('Y-m-d H:M');
	const INSERT_CUSTOMERS = `INSERT INTO customers(name, email, subject, message, date_create) VALUES('${name}', '${email}', '${subject}', '${message}', '${date_create}')`;
	nodemailer.createTestAccount((err, acount) => {
		const htmlEmail = `
            <h4>Deaer ${name},</h4>
            <span>Thank you for have ideas for our Company. We received your message and will reply you as soon as.</span><br/>
            <span>Best Regard !</span><br/>           
            <h4>ARCH VIETNAM Co. Ltd</h4>
            <span>Address: Tầng 17, Danang Software Park
            Số 02 Quang Trung, quận Hải Châu, thành phố Đà Nẵng.</span><br/> 
						<span>https://arch-vietnam.vn</span><br/>
						<span>Facebook: ARCH VietNam - Offshore Company</span><br/>
						<span>Cellphone: 02363-888-575</span>           
        `
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			secure: false, // true for 465, false for other ports
			auth: {
				user: 'tonthat90@gmail.com', // generated ethereal user
				pass: 'hoilamchy321' // generated ethereal password
			}
		});

		// setup email data with unicode symbols
		let mailOptions = {
			from: '"Ly Ku 👻" <tonthat90@gmail.com>', // sender address
			to: `${email}, tonthat90@gmail.com`, // list of receivers
			subject: 'Thank You From ARCH VIETNAM', // Subject line
			text: message, // plain text body
			html: htmlEmail // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log('Message sent: %s', info.messageId);
			// Preview only available when sending through an Ethereal account
			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		});
	}),
		connection.query(INSERT_CUSTOMERS, (err, results) => {
			if (err) {
				return res.send(err)
			}
			else res.send('added CUSTOMER success !')
		})

});

app.get('/customers', (req, res) => {
	const ALL_CUSTOMERS = 'SELECT * FROM customers ORDER BY date_create DESC';
	connection.query(ALL_CUSTOMERS, (err, results) => {
		if (err) {
			return res.send(err)
		} else {
			return res.json({
				data: results
			})
		}
	});
});


app.get('/users/editUser', (req, res) => {
	const { username, password, id } = req.query;
	const INSERT_USER = `UPDATE user SET username = '${username}', password = '${password}' WHERE id = ${id}`;
	connection.query(INSERT_USER, (err, results) => {
		if (err) {
			return res.send(err)
		}
		else res.send('edit user success !')
	})
});

app.get('/customers/deleteCustomer', (req, res) => {
	const { id } = req.query;
	const DELETE_CUSTOMER = `DELETE FROM customers WHERE id = ${id}`;
	connection.query(DELETE_CUSTOMER, (err, results) => {
		if (err) {
			return res.send(err)
		}
		else res.send('delete customer success !')
	})
});

app.get('/users/searchUser', (req, res) => {
	const { id, username } = req.query;
	const SEARCH_USER = `SELECT * FROM user WHERE id LIKE '%${id}%' OR username LIKE '%${username}%'`;
	connection.query(SEARCH_USER, (err, results) => {
		if (err) {
			return res.send(err)
		} else {
			return res.json({
				data: results
			})
		}
	});
});

// See the react auth blog in which cors is required for access
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
	next();
});


// INstantiating the express-jwt middleware
const jwtMW = exjwt({
	secret: 'keyboard cat 4 ever'
});


// MOCKING DB just for test
let users = [
	{
		id: 1,
		username: 'kuly',
		password: '123456'
	},
	{
		id: 2,
		username: 'ronaldo',
		password: '1234567'
	},
	{
		id: 3,
		username: 'neymar',
		password: '1234568'
	}
];

// LOGIN ROUTE
app.post('/login', (req, res) => {
	const { username, password } = req.body;
	// Use your DB ORM logic here to find user and compare password
	for (let user of users) { // I am using a simple array users which i made above
		if (username == user.username && password == user.password /* Use your password hash checking logic here !*/) {
			//If all credentials are correct do this
			let token = jwt.sign({ id: user.id, username: user.username }, 'keyboard cat 4 ever', { expiresIn: 129600 }); // Sigining the token
			res.json({
				sucess: true,
				err: null,
				token
			});
			break;
		}
		else {
			res.status(401).json({
				sucess: false,
				token: null,
				err: 'Username or password is incorrect'
			});
		}
	}
});

app.get('/', jwtMW /* Using the express jwt MW here */, (req, res) => {
	res.send('You are authenticated'); //Sending some response when authenticated
});

// Error handling 
app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') { // Send the error rather than to show it on the console
		res.status(401).send(err);
	}
	else {
		next(err);
	}
});

// Starting the app on PORT 3000
const PORT = 8080;
app.listen(PORT, () => {
	// eslint-disable-next-line
	console.log(`Magic happens on port ${PORT}`);
});
