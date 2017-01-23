$('#newPostBtn').on('click', function() {
    var initialValue = [];
    initialValue.push('# Intro');
    initialValue.push('Go ahead, play around with the editor! Be sure to check out **bold** and *italic* styling, or even [links](https://google.com). You can type the Markdown syntax, use the toolbar, or use shortcuts like `cmd-b` or `ctrl-b`.\n');
    initialValue.push('## Lists');
    initialValue.push('Unordered lists can be started using the toolbar or by typing `* `, `- `, or `+ `. Ordered lists can be started by typing `1. `.\n');
    initialValue.push('#### Unordered');
    initialValue.push('* Lists are a piece of cake');
    initialValue.push('* They even auto continue as you type');
    initialValue.push('* A double enter will end them');
    initialValue.push('* Tabs and shift-tabs work too\n');
    initialValue.push('#### Ordered');
    initialValue.push('1. Numbered lists...');
    initialValue.push('2. ...work too!\n');
    initialValue.push('## What about images?');
    initialValue.push('![Yes](https://i.imgur.com/sZlktY7.png)');

    var simplemde = new SimpleMDE({
        element: $("#simpleMDE")[0],
        initialValue: initialValue.join('\n'),
        toolbar: [
            'bold', 'italic', 'strikethrough', '|',
            'heading-1', 'heading-2', 'heading-3', '|',
            'code', 'quote', 'unordered-list', 'ordered-list', '|',
            'link', 'image', 'table', 'horizontal-rule', '|',
            'preview', 'guide'
        ]
    });

    $("#newPostDiv").fadeIn(500);

    return false;
});

$('#newPostDiv .close').on('click', function() {
    var confirmStr  = 'Writed contents will be deleted.\nAre you sure wanna quit?';
    var confirmBool = confirm(confirmStr);

    if (confirmBool) {
        $('#summernote').html('<p></p>').summernote('destroy');
        $("#newPostDiv").fadeOut(0);
    }

    return false;
});

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

$("#postSubmit").on('click', function (e) {
    var markupStr = $('#summernote').summernote('code');
    alert(markupStr);
});
