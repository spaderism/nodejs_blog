var login = {
    signinForm: $('div.login-container #signin'),
    signupForm: $('div.signup-modal #signup'),
    showSignupBtn: $('div.login-container #signin #showSignupBtn'),
    closeSignupModalBtn: $('div.signup-modal span.close'),
    signinEvent: function () {
        var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        var email = login.signinForm.find('input[name=email]');
        var password = login.signinForm.find('input[name=password]');

        if (!regex.test(email.val())) {
            alert('Check email address');
            email.select();
            return false;
        }

        $.post('/login', login.signinForm.serialize())
            .done(function (data) {
                if (data.meta.code === 200 && data.meta.message === 'SUCCESS') {
                    alert(data.meta.message);
                    location.href = '/';
                }
            }, 'json')
            .fail(function (xhr) {
                alert(xhr.responseJSON.meta.message);
                email.val('');
                password.val('');
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
            alert('Check email address');
            email.focus().select();
            return false;
        }

        // 이름 유효성 검사
        if (name.val().indexOf(' ') >= 0) {
            alert('Cannot include null with namespace');
            name.focus().select();
            return false;
        }

        var nameLen = name.val().length;
        for (var i = 0; i < nameLen; i++) {
            var ch = name.val().charAt(i);
            if (ch >= '0' && ch <= '9') {
                alert('Cannot include number character with namespace');
                name.focus().select();
                return false;
            }
        }

        // 패스워드 유효성 검사
        if (provider.val() === 'local' && password.val() !== confirmPassword.val()) {
            alert('Passwords are not same');
            password.val('').focus();
            confirmPassword.val('');
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
                if (data.meta.code === 200 && data.meta.message === 'SUCCESS') {
                    alert(data.meta.message);
                    location.href = '/login';
                }
            }, 'json')
            .fail(function(xhr) {
                alert(xhr.responseJSON.meta.message);
                email.val('');
                name.val('');
                if (provider.val() === 'local') {
                    password.val('');
                    confirmPassword.val('');
                }
                masterKey.val('');
            }, 'json');

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
