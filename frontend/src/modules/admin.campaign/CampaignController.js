const USAGE_TYPE_USED = 'true';
const USAGE_TYPE_DELIVERED = 'false';

/**
 * Describes Admin CampaignController
 * @class CampaignController
 * @constructor
 */
export default class CampaignController {
    /**
     * @param {Object} $scope
     * @param {Object} $state
     * @param {Object} $stateParams
     * @param {AuthService} AuthService
     * @param {CampaignService} CampaignService
     * @param {Object} Flash
     * @param {EditableMap} EditableMap
     * @param {Object} NgTableParams
     * @param {ParamsMap} ParamsMap
     * @param {Object} $q
     * @param {Object} Validation
     * @param {Object} $filter
     * @param {SegmentService} SegmentService
     * @param {Object} LevelService
     * @param {DataService} DataService
     * @param {CustomerService} CustomerService
     * @method constructor
     */
    constructor($scope, $state, $stateParams, AuthService, CampaignService, Flash, EditableMap, NgTableParams, ParamsMap, $q, Validation, $filter, SegmentService, LevelService, DataService, CustomerService) {
        if (!AuthService.isGranted('ROLE_ADMIN')) {
            $state.go('admin-login')
        }
        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;

        this.SegmentService = SegmentService;
        this.LevelService = LevelService;
        this.AuthService = AuthService;
        this.DataService = DataService;
        this.CampaignService = CampaignService;
        this.EditableMap = EditableMap;
        this.ParamsMap = ParamsMap;
        this.Validation = Validation;
        this.CustomerService = CustomerService;

        this.activityStatusSelectOptions = [
            {
                value: '',
                label: $filter('translate')('campaign.activity_statuses.all')
            },
            {
                value: '1',
                label: $filter('translate')('campaign.activity_statuses.active')
            },
            {
                value: '0',
                label: $filter('translate')('campaign.activity_statuses.inactive')
            },
        ];

        this.activityStatusSelectConfig = {
            valueField: 'value',
            labelField: 'label',
            create: false,
            sortField: 'label',
            searchField: 'label',
            maxItems: 1,
            allowEmptyOption: true
        };

        this.rewardSelectConfig = {
            valueField: 'value',
            labelField: 'label',
            create: false,
            sortField: 'label',
            searchField: 'label',
            maxItems: 1,
            allowEmptyOption: true
        };

        this.rewardSelectOptions = [
            {
                value: '',
                label: $filter('translate')('campaign.campaign_type.all')
            },
            {
                label: $filter('translate')('campaign.discount_code'),
                value: 'discount_code'
            },
            {
                label: $filter('translate')('campaign.event_code'),
                value: 'event_code'
            },
            {
                label: $filter('translate')('campaign.free_delivery_code'),
                value: 'free_delivery_code'
            },
            {
                label: $filter('translate')('campaign.gift_code'),
                value: 'gift_code'
            },
            {
                label: $filter('translate')('campaign.value_code'),
                value: 'value_code'
            },
            {
                label: $filter('translate')('campaign.cashback'),
                value: 'cashback'
            }
        ];

        this.Flash = Flash;
        this.NgTableParams = NgTableParams;
        this.$q = $q;
        this.$filter = $filter;
        this._selectizeConfigs();
    }

