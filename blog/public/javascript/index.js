/* eslint-disable */

var index = {
    SimpleMDE: undefined,
    SimpleMDEInitValue: undefined,
    newPostBtn: $('#newPostBtn'),
    newPostModalClose: $('#newPostModal .close'),
    postSubmitBtn: $("#postSubmit"),
    newPostBtnClickEvent: function() {
        $(document).ready(function () {
            $(".btn-select").each(function (e) {
                var value = $(this).find("ul li.selected").html();
                if (value != undefined) {
                    $(this).find(".btn-select-input").val(value);
                    $(this).find(".btn-select-value").html(value);
                }
            });
        });

        $(document).on('click', '.btn-select', function (e) {
            e.preventDefault();
            var ul = $(this).find("ul");
            if ($(this).hasClass("active")) {
                if (ul.find("li").is(e.target)) {
                    var target = $(e.target);
                    target.addClass("selected").siblings().removeClass("selected");
                    var value = target.html();
                    $(this).find(".btn-select-input").val(value);
                    $(this).find(".btn-select-value").html(value);
                }
                ul.hide();
                $(this).removeClass("active");
            }
            else {
                $('.btn-select').not(this).each(function () {
                    $(this).removeClass("active").find("ul").hide();
                });
                ul.slideDown(200);
                $(this).addClass("active");
            }
        });

        $(document).on('click', function (e) {
            var target = $(e.target).closest(".btn-select");
            if (!target.length) {
                $(".btn-select").removeClass("active").find("ul").hide();
            }
        });

        var simplemdeInitValue = [];
        simplemdeInitValue.push('# Intro');
        simplemdeInitValue.push('Go ahead, play around with the editor! Be sure to check out **bold** and *italic* styling, or even [links](https://google.com). You can type the Markdown syntax, use the toolbar, or use shortcuts like `cmd-b` or `ctrl-b`.\n');
        simplemdeInitValue.push('## Lists');
        simplemdeInitValue.push('Unordered lists can be started using the toolbar or by typing `* `, `- `, or `+ `. Ordered lists can be started by typing `1. `.\n');
        simplemdeInitValue.push('#### Unordered');
        simplemdeInitValue.push('* Lists are a piece of cake');
        simplemdeInitValue.push('* They even auto continue as you type');
        simplemdeInitValue.push('* A double enter will end them');
        simplemdeInitValue.push('* Tabs and shift-tabs work too\n');
        simplemdeInitValue.push('#### Ordered');
        simplemdeInitValue.push('1. Numbered lists...');
        simplemdeInitValue.push('2. ...work too!\n');
        simplemdeInitValue.push('## What about images?');
        simplemdeInitValue.push('![Yes](https://i.imgur.com/sZlktY7.png)');

        index.SimpleMDEInitValue = simplemdeInitValue.join('\n');
        index.SimpleMDE = new SimpleMDE({
            autofocus: true,
            element: $("#simpleMDE")[0],
            initialValue: index.SimpleMDEInitValue,
            toolbar: [
                'bold', 'italic', 'strikethrough', '|',
                'heading-1', 'heading-2', 'heading-3', '|',
                'code', 'quote', 'unordered-list', 'ordered-list', '|',
                'link', 'image', 'table', 'horizontal-rule', '|',
                'preview', 'side-by-side', 'fullscreen'
            ]
        });

        $("#newPostModal").fadeIn(500);

        return false;
    },
    newPostModalCloseBtnClickEvent: function() {
        var confirmStr  = 'Writed contents will be deleted.\nAre you sure wanna quit?';
        var confirmBool = confirm(confirmStr);

        if (confirmBool) {
            index.SimpleMDE.toTextArea();
            index.SimpleMDE = null;
            $("#newPostModal").fadeOut(0);
        }

        return false;
    },
    postSubmitBtnClickEvent: function() {
        var markupStr = $('#summernote').summernote('code');
        alert(markupStr);
    },
    init: function() {
        var self = this;
        self.newPostBtn.on('click', self.newPostBtnClickEvent);
        self.newPostModalClose.on('click', self.newPostModalCloseBtnClickEvent);
        self.postSubmitBtn.on('click', self.postSubmitBtnClickEvent);
    }
};

index.init();
