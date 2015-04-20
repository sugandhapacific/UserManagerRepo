/* @name mainSections 
  * @description module to hide or show the divs
    based on the required conditions
  * @returns mainSections 
  */


var mainSections = (function () {

    //@constructor 
    function mainSections() {
        this.table = document.getElementById("displayUserList");
        this.userForm = document.getElementById("addUser");
        this.options = document.getElementById("options");
        this.errorPara = document.getElementsByClassName("errorPara");
        this.addUsrBtn = document.querySelector('#mainOptions > input[value="Add User"]');
        this.showUsrBtn = document.querySelector('#mainOptions > input[value="User List"]');
        this.nav = document.getElementById("mainOptions");
        this.welcome = document.getElementById("welcomeDiv");
        this.home = document.querySelector('#mainOptions > input[value="Home"]')
    };

    //@menthod for hiding all divs except welcome div
    mainSections.prototype.hideAll = function () {
        this.toggleDisplay("none", "none", "none", "block", "none", "none", "none");
        this.hideError();
    };

    //@method hiding form validation error messages
    mainSections.prototype.hideError = function () {
        var i;
        for (i = 0; i < this.errorPara.length; i++) {
            this.errorPara[i].style.display = "none";
        }
    };

    //@method wrapper function to hide or show divs based on parameters passed
    mainSections.prototype.toggleDisplay = function (form, option, navbar, welcome, table, addBtn, showBtn) {

        this.userForm.style.display = form;
        this.options.style.display = option;
        this.nav.style.display = navbar;
        this.welcome.style.display = welcome;
        this.table.style.display = table;
        this.showUsrBtn.style.display = showBtn;
        this.addUsrBtn.style.display = addBtn;
    };

    return mainSections;

})();
/* @name userElements 
  * @description module to hide or show the divs
    based on the required conditions
  * @returns userElements 
  */

