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