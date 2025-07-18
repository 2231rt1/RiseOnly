const HTML = `<!DOCTYPE html>
<html>

<head>
    <title>editor</title>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="user-scalable=1.0,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">
    <style>
        * {
            outline: 0px solid transparent;
            -webkit-tap-highlight-color: #000000;
            -webkit-touch-callout: none;
            -webkit-overflow-scrolling: touch;
        }

        html,
        body {
            flex: 1;
            outline: 0;
            padding: 0;
            margin: 0;
            font-family: Arial, sans-serif;
            font-size: 16px;
            color: #000000;
        }

        p {
            margin: 0 0 16px 0;
        }

        li {
            margin-bottom: 16px;
        }

        .editors,
        .content-editor,
        .textarea-editor {
            outline: 0;
            padding: 0;
            margin: 0;
            width: 100%;
            border: none;
            background: transparent;
            font-family: inherit;
            font-size: inherit;
            color: inherit;
        }

        .content-editor[contenteditable] {
            -webkit-user-select: text;
            user-select: text;
        }

        .textarea-editor {
            resize: none;
            overflow: auto;
        }

        .disabled-select {
            -webkit-user-select: none !important;
            user-select: none !important;
        }
    </style>
</head>

<body>
    <div class="editors"></div>
    <script>
        (function () {
            var isCode = true;
            var contentEditor = null;
            var textareaEditor = null;
            var isWebView = window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function';
            var height = 0;
            var timeoutHtml = null;
            var selection = document.getSelection();
            var linkColor = 'blue';

            function debounceHtml(func, wait) {
                clearTimeout(timeoutHtml);
                timeoutHtml = setTimeout(function () {
                    timeoutHtml = null;
                    func();
                }, wait);
            };

            function exec(command, value) {
                return document.execCommand(command, false, value);
            };

            function sendAction(type, data) {
                if (isWebView) {
                    var message = JSON.stringify({ type, data });
                    window.ReactNativeWebView.postMessage(message);
                }
            };

            function log(message) {
                if (isWebView) {
                    sendAction('log', message);
                } else {
                    console.log(message);
                }
            };

            var Actions = {
                changeHtml: function () {
                    debounceHtml(function () {
                        sendAction('changeHtml', contentEditor.innerHTML);
                    }, 1000);
                },
                changeHeight: function () {
                    setTimeout(function () {
                        var newHeight = 0;
                        if (isCode) {
                            textareaEditor.style.height = '';
                            textareaEditor.style.height = textareaEditor.scrollHeight + 'px';
                            newHeight = textareaEditor.scrollHeight;
                        } else {
                            newHeight = Math.ceil(contentEditor.getBoundingClientRect().height);
                        }
                        log(newHeight);
                        if (height !== newHeight) {
                            height = newHeight;
                            sendAction('changeHeight', newHeight);
                        }
                    }, 500);
                },
                onClickLink: function (href) {
                    sendAction('onClickLink', href);
                },
                focus: function () {
                    sendAction('onFocus');
                },
                blur: function () {
                    sendAction('onBlur');
                },
                setHtml: function (newHtml) {
                    if (contentEditor.innerHTML !== newHtml) {
                        var savedSelection = [selection.focusNode, selection.focusOffset];
                        contentEditor.innerHTML = newHtml;
                        textareaEditor.value = newHtml;
                        selection.collapse(savedSelection[0], savedSelection[1]);
                        Actions.changeHeight();
                        Actions.setLinkColor(linkColor);
                    }
                },
                setColor: function (color) {
                    document.body.style.color = color;
                    Actions.changeHeight();
                },
                setFontFamily: function (fontFamily) {
                    var [capitalizeFontFamily, weightWithText, fontStyle] = fontFamily.split('_', 3);
                    var familyNames = capitalizeFontFamily.split(/(?=[A-Z])/);
                    var weight = weightWithText ? weightWithText.match(/[0-9]+/g)[0] : 400;
                    var styleLink = document.getElementById('google-font');
                    if (!styleLink) {
                        styleLink = document.createElement('link');
                        styleLink.id = 'google-font';
                        styleLink.rel = 'stylesheet';
                        document.head.appendChild(styleLink);
                    }
                    styleLink.href = 'https://fonts.googleapis.com/css?family=' + familyNames.join('+') + ':' + weight + '&subset=latin-ext&display=swap';
                    document.body.style.fontFamily = familyNames.join(' ');
                    document.body.style.fontWeight = weight;
                    document.body.style.fontStyle = fontStyle ? fontStyle.toLowerCase() : 'normal';
                    Actions.changeHeight();
                },
                setFontSize: function (fontSize) {
                    document.body.style.fontSize = (fontSize || 16) + 'px';
                    Actions.changeHeight();
                },
                setLinkColor: function (opt_color) {
                    if (opt_color) {
                        linkColor = opt_color;
                    }
                    var onClick = function (e) {
                        e.preventDefault();
                        var href = e.currentTarget.getAttribute('href');
                        log(href);
                        Actions.onClickLink(href);
                    };
                    var links = document.getElementsByTagName('a');
                    for (var i = 0; i < links.length; i++) {
                        var link = links[i];
                        link.style.color = linkColor;
                        link.onclick = onClick;
                    }
                },
                setSelectionColor: function (opt_color) {
                    if (opt_color) {
                        textareaEditor.style.caretColor = opt_color;
                        contentEditor.style.caretColor = opt_color;
                    }
                },
                setDisabled: function (disabled) {
                    contentEditor.contentEditable = !disabled;
                    textareaEditor.disabled = disabled;
                    if (disabled) {
                        document.body.classList.add('disabled-select');
                    } else {
                        document.body.classList.remove('disabled-select');
                    }
                },
                setAutoFocus: function (autoFocus) {
                    contentEditor.autofocus = autoFocus;
                    if (autoFocus) {
                        contentEditor.focus();
                    }
                },
                undo: function () {
                    exec('undo');
                },
                redo: function () {
                    exec('redo');
                },
                bold: function () {
                    exec('bold');
                },
                italic: function () {
                    exec('italic');
                },
                underline: function () {
                    exec('underline');
                },
                orderedList: function () {
                    exec('insertOrderedList');
                },
                unorderedList: function () {
                    exec('insertUnorderedList');
                },
                clear: function () {
                    exec('removeFormat');
                },
                code: function () {
                    isCode = !isCode;
                    if (isCode) {
                        contentEditor.style.display = 'none';
                        textareaEditor.style.display = 'block';
                    } else {
                        contentEditor.style.display = 'block';
                        textareaEditor.style.display = 'none';
                    }
                    Actions.changeHeight();
                }
            };

            var init = function (element) {
                var textarea = document.createElement('textarea');
                textarea.className = 'textarea-editor';
                textarea.addEventListener('input', () => {
                    content.innerHTML = textarea.value;
                }, false);
                textarea.addEventListener('focus', () => {
                    Actions.focus();
                }, false);
                textarea.addEventListener('blur', () => {
                    Actions.blur();
                }, false);
                element.appendChild(textarea);

                var content = document.createElement('div');
                content.contentEditable = true;
                content.spellcheck = false;
                content.autocapitalize = 'off';
                content.autocorrect = 'off';
                content.autocomplete = 'off';
                content.className = 'content-editor';
                content.addEventListener('input', () => {
                    textarea.value = content.innerHTML;
                    Actions.changeHtml();
                    Actions.changeHeight();
                }, false);
                content.addEventListener('focus', () => {
                    Actions.focus();
                }, false);
                content.addEventListener('blur', () => {
                    Actions.blur();
                }, false);
                element.appendChild(content);

                exec('defaultParagraphSeparator', 'p');

                var onMessage = function (event) {
                    var message = JSON.parse(event.data);
                    var action = Actions[message.type];
                    log(message);
                    if (action) {
                        action(message.data);
                    }
                };

                window.addEventListener('message', onMessage, false);
                document.addEventListener('message', onMessage, false);
                document.addEventListener('touchend', function () {
                    content.focus();
                });

                return [content, textarea];
            };

            var [contentEditorNode, textareaEditorNode] = init(document.getElementsByClassName('editors')[0]);
            contentEditor = contentEditorNode;
            textareaEditor = textareaEditorNode;

            Actions.code();
            Actions.changeHeight();
            log('initialized');
            if (!isWebView) {
                Actions.setColor('grey');
                Actions.setFontSize('20');
                Actions.setFontFamily('Roboto');
                Actions.setLinkColor('green');

                var sampleHtml = '<p><i><u>Underline italic text</u></i> <b>bold word</b> normal text with some characters <i>Italic word</i> another normal text <u>underline word</u> and email link <a href="mailto:siposdani87@gmail.com">mailto</a> and standar link <a href="https://google.com" target="_blank"><b>link to website</b></a> and link to <a href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" target="_blank">download file</a>.</p>';
                Actions.setHtml(sampleHtml);
            }
        })();
    </script>
</body>

</html>`

export default HTML