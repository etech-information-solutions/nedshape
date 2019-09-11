using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Mail;
using NedShape.Core.Models;

namespace NedShape.Mailer
{
    public class Mail
    {
        /// <summary>
        /// Sends an e-mail using the specified template/message and recipients in the Email Model
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public static bool Send( EmailModel model, StreamWriter writer = null )
        {
            bool success = true;

            foreach ( string reciptient in model.Recipients )
            {
                try
                {
                    using ( MailMessage mail = new MailMessage( model.From,  reciptient, model.Subject, model.Body ) )
                    {
                        mail.IsBodyHtml = true;

                        if ( model.Attachments != null && model.Attachments.Any() )
                        {
                            foreach ( Attachment attach in model.Attachments )
                            {
                                mail.Attachments.Add( attach );
                            }
                        }

                        // Will use settings the config file
                        using ( SmtpClient client = new SmtpClient() )
                        {
                            client.Port = 25;
                            client.UseDefaultCredentials = false;
                            client.Host = "smtp.testnedfit.co.za";

                            client.Credentials = new System.Net.NetworkCredential("support@testnedfit.co.za", "$5__96O&7T@H3dF17$");

                            client.Send( mail );
                        }

                        if ( writer != null )
                        {
                            writer.WriteLine();
                            writer.WriteLine( string.Format( "      :: An email was successfully sent to :: {0}", reciptient ) );
                        }
                    }
                }

                catch ( Exception ex )
                {
                    if ( writer != null )
                    {
                        #region Catch It Like:

                        writer.WriteLine();
                        writer.WriteLine( string.Format( ":: ERROR :: MAIL.SEND() <{0}> ", reciptient ) );
                        writer.WriteLine();
                        writer.WriteLine( string.Format( ":: DETAILS :: {0}", ex.ToString() ) );

                        #endregion
                    }
                    success = false;
                }
            }

            

            return success;
        }
    }
}
