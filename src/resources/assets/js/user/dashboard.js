$(document).ready(function () {
    showContentBasedOnHash()
    // $(document).bind("contextmenu", function (e) {
    //     e.preventDefault();
    // });
    // fetchAllNotes();
    var activeList = $('.active-list').length;
    var completeList = $('.complete-list').length;
    $('#active-notes-count').text(activeList);
    $('#complete-notes-count').text(completeList);
});
const inputRegex = /<|>/;

function fetchAllNotes(filter = { status: 0 }) {
    postAjaxRequest('user/note/list', 'POST', filter, function (response) {
        if (response.flag === 1) {
            const allNotes = response.data;
            if (filter.status == 0) {
                $('#active-notes-count').text(allNotes.total_records)
            } else {
                $('#complete-notes-count').text(allNotes.total_records)
            }
            $('#myTabContent').html(allNotes.views);
        } else {
            Toast(response.msg, 0, 3000)
        }
    })
}

function updateNotes(noteId, notesData = {}) {
    postAjaxRequest(`note/update/${noteId}`, 'POST', notesData, function (response) {
        if (response.flag === 1) {
            Toast(response.msg, response.flag, 3000);
        } else {
            Toast(response.msg, 0, 3000);
        }
    })
}


const updateURLHash = (hash) => {
    const newURL = window.location.pathname + '#' + hash;
    history.pushState({}, '', newURL);
};



$("#active-note-tab").click(function () {
    updateURLHash('active-tab')
    fetchAllNotes({ status: 0 });

})

$("#complete-note-tab").click(function () {
    updateURLHash('complete-tab')
    fetchAllNotes({ status: 1 });
})
const showContentBasedOnHash = () => {
    let hash = window.location.hash;
    if (hash == '#active-tab') {
        $('#active-note-tab').tab('show');
        fetchAllNotes({ status: 0 });

    } else if (hash == '#complete-tab') {
        $('#complete-note-tab').tab('show');
        fetchAllNotes({ status: 1 });
    }

};


$(document).on('click', '#submitNoteBtn', function () {
    const note = $('#exampleFormControlTextarea1');
    if ((note.val().trim() != '') && (!inputRegex.test(note.val()))) {
        $('#submitNoteBtn').prop('disabled', true)
        postAjaxRequest('note/save', 'POST', { notes: note.val() }, function (response) {
            Toast(response.msg, response.flag, 3000);
            if (response.flag === 1) {
                fetchAllNotes();
            }
            $('#submitNoteBtn').prop('disabled', false)
        })
    } else {
        note.val('')
    }
});

$(document).on('click', ".delete-note-btn", function (event) {
    const noteId = $(this).closest('li').data('id');
    postAjaxRequest(`note/delete/${noteId}`, 'DELETE', {}, function (response) {
        Toast(response.msg, response.flag, 3000);
        if (response.flag === 1) {
            fetchAllNotes({ status: 1 });
        }
    });
});

$(document).on('click', ".active-status", function (event) {
    const li = $(this).closest('li')
    const noteId = li.data('id');
    updateNotes(noteId, { status: 1 });
    setTimeout(() => {
        li.remove();
        $('#active-notes-count').text(parseInt($('#active-notes-count').text()) - 1);
        $('#complete-notes-count').text(parseInt($('#complete-notes-count').text()) + 1);
    }, 500);
});

$(document).on('click', ".complete-status", function (event) {
    const li = $(this).closest('li')
    const noteId = li.data('id');
    updateNotes(noteId, { status: 0 });
    setTimeout(() => {
        li.remove();
        $('#active-notes-count').text(parseInt($('#active-notes-count').text()) + 1);
        $('#complete-notes-count').text(parseInt($('#complete-notes-count').text()) - 1);
    }, 500);
});

// $(document).on('click',"#edit-note-btn", async function(event){
//     const li = $(this).closest('li')
//     const noteId = li.find('#note-id').val();
//     let selectedText = li.find('#note-text');
//     const text = $.trim(selectedText.text());
//     // updateNotes(noteId,{status: 0});
//     $('#editnoteTextarea').val(text);
//     $(document).off('click', "#save-note");

