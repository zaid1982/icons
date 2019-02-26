function ModalProblemType() {

    let mptCallFrom = '';
    let mptProblemtypeId = '';

    this.init = function () {

    };

    this.load = function (callFrom, problemtypeId) {
        mptCallFrom = callFrom;
        mptProblemtypeId = typeof problemtypeId === 'undefined' ? '' : problemtypeId;

        $('#btnMptSubmit').attr('disabled', true);
        $('#modal_problem_type').modal({backdrop: 'static', keyboard: false});
    };

    this.init();

}