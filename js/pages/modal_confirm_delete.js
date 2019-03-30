function ModalConfirmDelete(type) {

    if (typeof type === 'undefined' || type == '') {
        toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
        return false;
    }

    let mcdType = type;
    let mcdCallFrom;
    let mcdId;
    let mcdRowRefresh;
    let mcdReturnClass;

    this.init = function () {
        $('#btnMcdSubmit').on('click', function () {
            switch (mcdType) {
                case 'problem_type':
                    problemTypeClass.delete(mcdCallFrom, mcdId, mcdRowRefresh);
                    break;
                case 'work_type':
                    workTypeClass.delete(mcdCallFrom, mcdId, mcdRowRefresh);
                    break;
                case 'work_category':
                    workCategoryClass.delete(mcdCallFrom, mcdId, mcdRowRefresh);
                    break;
                case 'site':
                    siteClass.delete(mcdCallFrom, mcdId, mcdRowRefresh);
                    break;
                case 'contractor_site':
                    if (typeof mcdReturnClass !== 'undefined' && mcdReturnClass.getClassName() === 'ModalSiteAdd') {
                        mcdReturnClass.delete(mcdCallFrom, mcdId, mcdRowRefresh);
                    }
                    break;
                case 'contractor_employee':
                    if (typeof mcdReturnClass !== 'undefined' && mcdReturnClass.getClassName() === 'ModalEmployee') {
                        mcdReturnClass.delete(mcdCallFrom, mcdId, mcdRowRefresh);
                    }
                    break;
                case 'contractor':
                    if (typeof mcdReturnClass !== 'undefined' && mcdReturnClass.getClassName() === 'SectionContractorDetails') {
                        mcdReturnClass.delete(mcdCallFrom, mcdId, mcdRowRefresh);
                    }
                    break;
                //default:
                    //toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
            }
            $('#modal_confirm_delete').modal('hide');
        });
    };

    this.delete = function (callFrom, id, rowRefresh, returnClass) {
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
        mcdReturnClass = typeof returnClass !== 'undefined' ? returnClass : '';
        $('#modal_confirm_delete').modal({backdrop: 'static', keyboard: false});
    };

    this.init();
}