//     $(document).on('click',"#save-note", function(event){
//         const note = $("#editnoteTextarea");
//         if(note.val().trim() != ''){
//             updateNotes(noteId,{notes: note.val()});
//             selectedText.text(note.val());
//             note.val('')
//         }
//     });
// });

$(document).on('click', ".edit-note-btn", function (event) {
    const li = $(this).closest('li');
    let noteId = li.data('id');
    let selectedText = $('#note-text-' + noteId).text().trim();

    $('#notes-table li').each(function () {
        let id = $(this).data('id');
        // const text = $(this).text();
        const text = $('#note-text-' + id).text();

        $(this).removeClass('bg-white').removeClass('border').addClass('bg-light').html(`
        <input class="form-check-input m-0 active-status" type="checkbox" value="" id="active-status-${id}">
        <input class="form-check-input m-0 note-id" type="hidden" value="${id}" id="note-${id}">
        <p class="fs-14 m-0 w-100 note-text break-all wrap-anywhere" id="note-text-${id}">${text}</p>
        <div class="btn-grp-wrapper edit-note-btn">
            <button type="button" class="btn btn-outline edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button type="button" class="btn btn-outline d-none"><i class="fa-regular fa-floppy-disk"></i></button>
        </div>
        `);
    });

    // Replace the HTML content of the list item with an editable textarea and a "Save" button
    li.html(`
        <input class="form-check-input m-0" type="checkbox" value="" id="editCheckBox">
        <textarea class="w-100 fs-14 border-0 flex-grow-1" id="note-text-${noteId}" rows="2" placeholder="Enter a note">${selectedText}</textarea>
        <div class="btn-grp-wrapper" >
            <button type="button" class="btn btn-outline d-none"><i class="fa-solid fa-pen"></i></button>
            <button type="button" data-id="${noteId}" class="btn btn-outline flex-shrink-0" id="save-note"><i class="fa-regular fa-floppy-disk"></i></button>
        </div>
    `);
    li.removeClass('bg-light').addClass('bg-white').addClass('border');
});

$(document).on('click', "#save-note", function (event) {
    const li = $(this).closest('li');
    let noteId = li.data('id');
    const note = $("#note-text-" + noteId);
    if (note.val().trim() != '' && (!inputRegex.test(note.val()))) {
        if ($("#editCheckBox").is(':checked')) {
            updateNotes(noteId, { notes: note.val(), status: 1 });
            setTimeout(() => {
                li.remove();
                $('#active-notes-count').text(parseInt($('#active-notes-count').text()) - 1);
                $('#complete-notes-count').text(parseInt($('#complete-notes-count').text()) + 1);
            }, 500);
        } else {
            updateNotes(noteId, { notes: note.val() });
            li.removeClass('bg-white').removeClass('border').addClass('bg-light').html(`
            <input class="form-check-input m-0 active-status" type="checkbox" value="" id="active-status-${noteId}">
            <p class="fs-14 m-0 w-100 break-all wrap-anywhere" id="note-text-${noteId}">${note.val()}</p>
            <div class="btn-grp-wrapper edit-note-btn">
                <button type="button" class="btn btn-outline edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button type="button" class="btn btn-outline d-none"><i class="fa-regular fa-floppy-disk"></i></button>
            </div>
            `);
        }
    } else {
        const text = $('#note-text-' + noteId).text();
        li.removeClass('bg-white').removeClass('border').addClass('bg-light').html(`
            <input class="form-check-input m-0" type="checkbox" value="" id="active-status-${noteId}">
            <p class="fs-14 m-0 w-100 break-all wrap-anywhere" id="note-text-${noteId}">${text}</p>
            <div class="btn-grp-wrapper edit-note-btn">
                <button type="button" class="btn btn-outline edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button type="button" class="btn btn-outline d-none"><i class="fa-regular fa-floppy-disk"></i></button>
            </div>
        `);
    }
});