    /**
     * Initial method
     *
     * @method $onInit
     */
    $onInit() {
        this.loaderStates = {
            campaignList: true,
            campaignDetails: true,
            campaignCustomerList: true,
            coverLoader: true,
            redeemedCampaigns: true
        };

        this.campaignId = this.$stateParams.campaignId || null;
        this.$scope.campaignName = this.$stateParams.campaignName || false;
        this.$scope.newCampaign = {labels: []};
        this.$scope.showCompany = false;
        this.$scope.showAddress = false;
        this.$scope.fileValidate = this.CampaignService.storedFileError;
        this.$scope.dateFrom = null;
        this.$scope.dateTo = null;
        this.$scope.exportDateFrom = null;
        this.$scope.exportDateTo = null;
        this.$scope.content = "test";
        this.segments = null;
        this.levels = null;
        this.config = this.DataService.getConfig();
        this.target = [
            {
                name: this.$filter('translate')('global.segment'),
                type: 'segment'
            },
            {
                name: this.$filter('translate')('global.level'),
                type: 'level'
            }
        ];
        this.active = [
            {
                name: this.$filter('translate')('global.active'),
                type: 1
            },
            {
                name: this.$filter('translate')('global.inactive'),
                type: 0
            }
        ];
        this.reward = [
            {
                name: this.$filter('translate')('campaign.discount_code'),
                type: 'discount_code'
            },
            {
                name: this.$filter('translate')('campaign.event_code'),
                type: 'event_code'
            },

            {
                name: this.$filter('translate')('campaign.free_delivery_code'),
                type: 'free_delivery_code'
            },
            {
                name: this.$filter('translate')('campaign.gift_code'),
                type: 'gift_code'
            },
            {
                name: this.$filter('translate')('campaign.value_code'),
                type: 'value_code'
            },
            {
                name: this.$filter('translate')('campaign.cashback'),
                type: 'cashback'
            }
        ];
        this.egCoupon = ['Example_coupon'];
        this.rewardConfig = {
            valueField: 'type',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1,
        };
        this.levelsConfig = {
            valueField: 'id',
            labelField: 'name',
            create: false,
            plugins: ['remove_button'],
            sortField: 'name'
        };
        this.segmentsConfig = {
            valueField: 'segmentId',
            labelField: 'name',
            create: false,
            plugins: ['remove_button'],
            sortField: 'name'
        };
        this.targetConfig = {
            valueField: 'type',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1
        };
        this.activeConfig = {
            valueField: 'type',
            labelField: 'name',
            create: false,
            sortField: 'name',
            maxItems: 1
        };
        this.couponsConfig = {
            delimiter: ',',
            persist: false,
            plugins: ['remove_button'],
            create: function (input) {
                return {
                    value: input,
                    text: input
                }
            }
        };


        let segmentPromise = this.SegmentService.getActiveSegments({perPage: 1000})
            .then(
                res => {
                    this.segments = res;
                }
            );

        let levelPromise = this.LevelService.getLevels()
            .then(
                res => {
                    this.levels = res;
                }
            );

        this.dataPromise = this.$q.all([segmentPromise, levelPromise]);
    }

    /**
     * creates NgTable instances
     *
     * @method getData
     */
    getData() {
        let self = this;

        self.tableParams = new self.NgTableParams({
            count: self.config.perPage
        }, {
            getData: function (params) {
                let dfd = self.$q.defer();
                self.loaderStates.campaignList = true;
                self.CampaignService.getCampaigns(self.ParamsMap.params(params.url()))
                    .then(
                        res => {
                            self.$scope.campaigns = res;
                            self.CampaignService.setStoredCampaigns(res);
                            self.loaderStates.campaignList = false;
                            self.loaderStates.coverLoader = false;
                            params.total(res.total);
                            dfd.resolve(res)
                        },
                        () => {
                            let message = self.$filter('translate')('xhr.get_campaigns.error');
                            self.loaderStates.campaignList = false;
                            self.loaderStates.coverLoader = false;
                            self.Flash.create('danger', message);
                            dfd.reject();
                        }
                    );

                return dfd.promise;
            }
        });
    }

