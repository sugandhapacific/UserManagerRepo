describe("ajaxWrapper", function () {
    var ajax;

    beforeEach(function () {
        ajax = new ajaxWrapper();
    });    

    describe("send", function () {
        var parameters = "firstName=Sugandha&lastName=Singh&email=sugs@microsoft.com&phone=9898989898";
        it("should add user and return true", function () {
            ajax.send('/User', parameters, 'POST', function (responseText) {
                expect(responseText).to.be("True");
            });
        });
    });

    describe("send", function () {
        it("should update user and return true", function () {
            var UserData = {};
            ajax.send('/User', null, 'GET', function (responseText) {
                UserData = JSON.parse(responseText);
                if (UserData) {
                    var parameters = "UserId=" + UserData[0].UserID + "&firstName=" + UserData[0].FirstName + "&lastName=" + UserData[0].LastName +
           "&email=" + UserData[0].Email + "&phone=" + UserData[0].Phone + "&status=" + UserData[0].Status;
                    ajax.send('/User', parameters, 'PUT', function (responseText) {
                        expect(responseText).to.be("True");
                    });
                }               
            });
        });
    });

    describe("send", function () {
        it("should update user and return true", function () {
            var UserData = {};
            ajax.send('/User', null, 'GET', function (responseText) {
                UserData = JSON.parse(responseText);
                if (UserData) {
                    var parameters = "UserId=" + UserData[0].UserID + "&firstName=" + UserData[0].FirstName + "&lastName=" + UserData[0].LastName +
          "&email=" + UserData[0].Email + "&phone=" + UserData[0].Phone + "&status=" + UserData[0].Status;
                    ajax.send('/User', parameters, 'PUT', function (responseText) {
                        expect(responseText).to.be("True");
                    });
                }
               
            });
        });
    });

    describe("send", function () {
        it("should delete user and return true", function () {           
            ajax.send('/User', null, 'GET', function (responseText) {
                UserData = JSON.parse(responseText);
                expect(UserData.Length).to.not.equal("0");
            });
        });
    });



});
