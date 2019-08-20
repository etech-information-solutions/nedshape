using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text.RegularExpressions;

namespace System
{
    public static class StringExtensions
    {
        public static string CamelToDelimeted( this string s, string delimeter )
        {

            string output = s;
            Regex reg0 = new Regex( "[a-z][A-Z]" );
            foreach ( Match m in reg0.Matches( output ) )
            {

                string spliced = m.Value.Insert( 1, delimeter );
                output = output.Replace( m.Value, spliced );
            }


            //Regex reg1 = new Regex("[a-z,A-Z][0-9]");
            Regex reg1 = new Regex( "[a-z][0-9]" );
            foreach ( Match m in reg1.Matches( output ) )
            {

                string spliced = m.Value.Insert( 1, delimeter );
                output = output.Replace( m.Value, spliced );
            }

            //Regex reg2 = new Regex("[0-9][a-z,A-Z]");
            Regex reg2 = new Regex( "[0-9][a-z]" );
            foreach ( Match m in reg2.Matches( output ) )
            {

                string spliced = m.Value.Insert( 1, delimeter );
                output = output.Replace( m.Value, spliced );
            }

            return output;

        }

        public static string CamelToSpaced( this string s )
        {
            return s.CamelToDelimeted( " " );
        }

        public static string CamelToDashed( this string s )
        {
            return s.CamelToDelimeted( "-" );
        }

        public static string Prettify( this string s )
        {
            if ( string.IsNullOrEmpty( s ) ) return s;
            return s.Replace( "_", " " ).Replace( "-", " " ).CamelToSpaced();
        }

        public static string AsHtmlAttribute( this string s )
        {

            Regex r = new Regex( "[\\[,\\],(,),<,>]" );

            return r.Replace( s.CamelToDashed().ToLower(), "-" );

        }

        public static string Enquote( this string s, string quote )
        {
            return s.Enquote( quote, quote );
        }

        public static string Enquote( this string s, string openQuote, string closeQuote )
        {
            return string.Format( "{0}{1}{2}", openQuote, s, closeQuote );

        }



        public static IDictionary<string, string> ToDictionary( this string s, char pairDelimeter )
        {
            return s.ToDictionary( pairDelimeter, '=' );
        }

        public static IDictionary<string, string> ToDictionary( this string s, char pairDelimeter, char keyValueDelimeter )
        {

            IDictionary<string, string> dictionary = new Dictionary<string, string>();

            foreach ( string pair in s.Split( pairDelimeter ) )
            {

                string[] keyValue = pair.Split( keyValueDelimeter );
                if ( keyValue.Length >= 2 )
                {
                    dictionary.Add( keyValue[ 0 ], keyValue[ 1 ] );
                }

            }


            return dictionary;

        }

        /// <summary>
        /// Replaces special string charachters with appropriate tags.
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static string ToHtml( this string s )
        {

            if ( s == null ) return null;
            s = s.Replace( "\r\n", "<br/>" ).Replace( "\n", "<br/>" ).Replace( "\r", "<br/>" );

            //TODO: add more as we go along...

            return s;
        }

        public static string FormatUrl( this string s )
        {
            return s.FormatUrl( true );
        }

        public static string FormatUrl( this string s, bool endWithSlash )
        {

            if ( !s.StartsWith( "http" ) )
            {
                s = "http://" + s;
            }

            if ( endWithSlash && !s.EndsWith( "/" ) )
            {
                s += "/";
            }

            while ( !endWithSlash && s.EndsWith( "/" ) )
            {
                s = s.Substring( 0, s.Length - 1 );
            }

            return s;


        }

        public static string HtmlToXmlSafe( this string html )
        {
            //When trying to parse Html as Xml, chars such as &nbsp; are not welcome.
            //This extension Method provides a single source where non Xml safe html content can be cleaned up.

            foreach ( Match m in Regex.Matches( html, "[@#$%^&*]", RegexOptions.Multiline ) )
            {
                html = html.Replace( m.Value, "" );
            }
            return html;

        }