    /**
     * Sets campaign state
     *
     * @param {Boolean} active
     * @param {Integer} campaignId
     * @method setCampaignState
     */
    setCampaignState(active, campaignId) {
        let self = this;

        self.CampaignService.setCampaignState(active, campaignId)
            .then(
                () => {
                    let message = self.$filter('translate')('xhr.post_activate_campaign.success');
                    self.Flash.create('success', message);
                    self.tableParams.reload();
                },
                () => {
                    let message = self.$filter('translate')('xhr.post_activate_campaign.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    /**
     * Obtains campaign data
     *
     * @method getCampaignData
     */
    getCampaignData() {
        let self = this;

        if (self.campaignId) {
            self.dataPromise.then(self._getCampaign())
        } else {
            self.$state.go('admin.campaign-list');
            let message = self.$filter('translate')('xhr.get_campaign.no_id');
            self.Flash.create('warning', message);
        }
    }

    /**
     * Adds new campaign
     *
     * @param {Object} newCampaign
     * @method addCampaign
     */
    addCampaign(newCampaign) {
        let self = this;

        self.CampaignService.postCampaign(newCampaign)
            .then(
                res => {
                    if (self.$scope.campaignFile) {
                        self.$scope.fileValidate = {};

                        self.CampaignService.postCampaignImage(res.campaignId, self.$scope.campaignFile)
                            .then(
                                res2 => {
                                    self.$state.go('admin.single-campaign', {campaignId: res.campaignId});
                                    let message = self.$filter('translate')('xhr.post_campaign.success');
                                    self.Flash.create('success', message);
                                }
                            )
                            .catch(
                                err => {
                                    self.$scope.fileValidate = self.Validation.mapSymfonyValidation(err.data);
                                    self.CampaignService.storedFileError = self.$scope.fileValidate;

                                    let message = self.$filter('translate')('xhr.post_campaign.warning');
                                    self.Flash.create('warning', message);

                                    self.$state.go('admin.edit-campaign', {campaignId: res.campaignId})
                                }
                            );

                    } else {
                        self.$state.go('admin.campaign-list');
                        let message = self.$filter('translate')('xhr.post_campaign.success');
                        self.Flash.create('success', message);
                    }
                },
                res => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.post_campaign.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    /**
     * Deletes photo
     *
     * @method deletePhoto
     */
    deletePhoto() {
        let self = this;

        this.CampaignService.deleteCampaignImage(this.$stateParams.campaignId)
            .then(
                res => {
                    self.$scope.campaignFilePath = false;
                    let message = self.$filter('translate')('xhr.delete_campaign_image.success');
                    self.Flash.create('success', message);
                }
            )
            .catch(
                err => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.delete_campaign_image.error');
                    self.Flash.create('danger', message);
                }
            )
    }

    /**
     * Edits campaign
     *
     * @param editedCampaign
     * @method editCampaign
     */
    editCampaign(editedCampaign) {
        let self = this;

        self.CampaignService.putCampaign(editedCampaign)
            .then(
                res => {
                    if (self.$scope.campaignFile) {
                        self.$scope.fileValidate = {};

                        self.CampaignService.postCampaignImage(self.$stateParams.campaignId, self.$scope.campaignFile)
                            .then(
                                res2 => {
                                    self.CampaignService.storedFileError = {};
                                    self.$state.go('admin.single-campaign', {campaignId: res.campaignId});

                                    let message = self.$filter('translate')('xhr.put_campaign.success');
                                    self.Flash.create('success', message);
                                    self.loaderStates.coverLoader = false;
                                }
                            )
                            .catch(
                                err => {
                                    self.$scope.fileValidate = self.Validation.mapSymfonyValidation(err.data);
                                    let message = self.$filter('translate')('xhr.put_campaign.error');
                                    self.Flash.create('danger', message);
                                    self.loaderStates.coverLoader = false;
                                }
                            );

                    } else {
                        self.$state.go('admin.single-campaign', {campaignId: res.campaignId});
                        let message = self.$filter('translate')('xhr.put_campaign.success');
                        self.Flash.create('success', message);
                        self.loaderStates.campaignDetails = false;
                        self.loaderStates.coverLoader = false;
                    }
                },
                res => {
                    self.$scope.validate = self.Validation.mapSymfonyValidation(res.data);
                    let message = self.$filter('translate')('xhr.put_campaign.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.campaignDetails = false;
                    self.loaderStates.coverLoader = false;
                }
            )
    }

    /**
     * Obtains customers for campaign
     *
     * @method getCustomersForCampaign
     */
    getCustomersForCampaign() {
        let self = this;

        if (self.campaignId) {
            self.customersTableParams = new self.NgTableParams({
                count: self.config.perPage
            }, {
                getData: function (params) {
                    let dfd = self.$q.defer();
                    self.loaderStates.campaignCustomerList = true;

                    self.CampaignService.getVisibleCustomers(self.campaignId, self.ParamsMap.params(params.url()))
                        .then(
                            res => {
                                self.$scope.customers = res;
                                params.total(res.total);
                                dfd.resolve(res)
                                self.loaderStates.campaignCustomerList = false;
                                self.loaderStates.coverLoader = false;
                            },
                            () => {
                                let message = self.$filter('translate')('xhr.get_customers_for_campaign.error');
                                self.Flash.create('danger', message);
                                dfd.reject();
                                self.loaderStates.campaignCustomerList = false;
                                self.loaderStates.coverLoader = false;
                            }
                        );

                    return dfd.promise;
                }
            });
        } else {
            self.$state.go('admin.campaign-list');
            let message = self.$filter('translate')('xhr.get_customers_for_campaign.no_id');
            self.Flash.create('warning', message);
            self.loaderStates.campaignCustomerList = false;
        }
    }

    /**
     * Generating photo route
     *
     * @method generatePhotoRoute
     * @returns {string}
     */
    generatePhotoRoute() {
        return this.DataService.getConfig().apiUrl + '/campaign/' + this.$stateParams.campaignId + '/photo'
    }

    /**
     * Obtain all campaign data
     *
     * @method _getCampaign
     * @private
     */
    _getCampaign() {
        let self = this;

        self.CampaignService.getCampaign(self.campaignId)
            .then(
                res => {
                    self.$scope.campaign = res;
                    self.$scope.editableFields = self.EditableMap.humanizeCampaign(res);
                    if (self.$scope.editableFields.levels && self.$scope.editableFields.levels.length) {
                        let levels = self.$scope.editableFields.levels;
                        for (let i in levels) {
                            let level = _.find(self.levels, {id: levels[i]});
                        }

                    }
                    if (self.$scope.editableFields.segments && self.$scope.editableFields.segments.length) {
                        let segments = self.$scope.editableFields.segments;
                        for (let i in segments) {
                            let segment = _.find(self.segments, {id: segments[i]});
                        }

                    }
                    self.loaderStates.campaignDetails = false;
                },
                () => {
                    let message = self.$filter('translate')('xhr.get_campaign.error');
                    self.Flash.create('danger', message);
                    self.loaderStates.campaignDetails = false;
                }
            );

        self.CampaignService.getCampaignImage(self.campaignId)
            .then(
                res => {
                    self.$scope.campaignFilePath = true;
                }
            )
            .catch(
                err => {
                    self.$scope.campaignFilePath = false;
                }
            );
    }

    /**
     * Creates NgTable instances for redeemed campaigns page
     *
     * @method getRedeemedCampaigns
     */
    getRedeemedCampaigns() {
      let self = this;

      self.redeemedCampaignsTableParams = new self.NgTableParams({
        count: self.config.perPage,
        sorting: {
          purchasedAt: 'desc'
        }
      }, {
        getData: function (params) {
          let dfd = self.$q.defer();
          self.loaderStates.redeemedCampaigns = true;
          self.CampaignService.getRedeemedCampaignRewards(self.ParamsMap.params(params.url()))
              .then(
                res => {
                  self.loaderStates.redeemedCampaigns = false;
                  self.loaderStates.coverLoader = false;
                  params.total(res.total);
                  dfd.resolve(res)
                },
                () => {
                  let message = self.$filter('translate')('xhr.get_redeemed_campaigns.error');
                  self.loaderStates.redeemedCampaigns = false;
                  self.loaderStates.coverLoader = false;
                  self.Flash.create('danger', message);
                  dfd.reject();
                }
              );

          return dfd.promise;
        }
      });
    }


    /**
     * Update usage of single campaign
     *
     * @method updateCampaignUsage
     * @param {number} customerId
     * @param {number} campaignId
     * @param {string} code
     * @param {Boolean} used
     */
    updateCampaignUsage(customerId, campaignId, code, used){
      let self = this;
      self.CustomerService.postUsage(customerId, campaignId, code, used).then(
        () => {
          self.redeemedCampaignsTableParams.reload();
        },
        () => {
          let message = self.$filter('translate')('xhr.pos_coupon_usage.error');
          self.Flash.create('danger', message);

        }
      )
    }

    addLabel(edit) {
        if (edit) {
            if (!(this.$scope.editableFields.labels instanceof Array)) {
                this.$scope.editableFields.labels = [];
            }
            this.$scope.editableFields.labels.push({
                key: '',
                value: ''
            })
        } else {
            this.$scope.newCampaign.labels.push({
                key: '',
                value: ''
            })
        }
    }

    removeLabel(index, edit) {
        let self = this;
        let campaign;

        if (!edit) {
            campaign = self.$scope.newCampaign;
        } else {
            campaign = self.$scope.editableFields;
        }

        campaign.labels = _.difference(campaign.labels, [campaign.labels[index]])
    }

    downloadRedeemedCampaignsReportCSV(dateFrom = null, dateTo = null) {
        var self = this;
        let params = {
        };

        if (dateFrom) {
            params.purchasedAtFrom = dateFrom;
        }

        if (dateTo) {
            params.purchasedAtTo = dateTo;
        }

        self.CampaignService.getBoughtReport(params).then(function (response) {
           let file = new Blob([response], {type: 'text/csv'});
           self.downloadFile(file, 'report.csv');
        });
    }

    downloadFile(blob, filename) {
            // It is necessary to create a new blob object with mime-type explicitly set
            // otherwise only Chrome works like it should
            let newBlob = new Blob([blob], {type: "text/csv"});
            // IE doesn't allow using a blob object directly as link href
            // instead it is necessary to use msSaveOrOpenBlob
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(newBlob);
                return;
            }
            // For other browsers:
            // Create a link pointing to the ObjectURL containing the blob.
            const data = window.URL.createObjectURL(newBlob);
            let link = document.createElement('a');
            link.href = data;
            link.download = filename;
            link.click();
            setTimeout(function() {
                    // For Firefox it is necessary to delay revoking the ObjectURL
                    window.URL.revokeObjectURL(data);
                }, 100)
    }

    _selectizeConfigs() {
      let self = this;

      this.campaignsUsageSelectOptions = [{
          value: '',
          label: self.$filter('translate')('campaign.usage_types.both')
        },
        {
          value: USAGE_TYPE_DELIVERED,
          label: self.$filter('translate')('campaign.usage_types.' + USAGE_TYPE_DELIVERED)
        },
        {
          value: USAGE_TYPE_USED,
          label: self.$filter('translate')('campaign.usage_types.' + USAGE_TYPE_USED)
        }
      ];

      this.campaignUsageSelectConfig = {
        valueField: 'value',
        labelField: 'label',
        create: false,
        sortField: 'label',
        searchField: 'label',
        maxItems: 1,
        allowEmptyOption: true
      };
    }
}

CampaignController.$inject = ['$scope', '$state', '$stateParams', 'AuthService', 'CampaignService', 'Flash', 'EditableMap', 'NgTableParams', 'ParamsMap', '$q', 'Validation', '$filter', 'SegmentService', 'LevelService', 'DataService', 'CustomerService'];
