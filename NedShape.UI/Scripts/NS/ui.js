(function ()
{
    PR.UI = {

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

        SupplierRegex: /^\!|\@|\#|\$|\%|\^|\?|\&|\*|\(|\)|_|\-|\`|\?/g,

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

            this.DataLoadPRStatus($('*[data-load-pr-status="1"]'));
            this.DataLoadPRDocs($('*[data-load-pr-docs="1"]'));


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
            this.DataEvent($('*[data-event="1"]'));
            this.DataPRBudget($('*[data-pr-budget="1"]'));
            this.DataPRAmount($('*[data-pr-xamount="1"]'));
            this.DataPRRemoveLine($('*[data-pr-remove-line]'));
            this.DataUserStructure($('*[data-user-structure="1"]'));

            this.DataPRSupplier($('*[data-pr-supplier="1"]'));
            this.DataVR($('.visual-reports[data-loaded="0"]:first')); 
            this.DataPRPaymentMethod($('*[data-payment-method="1"]'));

            // Support Doc
            this.DataDocType($('*[data-doc-type="1"]'));
            this.DataSearchPR($('*[data-search-pr="1"]'));
            this.DataEmailFile($('*[data-email-file="1"]'));
            this.DataCancelDoc($('*[data-cancel-doc="1"]'));
            this.DataMarkComplete($('*[data-mark-complete="1"]'));

            // Authorisation
            this.DataCheckOTP($('*[data-check-otp="1"]'));
            this.DataResendOTP($('*[data-resend-otp="1"]'));
            this.DataQuickAuthorise($('*[data-quick-authorise="1"]'));
            this.DataResendOTPViaEmail($('*[data-resend-otp-via-email="1"]'));

            // Update Stand In
            this.DataStandInReason($('*[data-stand-in-reason="1"]'));

            // Finance
            this.DataGroupPr($('*[data-group-pr="1"]'));
            this.DataShowSelected($('*[data-show-selected="1"]'));
            this.DataEditFundingCompany($('*[data-edit-fc="1"]'));
            this.DataFinanceDecline($('*[data-fin-decline="1"]'));
            this.DataGroupPrAmount($('*[data-group-pr-amount="1"]'));
            this.DataPaymentFrequency($('*[data-payment-frequency="1"]'));

            // Length Validation
            this.DataValMax($('*[data-val-length-max]'));

            // Bank Details Validation
            this.DataBankValidation($('*[data-bank-val]'));


            // Suppier //
            this.DataSupplierApproval($('*[data-s-approval="1"]'));
            this.DataSupplierAccountType($('*[data-supplier-acct="1"]'));


            // Auth Rules
            this.DataAuthBranch($('*[data-auth-branch="1"]'));

            // Refund PR
            this.DataAddRefundPR($('*[data-add-refund-pr="1"]'));
            this.DataRestoreRefunds();
            this.DataCompleteRefund($('*[data-complete-refund="1"]'));


            // User Account Type
            this.DataRemoveUser($('*[data-remove-user="1"]'));

            // Override PR
            this.DataOverridePR($('*[data-override-pr="1"]'));


            // Money
            this.DataMoney($('*[data-money="1"]'));


            //  User Structures
            this.DataSelStructure($('*[data-sel-structure="1"]'));
            this.DataSArrows($('*[data-s-arrows="1"]'));
            this.DataSaveStructure($('*[data-save-structure="1"]'));
            this.DataQuickStructure($('*[data-quick-Structure="1"]'));

            if (window.location.search !== "" && !$("tr.edit").length && $(".dataTable").length && !PR.UI.PageViewIdProcessed)
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

                    PR.UI.PageViewIdProcessed = true;
                }
            }

            this.AutoLogOff(lgt);
            this.DataRenew(atr);
            this.DataStayAlive();


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

                        if (PR.Modal.MovedObj.length)
                        {
                            PR.Modal.MovedObj.appendTo(PR.Modal.MovedObjSource);
                        }

                        $(PR.Modal.Container).find('#modal-body').html('');
                        $(PR.Modal.Container).find('#modal-title').html('');

                        var title = "Auto Logoff";
                        var data = pap;

                        PR.Modal.MovedObj = data.children();
                        PR.Modal.MovedObjSource = data;

                        data.children().appendTo($(PR.Modal.Container).find('#modal-body'));

                        PR.Modal.Open(null, title);

                        setTimeout(function ()
                        {
                            PR.UI.AutoLogOff(3 + "m" + 0 + "s", true);
                        }, "100");
                    }
                    else
                    {
                        // Logout...
                        //window.location = "/Account/LogOff?r=alo";

                        $.get("/Account/PartialLogOff", {}, function (data, s, xhr)
                        {
                            PR.Modal.Close();

                            var date = new Date(null);
                            date.setSeconds(cas); // specify value for SECONDS here
                            var result = date.toISOString().substr(11, 8);

                            var title = "You've been logged out";
                            var msg = "<p>YOU HAVE BEEN LOGGED OUT OF THE SYSTEM DUE TO NO ACTIVITY FOR THE PAST " + result + ".</p>";
                            msg += "<p>PLEASE CLOSE YOUR BROWSER, RE-OPEN THE APPLICATION AND LOG IN, SHOULD YOU NEED TO CONTINUE WORKING</p>";
                            msg += "<p>THANK YOU</p>";

                            setTimeout(function ()
                            {
                                PR.Modal.Open(msg, title);
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
                        PR.UI.AutoLogOff(lgt);
                    }, "800");

                    PR.UI.DataStayAlive();

                    PR.Modal.Close();
                });
        },

        DataRenew: function (s)
        {
            if (s == "-1") return;

            clearTimeout(PR.UI.PageRenewTimer);

            PR.UI.PageRenewTimer = setTimeout(function ()
            {
                $.get("/Account/Renew", {}, function (data, s, xhr)
                {
                });
            }, s);
        },

        DataStayAlive: function ()
        {
            clearTimeout(PR.UI.PageStayAliveTimer);

            PR.UI.PageStayAliveTimer = setTimeout(function ()
            {
                $.get(siteurl + "/StayAlive", {}, function (data, s, xhr)
                {
                    PR.UI.DataStayAlive();
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

                        PR.UI.DataPartialLoad(i, sender);
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

                    PR.UI.DataPartialLoad(i, params);
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

                            PR.Sticky.StickyOne.addClass("error");
                            PR.Sticky.StickyOne.css({ "display": "none" });

                            PR.Sticky.Show(cntr, "We can't go next yet!", err, [], direction);
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

                    if (PR.UI.SelectedItems.length)
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
                            PR.Loader.Show(s, true);

                            odurl = siteurl + odurl;
                            od.load(odurl, { id: $(this).val() }, function ()
                            {
                                PR.Init.Start(true);
                            });

                            prurl = siteurl + prurl;
                            pr.load(prurl, { id: $(this).val() }, function ()
                            {
                                PR.Init.Start(true);
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
                            PR.UI.DataIndex(target.find('input[type="checkbox"]:checked'));

                            var ind = SelectedItemExist($(this).val());

                            if (!$(this).is(":checked") && ind >= 0)
                            {
                                PR.UI.SelectedItems.splice(ind, 1);
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
                                        PR.UI.SelectedItems.push({ "Id": id, "Number": number });
                                    }
                                });
                            }

                            if (target.find("#sel-pr-count").length)
                            {
                                target.find("#sel-pr-count").text(PR.UI.SelectedItems.length + " Item (s) Selected");
                            }
                        });

                    if (target.find("#sel-pr-count").length)
                    {
                        target.find("#sel-pr-count").text(PR.UI.SelectedItems.length + " Item (s) Selected");
                    }
                }

                function SelectedItemExist(id)
                {
                    for (var i = 0; i < PR.UI.SelectedItems.length; i++)
                    {
                        if (PR.UI.SelectedItems[i].Id == id) return i;
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
                        PR.Loader.Show(target.find("#details #sel-pr-loader"), false);

                        $.get(siteurl + "/CompleteAuthorisation", {}, function (data, status, req)
                        {
                            target.find("#details").html(data);

                            target.find("#pr-preview").show(1200);

                            PR.Loader.Hide();
                            me.attr("data-loaded", "1");

                            PR.Init.PluginInit(target);

                            PR.UI.DataValMax($('*[data-val-length-max]'));
                            PR.UI.DataAjaxForm($('*[data-ajax-form="1"]'));
                            PR.UI.DataCheckOTP($('*[data-check-otp="1"]'));
                            PR.UI.DataResendOTP($('*[data-resend-otp="1"]'));
                        });
                    }

                    target.animate({ scrollTop: target.offset().top - 50 }, 'slow', function () { });
                }

                function RestoreSelectedItems(target, preview)
                {
                    if (PR.UI.SelectedItems.length)
                    {
                        for (var i = 0; i < PR.UI.SelectedItems.length; i++)
                        {
                            if (typeof PR.UI.SelectedItems[i].Id === 'undefined') return;

                            var inp = '<input name="SelectedPRList[' + i + ']" type="hidden" value="' + PR.UI.SelectedItems[i].Id + '" />';
                            var s = '<span style="display: inline-block; border: 1px dashed #ddd; border-radius: 2px; padding: 4px; margin: 0 4px; 4px 0;">' + PR.UI.SelectedItems[i].Number.trim() + '</span>';

                            preview.find("#pr-preview").append(s);
                            preview.find("#pr-preview").append(inp);

                            if (target.find('input[type="checkbox"][data-id="' + PR.UI.SelectedItems[i].Id + '"]').length)
                            {
                                target.find('input[type="checkbox"][data-id="' + PR.UI.SelectedItems[i].Id + '"]')
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

            if (typeof PR.UI[hash] == 'undefined')
            {
                PR.UI[hash] = [];
                PR.UI[hash].SelectedPRs = [];
                PR.UI[hash].SelectedItems = [];
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

                            PR.Sticky.StickyOne.addClass("error");
                            PR.Sticky.StickyOne.css({ "display": "none" });

                            PR.Sticky.Show(cntr, "We can't go next yet!", err, [], direction);
                            $('html, body').animate({ scrollTop: cntr.offset().top - 150 }, 'slow', function () { cntr.focus(); });

                            return valid;
                        }
                        else
                        {
                            Show(sender, me, target);
                        }

                        return false;
                    });

                if (typeof PR.UI[hash] == 'undefined')
                {
                    PR.UI[hash] = [];
                    PR.UI[hash].SelectedPRs = [];
                    PR.UI[hash].SelectedItems = [];
                }

                if ($("#select-pr").length && typeof (PR.UI[hash].SelectedItems) != 'undefined')
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
                            PR.UI.DataIndex(target.find('input[type="checkbox"]:checked'));

                            var ind = SelectedItemExist($(this).val());

                            if (!$(this).is(":checked") && ind >= 0)
                            {
                                PR.UI[hash].SelectedItems.splice(ind, 1);
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
                                        PR.UI[hash].SelectedItems.push({ "Id": id, "Number": number });
                                    }
                                });
                            }

                            if (target.find("#sel-pr-count").length)
                            {
                                target.find("#sel-pr-count").text(PR.UI[hash].SelectedItems.length);
                            }
                        });

                    if (target.find("#sel-pr-count").length)
                    {
                        target.find("#sel-pr-count").text(PR.UI[hash].SelectedItems.length);
                    }
                }

                function SelectedItemExist(id)
                {
                    for (var i = 0; i < PR.UI[hash].SelectedItems.length; i++)
                    {
                        if (PR.UI[hash].SelectedItems[i].Id === id) return i;
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

                        PR.Loader.Show(target.find("#details #sel-pr-loader"), false);

                        var params = "";

                        for (var i = 0; i < PR.UI[hash].SelectedItems.length; i++)
                        {
                            if (params !== "")
                            {
                                params = params + "&";
                            }

                            params = params + "PRIds=" + PR.UI[hash].SelectedItems[i].Id;
                        }

                        $.get(siteurl + "/PaymentInstruction?" + params, {}, function (data, status, req)
                        {
                            target.find("#details").html(data);

                            target.find("#pr-preview").show(1200);

                            PR.Loader.Hide();
                            me.attr("data-loaded", "1");

                            //var amt = target.find("#details #pi-calculatedtotal").val().replace(/,/g, ".").replace(/ /g, "");

                            //target.find("#details #pi-amount").val(parseFloat(amt));
                            //target.find("#details #pi-calculatedtotal").val(parseFloat(amt));

                            PR.Init.PluginInit(target);
                            PR.UI.DataGroupPrAmount(target.find("#details").find('*[data-group-pr-amount="1"]'));

                            PR.UI.DataValMax($('*[data-val-length-max]'));
                            PR.UI.DataAjaxForm($('*[data-ajax-form="1"]'));
                        });
                    }

                    target.animate({ scrollTop: target.offset().top - 50 }, 'slow', function () { });
                }

                function RestoreSelectedItems(target, preview)
                {
                    if (PR.UI[hash].SelectedItems.length)
                    {
                        for (var i = 0; i < PR.UI[hash].SelectedItems.length; i++)
                        {
                            if (typeof PR.UI[hash].SelectedItems[i].Id === 'undefined') return;

                            var inp = '<input name="SelectedPRList[' + i + ']" type="hidden" value="' + PR.UI[hash].SelectedItems[i].Id + '" />';
                            var s = '<span style="display: inline-block; border: 1px dashed #ddd; border-radius: 2px; padding: 4px; margin: 0 4px; 4px 0;">';
                            s += PR.UI[hash].SelectedItems[i].Number.trim();
                            s += '<span style="padding: 0 4px;">|</span>';
                            s += PR.UI[hash].SelectedItems[i].Amount;
                            s += '</span>';

                            preview.find("#pr-preview").append(s);
                            preview.find("#pr-preview").append(inp);

                            if (target.find('input[type="checkbox"][data-id="' + PR.UI[hash].SelectedItems[i].Id + '"]').length)
                            {
                                target.find('input[type="checkbox"][data-id="' + PR.UI[hash].SelectedItems[i].Id + '"]')
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
                        PR.UI.ClearCustomSearch(i.attr("data-target").replace("#", ""));

                        var atarget = $(target.attr("data-target"));

                        atarget.html("");
                        target.attr("data-rendered", 0);
                        target.click();
                        $(".tipsy").remove();

                        PR.UI.SelectedItems = [];
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

                if (rendered == 1 || count > 1)
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

                if (window.location.search != "")
                {
                    var search = window.location.search.replace("?", "").split("&");
                    for (var ix = 0; ix < search.length; ix++)
                    {
                        var xxs = search[ix].split("=");

                        if (xxs[0].toLowerCase() == "skip")
                        {
                            PR.UI.PageSkip = xxs[1];
                        }
                        if (xxs[0].toLowerCase() == "prid")
                        {
                            PR.UI.PageViewId = xxs[1];
                        }
                        if (xxs[0].toLowerCase() == "budgetyear")
                        {
                            by = xxs[1];
                            PR.UI.PageBudgetYear = xxs[1];
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
                        target.find(".partial-results").stop().load(url, { skip: PR.UI.PageSkip, PRId: PR.UI.PageViewId, BudgetYear: by }, function (r, s, xhr)
                        {
                            if (s == "error")
                            {
                                PR.Modal.Open(xhr.responseText, xhr.statusText, false, PR.Init.Start());

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
                                        PR.UI.Start();
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

                            PR.Init.Start(true);
                            PR.UI.DataTablesOverride(target);
                            PR.UI.DataPRSum($('*[data-pr-sum="1"]'));

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

                        if (i.hasClass("custom-validate") && !PR.UI.DataValidateForm(jqForm))
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

                        PR.Loader.Show((islink || ispreview || isstructure) ? i.find('#sdoc-btn') : i.find('#save-btn'), true);

                    },  // pre-submit callback 
                    success: function (data, status, f)
                    {
                        var hash = window.location.hash.replace('#', '');

                        PR.UI.SelectedPRs = [];
                        PR.UI.SelectedItems = [];

                        if (typeof PR.UI[hash] !== 'undefined')
                        {
                            PR.UI[hash].SelectedPRs = [];
                            PR.UI[hash].SelectedItems = [];
                        }

                        PR.Init.PluginLoaded = false;
                        PR.Init.Start();

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
                                PR.UI.Get([], $(xpr.attr("data-target")), "/PaymentRequisition/List", {}, {}, false);
                            }, '5000');
                        }

                        else if (ispreview)
                        {
                            $("#report-preview a").click();
                        }

                        else if (isstructure)
                        {
                            PR.UI.DataSwitchTabs("#manageusers", "#userstructure");

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

                        PR.Sticky.StickyOne.addClass("error");
                        PR.Sticky.StickyOne.css({ "display": "none" });

                        PR.Sticky.Show(cntr, "Oops! Something went wrong", data, PR.Init.Start(), "bottom-left");
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

                        PR.Sticky.StickyOne.css({ "display": "none" });
                        PR.Sticky.Show(i, title, msg, [], "center-right");

                        var m = PR.Sticky.StickyOne.find(".sticky-data");

                        var no = m.find("#del-no");
                        var yes = m.find("#del-yes");

                        no
                            .unbind("click")
                            .bind("click", function ()
                            {
                                PR.Sticky.Hide();
                            });

                        yes
                            .unbind("click")
                            .bind("click", function ()
                            {
                                PR.Loader.Show(i, true);

                                target.load(url, { pid: pid, vid: vid }, function ()
                                {
                                    PR.Sticky.Hide();
                                    PR.Loader.Hide();
                                    PR.Init.Start(true);
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
                            PR.Init.Start(true);
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

                        PR.UI.RecreatePlugins(clone);

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
                    PR.Init.Start();

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
                                PR.UI.DataIndex($(this).find('input,select,textarea,label,a,div[data-del-holder="1"]'), i);
                            });

                            PR.UI.DataDelOneMore($('*[data-del-one-more="1"]'));
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
                        if (PR.Modal.MovedObj.length)
                        {
                            PR.Modal.MovedObj.appendTo(PR.Modal.MovedObjSource);
                        }

                        $(PR.Modal.Container).find('#modal-body').html('');
                        $(PR.Modal.Container).find('#modal-title').html('');

                        var title = i.attr('data-title');
                        var data = $(i.attr('data-target'));

                        PR.Modal.MovedObj = data.children();
                        PR.Modal.MovedObjSource = data;

                        data.children().appendTo($(PR.Modal.Container).find('#modal-body'));

                        PR.Modal.Open(null, title);

                        PR.StartUp.Start();

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
                        PR.Sticky.Show(i, title, target.html(), [], arrow);

                        PR.Init.PluginInit(PR.Sticky.StickyOne);
                        PR.UI.DataShowSelected($('*[data-show-selected="1"]'));

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

                PR.UI.RecreatePlugins(f);

                f.animate({ "opacity": "1", "filter": "alpha(opacity=100)" }, 1000, function () { });

                PR.UI[t].PageSkip = 0;
                PR.UI[t].PageNumber = 0;

                PR.Init.AppendPaging(form, t);
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

            PR.Init.PluginInit(sender);
        },

        DataDoCustomSearch: function (sender, target, url, callback)
        {
            // Params
            var params = PR.UI.GetCustomSearchParams(target.attr("id"));

            PR.UI.Get(sender, target, url, params, callback, true);

            PR.UI.SelectedItems = [];

            return false;
        },

        GetCustomSearchParams: function (t)
        {
            // Params
            var params = {
                Skip: PR.UI[t].PageSkip || PR.UI.PageSkip || 0,
                Take: PR.UI[t].PageLength || PR.UI.PageLength || 50,
                Page: PR.UI[t].PageNumber || PR.UI.PageNumber || 0,
                Sort: PR.UI[t].PageSort || PR.UI.PageSort || "ASC",
                SortBy: PR.UI[t].PageSortBy || PR.UI.PageSortBy || "Id",
                PRId: PR.UI[t].PagePRId || PR.UI.PagePRId || 0,
                PRNumber: PR.UI[t].PagePRNumber || PR.UI.PagePRNumber || "",
                UserId: PR.UI[t].PageUserId || PR.UI.PageUserId || 0,
                BudgetYear: PR.UI[t].PageBudgetYear || PR.UI.PageBudgetYear || '',
                SupplierId: PR.UI[t].PageSupplierId || PR.UI.PageSupplierId || 0,
                SelectedPRs: PR.UI.SelectedPRs || [],
                SelectedItems: PR.UI[t].SelectedItems || PR.UI.SelectedItems || [],
                FundingCompanyId: PR.UI[t].PageFundingCompanyId || PR.UI.PageFundingCompanyId || 0,
                IncomeStream: PR.UI[t].PageIncomeStream || PR.UI.PageIncomeStream || "",
                FromDate: PR.UI[t].PageFromDate || PR.UI.PageFromDate || "",
                ToDate: PR.UI[t].PageToDate || PR.UI.PageToDate || "",
                POPStatus: PR.UI[t].PagePOPStatus || PR.UI.PagePOPStatus || -1,
                PRStatus: PR.UI[t].PagePRStatus || PR.UI.PagePRStatus || -1,
                ActionDate: PR.UI[t].PageActionDate || PR.UI.PageActionDate || "",
                PaymentStatus: PR.UI[t].PagePaymentStatus || PR.UI.PagePaymentStatus || -1,
                PaymentMethod: PR.UI[t].PagePaymentMethod || PR.UI.PagePaymentMethod || -1,
                PaymentFrequency: PR.UI[t].PagePaymentFrequency || PR.UI.PagePaymentFrequency || -1,
                Branch: PR.UI[t].PageBranch || PR.UI.PageBranch || "",
                DirectorateProject: PR.UI[t].PageDirectorateProject || PR.UI.PageDirectorateProject || "",
                DepartmentSubProject: PR.UI[t].PageDepartmentSubProject || PR.UI.PageDepartmentSubProject || "",
                Bank: PR.UI[t].PageBank || PR.UI.PageBank || -1,
                Account: PR.UI[t].PageAccount || PR.UI.PageAccount || "",
                AccountType: PR.UI[t].PageAccountType || PR.UI.PageAccountType || "",
                DocumentType: PR.UI[t].PageDocumentType || PR.UI.PageDocumentType || "",
                ExpenseType: PR.UI[t].PageExpenseType || PR.UI.PageExpenseType || "",
                VAT: PR.UI[t].PageVAT || PR.UI.PageVAT || false,
                Authlevel: PR.UI[t].PageAuthlevel || PR.UI.PageAuthlevel || -1,
                ActivityType: PR.UI[t].PageActivityType || PR.UI.PageActivityType || -1,
                RoleType: PR.UI[t].PageRoleType || PR.UI.PageRoleType || -1,
                Province: PR.UI[t].PageProvince || PR.UI.PageProvince || -1,
                CheckedByFinance: PR.UI[t].PageCheckedByFinance || PR.UI.PageCheckedByFinance || -1,
                City: PR.UI[t].PageCity || PR.UI.PageCity || "",
                EventId: PR.UI[t].PageEventId || PR.UI.PageEventId || "",
                Query: PR.UI[t].PageQuery || PR.UI.PageQuery || "",
                ReturnView: PR.UI[t].PageReturnView || PR.UI.PageReturnView || "",
                Controller: PR.UI[t].PageController || PR.UI.PageController || "",
                TableName: PR.UI[t].PageTableName || PR.UI.PageTableName || "",
                ControllerName: PR.UI[t].PageControllerName || PR.UI.PageControllerName || "",
                IsCustomSearch: PR.UI[t].IsCustomSearch || PR.UI.IsCustomSearch || false,
                FinCheckComplete: PR.UI[t].PageFinCheckComplete || PR.UI.PageFinCheckComplete || false,
                FinCheckInComplete: PR.UI[t].PageFinCheckInComplete || PR.UI.PageFinCheckInComplete || false
            };

            return params;
        },

        ClearCustomSearch: function (t)
        {
            if (t === "") return;

            if (!PR.UI[t])
            {
                PR.UI[t] = [];
            }

            PR.UI[t].PageSkip = PR.UI.PageSkip = 0;
            PR.UI[t].PageNumber = PR.UI.PageNumber = 1;
            PR.UI[t].PageLength = PR.UI.PageLength = 50;
            PR.UI[t].PageSort = PR.UI.PageSort = "ASC";
            PR.UI[t].PageSortBy = PR.UI.PageSortBy = "Id";
            PR.UI[t].PagePRId = PR.UI.PagePRId = 0;
            PR.UI[t].PagePRNumber = PR.UI.PagePRNumber = "";
            PR.UI[t].PageUserId = PR.UI.PageUserId = 0;
            PR.UI.SelectedPRs = PR.UI.SelectedPRs = [];
            PR.UI[t].SelectedItems = PR.UI.SelectedItems = [];
            PR.UI[t].PageSupplierId = PR.UI.PageSupplierId = 0;
            PR.UI[t].PageBudgetYear = PR.UI.PageBudgetYear = '';
            PR.UI[t].PageFundingCompanyId = PR.UI.PageFundingCompanyId = 0;
            PR.UI[t].PageIncomeStream = PR.UI.PageIncomeStream = "";
            PR.UI[t].PageFromDate = PR.UI.PageFromDate = "";
            PR.UI[t].PageToDate = PR.UI.PageToDate = "";
            PR.UI[t].PageActionDate = PR.UI.PageActionDate = "";
            PR.UI[t].PagePRStatus = PR.UI.PagePRStatus = -1;
            PR.UI[t].PagePOPStatus = PR.UI.PagePOPStatus = -1;
            PR.UI[t].PagePaymentStatus = PR.UI.PagePaymentStatus = -1;
            PR.UI[t].PagePaymentMethod = PR.UI.PagePaymentMethod = -1;
            PR.UI[t].PagePaymentFrequency = PR.UI.PagePaymentFrequency = -1;
            PR.UI[t].PageBranch = PR.UI.PageBranch = "";
            PR.UI[t].PageDirectorateProject = PR.UI.PageDirectorateProject = "";
            PR.UI[t].PageDepartmentSubProject = PR.UI.PageDepartmentSubProject = "";
            PR.UI[t].PageBank = PR.UI.PageBank = -1;
            PR.UI[t].PageAccount = PR.UI.PageAccount = "";
            PR.UI[t].PageAccountType = PR.UI.PageAccountType = "";
            PR.UI[t].PageExpenseType = PR.UI.PageExpenseType = "";
            PR.UI[t].PageDocumentType = PR.UI.PageDocumentType = "";
            PR.UI[t].PageVAT = false;
            PR.UI[t].PageAuthlevel = PR.UI.PageAuthlevel = -1;
            PR.UI[t].PageActivityType = PR.UI.PageActivityType = -1;
            PR.UI[t].PageRoleType = PR.UI.PageRoleType = -1;
            PR.UI[t].PageProvince = PR.UI.PageProvince = -1;
            PR.UI[t].PageCheckedByFinance = PR.UI.PageCheckedByFinance = -1;
            PR.UI[t].PageCity = PR.UI.PageCity = "";
            PR.UI[t].PageEventId = PR.UI.PageEventId = "";
            PR.UI[t].PageQuery = PR.UI.PageQuery = "";
            PR.UI[t].PageTableName = PR.UI.PageTableName = "";
            PR.UI[t].PageControllerName = PR.UI.PageControllerName = "";
            PR.UI[t].PageReturnView = PR.UI.PageReturnView = "_List";
            PR.UI[t].PageController = PR.UI.PageController = "DashBoard";
            PR.UI[t].IsCustomSearch = PR.UI.IsCustomSearch = false;
            PR.UI[t].PageFinCheckComplete = PR.UI.PageFinCheckComplete = "false";
            PR.UI[t].PageFinCheckInComplete = PR.UI.PageFinCheckInComplete = "false";

            return true;
        },

        BeginCustomSearch: function (sender)
        {
            PR.Loader.Show(sender.find("#save-btn"), true);

            if (sender.find("#ReturnView").length)
            {
                var t = sender.find("#ReturnView").val().replace("_", "").toLowerCase();

                PR.UI[t] = PR.UI[t] || [];

                sender.find('select,textarea,input[type="text"],input[type="checkbox"],input[type="hidden"]').each(function ()
                {
                    var i = $(this);

                    var id = i.attr("id");

                    if (typeof (id) == "undefined") return;

                    id = "Page" + id.split("_")[0];

                    PR.UI[t][id] = i.val();

                    if ($(this).is(":checkbox") || $(this).is(":radio"))
                    {
                        PR.UI[t][id] = $(this).is(":checked");
                    }
                });

                PR.UI[t].IsCustomSearch = true;
            }
        },

        CompleteCustomSearch: function (sender)
        {
            PR.Sticky.Hide();
            PR.Init.Start(true);
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

                PR.Loader.Show(i.find("span"), true);

                $.get(siteurl + url, { vid: vid, view: view }, function (data, status, req)
                {
                    i.html(data);

                    PR.Init.Start(true);

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

                        PR.UI.Get(loader, newTarget, url, {}, {}, load);

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

                        PR.UI.Get(target.find("span"), target, url, {});

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
                        PR.UI.DeleteFix(i, target, refresh);
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

                        var btn = $(PR.Modal.Container).find('.btns #btnConfirm');

                        btn.val("Yes");

                        PR.Modal.Open(msg, title, true);

                        btn
                            .unbind("click")
                            .bind("click", function ()
                            {
                                var reason = $(PR.Modal.Container).find('#reason');

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

                                PR.Loader.Show(target.parent().find('tr.edit td span'));

                                refresh.load(url, { id: id, reason: res }, function ()
                                {
                                    $(".tipsy").remove();

                                    PR.Init.Start(true);
                                    PR.UI.DataHotSpot($('*[data-hot-spot="1"]'), true);
                                });

                                PR.Modal.Close();
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

            PR.Loader.Show(target.parent().find('tr.edit td span'));

            url = url + "?query=" + PR.UI.PageSearch + "&skip=" + PR.UI.PageSkip + "&take=" + PR.UI.PageLength + "&page=" + PR.UI.PageNumber;

            refresh.load(url, {}, function ()
            {
                $(".tipsy").remove();

                PR.Init.Start(true);
                PR.UI.DataHotSpot($('*[data-hot-spot="1"]'), true);
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
                        var valid = PR.Validation.Validate(i);

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

        DataPRSum: function (sender, force)
        {
            sender.each(function ()
            {
                var i = $(this);
                var papa = i.parent();
                var total = papa.find(".pr-total");

                if (typeof i.attr("data-loaded") != undefined && i.attr("data-loaded") == "1" && !force) return;

                var j = { status: i.attr("data-status"), status2: i.attr("data-status2"), method: i.attr("data-method") };

                var h = "<img style='width: 20px;' title='Hello, just busy updating this menu total.' alt='' src='" + imgurl + "/images/hot.gif' />";

                i.add(total).append(h).show(1200);

                $.ajax({
                    url: siteurl + "/PRSum",
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
                        i.html("R " + response.sum.money(2));
                        total.html(response.total);

                        i.attr("data-loaded", "1");
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

                                PR.Sticky.Show(i, title, message, [], "center-left");

                                var no = PR.Sticky.StickyOne.find("#no-remove");
                                var yes = PR.Sticky.StickyOne.find("#yes-remove");

                                no
                                    .unbind("click")
                                    .bind("click", function ()
                                    {
                                        PR.Sticky.Hide();
                                    });

                                yes
                                    .unbind("click")
                                    .bind("click", function ()
                                    {
                                        PR.Loader.Show(yes, true);

                                        $.post(PR.UI.URL + h.attr("data-url"), { id: h.val() }, function (data)
                                        {
                                            PR.Loader.Hide();

                                            var d = $("<div/>").html(data);

                                            PR.Sticky.Show(i, d.find(".title").text(), d.find(".message").html(), [], "center-left");

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

            PR.Loader.Show(sender, loadImg);

            $.get(url, params, function (data, s, xhr)
            {
                if (s == "error")
                {
                    PR.Modal.Open(xhr.responseText, xhr.statusText, false, PR.Init.Start());

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

                PR.Init.Start(true);

                $.validator.unobtrusive.parse(target);

                if (noAnminate == undefined)
                {
                    $('html, body').animate({ scrollTop: target.offset().top - 60 }, 'slow', function () { });
                }

                if (target.find(".dataTables_wrapper").length)
                {
                    PR.UI.DataTablesOverride(target);
                }

                PR.UI.DataCallBack(callback);

            }).error(function (xhr)
            {
                PR.Modal.Open(xhr.responseText, xhr.statusText, false, PR.Init.Start());
            }).fail(function (xhr)
            {
                PR.Modal.Open(xhr.responseText, xhr.statusText, false, PR.Init.Start());
            });
        },

        Post: function (sender, target, url, params, callback, loadImg, noAnminate)
        {
            loadImg = loadImg ? true : false;

            PR.Loader.Show(sender, loadImg);

            $.post(url, params, function (data, s, xhr)
            {
                if (s == "error")
                {
                    PR.Modal.Open(xhr.responseText, xhr.statusText, false, PR.Init.Start());

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

                PR.Init.Start(true);

                $.validator.unobtrusive.parse(target);

                if (noAnminate == 'undefined')
                {
                    $('html, body').animate({ scrollTop: target.offset().top - 60 }, 'slow', function () { });
                }

                PR.UI.DataCallBack(callback);

            }).error(function (xhr)
            {
                PR.Modal.Open(xhr.responseText, xhr.statusText, false, PR.Init.Start());
            }).fail(function (xhr)
            {
                PR.Modal.Open(xhr.responseText, xhr.statusText, false, PR.Init.Start());
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

            var th = dt.find('th[data-column="' + PR.UI[t].PageSortBy + '"]');

            th.attr("data-sort", PR.UI[t].PageSort)
                .removeClass("sorting")
                .addClass("sorting_" + PR.UI[t].PageSort);
        },

        DataTablesOverride: function (sender)
        {
            var t = "";

            sender.each(function ()
            {
                var i = $(this);

                t = i.attr("id");

                PR.UI[t] = PR.UI[t] || { PageLength: 50 };

                // Hide Defaults
                i.find(".dataTables_wrapper .dataTables_length,.dataTables_wrapper .dataTables_info,.dataTables_wrapper .dataTables_filter,.dataTables_wrapper .dataTables_paginate").remove();

                if (i.find(".tiny").length > 0) return;

                // Overrides

                // 1. Page Length
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                var length = i.find("#page-length");
                var l_cntr = length.find("#data-page-length");

                l_cntr.val(PR.UI[t].PageLength);

                if (!i.find(".dataTables_wrapper #page-length").length)
                {
                    i.find(".dataTables_wrapper").prepend(length);
                }

                l_cntr
                    .unbind("change")
                    .bind("change", function ()
                    {
                        PR.UI[t].PageLength = l_cntr.val();

                        // Reset
                        PR.UI[t].PageSkip = 0;
                        PR.UI[t].PageNumber = 0;

                        var url = (siteurl + l_cntr.attr("data-url")).split('?')[0].replace(siteurl, "");

                        // Params
                        if (PR.UI[t].IsCustomSearch)
                        {
                            return PR.UI.DataDoCustomSearch(l_cntr, i, url, PR.UI.AfterSort);
                        }

                        var params = PR.UI.GetCustomSearchParams(t);

                        params.Page = 0;
                        params.Skip = 0;
                        params.Take = l_cntr.val();
                        params.Query = PR.UI[t].PageSearch;

                        PR.UI.Get(l_cntr, i, url, params, PR.UI.AfterSort, true);
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
                if (PR.UI[t].PageSearch)
                {
                    s_cntr.focus().val(PR.UI[t].PageSearch);
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

                    var by = PR.UI[t].PageBudgetYear;

                    if ((typeof by == 'undefined' || by <= 0) && parseInt(PR.UI.DataGetQueryString("BudgetYear")) > 0)
                    {
                        by = PR.UI.DataGetQueryString("BudgetYear");
                    }

                    s_target.load(siteurl + "/" + s_cntr.attr("data-t"), { givecsm: true, bYear: by }, function ()
                    {
                        PR.UI.DataCustomSearchHighlight(sender, t);
                        PR.UI.DataStickyOne($('*[data-sticky-one="1"]'));
                    });
                }


                s_cntr
                    .unbind("keyup")
                    .bind("keyup", function (e)
                    {
                        var enter = (e.keyCode == 13 || e.which == 13 || ($(this).val() == ""));

                        if (enter)
                        {
                            PR.UI[t].PageSearch = PR.UI[t].PageQuery = s_cntr.val();

                            var url = (siteurl + s_cntr.attr("data-url")).split('?')[0].replace(siteurl, "");

                            if (PR.UI[t].IsCustomSearch)
                            {
                                PR.UI[t].PageQuery = s_cntr.val();

                                return PR.UI.DataDoCustomSearch(s_cntr, i, url, PR.UI.AfterSort);
                            }

                            var params = PR.UI.GetCustomSearchParams(t);

                            params.Page = 0;
                            params.Skip = 0;
                            params.Take = PR.UI[t].PageLength;
                            params.Query = s_cntr.val();

                            PR.UI.Get(s_cntr, i, url, params, PR.UI.AfterSort, true);
                        }
                    });

                //icon
                //.unbind("click")
                //.bind("click", function ()
                //{
                //    PR.UI[t].PageSearch = PR.UI[t].PageQuery = s_cntr.val();

                //    var url = (siteurl + s_cntr.attr("data-url")).split('?')[0].replace(siteurl, "");

                //    if (PR.UI[t].IsCustomSearch)
                //    {
                //        PR.UI[t].PageQuery = s_cntr.val();

                //        return PR.UI.DataDoCustomSearch(s_cntr, i, url, PR.UI.AfterSort);
                //    }

                //    PR.UI.Get(s_cntr, i, url, { query: s_cntr.val(), skip: 0, take: PR.UI[t].PageLength, page: 0 }, PR.UI.AfterSort, true);
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

                            PR.UI[t].PageSkip = skip;
                            PR.UI[t].PageNumber = page;

                            var url = (siteurl + navigation.attr("data-url")).split('?')[0].replace(siteurl, "");

                            if (PR.UI[t].IsCustomSearch)
                            {
                                return PR.UI.DataDoCustomSearch(n, i, url, PR.UI.AfterSort);
                            }

                            var params = PR.UI.GetCustomSearchParams(t);

                            params.Page = page;
                            params.Skip = skip;
                            params.Take = PR.UI[t].PageLength;
                            params.Query = PR.UI[t].PageSearch;

                            PR.UI.Get(n, i, url, params, PR.UI.AfterSort, true);
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

                            PR.UI[t].PageSort = sort;
                            PR.UI[t].PageSortBy = column;

                            var url = (siteurl + navigation.attr("data-url")).split('?')[0].replace(siteurl, "");

                            if (PR.UI[t].IsCustomSearch)
                            {
                                return PR.UI.DataDoCustomSearch($("#sort-loader"), i, url, PR.UI.AfterSort);
                            }

                            var params = PR.UI.GetCustomSearchParams(t);

                            params.Skip = 0;
                            params.Page = 0;
                            params.Take = PR.UI[t].PageLength;
                            params.Query = PR.UI[t].PageSearch;

                            params.Sort = sort;
                            params.SortBy = column;

                            PR.UI.Get($("#sort-loader"), i, url, params, PR.UI.AfterSort, true);
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

            //PR.UI.DataCustomSearchHighlight(sender, t);
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

            if (PR.UI[t] && PR.UI[t].IsCustomSearch)
            {
                ics = true;

                // Guess search criteria
                var q = "", h = "";
                q += "Custom search for: ";

                // FinCheckComplete
                if (PR.UI[t].PageFinCheckComplete == true && sender.find(".fcc").length)
                {
                    q += " <b class='italic'>[<a style='color: #69f95a;'>Finance Check Complete</a>]</b> ";
                }
                if (PR.UI[t].PageFinCheckInComplete == true && !sender.find(".fcc").length)
                {
                    q += " <b class='italic'>[<a style='color: #69f95a;'>Finance Check Incomplete</a>]</b> ";
                }

                var val = "";

                // User, Supplier, PR, Funding Company
                if (PR.UI[t].PagePRId && PR.UI[t].PagePRId != "0")
                {
                    val = (sender.find('select#PRId').length <= 0) ? PR.UI[t].PagePRId : sender.find('select#PRId:first option[value="' + PR.UI[t].PagePRId + '"]').text();

                    h += "PR: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ PR: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#PRId').val(PR.UI[t].PagePRId);
                }
                if (PR.UI[t].PageUserId && PR.UI[t].PageUserId != "0")
                {
                    val = (PR.UI[t].PageUserIdDesc) ? PR.UI[t].PageUserIdDesc : sender.find('select#UserId:first option[value="' + PR.UI[t].PageUserId + '"]').text();

                    h += "User: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ User: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#UserId').val(PR.UI[t].PageUserId);
                }
                if (PR.UI[t].PageSupplierId && PR.UI[t].PagSupplierId != "0")
                {
                    val = (sender.find('select#SupplierId').length <= 0) ? PR.UI[t].PageSupplierId : sender.find('select#SupplierId:first option[value="' + PR.UI[t].PageSupplierId + '"]').text();

                    h += "Supplier: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ Supplier: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#SupplierId').val(PR.UI[t].PageSupplierId);
                }
                if (PR.UI[t].PageFundingCompanyId && PR.UI[t].PageFundingCompanyId != "0")
                {
                    val = (sender.find('select#FundingCompanyId').length <= 0) ? PR.UI[t].PageFundingCompanyId : sender.find('select#FundingCompanyId:first option[value="' + PR.UI[t].PageFundingCompanyId + '"]').text();

                    h += "Funding Company: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ Funding Company: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#FundingCompanyId').val(PR.UI[t].PageFundingCompanyId);
                }
                if (PR.UI[t].PageBudgetYear && PR.UI[t].PageBudgetYear != "0")
                {
                    val = (sender.find('select#BudgetYear').length <= 0) ? PR.UI[t].PageBudgetYear : sender.find('select#BudgetYear:first option[value="' + PR.UI[t].PageBudgetYear + '"]').text();

                    h += "Budget Year: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ Budget Year: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#BudgetYear').val(PR.UI[t].PageBudgetYear);
                }

                // Income Stream
                if (PR.UI[t].PageIncomeStream && PR.UI[t].PageIncomeStream != "")
                {
                    h += "Income Stream: <b>" + PR.UI[t].PageIncomeStream + "</b>~";
                    q += " <b class='italic'>[ Income Stream: <a style='color: #69f95a;'>" + PR.UI[t].PageIncomeStream + "</a> ]</b> ";

                    sender.find('input#IncomeStream').val(PR.UI[t].PageIncomeStream);
                }

                // Date From & To
                if ((PR.UI[t].PageFromDate || PR.UI[t].PageToDate) && (PR.UI[t].PageFromDate != "" || PR.UI[t].PageToDate != ""))
                {
                    h += "Date: From <b>" + PR.UI[t].PageFromDate + ((PR.UI[t].PageToDate != "") ? "</b> To <b>" + PR.UI[t].PageToDate : "") + "</b>~";
                    q += " <b class='italic'>[ Date: <a style='color: #69f95a;'>From " + PR.UI[t].PageFromDate + ((PR.UI[t].PageToDate != "") ? " To " + PR.UI[t].PageToDate : "") + "</a> ]</b> ";

                    sender.find('input#ToDate').val(PR.UI[t].PageToDate);
                    sender.find('input#FromDate').val(PR.UI[t].PageFromDate);
                }

                // Payment Status
                if (PR.UI[t].PagePaymentStatus && PR.UI[t].PagePaymentStatus != "-1")
                {
                    val = (sender.find('select#PaymentStatus').length <= 0) ? PR.UI[t].PagePaymentStatus : sender.find('select#PaymentStatus:first option[value="' + PR.UI[t].PagePaymentStatus + '"]').text();

                    h += "Payment Status: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ Payment Status: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#PaymentStatus').val(PR.UI[t].PagePaymentStatus);
                }

                // Payment Method
                if (PR.UI[t].PagePaymentMethod && PR.UI[t].PagePaymentMethod != "-1")
                {
                    val = (sender.find('select#PaymentMethod').length <= 0) ? PR.UI[t].PagePaymentMethod : sender.find('select#PaymentMethod:first option[value="' + PR.UI[t].PagePaymentMethod + '"]').text();

                    h += "Payment Method: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ Payment Method: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#PaymentMethod').val(PR.UI[t].PagePaymentMethod);
                }

                // PR Status
                if (PR.UI[t].PagePRStatus && PR.UI[t].PagePRStatus != "-1")
                {
                    val = (sender.find('select#PRStatus').length <= 0) ? PR.UI[t].PagePRStatus : sender.find('select#PRStatus:first option[value="' + PR.UI[t].PagePRStatus + '"]').text();

                    h += "PR Status: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ PR Status: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#PRStatus').val(PR.UI[t].PagePRStatus);
                }

                // PR InProgressType
                if (PR.UI[t].PageInProgressType && PR.UI[t].PageInProgressType != "-1")
                {
                    val = (sender.find('select#InProgressType').length <= 0) ? PR.UI[t].PageInProgressType : sender.find('select#InProgressType:first option[value="' + PR.UI[t].PageInProgressType + '"]').text();

                    h += "In Progress Type: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ In Progress Type: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#InProgressType').val(PR.UI[t].PageInProgressType);
                }

                // PaymentFrequency
                if (PR.UI[t].PagePaymentFrequency && PR.UI[t].PagePaymentFrequency != "-1")
                {
                    h += "Payment Frequency: <b>" + sender.find('select#PaymentFrequency:first option[value="' + PR.UI[t].PagePaymentFrequency + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Payment Frequency: <a style='color: #69f95a;'>" + sender.find('select#PaymentFrequency:first option[value="' + PR.UI[t].PagePaymentFrequency + '"]').text() + "</a> ]</b> ";

                    sender.find('select#PaymentFrequency').val(PR.UI[t].PagePaymentFrequency);
                }

                // DocumentType
                if (PR.UI[t].PageDocumentType && PR.UI[t].PageDocumentType != "-1")
                {
                    h += "Document Type: <b>" + sender.find('select#DocumentType:first option[value="' + PR.UI[t].PageDocumentType + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Document Type: <a style='color: #69f95a;'>" + sender.find('select#DocumentType:first option[value="' + PR.UI[t].PageDocumentType + '"]').text() + "</a> ]</b> ";

                    sender.find('select#DocumentType').val(PR.UI[t].PageDocumentType);
                }

                // Branch
                if (PR.UI[t].PageBranch && PR.UI[t].PageBranch != "")
                {
                    h += "Branch: <b>" + PR.UI[t].PageBranch + "</b>~";
                    q += " <b class='italic'>[ Branch: <a style='color: #69f95a;'>" + PR.UI[t].PageBranch + "</a> ]</b> ";

                    sender.find('select#Branch').val(PR.UI[t].PageBranch);
                }

                // DirectorateProject
                if (PR.UI[t].PageDirectorateProject && PR.UI[t].PageDirectorateProject != "")
                {
                    val = (sender.find('select#DirectorateProject').length <= 0) ? PR.UI[t].PageDirectorateProjectDesc : sender.find('select#DirectorateProject:first option[value="' + PR.UI[t].PageDirectorateProject + '"]').text();

                    h += "Directorate Project: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ Directorate Project: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#DirectorateProject').val(PR.UI[t].PageDirectorateProject);
                }

                // DepartmentSubProject
                if (PR.UI[t].PageDepartmentSubProject && PR.UI[t].PageDepartmentSubProject != "")
                {
                    val = (sender.find('select#DepartmentSubProject').length <= 0) ? PR.UI[t].PageDepartmentSubProjectDesc : sender.find('select#DepartmentSubProject:first option[value="' + PR.UI[t].PageDepartmentSubProject + '"]').text();

                    h += "Department Sub-Project: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ Department/Sub-Project: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#DepartmentSubProject').val(PR.UI[t].PageDepartmentSubProject);
                }

                // AccountType
                if (PR.UI[t].PageAccountType && PR.UI[t].PageAccountType != "-1")
                {
                    val = (sender.find('select#AccountType').length <= 0) ? PR.UI[t].PageAccountType : sender.find('select#AccountType:first option[value="' + PR.UI[t].PageAccountType + '"]').text();

                    h += "Account Type: <b>" + val + "</b>~";
                    q += " <b class='italic'>[ Account Type: <a style='color: #69f95a;'>" + val + "</a> ]</b> ";

                    sender.find('select#AccountType').val(PR.UI[t].PageAccountType);
                }

                // VAT
                if (PR.UI[t].PageVAT)
                {
                    h += "VAT: <b>" + sender.find('select#VAT:first option[value="' + PR.UI[t].PageVAT + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ VAT: <a style='color: #69f95a;'>" + sender.find('select#VAT:first option[value="' + PR.UI[t].PageVAT + '"]').text() + "</a> ]</b> ";

                    sender.find('select#VAT').val(PR.UI[t].PageVAT);
                }

                // Authlevel
                if (PR.UI[t].PageAuthlevel && PR.UI[t].PageAuthlevel != "-1")
                {
                    h += "Authlevel: <b>" + sender.find('select#Authlevel:first option[value="' + PR.UI[t].PageAuthlevel + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Authlevel: <a style='color: #69f95a;'>" + sender.find('select#Authlevel:first option[value="' + PR.UI[t].PageAuthlevel + '"]').text() + "</a> ]</b> ";

                    sender.find('select#Authlevel').val(PR.UI[t].PageAuthlevel);
                }

                // ActivityType
                if (PR.UI[t].PageActivityType && PR.UI[t].PageActivityType != "-1")
                {
                    h += "Activity Type: <b>" + sender.find('select#ActivityType:first option[value="' + PR.UI[t].PageActivityType + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Activity Type: <a style='color: #69f95a;'>" + sender.find('select#ActivityType:first option[value="' + PR.UI[t].PageActivityType + '"]').text() + "</a> ]</b> ";

                    sender.find('select#ActivityType').val(PR.UI[t].PageActivityType);
                }

                // RoleType
                if (PR.UI[t].PageRoleType && PR.UI[t].PageRoleType != "-1")
                {
                    h += "Role Type: <b>" + sender.find('select#RoleType:first option[value="' + PR.UI[t].PageRoleType + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Role Type: <a style='color: #69f95a;'>" + sender.find('select#RoleType:first option[value="' + PR.UI[t].PageRoleType + '"]').text() + "</a> ]</b> ";

                    sender.find('select#RoleType').val(PR.UI[t].PageRoleType);
                }

                // Province
                if (PR.UI[t].PageProvince && PR.UI[t].PageProvince != "-1")
                {
                    h += "Province: <b>" + sender.find('select#Province:first option[value="' + PR.UI[t].PageProvince + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Province: <a style='color: #69f95a;'>" + sender.find('select#Province:first option[value="' + PR.UI[t].PageProvince + '"]').text() + "</a> ]</b> ";

                    sender.find('select#Province').val(PR.UI[t].PageProvince);
                }

                // ExpenseType
                if (PR.UI[t].PageExpenseType && PR.UI[t].PageExpenseType != "-1")
                {
                    h += "Account Type: <b>" + sender.find('select#ExpenseType:first option[value="' + PR.UI[t].PageExpenseType + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Expense Type: <a style='color: #69f95a;'>" + sender.find('select#ExpenseType:first option[value="' + PR.UI[t].PageExpenseType + '"]').text() + "</a> ]</b> ";

                    sender.find('select#ExpenseType').val(PR.UI[t].PageExpenseType);
                }

                // Account
                if (PR.UI[t].PageAccount && PR.UI[t].PageAccount != "-1")
                {
                    h += "Account: <b>" + sender.find('select#Account:first option[value="' + PR.UI[t].PageAccount + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Expense Type: <a style='color: #69f95a;'>" + sender.find('select#Account:first option[value="' + PR.UI[t].PageAccount + '"]').text() + "</a> ]</b> ";

                    sender.find('select#Account').val(PR.UI[t].PageAccount);
                }

                // CheckedByFinance
                if (PR.UI[t].PageCheckedByFinance && PR.UI[t].PageCheckedByFinance !== "-1")
                {
                    h += "Checked By Finance: <b>" + sender.find('select#CheckedByFinance:first option[value="' + PR.UI[t].PageCheckedByFinance + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Checked By Finance: <a style='color: #69f95a;'>" + sender.find('select#CheckedByFinance:first option[value="' + PR.UI[t].PageCheckedByFinance + '"]').text() + "</a> ]</b> ";

                    sender.find('select#CheckedByFinance').val(PR.UI[t].PageCheckedByFinance);
                }

                // Event Name
                if (PR.UI[t].PageEventId && PR.UI[t].PageEventId !== 0)
                {
                    h += "Event Name: <b>" + sender.find('select#EventId:first option[value="' + PR.UI[t].PageEventId + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Event Name: <a style='color: #69f95a;'>" + sender.find('select#EventId:first option[value="' + PR.UI[t].PageEventId + '"]').text() + "</a> ]</b> ";

                    sender.find('select#EventId').val(PR.UI[t].PageEventId);
                }

                // PR Number
                if (PR.UI[t].PagePRNumber && PR.UI[t].PagePRNumber !== "")
                {
                    h += "PR Number: <b>" + PR.UI[t].PagePRNumber + "</b>~";
                    q += " <b class='italic'>[ PR Number: <a style='color: #69f95a;'>" + PR.UI[t].PagePRNumber + "</a> ]</b> ";

                    sender.find('input#PRNumber').val(PR.UI[t].PagePRNumber);
                }

                // Table Name
                if (PR.UI[t].PageTableName && PR.UI[t].PageTableName !== "")
                {
                    h += "Table Name: <b>" + sender.find('select#TableName:first option[value="' + PR.UI[t].PageTableName + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Table Name: <a style='color: #69f95a;'>" + sender.find('select#TableName:first option[value="' + PR.UI[t].PageTableName + '"]').text() + "</a> ]</b> ";

                    sender.find('select#TableName').val(PR.UI[t].PageTableName);
                }

                // Controller Name
                if (PR.UI[t].PageControllerName && PR.UI[t].PageControllerName !== "")
                {
                    h += "Controller Name: <b>" + sender.find('select#ControllerName:first option[value="' + PR.UI[t].PageControllerName + '"]').text() + "</b>~";
                    q += " <b class='italic'>[ Controller Name: <a style='color: #69f95a;'>" + sender.find('select#ControllerName:first option[value="' + PR.UI[t].PageControllerName + '"]').text() + "</a> ]</b> ";

                    sender.find('select#ControllerName').val(PR.UI[t].PageControllerName);
                }

                // Query
                if (PR.UI[t].PageQuery && PR.UI[t].PageQuery !== "")
                {
                    h += "Query: <b>" + PR.UI[t].PageQuery + "</b>~";
                    q += " <b class='italic'>[ Query: <a style='color: #69f95a;'>" + PR.UI[t].PageQuery + "</a> ]</b> ";

                    sender.find('input#Query').val(PR.UI[t].PageQuery);
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
                var params = PR.UI.GetCustomSearchParams(t);

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
        DataPRBudget: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);
                var tr = i.parent().parent();
                var ob = tr.find('[data-ob="1"]');
                var rb = tr.find('[data-rb="1"]');
                var _rb = tr.find('#rb');
                var amt = tr.find('[data-pr-amount="1"]');

                i
                    .unbind("change")
                    .bind("change", function ()
                    {
                        var at = tr.find('select[data-name="AccountType"]').val();
                        var is = tr.find('select[data-name="IncomeStream"]').val();
                        var acc = tr.find('select[data-name="Account"]').val();

                        // Select new values
                        var branch = $('select[data-name="Branch"]').val();
                        var dp = $('select[data-name="DirectorateProject"]').val();
                        var dsp = $('select[data-name="DepartmentSubProject"]').val();

                        var val = $(this).val();

                        $(this).find("option").removeAttr("selected");
                        $(this).find('option[value="' + val + '"]').attr("selected", "selected");

                        // Only reload the budget line if all above have values
                        if (at != "" && is != "" && acc != "")
                        {
                            PR.Loader.Show(ob, true);
                            PR.Loader.Show(rb, true);

                            $.ajax({
                                type: "GET",
                                url: siteurl + "Budget",
                                data: { branch: branch, directorateProject: dp, departmentSubProject: dsp, accountType: at, incomeStream: is, account: acc },
                                dataType: "json",
                                success: function (data)
                                {
                                    ob.text("R " + data.Budget.Original.money(2));
                                    PR.UI.DataHighlightFields(ob.parent());

                                    _rb.val(data.Budget.Remaining);
                                    rb.text("R " + data.Budget.Remaining.money(2));
                                    PR.UI.DataHighlightFields(rb.parent());

                                    if (data.Budget.Remaining <= 0)
                                    {
                                        if (!rb.parent().find('[data-warn="1"]').length)
                                        {
                                            var warn = "";
                                            warn += "<a data-warn='1' rel='tipsyW' title='There is no more budget for this selection. You can however still proceed with you requisition request.'>";
                                            warn += "   <img alt='' src='" + imgurl + '/images/hot.gif' + "' style='width: 20px; margin-top: -2px;' />";
                                            warn += "</a>";

                                            rb.parent().append(warn);
                                            PR.Init.PluginInit(rb.parent());
                                        }
                                    }
                                    else
                                    {
                                        rb.parent().find('[data-warn="1"]').fadeOut(1200, function ()
                                        {
                                            $(this).remove();
                                        });
                                    }

                                    PR.Loader.Hide();
                                }
                            });
                        }
                        else
                        {
                            // Reset values
                            Reset(_rb, ob, rb, amt, tr);
                        }

                        var index = tr.index();

                        if ($(this).attr("data-name") == "AccountType")
                        {
                            tr.find('select[data-name="IncomeStream"]').parent().load(siteurl + "IncomeStreams", { branch: branch, directorateProject: dp, departmentSubProject: dsp, accountType: at, index: index }, function ()
                            {
                                PR.Init.Start(true);
                                Reset(_rb, ob, rb, amt, tr);
                                PR.UI.DataHighlightFields(tr.find('select[data-name="IncomeStream"]').parent());
                                PR.UI.DataHighlightFields(tr.find('select[data-name="Account"]').parent());
                            });
                        }
                        else if ($(this).attr("data-name") == "IncomeStream")
                        {
                            tr.find('select[data-name="Account"]').parent().load(siteurl + "Accounts", { branch: branch, directorateProject: dp, departmentSubProject: dsp, accountType: at, index: index }, function ()
                            {
                                PR.Init.Start(true);
                                Reset(_rb, ob, rb, amt, tr);
                                PR.UI.DataHighlightFields(tr.find('select[data-name="Account"]').parent());
                            });
                        }
                    });
            });

            function Reset(_rb, ob, rb, amt, tr)
            {
                _rb.val(0);
                ob.text('-/-');
                rb.text('-/-');
                rb.parent().find('[data-warn="1"]').remove();
                amt.val("R 0.00").change();

                tr.find('input[data-desc="1"]').val('').change();
            }
        },

        DataPRAmount: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var id = i.attr("id");
                var tr = i.parent().parent();
                var update = tr.find(i.attr("data-update"));

                i
                    .unbind("blur")
                    .bind("blur", function ()
                    {
                        var ai = tr.find('[data-pr-amount="1"]');
                        var ri = tr.find('[data-pr-refund="1"]');
                        var bl = tr.find('[data-pr-balance="1"]');

                        var v = $(this).val().split(/\s+/).join('').replace('R', '').replace(/,/g, '.');

                        clearTimeout(PR.UI.PageAmountTimer);
                        PR.UI.PageAmountTimer = setTimeout(function ()
                        {
                            if (parseFloat(v))
                            {
                                v = parseFloat(v);

                                if (id === "xamount")
                                {
                                    ai.val(v).attr("value", v);
                                }
                                else if (id === "xrefund")
                                {
                                    ri.val(v).attr("value", v);
                                }

                                if (update)
                                {
                                    update.val(v).attr("value", v);
                                }

                                i.val("R" + v.money(2)).attr("value", "R" + v.money(2));
                            }

                            if (id === "xamount")
                            {
                                PR.UI.DataExpectCost();
                            }
                            else if (id === "xrefund" && bl.length)
                            {
                                PR.UI.DataRefundCost();

                                // Calculate the refund
                                var amt = parseFloat(ai.val());
                                var balance = (amt - v);

                                bl.text("R" + balance.money(2));
                                PR.UI.DataHighlightFields(bl.parent());
                            }

                        }, 1000);
                    })
                    .bind("keypress", function (e)
                    {
                        e = (e) ? e : window.event;

                        var charCode = (e.which) ? e.which : e.keyCode;

                        if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57))
                        {
                            return false;
                        }
                        else
                        {
                            // If the number field already has . then don't allow to enter . again.
                            if (charCode === 46 && e.target.value.search(/\./) > -1)
                            {
                                return false;
                            }
                        }

                        if (id === "xamount")
                        {
                            var at = tr.find('select[data-name="AccountType"]').val();
                            var is = tr.find('select[data-name="IncomeStream"]').val();
                            var acc = tr.find('select[data-name="Account"]').val();

                            if (at === "" || is === "" || acc === "")
                            {
                                // Force user to select Account type, income stream, account first
                                var msg = "<div class='message-error'>"
                                msg += "    Please select the Account Type, Income Stream and Account to proceed!";
                                msg += "</div>";

                                PR.Sticky.Show(i, "Warning...", msg, [], "center-right");

                                return false;
                            }
                        }

                        return true;
                    })
                    /*.bind("blur", function ()
                    {
                        clearTimeout(PR.UI.PageAmount1Timer);
                        PR.UI.PageAmount1Timer = setTimeout(function ()
                        {
                            PR.UI.DataValidateInvoices(i);
                        }, 800);
                    })*/;
            });
        },

        DataValidateInvoices: function (i, group)
        {
            var oamt = parseFloat(i.attr("data-origamount"));
            var pramt = parseFloat(i.attr("data-pr-amount"));
            var isum = parseFloat(i.attr("data-invoice-sum"));

            var cntr = (group && group.length > 1) ? group.last() : i;

            var eamt = 0;
            var v = parseFloat(cntr.val().split(/\s+/).join('').replace('R', '').replace(/,/g, '.'));

            $("#doc-upload .grouped-area").each(function ()
            {
                if ($(this).find('input[data-doc-type="1"]:checked').val() != "2" && $(this).find('input[data-doc-type="1"]:checked').val() != "8")
                {
                    // Make sure to only calculate invoices/write-offs
                    return;
                }

                if (parseFloat($(this).find("input.inv-amt-update").val()))
                {
                    eamt += parseFloat($(this).find("input.inv-amt-update").val());
                }
            });

            var err = "";

            eamt = parseFloat((eamt - oamt).toFixed(2));
            var ieamt = parseFloat((isum + eamt).toFixed(2));
            var pamt = parseFloat(pramt.toFixed(2))

            if (ieamt > pamt)
            {
                err = "The maximum invoice/write-off amount that can be entered for this PR is R" + (pramt - isum - (eamt - v)).money(2) + ".";
            }

            if (err != "")
            {
                //i.val((pramt - isum - (eamt - v))).change();

                // Show warning
                PR.Sticky.StickyOne.addClass("error");
                PR.Sticky.StickyOne.css({ "display": "none" });

                PR.Sticky.Show(cntr, "Error", err, [], "top-left");
                $('html, body').animate({ scrollTop: cntr.offset().top - 150 }, 'slow', function () { });
            }

            return (err == "");
        },

        DataPRRemoveLine: function (sender)
        {
            var expectedCost = $("#ExpectedCost");

            sender.each(function ()
            {
                var i = $(this);
                var id = i.attr("data-id");
                var papa = i.parent().parent();
                var prevTr = $(i.attr("data-prev-row"));
                var amt = parseFloat(i.attr("data-amount"));

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        var title = i.attr("original-title");
                        var message = '<p>Are you sure you would like to remove this line?<br />This action will be permanent and unrevisable!</p>';

                        message += '<p>';
                        message += '  <input id="yes-remove" value="Yes" type="button" class="btn-yes" />';
                        message += '  <span style="padding: 0 5px;">/</span>';
                        message += '  <input id="no-remove" value="NO!" type="button" class="btn-no" />';
                        message += '</p>';

                        PR.Sticky.Show(i, title, message, [], "center-right");

                        var no = PR.Sticky.StickyOne.find("#no-remove");
                        var yes = PR.Sticky.StickyOne.find("#yes-remove");

                        no
                            .unbind("click")
                            .bind("click", function ()
                            {
                                PR.Sticky.Hide();
                            });

                        yes
                            .unbind("click")
                            .bind("click", function ()
                            {
                                PR.Loader.Show(yes, true);

                                $.post(siteurl + "RemovePRLine", { id: id }, function (data)
                                {
                                    var addMore = papa.find('[data-add-one-more="1"]');

                                    if (addMore.length)
                                    {
                                        if (prevTr)
                                        {
                                            addMore.fadeOut(1200, function ()
                                            {
                                                var f = prevTr.find("td:first").children(":first");

                                                $(this)
                                                    .attr("data-target", i.attr("data-prev-row"))
                                                    .insertBefore(f)
                                                    .fadeIn(1200, function ()
                                                    {
                                                        PR.UI.DataAddOneMore($('*[data-add-one-more="1"]'));
                                                    });

                                                papa.remove();
                                                PR.Loader.Hide();
                                                PR.Sticky.Hide();
                                            });
                                        }
                                        else
                                        {
                                            PR.Loader.Hide();
                                            PR.Sticky.Hide();
                                        }
                                    }
                                    else
                                    {
                                        papa.remove();
                                        PR.Loader.Hide();
                                        PR.Sticky.Hide();
                                    }

                                    var total = parseFloat(expectedCost.val()) - amt;
                                    expectedCost.val(total);
                                });
                            });

                        return false;
                    });
            });
        },

        DataExpectCost: function ()
        {
            var total = 0;

            var hash = window.location.hash;

            var expectedCost = $(hash + " #ExpectedCost");
            var expectedCostLabel = $(hash + " #ExpectedCostLabel");

            $(hash + ' #budget-lines').find('[data-pr-amount]').each(function ()
            {
                var i = $(this);

                var v = i.val();

                if (parseFloat(v) || v == 0)
                {
                    var amt = parseFloat(v);
                    total += amt;

                    var tr = i.parent().parent();
                    var rb = parseFloat(tr.find('#rb').val());

                    var xai = tr.find('[data-pr-xamount="1"]');

                    if (amt > rb)
                    {
                        if (!i.parent().find('[data-warn="1"]').length)
                        {
                            xai.stop().animate({
                                width: '68%'
                            }, 900, function ()
                                {
                                    var warn = "";
                                    warn += "<a data-warn='1' rel='tipsyE' title='WARNING: Amount exceeds the current remaining budget for this selection. You can however still proceed with you requisition request.'>";
                                    warn += "   <img alt='' src='" + imgurl + '/images/hot.gif' + "' style='width: 20px; margin-top: -2px;' />";
                                    warn += "</a>";

                                    i.parent().append(warn);
                                    PR.Init.PluginInit(i.parent());
                                });
                        }
                    }
                    else if (i.parent().find('[data-warn="1"]').length)
                    {
                        i.parent().find('[data-warn="1"]').fadeOut(500, function ()
                        {
                            $(this).remove();
                            xai.stop().animate({ width: '88%' }, 500);
                        });
                    }
                }
            });

            expectedCost.val(total);
            expectedCostLabel.text("R " + total.money(2));

            // Get authorisors
            if (total >= 0)
            {
                PR.UI.Get($(hash + " #authorisors-loader"),
                    $(hash + " #authorisors"),
                    siteurl + "/Authorisors",
                    {
                        expectedCost: total,
                        hash: hash.replace('#', ''),
                        prId: $(hash + " #Id").val(),
                        branch: $(hash + " #Branch").val(),
                        originatorId: $(hash + " #OriginatorId").val(),
                        directorateProject: $(hash + " #DirectorateProject").val(),
                        departmentSubProject: $(hash + " #DepartmentSubProject").val()
                    },
                    PR.UI.DataHighlightFields($(hash + " #authorisors")),
                    true, true);
            }
        },

        DataRefundCost: function ()
        {
            var total = 0;

            var hash = window.location.hash;

            var expectedCost = $(hash + " #ExpectedCost");
            var expectedCostLabel = $(hash + " #ExpectedCostLabel");

            $(hash + ' #budget-lines').find('[data-pr-refund]').each(function ()
            {
                var i = $(this);

                var v = i.val();

                if (parseFloat(v) || v == 0)
                {
                    var amt = parseFloat(v);
                    total += amt;
                }
            });

            expectedCost.val(total);
            expectedCostLabel.text("R " + total.money(2));

            // Get authorisors
            if (total >= 0)
            {
                PR.UI.Get($(hash + " #authorisors-loader"),
                    $(hash + " #authorisors"),
                    siteurl + "/Authorisors",
                    {
                        expectedCost: total,
                        hash: hash.replace('#', ''),
                        prId: $(hash + " #Id").val(),
                        branch: $(hash + " #Branch").val(),
                        originatorId: $(hash + " #OriginatorId").val(),
                        directorateProject: $(hash + " #DirectorateProject").val(),
                        departmentSubProject: $(hash + " #DepartmentSubProject").val()
                    },
                    PR.UI.DataHighlightFields($(hash + " #authorisors")),
                    true, true);
            }
        },

        DataUserStructure: function (sender)
        {
            var hash = window.location.hash;

            var budget = $(hash + " table#budget-lines");
            var expectedCost = $(hash + " #ExpectedCost");

            sender.each(function ()
            {
                var i = $(this);

                i
                    .unbind("change")
                    .bind("change", function ()
                    {
                        var branch = $(hash + ' select[data-name="Branch"]').val();
                        var dp = $(hash + ' select[data-name="DirectorateProject"]').val();
                        var dsp = $(hash + ' select[data-name="DepartmentSubProject"]').val();

                        var url = "";
                        var params = {};
                        var target = {};

                        var index = budget.find("tr").length;

                        var val = $(this).val();

                        $(this).find("option").removeAttr("selected");
                        $(this).find('option[value="' + val + '"]').attr("selected", "selected");

                        if (i.attr("data-name") == "Branch" && branch != "")
                        {
                            PR.Loader.Show(i.parent(), true);
                            $(hash + " #directorate-projects").load(siteurl + "/DirectorateProjects", { originatorId: $(hash + " #OriginatorId").val(), branch: branch, index: index }, function ()
                            {
                                PR.UI.DataHighlightFields($(hash + " #directorate-projects"));

                                dp = $(hash + ' select[data-name="DirectorateProject"]').val();

                                $(hash + " #department-sub-projects").load(siteurl + "/DepartmentSubProjects", { originatorId: $(hash + " #OriginatorId").val(), branch: branch, directorateProject: dp, index: index }, function ()
                                {
                                    PR.UI.DataRefreshView();
                                    PR.UI.DataHighlightFields($(hash + " #department-sub-projects"));

                                    dsp = $(hash + ' select[data-name="DepartmentSubProject"]').val();
                                });
                            });
                        }
                        else if (i.attr("data-name") == "DirectorateProject" && dp != "")
                        {
                            PR.Loader.Show(i.parent(), true);

                            $(hash + " #department-sub-projects").load(siteurl + "/DepartmentSubProjects", { originatorId: $(hash + " #OriginatorId").val(), branch: branch, directorateProject: dp, index: index }, function ()
                            {
                                PR.UI.DataRefreshView();
                                PR.UI.DataHighlightFields($(hash + " #department-sub-projects"));

                                dsp = $(hash + ' select[data-name="DepartmentSubProject"]').val();
                            });
                        }
                        else
                        {
                            PR.UI.DataRefreshView();
                        }
                    });
            });
        },

        DataPRSupplier: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                i
                    .unbind("change")
                    .bind("change", function ()
                    {
                        var selpem = $("#PaymentMethod option:selected").attr("string-value").trim();

                        if (selpem === "Cash" || selpem === "DACard")
                        {
                            return;
                        }

                        if ($(this).val() !== "")
                        {
                            if ($("#other-supplier-details").length)
                            {
                                $("#other-supplier-details input, #other-supplier-details select, #other-supplier-details textarea").attr("readonly", "readonly");
                                $("#other-supplier-details select").chznreadonly(true);
                            }

                            var d = { supplierId: $(this).val() };

                            $.ajax({
                                url: siteurl + "/GetSupplier",
                                type: "POST",
                                data: JSON.stringify(d),
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                error: function (e)
                                {

                                },
                                success: function (s)
                                {
                                    // 1. Supplier Contact Person
                                    if ($("#OtherSupplierContactPerson").length)
                                    {
                                        $("#OtherSupplierContactPerson").val(s.ContactPerson).attr("readonly", "readonly").change();
                                    }

                                    // 2. Supplier Contact Email Address
                                    if ($("#OtherSupplierContactEmail").length)
                                    {
                                        $("#OtherSupplierContactEmail").val(s.ContactEmail).attr("readonly", "readonly").change();
                                    }

                                    // 3. Supplier Name
                                    if ($("#OtherSupplier").length)
                                    {
                                        $("#OtherSupplier").val(s.Name).attr("readonly", "readonly").change();
                                    }

                                    // 4. Supplier Contact Number 
                                    if ($("#OtherSupplierContactTel").length)
                                    {
                                        $("#OtherSupplierContactTel").val(s.ContactCell).attr("readonly", "readonly").change();
                                    }

                                    // 5. Supplier Bank
                                    if ($("#OtherSupplierBankId").length)
                                    {
                                        $("#OtherSupplierBankId").removeAttr("readonly").chznreadonly(false);
                                        $("#OtherSupplierBankId").val(s.BankId).attr("readonly", "readonly").change();

                                        $("#s2id_OtherSupplierBankId .select2-choice > span").text($("#OtherSupplierBankId option:selected").text());
                                    }

                                    // 6. Supplier Bank Branch
                                    if ($("#OtherSupplierBranch").length)
                                    {
                                        $("#OtherSupplierBranch").val(s.BranchCode).attr("readonly", "readonly").change();
                                    }

                                    // 7. Supplier Account Number
                                    if ($("#OtherSupplierAccount").length)
                                    {
                                        $("#OtherSupplierAccount").val(s.Account).attr("readonly", "readonly").change();
                                    }

                                    // 8. Supplier Account Type
                                    if ($("#OtherSupplierAccountType").length)
                                    {
                                        $("#OtherSupplierAccountType").removeAttr("readonly").chznreadonly(false);
                                        $("#OtherSupplierAccountType").val(s.AccountType).attr("readonly", "readonly").change();

                                        $("#s2id_OtherSupplierAccountType .select2-choice > span").text($("#OtherSupplierAccountType option:selected").text());
                                    }
                                }
                            });
                        }
                        else if ($("#other-supplier-details").length)
                        {
                            $("#other-supplier-details input, #other-supplier-details select, #other-supplier-details textarea").removeAttr("readonly");
                            $("#other-supplier-details select").chznreadonly(false);

                            // 1. Supplier Contact Person
                            if ($("#OtherSupplierContactPerson").length)
                            {
                                $("#OtherSupplierContactPerson").val("").removeAttr("readonly").change();
                            }

                            // 2. Supplier Contact Email Address
                            if ($("#OtherSupplierContactEmail").length)
                            {
                                $("#OtherSupplierContactEmail").val("").removeAttr("readonly").change();
                            }

                            // 3. Supplier Name
                            if ($("#OtherSupplier").length)
                            {
                                $("#OtherSupplier").val("").removeAttr("readonly").change();
                            }

                            // 4. Supplier Contact Number
                            if ($("#OtherSupplierContactTel").length)
                            {
                                $("#OtherSupplierContactTel").val("").removeAttr("readonly").change();
                            }

                            // 5. Supplier Bank
                            if ($("#OtherSupplierBankId").length)
                            {
                                $("#OtherSupplierBankId").val("").removeAttr("readonly").change();
                            }

                            // 6. Supplier Bank Branch
                            if ($("#OtherSupplierBranch").length)
                            {
                                $("#OtherSupplierBranch").val("").removeAttr("readonly").change();
                            }

                            // 7. Supplier Account Number
                            if ($("#OtherSupplierAccount").length)
                            {
                                $("#OtherSupplierAccount").val("").removeAttr("readonly").change();
                            }

                            // 8. Supplier Account Type
                            if ($("#OtherSupplierAccountType").length)
                            {
                                $("#OtherSupplierAccountType").val("").removeAttr("readonly").change();
                            }
                        }
                    });
            });
        },

        DataPRPaymentMethod: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                i
                    .unbind("change")
                    .bind("change", function ()
                    {
                        if ($("#Status").attr("data-status") != "0")
                        {
                            return;
                        }

                        if ($(this).find("option:selected").attr("string-value").trim() == "Cash" || $(this).find("option:selected").attr("string-value").trim() == "DACard")
                        {
                            var d = { userId: $("#OriginatorId").val() };

                            $.ajax({
                                url: siteurl + "/GetUser",
                                type: "POST",
                                data: JSON.stringify(d),
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                error: function (e)
                                {

                                },
                                success: function (s)
                                {
                                    // 1. Supplier Name
                                    if ($("#OtherSupplier").length)
                                    {
                                        $("#OtherSupplier").val(s.Name + " " + s.Surname).change();//.attr("readonly", "readonly");
                                    }

                                    // 2. Supplier Contact Tel
                                    if ($("#OtherSupplierContactTel").length)
                                    {
                                        $("#OtherSupplierContactTel").val(s.Cell).change();//.attr("readonly", "readonly");
                                    }

                                    // 3. Supplier Bank
                                    if ($("#OtherSupplierBankId").length)
                                    {
                                        $("#OtherSupplierBankId").select2().select2('val', s.Bank);//.chznreadonly(true);
                                    }

                                    // 4. Supplier Branch
                                    if ($("#OtherSupplierBranch").length)
                                    {
                                        $("#OtherSupplierBranch").val(s.Branch).change();//.attr("readonly", "readonly");
                                    }

                                    // 5. Supplier Account
                                    if ($("#OtherSupplierAccount").length)
                                    {
                                        $("#OtherSupplierAccount").val(s.Account).change();//.attr("readonly", "readonly");
                                    }

                                    // 6. Supplier Account Type
                                    if ($("#OtherSupplierAccountType").length)
                                    {
                                        $("#OtherSupplierAccountType").select2().select2('val', s.AccountType);//.chznreadonly(true);
                                    }

                                    // 7. Supplier Contact Person
                                    if ($("#OtherSupplierContactPerson").length)
                                    {
                                        $("#OtherSupplierContactPerson").val(s.Name + " " + s.Surname).change();//.attr("readonly", "readonly");
                                    }

                                    // 8 Supplier Contact Email Address
                                    if ($("#OtherSupplierContactEmail").length)
                                    {
                                        $("#OtherSupplierContactEmail").val(s.Email).change();//.attr("readonly", "readonly");
                                    }
                                }
                            });
                        }
                        else
                        {
                            // 1. Supplier Name
                            if ($("#OtherSupplier").length)
                            {
                                $("#OtherSupplier").val("").removeAttr("readonly").change();
                            }

                            // 2. Supplier Contact Tel
                            if ($("#OtherSupplierContactTel").length)
                            {
                                $("#OtherSupplierContactTel").val("").removeAttr("readonly").change();
                            }

                            // 3. Supplier Bank
                            if ($("#OtherSupplierBankId").length)
                            {
                                $("#OtherSupplierBankId").select2().select2('val', "").chznreadonly(false);
                            }

                            // 4. Supplier Branch
                            if ($("#OtherSupplierBranch").length)
                            {
                                $("#OtherSupplierBranch").val("").removeAttr("readonly").change();
                            }

                            // 5. Supplier Account
                            if ($("#OtherSupplierAccount").length)
                            {
                                $("#OtherSupplierAccount").val("").removeAttr("readonly").change();
                            }

                            // 6. Supplier Account Type
                            if ($("#OtherSupplierAccountType").length)
                            {
                                $("#OtherSupplierAccountType").select2().select2('val', "").chznreadonly(false);
                            }

                            // 7. Supplier Contact Person
                            if ($("#OtherSupplierContactPerson").length)
                            {
                                $("#OtherSupplierContactPerson").val("").removeAttr("readonly").change();
                            }

                            // 8. Supplier Contact Email Address
                            if ($("#OtherSupplierContactEmail").length)
                            {
                                $("#OtherSupplierContactEmail").val("").removeAttr("readonly").change();
                            }

                            if ($("#SupplierId").val() != "")
                            {
                                $("#SupplierId").change();
                            }
                        }
                    });
            });
        },

        DataDocPR: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);
                var target = $(i.attr('data-target'));

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        var prid = $(this).attr("data-pid");
                        //var by = $("#supportingdoc #BudgetYear").val();

                        //if ($(this).attr("id") === "BudgetYear")
                        //{
                        //    prid = 0;
                        //}

                        PR.UI.Get(i, target, "/SupportingDoc/Create", { prId: prid/*, budgetYear: by*/ }, PR.Sticky.Hide(), true);
                    });
            });
        },

        DataDocType: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);
                var papa = i.parent().parent();

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        if ($(this).val() == "5" && $("#PRHasInvoice").val().toLowerCase() == "false")
                        {
                            var title = "No invoice uploaded yet";
                            var msg = "<p class='invalid' style='margin-bottom: 0;'>Sorry, you cannot upload a refund document before uploading an invoice.</p>";

                            PR.Sticky.Show($(this), title, msg, [], "center-right");

                            return false;
                        }
                    });

                i
                    .unbind("change")
                    .bind("change", function ()
                    {
                        if ($(this).is(":checked") && ($(this).val() == "2" || $(this).val() == "5" || $(this).val() == "8"))
                        {
                            papa.find("#invoice-details").show(1200, function ()
                            {
                                $(this).find('input[type="text"], textarea, select').attr("required", "required");
                            });

                            if ($(this).val() == "8")
                            {
                                papa.find(".inv-label").css("display", "none");
                                papa.find(".wri-label").show(500);

                                papa.find("#writeoff-details").show(1200, function ()
                                {
                                    $(this).find('input[type="text"], textarea, select').attr("required", "required");
                                });
                            }
                            else
                            {
                                papa.find(".wri-label").css("display", "none");
                                papa.find(".inv-label").show(500);

                                papa.find("#writeoff-details").hide(1200, function ()
                                {
                                    $(this).find('input[type="text"], select, textarea').removeAttr("required").val("");
                                });
                            }

                            if ($(this).val() == "5")
                            {
                                var title = "Refund Confirmation";

                                var msg = "<p>Are you sure you would like to upload a Refund document against this PR?</p>";

                                msg += "<div class='btns' style='display: block; text-align: center;'>";
                                msg += "    <input id='btn-yes' class='btn-yes' value='Yes' type='button' style='display: inline-block;' />";
                                msg += "    <span style='padding: 0 2px;'></span>";
                                msg += "    <input id='btn-no' class='btn-no' value='No' type='button' style='display: inline-block;' />";
                                msg += "</div>";

                                PR.Modal.Open(msg, title);

                                var no = $(PR.Modal.Container).find("#btn-no");
                                var yes = $(PR.Modal.Container).find("#btn-yes");

                                no
                                    .unbind("click")
                                    .bind("click", function ()
                                    {
                                        papa.find('input[value="0"]').click().change();

                                        PR.Modal.Close();
                                    });

                                yes
                                    .unbind("click")
                                    .bind("click", function ()
                                    {
                                        PR.Modal.Close();
                                    });
                            }
                        }
                        else
                        {
                            papa.find("#invoice-details, #writeoff-details").hide(1200, function ()
                            {
                                $(this).find('input[type="text"], input[type="hidden"], select, textarea').removeAttr("required").val("");
                            });
                        }
                    });
            });
        },

        DataEmailFile: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var id = i.attr("data-id");
                var subj = i.attr("data-subject");

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        var title = i.attr("original-title");
                        var message = '<p style="margin-top: 10px;">Please enter an e-mail address below to continue.</p>';

                        message += '<p>';
                        message += '  Email Address:<br />';
                        message += '  <input id="email" name="email" value="" type="text" placeholder="Enter E-mail Address" />';
                        message += '</p>';

                        message += '<p>';
                        message += '  Subject of the Email:<br />';
                        message += '  <textarea id="subject" name="subject" readonly="readonly" placeholder="Enter Subject of the Email" style="width: 95%; height: auto;">' + subj + '</textarea>';
                        message += '</p>';

                        message += '<p style="padding-bottom: 5px; border-bottom: 1px dashed #ddd;">';
                        message += '  Message for the Email Recipient:<br />';
                        message += '  <textarea id="message" name="message" placeholder="Enter Message for the Email Recipient" style="width: 95%;"></textarea>';
                        message += '</p>';

                        message += '<p>';
                        message += '  <input id="yes-btn" value="Send" type="button" class="btn-yes" />';
                        message += '  <span style="padding: 0 5px;">/</span>';
                        message += '  <input id="no-btn" value="Cancel" type="button" class="btn-no" />';
                        message += '</p>';

                        PR.Sticky.Show(i, title, message, [], "center-right");

                        var no = PR.Sticky.StickyOne.find("#no-btn");
                        var yes = PR.Sticky.StickyOne.find("#yes-btn");

                        no
                            .unbind("click")
                            .bind("click", function ()
                            {
                                PR.Sticky.Hide();
                            });

                        yes
                            .unbind("click")
                            .bind("click", function ()
                            {
                                var valid = true;

                                var email = PR.Sticky.StickyOne.find("#email");
                                var subject = PR.Sticky.StickyOne.find("#subject");
                                var message = PR.Sticky.StickyOne.find("#message");

                                if (email.val().trim() == '')
                                {
                                    valid = false;
                                    email.addClass('invalid').focus();
                                }
                                if (subject.val().trim() == '')
                                {
                                    valid = false;
                                    subject.addClass('invalid').focus();
                                }

                                if (!valid)
                                {
                                    return false;
                                }

                                PR.Loader.Show(yes, true);

                                $.post("/SupportingDoc/EmailFile", { id: id, email: email.val(), subject: subject.val(), message: message.val() }, function (data)
                                {
                                    var d = $("<div/>").html(data);

                                    PR.Loader.Hide();
                                    PR.Sticky.Show(i, d.find(".title").text(), d.find(".message").html(), [], "center-right");
                                });
                            });

                        return false;
                    });
            });
        },

        DataCancelDoc: function (sender)
        {
            function ProcessDocCancellation(sender, id)
            {
                PR.UI.DataValMax($('*[data-val-length-max]'));

                var btn = PR.Sticky.StickyOne.find("#send");

                btn
                    .unbind("click")
                    .bind("click", function ()
                    {
                        var r = PR.Sticky.StickyOne.find("#reason");

                        if (r.val().trim() == '')
                        {
                            r.addClass('invalid').focus();

                            return;
                        }

                        r.removeClass('invalid');

                        var params = { Id: id, CancellationReason: r.val().trim() };

                        PR.UI.Post(btn, $("#supportingdoc"), "/SupportingDoc/Delete", params, PR.Sticky.Hide(), true, true);
                    });
            }

            sender.each(function ()
            {
                var i = $(this);

                var id = i.attr("data-id");
                var title = i.attr("data-title");

                i
                    .unbind("click")
                    .bind("click", function () 
                    {
                        var data = '';
                        data += '<p>';
                        data += '    <label for="reason" class="block">Reason For Cancellation:</label>';
                        data += '    <textarea id="reason" data-val-length-max="1500" style="width: 270px;" placeholder="Enter your reason for cancelling this Supporting Document"></textarea>';
                        data += '</p>';
                        data += '<p style="border-top: 1px dashed #cecece; padding-top: 10px; margin-bottom: 0;">';
                        data += '   <input id="send" value="Cancel" type="button" />';
                        data += '</p>';

                        PR.Sticky.Show(i, title, data, function () { ProcessDocCancellation(i, id); }, 'center-right');

                        return false;
                    });
            });
        },

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
            if (valid && (form.find("#OtherSupplier").length && PR.UI.SupplierRegex.test(form.find("#OtherSupplier"))) || (form.find("#RegNo").length && PR.UI.SupplierRegex.test(form.find("#Name"))))
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

                if ($.inArray(ext.toLowerCase(), PR.UI.DocumentTypes) === -1)
                {
                    cntr = form.find('[data-val-file="1"]');

                    err += "The file extension <b>" + ext + "</b> is not allowed! Allowed formats: " + PR.UI.DocumentTypes.join(',');

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
                    if (!PR.UI.DataValidateInvoices($(this), group))
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

                PR.Sticky.StickyOne.addClass("error");
                PR.Sticky.StickyOne.css({ "display": "none" });

                PR.Sticky.Show(cntr, "Error Submitting Your Form!", err, [], direction);
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
                PR.Loader.Show($(hash + " #budget-lines-loader"), true);
                $.get(siteurl + "/BudgetLines", { originatorId: $(hash + " #OriginatorId").val(), branch: branch, directorateProject: dp, departmentSubProject: dsp }, function (data, status, req)
                {
                    expectedCost.val(0);
                    expectedCostLabel.text("R 0.00");

                    budget.find("tbody").html(data);

                    PR.UI.DataHighlightFields($(hash + " table#budget-lines").find("tbody td"));

                    PR.Init.Start(true);

                    // Get authorisors
                    PR.UI.Get($(hash + " #authorisors-loader"), $("#authorisors"), siteurl + "/Authorisors", { originatorId: $("#OriginatorId").val(), prId: $("#Id").val(), expectedCost: 0, branch: branch, directorateProject: dp, departmentSubProject: dsp }, PR.UI.DataHighlightFields($("#authorisors")), true, true);
                });
            }
            else if (branch != null && branch != "" && dp != null && dp != "" && dsp != null && dsp != "" && hash == "#provincialrefunds")
            {
                PR.UI.DataPRPBudgetLines(branch, dp, dsp, "#provincialrefunds");
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

                PR.Init.Start(true);
            }
            else
            {
                // Get authorisors
                PR.UI.Get($(hash + " #authorisors-loader"), $(hash + " #authorisors"), siteurl + "/Authorisors", { originatorId: $(hash + " #OriginatorId").val(), prId: $(hash + " #Id").val(), expectedCost: 0, branch: branch, directorateProject: dp, departmentSubProject: dsp }, PR.UI.DataHighlightFields($(hash + " #authorisors")), true, true);
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

        DataPRPBudgetLines: function (branch, dp, dsp, targetid)
        {
            var hash = window.location.hash;

            if (targetid)
            {
                hash = targetid;
            }

            $(hash + " table#budget-lines tbody tr").each(function ()
            {
                var tr = $(this);
                var d = { branch: branch, directorateProject: dp, departmentSubProject: dsp };

                $.ajax({
                    url: siteurl + "/PRPBudgetLines",
                    type: "POST",
                    data: JSON.stringify(d),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    error: function (error)
                    {

                    },

                    success: function (d)
                    {
                        var selx = '';
                        var actype = tr.find('[data-name="AccountType"]');
                        var incStream = tr.find('[data-name="IncomeStream"]');
                        var account = tr.find('[data-name="Account"]');

                        // Update Account Type
                        var at = '<option value="">Select...</option>';
                        var count = 0;

                        selx = PR.UI.DataDoSelected(actype, d.AccountTypes);

                        for (var a in d.AccountTypes)
                        {
                            var sel = (selx.trim() == a.trim()) ? 'selected="selected"' : '';

                            at += '<option value="' + a + '" ' + sel + '>' + d.AccountTypes[a] + '</option>';

                            count++;
                        }

                        actype
                            .select2("destroy")
                            .html(at)
                            .unbind("change")
                            .bind("change", function ()
                            {
                                PR.UI.DataUpdateIncomeStream(incStream, branch, dp, dsp, $(this).val());
                            });
                        //.change()

                        // Update Income Stream
                        var is = '<option value="">Select...</option>';
                        count = 0;

                        selx = PR.UI.DataDoSelected(incStream, d.IncomeStreams);

                        for (var a in d.IncomeStreams)
                        {
                            var sel = (selx.trim() == a.trim()) ? 'selected="selected"' : '';

                            is += '<option value="' + a + '" ' + sel + '>' + d.IncomeStreams[a] + '</option>';

                            count++;
                        }

                        incStream
                            .select2("destroy")
                            .html(is)
                            .unbind("change")
                            .bind("change", function ()
                            {
                                PR.UI.DataUpdateAccount(account, branch, dp, dsp, actype.val(), $(this).val());
                            });
                        //.change()

                        // Update Account
                        var acc = '<option value="">Select...</option>';
                        count = 0;

                        selx = PR.UI.DataDoSelected(account, d.Accounts);

                        for (var a in d.Accounts)
                        {
                            var sel = (selx.trim() == a.trim()) ? 'selected="selected"' : '';

                            acc += '<option value="' + a + '" ' + sel + '>' + d.Accounts[a] + '</option>';

                            count++;
                        }

                        account
                            .select2("destroy")
                            .html(acc)
                            .unbind("change")
                            .bind("change", function ()
                            {
                                PR.UI.DataUpdateRemainingBudget(tr, branch, dp, dsp, actype.val(), incStream.val(), $(this).val());
                            });

                        actype.change();

                        // Update Original Budget
                        tr.find('[data-ob="1"]').text("R" + parseFloat(d.OriginalBudget).money(2, ",", " "));

                        // Update Remaining Budget
                        tr.find('#rb').text(d.RemainingBudget);
                        tr.find('[data-rb="1"]').text("R" + parseFloat(d.RemainingBudget).money(2, ",", " "));

                        PR.Loader.Hide();

                        PR.UI.DataHighlightFields(tr.find("td"));
                    }
                });
            });

            var auth = $(hash).find("#authorisors");

            auth.load(siteurl + "/Authorisors", { originatorId: 0, prId: 0, expectedCost: $(hash).find("#ExpectedCost").val(), branch: branch, directorateProject: dp, departmentSubProject: dsp, hash: window.location.hash.replace('#', '') }, function ()
            {
                $("select.chzn").select2();
            });
        },

        DataUpdateIncomeStream: function (selCntr, branch, dp, dsp, at)
        {
            var d = { branch: branch, directorateProject: dp, departmentSubProject: dsp, accountType: at, json: true };

            $.ajax({
                url: siteurl + "/IncomeStreams",
                type: "POST",
                data: JSON.stringify(d),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                error: function (error)
                {

                },

                success: function (d)
                {
                    var count = 0;
                    var is = '<option value="">Select...</option>';
                    var selx = PR.UI.DataDoSelected(selCntr, d.IncomeStreams);

                    for (var a in d.IncomeStreams)
                    {
                        var sel = (selx.trim() == a.trim()) ? 'selected="selected"' : '';

                        is += '<option value="' + a + '" ' + sel + '>' + d.IncomeStreams[a] + '</option>';

                        count++;
                    }

                    selCntr.select2('destroy').html(is).select2();

                    PR.UI.DataHighlightFields(selCntr.parent());

                    var account = selCntr.parent().parent().find('[data-name="Account"]');

                    PR.UI.DataUpdateAccount(account, branch, dp, dsp, at, selCntr.val());
                }
            });
        },

        DataUpdateAccount: function (selCntr, branch, dp, dsp, at, ics)
        {
            var d = { branch: branch, directorateProject: dp, departmentSubProject: dsp, accountType: at, incomeStream: ics, json: true };

            $.ajax({
                url: siteurl + "/Accounts",
                type: "POST",
                data: JSON.stringify(d),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                error: function (error)
                {

                },
                success: function (d)
                {
                    var count = 0;
                    var acc = '<option value="">Select...</option>';
                    var selx = PR.UI.DataDoSelected(selCntr, d.Accounts);

                    for (var a in d.Accounts)
                    {
                        var sel = (selx.trim() == a.trim()) ? 'selected="selected"' : '';

                        acc += '<option value="' + a + '" ' + sel + '>' + d.Accounts[a] + '</option>';

                        count++;
                    }

                    selCntr.select2('destroy').html(acc).select2();

                    PR.UI.DataHighlightFields(selCntr.parent());

                    PR.UI.DataUpdateRemainingBudget(selCntr.parent().parent(), branch, dp, dsp, at, ics, selCntr.val());
                }
            });
        },

        DataUpdateRemainingBudget: function (tr, branch, dp, dsp, at, ics, acc)
        {
            var _rb = tr.find('#rb');
            var ob = tr.find('[data-ob="1"]');
            var rb = tr.find('[data-rb="1"]');

            $.ajax({
                type: "GET",
                url: siteurl + "Budget",
                data: { branch: branch, directorateProject: dp, departmentSubProject: dsp, accountType: at, incomeStream: ics, account: acc },
                dataType: "json",
                success: function (data)
                {
                    ob.text("R " + data.Budget.Original.money(2));
                    PR.UI.DataHighlightFields(ob.parent());

                    _rb.val(data.Budget.Remaining);
                    rb.text("R " + data.Budget.Remaining.money(2));
                    PR.UI.DataHighlightFields(rb.parent());

                    if (data.Budget.Remaining <= 0)
                    {
                        if (!rb.parent().find('[data-warn="1"]').length)
                        {
                            var warn = "";
                            warn += "<a data-warn='1' rel='tipsyW' title='There is no more budget for this selection. You can however still proceed with you requisition request.'>";
                            warn += "   <img alt='' src='" + imgurl + '/images/hot.gif' + "' style='width: 20px; margin-top: -2px;' />";
                            warn += "</a>";

                            rb.parent().append(warn);
                            PR.Init.PluginInit(rb.parent());
                        }
                    }
                    else
                    {
                        rb.parent().find('[data-warn="1"]').fadeOut(1200, function ()
                        {
                            $(this).remove();
                        });
                    }

                    PR.Loader.Hide();
                }
            });
        },

        DataBudgetVsSpentPie: function (budget, spent, target)
        {
            console.log("budget: " + budget);
            console.log("spent: " + spent);

            if (!target.find(">div").length) return;

            //budget = budget - spent;

            var width = target.outerWidth();
            var height = target.outerHeight();

            target.find(">div").css({ width: width });

            target.find(">div").highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie',
                    width: width
                },
                title: {
                    text: 'BUDGET VS ACTUAL SPEND'
                },
                tooltip: {
                    shared: false,
                    useHTML: true,
                    followPointer: false,
                    shadow: false,
                    backgroundColor: null,
                    borderWidth: 0,
                    style: {
                        pointerEvents: 'auto'
                    },
                    formatter: function ()
                    {
                        var s = '';
                        var p = this.point.name;

                        s += '<div class="clear">';
                        //s += '  <b>' + this.point.name + '</b>';
                        s += '  <table id="BudgetVsSpentPie-Table" class="dash-table">';
                        s += '      <thead>';
                        s += '          <tr>';
                        s += '              <th style="padding: 0;">';
                        s += '                  <select data-dash-filter="1" data-target="#BudgetVsSpentPie-Table" data-graph="BudgetVsSpent" onchange="PR.UI.DataChangeFilter($(this));" style="width: 100px;">';
                        s += '                      <option value="0">- - filter by --</option>';
                        s += '                      <option value="Branch">By Branch</option>';
                        s += '                      <option value="Account">By Account</option>';
                        s += '                      <option value="AccountType">By Account Type</option>';
                        s += '                      <option value="IncomeStream">By Income Stream</option>';
                        s += '                      <option value="DirectorateProject">By Directorate \ Project</option>';
                        s += '                      <option value="DepartmentSubProject">By Department \ Sub-Project</option>';
                        s += '                  </select>';
                        s += '              </th>';
                        s += '              <th>Sum of TOTAL BUDGET</th>';
                        s += '              <th>Sum of TOTAL SPEND</th>';
                        s += '              <th class="balance">Sum of Balance</th>';
                        s += '              <th>Sum of % Spend</th>';
                        s += '          </tr>';
                        s += '      </thead>';
                        s += '  </table>';
                        s += '  <div style="clear: both;"></div>';
                        s += '</div>';
                        /*s += 'R ' + this.y.money(2);

                        if (this.point.name == 'Budget')
                        {
                            s += "<br />* Calculated using your user structure (s)<br />and the matching budget sum amount for each structure.";
                        }
                        else if (this.point.name == 'Spend')
                        {
                            s += "<br />* Actual spend on PRs that have passed approval process.";
                        }*/

                        return s;
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.2f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: 'Brands',
                    colorByPoint: true,
                    data: [{
                        name: 'Budget',
                        color: '#1e80c1',
                        y: parseFloat(budget)
                    }, {
                        name: 'Spend',
                        color: '#fdc942',
                        y: parseFloat(spent)
                    }]
                }]
            });

            Highcharts.Pointer.prototype.onContainerMouseDown = function (e)
            {
                e = this.normalize(e);
                //this.zoomOption(e);
                this.dragStart(e);
            };
        },

        DataApprovedVsDeclinedPie: function (approved, declined, target)
        {
            if (!target.find(">div").length) return;

            var width = target.outerWidth();
            var height = target.outerHeight();

            target.find(">div").css({ width: width });

            target.find(">div").highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie',
                    width: width
                },
                title: {
                    text: 'APPROVED VS DECLINED'
                },
                tooltip: {
                    formatter: function ()
                    {
                        var s = '<b>' + this.point.name + '</b> <br/>' + ' R ' + this.y.money(2);

                        if (this.point.name == 'Approved')
                        {
                            s += "<br />* Sum of all PR expected cost that have been approved.";
                        }
                        else if (this.point.name == 'Declined')
                        {
                            s += "<br />* Sum of all PR expected cost that have been declined.";
                        }

                        return s;
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.2f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: 'Brands',
                    colorByPoint: true,
                    data: [{
                        color: '#5aa550',
                        name: 'Approved',
                        y: parseFloat(approved)
                    }, {
                        color: '#ef3214',
                        name: 'Declined',
                        y: parseFloat(declined)
                    }]
                }]
            });

            console.log("Approved: " + approved);
            console.log("Declined: " + declined);
        },

        DataBudgetVsSpentPieReport: function (budget, spent, target)
        {
            console.log("budget: " + budget);
            console.log("spent: " + spent);

            if (!target.find(">div").length) return;

            //budget = budget - spent;

            var width = target.outerWidth();
            var height = target.outerHeight();

            target.find(">div").css({ width: width });

            target.find(">div").highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie',
                    width: width
                },
                title: {
                    text: 'TOTAL SPEND vs TOTAL BUDGET'
                },
                tooltip: {
                    formatter: function ()
                    {
                        var s = '';
                        var p = this.point.name;

                        s += '  <b>' + this.point.name + '</b> R ' + this.y.money(2);

                        if (this.point.name == 'Budget')
                        {
                            s += "<br />* Calculated using your user structure (s)<br />and the matching budget sum amount for each structure.";
                        }
                        else if (this.point.name == 'Spend')
                        {
                            s += "<br />* Actual spend on PRs that have passed approval process.";
                        }

                        return s;
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.2f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: 'Brands',
                    colorByPoint: true,
                    data: [{
                        name: 'Budget',
                        color: '#1e80c1',
                        y: parseFloat(budget)
                    }, {
                        name: 'Spend',
                        color: '#fdc942',
                        y: parseFloat(spent)
                    }]
                }]
            });
        },

        DataDeclinedBar: function (data, target)
        {
            if (!target.length) return;

            var cats = [];
            var _data = [];

            for (var d = 0; d < data.Declines.length; d++)
            {
                cats.push(data.Declines[d].Name);
                _data.push({ y: data.Declines[d].Total, name: data.Declines[d].Name, color: data.Declines[d].Color });
            }

            target.highcharts({
                chart: {
                    type: 'bar',
                },
                legend: {
                    enabled: false,
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    labelFormatter: function ()
                    {
                        return "Total - <span class='total'>" + this.y + "</span>"
                    }
                },
                title: {
                    text: 'REASONS FOR DECLINING'
                },
                xAxis: {
                    categories: cats,
                    allowDecimals: false
                },
                yAxis: {
                    allowDecimals: false
                },
                plotOptions: {
                    series: {
                        events: {
                            legendItemClick: function (x)
                            {
                                var i = this.index - 1;
                                var series = this.chart.series[0];
                                var point = series.points[i];

                                if (point.oldY == undefined)
                                    point.oldY = point.y;

                                point.update({ y: point.y != null ? null : point.oldY });
                            }
                        }
                    }
                },
                legend: {
                    labelFormatter: function ()
                    {
                        return cats[this.index - 1];
                    }
                },
                series: [
                    {
                        pointWidth: 20,
                        showInLegend: false,
                        data: _data
                    }
                ],

            });
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

        DataChangeFilter: function (sender)
        {
            if (sender.val() == "0") return;

            var b = '';
            var graph = sender.attr("data-graph");
            var table = $(sender.attr("data-target"));

            table.find("tbody, tfoot").remove();
            table.append('<tr><td colspan="5"><span></span></td>');

            PR.Loader.Show(table.find("tr:last td span"));

            $.getJSON(siteurl + "/FilterDashBoard", { filter: sender.val(), graph: graph }, function (data)
            {
                b += '<tbody>';

                for (var d in data.Items)
                {
                    b += '  <tr>';
                    b += '      <td>' + data.Items[d].Filter + '</td>';
                    b += '      <td>' + data.Items[d].TotalBudget.money(2) + '</td>';
                    b += '      <td>' + data.Items[d].TotalSpend.money(2) + '</td>';
                    b += '      <td class="balance">' + data.Items[d].Balance.money(2) + '</td>';
                    b += '      <td>' + data.Items[d].SpendPercentage.money(2) + '%</td>';
                    b += '  </tr>';
                }

                b += '</tbody>';

                b += '<tfoot>';
                b += '  <tr>';
                b += '      <td>Grand Total</td>';
                b += '      <td>' + data.GrandBudget.money(2) + '</td>';
                b += '      <td>' + data.GrandSpend.money(2) + '</td>';
                b += '      <td class="balance">' + data.GrandBalance.money(2) + '</td>';
                b += '      <td>' + data.GrandPercentage.money(2) + '%</td>';
                b += '  </tr>';
                b += '</tfoot>';

                PR.Loader.Hide();

                table.find("tr:last").remove();
                table.append(b);
            });
        },

        DataMarkComplete: function (sender)
        {
            sender.each(function ()
            {
                var b = $(this);
                var target = $(b.data("target"));

                b
                    .unbind("click")
                    .bind("click", function ()
                    {
                        var title = "Mark PR As Complete?";
                        var msg = '<p style="margin: 0;">Are you sure you would like to mark this Payment Requisition as <b>Complete</b>?</p>';

                        var btn = $(PR.Modal.Container).find('.btns #btnConfirm');

                        btn.val("Yes");

                        PR.Modal.Open(msg, title, true);

                        btn
                            .unbind("click")
                            .bind("click", function ()
                            {
                                PR.Modal.Close();

                                setTimeout(function ()
                                {
                                    target.find("#save-btn").click();

                                }, '500');
                            });

                        return false;
                    });
            });
        },

        DataGroupPr: function (sender)
        {
            var edit = $("#edit-item");
            var table = $("#group-pr-table:visible, #manage-payments-table:visible");

            var hash = window.location.hash;

            sender.each(function ()
            {
                var i = $(this);

                var prId = $(this).parent().find("#PRId").val();
                var supplier = $(this).parent().find("#Supplier").val().trim().toLowerCase();
                var sAcc = $(this).parent().find("#SupplierAccount").val().trim().toLowerCase();
                var fundinCompany = $(this).parent().find("#FundingCompany").val().trim().toLowerCase();

                i
                    .unbind("change")
                    .bind("change", function ()
                    {
                        i = $(this);

                        var sum = 0;
                        var cntr = [];
                        var valid = true;
                        var direction = "center-left";
                        var err = "<div class='message-error'>";

                        var oldPrs = PR.UI.SelectedPRs;
                        var olditems = PR.UI[hash.replace('#', '')].SelectedItems;

                        PR.UI.SelectedPRs = [];
                        PR.UI[hash.replace('#', '')].SelectedItems = [];

                        $("#sel-pr-count").text(table.find('[data-group-pr="1"]:checked').length);

                        table.find('[data-group-pr="1"]:checked').each(function ()
                        {
                            var selSupplier = $(this).parent().find("#Supplier").val().trim().toLowerCase();
                            var selSAcc = $(this).parent().find("#SupplierAccount").val().trim().toLowerCase();
                            var selFundingCompany = $(this).parent().find("#FundingCompany").val().trim().toLowerCase();

                            if (i.is(":checked") && i.attr("id") !== $(this).attr("Id") && (sAcc !== selSAcc || fundinCompany !== selFundingCompany))
                            {
                                valid = false;

                                cntr = i;

                                PR.UI.SelectedPRs = oldPrs;
                                PR.UI[hash.replace('#', '')].SelectedItems = olditems;

                                return false;
                            }

                            var pid = $(this).parent().find("#PRId").val();
                            var num = $(this).parent().parent().find("#pr-number-span").text();
                            var amt = $(this).parent().parent().find("#pr-amount-span").text();

                            PR.UI.SelectedPRs.push(pid);
                            PR.UI[hash.replace('#', '')].SelectedItems.push({ Id: pid, Number: num, Amount: amt });

                            if ($(this).parent().parent().find("#PRExpectedCost").length)
                            {
                                sum += parseFloat($(this).parent().parent().find("#PRExpectedCost").val());
                            }
                        });

                        if ($("" + hash).length && $("" + hash).is(":visible"))
                        {
                            PR.UI.DataCustomSearchHighlight($("" + hash), hash.replace('#', ''));
                        }

                        if (!valid)
                        {
                            i.prop("checked", false);

                            err += "This selection has a different Supplier/Funding Company. PRs must have the same Supplier and Funding company to be grouped.</div>";

                            PR.Sticky.StickyOne.addClass("error");
                            PR.Sticky.StickyOne.css({ "display": "none" });

                            PR.Sticky.Show(cntr, "Invalid selection", err, [], direction);

                            return false;
                        }

                        if (edit.length)
                        {
                            edit.find("#f-amount").val("R" + sum.money(2));
                            edit.find("#label-Amount").text("R" + sum.money(2));
                            edit.find("#pi-amount").add("#pi-calculatedtotal").val(sum);

                            if (table.find('[data-group-pr="1"]:checked').length <= 0)
                            {
                                UpdatePreview(0, "", 0, "", "", "", -1, "", "", 0);

                                return;
                            }

                            if (edit.find("#preview-loaded").val() === "1")
                            {
                                return;
                            }

                            var d = { prId: prId };

                            PR.Loader.Show(edit.find("#page-loader"), true);

                            $.ajax({
                                url: siteurl + "/GetPR",
                                type: "POST",
                                data: JSON.stringify(d),
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (p)
                                {
                                    UpdatePreview(1, p.BeneficiaryName, p.BeneficiaryBank, p.BeneficiaryBank1, p.BeneficiaryAccount, p.BeneficiaryBranch, p.BeneficiaryAccountType, p.BeneficiaryAccountType1, p.Reference, p.FundingCompanyId);

                                    PR.Loader.Hide();
                                }
                            });
                        }
                    });
            });

            function UpdatePreview(pLoaded, bName, bBank, bBank1, bAccount, bBranch, bAccountType, bAccountType1, bReference, bFundingCompanyId)
            {
                edit.find("#preview-loaded").val(pLoaded);

                edit.find("#label-BeneficiaryName").text(bName);
                edit.find("#PaymentInstructionViewModel_BeneficiaryName").val(bName);

                edit.find("#label-BeneficiaryBank").text(bBank1);
                edit.find("#PaymentInstructionViewModel_BeneficiaryBank").val(bBank);

                edit.find("#label-BeneficiaryAccount").text(bAccount);
                edit.find("#PaymentInstructionViewModel_BeneficiaryAccount").val(bAccount);

                edit.find("#label-BeneficiaryBranch").text(bBranch);
                edit.find("#PaymentInstructionViewModel_BeneficiaryBranch").val(bBranch);

                edit.find("#label-BeneficiaryAccountType").text(bAccountType1);
                edit.find("#PaymentInstructionViewModel_BeneficiaryAccountType").val(bAccountType);

                edit.find("#label-Reference").text(bReference);
                edit.find("#PaymentInstructionViewModel_Reference,#PaymentInstructionViewModel_SystemReference").val(bReference);

                edit.find("#PaymentInstructionViewModel_FundingCompanyId").val(bFundingCompanyId);

                PR.UI.DataHighlightFields(edit.find("#preview-account"));
            }
        },

        DataGroupPrAmount: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var amt = $("#pi-amount");
                var lamt = $("#label-Amount");
                var empiorig = $(".em-pi-orig");
                var piorig = $("#pi-orig");
                var pittotal = $("#pi-calculatedtotal");

                i
                    .unbind("blur")
                    .bind("blur", function ()
                    {
                        var a = $(this).val();
                        var f = a.split(/\s+/).join('').replace('R', '').replace(/,/g, '.');

                        var total = parseFloat(pittotal.val());

                        var fza = 0;

                        // Check if entered amount is greater than original total?
                        if (parseFloat(f) > total)
                        {
                            fza = "R" + total.money(2);

                            $(this).val(fza).attr("value", fza);

                            // Show warning
                            PR.Sticky.StickyOne.addClass("error");
                            PR.Sticky.StickyOne.css({ "display": "none" });

                            PR.Sticky.Show(i, "Error", "This amount cannot exceed the calculated total of R" + total.money(2) + "!", [], "top-right");

                            return;
                        }

                        amt.val(parseFloat(f));

                        fza = "R" + parseFloat(f).money(2);

                        $(this).val(fza).attr("value", fza);
                        lamt.text(fza);

                        if (f !== total)
                        {
                            piorig.text("R" + parseFloat(total).money(2));
                            empiorig.fadeIn(1200);
                        }
                        else
                        {
                            empiorig.fadeOut(1200);
                        }

                        PR.UI.DataCustomSearchHighlight(lamt.parent());
                    });
            });
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

        DataEditFundingCompany: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var editItems = $(i.attr("data-edit-items"));

                var view = editItems.find("#fc-view");
                var edit = editItems.find("#fc-edit");

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        view.slideUp(500);
                        edit.show(1200, function ()
                        {
                            var done = $(this).find('[data-done="1"]');
                            var close = $(this).find('[data-close="1"]');

                            close
                                .unbind("click")
                                .bind("click", function ()
                                {
                                    edit.slideUp(500);
                                    view.show(1200);
                                });

                            done
                                .unbind("click")
                                .bind("click", function ()
                                {
                                    var pid = done.attr("data-pid");
                                    var fid = edit.find("#FundingCompanyId").val();
                                    var txt = edit.find('#FundingCompanyId option[value="' + fid + '"]').text();

                                    $(done.attr("data-fc-id")).val(fid);
                                    $(done.attr("data-fc-sp")).text(txt);

                                    var target = done.parent().find("#fc-loader");

                                    PR.UI.Post(done, target, siteurl + "/UpdateFundingCompany", { fid: fid, pid: pid }, function () { edit.slideUp(500); view.show(1200); }, true, true);
                                });
                        });

                        return false;
                    });
            });
        },

        DataFinanceDecline: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);
                var pid = i.attr("data-pid");

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        var title = "Decline PR?";
                        var msg = '<p style="margin: 0;">Please wait...</p>';

                        var body = $(PR.Modal.Container).find('#modal-body');

                        PR.Modal.Open(msg, title, false);

                        function after()
                        {
                            body = $(PR.Modal.Container).find('#modal-body');

                            PR.UI.DataAfterOTPReq(body);

                            body.prepend('<p class="hint">Complete the form below to continue:</p>');
                        }

                        PR.UI.Get(body, body, siteurl + '/DeclinePaymentRequisition', { pid: pid }, after, false, true);
                    });
            });
        },

        DataAfterOTPReq: function (target, pid)
        {
            if (!target.length) return;

            target.find('.btn-yes, .sep').css('display', 'none');
            target.find('.btn-no-yellow').css('width', 'auto');
            target.find('#OTP').css('width', '88%');
            target.find('[data-check-otp="1"]').css('width', '20%');

            var btn = target.find('.btn-no-yellow');

            if (!btn.length) return;

            btn
                .unbind("click")
                .bind("click", function ()
                {
                    var cntr = [];
                    var valid = true;
                    var err = "<div class='message-error'>",
                        direction = "center-right";

                    var pid = target.find("#PID").val();
                    var dreason = target.find("#DeclineReason");
                    var comment = target.find("#AuthorisorComment");

                    // 8. Authorisor Comment
                    if (valid && comment.length && comment.val() == "")
                    {
                        cntr = comment;

                        err += "Enter your comment here. It's important to leave a comment when authorising a Payment Requisition.";

                        valid = false;
                        direction = "top-right";
                    }

                    // 9. If Decline, check reason for declining
                    if (valid && dreason.length && dreason.val() == "")
                    {
                        cntr = target.find('label[for="DeclineReason"]');

                        err += "To decline this requisition, please select a reason before we can proceed.";

                        valid = false;
                        direction = "center-right";
                    }

                    if (valid)
                    {             //sender, target, url, params, callback, loadImg, noAnminate
                        PR.UI.Post($(this), $('#grouppayments'), siteurl + '/DeclinePaymentRequisition', { pid: pid, comment: comment.val(), declineReason: dreason.val() }, function () { PR.Modal.Close(); }, true, true);
                    }
                    else
                    {
                        err += "</div>";

                        PR.Sticky.StickyOne.addClass("error");
                        PR.Sticky.StickyOne.css({ "display": "none", "z-index": "99999" });

                        PR.Sticky.Show(cntr, "Error Submitting Your Form!", err, [], direction);
                    }
                });
        },

        DataPaymentFrequency: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                i
                    .unbind("change")
                    .bind("change", function ()
                    {
                        if ($(this).val() != "4")
                        {
                            $("#PaymentInstructionViewModel_PayOccurence").attr("required", "required");
                        }
                        else
                        {
                            $("#PaymentInstructionViewModel_PayOccurence").removeAttr("required");
                        }

                        if ($(this).val() == "0")
                        {
                            $("#PaymentInstructionViewModel_PayDay").attr("required", "required");
                        }
                        else
                        {
                            $("#PaymentInstructionViewModel_PayDay").removeAttr("required");
                        }
                    });
            });
        },



        DataCheckOTP: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);
                var target = $(i.attr("data-target"));

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        var disabled = $(this).attr("disabled") == "disabled";

                        if (disabled) return false;

                        var pid = 0;
                        var otp = target.find("#OTP").val();
                        var authId = target.find("#PRAuthorisationId").val();

                        var body = $(PR.Modal.Container).find('#modal-body');

                        if (body.length && body.find("#PID").length)
                        {
                            pid = body.find("#PID").val();
                        }

                        PR.UI.Post(i, target, siteurl + "/CheckOTP", { otp: otp, authId: authId, pid: pid }, function () { PR.UI.DataAfterOTPReq(body); }, true, true);
                    });
            });
        },

        DataResendOTP: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);
                var target = $(i.attr("data-target"));

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        var disabled = $(this).attr("disabled") == "disabled";

                        if (disabled) return false;

                        var authId = target.find("#PRAuthorisationId").val();

                        var body = $(PR.Modal.Container).find('#modal-body');

                        PR.UI.Post(i, target, siteurl + "/ResendOTP", { authId: authId }, function () { PR.UI.DataAfterOTPReq(body); }, true, true);
                    });
            });
        },

        DataResendOTPViaEmail: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);
                var target = $(i.attr("data-target"));

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        var disabled = $(this).attr("disabled") == "disabled";

                        if (disabled) return false;

                        var authId = target.find("#PRAuthorisationId").val();

                        var body = $(PR.Modal.Container).find('#modal-body');

                        PR.UI.Post(i, target, siteurl + "/ResendOTPViaEmail", { authId: authId }, function () { PR.UI.DataAfterOTPReq(body); }, true, true);
                    });
            });
        },

        DataQuickAuthorise: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var target = $(i.attr("data-target"));

                if (i.attr("data-loaded") == "1") return false;

                i.attr("data-loaded", 1);

                var hash = window.location.hash;
                var by = PR.UI[hash.replace("#", "")].PageBudgetYear;

                if ((typeof by == 'undefined' || by <= 0) && parseInt(PR.UI.DataGetQueryString("BudgetYear")) > 0)
                {
                    by = PR.UI.DataGetQueryString("BudgetYear");
                }

                target.load(siteurl + "/QuickAuthorise", { BudgetYear: by }, function ()
                {

                });
            });
        },

        DataQuickAuthoriseLinks: function (sender)
        {
            var target = $("#sticky-data");

            if (target.html() == "" || target.text() == "") return;

            if (!target.find("a").length)
            {
                return;
            }

            $("#sticky-title").html(sender.attr("data-title") + " (" + target.find("a").length + ")");

            target.find("a").each(function ()
            {
                var id = $(this).attr("data-id");

                $(this)
                    .unbind("click")
                    .bind("click", function ()
                    {
                        var details = $('td a[data-details="1"][data-id="' + id + '"]:visible');

                        if (details.length)
                        {
                            details.click();

                            return false;
                        }
                    });
            });
        },

        DataQuickStructure: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var target = $(i.attr("data-target"));

                if (i.attr("data-loaded") == "1") return false;

                i.attr("data-loaded", 1);

                target.load(siteurl + "/QuickStructure", {}, function ()
                {

                });
            });
        },

        DataQuickStructureLinks: function (sender)
        {
            var target = $("#sticky-data"),
                update = $("#userstructure");

            if (target.html() == "" || target.text() == "") return;

            if (!target.find("span").length)
            {
                return;
            }

            $("#sticky-title").html(sender.attr("data-title") + " (" + target.find("span").length + ")");

            target.find("span").each(function ()
            {
                var id = $(this).attr("data-id");
                var branch = $(this).attr("data-branch");
                var by = $(this).attr("data-budget-year");

                $(this)
                    .unbind("click")
                    .bind("click", function ()
                    {
                        PR.Loader.Show($(this), true);

                        $.get(siteurl + "/AddUserStructure", { uid: id, branch: branch, by: by }, function (data, status, req)
                        {
                            update.html(data);

                            PR.Init.PluginLoaded = false;
                            PR.Init.Start();

                            PR.Sticky.Hide();
                            PR.UI.DataSwitchTabs("#manageusers", "#userstructure");

                            setTimeout(function ()
                            {
                                update.find("#Branch").change();
                            }, "2000");

                        }).error(function ()
                        {

                        }).fail(function ()
                        {

                        });
                    });
            });
        },


        DataStandInReason: function (sender)
        {
            var desc = $("#s-in-r-d");

            sender.each(function ()
            {
                var i = $(this);

                i
                    .unbind("change")
                    .bind("change", function ()
                    {
                        if ($(this).val() == "10")
                        {
                            desc
                                .show(1200)
                                .find("textarea")
                                .focus()
                                .attr("required", "required");
                        }
                        else
                        {
                            desc
                                .hide(1200)
                                .find("textarea")
                                .val("")
                                .removeAttr("required");
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

                                PR.UI.DataHighlightFields(target.parent());
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

        DataSupplierApproval: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var v = i.attr("data-v");
                var sid = i.attr("data-sid");

                var target = $(i.attr("data-target"));

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        var title = (v == "True" ? "Approve" : "Decline") + " Supplier?";

                        var msg = "<p>Are you sure you would like to " + (v == "True" ? "Approve" : "Decline") + " Supplier? This action is unrevisible.</p>";
                        msg += "<p><lable for='auth-comment'>Your comment (required)</lable><input id='auth-comment' type='text' max='250' min='4' placeholder='Enter your comment in here...' /></p>";
                        msg += "<p>";
                        msg += "    <input id='auth-yes' class='btn-yes' type='button' value='Yes' />";
                        msg += "    <input id='auth-no' class='btn-no' type='button' value='No' onclick='PR.Sticky.Hide();' />";
                        msg += "</p>";

                        PR.Sticky.Show(i, title, msg, [], "center-right");

                        var yes = PR.Sticky.StickyOne.find("#auth-yes");
                        var comment = PR.Sticky.StickyOne.find("#auth-comment");

                        yes
                            .unbind("click")
                            .bind("click", function ()
                            {
                                if (comment.val().trim() == "")
                                {
                                    comment.addClass("invalid").focus();

                                    return false;
                                }

                                comment.removeClass("invalid");

                                PR.UI.Post(yes, target, siteurl + "/Approve", { sid: sid, approved: v, comments: comment.val().trim() }, [], true);
                            });

                        return false;
                    });
            });
        },

        DataSupplierAccountType: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                i
                    .bind("change", function ()
                    {
                        $('label[for="Account"]').text("Account #");
                        $("#c-card").hide(1200, function ()
                        {
                            $(this).find('input[type="text"]').prop("required", false).removeAttr("required");
                        });

                        var sel = $(this).find("option:selected").attr("string-value").trim();

                        if (sel == "CreditCard")
                        {
                            $("#c-card").show(1200, function ()
                            {
                                $(this).find('input[type="text"]').attr("required", "required");
                            });
                        }
                        else if (sel == 'BillPayment')
                        {
                            $('label[for="Account"]').text("Account Number/Reference at Supplier");
                        }
                    });
            });
        },

        DataAuthBranch: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);
                var target = $('[data-auth-users="1"]');

                i
                    .unbind("change")
                    .bind("change", function ()
                    {
                        if ($(this).val() == "") return;

                        PR.Loader.Show($('label[for="' + i.attr("id") + '"]'), true);

                        var d = { branch: $(this).val() };

                        $.ajax({
                            url: siteurl + "/GetAuthUsers",
                            type: "POST",
                            data: JSON.stringify(d),
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            error: function (e)
                            {

                            },
                            success: function (data)
                            {
                                var options = "<option value=''>Select...</option>";

                                for (var u in data.users)
                                {
                                    options += "<option value='" + data.users[u].Id + "'>" + data.users[u].Name.trim() + " " + data.users[u].Surname.trim() + " (" + data.users[u].IdNumber.trim() + ")</option>";
                                }

                                target.find("select").each(function ()
                                {
                                    $(this).find("options").remove();
                                    $(this).html(options);

                                    // Destroy any select 2
                                    $(this).parent().find("div.chzn").remove();
                                    $(this).parent().find("select.chzn").css("display", "block");
                                });

                                PR.Loader.Hide();

                                PR.Init.PluginInit(target);
                                PR.UI.DataHighlightFields(target);
                            }
                        });
                    });
            });
        },

        DataLoadPRStatus: function (sender)
        {
            sender.each(function ()
            {
                if ($(this).attr("data-loaded") == "1") return;

                PR.UI.Get($(this), $($(this).attr("data-target")), siteurl + "/GetPRStatus", { pid: $(this).attr("data-pid") }, [], true, true);
                $(this).attr("data-loaded", 1);
            });
        },

        DataLoadPRDocs: function (sender)
        {
            sender.each(function ()
            {
                if ($(this).attr("data-loaded") == "1") return;

                PR.UI.Get($(this), $($(this).attr("data-target")), siteurl + "/GetPRDocs", { pid: $(this).attr("data-pid") }, [], true, true);

                $(this).attr("data-loaded", 1);
            });
        },

        DataRemoveUser: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);
                var aid = i.attr("data-aid");
                var target = $(i.attr("data-target"));

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        var params = PR.UI.GetCustomSearchParams(i.attr("data-target").replace('#', ''));
                        params["Id"] = aid;

                        PR.UI.Post(i, target, siteurl + "/DeleteUserAccountType", params, PR.Sticky.Hide(), true);
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
                PR.Modal.Open(msg, title, false);

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
                        PR.Loader.Hide();

                        if (s.Code == '0')
                        {
                            PR.Modal.Close();
                            $("form:visible").find("#save-btn, #sdoc-btn").removeAttr("title").removeAttr("disabled");

                            acc.addClass("b-valid");
                            bcode.addClass("b-valid");
                            $("div#s2id_" + accType.attr("id")).addClass("b-valid");
                        }
                        else
                        {
                            $("form:visible").find("#save-btn, #sdoc-btn").attr({ "disabled": "disabled", "title": "Can't submit form: Bank validation failed." });

                            msg = "<div class='message-error'>" + s.Message + "</div>";
                            PR.Modal.Open(msg, title, false);

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

                    clearTimeout(PR.UI.PageSearchTimer);

                    PR.UI.PageSearchTimer = setTimeout(function ()
                    {
                        ValidateBank(i);
                    }, '1000');
                });
        },

        DataGetBroadcast: function ()
        {
            if (PR.UI.PageBroadcast) return;

            PR.UI.PageBroadcast = 1;

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
                            PR.Modal.Open(msg, 'Attention', false);
                            $(".announcement").slideDown(1200);

                            var btn = $(PR.Modal.Container).find('#modal-body #btn-got-it');
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
                PR.UI.Post(sender, $("#empty-div"), siteurl + '/AddUserBroadcast', { bid: bid }, [], true, true);

                $(".announcement").hide(500);
                PR.Modal.Close();
            }
        },

        DataAddRefundPR: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var form = $(i.attr("data-form"));
                var target = $(i.attr("data-target"));

                if (!form.length) return;

                $("#refund-groups-holder").slideDown(900);

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        var form = $($(this).attr("data-form"));

                        var valid = PR.UI.DataValidateForm(form);

                        if (!valid) return;

                        var err = '';
                        var dir = '';
                        var title = '';
                        var cntr = [];

                        var fid = form.find("#FundingCompanyId").val();

                        var tr = '';
                        var isnew = false;

                        var refundAmt = 0;

                        // Remove any previous refunds
                        $(".notify").remove();
                        $("#prp-sub-btn").css('display', 'block');
                        target.find('fieldset[finalized="1"]').remove();

                        form.find('#budget-lines').find('[data-pr-refund]').each(function ()
                        {
                            var i = $(this);

                            var r = i.val();
                            var a = i.parent().parent().find('[data-pr-amount="1"]').val();

                            if ((parseFloat(r) || r == 0) && parseFloat(a) || a == 0)
                            {
                                // Make sure Refund is not greater than Current Amount
                                if (parseFloat(r) > parseFloat(a))
                                {
                                    dir = 'center-right';
                                    title = 'Refund greater than Amount';
                                    err = '<div class="message-error">Entered refund amount (<b>R' + parseFloat(r).money(2, ".", ",") + '</b>) is greater than this amount.</div>';

                                    cntr = i.parent().parent().find('#xamount');

                                    valid = false;

                                    return;
                                }

                                refundAmt += parseFloat(r);

                                i.parent().parent().find('select').removeClass("chzn").select2('destroy');

                                // input -> td -> tr
                                tr += '<tr>' + i.parent().parent().html() + '</tr>';
                            }
                        });

                        if (valid && refundAmt <= 0)
                        {
                            valid = false;

                            dir = 'center-right';
                            title = 'No refunds found';
                            err = '<div class="message-error">Please enter a Refund Amount in one of these fields to continue.</div>';
                            cntr = form.find('#budget-lines #xrefund');
                        }

                        // Get existing form
                        var existingForm = target.find("#funding-" + fid + "-form");

                        /*if ( valid && existingForm.length )
                        {
                            var newF = form.find( '#Branch' ).val() + '-' + form.find( '#DirectorateProject' ).val() + '-' + form.find( '#DepartmentSubProject' ).val();
                            var curF = existingForm.find( '#Branch' ).val() + '-' + existingForm.find( '#DirectorateProject' ).val() + '-' + existingForm.find( '#DepartmentSubProject' ).val();

                            if ( newF != curF )
                            {
                                valid = false;

                                dir = 'center-left';
                                title = 'Different Structure Found!';
                                err = '<div class="message-error">You are currently refunding <b>' + curF + '</b>, but this PR is <b>' + newF + '</b>. You can only refund 1 structure per Funding Company at a time.</div>';
                                cntr = form.find( '#Branch' );
                            }
                        }*/

                        if (!valid)
                        {
                            PR.Sticky.StickyOne.addClass("error");
                            PR.Sticky.StickyOne.css({ "display": "none" });

                            PR.Sticky.Show(cntr, title, err, [], dir);
                            $('html, body').animate({ scrollTop: cntr.offset().top - 150 }, 'slow', function () { cntr.focus(); });

                            return;
                        }

                        $('html, body').animate({ scrollTop: target.offset().top - 150 }, 'slow', function () { });

                        var refundTotal = refundAmt;
                        var refundTotalCntr = target.find('#funding-' + fid + '-new-prs-sum');

                        if (target.find('#funding-' + fid + '-new-prs-sum').length)
                        {
                            refundTotal = refundAmt + parseFloat(refundTotalCntr.attr('data-amount'));
                            refundTotalCntr.attr('data-amount', refundTotal).text(refundTotal.money(2, ".", ","));
                        }

                        form.find('select').removeClass("chzn").select2('destroy');

                        var refund = '';

                        if (!target.find("#funding-" + fid).length)
                        {
                            isnew = true;

                            refund += '<fieldset refunded="0" finalized="0">';
                            refund += ' <legend align="center">' + form.find("#FundingCompany").val().trim() + ' (' + form.find("#Branch").val().trim() + ')</legend>';
                            refund += ' <div class="clear"></div>';
                            refund += ' <div id="funding-' + fid + '" class="funding-company">';
                            refund += '     <span id="refund-pr-' + form.find("#Id").val() + '" refunded="0" data-pid="' + form.find("#Id").val() + '" data-amt="' + refundAmt + '" class="refund-prs" style="display: inline-block; margin: 0 2% 10px 0;">';
                            refund += '         ' + form.find("#Number").val().trim() + ' <br />';
                            refund += '         <b id="refund-pr-' + form.find("#Id").val() + '-amt" style="color: #229c1c;">- R' + refundAmt.money(2, ".", ",") + '</b>';
                            refund += '     </span>';
                            refund += ' </div>';
                            refund += ' <span class="block"></span>';
                            refund += ' <img alt="" style="margin-top: -10px;" src="' + imgurl + '/Images/arrow-bottom.png" />';
                            refund += ' <span class="block"></span>';
                            refund += ' <div id="funding-' + fid + '-new-pr">';
                            refund += '     <span id="funding-' + fid + '-new-pr-id" data-number="DA00000XXXX" style="display: inline-block; border-right: 1px solid #cacaca; margin-right: 5px;">';
                            refund += '         <b>DA00000XXXX</b>';
                            refund += '         <a title="Temporary PR Number" rel="tipsyW">';
                            refund += '             <img alt="" src="' + imgurl + '/Images/hot.gif" style="width: 20px; margin: -2px 2px 0 2px;" />';
                            refund += '         </a>';
                            refund += '     </span>';
                            refund += '     <span id="funding-' + fid + '-new-prs-sum" data-amount="' + refundTotal + '" style="display: inline-block;">';
                            refund += '         R' + refundTotal.money(2, ".", ",");
                            refund += '     </span>';
                            refund += '     <span style="display: inline-block; border-left: 1px solid #cacaca; padding-left: 5px; margin-left: 5px;">';
                            refund += '         <input id="funding-' + fid + '-new-prev" data-preview="1" type="button" class="btn-no" value="Preview" />';
                            refund += '     </span>';
                            refund += ' </div>';
                            refund += ' <div id="funding-' + fid + '-form" class="none"></div>';
                            //refund += ' <div id="funding-' + fid + '-form" class="none">' + form.parent().html() + '</div>';
                            refund += '</fieldset>';
                        }
                        /*else if ( target.find( "#funding-" + fid + " #refund-pr-" + form.find( "#Id" ).val() ).length )
                        {
                            var existingPR = target.find( "#funding-" + fid + " #refund-pr-" + form.find( "#Id" ).val() );

                            existingPR.find( '#refund-pr-' + form.find( "#Id" ).val() + '-form' ).html( form.parent().html() );
                            existingPR.find( '#refund-pr-' + form.find( "#Id" ).val() + '-amt').text( 'R-' + refundAmt.money( 2, ".", "," ) );
                        }*/
                        else
                        {
                            // Append new PR
                            var newpr = '';
                            newpr += '<span id="refund-pr-' + form.find("#Id").val() + '" data-pid="' + form.find("#Id").val() + '" data-amt="' + refundAmt + '" class="refund-prs" style="display: inline-block; margin: 0 2% 10px 0;">';
                            newpr += '  ' + form.find("#Number").val().trim() + ' <br />';
                            newpr += '  <b style="color: #229c1c;">- R' + refundAmt.money(2, ".", ",") + '</b>';
                            newpr += '</span>';

                            target.find("#funding-" + fid).append(newpr);

                            // Append another PR Line
                            var len = existingForm.find('#budget-lines tbody tr').length;
                            var trhtml = tr.replace(/\[0]/g, "[" + len + "]").replace(/\-0-/g, "-" + len + "-");

                            existingForm.find('#budget-lines tbody').append(trhtml);

                            // Update Expected Cost
                            existingForm
                                .find('#ExpectedCost')
                                .val(refundTotal)
                                .attr('value', refundTotal);

                            existingForm
                                .find('#OriginalExpectedCost')
                                .val(refundTotal)
                                .attr('value', refundTotal);

                            // Update Expected Cost Label
                            existingForm
                                .find("#ExpectedCostLabel")
                                .text('R' + refundTotal.money(2, ".", ","));
                        }

                        if (refund.trim() != '')
                        {
                            target.append(refund);
                        }

                        if (isnew)
                        {
                            form.appendTo(target.find("#funding-" + fid + "-form"));
                        }

                        var totalRefunds = target.find('.refund-prs').length;

                        target.find('#refund-count').text(totalRefunds);

                        var b = target.find('#funding-' + fid + '-new-pr-id');

                        /*if ( b.attr( 'data-number' ) == 'DA00000XXXX' )
                        {
                            // Request for a temporary Payment Requisition Number
                            $.get( siteurl + "/GetLatestPRNumber", {}, function ( data, status, req )
                            {
                                b.find( 'b' ).text( data );
                                b.attr( 'data-number', data );
                            } );
                        }*/

                        var f = target.find("#funding-" + fid + "-form");

                        // Offer a preview button for updated form
                        var prev = target.find("#funding-" + fid + "-new-prev");

                        PR.UI.DataConfigurePreview(prev, f.find("form"));

                        // Close the open form
                        form.find('[data-cancel="1"]').click();
                        PR.Init.Start(true);

                        // Update Refund Cart
                        PR.UI.DataUpdateRefundCart(sender, target);

                        // Re-index arrays
                        target.find("form").each(function ()
                        {
                            $(this).find("#budget-lines tbody tr").each(function (x)
                            {
                                $(this).find('[name]').each(function ()
                                {
                                    if (typeof $(this).attr("name") == 'undefined') return;

                                    var name = $(this).attr("name");
                                    var n = name.split("[")[1].split("]")[0];

                                    name = name.replace('[' + n + ']', '[' + x + ']');

                                    $(this).attr("name", name);
                                });
                            });
                        });
                    });
            });
        },

        DataUpdateRefundCart: function (sender, target, cart)
        {
            cart = cart ? btoa(cart) : btoa(target.parent().html());

            $.post(siteurl + '/UpdateRefundCart', { cart: cart }, function (data, status, req)
            {

            });
        },

        DataConfigurePreview: function (sender, form)
        {
            var fid = form.find("#FundingCompanyId").val();

            sender
                .fadeIn(1200)
                .unbind("click")
                .bind("click", function ()
                {
                    form.find("#ispreview").val("True");
                    form.find("#IsProvincialRefund").val("False");

                    var numberCntr = form.parent().parent().find('[data-number]');

                    sender.parent().append('<span id="funding-' + fid + '-prev-link" class="none"></span>');

                    form.ajaxSubmit({
                        target: '#funding-' + fid + '-prev-link',
                        beforeSubmit: function ()
                        {
                            PR.Loader.Show(sender, true);
                        },
                        success: function (link, statusText)
                        {
                            $('#funding-' + fid + '-prev-link a').click();

                            PR.Loader.Hide();
                        },
                        fail: function ()
                        {
                            numberCntr.find("img").attr("src", imgurl + "/Images/error.png");
                            numberCntr.find("a").attr("title", "Refund process unsuccessful, you can try again.");
                        }
                    });
                });
        },

        DataCaptureRefundDetails: function (sender, target, fieldset)
        {
            var form = fieldset.find("form");

            if (!form.length) return;

            function UpdateBranches()
            {
                // Get Branch
                var bra = form.find('#Branch');

                bra
                    .unbind("change")
                    .bind("change", function ()
                    {
                        UpdateDirectorateProjects($(this).val(), true);
                    });
                //.change();

                UpdateDirectorateProjects(null, false);
            }

            function UpdateDirectorateProjects(branch, change)
            {
                // Get Directorate Projects
                var mdp = $(PR.Modal.Container).find("#directorate-projects");
                var dp = mdp.find('#DirectorateProject');

                if (change)
                {
                    branch = (branch) ? branch : form.find("#Branch").val();

                    PR.Loader.Show(mdp.find("label"), true);

                    mdp.load(siteurl + "/DirectorateProjects", { originatorId: 0, Branch: branch.trim(), index: 0 }, function ()
                    {
                        var dp = $(this).find('#DirectorateProject');

                        ConfigDp(branch, dp, true);
                    });
                }
                else
                {
                    ConfigDp(null, dp, false);

                    UpdateDepartmentSubProjects(null, null, false);
                }
            }

            function ConfigDp(branch, dp, change)
            {
                dp
                    .removeAttr("readonly")
                    .select2()
                    .chznreadonly(false)
                    .unbind("change")
                    .bind("change", function ()
                    {
                        UpdateDepartmentSubProjects(branch, $(this).val(), true);
                    });

                if (change)
                {
                    dp.change();
                }
            }

            function UpdateDepartmentSubProjects(branch, dp, change)
            {
                // Get Department Sub-Projects
                var mdsp = $(PR.Modal.Container).find("#department-sub-projects");
                var dsp = mdsp.find("#DepartmentSubProject");

                if (change)
                {
                    branch = (branch) ? branch : form.find("#Branch").val();
                    dp = (dp) ? dp : form.find("#DirectorateProject").val();

                    mdsp.load(siteurl + "/DepartmentSubProjects", { originatorId: 0, Branch: branch.trim(), directorateProject: dp.trim(), index: 0 }, function ()
                    {
                        var dsp = $(this).find('#DepartmentSubProject');

                        ConfigDsp(branch, dp, dsp, true);

                        PR.Loader.Hide();
                    });
                }
                else
                {
                    ConfigDsp(branch, dp, dsp, false);
                }
            }

            function ConfigDsp(branch, dp, dsp, change)
            {
                dsp
                    .removeAttr("readonly")
                    .select2()
                    .chznreadonly(false)
                    .unbind("change")
                    .bind("change", function ()
                    {
                        PR.UI.DataPRPBudgetLines(branch, dp, $(this).val(), "#modal-body");
                    });

                if (change)
                {
                    dsp.change();
                }
                else
                {
                    //PR.UI.DataPRPBudgetLines( branch, dp, $( this ).val(), "#modal-body" );
                }
            }

            if (PR.Modal.MovedObj.length)
            {
                PR.Modal.MovedObj.appendTo(PR.Modal.MovedObjSource);
            }

            var body = $(PR.Modal.Container).find("#modal-body");
            body.css("background", "#ffffff");

            // Home work =============================================

            form.find(".btn-list").css("display", "none");
            form.find("div#edit-item").removeAttr("style");
            form.css({ "color": "#000000", "padding-top": "20px" });

            form.find("select").select2();

            // Home work =============================================


            // Move form so HTML DOM remains the same
            PR.Modal.MovedObj = form;
            PR.Modal.MovedObjSource = form.parent();

            form.appendTo(body);

            var title = "Enter/Select required details below:";

            var btn = $(PR.Modal.Container).find(".btns #btnConfirm");

            btn.val("Update");

            // Modify model to suit our needs
            $(PR.Modal.Container).find(".modalContainer").css("left", "8%");
            $(PR.Modal.Container).find(".modalContent").css("width", "auto");

            $(PR.Modal.Container).find(".m-spacer, .m-close, .modalClose").css("display", "none");
            PR.Modal.Open(null, title, true, UpdateBranches);

            btn
                .unbind("click")
                .bind("click", function ()
                {
                    var valid = PR.UI.DataValidateForm(form);

                    if (!valid) return;

                    if (PR.Modal.MovedObj.length && PR.Modal.MovedObjSource.length)
                    {
                        PR.Modal.MovedObj.appendTo(PR.Modal.MovedObjSource);

                        PR.Modal.MovedObj = PR.Modal.MovedObjSource = [];
                    }

                    fieldset.attr("finalized", 1);
                    PR.UI.DataProcessRefund(sender, target, fieldset);

                    PR.Modal.Close();

                    $(PR.Modal.Container).find(".m-spacer, .m-close, .modalClose").css("display", "block");
                });
        },

        DataRestoreRefunds: function ()
        {
            var hash = window.location.hash;

            var table = $(hash + " table");
            var target = $(".refund-groups");

            if (!target.length) return;

            target.find(".refund-prs").each(function ()
            {
                var i = $(this);

                var fieldset = i.parent().parent();

                if (fieldset.attr('refunded') == '1') return;

                var pid = i.attr('data-pid');
                var refundAmt = parseFloat(i.attr('data-amt'));

                var refundTd = table.find('tr#tr-' + pid + '-item td[data-refund-td="1"]');

                if (!refundTd.length) return;
                if (refundTd.find('#refund-pr-' + pid + '-tip').length) return;

                var tip = '';

                tip += '<strong id="refund-pr-' + pid + '-tip" style="display: block; color: #444444;">';
                tip += '    R' + refundAmt.money(2, ".", ",");
                tip += '    <a title="Amount pending to be refunded" rel="tipsyW">';
                tip += '        <img alt="" src="' + imgurl + '/Images/pending.png" style="width: 15px; margin: -2px 0px 0 0;" />';
                tip += '    </a>';
                tip += '</strong>';

                refundTd.append(tip);

                PR.Init.PluginInit(refundTd);

                var prev = fieldset.find('[data-preview="1"]');
                var fid = i.parent().attr('id').split('-')[0];

                PR.UI.DataConfigurePreview(prev, fieldset.find("form"), fid);
            });
        },

        DataCompleteRefund: function (sender)
        {
            var hash = window.location.hash;

            sender.each(function ()
            {
                var i = $(this);
                var target = $(i.attr("data-target"));

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        // Instiate forms
                        if (!$("body #empties").length)
                        {
                            $("html, body").append("<div id='empties' />");
                        }

                        if (!target.find("fieldset form").length)
                        {
                            var err = '<div class="message-warn">Click one of these buttons to begin your refund process.</div>';
                            var cntr = $(hash + ' table a[data-edit="1"]:first');

                            PR.Sticky.StickyOne.addClass("error");
                            PR.Sticky.StickyOne.css({ "display": "none" });

                            PR.Sticky.Show(cntr, "No refunds found", err, [], 'center-right');
                            $('html, body').animate({ scrollTop: cntr.offset().top - 150 }, 'slow', function () { cntr.focus(); });

                            return;
                        }

                        PR.UI.DataProcessNextRefund(i, target);
                    });
            });
        },

        DataProcessNextRefund: function (sender, target)
        {
            var fieldset = target.find('fieldset[refunded="0"]:first');

            if (!fieldset.length) return;

            var number = '';

            // Ask user to finalize form:
            if (fieldset.attr("finalized") == "1")
            {
                PR.UI.DataProcessRefund(sender, target, fieldset);
            }
            else
            {
                PR.UI.DataCaptureRefundDetails(sender, target, fieldset);
            }
        },

        DataProcessRefund: function (sender, target, fieldset)
        {
            var form = fieldset.find('form');

            if (!form.length) return;

            form.find("#ispreview").val("False");
            form.find("#IsProvincialRefund").val("True");

            var numberCntr = fieldset.find('[data-number]');

            // Post form
            form.ajaxSubmit({
                target: '#empties',
                beforeSubmit: function ()
                {
                    PR.Loader.Show(numberCntr, true);
                },
                success: function (number, statusText)
                {
                    form.remove();
                    fieldset.attr('refunded', '1');

                    PR.Loader.Hide();

                    var link = '';

                    link += '<a target="_blank" href="/PaymentRequisition?viewid=' + number.trim().split('|')[0] + '&skip=0" class="bold">';
                    link += '   ' + number.trim().split('|')[1];
                    link += '   <img alt="" src="' + imgurl + '/Images/checked.png" style="margin: -2px 0px 0 0;" />';
                    link += '</a>';

                    numberCntr.html(link);

                    fieldset.find('[data-preview="1"]').parent().remove();

                    // Check if there are still refunds to process?
                    if (target.find('fieldset[refunded="0"]').length > 0)
                    {
                        PR.UI.DataProcessNextRefund(sender, target);
                    }
                    else
                    {
                        PR.UI.DataFinalizeRefund(sender, target);
                    }
                },
                fail: function ()
                {
                    PR.UI.PageErrorOcurred = true;

                    numberCntr.find("img").attr("src", imgurl + "/Images/error.png");
                    numberCntr.find("a").attr("title", "Refund process unsuccessful, you can try again.");
                }
            });
        },

        DataFinalizeRefund: function (sender, target)
        {
            var hash = window.location.hash;

            var notify = sender.parent().parent();
            var msg = '';

            // Check for any errors
            if (PR.UI.PageErrorOcurred)
            {
                msg += '<div class="notify message-warn none">There were errors, please try again.';
            }
            else
            {
                msg += '<div class="notify message-success none">';
                msg += '    Your refund process completed successfully. ';
                msg += '    The refunded amounts will reflect in the table below.';
                msg += '    You can click on the generated PR Number (s) above to view the Refund Payment Requistions now.';
                msg += '    <strong class="block">Refresh Page to continue.</strong>';

                // Finally Refresh table
                $(hash + ' [data-refresh="1"]').click();
                PR.UI.DataUpdateRefundCart([], [], ' ');
            }

            msg += '</div>';

            sender.parent().hide(900);
            notify.append(msg).find('.notify').show(1200);
        },

        DataOverridePR: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var pid = i.attr("data-id");
                var target = $(i.attr("data-target"));
                var update = i.parent().parent().find('[data-budget-year="1"]');

                i
                    .unbind("click")
                    .bind("click", function () 
                    {
                        var title = "Update Budget Year";
                        var message = target.html();

                        PR.Sticky.Show(i, title, message, [], "center-right");

                        var btn = PR.Sticky.StickyOne.find("#override-btn");
                        var oby = PR.Sticky.StickyOne.find("#OverrideBudgetYear");

                        btn
                            .unbind("click")
                            .bind("click", function ()
                            {
                                var by = oby.val();

                                if (by == "")
                                {
                                    oby.addClass("invalid").focus();

                                    return;
                                }

                                PR.Loader.Show(btn, true);
                                $("<div />").load(siteurl + "/OverrideBudgetYear", { BudgetYear: by, Id: pid }, function ()
                                {
                                    title = $(this).find(".title");
                                    $(this).find(".title").remove();

                                    PR.Sticky.Show(i, title, $(this).html(), [], "center-right");

                                    if ($(this).find(".message-success").length)
                                    {
                                        update.text(by);
                                        PR.UI.DataHighlightFields(update.parent());
                                    }

                                    PR.Loader.Hide();
                                });
                            });

                        return false;
                    });
            });
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

        DataSelStructure: function (sender)
        {
            var uscount = $("#u-s-count");
            var bscount = $("#b-s-count");

            var uloader = $("#u-s-loader");
            var bloader = $("#b-s-loader");

            var ustructures = $("#u-structures");
            var bstructures = $("#b-structures");

            var mstructures = $('a[data-matched-structures="1"]');

            var uid = $('#UserId[data-sel-structure="1"]');
            var by = $('#BudgetYear[data-sel-structure="1"]');
            var bra = $('#Branch[data-sel-structure="1"]');
            var dir = $('#DirectorateProject[data-sel-structure="1"]');
            var dep = $('#DepartmentSubProject[data-sel-structure="1"]');

            sender.each(function ()
            {
                var i = $(this);
                var name = i.attr("name");




                i
                    .unbind("change")
                    .bind("change", function ()
                    {
                        _uid = uid.val();
                        _by = by.val();
                        _bra = bra.val();
                        _dir = dir.val();
                        _dep = dep.val();

                        mstructures.fadeOut(500);

                        if (name == "UserId")
                        {
                            // Get selected current User Structures
                            PR.UI.DataUpdateUserStructures(_uid, _by, _bra, _dir, _dep, uloader, uscount, ustructures);
                        }
                        else if (name == "BudgetYear")
                        {
                            // Get Branches, Directorate Project and Department Sub-Project for the selected Budget Year
                            PR.UI.DataUpdateBranches(bra, _by);
                            PR.UI.DataUpdateDirectorateProject(dir, _by, '');
                            PR.UI.DataUpdateDepartmentSubProject(dep, _by, '', '');

                            // Get User and Branch Structures for selected Budget Year and ALL B-D-D
                            PR.UI.DataUpdateUserStructures(_uid, _by, '', '', '', uloader, uscount, ustructures);
                            PR.UI.DataUpdateBranchStructures(0, _by, '', '', '', bloader, bscount, bstructures);
                        }
                        else if (name == "Branch")
                        {
                            // Get Directorate Project and Department Sub-Project for the selected Budget Year and Branch
                            PR.UI.DataUpdateDirectorateProject(dir, _by, _bra);
                            PR.UI.DataUpdateDepartmentSubProject(dep, _by, _bra, '');

                            // Get User and Branch Structures for selected Budget Year and Branch and ALL D-D
                            PR.UI.DataUpdateUserStructures(_uid, _by, _bra, '', '', uloader, uscount, ustructures);
                            PR.UI.DataUpdateBranchStructures(0, _by, _bra, '', '', bloader, bscount, bstructures);
                        }
                        else if (name == "DirectorateProject")
                        {
                            // Get Department Sub-Project for the selected Budget Year, Branch and Directorate Project
                            PR.UI.DataUpdateDepartmentSubProject(dep, _by, _bra, _dir);

                            // Get User and Branch Structures for selected Budget Year, Branch and Directorate Project and ALL D
                            PR.UI.DataUpdateUserStructures(_uid, _by, _bra, _dir, '', uloader, uscount, ustructures);
                            PR.UI.DataUpdateBranchStructures(0, _by, _bra, _dir, '', bloader, bscount, bstructures);
                        }
                        else if (name == "DepartmentSubProject")
                        {
                            // Get User and Branch Structures for selected Budget Year, Branch, Directorate Project and Department Sub-Project
                            PR.UI.DataUpdateUserStructures(_uid, _by, _bra, _dir, _dep, uloader, uscount, ustructures);
                            PR.UI.DataUpdateBranchStructures(0, _by, _bra, _dir, _dep, bloader, bscount, bstructures);
                        }

                        PR.UI.Start();
                    });
            });
        },

        DataUpdateUserStructures: function (uid, by, bra, dir, dep, loader, scount, structures)
        {
            if (uid === "")
            {
                structures.find("li").slideUp(900, function ()
                {
                    $(this).remove();

                    structures.html("");
                });

                scount.text("(" + 0 + ")");

                return;
            }

            PR.Loader.Show(loader, true);

            structures.load(siteurl + "/SelectableUserStructures", { uid: uid, budgetYear: by, branch: bra, directorateProject: dir, departmentSubProject: dep }, function ()
            {
                // Update counter
                var len = ($(this).find("li").length > 0) ? $(this).find("li").length - 1 : 0;

                scount.text("(" + len + ")");

                // Show all <li> items
                $(this).find(">div").show(900);

                // Configure the --ALL-- radio button
                PR.UI.DataCheckAll(structures);

                // Find matched structures (Left vs Right)  
                PR.UI.DataMatchedStructures();

                // Hide Loader
                PR.Loader.Hide();
            });
        },

        DataUpdateBranchStructures: function (uid, by, bra, dir, dep, loader, scount, structures)
        {
            PR.Loader.Show(loader, true);

            structures.load(siteurl + "/SelectableBranchStructures", { uid: uid, budgetYear: by, branch: bra, directorateProject: dir, departmentSubProject: dep }, function ()
            {
                // Update counter
                var len = ($(this).find("li").length > 0) ? $(this).find("li").length - 1 : 0;

                scount.text("(" + len + ")");

                // Show all <li> items
                $(this).find(">div").show(900);

                // Configure the --ALL-- radio button
                PR.UI.DataCheckAll(structures);

                // Find matched structures (Left vs Right)
                PR.UI.DataMatchedStructures();

                // Hide Loader
                PR.Loader.Hide();
            });
        },

        DataMatchedStructures: function ()
        {
            var ustructures = $("#u-structures");
            var bstructures = $("#b-structures");

            var mstructures = $('a[data-matched-structures="1"]');

            if (ustructures.html().trim() == "" || bstructures.html().trim() == "")
            {
                mstructures.hide(900);

                return;
            }

            clearTimeout(PR.UI.PageMatchStructureTimer);

            PR.UI.PageMatchStructureTimer = setTimeout(function ()
            {
                var match = 0;

                ustructures.find('input[type="checkbox"]').each(function ()
                {
                    if ($(this).val() == "") return;

                    var bcheck = bstructures.find('input[value="' + $(this).val() + '"]');

                    if (bcheck.length > 0)
                    {
                        match += 1;
                        bcheck
                            .prop("disabled", true)
                            .attr({ "disabled": "disabled" });

                        var li = bcheck.parent().parent();

                        li
                            .attr("title", "Structure already allocated to user")
                            .css({ "border-bottom": "1px solid #3bea29", "color": "#3bea29" });
                    }
                });

                mstructures.attr("title", match + " matched structures").fadeIn(1200);

            }, "2000");
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

        DataUpdateBranches: function (i, by)
        {
            var d = { budgetYear: by, json: true };

            $.ajax({
                url: siteurl + "/Branches",
                type: "POST",
                data: JSON.stringify(d),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                error: function (error)
                {

                },

                success: function (d)
                {
                    var count = 0;
                    var is = '<option value="">All...</option>';

                    for (var a in d.Branches)
                    {
                        is += '<option value="' + a + '">' + d.Branches[a] + '</option>';

                        count++;
                    }

                    i.select2('destroy').html(is).removeAttr("disabled", "readonly").select2();
                }
            });
        },

        DataUpdateDirectorateProject: function (i, by, branch)
        {
            var d = { budgetYear: by, branch: branch, json: true };

            $.ajax({
                url: siteurl + "/DirectorateProjects",
                type: "POST",
                data: JSON.stringify(d),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                error: function (error)
                {

                },

                success: function (d)
                {
                    var count = 0;
                    var is = '<option value="">All...</option>';

                    for (var a in d.DirectorateProjects)
                    {
                        is += '<option value="' + a + '">' + d.DirectorateProjects[a] + '</option>';

                        count++;
                    }

                    i.select2('destroy').html(is).removeAttr("disabled", "readonly").select2();
                }
            });
        },

        DataUpdateDepartmentSubProject: function (i, by, branch, dr)
        {
            var d = { budgetYear: by, branch: branch, directorateProject: dr, json: true };

            $.ajax({
                url: siteurl + "/DepartmentSubProjects",
                type: "POST",
                data: JSON.stringify(d),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                error: function (error)
                {

                },

                success: function (d)
                {
                    var count = 0;
                    var is = '<option value="">All...</option>';

                    for (var a in d.DepartmentSubProjects)
                    {
                        is += '<option value="' + a + '">' + d.DepartmentSubProjects[a] + '</option>';

                        count++;
                    }

                    i.select2('destroy').html(is).removeAttr("disabled", "readonly").select2();
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

                            PR.Sticky.Show(cntr, "Nothing selected", err, [], "bottom-left");

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

                                PR.UI.DataHighlightFields(_li.find("label"));
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

                        PR.UI.DataHighlightFields(uscount);
                        PR.UI.DataHighlightFields(bscount);

                        PR.UI.DataMatchedStructures();

                        to.find("li").each(function (indx)
                        {
                            PR.UI.DataIndex($(this).find('input,select,textarea'), (indx - 1));
                        });

                        from.find("li").each(function (indx)
                        {
                            PR.UI.DataIndex($(this).find('input,select,textarea'), (indx - 1));
                        });
                    });
            });
        },

        DataSaveStructure: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var to = $(i.attr("data-to"));
                var from = $(i.attr("data-from"));

                var form = $(i.attr("data-target"));

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        var msg = "";

                        msg += "<p>";
                        msg += "    Are you sure you would like to save the changes you've made to <strong>" + form.find("select#UserId option:selected").text() + "'s</strong> User Structure?</p>";
                        msg += "</p>";

                        PR.Modal.Open(msg, "Add User Structures?", true, []);

                        var btn = $(PR.Modal.Container).find("#btnConfirm");

                        btn
                            .removeAttr("onclick")
                            .unbind("click")
                            .bind("click", function ()
                            {
                                // Remove the name attribute from the RHS
                                from.find("input,select,textarea").removeAttr("name");

                                // Just for assurance, re-index the inputs on the LHS
                                to.find("li").each(function (indx)
                                {
                                    PR.UI.DataIndex($(this).find("input,select,textarea"), (indx - 1));
                                });

                                // Submit form
                                var t = "userstructure";
                                var target = $(form.attr("data-target"));

                                var options =
                                {
                                    target: target, // target element to be updated with server response
                                    beforeSubmit: function (formData, jqForm, options)
                                    {
                                        PR.Loader.Show(btn, true);

                                        // Manually set Custom Search fields...
                                        PR.UI[t].IsCustomSearch = true;

                                        PR.UI[t].PageUserId = form.find("select#UserId").val();
                                        PR.UI[t].PageUserIdDesc = form.find("select#UserId option:selected").text();

                                        PR.UI[t].PageBranch = form.find("select#Branch").val();
                                        PR.UI[t].PageBranchDesc = form.find("select#Branch option:selected").text();

                                        PR.UI[t].PageBudgetYear = form.find("select#BudgetYear").val();
                                        PR.UI[t].PageBudgetYearDesc = form.find("select#BudgetYear option:selected").text();

                                        PR.UI[t].PageDirectorateProject = form.find("select#DirectorateProject").val();
                                        PR.UI[t].PageDirectorateProjectDesc = form.find("select#DirectorateProject option:selected").text();

                                        PR.UI[t].PageDepartmentSubProject = form.find("select#DepartmentSubProject").val();
                                        PR.UI[t].PageDepartmentSubProjectDesc = form.find("select#DepartmentSubProject option:selected").text();
                                    },
                                    success: function ()
                                    {
                                        PR.UI.SelectedItems = [];

                                        PR.Init.PluginLoaded = false;
                                        PR.Init.Start();

                                        PR.Modal.Close();
                                    }
                                };

                                form.ajaxForm(options).submit();
                            });
                    });
            });
        },

        DataCallBack: function (callback)
        {
            if (typeof (callback) == 'undefined')
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
        },

        DataSearchPR: function (sender)
        {
            function test()
            {
                PR.UI.DataDocPR($('#sticky-one *[data-doc-pr="1"]'));
            }

            sender.each(function ()
            {
                var i = $(this);

                var target = $(i.attr("data-target"));

                target
                    .unbind("keypress")
                    .bind("keypress", function (e)
                    {
                        e = (e) ? e : window.event;

                        var charCode = (e.which) ? e.which : e.keyCode;

                        if (charCode === 13)
                        {
                            i.click();

                            return false;
                        }
                    });

                i
                    .unbind("click")
                    .bind("click", function ()
                    {
                        if (i.attr("data-disabled") === "1") return false;

                        var title = "",
                            message = "";

                        if (target.val().trim() === "")
                        {
                            title = "Nothing entered";
                            message = "<p>Start off by entering a search phrase above...</p>";

                            PR.Sticky.Show(target, title, message, [], "center-left");

                            return false;
                        }

                        i.attr("data-disabled", 1);

                        i.find("img").attr("src", imgurl + "/Images/spinner.gif");

                        $("<div />").load(siteurl + "/SearchPR", { phrase: target.val().trim() }, function (results)
                        {
                            PR.Sticky.Show(target, "Select Payment Requisition (" + $(this).find("li").length + ")", results, test, "center-left");

                            i.find("img").attr("src", imgurl + "/Images/search.png");
                            i.attr("data-disabled", 0);
                        });

                        return false;
                    });
            });
        },

        DataEvent: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var target = $('[name="' + i.attr("data-target") + '"]');

                i
                    .unbind("change")
                    .bind("change", function ()
                    {
                        if ($(this).val() === "")
                        {
                            //target.val("").prop("disabled", false).removeAttr("disabled");

                            return;
                        }

                        var d = { Id: $(this).val() };

                        PR.Loader.Show(target.parent(), true);

                        $.ajax({
                            url: siteurl + "/GetEvent",
                            type: "POST",
                            data: JSON.stringify(d),
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (p)
                            {
                                PR.Loader.Hide();

                                target.val(p.EventDate);//.prop("disabled", true).attr("disabled", "disabled");
                            }
                        });
                    });
            });
        },

        DataVR: function (sender)
        {
            sender.each(function ()
            {
                var i = $(this);

                var type = i.attr("data-type");
                var loaded = i.attr("data-loaded");

                if (loaded === "1") return;

                i.append('<div id="vr-loader" />');

                PR.Loader.Show(i.find("#vr-loader"), false);

                var p = PR.UI.GetCustomSearchParams("visual");
                p["type"] = type;

                i.load(siteurl + "Visual", p, function ()
                {
                    PR.Loader.Hide();
                    i.attr("data-loaded", 1);
                    PR.UI.DataVR($('.visual-reports[data-loaded="0"]:first')); 
                });
            });
        }

    };
})();
