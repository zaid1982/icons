function ModalConfirmDelete(type) {

    if (typeof type === 'undefined' || type == '') {
        toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
        return false;
    }

    let mcdType = type;
    let mcdCallFrom;
    let mcdId;
    let mcdRowRefresh;

    this.init = function () {
        $('#btnMcdSubmit').on('click', function () {
            if (mcdType === 'problem_type') {
                problemTypeClass.delete(mcdCallFrom, mcdId, mcdRowRefresh);
            } else {
                toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            }
            $('#modal_confirm_delete').modal('hide');
        });
    };

    this.delete = function (callFrom, id, rowRefresh) {
        if (typeof callFrom === 'undefined' || callFrom === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof id === 'undefined' || id === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        if (typeof rowRefresh === 'undefined' || rowRefresh === '') {
            toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            return false;
        }
        mcdCallFrom = callFrom;
        mcdId = id;
        mcdRowRefresh = rowRefresh;
        $('#modal_confirm_delete').modal({backdrop: 'static', keyboard: false});
    };

    this.init();
}