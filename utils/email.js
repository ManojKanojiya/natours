const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstname = user.name.split(' ')[0];
		this.url = url;
		this.from = `Manoj Kanojiya <${process.env.EMAIL_FROM}>`
	}

	newTransport() {
		if (process.env.NODE_ENV === 'production') {
			return 1;
		}

		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD
			},
			secureConnection: 'false',
			tls: {
				ciphers: 'SSLv3',
				rejectUnauthorized: false

			}
		})
	}

	async send(template, subject) {

		const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
			firstname: this.firstname,
			url: this.url,
			subject
		});
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText.fromString(html)
			// html:
		};

		await this.newTransport().sendMail(mailOptions)
	}


	async sendWelcome() {
		await this.send('welcome', 'Welcome to the Natours Family!')
	}


}