        /// <summary>
        /// Tries to format a string so that it will be safe to parse the string
        /// as a double
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static string ToDoubleInvariantSafe( this string s )
        {


            MatchCollection mc = Regex.Matches( s, "[a-zA-Z]" );
            if ( ( mc.Count > 1 ) || ( ( mc.Count == 1 ) && mc[ 0 ].Value != "E" ) )
            {
                throw new FormatException( "The input string if of the incorrect format." );
            }

            //is there a "."
            int dotCount = Regex.Matches( s, "\\." ).Count;

            if ( dotCount > 1 )
            {
                throw new FormatException( "The input string if of the incorrect format." );
            }

            int commaCount = Regex.Matches( s, "\\," ).Count;

            if ( commaCount > 0 )
            {
                if ( dotCount > 0 )
                {
                    //assume 1,234,2323.34
                    s = s.Replace( ",", "" );
                }
                else if ( commaCount == 1 )
                {
                    //assume 123,45
                    s = s.Replace( ",", "." );
                }
                else
                {
                    //assume 1,345,345
                    s = s.Replace( ",", "" );
                }
            }

            s = s.Replace( "'", "" );

            return s;

        }

        public static string LowerFirst( this string s )
        {
            if ( s.Length <= 1 )
            {
                return s.ToLower();
            }

            return string.Format( "{0}{1}", s.Substring( 0, 1 ).ToLower(), s.Substring( 1 ) );

        }

        public static string UpperFirst( this string s )
        {
            if ( s.Length <= 1 )
            {
                return s.ToUpper();
            }

            return string.Format( "{0}{1}", s.Substring( 0, 1 ).ToUpper(), s.Substring( 1 ) );
        }

        /// <summary>
        /// Converts GPS coordinates to its decimal value
        /// </summary>
        /// <param name="value"></param>
        /// <param name="decimals"></param>
        /// <returns></returns>
        public static string GPSToDecimal( this string value, int decimals = 2 )
        {
            // Example: 17.21.18S

            var multiplier = ( value.Contains( "S" ) || value.Contains( "W" ) ) ? -1 : 1; // Handle South and West

            value = Regex.Replace( value, "[^0-9.]", "" ); // Remove the characters


            var pointArray = value.SplitInParts( 2 ).ToList();

            // Decimal degrees = 
            // Whole number of degrees,
            // Plus minutes divided by 60,
            // Plus seconds divided by 3600

            if ( pointArray != null && pointArray.Count < 3 ) return string.Empty;

            var degrees = double.Parse( pointArray[ 0 ] );
            var minutes = double.Parse( pointArray[ 1 ] ) / 60;
            var seconds = double.Parse( pointArray[ 2 ] ) / 3600;

            return Math.Round( ( degrees + minutes + seconds ) * multiplier, decimals ).ToString();
        }

        /// <summary>
        /// Splits a string into the number of specified parts
        /// </summary>
        /// <param name="value"></param>
        /// <param name="partLength"></param>
        /// <returns></returns>
        public static IEnumerable<string> SplitInParts( this string value, int partLength = 0 )
        {
            for ( var i = 0; i < value.Length; i += partLength )
            {
                yield return value.Substring( i, Math.Min( partLength, value.Length - i ) );
            }
        }

        public static string TrimIfNotNull( this string value )
        {
            if ( string.IsNullOrEmpty( value ) )
                return "";

            return value.Trim();
        }

        public static string Truncate( this string str, int maxLength )
        {
            if ( string.IsNullOrEmpty( str ) )
                return "";
            return str.Substring( 0, Math.Min( str.Length, maxLength ) );
        }

        public static string ToCSVSafe( this string str )
        {
            if ( string.IsNullOrEmpty( str ) )
                return str;

            return ( "\"" + str + "\"" ).Trim();
        }
    }
}