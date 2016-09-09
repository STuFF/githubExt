function getExtFromPath(path) {
    return path.substr((~-path.lastIndexOf('.') >>> 0) + 2);
}

var _files = null;
function getAllFiles() {
    if (_files) {
        return _files;
    } else {
        var files = [];
        $('.file-header').each(function (n, header) {
            var $header = $(header);
            var path = $header.data('path');
            var e = getExtFromPath(path);

            $header.data('ext', e);
            files.push(path);
        });

        _files = files;
    }
    return _files;
}

function getAllExtensions() {
    var files = getAllFiles(),
        ext = {};

    files.forEach(function (file) {
        var e = getExtFromPath(file);
        if (!ext[e]) {
            ext[e] = 1;
        } else {
            ext[e]++;
        }
    });

    return ext;
}

function getSelectedExt() {
    var ext = [];

    $('#extensions a.selected').each(function (n, a) {
        ext.push($(a).data('ext'));
    });

    return ext;
}

function createExtButtons() {
    var buttonsConfig = getAllExtensions(),
        ext = Object.keys(buttonsConfig).sort(),
        $buttons,
        html = '';

    html += '<div class=""><div id="extensions" class="btn-group">';

    ext.forEach(function (e) {
        var ee = e;
        if (!ee) {
            ee = 'none';
        } else {
            ee = '.' + ee;
        }
        html += `<a data-ext='${e}' class='btn btn-sm  js-ext-filter  selected' href='#'>${ee} (${buttonsConfig[e]})</a>`;
    });

    html += '</div></div>';

    $('#extensions').remove();

    $buttons = $(html).insertAfter($('.pr-toolbar').first());

    $buttons
        .on('click', '.js-ext-filter', function (e) {
            e.preventDefault();
            $(this).toggleClass('selected');
            filterFiles(getSelectedExt());
        })
        .css('margin-bottom', '20px');
}

function filterFiles(fileTypes) {
    $('.file-header').each(function (n, header) {
        var $header = $(header),
            ext = $header.data('ext');

        $header.parent('.file').toggle(fileTypes.indexOf(ext) !== -1);

    });
}

function check_ui_is_ready() {
    if ($('#files').length === 0) {
        wait_a_bit();
    } else {
        activateExtUi();
    }
}

function wait_a_bit() {
    setTimeout(function () {
        check_ui_is_ready();
    }, 100);
}

function activateExtUi() {
    createExtButtons();
    filterFiles(getSelectedExt());
}

check_ui_is_ready();
