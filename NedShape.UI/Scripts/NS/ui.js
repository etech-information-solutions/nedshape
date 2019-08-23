(function ()
{
    NS.UI = {

        URL: '',

        PageSkip: 0,

        PageNumber: 0,

        PageViewId: 0,

        PageSearch: '',

        PageSort: 'DESC',

        PageSortBy: 'CreatedOn',

        PageLength: 50,

        PageBroadcast: 0,

        PageActionDate: 0,

        PageSearchTimer: [],

        PageAmountTimer: [],

        PageAmount1Timer: [],

        PageStayAliveTimer: [],

        PageMatchStructureTimer: [],

        SelectedPRs: [],

        SelectedItems: [],

        PageErrorOcurred: false,

        PageViewIdProcessed: false,

        DocumentTypes: ["pdf", "csv", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "mpg", "mp4", "avi", "flv", "mkv", "wmv", "msg"],

        Start: function ()
        {
            //this.DataSideBar($('*[data-side-bar="1"]'));

            var dt = ($('#tab-data>div:visible').length) ? $('#tab-data>div:visible') : ($('#collapse>div:visible').length) ? $('#collapse>div:visible') : ($("#list").length) ? $("#list") : $('#item-list');

            if (dt.find("#collapse").length)
            {
                dt = dt.find("#collapse>div:visible");
            }

            this.DataTablesOverride(dt);

            this.DataTablesDateRange($("#tab-data > div"));
            this.DataPartialImages($('*[data-partial-images="1"]'));

            this.DataHover($('*[data-hover="1"]'));

            this.DataAPTab($('*[data-ap-tab="1"]'));
            this.DataRefresh($('*[data-refresh="1"]'));


            this.DataModal($('*[data-modal="1"]'));
            this.DataAjaxForm($('*[data-ajax-form="1"]'));
            this.DataShowHide($('*[data-show-hide="1"]'));
            this.DataStickyOne($('*[data-sticky-one="1"]'));
            this.DataAddOneMore($('*[data-add-one-more="1"]'));
            this.DataDelOneMore($('*[data-del-one-more="1"]'));
            this.DataDeleteImage($('*[data-delete-image="1"]'));

            // Table CRUD Operations
            this.DataEdit($('*[data-edit="1"]'));
            this.DataCancel($('*[data-cancel="1"]'));
            this.DataDelete($('*[data-delete="1"]'));
            this.DataDetails($('*[data-details="1"]'));
            this.DataFormSubit($('*[data-form-submit="1"]'));
            this.DataCancelItem($('*[data-cancel-item="1"]'));


            // Table Quick Links Operations
            this.DataStep($('*[data-step="1"]'));
            this.DataCollapse($('*[data-collapse="1"]'));
            this.DataGroupStep($('*[data-group-step="1"]'));
            this.DataCheckOptions($('*[data-check-options="1"]'));

            // PR Create / Edit
            this.DataBank($('*[data-bank="1"]'));

            // Length Validation
            this.DataValMax($('*[data-val-length-max]'));

            // Bank Details Validation
            this.DataBankValidation($('*[data-bank-val]'));


            // Money
            this.DataMoney($('*[data-money="1"]'));

            if (window.location.search !== "" && !$("tr.edit").length && $(".dataTable").length && !NS.UI.PageViewIdProcessed)
            {
                var viewid = false,
                    open = "details";

                var search = window.location.search.replace("?", "").split("&");
                for (var i = 0; i < search.length; i++)
                {
                    var xxs = search[i].split("=");

                    if (xxs[0].toLowerCase() === "prid" && ($('#tr-' + xxs[1] + '-item [data-edit="1"]').length || $('#tr-' + xxs[1] + '-item [data-details="1"]')))
                    {
                        viewid = xxs[1];
                    }
                    if (xxs[0].toLowerCase() === "open")
                    {
                        open = xxs[1];
                    }
                }

                if (viewid && open)
                {
                    $('#tr-' + viewid + '-item [data-' + open + '="1"]').click();

                    NS.UI.PageViewIdProcessed = true;
                }
            }

            //this.AutoLogOff(lgt);
            //this.DataRenew(atr);
            //this.DataStayAlive();


            // Broadcast
            this.DataGetBroadcast();

            $('input[readonly=""], select[readonly=""], textarea[readonly=""]').removeAttr('readonly');
            $('input[disabled=""], select[disabled=""], textarea[disabled=""]').removeAttr('disabled');
        },

        DataSideBar: function (sender)
        {

            sender.each(function ()
            {
                var i = $(this);

                var clicked = i.attr("data-clicked");
                var target = $(i.attr("data-target"));
                var content = $(i.attr("data-content"));

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        i.attr("data-clicked", "1");

                        var width = "190px";
                        var state = i.attr("data-state");

                        if (state == "open")
                        {
                            width = "60px";
                            target.addClass("close");
                            i.find(".fa").removeClass("fa-outdent").addClass("fa-indent");
                            i.attr({ "data-state": "close", "title": "Open side menu?" });
                        }
                        else
                        {
                            target.removeClass("close");
                            i.find(".fa").removeClass("fa-indent").addClass("fa-outdent");
                            i.attr({ "data-state": "open", "title": "Hide side menu?" });
                        }

                        target.animate({
                            "width": width
                        }, 1000, function ()
                            {

                            });

                        content.animate({
                            "marginLeft": width
                        }, 1000, function ()
                            {

                            });
                    });

                if (clicked == "0")
                {
                    i.click();
                }
            });
        },

        AutoLogOff: function (s, go)
        {
            if (s == "-1" || s == "-1m0s" || s == "0h0m0s") return;

            var tick = $('*[data-timer-tick="1"]');
            var pap = tick.parent().parent();
            var cont = pap.find('a[data-continue="1"]');

            // Reset timer (if any) 
            tick.timer("remove");

            tick.timer({
                countdown: true,
                duration: s,
                callback: function ()
                {
                    if (!go)
                    {
                        tick.timer("remove");

                        if (NS.Modal.MovedObj.length)
                        {
                            NS.Modal.MovedObj.appendTo(NS.Modal.MovedObjSource);
                        }

                        $(NS.Modal.Container).find('#modal-body').html('');
                        $(NS.Modal.Container).find('#modal-title').html('');

                        var title = "Auto Logoff";
                        var data = pap;

                        NS.Modal.MovedObj = data.children();
                        NS.Modal.MovedObjSource = data;

                        data.children().appendTo($(NS.Modal.Container).find('#modal-body'));

                        NS.Modal.Open(null, title);

                        setTimeout(function ()
                        {
                            NS.UI.AutoLogOff(3 + "m" + 0 + "s", true);
                        }, "100");
                    }
                    else
                    {
                        // Logout...
                        //window.location = "/Account/LogOff?r=alo";

                        $.get("/Account/PartialLogOff", {}, function (data, s, xhr)
                        {
                            NS.Modal.Close();

                            var date = new Date(null);
                            date.setSeconds(cas); // specify value for SECONDS here
                            var result = date.toISOString().substr(11, 8);

                            var title = "You've been logged out";
                            var msg = "<p>YOU HAVE BEEN LOGGED OUT OF THE SYSTEM DUE TO NO ACTIVITY FOR THE PAST " + result + ".</p>";
                            msg += "<p>PLEASE CLOSE YOUR BROWSER, RE-OPEN THE APPLICATION AND LOG IN, SHOULD YOU NEED TO CONTINUE WORKING</p>";
                            msg += "<p>THANK YOU</p>";

                            setTimeout(function ()
                            {
                                NS.Modal.Open(msg, title);
                            }, "1000");
                        });
                    }
                }
            });

            cont
                .unbind("click")
                .bind("click", function ()
                {
                    // Reset timer
                    tick.timer("remove");

                    setTimeout(function ()
                    {
                        NS.UI.AutoLogOff(lgt);
                    }, "800");

                    NS.UI.DataStayAlive();

                    NS.Modal.Close();
                });
        },

        DataRenew: function (s)
        {
            if (s == "-1") return;

            clearTimeout(NS.UI.PageRenewTimer);

            NS.UI.PageRenewTimer = setTimeout(function ()
            {
                $.get("/Account/Renew", {}, function (data, s, xhr)
                {
                });
            }, s);
        },

        DataStayAlive: function ()
        {
            clearTimeout(NS.UI.PageStayAliveTimer);

            NS.UI.PageStayAliveTimer = setTimeout(function ()
            {
                $.get(siteurl + "/StayAlive", {}, function (data, s, xhr)
                {
                    NS.UI.DataStayAlive();
                });
            }, "300000");
        },

        DataAPTab: function (sender)
        {
            var hash = window.location.hash;

            sender.each(function (c)
            {
                var i = $(this);

                var target = $(i.attr("data-target"));
                var reload = $(i.attr("data-reload"));
                var holder = $(i.attr("data-tab-holder"));

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        var rendered = parseInt(i.attr("data-rendered"));

                        if ((target.is(":visible") && rendered) || (i.hasClass("not-allowed"))) return;

                        window.location.hash = i.attr("data-target");
                        sender.removeClass("current");

                        holder.find(">div.current").css("display", "none");

                        i.addClass("current");

                        target.fadeIn(1200, function ()
                        {
                            $(this).addClass("current");
                        });

                        NS.UI.DataPartialLoad(i, sender);
                    });

                if ((c == 0 && hash == '') || (i.hasClass("current") && hash == i.attr("data-target")) || (!i.hasClass("current") && hash == i.attr("data-target")))
                {
                    i.click();
                }
            });
        },

        DataCollapse: function (params)
        {
            var hash = window.location.hash;

            params.each(function (c)
            {
                // Get current instance
                var i = $(this);

                var holder = $(i.attr("data-tab-holder"));

                // Get target to be updated with server response
                var target = $(i.attr('data-target'));
                target = (target.length <= 0) ? $(i.attr("target")) : target;

                // Unbind any click events
                i.unbind('click');
                i.click(function ()
                {
                    var rendered = parseInt(i.attr("data-rendered"));

                    //if ( target.is( ":visible" ) )
                    //{
                    //    target.slideUp( 900, function ()
                    //    {
                    //        i
                    //        .removeClass( "open" )
                    //        .addClass( "closed current" );
                    //    } );

                    //    return;
                    //}

                    if ((target.is(":visible") && rendered) || (i.hasClass("not-allowed"))) return;

                    window.location.hash = i.attr("data-target");

                    params
                        .addClass("closed")
                        .removeClass("current open");

                    holder.find(".current").css("display", "none");

                    i
                        .removeClass("closed")
                        .addClass("open current");

                    target.fadeIn(1200, function ()
                    {
                        $(this).addClass("current");
                    });

                    NS.UI.DataPartialLoad(i, params);
                });

                if ((c == 0 && hash == '') || (i.hasClass("current") && hash == i.attr("data-target")) || (!i.hasClass("current") && hash == i.attr("data-target")))
                {
                    i.click();
                }
            });
        },

        DataStep: function (sender)
        {
            sender.each(function ()
            {
                var me = $(this);

                var target = $(me.attr("data-target"));
                var rendered = me.attr("data-rendered");
                var group = $('[data-target="' + me.attr("data-target") + '"]');

                me
                    .unbind("click")
                    .bind("click", function ()
                    {
                        if (target.is(":visible")) return;

                        var cntr = [];
                        var valid = true;
                        var direction = "center-left";
                        var err = "<div class='message-error'>";

                        if (valid && $("#select-originator").is(":visible") && $("#select-originator select#Id").val() == "")
                        {
                            valid = false;
                            cntr = $("#select-originator select#Id").parent().find("div.chzn");
                            err += "Start off by selecting the originator who owns the PR (s) to change ownership...";
                        }

                        if (valid && me.attr("data-target") == "#change-originator" && $("#select-new-originator select#Id").val() == "")
                        {
                            if (!$("#select-new-originator").is(":visible"))
                            {
                                show(sender, $('[data-step="1"][data-target="#select-new-originator"]'), $("#select-new-originator"));
                            }

                            valid = false;
                            cntr = $("#select-new-originator select#Id").parent().find("div.chzn");
                            err += "Next up, select a new originator who'll own the PR (s)...";
                        }

                        if (valid && me.attr("data-target") == "#change-originator" && $("#select-new-originator select#Id").val() == $("#select-originator select#Id").val())
                        {
                            if (!$("#select-new-originator").is(":visible"))
                            {
                                show(sender, $('[data-step="1"][data-target="#select-new-originator"]'), $("#select-new-originator"));
                            }

                            valid = false;
                            cntr = $("#select-new-originator select#Id").parent().find("div.chzn");
                            err += "You just selected the same originator from Step 1, please select a different originator and hit Next...";
                        }

                        if (valid && $("#select-pr").length && $("#select-pr").is(":visible") && !$('#select-pr table input[type="checkbox"]:checked').length)
                        {
                            valid = false;
                            direction = "center-left";
                            cntr = $('#select-pr table input[type="checkbox"]:first');
                            err += "Start off by selecting Payment Requisitions you would like to authorise in the table below. Tip: Check this one to <b>Select All</b>";
                        }

                        if (!valid)
                        {
                            err += "</div>";

                            NS.Sticky.StickyOne.addClass("error");
                            NS.Sticky.StickyOne.css({ "display": "none" });

                            NS.Sticky.Show(cntr, "We can't go next yet!", err, [], direction);
                            $('html, body').animate({ scrollTop: cntr.offset().top - 150 }, 'slow', function () { cntr.focus(); });

                            return valid;
                        }
                        else
                        {
                            Show(sender, me, target);
                        }

                        return false;
                    });

                if ($("#select-pr").length)
                {
                    ReIndex($("#select-pr"));
                    RestoreSelectedItems($("#select-pr"), $("#authorise-pr"));
                }

                if ($('#select-pr input[data-check-all="1"]').length)
                {
                    var checkAll = $('#select-pr input[data-check-all="1"]');

                    kids = $(checkAll.attr("data-kids"));

                    if (NS.UI.SelectedItems.length)
                    {
                        checkAll.prop("checked", true).attr("checked", "checked");
                    }

                    checkAll
                        .unbind("change")
                        .bind("change", function ()
                        {
                            if ($(this).is(":checked"))
                            {
                                kids.prop("checked", true).attr("checked", "checked");
                            }
                            else
                            {
                                kids.prop("checked", false).removeAttr("checked");
                            }

                            $('#select-pr table tbody input[type="checkbox"]').change();
                        });
                }

                target.find('[data-select-originator="1"]').each(function ()
                {
                    var s = $(this);

                    var od = $(s.attr("data-od"));
                    var pr = $(s.attr("data-pr-list"));

                    var odurl = s.attr("data-od-url");
                    var prurl = s.attr("data-pr-url");

                    s
                        .unbind("change")
                        .bind("change", function ()
                        {
                            NS.Loader.Show(s, true);

                            odurl = siteurl + odurl;
                            od.load(odurl, { id: $(this).val() }, function ()
                            {
                                NS.Init.Start(true);
                            });

                            prurl = siteurl + prurl;
                            pr.load(prurl, { id: $(this).val() }, function ()
                            {
                                NS.Init.Start(true);
                                var checksIn = pr.find("form table tbody");

                                ReIndex(checksIn);

                                pr.find('form table thead input[type="checkbox"]')
                                    .unbind("change")
                                    .bind("change", function ()
                                    {
                                        if ($(this).is(":checked"))
                                        {
                                            checksIn.find('input[type="checkbox"]').prop("checked", true).attr("checked", "checked").change();
                                        }
                                        else
                                        {
                                            checksIn.find('input[type="checkbox"]').prop("checked", false).removeAttr("checked");
                                        }
                                    });
                            });
                        });
                });

                target.find('[data-select-new-originator="1"]')
                    .unbind("change")
                    .bind("change", function ()
                    {
                        $("#NewOriginatorId").val($(this).val());
                        $("#new-originator-name").text($(this).children("option").filter(":selected").text());
                    });

                function ReIndex(target)
                {
                    target.find('table tbody input[type="checkbox"]')
                        .unbind("change")
                        .bind("change", function ()
                        {
                            NS.UI.DataIndex(target.find('input[type="checkbox"]:checked'));

                            var ind = SelectedItemExist($(this).val());

                            if (!$(this).is(":checked") && ind >= 0)
                            {
                                NS.UI.SelectedItems.splice(ind, 1);
                            }

                            if ($("#select-pr").length && $('#select-pr table input[type="checkbox"]:checked').length)
                            {
                                $('#select-pr table input[type="checkbox"]:checked').each(function ()
                                {
                                    if (typeof $(this).attr("Data-id") == 'undefined') return;

                                    var id = $(this).val();
                                    var number = $(this).parent().parent().find("#pr-number-span").text() || '';

                                    if (SelectedItemExist(id) < 0)
                                    {
                                        NS.UI.SelectedItems.push({ "Id": id, "Number": number });
                                    }
                                });
                            }

                            if (target.find("#sel-pr-count").length)
                            {
                                target.find("#sel-pr-count").text(NS.UI.SelectedItems.length + " Item (s) Selected");
                            }
                        });

                    if (target.find("#sel-pr-count").length)
                    {
                        target.find("#sel-pr-count").text(NS.UI.SelectedItems.length + " Item (s) Selected");
                    }
                }

                function SelectedItemExist(id)
                {
                    for (var i = 0; i < NS.UI.SelectedItems.length; i++)
                    {
                        if (NS.UI.SelectedItems[i].Id == id) return i;
                    }

                    return -1;
                }

                function Show(sender, me, target)
                {
                    sender.removeClass("active");//pr-number-span

                    $(".step").css("display", "none");
                    target.css("display", "block");
                    me.add('[data-target="' + me.attr("data-target") + '"]').addClass("active").attr("data-rendered", "1");

                    target.find("#pr-preview").html('');

                    RestoreSelectedItems($("#select-pr"), $("#authorise-pr"));

                    if ($("#select-pr").length && me.attr("data-number") === "2" && me.attr("data-loaded") === "0")
                    {
                        NS.Loader.Show(target.find("#details #sel-pr-loader"), false);

                        $.get(siteurl + "/CompleteAuthorisation", {}, function (data, status, req)
                        {
                            target.find("#details").html(data);

                            target.find("#pr-preview").show(1200);

                            NS.Loader.Hide();
                            me.attr("data-loaded", "1");

                            NS.Init.PluginInit(target);

                            NS.UI.DataValMax($('*[data-val-length-max]'));
                            NS.UI.DataAjaxForm($('*[data-ajax-form="1"]'));
                            NS.UI.DataCheckOTP($('*[data-check-otp="1"]'));
                            NS.UI.DataResendOTP($('*[data-resend-otp="1"]'));
                        });
                    }

                    target.animate({ scrollTop: target.offset().top - 50 }, 'slow', function () { });
                }

                function RestoreSelectedItems(target, preview)
                {
                    if (NS.UI.SelectedItems.length)
                    {
                        for (var i = 0; i < NS.UI.SelectedItems.length; i++)
                        {
                            if (typeof NS.UI.SelectedItems[i].Id === 'undefined') return;

                            var inp = '<input name="SelectedPRList[' + i + ']" type="hidden" value="' + NS.UI.SelectedItems[i].Id + '" />';
                            var s = '<span style="display: inline-block; border: 1px dashed #ddd; border-radius: 2px; padding: 4px; margin: 0 4px; 4px 0;">' + NS.UI.SelectedItems[i].Number.trim() + '</span>';

                            preview.find("#pr-preview").append(s);
                            preview.find("#pr-preview").append(inp);

                            if (target.find('input[type="checkbox"][data-id="' + NS.UI.SelectedItems[i].Id + '"]').length)
                            {
                                target.find('input[type="checkbox"][data-id="' + NS.UI.SelectedItems[i].Id + '"]')
                                    .prop("checked", true)
                                    .attr("checked", "checked");
                            }
                        }
                    }
                }
            });

            sender.first().click();
        },

        DataGroupStep: function (sender)
        {
            var hash = window.location.hash.replace('#', '');

            if (typeof NS.UI[hash] == 'undefined')
            {
                NS.UI[hash] = [];
                NS.UI[hash].SelectedPRs = [];
                NS.UI[hash].SelectedItems = [];
            }

            sender.each(function ()
            {
                var me = $(this);

                var target = $(me.attr("data-target"));
                var rendered = me.attr("data-rendered");
                var group = $('[data-target="' + me.attr("data-target") + '"]');

                me
                    .unbind("click")
                    .bind("click", function ()
                    {
                        if (target.is(":visible")) return;

                        var cntr = [];
                        var valid = true;
                        var direction = "center-left";
                        var err = "<div class='message-error'>";

                        if (valid && $("#select-pr").length && $("#select-pr").is(":visible") && !$('#select-pr table input[type="checkbox"]:checked').length)
                        {
                            valid = false;
                            direction = "center-left";
                            cntr = $('#select-pr table input[type="checkbox"]:first');
                            err += "Start off by selecting Payment Requisitions you would like to group in the table below. Tip: You can click on this one to <b>get started</b>";
                        }

                        if (!valid)
                        {
                            err += "</div>";

                            NS.Sticky.StickyOne.addClass("error");
                            NS.Sticky.StickyOne.css({ "display": "none" });

                            NS.Sticky.Show(cntr, "We can't go next yet!", err, [], direction);
                            $('html, body').animate({ scrollTop: cntr.offset().top - 150 }, 'slow', function () { cntr.focus(); });

                            return valid;
                        }
                        else
                        {
                            Show(sender, me, target);
                        }

                        return false;
                    });

                if (typeof NS.UI[hash] == 'undefined')
                {
                    NS.UI[hash] = [];
                    NS.UI[hash].SelectedPRs = [];
                    NS.UI[hash].SelectedItems = [];
                }

                if ($("#select-pr").length && typeof (NS.UI[hash].SelectedItems) != 'undefined')
                {
                    ReIndex($("#select-pr"));
                    RestoreSelectedItems($("#select-pr"), $("#group-pr"));
                }

                function ReIndex(target)
                {
                    target.find('table tbody input[type="checkbox"]')
                        .unbind("change")
                        .bind("change", function ()
                        {
                            NS.UI.DataIndex(target.find('input[type="checkbox"]:checked'));

                            var ind = SelectedItemExist($(this).val());

                            if (!$(this).is(":checked") && ind >= 0)
                            {
                                NS.UI[hash].SelectedItems.splice(ind, 1);
                            }

                            if ($("#select-pr").length && $('#select-pr table input[type="checkbox"]:checked').length)
                            {
                                $('#select-pr table input[type="checkbox"]:checked').each(function ()
                                {
                                    if (typeof $(this).attr("data-id") === 'undefined') return;

                                    var id = $(this).val();
                                    var number = $(this).parent().parent().find("#pr-number-span").text() || '';

                                    if (SelectedItemExist(id) < 0)
                                    {
                                        NS.UI[hash].SelectedItems.push({ "Id": id, "Number": number });
                                    }
                                });
                            }

                            if (target.find("#sel-pr-count").length)
                            {
                                target.find("#sel-pr-count").text(NS.UI[hash].SelectedItems.length);
                            }
                        });

                    if (target.find("#sel-pr-count").length)
                    {
                        target.find("#sel-pr-count").text(NS.UI[hash].SelectedItems.length);
                    }
                }

                function SelectedItemExist(id)
                {
                    for (var i = 0; i < NS.UI[hash].SelectedItems.length; i++)
                    {
                        if (NS.UI[hash].SelectedItems[i].Id === id) return i;
                    }

                    return -1;
                }

                function Show(sender, me, target)
                {
                    sender.removeClass("active");//pr-number-span

                    $(".step").css("display", "none");
                    target.css("display", "block");
                    me.add('[data-target="' + me.attr("data-target") + '"]').addClass("active").attr("data-rendered", "1");

                    target.find("#pr-preview").html('');

                    RestoreSelectedItems($("#select-pr"), $("#group-pr"));

                    if ($("#select-pr").length && me.attr("data-number") === "2")
                    {
                        target.find("#details").html('<em id="sel-pr-loader" class="block" style="text-align: center;"></em>');

                        NS.Loader.Show(target.find("#details #sel-pr-loader"), false);

                        var params = "";

                        for (var i = 0; i < NS.UI[hash].SelectedItems.length; i++)
                        {
                            if (params !== "")
                            {
                                params = params + "&";
                            }

                            params = params + "PRIds=" + NS.UI[hash].SelectedItems[i].Id;
                        }

                        $.get(siteurl + "/PaymentInstruction?" + params, {}, function (data, status, req)
                        {
                            target.find("#details").html(data);

                            target.find("#pr-preview").show(1200);

                            NS.Loader.Hide();
                            me.attr("data-loaded", "1");

                            //var amt = target.find("#details #pi-calculatedtotal").val().replace(/,/g, ".").replace(/ /g, "");

                            //target.find("#details #pi-amount").val(parseFloat(amt));
                            //target.find("#details #pi-calculatedtotal").val(parseFloat(amt));

                            NS.Init.PluginInit(target);
                            NS.UI.DataGroupPrAmount(target.find("#details").find('*[data-group-pr-amount="1"]'));

                            NS.UI.DataValMax($('*[data-val-length-max]'));
                            NS.UI.DataAjaxForm($('*[data-ajax-form="1"]'));
                        });
                    }

                    target.animate({ scrollTop: target.offset().top - 50 }, 'slow', function () { });
                }

                function RestoreSelectedItems(target, preview)
                {
                    if (NS.UI[hash].SelectedItems.length)
                    {
                        for (var i = 0; i < NS.UI[hash].SelectedItems.length; i++)
                        {
                            if (typeof NS.UI[hash].SelectedItems[i].Id === 'undefined') return;

                            var inp = '<input name="SelectedPRList[' + i + ']" type="hidden" value="' + NS.UI[hash].SelectedItems[i].Id + '" />';
                            var s = '<span style="display: inline-block; border: 1px dashed #ddd; border-radius: 2px; padding: 4px; margin: 0 4px; 4px 0;">';
                            s += NS.UI[hash].SelectedItems[i].Number.trim();
                            s += '<span style="padding: 0 4px;">|</span>';
                            s += NS.UI[hash].SelectedItems[i].Amount;
                            s += '</span>';

                            preview.find("#pr-preview").append(s);
                            preview.find("#pr-preview").append(inp);

                            if (target.find('input[type="checkbox"][data-id="' + NS.UI[hash].SelectedItems[i].Id + '"]').length)
                            {
                                target.find('input[type="checkbox"][data-id="' + NS.UI[hash].SelectedItems[i].Id + '"]')
                                    .prop("checked", true)
                                    .attr("checked", "checked");
                            }
                        }
                    }
                }
            });

            //sender.first().click();
        },

        DataHover: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var oupa = i.parent();

                if (oupa.hasClass("disabled")) return;

                var src = i.attr("data-src");
                var originalSrc = i.attr("src");

                i
                    .unbind("moouseout")
                    .unbind("moouseover")

                    .bind("mouseout", function ()
                    {
                        i.attr("src", originalSrc);
                    })
                    .bind("mouseover", function ()
                    {
                        i.attr("src", src);
                    });
            });
        },

        DataRefresh: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var target = ($('.ap-tabs li a[data-target="' + i.attr("data-target") + '"]').length) ? $('.ap-tabs li a[data-target="' + i.attr("data-target") + '"]') :
                    ($('.collapse strong[data-target="' + i.attr("data-target") + '"]').length) ? $('.collapse strong[data-target="' + i.attr("data-target") + '"]') :
                        $(i.attr("data-target"));

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        NS.UI.ClearCustomSearch(i.attr("data-target").replace("#", ""));

                        var atarget = $(target.attr("data-target"));

                        atarget.html("");
                        target.attr("data-rendered", 0);
                        target.click();
                        $(".tipsy").remove();

                        NS.UI.SelectedItems = [];
                    });
            });
        },

        DataGetQueryString: function (key)
        {
            if (window.location.search == "")
            {
                return "";
            }

            var search = window.location.search.replace("?", "").split("&");

            for (var ix = 0; ix < search.length; ix++)
            {
                var xxs = search[ix].split("=");

                if (xxs[0].toLowerCase() == key.toLowerCase())
                {
                    return xxs[1];
                }
            }

            return "";
        },

        DataPartialLoad: function (sender, group)
        {
            var count = 1;

            sender.each(function ()
            {
                var i = $(this);

                var url = i.attr("data-load-url");
                var target = $(i.attr("data-target"));

                var rendered = parseInt(i.attr("data-rendered"));

                if (rendered === 1 || count > 1)
                {
                    if (target.find('[data-collapse="1"]').length)
                    {
                        //target.find('[data-collapse="1"]').first().click();
                    }

                    return true;
                }

                url = (url.indexOf("/") !== -1) ? url : siteurl + url;

                var load = '<div class="partial-loading"><img alt="" src="' + imgurl + '/images/loader.gif" /></div>';
                var spinner = '<div class="spinner"><img alt="" src="' + imgurl + '/images/spinner.gif" /></div>';

                var results = '<div class="partial-results"></div>';

                target.append(load);
                target.append(results);

                var by = null;

                if (window.location.search !== "")
                {
                    var search = window.location.search.replace("?", "").split("&");
                    for (var ix = 0; ix < search.length; ix++)
                    {
                        var xxs = search[ix].split("=");

                        if (xxs[0].toLowerCase() === "skip")
                        {
                            NS.UI.PageSkip = xxs[1];
                        }
                        if (xxs[0].toLowerCase() === "prid")
                        {
                            NS.UI.PageViewId = xxs[1];
                        }
                        if (xxs[0].toLowerCase() === "budgetyear")
                        {
                            by = xxs[1];
                            NS.UI.PageBudgetYear = xxs[1];
                        }
                    }
                }

                target.find(".partial-loading").stop().animate({
                    "opacity": "1",
                    "width": "100%",
                    "padding": "20px 0",
                    "filter": "alpha(opacity=100)"
                }, 1200, function ()
                    {
                        i.parent().prepend(spinner);

                        group.addClass("not-allowed");
                        target.find(".partial-results").stop().load(url, { skip: NS.UI.PageSkip, PRId: NS.UI.PageViewId, BudgetYear: by }, function (r, s, xhr)
                        {
                            if (s === "error")
                            {
                                NS.Modal.Open(xhr.responseText, xhr.statusText, false, NS.Init.Start());

                                return;
                            }

                            var table = $(this).find("table.datatable-numberpaging");

                            // Tables Excused...
                            if (table.find("tbody tr td").length > 1)
                            {
                                var sort = table.hasClass("sort");

                                table.dataTable({
                                    bPaginate: false,
                                    bSort: false,
                                    iDisplayLength: 50,
                                    "fnDrawCallback": function ()
                                    {
                                        NS.UI.Start();
                                    }
                                });
                            }

                            $(this).stop().animate({
                                "opacity": "1",
                                "width": "100%",
                                "filter": "alpha(opacity=100)"
                            }, 1200, function ()
                                {

                                });

                            target.find(".partial-loading").remove();

                            i.attr("data-rendered", 1);
                            i.parent().find(".spinner").stop().fadeOut(1000, function () { $(this).remove(); });

                            NS.Init.Start(true);
                            NS.UI.DataTablesOverride(target);

                            group.removeClass("not-allowed");
                        });
                    });

                count++;
            });
        },

        DataAjaxForm: function (sender)
        {
            var sd = "#supportingdoc";
            var prev = "#report-preview";
            var ustructure = "#userstructure";

            var islink = false, ispreview = false, isstructure = false;

            sender.each(function ()
            {
                var i = $(this);

                var target = $(i.attr("data-target"));

                var options =
                {
                    target: target, // target element to be updated with server response
                    beforeSubmit: function (formData, jqForm, options)
                    {
                        islink = (i.find("#islink").length > 0 && i.find("#islink").val() == "True");
                        ispreview = (i.find("#ispreview").length > 0 && i.find("#ispreview").val() == "True");
                        isstructure = (i.find("#isstructure").length > 0 && i.find("#isstructure").val() == "True");

                        if (i.hasClass("custom-validate") && !NS.UI.DataValidateForm(jqForm))
                        {
                            return false;
                        }

                        if (islink)
                        {
                            options.target = sd;
                        }
                        else if (ispreview)
                        {
                            options.target = prev;
                        }
                        else if (isstructure)
                        {
                            options.target = ustructure;
                        }
                        else
                        {
                            options.target = target;
                        }

                        NS.Loader.Show((islink || ispreview || isstructure) ? i.find('#sdoc-btn') : i.find('#save-btn'), true);

                    },  // pre-submit callback 
                    success: function (data, status, f)
                    {
                        var hash = window.location.hash.replace('#', '');

                        NS.UI.SelectedPRs = [];
                        NS.UI.SelectedItems = [];

                        if (typeof NS.UI[hash] !== 'undefined')
                        {
                            NS.UI[hash].SelectedPRs = [];
                            NS.UI[hash].SelectedItems = [];
                        }

                        NS.Init.PluginLoaded = false;
                        NS.Init.Start();

                        if (islink)
                        {
                            var xsd = $('li a[data-target="#supportingdoc"]');
                            var xtarget = $(xsd.attr("data-target"));

                            $(xsd.attr("data-tab-holder")).find(">div.current").css("display", "none");

                            xtarget.fadeIn(1200, function ()
                            {
                                $(this).addClass("current");
                                xsd.attr("data-rendered", 1).addClass("current");
                            });

                            var xpr = $('li a[data-target="#paymentrequisition"]');
                            xpr.removeClass("current");

                            window.location.hash = xsd.attr("data-target");

                            setTimeout(function ()
                            {
                                NS.UI.Get([], $(xpr.attr("data-target")), "/PaymentRequisition/List", {}, {}, false);
                            }, '5000');
                        }

                        else if (ispreview)
                        {
                            $("#report-preview a").click();
                        }

                        else if (isstructure)
                        {
                            NS.UI.DataSwitchTabs("#manageusers", "#userstructure");

                            setTimeout(function ()
                            {
                                $(ustructure + " #Branch").change();

                                $("#manageusers").html("");
                                $('li a[data-target="#manageusers"]').attr("data-rendered", 0);
                            }, '2000');
                        }

                    },  // post-submit callback
                    error: function (data)
                    {
                        var cntr = (islink || ispreview || isstructure) ? i.find('#sdoc-btn') : i.find('#save-btn');

                        NS.Sticky.StickyOne.addClass("error");
                        NS.Sticky.StickyOne.css({ "display": "none" });

                        NS.Sticky.Show(cntr, "Oops! Something went wrong", data, NS.Init.Start(), "bottom-left");
                    }
                };

                i.ajaxForm(options);
            });
        },

        DataSwitchTabs: function (from, to)
        {
            var xpr = $('li a[data-target="' + from + '"]');
            var xsd = $('li a[data-target="' + to + '"]');

            var xtarget = $(xsd.attr("data-target"));

            xpr.removeClass("current");
            $(from).removeClass("current").css("display", "none");

            xtarget.fadeIn(1200, function ()
            {
                $(this).addClass("current");
                xsd.attr("data-rendered", 1).addClass("current");
            });

            window.location.hash = xsd.attr("data-target");
        },

        DataDeleteImage: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var pid = i.attr("data-pid");
                var url = i.attr("data-url");
                var vid = i.attr("data-vid");

                var p = i.closest("p");
                var target = $(i.attr('data-target') + ":visible");

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        $(".tipsy").remove();

                        if (pid == "-1")
                        {
                            var d = p.find('textarea');
                            var f = p.find('input[type="file"]');
                            var img = p.find('img.preview');

                            if (f.val() != "")
                            {
                                f.val("");
                                d.val("");
                                img.attr("src", img.attr("data-original-src"));
                            }

                            return;
                        }

                        var msg = "";

                        var title = "Delete this image?";
                        msg += "<p style='margin: 0;'>Are you sure you would like to delete this image?<br />The image will indeed be gone for good!</p>";
                        msg += '<div style="border-bottom: 1px dashed #ccc; margin-bottom: 10px; height: 0;" class="clear">&nbsp;</div>';
                        msg += "<input id='del-no' type='button' value='No!' style='background: #000000;' /><span style='padding: 0 6px;'>/</span><input id='del-yes' type='button' value='YES' />";

                        NS.Sticky.StickyOne.css({ "display": "none" });
                        NS.Sticky.Show(i, title, msg, [], "center-right");

                        var m = NS.Sticky.StickyOne.find(".sticky-data");

                        var no = m.find("#del-no");
                        var yes = m.find("#del-yes");

                        no
                            .unbind("click")
                            .bind("click", function ()
                            {
                                NS.Sticky.Hide();
                            });

                        yes
                            .unbind("click")
                            .bind("click", function ()
                            {
                                NS.Loader.Show(i, true);

                                target.load(url, { pid: pid, vid: vid }, function ()
                                {
                                    NS.Sticky.Hide();
                                    NS.Loader.Hide();
                                    NS.Init.Start(true);
                                });
                            });

                        return false;
                    });
            });
        },

        DataUploadImage: function (sender)
        {
            sender.each(function ()
            {
                var btn = $(this);

                btn
                    .unbind("change")
                    .bind("change", function (evt)
                    {
                        var a = btn.parent().find(">a");
                        var img = a.find("img");
                        var desc = btn.parent().find("textarea");

                        var files = evt.target.files; // FileList object

                        // Loop through the FileList and render image files as thumbnails.
                        for (var i = 0, f; f = files[i]; i++)
                        {
                            // Only process image files.
                            if (!f.type.match('image.*'))
                            {
                                continue;
                            }

                            var reader = new FileReader();

                            reader.onload = (function (file)
                            {
                                return function (e)
                                {
                                    desc.val(file.name);

                                    a.attr({ "href": e.target.result, "title": file.name });

                                    img.attr({ "src": e.target.result, "alt": file.name });
                                };
                            })(f);

                            // Read in the image file as a data URL.
                            reader.readAsDataURL(f);
                        }

                        setTimeout(function ()
                        {
                            NS.Init.Start(true);
                            btn.removeClass("input-validation-error");
                        }, "200");
                    });
            });
        },

        DataShowHide: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var show = $(i.attr("data-show"));
                var hide = $(i.attr("data-hide"));

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        //if (show.is(":visible")) show.css("display", "none");

                        hide.css("display", "none");
                        show.fadeIn(1200);
                    });
            });
        },

        DataAddOneMore: function (sender)
        {
            // Add one more image kiara@sheenah1
            sender.each(function ()
            {
                var i = $(this);

                var target = $(i.attr('data-target') + ":visible");
                var autoIncrement = i.attr('data-auto-increment');

                i.unbind('click');
                i.click(function ()
                {
                    var total = 1;
                    var html = "";
                    var clone = [];

                    if (target.is("tr"))
                    {
                        var papa = target.parent();

                        clone = papa.find(".add-more-row:first").clone();
                        var inputs = clone.find('.input, input[type="hidden"], input[type="text"], input[type="password"], select, textarea');

                        inputs.each(function ()
                        {
                            $(this).val("");

                            if ($(this).is("select"))
                            {
                                $(this).find("option").removeAttr("selected");
                            }
                        });

                        // Extra clean up
                        clone.find('[data-warn="1"]').remove();
                        clone.find('[data-ob="1"]').text('-/-');
                        clone.find('[data-rb="1"]').text('-/-');
                        clone.find('[data-pr-amount="1"]').css('width', '88%');

                        total = papa.find(".add-more-row").length;

                        html = clone.html().replace(/\[0]/g, "[" + total + "]").replace(/\-0-/g, "-" + total + "-");
                        clone.html(html);

                        clone.find('.slick-counter').html('');
                        clone.find('.input, input[type="hidden"], input[type="text"], input[type="password"], select, textarea').val("");

                        NS.UI.RecreatePlugins(clone);

                        clone.insertAfter(papa.find(".add-more-row:last"));

                        clone.find('a[data-add-one-more="1"]').fadeOut(1200, function ()
                        {
                            $(this).remove();
                        });

                        papa.find('a[data-add-one-more="1"]').fadeOut(1200, function ()
                        {
                            var f = clone.find("td:first").children(":first");
                            $(this).insertBefore(f).fadeIn(1200);
                        });
                    }
                    else
                    {
                        // Get clone instance as a jquery object
                        clone = target.children().first().clone();

                        // Check if this clone needs auto incrementing for it's element id or name
                        if (autoIncrement != undefined && autoIncrement == "1")
                        {
                            // Get elements total count
                            total = target.find('*[data-increment="1"]').length;

                            // Great, sneak through the element name or id and increment
                            html = clone.html().replace(/\[0]/g, "[" + total + "]").replace(/\_0_/g, "_" + total + "_");
                            clone.html(html);

                            /*clone.find("img").attr("src", "");
                            clone.find("a").attr("href", "#");*/
                            clone.find('input[type="file"],input[type="text"],input[type="hidden"],textarea,select').val("");

                            clone.find("#invoice-details, #writeoff-details").css("display", "none");
                            clone.find("#invoice-details, #writeoff-details").each(function ()
                            {
                                $(this)
                                    .find('input[type="file"],input[type="text"],input[type="hidden"],textarea,select')
                                    .removeAttr("required");
                            });
                        }

                        // Append clone to the defined target like so:
                        clone.appendTo(target);
                    }

                    // Restart JT JS DOM
                    NS.Init.Start();

                    return false;
                });
            });
        },

        DataDelOneMore: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);
                var remove = $(i.attr("data-target"));

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        if (!remove.length) return;

                        if ($("#doc-upload").find(".grouped-area").length < 2) return;

                        remove.hide(1200, function ()
                        {
                            $(this).parent().remove();

                            $("#doc-upload").find(".grouped-area").each(function (i)
                            {
                                NS.UI.DataIndex($(this).find('input,select,textarea,label,a,div[data-del-holder="1"]'), i);
                            });

                            NS.UI.DataDelOneMore($('*[data-del-one-more="1"]'));
                        });
                    });
            });
        },

        DataModal: function (params)
        {
            params.each(function ()
            {
                var i = $(this);

                i
                    .unbind('click')
                    .bind('click', function ()
                    {
                        if (NS.Modal.MovedObj.length)
                        {
                            NS.Modal.MovedObj.appendTo(NS.Modal.MovedObjSource);
                        }

                        $(NS.Modal.Container).find('#modal-body').html('');
                        $(NS.Modal.Container).find('#modal-title').html('');

                        var title = i.attr('data-title');
                        var data = $(i.attr('data-target'));

                        NS.Modal.MovedObj = data.children();
                        NS.Modal.MovedObjSource = data;

                        data.children().appendTo($(NS.Modal.Container).find('#modal-body'));

                        NS.Modal.Open(null, title);

                        NS.StartUp.Start();

                        return false;
                    });
            });
        },

        DataStickyOne: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var t = i.attr("data-t");
                var arrow = i.attr("data-arrow");
                var title = i.attr("data-title");
                var trigger = i.attr("data-trigger");
                var callback = i.attr("data-callback");

                var target = $(i.attr("data-target"));

                if (!target.length) return;

                i
                    .unbind(trigger)
                    .bind(trigger, function ()
                    {
                        $(".tipsy").remove();
                        NS.Sticky.Show(i, title, target.html(), [], arrow);

                        NS.Init.PluginInit(NS.Sticky.StickyOne);
                        NS.UI.DataShowSelected($('*[data-show-selected="1"]'));

                        if (typeof (callback) === typeof (Function))
                        {
                            try
                            {
                                callback();
                            }
                            catch (e)
                            {
                                eval(callback);
                            }
                        }
                        else
                        {
                            eval(callback);
                        }
                    });
            });
        },

        DataCustomSearch: function (sender, target)
        {
            var t = sender.attr("data-t").replace("#", "");

            target.each(function ()
            {
                var f = $(this);

                var form = f.find("form");

                NS.UI.RecreatePlugins(f);

                f.animate({ "opacity": "1", "filter": "alpha(opacity=100)" }, 1000, function () { });

                NS.UI[t].PageSkip = 0;
                NS.UI[t].PageNumber = 0;

                NS.Init.AppendPaging(form, t);
            });
        },

        RecreatePlugins: function (sender)
        {
            // Destroy any select 2
            sender.find("div.chzn").remove();
            sender.find("select.chzn").css("display", "block");

            sender.find("select.chzn, input.date-picker").each(function (i)
            {
                $(this).removeClass("hasDatepicker");
                $(this).attr("id", $(this).attr("id") + "_" + i);
            });

            NS.Init.PluginInit(sender);
        },

        DataDoCustomSearch: function (sender, target, url, callback)
        {
            // Params
            var params = NS.UI.GetCustomSearchParams(target.attr("id"));

            NS.UI.Get(sender, target, url, params, callback, true);

            NS.UI.SelectedItems = [];

            return false;
        },

        GetCustomSearchParams: function (t)
        {
            // Params
            var params = {
                Skip: NS.UI[t].PageSkip || NS.UI.PageSkip || 0,
                Take: NS.UI[t].PageLength || NS.UI.PageLength || 50,
                Page: NS.UI[t].PageNumber || NS.UI.PageNumber || 0,
                Sort: NS.UI[t].PageSort || NS.UI.PageSort || "ASC",
                SortBy: NS.UI[t].PageSortBy || NS.UI.PageSortBy || "Id",
                PRId: NS.UI[t].PagePRId || NS.UI.PagePRId || 0,
                PRNumber: NS.UI[t].PagePRNumber || NS.UI.PagePRNumber || "",
                UserId: NS.UI[t].PageUserId || NS.UI.PageUserId || 0,
                BudgetYear: NS.UI[t].PageBudgetYear || NS.UI.PageBudgetYear || '',
                SupplierId: NS.UI[t].PageSupplierId || NS.UI.PageSupplierId || 0,
                SelectedPRs: NS.UI.SelectedPRs || [],
                SelectedItems: NS.UI[t].SelectedItems || NS.UI.SelectedItems || [],
                FundingCompanyId: NS.UI[t].PageFundingCompanyId || NS.UI.PageFundingCompanyId || 0,
                IncomeStream: NS.UI[t].PageIncomeStream || NS.UI.PageIncomeStream || "",
                FromDate: NS.UI[t].PageFromDate || NS.UI.PageFromDate || "",
                ToDate: NS.UI[t].PageToDate || NS.UI.PageToDate || "",
                POPStatus: NS.UI[t].PagePOPStatus || NS.UI.PagePOPStatus || -1,
                PRStatus: NS.UI[t].PagePRStatus || NS.UI.PagePRStatus || -1,
                ActionDate: NS.UI[t].PageActionDate || NS.UI.PageActionDate || "",
                PaymentStatus: NS.UI[t].PagePaymentStatus || NS.UI.PagePaymentStatus || -1,
                PaymentMethod: NS.UI[t].PagePaymentMethod || NS.UI.PagePaymentMethod || -1,
                PaymentFrequency: NS.UI[t].PagePaymentFrequency || NS.UI.PagePaymentFrequency || -1,
                Branch: NS.UI[t].PageBranch || NS.UI.PageBranch || "",
                DirectorateProject: NS.UI[t].PageDirectorateProject || NS.UI.PageDirectorateProject || "",
                DepartmentSubProject: NS.UI[t].PageDepartmentSubProject || NS.UI.PageDepartmentSubProject || "",
                Bank: NS.UI[t].PageBank || NS.UI.PageBank || -1,
                Account: NS.UI[t].PageAccount || NS.UI.PageAccount || "",
                AccountType: NS.UI[t].PageAccountType || NS.UI.PageAccountType || "",
                DocumentType: NS.UI[t].PageDocumentType || NS.UI.PageDocumentType || "",
                ExpenseType: NS.UI[t].PageExpenseType || NS.UI.PageExpenseType || "",
                VAT: NS.UI[t].PageVAT || NS.UI.PageVAT || false,
                Authlevel: NS.UI[t].PageAuthlevel || NS.UI.PageAuthlevel || -1,
                ActivityType: NS.UI[t].PageActivityType || NS.UI.PageActivityType || -1,
                RoleType: NS.UI[t].PageRoleType || NS.UI.PageRoleType || -1,
                Province: NS.UI[t].PageProvince || NS.UI.PageProvince || -1,
                CheckedByFinance: NS.UI[t].PageCheckedByFinance || NS.UI.PageCheckedByFinance || -1,
                City: NS.UI[t].PageCity || NS.UI.PageCity || "",
                EventId: NS.UI[t].PageEventId || NS.UI.PageEventId || "",
                Query: NS.UI[t].PageQuery || NS.UI.PageQuery || "",
                ReturnView: NS.UI[t].PageReturnView || NS.UI.PageReturnView || "",
                Controller: NS.UI[t].PageController || NS.UI.PageController || "",
                TableName: NS.UI[t].PageTableName || NS.UI.PageTableName || "",
                ControllerName: NS.UI[t].PageControllerName || NS.UI.PageControllerName || "",
                IsCustomSearch: NS.UI[t].IsCustomSearch || NS.UI.IsCustomSearch || false,
                FinCheckComplete: NS.UI[t].PageFinCheckComplete || NS.UI.PageFinCheckComplete || false,
                FinCheckInComplete: NS.UI[t].PageFinCheckInComplete || NS.UI.PageFinCheckInComplete || false
            };

            return params;
        },

        ClearCustomSearch: function (t)
        {
            if (t === "") return;

            if (!NS.UI[t])
            {
                NS.UI[t] = [];
            }

            NS.UI[t].PageSkip = NS.UI.PageSkip = 0;
            NS.UI[t].PageNumber = NS.UI.PageNumber = 1;
            NS.UI[t].PageLength = NS.UI.PageLength = 50;
            NS.UI[t].PageSort = NS.UI.PageSort = "ASC";
            NS.UI[t].PageSortBy = NS.UI.PageSortBy = "Id";
            NS.UI[t].PagePRId = NS.UI.PagePRId = 0;
            NS.UI[t].PagePRNumber = NS.UI.PagePRNumber = "";
            NS.UI[t].PageUserId = NS.UI.PageUserId = 0;
            NS.UI.SelectedPRs = NS.UI.SelectedPRs = [];
            NS.UI[t].SelectedItems = NS.UI.SelectedItems = [];
            NS.UI[t].PageSupplierId = NS.UI.PageSupplierId = 0;
            NS.UI[t].PageBudgetYear = NS.UI.PageBudgetYear = '';
            NS.UI[t].PageFundingCompanyId = NS.UI.PageFundingCompanyId = 0;
            NS.UI[t].PageIncomeStream = NS.UI.PageIncomeStream = "";
            NS.UI[t].PageFromDate = NS.UI.PageFromDate = "";
            NS.UI[t].PageToDate = NS.UI.PageToDate = "";
            NS.UI[t].PageActionDate = NS.UI.PageActionDate = "";
            NS.UI[t].PagePRStatus = NS.UI.PagePRStatus = -1;
            NS.UI[t].PagePOPStatus = NS.UI.PagePOPStatus = -1;
            NS.UI[t].PagePaymentStatus = NS.UI.PagePaymentStatus = -1;
            NS.UI[t].PagePaymentMethod = NS.UI.PagePaymentMethod = -1;
            NS.UI[t].PagePaymentFrequency = NS.UI.PagePaymentFrequency = -1;
            NS.UI[t].PageBranch = NS.UI.PageBranch = "";
            NS.UI[t].PageDirectorateProject = NS.UI.PageDirectorateProject = "";
            NS.UI[t].PageDepartmentSubProject = NS.UI.PageDepartmentSubProject = "";
            NS.UI[t].PageBank = NS.UI.PageBank = -1;
            NS.UI[t].PageAccount = NS.UI.PageAccount = "";
            NS.UI[t].PageAccountType = NS.UI.PageAccountType = "";
            NS.UI[t].PageExpenseType = NS.UI.PageExpenseType = "";
            NS.UI[t].PageDocumentType = NS.UI.PageDocumentType = "";
            NS.UI[t].PageVAT = false;
            NS.UI[t].PageAuthlevel = NS.UI.PageAuthlevel = -1;
            NS.UI[t].PageActivityType = NS.UI.PageActivityType = -1;
            NS.UI[t].PageRoleType = NS.UI.PageRoleType = -1;
            NS.UI[t].PageProvince = NS.UI.PageProvince = -1;
            NS.UI[t].PageCheckedByFinance = NS.UI.PageCheckedByFinance = -1;
            NS.UI[t].PageCity = NS.UI.PageCity = "";
            NS.UI[t].PageEventId = NS.UI.PageEventId = "";
            NS.UI[t].PageQuery = NS.UI.PageQuery = "";
            NS.UI[t].PageTableName = NS.UI.PageTableName = "";
            NS.UI[t].PageControllerName = NS.UI.PageControllerName = "";
            NS.UI[t].PageReturnView = NS.UI.PageReturnView = "_List";
            NS.UI[t].PageController = NS.UI.PageController = "DashBoard";
            NS.UI[t].IsCustomSearch = NS.UI.IsCustomSearch = false;
            NS.UI[t].PageFinCheckComplete = NS.UI.PageFinCheckComplete = "false";
            NS.UI[t].PageFinCheckInComplete = NS.UI.PageFinCheckInComplete = "false";

            return true;
        },

        BeginCustomSearch: function (sender)
        {
            NS.Loader.Show(sender.find("#save-btn"), true);

            if (sender.find("#ReturnView").length)
            {
                var t = sender.find("#ReturnView").val().replace("_", "").toLowerCase();

                NS.UI[t] = NS.UI[t] || [];

                sender.find('select,textarea,input[type="text"],input[type="checkbox"],input[type="hidden"]').each(function ()
                {
                    var i = $(this);

                    var id = i.attr("id");

                    if (typeof (id) == "undefined") return;

                    id = "Page" + id.split("_")[0];

                    NS.UI[t][id] = i.val();

                    if ($(this).is(":checkbox") || $(this).is(":radio"))
                    {
                        NS.UI[t][id] = $(this).is(":checked");
                    }
                });

                NS.UI[t].IsCustomSearch = true;
            }
        },

        CompleteCustomSearch: function (sender)
        {
            NS.Sticky.Hide();
            NS.Init.Start(true);
        },

        DataHighlightFields: function (target)
        {
            target.find(".display-field, .editor-field input, .editor-field select, .editor-field textarea").css("background", "#bef2bb").animate(
                {
                    "opacity": "0.1",
                    "filter": "alpha(opacity=10)"
                }, 1000, function ()
                {
                    $(this).css("background", "#ffffff").animate(
                        {
                            "opacity": "1",
                            "filter": "alpha(opacity=100)"
                        }, 1000);
                });
        },

        DataPartialImages: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var rendered = parseInt(i.attr("data-rendered"));

                if (rendered == 1) return;

                var vid = i.attr("data-vid");
                var url = i.attr("data-url");
                var view = (i.attr("data-view") == "view");

                i.attr("data-rendered", 1);

                i.append("<span></span>");

                NS.Loader.Show(i.find("span"), true);

                $.get(siteurl + url, { vid: vid, view: view }, function (data, status, req)
                {
                    i.html(data);

                    NS.Init.Start(true);

                }).error(function ()
                {

                }).fail(function ()
                {

                });
            });
        },



        /** Table CRUD Operations **/
        DataEdit: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var id = i.attr("data-id");
                var target = i.closest(i.attr("data-target")).first();

                if (!target.length)
                {
                    target = $(i.attr("data-target"));
                }

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        var url = i.attr("href");

                        var load = false;
                        if (target.parent().is("div"))
                        {
                            load = true;
                            newTarget = target;
                            loader = target.find("span.loader");
                        }
                        else
                        {
                            target.parent().find('tr.edit').remove();

                            var columns = $('table.datatable-numberpaging tbody tr:nth-child(1) td').length;
                            var row = '<tr id="tr-edit" class="edit ' + target.attr('class') + '"><td id="editing-td" colspan="' + columns + '"><span></span></td></tr>';

                            target.after(row);

                            newTarget = target.parent().find('tr.edit td');
                            loader = newTarget.find("span");
                        }

                        try
                        {
                            NS.UI.Get(loader, newTarget, url, {}, {}, load);
                        }
                        catch (e)
                        {
                            alert(JSON.stringify(e));
                        }

                        return false;
                    });

            });
        },

        DataDetails: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var id = i.attr("data-id");
                var target = i.closest(i.attr("data-target")).first();

                if (!target.length)
                {
                    target = $(i.attr("data-target"));
                }

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        var hasQ = (i.attr("href").indexOf('?') > -1);

                        var url = (hasQ) ? i.attr("href") + "&layout=false" : i.attr("href") + "?layout=false";

                        target.parent().find('tr.edit').remove();

                        var columns = $('table.datatable-numberpaging tbody tr:nth-child(1) td').length;
                        var row = '<tr id="tr-edit" class="edit ' + target.attr('class') + '"><td colspan="' + columns + '"><span></span></td></tr>';

                        target.after(row);
                        target = target.parent().find('tr.edit td');

                        try
                        {
                            NS.UI.Get(target.find("span"), target, url, {});
                        }
                        catch (e)
                        {
                            
                        }

                        return false;
                    });
            });
        },

        DataDelete: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var id = i.attr("data-id");
                var target = i.closest(i.attr("data-target"));
                if (!target.length)
                {
                    target = $(i.attr("data-target"));
                }

                var refresh = i.closest(i.attr("data-refresh-target"));
                if (!refresh.length)
                {
                    refresh = $(i.attr("data-refresh-target"));
                }

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        NS.UI.DeleteFix(i, target, refresh);
                        return false;
                    });
            });
        },

        DataCancelItem: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var id = i.attr("data-id");
                var isAdmin = i.attr("data-is-admin").toLowerCase();

                var target = $(i.attr("data-target"));
                var refresh = $(i.attr("data-refresh"));

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        var title = "Delete/Cancel this item?";
                        var msg = '<p style="margin: 0;">Are you sure you would like to delete/cancel this item?';

                        if (isAdmin === "true")
                        {
                            msg += ' If yes, please provide a brief reason below (Max: 250):';
                            msg += '</p>';
                            msg += '<p style="margin-top: 10px;">';
                            msg += '    <input id="reason" type="text" placeholder="Enter a your brief reason here" />';
                            msg += '</p>';
                        }
                        else
                        {
                            msg += '</p>';
                        }

                        var btn = $(NS.Modal.Container).find('.btns #btnConfirm');

                        btn.val("Yes");

                        NS.Modal.Open(msg, title, true);

                        btn
                            .unbind("click")
                            .bind("click", function ()
                            {
                                var reason = $(NS.Modal.Container).find('#reason');

                                if (isAdmin === "true" && reason.val().trim() === "")
                                {
                                    reason.addClass("invalid").focus();

                                    return false;
                                }

                                var res = (isAdmin === "true") ? reason.val().trim().substr(0, 250) : "";

                                var url = sender.attr("href");

                                var columns = $('table.datatable-numberpaging tbody tr:nth-child(1) td').length;
                                var row = '<tr class="edit ' + target.attr('class') + '"><td colspan="' + columns + '"><span></span></td></tr>';

                                target.parent().find('tr.edit').remove();

                                target.after(row);

                                NS.Loader.Show(target.parent().find('tr.edit td span'));

                                refresh.load(url, { id: id, reason: res }, function ()
                                {
                                    $(".tipsy").remove();

                                    NS.Init.Start(true);
                                    NS.UI.DataHotSpot($('*[data-hot-spot="1"]'), true);
                                });

                                NS.Modal.Close();
                            });

                        return false;
                    });
            });
        },

        DeleteFix: function (sender, target, refresh)
        {
            var url = sender.attr("href");

            var columns = $('table.datatable-numberpaging tbody tr:nth-child(1) td').length;
            var row = '<tr class="edit ' + target.attr('class') + '"><td colspan="' + columns + '"><span></span></td></tr>';

            target.parent().find('tr.edit').remove();

            target.after(row);

            NS.Loader.Show(target.parent().find('tr.edit td span'));

            url = url + "?query=" + NS.UI.PageSearch + "&skip=" + NS.UI.PageSkip + "&take=" + NS.UI.PageLength + "&page=" + NS.UI.PageNumber;

            refresh.load(url, {}, function ()
            {
                $(".tipsy").remove();

                NS.Init.Start(true);
                NS.UI.DataHotSpot($('*[data-hot-spot="1"]'), true);
            });

            return false;
        },

        DataCancel: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var target = i.closest(i.attr("data-target"));
                var remove = i.closest(i.attr("data-remove"));

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        target.animate(
                            {
                                "width": "0",
                                "height": "0",
                                "opacity": "0",
                                "filter": "alpha(opacity=0)"
                            }, 700, function ()
                            {
                                remove.remove();
                            });

                        return false;
                    });
            });
        },

        DataFormSubit: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var form = $(i.attr("data-form"));

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        var valid = NS.Validation.Validate(i);

                        if (valid)
                        {
                            form.submit();
                        }
                        else
                        {
                            form.find("input").each(function ()
                            {
                                var i = $(this);
                                var id = i.attr("id");

                                var err = i.attr("data-error");
                                var errCntr = $('*[data-valmsg-for="' + id + '"]');

                                i.addClass("input-validation-error");

                                errCntr.removeClass("field-validation-valid");
                                errCntr.addClass("field-validation-error");

                                errCntr.html('<span for="' + i.attr("id") + '" generated="true">' + err + '</span>');
                            });
                        }

                        return false;
                    });
            });
        },

        DataHotSpot: function (sender, force)
        {
            return true;

            sender.each(function ()
            {
                var i = $(this);

                if (typeof i.attr("loaded") != undefined && i.attr("loaded") == "1" && !force) return;

                var j = { controller: i.attr("data-c"), tab: i.attr("data-t") };

                var h = "<img class='hot-spot' title='Hello, just busy updating this menu total.' alt='' src='" + imgurl + "/images/hot.gif' />";

                i.css("position", "relative").append(h);

                $.ajax({
                    url: siteurl + "/HotSpot",
                    type: "POST",
                    data: JSON.stringify(j),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    error: function (response)
                    {
                        i.find(".hot-spot").fadeOut(1200);
                    },
                    success: function (response)
                    {
                        var span = "<span class='hot-spot-total'>" + response.total + "</span>";
                        i.find(".hot-spot").fadeOut(1200, function ()
                        {
                            i.append(span);
                            i.attr("loaded", "1");
                        });
                    }
                });
            });
        },


        /** Table Quick Links Operations **/

        DataCheckOptions: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);
                var papa = $(i.parent());
                var mother = $(i.attr("data-mother"));
                var mykids = $(i.attr("data-my-kids"));

                var main = parseInt(i.attr("data-main"));

                i.unbind('change keyup');
                i.bind('change keyup', function ()
                {
                    if ((i.is(':checkbox') && i.is(':checked')) || (i.is(':text') && i.val() != ""))
                    {
                        if (main == 0)
                        {
                            papa.removeClass('message-warn');
                            papa.addClass('message-success');

                            //mother.prop("checked", true);
                        }
                        else
                        {
                            //mykids.prop("checked", true);

                            //mykids.parent().removeClass('message-warn');
                            //mykids.parent().addClass('message-success');
                            papa.parent().removeClass('message-warn');
                            papa.parent().addClass('message-success');

                        }
                    }
                    else
                    {
                        if (main == 0)
                        {
                            papa.addClass('message-warn');
                            papa.removeClass('message-success');
                        }
                        else
                        {
                            //mykids.removeAttr("checked");

                            //mykids.parent().addClass('message-warn');
                            //mykids.parent().removeClass('message-success');

                            if (papa.parent().find('input[type="hidden"]').length && papa.parent().find('input[type="hidden"]').val() != "0")
                            {
                                i.prop("checked", true).attr("checked", "checked");

                                var h = papa.parent().find('input[type="hidden"]');

                                var title = h.attr("data-title");
                                var message = '<p>' + h.attr("data-message") + '</p>';

                                message += '<p>';
                                message += '  <input id="yes-remove" value="Yes" type="button" class="yes-btn" />';
                                message += '  <span style="padding: 0 5px;">/</span>';
                                message += '  <input id="no-remove" value="NO!" type="button" class="no-btn" />';
                                message += '<p>';

                                NS.Sticky.Show(i, title, message, [], "center-left");

                                var no = NS.Sticky.StickyOne.find("#no-remove");
                                var yes = NS.Sticky.StickyOne.find("#yes-remove");

                                no
                                    .unbind("click")
                                    .bind("click", function ()
                                    {
                                        NS.Sticky.Hide();
                                    });

                                yes
                                    .unbind("click")
                                    .bind("click", function ()
                                    {
                                        NS.Loader.Show(yes, true);

                                        $.post(NS.UI.URL + h.attr("data-url"), { id: h.val() }, function (data)
                                        {
                                            NS.Loader.Hide();

                                            var d = $("<div/>").html(data);

                                            NS.Sticky.Show(i, d.find(".title").text(), d.find(".message").html(), [], "center-left");

                                            // Clear date values, if any...
                                            papa.parent().find(".date-picker").val("");
                                            i.prop("checked", false).removeAttr("checked");

                                            h.val(0);
                                            i.change();
                                        });
                                    });

                                return false;
                            }

                            papa.parent().removeClass('message-success');
                            papa.parent().addClass('message-warn');
                        }
                    }
                });
            });
        },



        /** PRIVATE LOCAL FUNCTIONS **/

        Get: function (sender, target, url, params, callback, loadImg, noAnminate)
        {
            loadImg = loadImg ? true : false;

            NS.Loader.Show(sender, loadImg);

            $.get(url, params, function (data, s, xhr)
            {
                if (s === "error")
                {
                    NS.Modal.Open(xhr.responseText, xhr.statusText, false, NS.Init.Start());

                    return;
                }

                target.html(data);

                // Update form data-target="#..."
                var form = target.find("form");

                if (form.length && target.closest(".da-tab").length)
                {
                    form.attr("data-target", "#" + target.closest(".da-tab").attr("id"));
                    form.append('<input type="hidden" value="' + target.closest(".da-tab").attr("data-load-url") + '" name="ReturnView">');
                }

                NS.Init.Start(true);

                $.validator.unobtrusive.parse(target);

                if (noAnminate === undefined)
                {
                    $('html, body').animate({ scrollTop: target.offset().top - 60 }, 'slow', function () { });
                }

                if (target.find(".dataTables_wrapper").length)
                {
                    NS.UI.DataTablesOverride(target);
                }

                NS.UI.DataCallBack(callback);

            }).fail(function (xhr)
            {
                NS.Modal.Open(xhr.responseText, xhr.statusText, false, NS.Init.Start());
            });
        },

        Post: function (sender, target, url, params, callback, loadImg, noAnminate)
        {
            loadImg = loadImg ? true : false;

            NS.Loader.Show(sender, loadImg);

            $.post(url, params, function (data, s, xhr)
            {
                if (s === "error")
                {
                    NS.Modal.Open(xhr.responseText, xhr.statusText, false, NS.Init.Start());

                    return;
                }

                target.html(data);

                // Update form data-target="#..."
                var form = target.find("form");

                if (form.length && target.closest(".da-tab").length)
                {
                    form.attr("data-target", "#" + target.closest(".da-tab").attr("id"));
                    form.append('<input type="hidden" value="' + target.closest(".da-tab").attr("data-load-url") + '" name="ReturnView">');
                }

                NS.Init.Start(true);

                $.validator.unobtrusive.parse(target);

                if (noAnminate === 'undefined')
                {
                    $('html, body').animate({ scrollTop: target.offset().top - 60 }, 'slow', function () { });
                }

                NS.UI.DataCallBack(callback);

            }).fail(function (xhr)
            {
                NS.Modal.Open(xhr.responseText, xhr.statusText, false, NS.Init.Start());
            });
        },

        /** PRIVATE LOCAL FUNCTIONS **/


        /** PLUGIN OVERRIDES **/

        AfterSort: function ()
        {
            var dt = ($('#tab-data>div:visible').length) ? $('#tab-data>div:visible') : ($('#collapse>div:visible').length) ? $('#collapse>div:visible') : ($("#list").length) ? $("#list") : $('#item-list');

            if (dt.find("#collapse").length)
            {
                dt = dt.find("#collapse>div:visible");
            }

            var t = dt.attr("id");

            var th = dt.find('th[data-column="' + NS.UI[t].PageSortBy + '"]');

            th.attr("data-sort", NS.UI[t].PageSort)
                .removeClass("sorting")
                .addClass("sorting_" + NS.UI[t].PageSort);
        },

        DataTablesOverride: function (sender)
        {
            var t = "";

            sender.each(function ()
            {
                var i = $(this);

                t = i.attr("id");

                NS.UI[t] = NS.UI[t] || { PageLength: 50 };

                // Hide Defaults
                i.find(".dataTables_wrapper .dataTables_length,.dataTables_wrapper .dataTables_info,.dataTables_wrapper .dataTables_filter,.dataTables_wrapper .dataTables_paginate").remove();

                if (i.find(".tiny").length > 0) return;

                // Overrides

                // 1. Page Length
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                var length = i.find("#page-length");
                var l_cntr = length.find("#data-page-length");

                l_cntr.val(NS.UI[t].PageLength);

                if (!i.find(".dataTables_wrapper #page-length").length)
                {
                    i.find(".dataTables_wrapper").prepend(length);
                }

                l_cntr
                    .unbind("change")
                    .bind("change", function ()
                    {
                        NS.UI[t].PageLength = l_cntr.val();

                        // Reset
                        NS.UI[t].PageSkip = 0;
                        NS.UI[t].PageNumber = 0;

                        var url = (siteurl + l_cntr.attr("data-url")).split('?')[0].replace(siteurl, "");

                        // Params
                        if (NS.UI[t].IsCustomSearch)
                        {
                            return NS.UI.DataDoCustomSearch(l_cntr, i, url, NS.UI.AfterSort);
                        }

                        var params = NS.UI.GetCustomSearchParams(t);

                        params.Page = 0;
                        params.Skip = 0;
                        params.Take = l_cntr.val();
                        params.Query = NS.UI[t].PageSearch;

                        NS.UI.Get(l_cntr, i, url, params, NS.UI.AfterSort, true);
                    });

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////




                // 2. Page Search
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                var search = i.find("#page-search");
                var s_cntr = search.find("#data-page-search");

                if (!i.find(".dataTables_wrapper #page-search").length)
                {
                    i.find(".dataTables_wrapper").prepend(search);
                }
                if (NS.UI[t].PageSearch)
                {
                    s_cntr.focus().val(NS.UI[t].PageSearch);
                }
                else
                {
                    s_cntr.val("");
                }

                // Check if seach values loaded?
                var s_target = $(s_cntr.attr("data-target"));
                if (!s_target.length && !i.find("#givecsm").length && s_cntr.hasClass("do-custom-search"))
                {
                    i.append("<div id='givecsm'></div>");

                    s_target = i.find("#givecsm");

                    var by = NS.UI[t].PageBudgetYear;

                    if ((typeof by == 'undefined' || by <= 0) && parseInt(NS.UI.DataGetQueryString("BudgetYear")) > 0)
                    {
                        by = NS.UI.DataGetQueryString("BudgetYear");
                    }

                    s_target.load(siteurl + "/" + s_cntr.attr("data-t"), { givecsm: true, bYear: by }, function ()
                    {
                        NS.UI.DataCustomSearchHighlight(sender, t);
                        NS.UI.DataStickyOne($('*[data-sticky-one="1"]'));
                    });
                }


                s_cntr
                    .unbind("keyup")
                    .bind("keyup", function (e)
                    {
                        var enter = (e.keyCode == 13 || e.which == 13 || ($(this).val() == ""));

                        if (enter)
                        {
                            NS.UI[t].PageSearch = NS.UI[t].PageQuery = s_cntr.val();

                            var url = (siteurl + s_cntr.attr("data-url")).split('?')[0].replace(siteurl, "");

                            if (NS.UI[t].IsCustomSearch)
                            {
                                NS.UI[t].PageQuery = s_cntr.val();

                                return NS.UI.DataDoCustomSearch(s_cntr, i, url, NS.UI.AfterSort);
                            }

                            var params = NS.UI.GetCustomSearchParams(t);

                            params.Page = 0;
                            params.Skip = 0;
                            params.Take = NS.UI[t].PageLength;
                            params.Query = s_cntr.val();

                            NS.UI.Get(s_cntr, i, url, params, NS.UI.AfterSort, true);
                        }
                    });

                //icon
                //.unbind("click")
                //.bind("click", function ()
                //{
                //    NS.UI[t].PageSearch = NS.UI[t].PageQuery = s_cntr.val();

                //    var url = (siteurl + s_cntr.attr("data-url")).split('?')[0].replace(siteurl, "");

                //    if (NS.UI[t].IsCustomSearch)
                //    {
                //        NS.UI[t].PageQuery = s_cntr.val();

                //        return NS.UI.DataDoCustomSearch(s_cntr, i, url, NS.UI.AfterSort);
                //    }

                //    NS.UI.Get(s_cntr, i, url, { query: s_cntr.val(), skip: 0, take: NS.UI[t].PageLength, page: 0 }, NS.UI.AfterSort, true);
                //});
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////




                // 3. Page Count
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                var count = i.find("#page-count");

                if (!i.find(".dataTables_wrapper #page-count").length)
                {
                    i.find(".dataTables_wrapper").append(count);
                }
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////




                // 4. Page Navigation (Indexing)
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                var navigation = i.find("#page-navigation");

                var next_cntr = navigation.find("#data-page-nav-next");
                var previous_cntr = navigation.find("#data-page-nav-previous");

                if (!i.find(".dataTables_wrapper #page-navigation").length)
                {
                    i.find(".dataTables_wrapper").append(navigation);
                }

                next_cntr.add(previous_cntr).each(function ()
                {
                    var n = $(this);

                    n
                        .unbind("click")
                        .bind("click", function ()
                        {
                            if (n.hasClass("inactive")) return;

                            var skip = parseInt(n.attr("data-skip"));
                            var page = parseInt(n.attr("data-page"));

                            NS.UI[t].PageSkip = skip;
                            NS.UI[t].PageNumber = page;

                            var url = (siteurl + navigation.attr("data-url")).split('?')[0].replace(siteurl, "");

                            if (NS.UI[t].IsCustomSearch)
                            {
                                return NS.UI.DataDoCustomSearch(n, i, url, NS.UI.AfterSort);
                            }

                            var params = NS.UI.GetCustomSearchParams(t);

                            params.Page = page;
                            params.Skip = skip;
                            params.Take = NS.UI[t].PageLength;
                            params.Query = NS.UI[t].PageSearch;

                            NS.UI.Get(n, i, url, params, NS.UI.AfterSort, true);
                        });
                });
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////




                // 5. Sorting override
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////

                i.find('th[data-column]').each(function ()
                {
                    var th = $(this);
                    var tr = th.parent("tr");
                    var column = th.attr("data-column");

                    if (typeof (column) == 'undefined')
                    {
                        th
                            .unbind("click")
                            .removeClass("sorting sorting_asc sorting_desc");

                        return;
                    }

                    th.removeClass("sorting_disabled").addClass("sorting");

                    th
                        .unbind("click")
                        .bind("click", function ()
                        {
                            tr.find('th[data-column]')
                                .removeClass("sorting_asc sorting_desc")
                                .addClass("sorting");

                            var sort = th.attr("data-sort");

                            if (typeof (sort) == 'undefined')
                            {
                                sort = "asc";
                            }
                            else
                            {
                                sort = (sort == "asc") ? "desc" : "asc";
                            }

                            NS.UI[t].PageSort = sort;
                            NS.UI[t].PageSortBy = column;

                            var url = (siteurl + navigation.attr("data-url")).split('?')[0].replace(siteurl, "");

                            if (NS.UI[t].IsCustomSearch)
                            {
                                return NS.UI.DataDoCustomSearch($("#sort-loader"), i, url, NS.UI.AfterSort);
                            }

                            var params = NS.UI.GetCustomSearchParams(t);

                            params.Skip = 0;
                            params.Page = 0;
                            params.Take = NS.UI[t].PageLength;
                            params.Query = NS.UI[t].PageSearch;

                            params.Sort = sort;
                            params.SortBy = column;

                            NS.UI.Get($("#sort-loader"), i, url, params, NS.UI.AfterSort, true);
                        });
                });

                //////////////////////////////////////////////////////////////////////////////////////////////////////////////




                // 6. Table Totals
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                setTimeout(function ()
                {
                    var totals = i.find("#table-totals");
                    var label = i.find("td.total-label").last();
                    var field = i.find("td.total-field").last();

                    if (totals.length && totals.length && label.length && totals.find("#total-label").length && totals.find("#total-field").length)
                    {
                        totals.find("#total-label").appendTo(i.find(".dataTables_wrapper"))
                            .css({ left: label.position().left, width: label.outerWidth() })
                            .show(1200);

                        totals.find("#total-field").appendTo(i.find(".dataTables_wrapper"))
                            .css({ left: field.position().left, width: field.outerWidth() })
                            .show(1200);
                    }
                }, "1500");
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////
            });

            //NS.UI.DataCustomSearchHighlight(sender, t);
        },

        DataTablesDateRange: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                // Hide Defaults
                i.find(".dataTables_wrapper .dataTables_length,.dataTables_wrapper .dataTables_info,.dataTables_wrapper .dataTables_filter,.dataTables_wrapper .dataTables_paginate").remove();

                var dateRange = i.find("#date-range");

                dateRange.css("display", "block");
                i.find(".dataTables_wrapper").prepend(dateRange);

                var end = dateRange.find('[data-end-date="1"]');
                var start = dateRange.find('[data-start-date="1"]');

                end.add(start).each(function ()
                {
                    var dr = $(this);

                    dr
                        .unbind("change keyup")
                        .bind("change keyup", function ()
                        {
                            i.find("table a").each(function ()
                            {
                                var a = $(this);

                                if (typeof (a.attr("original-href")) === "undefined")
                                {
                                    a.attr("original-href", a.attr("href"));
                                }

                                var href = a.attr("original-href");

                                a.attr("href", href + "&StartDate=" + start.val() + "&EndDate=" + end.val());
                            });
                        });
                });
            });
        },

        DataHighlightFields: function (target, color)
        {
            target
                .css("background", "#4186e0")
                .stop()
                .animate({ "opacity": "0.5", "filter": "alpha(opacity=50)" }, 1200, function ()
                {
                    target.animate({ "opacity": "1", "filter": "alpha(opacity=100)" }, 1200);

                    setTimeout(function ()
                    {
                        target.css("background", "none");
                    }, "3000");
                });
        },

        DataCustomSearchHighlight: function (sender, t)
        {
            var ics = false;

            if (NS.UI[t] && NS.UI[t].IsCustomSearch)
            {
                ics = true;

                // Guess search criteria
                var q = "", h = "";
                q += "Custom search for: ";

                // FinCheckComplete
                if (NS.UI[t].PageFinCheckComplete == true && sender.find(".fcc").length)
                {
                    q += " <b class='italic'>[<a style='color: #69f95a;'>Finance Check Complete</a>]</b> ";
                }
                if (NS.UI[t].PageFinCheckInComplete == true && !sender.find(".fcc").length)
                {
                    q += " <b class='italic'>[<a style='color: #69f95a;'>Finance Check Incomplete</a>]</b> ";
                }

                var val = "";

                // User, Supplier, PR, Funding Company
                if (NS.UI[t].PagePRId && NS.UI[t].PagePRId != "0")
                {
                    val = (sender.find('select#PRId').length <= 0) ? NS.UI[t].PagePRId : sender.find('select#PRId:first option[value="' + NS.UI[t].PagePRId + '"]').text();

                    h += "PR: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ PR: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#PRId').val(NS.UI[t].PagePRId);
                }
                if (NS.UI[t].PageUserId && NS.UI[t].PageUserId != "0")
                {
                    val = (NS.UI[t].PageUserIdDesc) ? NS.UI[t].PageUserIdDesc : sender.find('select#UserId:first option[value="' + NS.UI[t].PageUserId + '"]').text();

                    h += "User: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ User: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#UserId').val(NS.UI[t].PageUserId);
                }
                if (NS.UI[t].PageSupplierId && NS.UI[t].PagSupplierId != "0")
                {
                    val = (sender.find('select#SupplierId').length <= 0) ? NS.UI[t].PageSupplierId : sender.find('select#SupplierId:first option[value="' + NS.UI[t].PageSupplierId + '"]').text();

                    h += "Supplier: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ Supplier: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#SupplierId').val(NS.UI[t].PageSupplierId);
                }
                if (NS.UI[t].PageFundingCompanyId && NS.UI[t].PageFundingCompanyId != "0")
                {
                    val = (sender.find('select#FundingCompanyId').length <= 0) ? NS.UI[t].PageFundingCompanyId : sender.find('select#FundingCompanyId:first option[value="' + NS.UI[t].PageFundingCompanyId + '"]').text();

                    h += "Funding Company: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ Funding Company: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#FundingCompanyId').val(NS.UI[t].PageFundingCompanyId);
                }
                if (NS.UI[t].PageBudgetYear && NS.UI[t].PageBudgetYear != "0")
                {
                    val = (sender.find('select#BudgetYear').length <= 0) ? NS.UI[t].PageBudgetYear : sender.find('select#BudgetYear:first option[value="' + NS.UI[t].PageBudgetYear + '"]').text();

                    h += "Budget Year: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ Budget Year: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#BudgetYear').val(NS.UI[t].PageBudgetYear);
                }

                // Income Stream
                if (NS.UI[t].PageIncomeStream && NS.UI[t].PageIncomeStream != "")
                {
                    h += "Income Stream: <b>" + NS.UI[t].PageIncomeStream + "</b>~";
                    q += " <b class='italic'>[ Income Stream: <a style='color: #69f95a;'>" + NS.UI[t].PageIncomeStream + "</a> ]</b> ";

                    sender.find('input#IncomeStream').val(NS.UI[t].PageIncomeStream);
                }

                // Date From & To
                if ((NS.UI[t].PageFromDate || NS.UI[t].PageToDate) && (NS.UI[t].PageFromDate != "" || NS.UI[t].PageToDate != ""))
                {
                    h += "Date: From <b>" + NS.UI[t].PageFromDate + ((NS.UI[t].PageToDate != "") ? "</b> To <b>" + NS.UI[t].PageToDate : "") + "</b>~";
                    q += " <b class='italic'>[ Date: <a style='color: #69f95a;'>From " + NS.UI[t].PageFromDate + ((NS.UI[t].PageToDate != "") ? " To " + NS.UI[t].PageToDate : "") + "</a> ]</b> ";

                    sender.find('input#ToDate').val(NS.UI[t].PageToDate);
                    sender.find('input#FromDate').val(NS.UI[t].PageFromDate);
                }

                // Payment Status
                if (NS.UI[t].PagePaymentStatus && NS.UI[t].PagePaymentStatus != "-1")
                {
                    val = (sender.find('select#PaymentStatus').length <= 0) ? NS.UI[t].PagePaymentStatus : sender.find('select#PaymentStatus:first option[value="' + NS.UI[t].PagePaymentStatus + '"]').text();

                    h += "Payment Status: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ Payment Status: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#PaymentStatus').val(NS.UI[t].PagePaymentStatus);
                }

                // Payment Method
                if (NS.UI[t].PagePaymentMethod && NS.UI[t].PagePaymentMethod != "-1")
                {
                    val = (sender.find('select#PaymentMethod').length <= 0) ? NS.UI[t].PagePaymentMethod : sender.find('select#PaymentMethod:first option[value="' + NS.UI[t].PagePaymentMethod + '"]').text();

                    h += "Payment Method: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ Payment Method: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#PaymentMethod').val(NS.UI[t].PagePaymentMethod);
                }

                // PR Status
                if (NS.UI[t].PagePRStatus && NS.UI[t].PagePRStatus != "-1")
                {
                    val = (sender.find('select#PRStatus').length <= 0) ? NS.UI[t].PagePRStatus : sender.find('select#PRStatus:first option[value="' + NS.UI[t].PagePRStatus + '"]').text();

                    h += "PR Status: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ PR Status: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#PRStatus').val(NS.UI[t].PagePRStatus);
                }

                // PR InProgressType
                if (NS.UI[t].PageInProgressType && NS.UI[t].PageInProgressType != "-1")
                {
                    val = (sender.find('select#InProgressType').length <= 0) ? NS.UI[t].PageInProgressType : sender.find('select#InProgressType:first option[value="' + NS.UI[t].PageInProgressType + '"]').text();

                    h += "In Progress Type: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ In Progress Type: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#InProgressType').val(NS.UI[t].PageInProgressType);
                }

                // PaymentFrequency
                if (NS.UI[t].PagePaymentFrequency && NS.UI[t].PagePaymentFrequency != "-1")
                {
                    h += "Payment Frequency: <b>" + sender.find('select#PaymentFrequency:first option[value="' + NS.UI[t].PagePaymentFrequency + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Payment Frequency: <a style='color: #69f95a;'>" + sender.find('select#PaymentFrequency:first option[value="' + NS.UI[t].PagePaymentFrequency + '"]').text() + "</a> ]</b> ";

                    sender.find('select#PaymentFrequency').val(NS.UI[t].PagePaymentFrequency);
                }

                // DocumentType
                if (NS.UI[t].PageDocumentType && NS.UI[t].PageDocumentType != "-1")
                {
                    h += "Document Type: <b>" + sender.find('select#DocumentType:first option[value="' + NS.UI[t].PageDocumentType + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Document Type: <a style='color: #69f95a;'>" + sender.find('select#DocumentType:first option[value="' + NS.UI[t].PageDocumentType + '"]').text() + "</a> ]</b> ";

                    sender.find('select#DocumentType').val(NS.UI[t].PageDocumentType);
                }

                // Branch
                if (NS.UI[t].PageBranch && NS.UI[t].PageBranch != "")
                {
                    h += "Branch: <b>" + NS.UI[t].PageBranch + "</b>~";
                    q += " <b class='italic'>[ Branch: <a style='color: #69f95a;'>" + NS.UI[t].PageBranch + "</a> ]</b> ";

                    sender.find('select#Branch').val(NS.UI[t].PageBranch);
                }

                // DirectorateProject
                if (NS.UI[t].PageDirectorateProject && NS.UI[t].PageDirectorateProject != "")
                {
                    val = (sender.find('select#DirectorateProject').length <= 0) ? NS.UI[t].PageDirectorateProjectDesc : sender.find('select#DirectorateProject:first option[value="' + NS.UI[t].PageDirectorateProject + '"]').text();

                    h += "Directorate Project: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ Directorate Project: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#DirectorateProject').val(NS.UI[t].PageDirectorateProject);
                }

                // DepartmentSubProject
                if (NS.UI[t].PageDepartmentSubProject && NS.UI[t].PageDepartmentSubProject != "")
                {
                    val = (sender.find('select#DepartmentSubProject').length <= 0) ? NS.UI[t].PageDepartmentSubProjectDesc : sender.find('select#DepartmentSubProject:first option[value="' + NS.UI[t].PageDepartmentSubProject + '"]').text();

                    h += "Department Sub-Project: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ Department/Sub-Project: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#DepartmentSubProject').val(NS.UI[t].PageDepartmentSubProject);
                }

                // AccountType
                if (NS.UI[t].PageAccountType && NS.UI[t].PageAccountType != "-1")
                {
                    val = (sender.find('select#AccountType').length <= 0) ? NS.UI[t].PageAccountType : sender.find('select#AccountType:first option[value="' + NS.UI[t].PageAccountType + '"]').text();

                    h += "Account Type: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ Account Type: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#AccountType').val(NS.UI[t].PageAccountType);
                }

                // VAT
                if (NS.UI[t].PageVAT)
                {
                    h += "VAT: <b>" + sender.find('select#VAT:first option[value="' + NS.UI[t].PageVAT + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ VAT: <a style='color: #69f95a;'>" + sender.find('select#VAT:first option[value="' + NS.UI[t].PageVAT + '"]').text() + "</a> ]</b> ";

                    sender.find('select#VAT').val(NS.UI[t].PageVAT);
                }

                // Authlevel
                if (NS.UI[t].PageAuthlevel && NS.UI[t].PageAuthlevel != "-1")
                {
                    h += "Authlevel: <b>" + sender.find('select#Authlevel:first option[value="' + NS.UI[t].PageAuthlevel + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Authlevel: <a style='color: #69f95a;'>" + sender.find('select#Authlevel:first option[value="' + NS.UI[t].PageAuthlevel + '"]').text() + "</a> ]</b> ";

                    sender.find('select#Authlevel').val(NS.UI[t].PageAuthlevel);
                }

                // ActivityType
                if (NS.UI[t].PageActivityType && NS.UI[t].PageActivityType != "-1")
                {
                    h += "Activity Type: <b>" + sender.find('select#ActivityType:first option[value="' + NS.UI[t].PageActivityType + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Activity Type: <a style='color: #69f95a;'>" + sender.find('select#ActivityType:first option[value="' + NS.UI[t].PageActivityType + '"]').text() + "</a> ]</b> ";

                    sender.find('select#ActivityType').val(NS.UI[t].PageActivityType);
                }

                // RoleType
                if (NS.UI[t].PageRoleType && NS.UI[t].PageRoleType != "-1")
                {
                    h += "Role Type: <b>" + sender.find('select#RoleType:first option[value="' + NS.UI[t].PageRoleType + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Role Type: <a style='color: #69f95a;'>" + sender.find('select#RoleType:first option[value="' + NS.UI[t].PageRoleType + '"]').text() + "</a> ]</b> ";

                    sender.find('select#RoleType').val(NS.UI[t].PageRoleType);
                }

                // Province
                if (NS.UI[t].PageProvince && NS.UI[t].PageProvince != "-1")
                {
                    h += "Province: <b>" + sender.find('select#Province:first option[value="' + NS.UI[t].PageProvince + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Province: <a style='color: #69f95a;'>" + sender.find('select#Province:first option[value="' + NS.UI[t].PageProvince + '"]').text() + "</a> ]</b> ";

                    sender.find('select#Province').val(NS.UI[t].PageProvince);
                }

                // ExpenseType
                if (NS.UI[t].PageExpenseType && NS.UI[t].PageExpenseType != "-1")
                {
                    h += "Account Type: <b>" + sender.find('select#ExpenseType:first option[value="' + NS.UI[t].PageExpenseType + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Expense Type: <a style='color: #69f95a;'>" + sender.find('select#ExpenseType:first option[value="' + NS.UI[t].PageExpenseType + '"]').text() + "</a> ]</b> ";

                    sender.find('select#ExpenseType').val(NS.UI[t].PageExpenseType);
                }

                // Account
                if (NS.UI[t].PageAccount && NS.UI[t].PageAccount != "-1")
                {
                    h += "Account: <b>" + sender.find('select#Account:first option[value="' + NS.UI[t].PageAccount + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Expense Type: <a style='color: #69f95a;'>" + sender.find('select#Account:first option[value="' + NS.UI[t].PageAccount + '"]').text() + "</a> ]</b> ";

                    sender.find('select#Account').val(NS.UI[t].PageAccount);
                }

                // CheckedByFinance
                if (NS.UI[t].PageCheckedByFinance && NS.UI[t].PageCheckedByFinance !== "-1")
                {
                    h += "Checked By Finance: <b>" + sender.find('select#CheckedByFinance:first option[value="' + NS.UI[t].PageCheckedByFinance + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Checked By Finance: <a style='color: #69f95a;'>" + sender.find('select#CheckedByFinance:first option[value="' + NS.UI[t].PageCheckedByFinance + '"]').text() + "</a> ]</b> ";

                    sender.find('select#CheckedByFinance').val(NS.UI[t].PageCheckedByFinance);
                }

                // Event Name
                if (NS.UI[t].PageEventId && NS.UI[t].PageEventId !== 0)
                {
                    h += "Event Name: <b>" + sender.find('select#EventId:first option[value="' + NS.UI[t].PageEventId + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Event Name: <a style='color: #69f95a;'>" + sender.find('select#EventId:first option[value="' + NS.UI[t].PageEventId + '"]').text() + "</a> ]</b> ";

                    sender.find('select#EventId').val(NS.UI[t].PageEventId);
                }

                // PR Number
                if (NS.UI[t].PagePRNumber && NS.UI[t].PagePRNumber !== "")
                {
                    h += "PR Number: <b>" + NS.UI[t].PagePRNumber + "</b>~";
                    q += " <b class='italic'>[ PR Number: <a style='color: #69f95a;'>" + NS.UI[t].PagePRNumber + "</a> ]</b> ";

                    sender.find('input#PRNumber').val(NS.UI[t].PagePRNumber);
                }

                // Table Name
                if (NS.UI[t].PageTableName && NS.UI[t].PageTableName !== "")
                {
                    h += "Table Name: <b>" + sender.find('select#TableName:first option[value="' + NS.UI[t].PageTableName + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Table Name: <a style='color: #69f95a;'>" + sender.find('select#TableName:first option[value="' + NS.UI[t].PageTableName + '"]').text() + "</a> ]</b> ";

                    sender.find('select#TableName').val(NS.UI[t].PageTableName);
                }

                // Controller Name
                if (NS.UI[t].PageControllerName && NS.UI[t].PageControllerName !== "")
                {
                    h += "Controller Name: <b>" + sender.find('select#ControllerName:first option[value="' + NS.UI[t].PageControllerName + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Controller Name: <a style='color: #69f95a;'>" + sender.find('select#ControllerName:first option[value="' + NS.UI[t].PageControllerName + '"]').text() + "</a> ]</b> ";

                    sender.find('select#ControllerName').val(NS.UI[t].PageControllerName);
                }

                // Query
                if (NS.UI[t].PageQuery && NS.UI[t].PageQuery !== "")
                {
                    h += "Query: <b>" + NS.UI[t].PageQuery + "</b>~";
                    q += " <b class='italic'>[ Query: <a style='color: #69f95a;'>" + NS.UI[t].PageQuery + "</a> ]</b> ";

                    sender.find('input#Query').val(NS.UI[t].PageQuery);
                }

                q += ". Refresh page to cancel...";

                if (t !== "visual" && (window.location.pathname !== "/Report" && window.location.hash !== "#detailed"))
                {
                    sender.find(".custom-search-active-wrapper small").html(q);
                    sender.find(".custom-search-active-wrapper").fadeIn(1200);
                }

                if ($("#s-header").length)
                {
                    $("#s-header").html(h.split('~').join(' ')).slideDown(900).css("display", "block");
                }
            }

            // Check for any table List links that need appending the custom search
            if (sender.find('a.append-search, a[data-append="1"]').length > 0)
            {
                // Params
                var params = NS.UI.GetCustomSearchParams(t);

                if (sender.find("th.sorting_asc").length)
                {
                    params.Sort = "ASC";
                    params.SortBy = sender.find("th.sorting_asc:first").attr("data-column");
                }
                if (sender.find("th.sorting_desc").length)
                {
                    params.Sort = "DESC";
                    params.SortBy = sender.find("th.sorting_desc:first").attr("data-column");
                }

                params.SelectedItems = [];

                sender.find('a.append-search, a[data-append="1"]').each(function ()
                {
                    var hasQ = ($(this).attr("href").indexOf('?') > -1);

                    var href = $(this).attr("href").split('?')[0] + "?IsCustomSearch=" + ics + "&type=" + $(this).attr("data-type") + "&" + $.param(params).replace(/%5B%5D/g, '');

                    $(this).attr("href", href);
                });
            }
        },

        /** PLUGIN OVERRIDES **/


        /** PR CREATE/EDIT **/

        DataValidateForm: function (form)
        {
            var cntr = [];
            var valid = true;
            var direction = "center-left";
            var err = "<div class='message-error'>";

            var id = form.attr("id");

            // 1. Required field
            form.find('[data-val-required], [required="1"], [required="required"]').each(function ()
            {
                if ($(this).is(":hidden"))
                {
                    return;
                }

                if ($(this).val() == "" && $(this).attr("id") != "OtherSupplierBankId" && $(this).attr("id") != "OtherSupplierAccountType")
                {
                    if ($(this).is("select") && $(this).hasClass("chzn"))
                    {
                        direction = "center-left";
                        cntr = form.find('div#s2id_' + $(this).attr("id"));
                    }
                    else
                    {
                        cntr = $(this);
                    }

                    err += "Please enter/select a value for this field to proceed!";

                    valid = false;

                    return false;
                }
            });

            var ps = 0;

            // 2. Check PR Lines with Desc but no Amount or vice-verser
            if (valid && form.find("#budget-lines tbody tr input").length)
            {
                form.find("#budget-lines tbody tr").each(function ()
                {
                    var at = $(this).find('select[data-name="AccountType"]').val();
                    var is = $(this).find('select[data-name="IncomeStream"]').val();
                    var acc = $(this).find('select[data-name="Account"]').val();
                    var desc = $(this).find('input[data-desc="1"]').val();
                    var amt = $(this).find('input[data-pr-amount="1"]').val();

                    if (!$(this).find('select[data-name="AccountType"]').length || !$(this).find('select[data-name="IncomeStream"]').length || !$(this).find('select[data-name="Account"]').length)
                    {
                        return;
                    }

                    if (at == "" || is == "" || acc == "")
                    {
                        return;
                    }

                    // Lets check description (if amount is present)
                    if (desc == "" && (parseFloat(amt) && parseFloat(amt) > 0))
                    {
                        cntr = $(this).find('input[data-desc="1"]');

                        err += "Please provide a description for this budget line to proceed!";

                        valid = false;

                        return false;
                    }

                    // Lets check amount (if description is entered)
                    if (desc != "" && !parseFloat(amt) && parseFloat(amt) != 0)
                    {
                        cntr = $(this).find('input[data-pr-xamount="1"]');

                        err += "Please enter an amount for this budget line to proceed!";

                        valid = false;
                        direction = "top-right";

                        return false;
                    }

                    ps++;
                });
            }

            // Check that there's at least 1 PR Line with full selection...
            if (valid && ps < 1 && form.find("#budget-lines tbody tr input").length)
            {
                cntr = form.find("#budget-lines tr");

                err += "Please provide at least 1 valid budget line entry in this table by making the correct selections and entering a description and amount. * Note, you can add more lines using the plus (+) sign on the left of this table..";

                valid = false;
                direction = "top-right";
            }

            // 3. Expected Cost
            var amt = (form.find("#ExpectedCost").length) ? parseFloat(form.find("#ExpectedCost").val()) : 0;
            if (valid && form.find("#ExpectedCost").length && amt == 0)
            {
                cntr = form.find("#ExpectedCost");

                err += "This is not a valid amount. This could be because you've not entered the correct amount on one of the fields in the above table. Please rectify and try again.";

                valid = false;
            }

            if (valid && form.find("#OriginalExpectedCost").length)
            {
                var orig = parseFloat(form.find("#OriginalExpectedCost").val());

                var newAmt = ((15 / 100) * orig) + orig;

                if (amt != orig && amt > newAmt)
                {
                    cntr = form.find("#ExpectedCost");
                    err += "The new amount <b>R " + amt.money(2) + "</b> is greater than the Original Expected Cost (+15%) <b>R " + newAmt.money(2) + "</b>, this is not allowed. Please reduce/revert amount and try again.";

                    valid = false;
                }
            }

            // 4. Supplier Details
            if (valid && form.find("#SupplierId").length && form.find("#SupplierId").val() == "")
            {
                direction = '';
                var exist = false;

                if (form.find("#OtherSupplier").length && form.find("#OtherSupplier").val() == "")
                {
                    exist = true;
                    cntr = form.find("#OtherSupplier");
                }
                else if (form.find("#OtherSupplierContactTel").length && form.find("#OtherSupplierContactTel").val() == "")
                {
                    exist = true;
                    cntr = form.find("#OtherSupplierContactTel");
                }
                else if (form.find("#OtherSupplierBankId").length && form.find("#OtherSupplierBankId").val() == "")
                {
                    exist = true;
                    cntr = form.find('label[for="OtherSupplierBankId"]');
                }
                else if (form.find("#OtherSupplierBranch").length && form.find("#OtherSupplierBranch").val() == "")
                {
                    exist = true;
                    cntr = form.find("#OtherSupplierBranch");
                }
                else if (form.find("#OtherSupplierAccount").length && form.find("#OtherSupplierAccount").val() == "")
                {
                    exist = true;
                    cntr = form.find("#OtherSupplierAccount");
                }
                else if (form.find("#OtherSupplierAccountType").length && (form.find("#OtherSupplierAccountType").val() == "" || form.find("#OtherSupplierAccountType").val() == "-1"))
                {
                    exist = true;
                    cntr = form.find('label[for="OtherSupplierAccountType"]');
                }
                else if (valid && form.find("#OtherSupplierContactPerson").length && form.find("#OtherSupplierContactPerson").val() == "")
                {
                    exist = true;
                    direction = "center-left";
                    cntr = form.find("#OtherSupplierContactPerson");
                }
                else if (valid && form.find("#OtherSupplierContactEmail").length && form.find("#OtherSupplierContactEmail").val() == "")
                {
                    exist = true;
                    cntr = form.find("#OtherSupplierContactEmail");
                }

                if (exist)
                {
                    err += "It seems that you did not select a supplier from the given options. Please enter/select a valid value for this field so we can proceed.";

                    valid = false;
                    direction = direction || "center-right";
                }
            }

            // 7. Short Description
            if (valid && form.find("#ShortDesc").length && form.find("#ShortDesc").val() == "")
            {
                cntr = form.find("#ShortDesc");

                err += "Please motivate your requisition by entering a short and concise description in this field to proceed!";

                valid = false;
                direction = "top-right";
            }


            // 8. Authorisor Comment
            if (valid && form.find("#AuthorisorComment").length && $("#AuthorisorComment").val() == "")
            {
                cntr = form.find("#AuthorisorComment");

                err += "Enter your comment here. It's important to leave a comment when authorising a Payment Requisition.";

                valid = false;
                direction = "top-right";
            }


            // 9. If Decline, check reason for declining
            if (valid && form.find("#DeclineReason").length && form.find("#AuthorisorDeclined").length && form.find("#AuthorisorDeclined").val() != "" && form.find("#DeclineReason").val() == "")
            {
                cntr = form.find('label[for="DeclineReason"]');

                err += "To decline this requisition, please select a reason before we can proceed.";

                valid = false;
                direction = "center-right";
            }

            // 10. Make sure there are authorisors?
            if (valid && form.find("#authorisors").length && !form.find(".authorisor").length)
            {
                cntr = form.find("#authorisors");

                err += "Oops! Something has gone wrong here, we don't seem to have \"successfully\" determined the authorisers for your request. Kindly make some changes on your selection (s) above, or start over, or refresh the page to try again or contact your superior for further assistance.";

                valid = false;
                direction = "top-right";
            }

            // 11. Check if any PRs selected? (Change Originator)
            if (valid && form.find('#select-prs').length && !form.find('#select-prs input[type="checkbox"]:checked').length)
            {
                cntr = form.find("#select-prs tr");

                err += "Please select at least 1 PR entry in this table by checking the checkboxes on your left to continue.";

                valid = false;
                direction = "top-right";
            }

            // 12. Payment Instruction: Outstanding Amount
            if (valid && (form.find('#AmountOutstanding').length && form.find('#Amount').length && form.find('#PITotal').length))
            {
                var total = parseFloat(form.find('#Total').val());
                var amount = parseFloat(form.find('#Amount').val());
                var piTotal = parseFloat(form.find('#PITotal').val());
                var outstanding = parseFloat(form.find('#AmountOutstanding').val());

                if (amount > outstanding || (amount <= outstanding && (piTotal + amount) > total))
                {
                    cntr = form.find("#Amount1");

                    if (amount > outstanding)
                    {
                        err += "This amount (R " + amount.money(2) + ") cannot be more than the remaining amount of <b>R " + outstanding.money(2) + "</b> to be paid for the selected Payment Group.";
                    }
                    else
                    {
                        err += "The sum of the current Payment Instructions (R " + piTotal.money(2) + ") plus the entered amount (R " + amount.money(2) + ") is greater than the remaining amount of <b>R " + outstanding.money(2) + "</b> to be paid for the selected Payment Group.";
                    }

                    valid = false;
                    direction = "top-right";
                }
            }

            // 13. Mark PR as Complete, Check if all checkboxes checked?
            if (valid && form.find('*[data-fin-checked="1"]').length && form.find('*[data-fin-checked="1"]:checked').length < form.find('*[data-fin-checked="1"]').length)
            {
                form.find('*[data-fin-checked="1"]').each(function ()
                {
                    if (!$(this).is(":checked"))
                    {
                        cntr = $(this);

                        err += "Please tick me (and any other check boxes) to continue.";

                        valid = false;
                        direction = "top-right";

                        return false;
                    }
                });
            }

            // 14. Check PR Lines with Desc but no Amount or vice-verser
            if (valid && form.find("#group-pr-table tbody tr").length && !form.find('#group-pr-table tbody tr input[type="checkbox"]:checked').length)
            {
                cntr = form.find("#group-pr-table");

                err += "Please select one of the PRs in the table above to continue.";

                valid = false;
                direction = "top-right";
            }

            // 15. Update StandIn - Check if main and alt are the same?
            if (valid && form.find("#AuthId").length && form.find("#AlternateStandInId").length && form.find("#AuthId").val() == form.find("#AlternateStandInId").val())
            {
                cntr = form.find('label[for="AlternateStandInId"]');

                err += "The main and alternative authoriser cannot be the same.";

                valid = false;
                direction = "top-right";
            }

            // 16. Supplier name has invalid characters?
            if (valid && form.find("#Name").length && (form.find("#Name").val().match(/,/g) || form.find("#Name").val().match(/"/g) || form.find("#Name").val().match(/'/g) || form.find("#Name").val().match(/`/g)))
            {
                cntr = form.find('#Name');

                err += "The following characters <b><u>, ' \"</u></b> are not allowed!";

                valid = false;
            }

            // 17. Supplier name has invalid characters?
            if (valid && (form.find("#OtherSupplier").length && NS.UI.SupplierRegex.test(form.find("#OtherSupplier"))) || (form.find("#RegNo").length && NS.UI.SupplierRegex.test(form.find("#Name"))))
            {
                cntr = form.find("#OtherSupplier").length ? form.find('#OtherSupplier') : form.find('#Name');

                err += "The following characters <b><u>!@#$%^&*()_-</u></b> are not allowed for this field!";

                valid = false;
            }

            // 18. Valid File Types
            if (valid && form.find('[data-val-file="1"]').length && form.find('[data-val-file="1"]').val() != '')
            {
                var val = form.find('[data-val-file="1"]').val();
                var arr = val.split('.');
                var ext = arr[arr.length - 1];

                if ($.inArray(ext.toLowerCase(), NS.UI.DocumentTypes) === -1)
                {
                    cntr = form.find('[data-val-file="1"]');

                    err += "The file extension <b>" + ext + "</b> is not allowed! Allowed formats: " + NS.UI.DocumentTypes.join(',');

                    valid = false;
                }
            }

            // 19. Update Stand In Reason
            if (valid && form.find("#StandInReason").length && form.find("#StandInReason").val() == '')
            {
                cntr = form.find('label[for="StandInReason"]');

                err += "Please select a reason to why you would like to request a Stand-in.";

                valid = false;
            }

            // 20. Validate Supporting Documents Invoice/Write-Off SUM
            if (valid && form.find('input[data-pr-xamount="1"]').length && form.find('input[data-invoice-sum]').length)
            {
                var group = form.find('input[data-pr-xamount="1"]:visible');

                form.find('input[data-pr-xamount="1"]:visible').each(function ()
                {
                    if (!NS.UI.DataValidateInvoices($(this), group))
                    {
                        valid = false;

                        return false;
                    }
                });

                if (!valid)
                {
                    return false;
                }
            }

            if (!valid)
            {
                err += "</div>";

                NS.Sticky.StickyOne.addClass("error");
                NS.Sticky.StickyOne.css({ "display": "none" });

                NS.Sticky.Show(cntr, "Error Submitting Your Form!", err, [], direction);
                $('html, body').animate({ scrollTop: cntr.offset().top - 150 }, 'slow', function () { cntr.focus(); });
            }
            else
            {
                form.find("#budget-lines tbody tr").each(function ()
                {
                    var a = $(this).find('input[data-pr-amount="1"]');

                    if (!a.length) return;

                    var _amt = a.val().replace('R', '').replace(/ /g, '');

                    a.val(_amt);
                });

                if (form.find("#ExpectedCost").length)
                {
                    form.find("#ExpectedCost").val(amt);
                }
            }

            return valid;
        },

        DataRefreshView: function ()
        {
            var hash = window.location.hash;

            var budget = $(hash + " table#budget-lines");
            var expectedCost = $(hash + " #ExpectedCost");
            var expectedCostLabel = $(hash + " #ExpectedCostLabel");

            // Select new values
            var branch = $(hash + ' select[data-name="Branch"]').val();
            var dp = $(hash + ' select[data-name="DirectorateProject"]').val();
            var dsp = $(hash + ' select[data-name="DepartmentSubProject"]').val();

            // Only reload the budget line if all above have values
            if (branch != null && branch != "" && dp != null && dp != "" && dsp != null && dsp != "" && hash != "#provincialrefunds")
            {
                NS.Loader.Show($(hash + " #budget-lines-loader"), true);
                $.get(siteurl + "/BudgetLines", { originatorId: $(hash + " #OriginatorId").val(), branch: branch, directorateProject: dp, departmentSubProject: dsp }, function (data, status, req)
                {
                    expectedCost.val(0);
                    expectedCostLabel.text("R 0.00");

                    budget.find("tbody").html(data);

                    NS.UI.DataHighlightFields($(hash + " table#budget-lines").find("tbody td"));

                    NS.Init.Start(true);

                    // Get authorisors
                    NS.UI.Get($(hash + " #authorisors-loader"), $("#authorisors"), siteurl + "/Authorisors", { originatorId: $("#OriginatorId").val(), prId: $("#Id").val(), expectedCost: 0, branch: branch, directorateProject: dp, departmentSubProject: dsp }, NS.UI.DataHighlightFields($("#authorisors")), true, true);
                });
            }
            else if (branch != null && branch != "" && dp != null && dp != "" && dsp != null && dsp != "" && hash == "#provincialrefunds")
            {
                NS.UI.DataPRPBudgetLines(branch, dp, dsp, "#provincialrefunds");
            }
            else if (branch == null || branch == "" || dp == null || dp == "" || dsp == null || dsp == "")
            {
                var df = '<option value="">Select...</option>';

                $(hash + " #budget-lines-loader").find("select").each(function ()
                {
                    $(this)
                        .select2("destroy")
                        .html(df)
                        .select2();
                });

                NS.Init.Start(true);
            }
            else
            {
                // Get authorisors
                NS.UI.Get($(hash + " #authorisors-loader"), $(hash + " #authorisors"), siteurl + "/Authorisors", { originatorId: $(hash + " #OriginatorId").val(), prId: $(hash + " #Id").val(), expectedCost: 0, branch: branch, directorateProject: dp, departmentSubProject: dsp }, NS.UI.DataHighlightFields($(hash + " #authorisors")), true, true);
            }
        },

        DataDoSelected: function (sel, options)
        {
            if (typeof (sel.attr('original-val')) == 'undefined')
            {
                sel.attr('original-val', sel.val());
            }

            for (var o in options)
            {
                if (o.trim() == sel.attr('original-val').trim()) return o;
            }

            return '';
        },

        DataIndex: function (sender, index)
        {
            sender.each(function (i)
            {
                i = (typeof (index) != 'undefined') ? index : i;

                if (typeof ($(this).attr("name")) != 'undefined')
                {
                    var name = $(this).attr("name");
                    var n = name.split("[")[1].split("]")[0];

                    name = name.replace('[' + n + ']', '[' + i + ']');

                    $(this).attr("name", name);
                }

                if (typeof ($(this).attr("id")) != 'undefined' && $(this).attr("id").indexOf("[") > 0)
                {
                    var name = $(this).attr("id");
                    var n = name.split("[")[1].split("]")[0];

                    name = name.replace('[' + n + ']', '[' + i + ']');

                    $(this).attr("id", name);
                }

                if (typeof ($(this).attr("for")) != 'undefined' && $(this).attr("for").indexOf("[") > 0)
                {
                    var name = $(this).attr("for");
                    var n = name.split("[")[1].split("]")[0];

                    name = name.replace('[' + n + ']', '[' + i + ']');

                    $(this).attr("for", name);
                }

                if ($(this).is("a") && typeof ($(this).attr("data-del-one-more")) != 'undefined' && typeof ($(this).attr("data-target")) != 'undefined')
                {
                    var target = $(this).attr("data-target");
                    var t = target.split("_")[1].split("_")[0];

                    target = target.replace('_' + t + '_', '_' + i + '_');

                    $(this).attr("data-target", target);
                }

                if ($(this).is("div") && typeof ($(this).attr("id")) != 'undefined' && typeof ($(this).attr("data-del-holder")) != 'undefined')
                {
                    var id = $(this).attr("id");
                    var t = id.split("_")[1].split("_")[0];

                    id = id.replace('_' + t + '_', '_' + i + '_');

                    $(this).attr("id", id);
                }
            });

            return true;
        },

        DataShowSelected: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);
                var target = $(i.attr("data-target"));

                i
                    .unbind("change")
                    .bind("change", function ()
                    {
                        if ($(this).is(":checked"))
                        {
                            target.find('tbody tr').each(function ()
                            {
                                var hasChk = $(this).find('[type="checkbox"]').length;

                                if (!hasChk || (hasChk && !$(this).find('[type="checkbox"]:checked').length))
                                {
                                    $(this)
                                        .add(target.find('#page-count'))
                                        .add(target.find('#page-navigation'))
                                        .slideUp(500);
                                }
                            });
                        }
                        else
                        {
                            target.find('tbody tr').each(function ()
                            {
                                var hasChk = $(this).find('[type="checkbox"]').length;

                                if (!hasChk || (hasChk && !$(this).find('[type="checkbox"]:checked').length))
                                {
                                    $(this)
                                        .add(target.find('#page-count'))
                                        .add(target.find('#page-navigation'))
                                        .slideDown(500);
                                }
                            });
                        }
                    });
            });
        },


        DataBank: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);
                var target = $("#BankBranch, #BeneficiaryBankBranch, #BeneficiaryBranch, #OtherSupplierBranch");

                i
                    .unbind("change")
                    .bind("change", function ()
                    {
                        var d = { bankId: $(this).val() };

                        if (d == "") 
                        {
                            target.val('').removeAttr("readonly");

                            return;
                        }

                        $.ajax({
                            url: siteurl + "/GetBank",
                            type: "POST",
                            data: JSON.stringify(d),
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            error: function (e)
                            {

                            },
                            success: function (s)
                            {
                                target.val(s.Code.trim()).change();

                                if (s.Code.trim() != '')
                                {
                                    target.attr("readonly", "readonly");
                                }
                                else
                                {
                                    target.removeAttr("readonly");
                                }

                                NS.UI.DataHighlightFields(target.parent());
                            }
                        });
                    });
            });
        },

        DataValMax: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var id = i.attr("id");
                var max = parseInt(i.attr("data-val-length-max"));

                var papa = i.parent();
                var target = $('[for="' + id + '"]');
                var counter = '<em class="slick-counter" id="counting-' + id + '"></em>';

                if (!target.length && !papa.find("#counting-" + id).length)
                {
                    papa.append('<label for="' + id + '"></label>');
                }
                else if (!papa.find("#counting-" + id).length)
                {
                    target.css({ "width": "90%" }).append(counter);
                }

                i
                    .bind("keypress", function (e)
                    {
                        e = (e) ? e : window.event;

                        var charCode = (e.which) ? e.which : e.keyCode;

                        if (charCode == 8 || charCode == 46 || charCode == 35 || charCode == 36 || charCode == 37 || charCode == 39)
                        {
                            return true;
                        }

                        if (($(this).val().length + 1) > max)
                        {
                            $("#counting-" + id).css('display', 'none');

                            return false;
                        }
                    })
                    .bind("keyup change", function ()
                    {
                        if ($(this).val().length <= 0)
                        {
                            $("#counting-" + id).fadeOut(900);

                            return;
                        }

                        $("#counting-" + id).text($(this).val().length + " of " + max + " characters").fadeIn(1200);
                    })
                    .bind("blur", function ()
                    {
                        var val = $(this).val().substr(0, max);

                        $(this)
                            .val(val)
                            .attr("value", val);
                    });
            });
        },

        DataBankValidation: function (sender)
        {
            function ValidateBank(sender)
            {
                var papa = sender.parent().parent();

                var acc = papa.find('[data-name="AccountNo"]');
                var bcode = papa.find('[data-name="BranchCode"]');
                var accType = papa.find('[data-name="AccountType"]');

                if (acc.val() == "" || bcode.val() == "" || accType.val() == "") return;

                title = "Bank Account Details Validation";
                msg = "<p>";
                msg += " Please wait whilst we validate the provided Bank Account details...";
                msg += ' <img id="loader" class="apcloud-loader" src="' + imgurl + '/images/loader.gif" alt="" style="margin: 0 5px;" />';
                msg += "</p>";

                var d = { accountNo: acc.val(), branchCode: bcode.val(), accountType: accType.val() };

                $('html, body').css({ 'cursor': 'progress' });
                NS.Modal.Open(msg, title, false);

                $.ajax({
                    url: siteurl + "/IsValidBankDetails",
                    type: "POST",
                    data: JSON.stringify(d),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    error: function (e)
                    {

                    },
                    success: function (s)
                    {
                        NS.Loader.Hide();

                        if (s.Code == '0')
                        {
                            NS.Modal.Close();
                            $("form:visible").find("#save-btn, #sdoc-btn").removeAttr("title").removeAttr("disabled");

                            acc.addClass("b-valid");
                            bcode.addClass("b-valid");
                            $("div#s2id_" + accType.attr("id")).addClass("b-valid");
                        }
                        else
                        {
                            $("form:visible").find("#save-btn, #sdoc-btn").attr({ "disabled": "disabled", "title": "Can't submit form: Bank validation failed." });

                            msg = "<div class='message-error'>" + s.Message + "</div>";
                            NS.Modal.Open(msg, title, false);

                            acc.removeClass("b-valid");
                            bcode.removeClass("b-valid");
                            $("div#s2id_" + accType.attr("id")).removeClass("b-valid");
                        }
                    }
                });
            }

            sender
                .unbind("change")
                .bind("change", function ()
                {
                    var i = $(this);

                    clearTimeout(NS.UI.PageSearchTimer);

                    NS.UI.PageSearchTimer = setTimeout(function ()
                    {
                        ValidateBank(i);
                    }, '1000');
                });
        },

        DataGetBroadcast: function ()
        {
            if (NS.UI.PageBroadcast) return;

            NS.UI.PageBroadcast = 1;

            $.ajax({
                url: siteurl + "/GetBroadcast",
                type: "POST",
                data: {},
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                error: function (e)
                {

                },
                success: function (b)
                {
                    if (b.Found == '1')
                    {
                        var msg = '<p>' + b.Message.replace(/\r\n/g, '<br />') + '</p>';
                        msg += '<p>';
                        msg += '    <input id="btn-got-it" type="button" class="btn-yes" value="I read this message, do not display it again" />';
                        msg += '</p>';

                        setTimeout(function ()
                        {
                            NS.Modal.Open(msg, 'Attention', false);
                            $(".announcement").slideDown(1200);

                            var btn = $(NS.Modal.Container).find('#modal-body #btn-got-it');
                            btn
                                .unbind("click")
                                .bind("click", function ()
                                {
                                    AddUserBroadcast(btn, b.Bid);
                                });
                        }, '4000');
                    }
                }
            });

            function AddUserBroadcast(sender, bid)
            {
                NS.UI.Post(sender, $("#empty-div"), siteurl + '/AddUserBroadcast', { bid: bid }, [], true, true);

                $(".announcement").hide(500);
                NS.Modal.Close();
            }
        },

        DataMoney: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                i.bind("blur", function ()
                {
                    var f = $(this).val().split(/\s+/).join('').replace('R', '').replace(/,/g, '.');

                    if (!parseFloat(f))
                    {
                        return;
                    }

                    $(this).val("R" + parseFloat(f).money(2));
                });
            });
        },

        DataCheckAll: function (target)
        {
            target
                .find('input[data-all="1"]')
                .unbind("change")
                .bind("change", function ()
                {
                    var kids = target.find('input[data-child="1"]');

                    if ($(this).is(":checked"))
                    {
                        kids.each(function ()
                        {
                            if (typeof ($(this).attr("disabled")) != 'undefined') return;

                            $(this).prop("checked", true).attr("checked", "checked");
                        });
                    }
                    else
                    {
                        kids.prop("checked", false).removeAttr("checked");
                    }
                });
        },

        DataSArrows: function (sender)
        {
            var err = "";
            var cntr = [];

            var uscount = $("#u-s-count");
            var bscount = $("#b-s-count");

            sender.each(function ()
            {
                var i = $(this);

                var to = $(i.attr("data-to"));
                var from = $(i.attr("data-from"));

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        if (from.find('input[type="checkbox"]').length <= 0) return;

                        var hasInvalid = false;
                        var checked = from.find('input[type="checkbox"]:checked');

                        if (checked.length <= 0)
                        {
                            cntr = from.find('input[data-all="1"]');
                            err = "Please select structures below to proceed..";

                            NS.Sticky.Show(cntr, "Nothing selected", err, [], "bottom-left");

                            return false;
                        }

                        hasInvalid = checked.first().parent().parent().parent().find("a.inv").length > 0;

                        checked.each(function ()
                        {
                            var v = $(this).val();
                            var li = $(this).parent().parent();
                            var ul = li.parent();

                            if (typeof ($(this).attr("data-all")) != 'undefined') return;

                            var toCntr = to.find('input[value="' + v + '"]');

                            // If structure exists on the (to) obj, remove/delete it from the from obj, highlight the matching li in the to obj
                            if (toCntr.length > 0)
                            {
                                li.remove();

                                var _li = toCntr.parent().parent();

                                _li.removeAttr("title").attr("style", "border-bottom: 1px dashed #ddd; margin-bottom: 6px;");
                                toCntr.prop("disabled", false).removeAttr("disabled");

                                NS.UI.DataHighlightFields(_li.find("label"));
                            }
                            else
                            {
                                if (i.attr("data-from") == "#u-structures")
                                {
                                    // 2.1 If we're removing structure from user and it doesn't exists on the other side, just delete the li
                                    li.remove();
                                }
                                else
                                {
                                    // 2.2 If we're adding structure to user, MOVE from from>li to to>ul and highlight the li
                                    li.find('input[type="checkbox"]').prop("checked", false).removeAttr("checled");
                                    to.find("ul").append(li.clone());
                                }
                            }
                        });

                        var usc = uscount.parent().parent().find("li").length - 1;
                        var bsc = bscount.parent().parent().find("li").length - 1;

                        uscount.text("(" + ((usc > 0) ? usc : 0) + ")");
                        bscount.text("(" + ((bsc > 0) ? bsc : 0) + ")");

                        NS.UI.DataHighlightFields(uscount);
                        NS.UI.DataHighlightFields(bscount);

                        NS.UI.DataMatchedStructures();

                        to.find("li").each(function (indx)
                        {
                            NS.UI.DataIndex($(this).find('input,select,textarea'), (indx - 1));
                        });

                        from.find("li").each(function (indx)
                        {
                            NS.UI.DataIndex($(this).find('input,select,textarea'), (indx - 1));
                        });
                    });
            });
        },

        DataCallBack: function (callback)
        {
            if (typeof (callback) === 'undefined')
            {
                return;
            }

            if (typeof (callback) === typeof (Function))
            {
                try
                {
                    callback();
                }
                catch (e)
                {
                    eval(callback);
                }
            }
            else
            {
                eval(callback);
            }
        }

    };
})();
