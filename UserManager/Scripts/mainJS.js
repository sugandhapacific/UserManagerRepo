
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



