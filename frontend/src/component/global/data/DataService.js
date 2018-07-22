export default class DataService {
    constructor(Restangular, $q, $filter) {
        this.Restangular = Restangular;
        this.$q = $q;
        this.$filter = $filter;
        this.availableLanguages = null;
        this.availableTimezones = null;
        this.availableCountries = null;
        this.availablePromotedEvents = null;
        this._availableReferralEvents = null;
        this._availableReferralTypes = null;
        this.availableFrontendTranslations = null;
        this.availableCustomerStatuses = null;
        this.availableAccountActivationMethods = null;
        this.availableMarketingVendors = null;
        this.availableMarketingVendorsConfig = null;
        this.smsGatewayConfig = null;
        this.activationMethod = null;
        this._availableEarningRuleLimitPeriods = null;
        this.availableCurrencies = [
            {
                name: 'PLN',
                code: 'pln'
            },
            {
                name: 'USD',
                code: 'usd'
            },
            {
                name: 'EUR',
                code: 'eur'
            }
        ];
        this.config = window.OpenLoyaltyConfig || {};
    }

    getPointsStats() {
        return this.Restangular.one('admin').one('analytics').one('points').get()
    }

    getTransactionsStats() {
        return this.Restangular.one('admin').one('analytics').one('transactions').get()
    }

    getCustomersStats() {
        return this.Restangular.one('admin').one('analytics').one('customers').get()
    }

    getReferralStats() {
        return this.Restangular.one('admin').one('analytics').one('referrals').get()
    }

    getConfig() {
        return this.config;
    }

    getActivationMethod() {
        let dfd = this.$q.defer();

        if (this.activationMethod) {
            dfd.resolve(this.activationMethod);

            return;
        }
        let activationMethod = this.Restangular.one('settings').one('activation-method').get();
        activationMethod.then((res) => {
            if (res.method) {
                dfd.resolve(res.method);
            } else {
                dfd.resolve('email');
            }
        })

        return dfd.promise;
    }

    getAvailableData() {
        let self = this;

        let languages = self.Restangular.one('settings').one('choices').one('language').get();
        let availableFrontendTranslations = self.Restangular.one('settings').one('choices').one('availableFrontendTranslations').get();
        let availableCustomerStatuses = self.Restangular.one('settings').one('choices').one('availableCustomerStatuses').get();
        let availableAccountActivationMethods = self.Restangular.one('settings').one('choices').one('availableAccountActivationMethods').get();
        let availableMarketingVendors = self.Restangular.one('settings').one('choices').one('availableMarketingVendors').get();
        let smsGatewatConfig = self.Restangular.one('settings').one('choices').one('smsGatewayConfig').get();
        let availableEarningRuleLimitPeriods = self.Restangular.one('settings').one('choices').one('earningRuleLimitPeriod').get();
        let timezones = self.Restangular.one('settings').one('choices').one('timezone').get();
        let countries = self.Restangular.one('settings').one('choices').one('country').get();
        let events = self.Restangular.one('settings').one('choices').one('promotedEvents').get();
        let referralEvents = self.Restangular.one('settings').one('choices').one('referralEvents').get();
        let referralTypes = self.Restangular.one('settings').one('choices').one('referralTypes').get();

        let dfd = self.$q.defer();

        self.$q.all([languages, timezones, countries, events, availableCustomerStatuses, availableEarningRuleLimitPeriods, referralEvents, referralTypes, availableCustomerStatuses, availableAccountActivationMethods, smsGatewatConfig, availableFrontendTranslations, availableMarketingVendors])
            .then(
                function (res) {
                    if (res[0].choices) {
                        let languages = [];
                        let index = 0;

                        for (let i in res[0].choices) {
                            languages.push({
                                _id: index,
                                name: i,
                                code: res[0].choices[i]
                            });
                            ++index;
                        }
                        self.availableLanguages = languages;
                    }

                    if (res[1].choices) {
                        let timezones = [];
                        let index = 0;

                        for (let i in res[1].choices) {
                            for (let j in res[1].choices[i]) {
                                timezones.push({
                                    _id: index,
                                    name: j,
                                    value: res[1].choices[i][j]
                                });
                                ++index;
                            }
                        }

                        self.availableTimezones = timezones;
                    }

                    if (res[2].choices) {
                        let countries = [];
                        let index = 0;

                        for (let i in res[2].choices) {
                            countries.push({
                                _id: index,
                                name: i,
                                code: res[2].choices[i]
                            });
                            ++index;
                        }

                        self.availableCountries = countries;
                    }

                    if (res[3].choices) {
                        let events = [];
                        let index = 0;

                        for (let i in res[3].choices) {
                            events.push({
                                _id: index,
                                name: i,
                                code: res[3].choices[i]
                            });
                            ++index;
                        }

                        self.availablePromotedEvents = events;
                    }
                    if (res[4].choices) {
                        let translations = [];
                        let index = 0;

                        for (let i in res[4].choices) {
                            translations.push({
                                _id: index,
                                name: res[4].choices[i].name,
                                code: res[4].choices[i].key
                            });
                            ++index;
                        }

                        self.availableFrontendTranslations = translations;
                    }
                    if (res[5].choices) {
                        let events = [];
                        let index = 0;

                        for (let i in res[5].choices) {
                            if(!res[5].choices.hasOwnProperty(i)) {
                                continue;
                            }
                            events.push({
                                _id: index,
                                name: self.$filter('translate')('earning_rule.limit.'+i),
                                code: res[5].choices[i]
                            });
                            ++index;
                        }

                        self._availableEarningRuleLimitPeriods = events;
                    }
                    if (res[6].choices) {
                        let events = [];
                        let index = 0;

                        for (let i in res[6].choices) {
                            if(!res[6].choices.hasOwnProperty(i)) {
                                continue;
                            }
                            events.push({
                                _id: index,
                                name: self.$filter('translate')('earning_rule.referral_events.'+i),
                                code: res[6].choices[i]
                            });
                            ++index;
                        }

                        self._availableReferralEvents = events;
                    }
                    if (res[7].choices) {
                        let events = [];
                        let index = 0;

                        for (let i in res[7].choices) {
                            if(!res[7].choices.hasOwnProperty(i)) {
                                continue;
                            }
                            events.push({
                                _id: index,
                                name: self.$filter('translate')('earning_rule.referral_types.'+i),
                                code: res[7].choices[i]
                            });
                            ++index;
                        }

                        self._availableReferralTypes = events;
                    }
                    if (res[8].choices) {
                        let statuses = [];
                        let index = 0;

                        for (let i in res[8].choices) {
                            statuses.push({
                                _id: index,
                                name: res[8].choices[i],
                                code: res[8].choices[i]
                            });
                            ++index;
                        }

                        self.availableCustomerStatuses = statuses;
                    }
                    if (res[9].choices) {
                        let methods = [];
                        let index = 0;

                        for (let i in res[9].choices) {
                            methods.push({
                                _id: index,
                                name: res[9].choices[i],
                                code: res[9].choices[i]
                            });
                            ++index;
                        }

                        self.availableAccountActivationMethods = methods;
                    }
                    if (res[10].fields) {
                        let methods = [];

                        for (let i in res[10].fields) {
                            methods.push({
                                name: i,
                                type: res[10].fields[i]
                            });
                        }

                        self.smsGatewayConfig = methods;
                    }

                    if (res[11].choices) { // extract available translations list from availableFrontendTranslations response
                        let methods = [];
                        let index = 0;

                        for (let i in res[11].choices) {
                            methods.push({
                                _id: index,
                                name: res[11].choices[i].name,
                                code: res[11].choices[i].key
                            });
                            ++index;
                        }

                        self.availableFrontendTranslations = methods;
                    }


                    if (res[12].choices) {
                        let methods = [];
                        let config = {};
                        let index = 0;

                        for (let i in res[12].choices) {
                            methods.push({
                                _id: index,
                                name: res[12].choices[i]['name'],
                                code: i
                            });

                            config[i] = [];
                            for (let field in res[12].choices[i]['config']) {
                                config[i].push({
                                    name: field,
                                    type: res[12].choices[i]['config'][field]
                                });
                            }
                            ++index;
                        }

                        self.availableMarketingVendors = methods;
                        self.availableMarketingVendorsConfig = config;
                    }

                    dfd.resolve()
                },
                function () {
                    dfd.reject();
                }
            );

        return dfd.promise;
    }

    getDailyRegistrations() {
        return this.Restangular.one('customer').one('registrations').one('daily').get();
    }

    getCurrencies() {
        return this.availableCurrencies;
    }

    getCountries() {
        return this.availableCountries;
    }

    setCountries(data) {
        this.availableCountries = data;
    }

    getLanguages() {
        return this.availableLanguages;
    }

    setLanguages(data) {
        this.availableLanguages = data;
    }

    getTimezones() {
        return this.availableTimezones;
    }

    setTimezones(data) {
        this.availableTimezones = data;
    }

    getAvailablePromotedEvents() {
        return this.availablePromotedEvents;
    }

    setAvailablePromotedEvents(data) {
        this.availablePromotedEvents = data;
    }

    setAvailableFrontendTranslations(data) {
        this.availableFrontendTranslations = data;
    }

    getAvailableFrontendTranslations() {
        return this.availableFrontendTranslations
    }

    setAvailableCustomerStatuses(data) {
        this.availableCustomerStatuses = data;
    }

    getAvailableCustomerStatuses() {
        return this.availableCustomerStatuses
    }

    setAvailableAccountActivationMethods(data) {
        this.availableAccountActivationMethods = data;
    }

    getAvailableAccountActivationMethods() {
        return this.availableAccountActivationMethods
    }
    setSmsGatewayConfig(data) {
        this.smsGatewayConfig = data;
    }

    getSmsGatewayConfig() {
        return this.smsGatewayConfig;
    }

    getAvailableMarketingVendors() {
        return this.availableMarketingVendors;
    }

    getAvailableMarketingVendorsConfig() {
        return this.availableMarketingVendorsConfig;
    }

    getAvailableEarningRuleLimitPeriods() {
        return this._availableEarningRuleLimitPeriods;
    }

    setAvailableEarningRuleLimitPeriods(value) {
        this._availableEarningRuleLimitPeriods = value;
    }

    getAvailableReferralEvents() {
        return this._availableReferralEvents;
    }

    setAvailableReferralEvents(value) {
        this._availableReferralEvents = value;
    }

    getAvailableReferralTypes() {
        return this._availableReferralTypes;
    }

    setAvailableReferralTypes(value) {
        this._availableReferralTypes = value;
    }

    setActivationMethod(value) {
        this.activationMethod = value;
    }
}

DataService.$inject = ['Restangular', '$q', '$filter'];
