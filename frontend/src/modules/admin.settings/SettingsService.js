export default class SettingsService {
    constructor(Restangular, $q, EditableMap) {
        this.Restangular = Restangular;
        this.$q = $q;
        this.EditableMap = EditableMap;
        this.settings = null;
        this._logoFileError = {};
    }

    /**
     * Gets stored logo file error
     *
     * @method storedFileError
     */
    get storedFileError() {
        return this._logoFileError
    }

    /**
     * Sets stored logo file error
     *
     * @method storedFileError
     */
    set storedFileError(error) {
        this._logoFileError = error;
    }

    getSettingsData() {
        let self = this;
        let dfd = self.$q.defer();

        self.Restangular.one('settings').get()
            .then(
                 res => {
                    self.settings = self._toObject(res.settings);
                    dfd.resolve();
                },
                () => {
                    dfd.reject();
                }
            );

        return dfd.promise;
    }

    postSettings(editedSettings) {
        let self = this;
        let data = self.EditableMap.settings(editedSettings);

        return self.Restangular.one('settings').customPOST({settings: data});
    }

    getSettings() {
        return this.settings;
    }

    /**
     * Calls for post logo
     *
     * @method postLogo
     * @param {Object} data
     * @returns {Promise}
     */
    postLogo(data) {
        let fd = new FormData();

        fd.append('photo[file]', data);

        return this.Restangular
            .one('settings')
            .one('logo')
            .withHttpConfig({transformRequest: angular.identity})
            .customPOST(fd, '', undefined, {'Content-Type': undefined});
    }

    /**
     * Calls for logo
     *
     * @method getLogo
     * @returns {Promise}
     */
    getLogo() {
        return this.Restangular
            .one('settings')
            .one('logo')
            .get()
    }

    /**
     * Calls to remove logo
     *
     * @method deleteLogo
     * @returns {Promise}
     */
    deleteLogo() {
        return this.Restangular
            .one('settings')
            .one('logo')
            .remove()
    }

    _toObject(data) {
        let res = {};
        for(let i in data) {
            res[i] = data[i]
        }

        return res;
    }

}

SettingsService.$inject = ['Restangular', '$q', 'EditableMap'];
