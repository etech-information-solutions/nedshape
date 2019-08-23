(function ()
{
    NS.Sticky = {

        Close: false,

        StickyOne: $(".sticky-one"),

        Show: function (sender, title, data, callback, arrow)
        {
            if (this.StickyOne.length <= 0) return;

            this.Close = false;

            // Content
            this.StickyOne.find(".sticky-data").html(data);
            this.StickyOne.find(".sticky-title").html(title);


            // Position
            var height = this.StickyOne.height();

            var top = sender.offset().top + (sender.outerHeight());
            var left = sender.offset().left + (sender.outerWidth() / 2) - (this.StickyOne.outerWidth() / 2);

            // BODY DIMENSIONS
            var bodyWidth = $("body").outerWidth();
            var bodyHeight = $("body").outerHeight();

            if (bodyHeight <= (top + this.StickyOne.outerHeight()))
            {
                top = sender.offset().top - this.StickyOne.outerHeight();

                this.StickyOne.addClass("t-position");
            }
            else
            {
                this.StickyOne.removeClass("t-position");
            }

            if (arrow)
            {
                this.StickyOne.addClass(arrow);

                if (arrow.equals("top-right") || arrow.equals("top-left"))
                {
                    top = top + 10;
                    left = (sender.offset().left - this.StickyOne.outerWidth()) + (sender.outerWidth() / 2);
                }
                else if (arrow.equals("bottom-right") || arrow.equals("bottom-left"))
                {
                    top = (sender.offset().top - sender.outerHeight()) - this.StickyOne.outerHeight();
                    left = sender.offset().left - sender.outerWidth() + 6;
                }
                else if (arrow.equals("center-left"))
                {
                    left = sender.prLeft() + sender.outerWidth() + 10;
                    top = (sender.prTop() - (height / 2)) + 6;
                }
                else if (arrow.equals("center-right"))
                {
                    top = (sender.prTop() - (height / 2)) + (3);
                    left = sender.prLeft() - (this.StickyOne.outerWidth() + 3);
                }
            }

            // Show
            this.StickyOne.css({ "left": left + "px", "top": top + "px" });

            if (!this.StickyOne.is(":visible"))
            {
                this.StickyOne.css("display", "block");
                this.StickyOne.animate({
                    "opacity": "1",
                    "margin-left": "0",
                    "filter": "alpha(opacity=100)"
                }, 800, function ()
                {
                    NS.Sticky.Close = true;

                    NS.UI.DataCallBack(callback);
                });
            }
            else
            {
                this.StickyOne.css({ "top": top + "px" });

                NS.Sticky.Close = true;
            }

            this.StickyOne.click(function ()
            {
                NS.Sticky.Close = false;

                setTimeout("NS.Sticky.Close = true;", "100");
            });
        },

        Hide: function ()
        {
            if (this.StickyOne.length <= 0) return;

            if (this.Close && this.StickyOne.is(":visible"))
            {
                NS.Sticky.StickyOne.hide(600, function ()
                {
                    NS.Sticky.StickyOne.removeClass("error top-right center-left center-right t-position");

                    NS.Sticky.StickyOne.css({ "top": "0", "left": "-100px" });
                    NS.Sticky.StickyOne.find(".sticky-title, .sticky-data").html("");
                });
            }
        }
    }
})();


$(function ()
{
    $(document).click(function ()
    {
        NS.Sticky.Hide();
    });
});