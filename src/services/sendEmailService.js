import nodemailer from 'nodemailer'

export async function sendEmail (
  { to , subject , message , attachments=[]} , {} )
{
  //configurations
  const transporter = nodemailer.createTransport({
        host: "localhost",
        port: 465, //587 if secure : false , or 465 if secure : true 
        secure: true, //use tls or not 
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: '8salmaahmed8@gmail.com', //email
            pass: 'twlspvqwdbqvjklk' //pass of app not pass of email
        },

      service : 'Gmail' ,// optional
      /*  tls :{
          rejectUnauthorized :false //ely hyb3tlha
        }
      */
  });

  const info = await transporter.sendMail({
    from: '"Saraha" <8salmaahmed8@gmail.com>', // sender address
    to : to ? to : '', // list of receivers
    subject : subject ? subject : 'Hello' , // Subject line
    //text: "Hello world?", // plain text body
    html: message ? message : '', // html body
    attachments,
  });
  
  console.log(info);
  if(info.accepted)return true;
  return false;
}