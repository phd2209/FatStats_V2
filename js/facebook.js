// Wrap FB.api with a Deferred
fbWrapper = {

    api: function(url) {
        var deferred = $.Deferred();
        try {
            console.log('calling fb api');
            FB.api(url, function (response) {
                deferred.resolve(response);
            });
        } catch (e) {
            deferred.fail();
        }
        return deferred;
    },

    batch: function (url, num) {
        var deferred = $.Deferred();
        try {
            console.log('calling fb api in batch');
            for (i = 0; i < num ; i++) {
                FB.api(url, function (response) {

                    //Count down fetches
                    fetches--;

                    var body = JSON.parse(response[0].body);

                    $.each(body.data, function (i, user) {
                        var fbuser = new Object();
                        fbuser.id = user.id;
                        fbuser.name = user.name;
                        fbuser.country = user.locale;
                        fbuser.sex = user.gender;
                        userCollection.push(fbuser);
                    });

                    body = JSON.parse(response[1].body);

                    $.each(body, function (id, user) {
                        for (var i = 0; i < userCollection.length; i++) {
                            if (id === userCollection[i].id) {
                                userCollection[i].likes = user.data;
                                userCollection[i].likescount = user.data.length;
                                break;
                            }
                        }
                    });

                    if (fetches === 0) { deferred.resolve(response) };
                });
            }
        } catch (e) {
            deferred.fail();
        }
        return deferred;
    }
}