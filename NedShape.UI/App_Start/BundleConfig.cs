﻿using System.Web;
using System.Web.Optimization;

namespace NedShape.UI
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles( BundleCollection bundles )
        {
            bundles.Add( new ScriptBundle( "~/bundles/jquery" ).Include(
                        "~/Scripts/jquery-{version}.js" ) );

            bundles.Add( new ScriptBundle( "~/bundles/jqueryval" ).Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*" ) );

            bundles.Add( new ScriptBundle( "~/bundles/jqueryui" ).Include(
                        "~/Scripts/JQueryUI/jquery-ui-1.10.4.custom.js",
                        "~/Scripts/JQueryUI/timepicker.js" ) );

            bundles.Add( new ScriptBundle( "~/bundles/plugins" ).Include(
                        "~/Scripts/Plugins/tipsy.js",
                        "~/Scripts/Plugins/select2.js",
                        "~/Scripts/Plugins/highcharts.js",
                        "~/Scripts/Plugins/jquery.form.js",
                        "~/Scripts/Plugins/timer.jquery.js",
                        "~/Scripts/Plugins/jquery.fancybox.js",
                        "~/Scripts/Plugins/jquery.dataTables.js",
                        "~/Scripts/Plugins/jquery.placeholder.js" ) );

            bundles.Add( new ScriptBundle( "~/bundles/ns" ).Include(
                        "~/Scripts/NS/ns.js",
                        "~/Scripts/NS/ui.js",
                        "~/Scripts/NS/modal.js",
                        "~/Scripts/NS/loader.js",
                        "~/Scripts/NS/stickyone.js",
                        "~/Scripts/NS/validation.js",
                        "~/Scripts/NS/startup.js" ) );

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add( new ScriptBundle( "~/bundles/modernizr" ).Include(
                        "~/Scripts/modernizr-*" ) );




            bundles.Add( new StyleBundle( "~/Content/css" ).Include(
                "~/Content/reset.css",
                "~/Content/tipsy.css",
                "~/Content/style.css",
                "~/Content/menu.css",
                "~/Content/modal.css",
                "~/Content/table.css",
                "~/Content/ap-tabs.css",
                "~/Content/ap-tabs.css",
                "~/Content/select2.css",
                "~/Content/checkbox.css",
                "~/Content/stickyone.css",
                "~/Content/font-awesome.css",
                "~/Content/jquery.fancybox.css" ) );

            //bundles.Add( new ScriptBundle( "~/bundles/bootstrap" ).Include(
            //          "~/Scripts/bootstrap.js" ) );

            //bundles.Add( new StyleBundle( "~/Content/css" ).Include(
            //"~/Content/bootstrap.css",
            //"~/Content/site.css" ) );

            bundles.Add( new StyleBundle( "~/Content/jqueryui" ).Include( "~/Content/jquery-ui-1.10.4.custom.css" ) );
        }
    }
}
