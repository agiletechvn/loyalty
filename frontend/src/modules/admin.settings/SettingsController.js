export default class SettingsController {
    constructor($scope, SettingsService, Flash, DataService, $filter, Validation, $translate, TranslationService) {
        let self = this;
        this.$scope = $scope;
        this.Flash = Flash;
        this.SettingsService = SettingsService;
        this.DataService = DataService;
        this.TranslationService = TranslationService;
        this.$filter = $filter;
        this.Validation = Validation;
        this.$translate = $translate;

        this.$scope.refresh = false;
        this.$scope.languages = this.DataService.getLanguages();
        this.$scope.availableFrontendTranslations = this.DataService.getAvailableFrontendTranslations();
        this.$scope.availableCustomerStatuses = this.DataService.getAvailableCustomerStatuses();
        this.$scope.timezones = this.DataService.getTimezones();
        this.$scope.countries = this.DataService.getCountries();
        this.$scope.currencies = this.DataService.getCurrencies();
        this.$scope.validate = {};
        this.$scope.fileValidate = this.SettingsService.storedFileError;
        this.currencyConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
        };
        this.countryConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
        };
        this.languageConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
        };
        this.defaultFrontendTranslationsConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
            onChange: function (value) {
                if (!this.defaultFrontendTranslationValue) {
                    this.defaultFrontendTranslationValue = value;
                }
                if (this.defaultFrontendTranslationValue != value) {
                    self.$scope.refresh = true;
                }
                this.defaultFrontendTranslationValue = value;
            }
        };
        this.customerStatusesEarningConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: self.$scope.availableCustomerStatuses.length,
            persist: false,
            plugins: ['remove_button'],
            onChange: function (value) {
                if (!this.customerStatusesEarningValue) {
                    this.customerStatusesEarningValue = value;
                }
                if (this.customerStatusesEarningValue != value) {
                    self.$scope.refresh = true;
                }
                this.customerStatusesEarningValue = value;
            }
        };
        this.customerStatusesSpendingConfig = {
            valueField: 'code',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: self.$scope.availableCustomerStatuses.length,
            persist: false,
            plugins: ['remove_button'],
            onChange: function (value) {
                if (!this.customerStatusesSpendingValue) {
                    this.customerStatusesSpendingValue = value;
                }
                if (this.customerStatusesSpendingValue != value) {
                    self.$scope.refresh = true;
                }
                this.customerStatusesSpendingValue = value;
            }
        };
        this.timezoneConfig = {
            valueField: 'value',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
        };
        this.fieldConfig = {
            valueField: 'value',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
        };
        this.tierConfig = {
            valueField: 'value',
            labelField: 'name',
            create: false,
            sortField: 'name',
            searchField: 'name',
            maxItems: 1,
        };
        this.fields = [
            {
                name: 'loyaltyCardNumber',
                value: 'loyaltyCardNumber'
            },
            {
                name: 'email',
                value: 'email'
            }
        ];
        this.tiers = [
            {
                name: 'points',
                value: 'points'
            },
            {
                name: 'transactions',
                value: 'transactions'
            }
        ];
        this.egSkus = ['SKU123'];
        this.skusConfig = {
            delimiter: ',',
            plugins: ['remove_button'],
            persist: false,
            create: function (input) {
                return {
                    value: input,
                    text: input
                }
            }
        };

        this.loaderStates = {
            adminSettings: true,
            coverLoader: true
        };
    }

    /**
     * Generating logo route
     *
     * @method generateLogoRoute
     * @returns {string}
     */
    generateLogoRoute() {
        return this.DataService.getConfig().apiUrl + '/settings/logo';
    }

    /**
     * Deletes logo
     *
     * @method deleteLogo
     */
    deleteLogo() {
        let self = this;

        this.SettingsService.deleteLogo()
            .then(
                res => {
                    self.$scope.logoFilePath = false;
                    let message = self.$filter('translate')('xhr.delete_settings_logo.success');
                    self.Flash.create('success', message);
                }
            )
            .catch(
                err => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.delete_settings_logo.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    getData() {
        let self = this;
        self.loaderStates.adminSettings = true;

        self.SettingsService.getSettingsData()
            .then(
                () => {
                    self.$scope.settings = self.SettingsService.getSettings();
                    self.$scope.settingsOld = angular.copy(self.$scope.settingsOld);
                    self.loaderStates.adminSettings = false;
                    self.loaderStates.coverLoader = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_settings.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.adminSettings = false;
                    self.loaderStates.coverLoader = false;
                }
            );
        self.SettingsService.getLogo()
            .then(
                res => {
                    self.$scope.logoFilePath = true;
                }
            )
            .catch(
                err => {
                    self.$scope.logoFilePath = false;
                }
            );
    }

    editSettings(settings) {
        let self = this;

        self.SettingsService.postSettings(settings)
            .then(
                res => {
                    if (self.$scope.logoFile) {
                        self.$scope.fileValidate = {};
                        self.SettingsService.postLogo(self.$scope.logoFile)
                            .catch(
                                err => {
                                    self.$scope.fileValidate = self.Validation.mapSymfonyValidation(err.data);
                                    let message = self.$filter('translate')('xhr.upload_settings_logo.error');
                                    self.Flash.create('danger', message);
                                    self.loaderStates.coverLoader = false;
                                }
                            );
                        self.$scope.refresh = true;
                    }

                    let message = self.$filter('translate')('xhr.put_settings.success');
                    self.Flash.create('success', message);
                    self.$scope.validate = {};
                    self.$scope.settings = res.settings;
                    self.TranslationService.removeStoredTranslations();
                    self.$translate.refresh();
                    self.$scope.settingsOld = angular.copy(self.$scope.settings);

                    if (self.$scope.refresh) {
                        window.location.reload(true);
                    }
                },
                (res) => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.put_settings.error');
                    self.Flash.create('danger', message);
                }
            );
        // } else {
        //     let message = self.$filter('translate')('xhr.put_settings.error');
        //     self.Flash.create('danger', message);
        //     self.$scope.validate = frontValidation;
        // }
    }

    removeIdentificationPriority(index) {
        let self = this;

        self.$scope.settings.customersIdentificationPriority = _.difference(self.$scope.settings.customersIdentificationPriority, [self.$scope.settings.customersIdentificationPriority[index]])
    }

    addIdentificationPriority() {
        let self = this;
        if (!self.$scope.settings.customersIdentificationPriority) {
            self.$scope.settings.customersIdentificationPriority = []
        }

        self.$scope.settings.customersIdentificationPriority.push({})
    }

}

SettingsController.$inject = ['$scope', 'SettingsService', 'Flash', 'DataService', '$filter', 'Validation', '$translate', 'TranslationService'];
