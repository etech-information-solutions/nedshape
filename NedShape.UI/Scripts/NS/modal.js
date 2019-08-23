( function ()
{
    NS.Modal = {

        MovedObj: [],

        MovedObjSource: [],

        Container: '.modal',

        Open: function ( msg, title, show_btns, callback )
        {
            if ( msg )
            {
                $( NS.Modal.Container ).find( '#modal-body' ).html( msg );
            }

            if ( title )
            {
                $( NS.Modal.Container ).find( '#modal-title' ).html( title );
            }

            if ( show_btns )
            {
                $( NS.Modal.Container ).find( '#btns' ).css( "display", "block" );
            }
            else
            {
                $( NS.Modal.Container ).find( '#btns' ).css( "display", "none" );
            }

            $( NS.Modal.Container ).fadeIn( 'medium', function ()
            {
                NS.UI.DataCallBack(callback);
            } );

            $( '.modalContainer' ).center();
        },

        Close: function ()
        {
            $( ".announcement" ).slideUp( 1200 );
            $( NS.Modal.Container ).fadeOut( 500, function ()
            {
                if ( NS.Modal.MovedObj.length )
                {
                    NS.Modal.MovedObj.appendTo( NS.Modal.MovedObjSource );
                }

                $( NS.Modal.Container ).find( '#modal-body' ).html( '' );
                $( NS.Modal.Container ).find( '#modal-title' ).html( '' );
            } );
        }
    }
} )();


$( function ()
{
    $( window ).resize( function ()
    {
        $( '.modalContainer' ).center();
    } );
} );
