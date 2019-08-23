(function ()
{
    NS.Loader = {
        Sender: '',

        Image: '<img id="loader" class="apcloud-loader" src="' + imgurl + '/images/loader.gif" alt="" style="margin: 0 5px;" />',

        Html: '<div class="apcloud-loader" style="text-align: center;"><img id="loader" class="apcloud-loader" src="' + imgurl + '/images/loader.gif" alt="" style="margin: 0 5px;" /></div>',

        Show: function (sender, img)
        {
            if (sender && sender.length > 0)
            {
                NS.Loader.Sender = sender;
                var par = $(sender).parent();

                //sender.hide();

                if (img && img === true)
                {
                    par.append(NS.Loader.Image);
                }
                else if (img && img === 2)
                {
                    sender.css("background", "url('" + imgurl + "/images/loader.gif') no-repeat right center");
                }
                else
                {
                    par.append(NS.Loader.Html);
                }
            }

            $('html, body').css({ 'cursor': 'progress' });
            $('input, textarea, select, a').attr('disabled', 'disabled');

            // Reset auto log off timer
            //NS.UI.AutoLogOff(lgt);
        },

        Hide: function ()
        {
            $('.apcloud-loader').css({ 'display': 'none' });

            if (NS.Loader.Sender.length)
            {
                NS.Loader.Sender.css("background-image", "none");
                NS.Loader.Sender.fadeIn('slow');
                NS.Loader.Sender = '';
            }

            $('.apcloud-loader').remove();

            $('html, body').css({ 'cursor': 'default' });
            $('input, textarea, select, a').removeAttr('disabled');
            $('[data-always-disabled="1"]').attr('disabled', 'disabled');
        }
    }
})();