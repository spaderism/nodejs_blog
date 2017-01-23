var login = {
    signinForm: $('div.login-container #signin'),
    signupForm: $('div.signup-modal #signup'),
    showSignupBtn: $('div.login-container #signin #showSignupBtn'),
    closeSignupModalBtn: $('div.signup-modal span.close'),
    signinEvent: function () {
        var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        var email = login.signinForm.find('input[name=email]');

        if (!regex.test(email.val())) {
            alert('Check email address');
            email.select();
            return false;
        }

        $.post('login', login.signinForm.serialize())
            .done(function (data) {
                if (data.success) {
                    location.href = '/';
                } else {
                    alert(data.message);
                }
            }, 'json')
            .fail(function (xhr) {
                var html = [];
                html.push('<div class="ex-page-content bootstrap snippets">');
                html.push('<div class="container">');
                html.push('<div class="row">');
                html.push('<div class="col-sm-6">');
                html.push('<svg class="svg-box" width="380px" height="500px" viewBox="0 0 837 1045" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">');
                html.push('<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">');
                html.push('<path d="M353,9 L626.664028,170 L626.664028,487 L353,642 L79.3359724,487 L79.3359724,170 L353,9 Z" id="Polygon-1" stroke="#3bafda" stroke-width="6" sketch:type="MSShapeGroup"></path>');
                html.push('<path d="M78.5,529 L147,569.186414 L147,648.311216 L78.5,687 L10,648.311216 L10,569.186414 L78.5,529 Z" id="Polygon-2" stroke="#7266ba" stroke-width="6" sketch:type="MSShapeGroup"></path>');
                html.push('<path d="M773,186 L827,217.538705 L827,279.636651 L773,310 L719,279.636651 L719,217.538705 L773,186 Z" id="Polygon-3" stroke="#f76397" stroke-width="6" sketch:type="MSShapeGroup"></path>');
                html.push('<path d="M639,529 L773,607.846761 L773,763.091627 L639,839 L505,763.091627 L505,607.846761 L639,529 Z" id="Polygon-4" stroke="#00b19d" stroke-width="6" sketch:type="MSShapeGroup"></path>');
                html.push('<path d="M281,801 L383,861.025276 L383,979.21169 L281,1037 L179,979.21169 L179,861.025276 L281,801 Z" id="Polygon-5" stroke="#ffaa00" stroke-width="6" sketch:type="MSShapeGroup"></path>');
                html.push('</g>');
                html.push('</svg>');
                html.push('</div>');
                html.push('<div class="col-sm-6">');
                html.push('<div class="message-box">');
                html.push('<h1 class="m-b-0">' + xhr.status + '</h1>');
                html.push('<p>' + xhr.statusText + '</p>');
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    html.push('<p>' + xhr.responseJSON.message + '</p>');
                }
                html.push('<div class="buttons-con">');
                html.push('<div class="action-link-wrap">');
                html.push('<a href="admin" class="btn btn-custom btn-primary waves-effect waves-light m-t-20">Go to Login Page Again</a>');
                html.push('</div>');
                html.push('</div>');
                html.push('</div>');
                html.push('</div>');
                html.push('</div>');
                html.push('</div>');
                html.push('</div>');

                $('body').html(html.join(' ')).css({
                    'background': '#f5f5f5',
                    'margin': '50px',
                    'color': '#4c5667',
                    'overflow-x': 'hidden !important',
                    'padding-top': '40px'
                });
                $('.message-box h1').css({
                    'color': '#252932',
                    'font-size': '98px',
                    'font-weight': '700',
                    'line-height': '98px',
                    'text-shadow': 'rgba(61, 61, 61, 0.3) 1px 1px, rgba(61, 61, 61, 0.2) 2px 2px, rgba(61, 61, 61, 0.3) 3px 3px'
                });
            }, 'json');

        return false;
    },
    signupEvent: function() {
        var $signupForm = login.signupForm;
        var provider = $signupForm.find('#provider');
        var email = $signupForm.find('#email');
        var name = $signupForm.find('#name');
        var password = $signupForm.find('#password');
        var confirmPassword = $signupForm.find('#confirmPassword');
        var masterKey = $signupForm.find('#masterKey');

        // 이메일 유효성 검사
        var emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        if (!emailRegex.test(email.val())) {
            alert("Check email address");
            email.focus().select();
            return false;
        }

        // 이름 유효성 검사
        if (name.val().indexOf(" ") >= 0) {
            alert("Cannot include null with namespace");
            name.focus().select();
            return false;
        }

        var nameLen = name.val().length;
        for (var i = 0; i < nameLen; i++) {
            var ch = name.val().charAt(i);
            if (ch >= '0' && ch <= '9') {
                alert("Cannot include number character with namespace");
                name.focus().select();
                return false;
            }
        }

        // 패스워드 유효성 검사
        if (provider.val() === 'local' && password.val() !== confirmPassword.val()) {
            alert("Passwords are not same");
            password.val("").focus();
            confirmPassword.val("");
            return false;
        }

        // formData
        var formData = {
            provider: provider.val(),
            email: email.val(),
            name: name.val(),
            master_key: masterKey.val()
        };

        if (provider.val() === 'local') {
            formData.password = password.val();
            formData.confirmPassword = confirmPassword.val();
        }

        $.post('/signup', formData)
            .done(function(data) {
                console.log(data);
            }, 'json')
            .fail(function(xhr) {
                console.log(xhr);
                xhr.responseJSON.message;
            }, 'json');

        //$.post("/member/add", $("#signup").serialize(), function(data) {
        //    if(data.err) {
        //        var errMsg = data.errMsg;
        //        if(errMsg == "ERR_PASS") {
        //            alert("Passwords are not same");
        //            $mpwd.val("").focus();
        //            $mpwdConfirm.val("");
        //        } else if(errMsg == "ERR_NAME") {
        //            alert("Cannot include null with namespace");
        //            $mname.focus().select();
        //        } else {
        //            alert("Check email address");
        //            $memail.focus().select();
        //        }
        //    } else {
        //        alert("Complete registration");
        //        location.href = "/";
        //    }
        //}, "json").fail(function(e) {
        //    alert("Fail registration");
        //    $mid.val("").focus();
        //    $mname.val("");
        //    $mpwd.val("");
        //    $mpwdConfirm.val("");
        //    $memail.val("");
        //});

        return false;
    },
    showSignupEvent: function() {
        $('div.signup-modal').fadeIn('fast');
        return false;
    },
    closeSignupModalEvent: function() {
        $('div.signup-modal').fadeOut('fast');
        return false;
    },
    init: function () {
        var self = this;
        self.signinForm.submit(self.signinEvent);
        self.signupForm.submit(self.signupEvent);
        self.showSignupBtn.on('click', self.showSignupEvent);
        self.closeSignupModalBtn.on('click', self.closeSignupModalEvent);
    }
};

login.init();
