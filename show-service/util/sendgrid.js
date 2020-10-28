const sgMail = require('@sendgrid/mail');
const { format } = require('date-fns');

const { createExpiringToken } = require('./auth');
const {
  SENDGRID_API_KEY,
  LOGIN_TEMPLATE_ID,
  SITE_BASE_URL
} = require('../secrets/credentials');

sgMail.setApiKey(SENDGRID_API_KEY);

const msg = {
  to: 'chris.uehlinger@gmail.com',
  from: 'test@mirrors.show',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

let sendTest = async () => {
  try {
    console.log('GONNA SEND');
    let response = await sgMail.send(msg);
    console.log('SENT!', response);
  } catch (error) {
    console.error(error);
 
    if (error.response) {
      console.error(error.response.body)
    }
  }
}

module.exports = {
  sendShowEmails: async (show) => {
    const options = {
      timeZone: "America/New_York",
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric'
    };

    const formatter = new Intl.DateTimeFormat([], options);
    const localTime = formatter.format(new Date(show.date));
    // const dateString = format(localTime, 'M/d/yy h:mma');
    let emails = show.parties.flatMap(party => party.attendees.map(attendee => {
      const token = createExpiringToken(attendee, '72h');
      const loginLink = `${SITE_BASE_URL}/attendee/?token=${token}`;
      return {
        to: attendee.email,
        from: 'thescatteredplayers@gmail.com',
        subject: 'Log in and join us at Shattered Space!',
        templateId: LOGIN_TEMPLATE_ID,
        dynamic_template_data: {
          loginLink,
          dateString: localTime
        }
      };
    }))

    console.log('GONNA SEND');
    let results = await Promise.all(emails.map(async email => {
      try {
        return {
          to: email.to,
          result: 'SUCCESS',
          data: await sgMail.send(email)
        };
      } catch(err){
        return {
          to: email && email.to,
          result: 'ERROR',
          data: err
        }
      }
    }));
    console.log('SENT!', results);
    return results;
  },
  sendLoginEmail: async user => {
    if(user.email.indexOf('@nosend.com') !== -1){
      console.log(`NOT SENDING AN EMAIL TO ${user.email}`);
      return;
    }
    const token = createExpiringToken(user, '12h');
    const url = `${SITE_BASE_URL}/${user.kind.toLowerCase()}/?token=${token}`;

    const subjectDict = {
      Admin: 'Log in to Shattered Space as an admin',
      Actor: 'Log in to Shattered Space as an actor',
      Attendee: 'Log in and join us at Shattered Space!'
    }
    const msg = {
      to: user.email,
      from: 'thescatteredplayers@gmail.com',
      subject: subjectDict[user.kind],
      text: `To log in, please visit ${url}`,
      html: `<p>To log in, please click  <a href="${url}">this link</a>.</p>`,
    };

    try {
      console.log('GONNA SEND');
      let response = await sgMail.send(msg);
      console.log('SENT!', response);
    } catch (error) {
      console.error(error);
  
      if (error.response) {
        console.error(error.response.body)
      }
    }

  }
};