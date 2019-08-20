


PR.Init = {

    NotificationTimeout: [],

    Start: function (restartPlugin)
    {
        $(".tipsy").remove();
        PR.Loader.Hide();

        $(".notification").stop().slideDown(700, function ()
        {
            $('html, body').animate({ scrollTop: $(this).prTop() - 20 }, 'slow', function () { });
        });

        clearTimeout(this.NotificationTimeout);
        this.NotificationTimeout = setTimeout(function ()
        {
            $(".notification").stop().animate({
                "width": "0",
                "height": "0",
                "opacity": "0",
                "margin-top": "-50px",
                "filter": "alpha(opacity=0)"
            }, 1200, function ()
            {
                $(this).remove();
            });

        }, "120000");

        if (!this.PluginLoaded || restartPlugin)
        {
            this.PluginInit();
        }

        this.PluginLoaded = true;

        PR.UI.Start();
        PR.Validation.Start();

        if ($("#edit-item").length)
        {
            this.AppendPaging($("#edit-item"));
        }
    },

    AppendPaging: function (sender, t)
    {
        if (!t)
        {
            t = $(".da-tab:visible").attr("id");
        }

        if (!PR.UI[t])
        {
            PR.UI[t] = [];
        }

        //var params = PR.UI.GetCustomSearchParams(t);

        //for (p in params)
        //{
        //    if (!sender.find("#" + p).length)
        //    {
        //        sender.append('<input id="' + p + '" type="hidden" name="' + p + '" value="' + params[p] + '" />');
        //    }
        //}

        if (!$('input[name="skip"]').length)
        {
            sender.append('<input type="hidden" name="skip" value="' + (PR.UI[t].PageSkip || PR.UI.PageSkip) + '" />');
        }
        else
        {
            $('input[name="skip"]').val((PR.UI[t].PageSkip || PR.UI.PageSkip));
        }

        if (!$('input[name="page"]').length)
        {
            sender.append('<input type="hidden" name="page" value="' + (PR.UI[t].PageNumber || PR.UI.PageNumber) + '" />');
        }
        else
        {
            $('input[name="page"]').val((PR.UI[t].PageNumber || PR.UI.PageNumber));
        }

        if (!$('input[name="take"]').length)
        {
            sender.append('<input type="hidden" name="take" value="' + (PR.UI[t].PageLength || PR.UI.PageLength) + '" />');
        }
        else
        {
            $('input[name="take"]').val((PR.UI[t].PageLength || PR.UI.PageLength));
        }

        if (!$('input[name="query"]').length)
        {
            sender.append('<input type="hidden" name="query" value="' + (PR.UI[t].PageSearch || PR.UI.PageSearch) + '" />');
        }
        else
        {
            $('input[name="query"]').val((PR.UI[t].PageSearch || PR.UI.PageSearch));
        }
    },

    PluginInit: function (target)
    {
        target = target || $("body");

        // Tool tips
        target.find('a[rel="tipsy"], a[rel="tipsyS"]').tipsy({ fade: true, gravity: 's' });

        target.find('a[rel="tipsyN"]').tipsy({ fade: true, gravity: 'n' });

        target.find('a[rel="tipsyW"]').tipsy({ fade: true, gravity: 'w' });

        target.find('a[rel="tipsyE"]').tipsy({ fade: true, gravity: 'e' });


        // Date picker
        target.find('.timepicker, .time-picker').timepicker({ timeFormat: 'HH:mm:ss' });
        //target.find('.datepicker, .date-picker').datepicker({ inline: true, dateFormat: "dd-mm-yy" });
        target.find('.datetimepicker, .date-time-picker').datetimepicker({ ampm: true, dateFormat: "yy/mm/dd" });

        target.find('.datepicker, .date-picker').each(function (i)
        {
            var d = $(this);

            if (d.hasClass("hasDatepicker")) return;

            d.attr("id", d.attr("id") + "_" + i);

            d.datepicker({
                inline: true, dateFormat: "yy/mm/dd",
                onChangeMonthYear: function ()
                {
                    PR.Sticky.Close = false;

                    setTimeout("PR.Sticky.Close = true;", "100");
                }
            });
        });

        $.validator.methods.date = function (value, element)
        {
            return this.optional(element) || $.datepicker.parseDate('yy/mm/dd', value);
        }

        target.find("table.datatable-numberpaging").each(function ()
        {
            var i = $(this);

            if (i.hasClass("dataTable")) return true;

            if (i.find("tbody tr td").length > 1)
            {
                i.dataTable({
                    bSort: false,//i.hasClass("sort"),
                    bPaginate: false,
                    iDisplayLength: 50,

                    "fnDrawCallback": function ()
                    {
                        PR.UI.Start();
                    }
                });
            }
        });

        target.find("table.da-table").each(function ()
        {
            var i = $(this);

            if (i.hasClass("dataTable")) return true;

            i.dataTable({
                bSort: false,//i.hasClass("sort"),
                bPaginate: false,
                iDisplayLength: 50,

                "fnDrawCallback": function ()
                {
                    PR.UI.Start();
                }
            });
        });

        if ($.fn.select2)
        {
            target.find("select.chzn").select2();
        }

        $('a[rel="fancybox"]').fancybox({
            'type': "image",
            'opacity': true,
            'overlayShow': true,
            'overlayColor': '#000',
            'transitionIn': 'fade',
            'transitionOut': 'fade',
            'overlayOpacity': '0.8',
            'titlePosition': 'inside'
        });
    }
};







$(function ()
{
    PR.Init.Start(true);
});