var userElements = (function () {

    //@constructor
    function userElements() {
        this.userId = document.getElementById("userId");
        this.firstName = document.getElementById("fName");
        this.lastName = document.getElementById("lName");
        this.email = document.getElementById("email");
        this.phone = document.getElementById("phone");
    };

    //@method to get the user data
    userElements.prototype.getUser = function () {

        document.documentElement.style.cursor = "progress";
        document.querySelector('#welcomeDiv > input[value="User List"]').style.cursor = "progress";
        document.body.appendChild(sections.options);

        //ajax request
        ajax.send('/User', null, 'GET', function (responseText) {

            //parsing response data
            var UserData = JSON.parse(responseText);

            //getting the Template for handlebars
            var Source = document.getElementById("Handlebars-Template").textContent;

            //compiling the actual Template file
            var Template = Handlebars.compile(Source);

            //generating some HTML code from the compiled Template
            var HTML = Template({ Users: UserData });

            //changing the body of data user div
            sections.table.innerHTML = HTML;

            //adding disabled class for all inactive users
            var rows = document.getElementById("UserData").getElementsByTagName("tr");
            for (var i = 1; i < rows.length; i++) {
                var cell = rows[i].getElementsByTagName("td")[5];
                if (cell.firstChild.innerHTML.indexOf('Inactive') > -1) {
                    cell.parentNode.classList.add("disabled");
                }
            }


            sections.toggleDisplay("none", "none", "block", "none", "block", "block", "none");
            document.documentElement.style.cursor = "default";
            document.querySelector('#welcomeDiv > input[value="User List"]').style.cursor = "default";
        });
    };


    //@method to add user 
    userElements.prototype.addUser = function () {
        
        //user data parameter
        var parameters = "firstName=" + this.firstName.value + "&lastName=" + this.lastName.value + "&email=" + this.email.value + "&phone=" + this.phone.value;

        ajax.send('/User', parameters, 'POST', function (responseText) {
            if (responseText) {

                //binding this object to user
                var bound = user.resetUser.bind(user);
                bound();
                alert("User Added");
                bound = user.getUser.bind(user);
                bound();
            }
        });
    };

    //@method to update the edit form for updating user info
    userElements.prototype.updateUser = function () {
        sections.toggleDisplay("block", "none", "block", "none", "none", "none", "block");

        //populating the form from clicked row cells
        if (selectedRow) {
            this.userId.value = selectedRow.cells[0].innerHTML;
            this.firstName.value = selectedRow.cells[1].firstChild.innerHTML;
            this.lastName.value = selectedRow.cells[2].firstChild.innerHTML;
            this.email.value = selectedRow.cells[3].firstChild.innerHTML;
            this.phone.value = selectedRow.cells[4].firstChild.innerHTML;
        }
    };

    //@method to make ajax call for updating in the database with flag parameter specifying if its an update or add call
    userElements.prototype.updateSubmit = function (flag) {
        document.body.appendChild(sections.options);

        //update call
        if (flag && selectedRow) {
            var parameters = "UserId=" + selectedRow.cells[0].innerHTML +
                "&firstName=" + selectedRow.cells[1].firstChild.innerHTML +
                "&lastName=" + selectedRow.cells[2].firstChild.innerHTML +
                "&email=" + selectedRow.cells[3].firstChild.innerHTML +
                "&phone=" + selectedRow.cells[4].firstChild.innerHTML +
                "&status=" + selectedRow.cells[5].firstChild.innerHTML;
        }
        //add call
        else {
            var parameters = "UserId=" + this.userId.value + "&firstName=" + this.firstName.value + "&lastName=" + this.lastName.value + "&email=" + this.email.value + "&phone=" + this.phone.value + "&status=Active";
        }

        ajax.send('/User', parameters, 'PUT', function (responseText) {
            if (responseText) {
                if (!flag) {

                    //binding this object to user
                    var bound = user.resetUser.bind(user);
                    bound();
                    alert("User Updated");
                }
                bound = user.getUser.bind(user);
                bound();

            }
        });
    };

    //@method to delete user
    userElements.prototype.deleteUser = function () {

        //sending user Id of selected row as parameter for deleting in the databse
        var parameters = "UserId=" + selectedRow.cells[0].innerHTML;
        ajax.send('/User', parameters, 'DELETE', function (responseText) {
            if (responseText) {
                if (row) {
                    document.body.appendChild(sections.options);
                    document.getElementById("UserData").deleteRow(selectedRow.cells[0].parentNode.rowIndex);
                }

                sections.toggleDisplay("none", "none", "block", "none", "block", "block", "none");
                alert("User Deleted");
            }
        });
    };


    //@method to change status of user to inactive
    userElements.prototype.deactivate = function () {
        selectedRow.cells[0].parentNode.classList.add('disabled');
        selectedRow.cells[5].firstChild.innerHTML = "Inactive";

        //calling update submit method to update in the databse
        this.updateSubmit(true);

    };

    //@method to sort the rows based on first name
    userElements.prototype.sort = function () {

        //if header cell is clicked
        var heading = document.getElementsByTagName("thead")[0].getElementsByTagName("th")[1];

        var table = document.getElementById("UserData").getElementsByTagName("tbody")[0];

        // reading table rows
        var rowData = table.getElementsByTagName('tr');

        for (var i = 0; i < rowData.length - 1; i++) {
            for (var j = i + 1; j < rowData.length; j++) {

                //swapping row nodes if sort condition matches
                if (rowData[i].cells[1].firstChild.innerHTML.toLowerCase() > rowData[j].cells[1].firstChild.innerHTML.toLowerCase() &&
                    heading.getElementsByTagName('span')[0].innerHTML.indexOf('  ▲') < 0) {
                    table.insertBefore(rowData[j], rowData[i]);
                }
                else if (rowData[i].cells[1].firstChild.innerHTML.toLowerCase() < rowData[j].cells[1].firstChild.innerHTML.toLowerCase() &&
                    heading.getElementsByTagName('span')[0].innerHTML.indexOf('  ▲') > -1) {
                    table.insertBefore(rowData[j], rowData[i]);
                }

            }
        }

        //changing the ascending /descending icon
        if (heading.getElementsByTagName('span')[0].innerHTML.indexOf('  ▲') < 0) {
            heading.getElementsByTagName('span')[0].innerHTML = "  &#9650;"
        }
        else {
            heading.getElementsByTagName('span')[0].innerHTML = "  &#9660;"
        }
    };

    //@method to reset add/modify form
    userElements.prototype.resetUser = function () {

        this.userId.value = null;
        this.firstName.value = null;
        this.lastName.value = null;
        this.email.value = null;
        this.phone.value = null;
        sections.toggleDisplay("block", "none", "block", "none", "none", "none", "block");
    };

    //@method for form validation
    userElements.prototype.formValidation = function () {
        //hiding error messages at the start
        sections.hideError();

        //flag is true if any field is not correct
        var flag = false;

        //first name cannot be empty and contains alphabets
        if (!this.firstName.value.match(/^[A-Za-z]+$/)) {
            this.firstName.nextElementSibling.style.display = "inline";
            flag = true;
        }


        if (this.lastName.value != "" && !this.lastName.value.match(/^[A-Za-z]+$/)) {
            this.lastName.nextElementSibling.style.display = "inline";
            flag = true;
        }

        if (this.email.value != "" && (this.email.value.split("@").length != 2 || this.email.value.split(".").length <= 1)) {
            this.email.nextElementSibling.style.display = "inline";
            flag = true;
        }

        if (this.phone.value != "" && !this.phone.value.match(/^[0-9]{10}$/)) {
            this.phone.nextElementSibling.style.display = "inline";
            flag = true;
        }


        if (!flag) {

            //user Id will be non empty in case of modify form
            if (this.userId.value == "") {
                this.addUser();
            }
            else {
                this.updateSubmit(false);
            }
        }
    };

    return userElements;
})();
/* @name ajaxWrapper 
  * @description Wrapper for ajax calls for 
        fetching/insertin/deleting  and updating
        the data in the sql database
  * @returns ajaxWrapper 
  */
