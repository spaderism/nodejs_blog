/* eslint-disable */

var index = {
    SimpleMDE: undefined,
    SimpleMDEInitValue: undefined,
    attachFile: { files: [], fileVirtualPath:[], fileIndex: 0, fileCount: 0 },
    newPostBtn: $('#newPostBtn'),
    newPostModalClose: $('#newPostModal .close'),
    newPostModalForm: $('#newPostModal #newPostModalForm'),
    newPostModalFormSearchImageBtn: $('#newPostModalForm #searchImage'),
    newPostModalFormImageUtil: function(files) {
        if (index.attachFile.fileCount > 9) return false;

        var filesLen = files.length;

        for(var i = 0; i < filesLen; i++) {
            if (index.attachFile.fileCount > 9) continue;

            var imageFile = files[i];
            var imageFileName = imageFile.name;
            var imageRegex = /\.(jpeg|jpg|gif|png)$/i;

            if(imageFile.size <= 5242880 && imageRegex.test(imageFileName)) {
                if (index.attachFile.fileCount > 9) return;

                index.attachFile.files.push(imageFile);

                var reader = new FileReader();
                reader.readAsDataURL(imageFile);
                reader.onload = function(e) {
                    if (index.attachFile.fileCount > 9) return;

                    var yyyymmdd = new Date().toISOString().slice(0, 10).replace(/\-/g, '/');
                    var uuid = function() {
                        var d = new Date().getTime();
                        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                            var r = (d + Math.random() * 16) % 16 | 0;
                            d = Math.floor(d / 16);
                            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                        });
                        return uuid;
                    }();
                    var filetype = imageFileName.substring(imageFileName.lastIndexOf('.') + 1, imageFileName.length).toLowerCase();
                    var fileVirtualPath = '/upload/' + yyyymmdd + '/' + uuid + '.' + filetype;
                    index.attachFile.files.push(imageFile);

                    var imageThumbnail = e.target.result;

                    var attachFileThumbDiv = [];
                    attachFileThumbDiv.push('<div class="col-md-2 attach-file-thumb" id="attachFileThumb' + index.attachFile.fileIndex + '">');
                    attachFileThumbDiv.push('   <div class="thumbnail-wrapper">');
                    attachFileThumbDiv.push('       <div class="thumbnail" id="thumbnail' + index.attachFile.fileIndex + '">');
                    attachFileThumbDiv.push('           <div class="centered">');
                    attachFileThumbDiv.push('               <img src="' + imageThumbnail + '">');
                    attachFileThumbDiv.push('           </div>');
                    attachFileThumbDiv.push('           <div class="thumbnail-hover">');
                    attachFileThumbDiv.push('               <a id="deleteBoardFile">');
                    attachFileThumbDiv.push('                   <i class="fa fa-fw fa-close pull-right" id="deleteFileThumb' + index.attachFile.fileIndex + '" style="color: white;" ');
                    attachFileThumbDiv.push('                       attachFileThumbNo="' + index.attachFile.fileIndex + '" data-toggle="tooltip" data-original-title="Close"></i>');
                    attachFileThumbDiv.push('               </a>');
                    attachFileThumbDiv.push('               <div style="text-align:center; color: white; font-size: 12px; position:absolute; top: 10%;"><strong>VIRTUAL IMAGE PATH</strong><br><br>' + fileVirtualPath + '</div>');
                    attachFileThumbDiv.push('           </div>');
                    attachFileThumbDiv.push('       </div>');
                    attachFileThumbDiv.push('   </div>');
                    attachFileThumbDiv.push('</div>');

                    $('#newPostModal').on('mouseenter', '#thumbnail' + index.attachFile.fileIndex, function() {
                        var that = $(this).context.children[1];
                        $(that).css('opacity', '0.7');
                    }).on('mouseleave', '#thumbnail' + index.attachFile.fileIndex, function() {
                        var that = $(this).context.children[1];
                        $(that).css('opacity', '0');
                    });

                    $('#newPostModal').on('click', '#deleteFileThumb' + index.attachFile.fileIndex, function() {
                        var attachFileThumbNo = $(this).attr('attachFileThumbNo');
                        $('#newPostModal #attachFileThumb' + attachFileThumbNo).fadeOut(200, function() {
                            $(this).remove();
                        });
                        index.attachFile.files[attachFileThumbNo] = undefined;
                        index.attachFile.fileCount--;
                    });

                    $('#newPostModal #attachFileThumbDiv').append(attachFileThumbDiv.join('\n'));
                    imageFile.index = index.attachFile.fileIndex++;
                    index.attachFile.fileCount++;
                }
            }
        }
        return false;
    },
    newPostBtnClickEvent: function() {
        $(document).ready(function () {
            $('.btn-select').each(function (e) {
                var value = $(this).find('ul li.selected').html();
                if (value != undefined) {
                    $(this).find('.btn-select-input').val(value);
                    $(this).find('.btn-select-value').html(value);
                }
            });
        });

        $(document).on('click', '.btn-select', function (e) {
            e.preventDefault();
            var ul = $(this).find('ul');
            if ($(this).hasClass('active')) {
                if (ul.find('li').is(e.target)) {
                    var target = $(e.target);
                    target.addClass('selected').siblings().removeClass('selected');
                    var value = target.html();
                    $(this).find('.btn-select-input').val(value);
                    $(this).find('.btn-select-value').html(value);
                }
                ul.hide();
                $(this).removeClass('active');
            }
            else {
                $('.btn-select').not(this).each(function () {
                    $(this).removeClass('active').find('ul').hide();
                });
                ul.slideDown(200);
                $(this).addClass('active');
            }
        });

        $(document).on('click', function (e) {
            var target = $(e.target).closest('.btn-select');
            if (!target.length) {
                $('.btn-select').removeClass('active').find('ul').hide();
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
            element: $('#simpleMDE')[0],
            initialValue: index.SimpleMDEInitValue,
            toolbar: [
                'bold', 'italic', 'strikethrough', '|',
                'heading-1', 'heading-2', 'heading-3', '|',
                'code', 'quote', 'unordered-list', 'ordered-list', '|',
                'link', 'image', 'table', 'horizontal-rule', '|',
                'preview', 'side-by-side', 'fullscreen'
            ]
        });

        $('#newPostModalForm input[name=title]').val('');
        $('#newPostModalForm input#attachFiles').val('');
        $('#newPostModal #attachFiles').val('');
        $('#newPostModal #attachFileThumbDiv').html('');
        index.attachFile.files = [];
        index.attachFile.fileIndex = 0;
        index.attachFile.fileCount = 0;

        $('#newPostModal').fadeIn(500);

        return false;
    },
    newPostModalCloseBtnClickEvent: function() {
        var confirmStr  = 'Writed contents will be deleted.\nAre you sure wanna quit?';
        var confirmBool = confirm(confirmStr);

        if (confirmBool) {
            index.SimpleMDE.toTextArea();
            index.SimpleMDE = null;
            $('#newPostModal').fadeOut(0);
        }

        return false;
    },
    newPostModalFormSubmitEvent: function() {
        var title = $("#newPostModal #newPostModalForm input[name=title]");
        var masterKey = $("#newPostModal #newPostModalForm input[name=masterKey]");
        var content = index.SimpleMDE.value();
        var attachFiles = {};

        var formData = new FormData();
        Array.prototype.sort.call(index.attachFile.files);
        for (var i = 0; i < index.attachFile.fileCount; i++) {
            formData.append(i, index.attachFile.files[i]);
        }

        formData.append('title', title.val());
        formData.append('master_key', masterKey.val());
        formData.append('content', content);

        console.log(formData);

        $.ajax({
            url: '/api/board', data: formData, dataType: 'json',
            processData: false, contentType: false, type: 'post'
        })
        .done(function(data) {
            console.log(data);
            return false;
        })
        .fail(function(xhr) {
            alert(xhr.responseJSON.meta.message);
            masterKey.val('').focus();
            return false;
        });

        return false;
    },
    newPostModalFormSearchImageBtnClickEvent: function() {
        $('#newPostModalForm input#attachFiles').trigger('click');
        return false;
    },
    init: function() {
        var self = this;
        self.newPostBtn.on('click', self.newPostBtnClickEvent);
        self.newPostModalClose.on('click', self.newPostModalCloseBtnClickEvent);
        self.newPostModalForm.on('submit', self.newPostModalFormSubmitEvent);
        self.newPostModalFormSearchImageBtn.on('click', self.newPostModalFormSearchImageBtnClickEvent);

        $('#newPostModal #attachFiles').change(function(event) {
            event.preventDefault();
            event.stopPropagation();

            var files = event.target.files;
            imageUtil(files);

            $(this).val('');
            return false;
        });

        $('.file-drop').on('dragenter dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();

            $('#newPostModal .file-drag').css('opacity', '0.7');
        }).on('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();

            $('#newPostModal .file-drag').css('opacity', '0');

            var files = e.originalEvent.dataTransfer.files;
            index.newPostModalFormImageUtil(files);
        }).on('dragleave dragend', function(e) {
            e.preventDefault();
            e.stopPropagation();

            $('#newPostModal .file-drag').css('opacity', '0');
        });
    }
};

index.init();
