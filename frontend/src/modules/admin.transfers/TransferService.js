export default class TransferService {
    constructor(Restangular, EditableMap) {
        this.Restangular = Restangular;
        this.EditableMap = EditableMap;
    }

    getTransfers(params) {
        return this.Restangular.one('points').all('transfer').getList(params);
    }

    postAddTransfer(newTransfer) {
        return this.Restangular.one('points').one('transfer').one('add').customPOST({transfer:newTransfer});
    }

    postSpendTransfer(spendTransfer) {
        return this.Restangular.one('points').one('transfer').one('spend').customPOST({transfer: spendTransfer});
    }

    postCancelTransfer(transferId) {
        return this.Restangular.one('points').one('transfer', transferId).one('cancel').post();
    }

    postImportTransfer(file) {
        var formData = new FormData();
        formData.append('file[file]', file);

        return this.Restangular
            .one('points')
            .one('transfer')
            .one('import')
            .withHttpConfig({
                transformRequest: angular.identity,
                timeout: 0
            })
            .customPOST(formData, '', undefined, {'Content-Type': undefined})
    }
}

TransferService.$inject = ['Restangular', 'EditableMap'];