var ajaxWrapper = (function () {
    function ajaxWrapper() { };

    ajaxWrapper.prototype.send = function (url, data, method, callback) {
        var x = new XMLHttpRequest();

        if (url !== undefined) {
            var seperator = url.indexOf('?') > 0 ? "&":"?";
            url += seperator + "random=" + new Date().getTime();
        }

        x.open(method, url, true);
        x.onreadystatechange = function () {
            if (x.readyState == 4 && x.status == 200) {
                callback(x.responseText)
            }
        };

        if (method == 'POST' || method == 'PUT' || method == 'DELETE') {
            x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        x.send(data)
    };
    return ajaxWrapper;
})();

//object for tracking the clicked row for context menu options
var selectedRow = {};

//object for keeping a track of all div sections of the site
var sections = new mainSections();

//user object for tracking user data
var user = new userElements();

// ajax object
var ajax = new ajaxWrapper();

/* @name row 
  * @description for retaining the selected row
  @parameter cells is the <td> elements of the clicked row 
 */
function row(cells) {
    this.cells = cells
};


//window onload event
window.addEventListener('load', function () {

    //hide all sections except welcome section
    sections.hideAll();

    //capturing click event for option selected in context menu
    sections.options.addEventListener('click', function (e) {
        e = e || window.event;
        var target = e.srcElement || e.target;
        if (target.nodeName == "LI") {

            //redirect to function depending on option selected
            switch (target.innerHTML) {
                case "Edit":
                    user.updateUser();
                    break;
                case "Delete":
                    if (confirm("Press OK to delete user : "+selectedRow.cells[1].firstChild.innerHTML+" permanently") == true) {
                        user.deleteUser();
                    }
                    break;
                case "Sort":
                    user.sort();
                    break;
                case "Deactivate":
                    user.deactivate();
                    break;
                default:
                    break;

            }
            //hiding the context menu
            sections.options.style.display = "none";
        }
    });

    //capturing context menu event 
    sections.table.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        e = e || window.event;
        var target = e.srcElement || e.target;
        if (target.nodeName == "SPAN" || target.nodeName == "TD") {
            target = target.nodeName == "SPAN" ? target.parentNode : target;

            //appending the context menu on the clicked cell
            target.appendChild(sections.options);
            var temprow = target;

            //fetching the clicked row
            while (temprow && temprow.nodeName !== "TR") {
                temprow = temprow.parentNode;
            }

            //initializing the selected row object and passing its cells
            selectedRow = new row(temprow.getElementsByTagName("td"));

            //hiding the context menu for disabled rows
            if (temprow.className.indexOf('disabled') < 0) {
                sections.options.style.display = "block";
            }
            else {
                sections.options.style.display = "none";
            }
        }

    });

    //dismissing the context menu on left click outside
    sections.table.addEventListener('click', function () {
        sections.options.style.display = "none";
    })

});



