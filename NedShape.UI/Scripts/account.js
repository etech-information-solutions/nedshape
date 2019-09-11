function signUpEnable() {
    var modal = document.getElementById("myModal");
    var btn = document.getElementById("myBtn");
    var span = document.getElementsByClassName("close")[0];
    var checkBox = document.getElementById("IsAccpetedTC");
    var signUp = document.getElementById("signUp");
    


    // If the checkbox is checked, display the output text
    if (checkBox.checked == true) {
        document.getElementById("signUp").disabled = false;
        signUp.style.backgroundColor = "rgba(0, 158, 15,1)";
        signUp.style.display = "block-inline !important";

        // When the user clicks on the button, open the modal
        btn.onclick = function () {
            modal.style.display = "block";
        }

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

    } else {

        document.getElementById("signUp").disabled = true;
        signUp.style.backgroundColor = "rgba(0, 158, 15,0.1)";
    }

}


