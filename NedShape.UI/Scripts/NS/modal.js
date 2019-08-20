( function ()
{
    PR.Modal = {

        MovedObj: [],

        MovedObjSource: [],

        Container: '.modal',

        Open: function ( msg, title, show_btns, callback )
        {
            if ( msg )
            {
                $( PR.Modal.Container ).find( '#modal-body' ).html( msg );
            }

            if ( title )
            {
                $( PR.Modal.Container ).find( '#modal-title' ).html( title );
            }

            if ( show_btns )
            {
                $( PR.Modal.Container ).find( '#btns' ).css( "display", "block" );
            }
            else
            {
                $( PR.Modal.Container ).find( '#btns' ).css( "display", "none" );
            }

            $( PR.Modal.Container ).fadeIn( 'medium', function ()
            {
                PR.UI.DataCallBack(callback);
            } );

            $( '.modalContainer' ).center();
        },

        Close: function ()
        {
            $( ".announcement" ).slideUp( 1200 );
            $( PR.Modal.Container ).fadeOut( 500, function ()
            {
                if ( PR.Modal.MovedObj.length )
                {
                    PR.Modal.MovedObj.appendTo( PR.Modal.MovedObjSource );
                }

                $( PR.Modal.Container ).find( '#modal-body' ).html( '' );
                $( PR.Modal.Container ).find( '#modal-title' ).html( '' );
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
