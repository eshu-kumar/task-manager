const sgMail=require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const fromMail='eshu.ek.23@gmail.com'
const sendWelcomeEmail = (email,user)=>{
    sgMail.send({
        to:email,
        from:fromMail,
        subject:'Thanks for joinig Task manager ',
        text:`welcome to the app , ${user} let me know your experiences with the app`,

    })
    
}
const sendCancelationEmail=(email,user)=>{
    sgMail.send({
        to:email,
        from:fromMail,
        subject:`Good bye friend ${user} from Task manager`,
        text:'Hope to listen from you what we could do to keep you in board ??'
})
}
module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}