const listTableFormation = require("./listTableFormation"); 
const fieldInfoJson = require("./fieldInfoJsonFormation");
const { layoutBuffer } = require("../../uploaddevelopertemp/developerFiles");

module.exports = {
    detailViewBaseImportsForWeb:(layout) =>{
        return new Promise(async (resolve, reject) => {
            try {
                let baseImports = ``;
                for (let i = 0; i < layout.layoutSectionSet.length; i++) {
                    let layoutSectionSet = layout.layoutSectionSet[i];
                    for (let j = 0; j < layoutSectionSet.sectionElementSet.length; j++) {
                        let sectionElement = layoutSectionSet.sectionElementSet[j];
                        if (sectionElement.elementType === 'ACTION' && (sectionElement.actionType === 'EDIT' || sectionElement.actionType === 'NEW' || sectionElement.actionType === 'VIEW' || sectionElement.actionType === "DATA_CLONE")) {
                            let LayoutProperties = JSON.parse(sectionElement.actionData[0].actionInfo).LayoutProperties;
                            let redirectionTo = '';
                            let enablePopupModel = false;
                            for (let k = 0; k < LayoutProperties.length; k++) {
                                if(LayoutProperties[k].propertyKey ==='redirectionTo'){
                                    redirectionTo = LayoutProperties[k].fieldDetails[0].redirectionTypeName;
                                } else if(LayoutProperties[k].propertyKey ==='enablePopupModel'){
                                    enablePopupModel = LayoutProperties[k].fieldDetails[0].value;
                                }
                            }
                            if(enablePopupModel === true && sectionElement.actionType !== "DATA_CLONE"){
                                if (!baseImports.includes(`import { ${redirectionTo} } from '../../pages/${redirectionTo}/${redirectionTo}';`)) {
                                    baseImports += `import { ${redirectionTo} } from '../../pages/${redirectionTo}/${redirectionTo}';`
                                }
                            }
                            if(sectionElement.actionType === "DATA_CLONE" && enablePopupModel === true){
                                if (!baseImports.includes(`import { ${sectionElement.targetLayoutName} } from '../../pages/${sectionElement.targetLayoutName}/${sectionElement.targetLayoutName}';`)) {
                                    baseImports += `import { ${sectionElement.targetLayoutName} } from '../../pages/${sectionElement.targetLayoutName}/${sectionElement.targetLayoutName}';`
                                }
                            }
                        } else if(sectionElement.elementType === 'ACTION' && (sectionElement.actionType === 'MORE' || sectionElement.hasOwnProperty('elementActions'))){
                            for (let a = 0; a < sectionElement.elementActions.length; a++) {
                                let moreElementActions = sectionElement.elementActions[a];
                                let actionData = moreElementActions.actionData[0];
                                let actionInfo = JSON.parse(actionData.actionInfo);
                                let LayoutProperties = actionInfo.LayoutProperties;
                                let enablePopupModel = false;
                                let redirectionTypeName = '';
                                for (let k = 0; k < LayoutProperties.length; k++) {
                                    if(LayoutProperties[k].propertyKey==="redirectionTo"){
                                         redirectionTypeName = LayoutProperties[k].fieldDetails[0].redirectionTypeName;
                                    } else if (LayoutProperties[k].propertyKey === 'enablePopupModel') {
                                         enablePopupModel = LayoutProperties[k].fieldDetails[0].value;
                                    }
                                }
                                if (enablePopupModel === true && moreElementActions.actionType !== "DATA_CLONE") {
                                    if (!baseImports.includes(`import { ${redirectionTypeName} } from '../../pages/${redirectionTypeName}/${redirectionTypeName}';`)) {
                                        baseImports += `import { ${redirectionTypeName} } from '../../pages/${redirectionTypeName}/${redirectionTypeName}';`
                                    }
                                }
                                if(moreElementActions.actionType === "DATA_CLONE" && enablePopupModel === true){
                                    if (!baseImports.includes(`import { ${moreElementActions.targetLayoutName} } from '../../pages/${moreElementActions.targetLayoutName}/${moreElementActions.targetLayoutName}';`)) {
                                        baseImports += `import { ${moreElementActions.targetLayoutName} } from '../../pages/${moreElementActions.targetLayoutName}/${moreElementActions.targetLayoutName}';`
                                    }
                                }
                            }
                        } 
                        if(sectionElement.layoutActionInfoSet.length > 0 && sectionElement.layoutActionInfoSet[0].actionType === 'BALLOON_TOOLTIP' && sectionElement.layoutActionInfoSet[0].isBalloonToolTipEnable === "Y"){
                            if (!baseImports.includes(`import { ${sectionElement.layoutActionInfoSet[0].BalloonToolTipEnabledLayout} } from '../../pages/${sectionElement.layoutActionInfoSet[0].BalloonToolTipEnabledLayout}/${sectionElement.layoutActionInfoSet[0].BalloonToolTipEnabledLayout}';`)) {
                                baseImports += `import { ${sectionElement.layoutActionInfoSet[0].BalloonToolTipEnabledLayout} } from '../../pages/${sectionElement.layoutActionInfoSet[0].BalloonToolTipEnabledLayout}/${sectionElement.layoutActionInfoSet[0].BalloonToolTipEnabledLayout}';`
                            }
                        }
                    }
                }
                resolve(baseImports)
            } catch(err){
                logger.debug('Error In Search Import Due to......', err);
                reject(err);
            }
        })
    },
    gridGridViewConstructor: (baseCtrlObj, layout, appObject, layoutGrpObj, searchFlag, dbVar, hierarchy,constructorData) => {
        return new Promise(async (resolve, reject) => {
            try {
                var parentId = 0;
                for (let i = 0; i < layout.layoutSectionSet.length; i++) {
                    const element = layout.layoutSectionSet[i];
                    if (element.sectionFor === 'GRID' && element.sectionType === 'HORIZONTAL' && element.objectId !== 0) {
                        parentId = element.objectId;
                        break;
                    }
                }
                var ofllineIndex=''
                  //  var dbProvider = 'couchdbProvider'
                ofllineIndex = `public onlineDbIndexCreation: onlineDbIndexCreation, public offlineDbIndexCreation: offlineDbIndexCreation`;
                const constructorValue = `constructor(public cspfmMetaCouchDbProvider : cspfmMetaCouchDbProvider, public angularUtilService: AngularUtilService, public dialog: MatDialog, public popoverCtrl: PopoverController, public modalCtrl: ModalController, private changeRef: ChangeDetectorRef, 
                    public applicationRef: ApplicationRef, public appUtilityConfig: appUtility, public events: Events,private cspfmDataTraversalUtilsObject: cspfmDataTraversalUtils,
                    public router: Router, private cspfmBulkWorkFlowValidationObject:  cspfmBulkWorkFlowValidation, public activatRoute: ActivatedRoute, public objectTableMapping: objectTableMapping, public lookupFieldMapping: lookupFieldMapping,
                    public loadingCtrl: LoadingController, public toastCtrl: ToastController, public dataProvider: dataProvider, public metaDbConfigurationObj: metaDbConfiguration,
                    public cspfmReportGenerationService: CspfmReportGenerationService, public metaDbProvider: metaDataDbProvider, public cspfmexecutionPouchDbProvider: cspfmExecutionPouchDbProvider, public pfmObjectConfig: cspfmObjectConfiguration,private cspfmConditionalFormattingUtils: cspfmConditionalFormattingUtils,public slickgridUtils: cspfmSlickgridUtils,
                    public cspfmLayoutConfig: cspfmLayoutConfiguration,public executionDbConfigObject: cspfmExecutionPouchDbConfiguration, private datePipe: DatePipe,private liveListenerHandlerUtils: cspfmLiveListenerHandlerUtils, public alerCtrl: AlertController, ${ofllineIndex},
                    @Inject(MAT_DIALOG_DATA) data, public dialogRef: MatDialogRef<${layout.layoutName}>,private cspfmDataDisplay: cspfm_data_display,public customActionUtils: cspfmCustomActionUtils,
                    public dbService: couchdbProvider,public translateService: TranslateService,${constructorData.importModules}           
                ) {
                    this.customActionConfiguration = lodash.cloneDeep(this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]['customActionConfiguration']);
                    this.associationConfigurationAssignment()
                    ${(layoutGrpObj.hasOwnProperty('isBalloonToolTipModeEnable') && layoutGrpObj.isBalloonToolTipModeEnable === 'Y') ? `` :
                    `if (data.hasOwnProperty('params')) {
                        this.isPopUpEnabled = true;
                        dialogRef.disableClose = true;
                        let params = data['params'];
                        this.initializeStatusWorkFlowFields();
                        if (params["redirectUrl"]) {
                          this.redirectUrl = params["redirectUrl"]
                        }
                        if (params["isFromMenu"]) {
                          this.isFromMenu = params["isFromMenu"]
                        }
                        this.parentTitle = params["parentTitle"];
                        this.parentObjLabel = params["parentFieldLabel"];
                        this.parentObjValue = params["parentFieldValue"];
                        this.id = params["id"];
                        ${dbVar.type === 'webservice' ? `this.viewFetchActionInfo = JSON.parse(params["viewFetchActionInfo"]);` : ``}
                        this.fetchSelectedObject();
                    } else {                  
                        this.activatRoute.queryParams.subscribe(params => {
                            if (Object.keys(params).length === 0 && params.constructor === Object) {
                                console.log("list query params skipped");
                                return
                            }
                            if (params["redirectUrl"]) {
                                this.redirectUrl = params["redirectUrl"]
                            }
                            if (params["id"]) {
                                this.id = params["id"];
                            }
                            this.initializeStatusWorkFlowFields();
                            this.parentTitle = params["parentTitle"];
                            this.parentObjLabel = params["parentFieldLabel"];
                            this.parentObjValue = params["parentFieldValue"];
                            ${dbVar.type === 'webservice' ? `this.viewFetchActionInfo = JSON.parse(params["viewFetchActionInfo"]);` : ``}
                            this.fetchSelectedObject();
                        });
                    }`}
                    this.appUtilityConfig.setEventSubscriptionlayoutIds(
                        this.tableName_pfm${parentId},
                        this.layoutId
                    );
            
                    if (
                        !this.appUtilityConfig.isMobile ||
                        this.appUtilityConfig.osType === "android"
                    ) {
                        this.isBrowser = true;
                    }
            
                    this.events.subscribe(this.layoutId, modified => {
                        if (modified["dataProvider"] === "PouchDB") {
                            this.childObjectModifiedEventTrigger(modified);
                        }
                    });
            
                    this.registerRecordChangeListener();
                    this.dripDownAttribute = "#cs-dropdown-" + this.layoutId;
                }`;
                resolve(constructorValue);
            } catch (err) {
                logger.debug('Error In gridGridViewConstructor Due to......', err);
                reject(err);
            }
        })
    },
    defaultMethods: (baseCtrlObj, layout, appObject, layoutGrpObj, searchFlag, dbVar, hierarchy, balloonUIFunc) => {
        return new Promise(async (resolve, reject) => {
            try {
                let commonMehtods = `childObjectModifiedEventTrigger(modified) {
                    const modifiedData = this.dataProvider.convertRelDocToNormalDoc(modified);
                    if (modifiedData["id"] === this.id) {
                        this.fetchSelectedObject();
                    }
                }
                ngOnInit() {
                    ${layoutGrpObj.hasOwnProperty('isBalloonToolTipModeEnable') && layoutGrpObj.isBalloonToolTipModeEnable === 'Y' ? 
                        `if(this['info']){
                        if (this['info']['id']) {
                            this.id = this['info']['id'];
                        }
                        if (this['info']['balloonCallFromList']) {
                            this.balloonCallingFromList = this['info']['balloonCallFromList'];
                        }
                        if(this['info']['redirectUrlForNav']){
                            this.redirectUrl = this['info']['redirectUrlForNav'];
                        }
                        if(this['info']['isPopUpEnabled']){
                            this.isPopUpEnabled = this['info']['isPopUpEnabled'];
                        }
                        this.initializeStatusWorkFlowFields();
                        this.fetchSelectedObject();
                        }` : ``
                    }
                    this.skeletonIntervalId = window.setInterval(() => {
                        this.animation = this.animation === 'pulse' ? 'progress-dark' : 'pulse';
                      }, 5000);    
                    ${balloonUIFunc}
                }               
                ionViewWillEnter() {
                    document.body.setAttribute("class", "linelistinnerdetail");
                }

                ngAfterViewChecked() {
                    this.appUtilityConfig.appendHttpToURL();
                }
                ionViewDidEnter() {
                    var dvHeader = document.querySelector(".detail-view-sub-header");
                    dvHeader.setAttribute("color", "var(--ion-color-primary, #3880ff)");
                    var dvHeaderItem = document.querySelector(
                        ".detail-view-sub-header ion-item"
                    );
                    dvHeaderItem.setAttribute("color", "var(--ion-color-primary, #3880ff)");
                    var dvHeaderListHd = document.querySelectorAll(
                        ".hl-full-detail-content ion-list-header"
                    );
                    var dvHeaderListHdLen = dvHeaderListHd.length;
                    for (var i = 0; i < dvHeaderListHdLen; i++) {
                        dvHeaderListHd[i].setAttribute(
                            "color",
                            "var(--ion-color-primary, #3880ff)"
                        );
                    }
                    var pvHdItembg = document.querySelectorAll(
                        ".detail-view-sub-header ion-badge"
                    );
                    var pvHdItembgLen = pvHdItembg.length;
                    for (var j = 0; j < pvHdItembgLen; j++) {
                        pvHdItembg[j].setAttribute(
                            "background",
                            "var(--ion-color-primary-tint, #4c8dff)"
                        );
                    }
                }
                tabChangeMethod(event, tabGroupId) {
                    console.log("tabChangeMethod");
                }`
                resolve(commonMehtods)
            } catch (err) {
                logger.debug('Error In defaultMethods Due to......', err);
                reject(err);
            }
        })
    },
    gridGridViewController: (layoutgrp, layout, baseCtrlObj, layoutSection, appObject, hierarchy, dbVar, dynaValues) => {
        return new Promise(async (resolve, reject) => {
            try {
                let gridTableSkeleton = {
                    "child": "",
                    "dateFormat": "",
                    "mappingDetails": "",
                    "currencyDetails": ""
                };
                let fetchActionInfo ='';
                let requiredColumn ='';
                let dataUpsert='';
                let mapDataCase ='';
                let mapDataObject ='';
                let {
                    variables: childVariables,
                    formulaFields,
                    requiredColumnForUpsert,
                    fetchActionUpsertInfo,
                    gridTableFieldInfoArray,
                    fetchStatusWfl,
                    fetchInfoAction,
                    statusWorkFlowCommonMethods,
                    statusWorkFlowFields,
                    workFlowMapping,
                    fieldApproverType,
                    comboVar,
                    reportGenerationCode,
                    conditionFormatting,
                    traversalPath,
                    gridColumnDefinitions,
                    gridTableDetails,
                    moreActionJsonFormation,
                    wfApprovalActionView,
                    dataCloneClickAction,
                    moreActionSelected,
                    userAssignmentViewMethods,
                    balloonUiInputMethod,
                    showBalloonLayoutOnMouseOverAndOnClick
                } = dynaValues;
                let formulaFieldsVar=``;
                let objDisplayName='';
                let fetchStatusWflForPreview='';
                let statusWorkFlowVariables='';
                let statusWorkFlowApproveAction=``;
                let statusWorkFlowFlag = false;
                let recordStatusChange =``;
                let associationConfigurationAssignmentForAll =``;
                let associationConfigurationAssignment = ``;
                let parentobjId='';
                for (var linkSet of layout.layoutLinkSet) {
                for (var off = 0; off < appObject.offlineObjectDetails.length; off++) {
                    if (appObject.offlineObjectDetails[off].objectId === linkSet.objectId && (linkSet.objectType==='primary'|| linkSet.objectType==='Header')) {
                        objDisplayName += "'pfm" + appObject.offlineObjectDetails[off].objectId + "' : { 'objectName':'" + appObject.offlineObjectDetails[off].objectName + "','objectDisplayName':'" + appObject.offlineObjectDetails[off].objectDisplayName + "'},";                            
                    }
                }
            }
            let childObjectList ='';
            let parentObjId='';
            let childObjectId='';
            let ChildFetch =``;
            let headerDocItem =``;
            let sectionFormat='';
            let parentObjectTableName=``
            let childObjectTableName=``
            let methods=``
            let upsertFlag = false;
            let associateFun=``;
            for (let linkSets of layout.layoutLinkSet) {
                    if(linkSets.objectType.toUpperCase() === 'HEADER'){
                        mapDataCase += "case 'pfm" + linkSets.objectId + "' : return this.dataObject['" + linkSets.rootPath + "'];";
                        parentObjId =`"Parent":'pfm${linkSets.objectId}'`
                        headerDocItem =`${linkSets.objectId}`
                    }
                    if( linkSets.objectType === 'primary'){                
                        mapDataCase += "case 'pfm" + linkSets.objectId + "' : return this.dataObject['" + linkSets.rootPath + "'];";
                        childObjectId =`"Child":'pfm${linkSets.objectId}'`
                        ChildFetch =`if (this.childObjectList.length > 0) {
                            this.childObjectList.forEach(element => {
                                const childObjectId = element["Child"];
                                const childObjectName = this.objDisplayName[childObjectId]["objectName"];
                                const childDataObject = this.mapDataObject(childObjectId);
                                if (dataJSON[childObjectName]) {
                                    const childObject = dataJSON[childObjectName]
                                    const childObjectValue =  lodash.concat(childObject, childDataObject);
                                    dataJSON[childObjectName] = childObjectValue
                                } else {
                                    dataJSON[childObjectName] = [childDataObject]
                                }
                                })
                        }`
                }
                mapDataObject = `mapDataObject(objectName) { switch (objectName) { ${mapDataCase} } }`;
            }
            childObjectList = `childObjectList = [{ ${parentObjId},${childObjectId}}]`
            for(let i=0; i< layout.layoutSectionSet.length;i++){
                let layoutSectionSet = layout.layoutSectionSet[i];
                if(layoutSectionSet.sectionFor === 'GRID' && layoutSectionSet.sectionFormat !='') {
                    sectionFormat = layoutSectionSet.sectionFormat;
                }
                    for(let j=0;j<layoutSectionSet.sectionElementSet.length;j++){
                        let sectionElement =  layoutSectionSet.sectionElementSet[j];
                        let sectionElementActions;
                        let actionGroupUpsertFlag =false;
                        if (sectionElement.elementType === 'ACTION' && sectionElement.actionType === 'ACTIONS_GROUP') {
                            sectionElementActions = sectionElement.elementActions.filter(elementAction =>elementAction.actionType ==='DATA_UPSERT');
                            actionGroupUpsertFlag = sectionElementActions.length > 0 ? true : false;
                        }
                        if ((sectionElement.elementType=== 'ACTION' && sectionElement.actionType=== 'DATA_UPSERT') || actionGroupUpsertFlag) {
                            if(upsertFlag === false){
                                 upsertFlag = true;
                                 sectionElement =  actionGroupUpsertFlag ?   sectionElementActions[0] : sectionElement;
                            if (sectionElement.hasOwnProperty('layoutActionInfoSet') && sectionElement.layoutActionInfoSet.length > -1) {
                                fetchActionInfo=`public fetchActionUpsertInfo: any = {${fetchActionUpsertInfo}}`
                                requiredColumn =`private requiredColumnForUpsert = {${requiredColumnForUpsert}}`
                                dataUpsert =`
                                ${mapDataObject}
                                ${childObjectList}
                                public objResultMap = new Map<string, any>();
                                dataUpsert_onClick(sourceId) {
                                    if (this.isLoading) {
                                        this.appUtilityConfig.presentToast("Another process is running, please wait");
                                        return
                                    }                            
                                    this.webServiceSaveAction(sourceId)
                                }
                                async webServiceSaveAction(sourceId) {
                                const loading = await this.loadingCtrl.create({ message: "Fetching..." });
                                loading.present();
                                const dataJSON : any = {};
                                const parentDataObject = this.mapDataObject(this.tableName_pfm${headerDocItem});
                                const parentObjectName = this.objDisplayName[this.tableName_pfm${headerDocItem}]["objectName"];
                                dataJSON[parentObjectName] = [parentDataObject]
                                ${ChildFetch}
                                this.dataProvider.saveWebService("Edit", this.fetchActionUpsertInfo[sourceId], dataJSON,
                                    this.requiredColumnForUpsert[sourceId]).then(result => {
                                    loading.dismiss()
                                    this.handleSaveUpsertResponse(result, sourceId)
                                    }).catch(error => {
                                    loading.dismiss()
                                    this.appUtilityConfig.showInfoAlert("Error saving record");
                                    console.log(error);
                                    });
                                }
                            
                                handleSaveUpsertResponse(result, sourceId) {
                                if (result["status"] === "SUCCESS") {
                                    this.handleSaveSuccess()
                                    const dataResult = JSON.parse(result["dataResult"])
                                    const objectKeys = Object.keys(dataResult)
                                    objectKeys.forEach(objectName => {
                                        const dataObjects = dataResult[objectName]
                                        this.checkObjectWithResultRecords(dataObjects, objectName, sourceId)
                                    })
                                } else if (result["status"] === "FAILED") {
                                    const message = result["message"]
                                    this.appUtilityConfig.showInfoAlert(message);
                                } else {
                                    const dataResult = JSON.parse(result["dataResult"])
                                    const objectKeys = Object.keys(dataResult)
                                    objectKeys.forEach(objectName => {
                                        const dataObjects = dataResult[objectName]
                                        this.checkObjectWithResultRecords(dataObjects, objectName, sourceId)
                                    })
                        
                                    const statusInfo = result["statusInfoArray"]
                                    statusInfo.forEach(element => {
                                        if (element["status"] === "SUCCESS") {
                                            this.saveStatusInMapVariable(element["objectId"], element["status"], "", "", "SUCCESS");
                                        } else {
                                            const objectname = this.objDisplayName[element["objectId"]]["objectDisplayName"]
                                            const failureMsg = objectname + "object has failed due to " + element["message"];
                                            this.saveStatusInMapVariable(element["objectId"], "failure", "", "", failureMsg);
                                        }
                                    });
                                    this.makeSaveResultMessage()
                                    return;
                                }
                            }
                        
                            checkObjectWithResultRecords(resultDataObjects, objectName, sourceId) {
                            const requiredColumn = this.requiredColumnForUpsert[sourceId][objectName]
                        
                            const uniqueRequiredColumn = lodash.filter(requiredColumn, function (fieldObject) {
                                return fieldObject["isUnique"] === "Y";
                            });
                        
                            for(let resultObj of resultDataObjects) { 
                                if(resultObj['objSystemAttributes']['Status'] === "Success") {
                                var isUpdate = false;
                                const objectId = this.objectTableMapping.mappingDetail[objectName]
                                const selectedObject = this.mapDataObject(objectId)
                                for(let element of uniqueRequiredColumn) {
                                        if (resultObj[element['fieldName']] != selectedObject[element['fieldName']]) {
                                        isUpdate = false;
                                        break;
                                        } else {
                                        isUpdate = true;
                                        }
                                }
                        
                                if(isUpdate) {
                                    this.updateObjectWithResultRecord(resultObj, selectedObject, requiredColumn)
                                }
                                }
                            }
                            }
                        
                            updateObjectWithResultRecord(resultObj, obj, requiredColumn) {
                            for(let columnObj of requiredColumn) {
                                obj[columnObj['fieldName']] = resultObj[columnObj['fieldName']]
                            }
                            }
                            
                                makeSaveResultMessage() {
                                let errorMsg = "";
                                let successObjectMesg = "";
                                this.objResultMap.forEach((value: any, objectName: string) => {
                            
                                    if (value.status === "SUCCESS") {
                                    const objectDisplayName = this.objDisplayName[objectName]["objectDisplayName"];
                                    if (successObjectMesg === "") {
                                        successObjectMesg = objectDisplayName;
                                    } else {
                                        successObjectMesg = successObjectMesg + "  ," + objectDisplayName;
                                    }
                                    } else {
                                    if (errorMsg === "") {
                                        errorMsg = " " + value.message;
                                    } else {
                                        errorMsg = errorMsg + " ," + value.message;
                                    }
                                    }
                                });
                            
                            
                                if (errorMsg === "") {
                                    this.handleSaveSuccess();
                                    return;
                                }
                                if (successObjectMesg !== "") {
                                    errorMsg = successObjectMesg + " sucessfully saved." + errorMsg;
                                }
                                this.appUtilityConfig.showInfoAlert(errorMsg);
                            
                                }
                            
                                handleSaveSuccess() {
                                this.appUtilityConfig.presentToast("Data saved sucessfully");
                                }
                            
                                saveStatusInMapVariable(tableName, status, id, revId, message) {
                                const resultObject = { "status": status, "id": id, "revId": revId, "message": message };
                                this.objResultMap.set(tableName, resultObject);
                                }`
                            }}   
                        } else if(sectionElement.uiType === 'DROPDOWN' && sectionElement.isStatusWorkflowEnabled ==='Y'){
                            if(sectionElement.isReadOnlyEnable != 'Y') {
                                statusWorkFlowFlag = true;
                                let recordStatusRootpath = sectionElement.rootPath.substring(0,sectionElement.rootPath.lastIndexOf("$$"))
                                if (!recordStatusChange.includes(`!this.dataObject['${recordStatusRootpath}']`)) {
                                    recordStatusChange += `if (!this.dataObject['${recordStatusRootpath}'] && !this.intervalId) {
                                        this.liveListenerHandlerUtils.checkDataObjectAvailablity(this,["${recordStatusRootpath}"]);
                                        return;
                                    }`
                                }
                            }
                            statusWorkFlowApproveAction=`
                            approveAction(selectedStatusField, workFlowUserApprovalStatusDataObject,comment) {
                                    this.WorkFlowUserApprovalStatusDataObject = workFlowUserApprovalStatusDataObject;
                                    this.WorkFlowUserApprovalStatusDataObject['lastmodifiedby'] = this.appUtilityConfig.userId
                                    var userObjectList = this.WorkFlowUserApprovalStatusDataObject['approvalStatus'].filter(userDataObject => userDataObject.userId === this.appUtilityConfig.userId);
                                    var userObject = userObjectList[0]
                                    userObject['userName'] = this.appUtilityConfig.loggedUserName
                                    userObject['statusValue'] = selectedStatusField['statusValue']
                                    userObject['statusLabel'] = selectedStatusField['statusLabel']
                                    userObject['statusType'] = selectedStatusField['statusType']
                                    userObject['approvalExecutionStatus'] = "INPROGRESS"
                                    userObject['execStatusMessage'] = ""
                                    userObject['comment'] = ""
                                    userObject['userComment'] = comment
                                    this.dataProvider.executionDataSave(this.executionDbConfigObject.workFlowUserApprovalStatusObject,
                                        this.WorkFlowUserApprovalStatusDataObject,this.dataSource).then(result => {
                                        if (result['status'] != 'SUCCESS') {
                                            alert("failed")
                                            return;
                                        }
                                        this.appUtilityConfig.presentToast("data saved sucessfully")
                                    })
                                }`
                        }
                        else if(sectionElement.uiType === 'RECORDASSOCIATION'){
                            associateFun=`else {
                                this.cspfmRecordAssociationUtils.fetchAssociationRecords(this.objectHierarchyJSON, this.dataObject, this.dbService).then(res => {
                                  this.isAssociationLoading = false
                                })
                            }`
                            if(sectionElement.recordAssociationMap.recordAssociationOutputType !=='SingleWithMultiple' && sectionElement.recordAssociationMap.recordAssociationOutputType !=='SingleFromMultipleWithSingleStyle1' &&sectionElement.recordAssociationMap.recordAssociationOutputType !=='SingleFromMultipleWithSingleStyle2' ){
                                if(!associationConfigurationAssignment.includes(`this.associationConfiguration[this.__${sectionElement.objectName}$tableName]['${sectionElement.rootPath}']['columnDefinitions'] = this.associationColumnDefinitions['pfm${sectionElement.objectId}_${sectionElement.fieldName}_${sectionElement.elementId}'];`)){
                                    associationConfigurationAssignment += `this.associationConfiguration[this.__${sectionElement.objectName}$tableName]['${sectionElement.rootPath}']['columnDefinitions'] = this.associationColumnDefinitions['pfm${sectionElement.objectId}_${sectionElement.fieldName}_${sectionElement.elementId}'];`
                                }
                            }
                            else{
                                if(!associationConfigurationAssignmentForAll.includes(`this.associationConfiguration[this.__${sectionElement.objectName}$tableName]['${sectionElement.rootPath}']['gridFieldInfo'] = this.gridFieldInfo['pfm${sectionElement.objectId}_${sectionElement.elementName}_${sectionElement.elementId}'];`)){
                                    associationConfigurationAssignmentForAll += `this.associationConfiguration[this.__${sectionElement.objectName}$tableName]['${sectionElement.rootPath}']['gridFieldInfo'] = this.gridFieldInfo['pfm${sectionElement.objectId}_${sectionElement.elementName}_${sectionElement.elementId}'];`
                                }
                            }
                        }
                    }
                
                }
                for (let i = 0; i < layoutSection.parentSectionElementSet.length; i++) {
                    const sectionElement = layoutSection.parentSectionElementSet[i];
                    if (sectionElement.elementType === "FIELD") {
                      //  let objKey = `pfm${sectionElement.objectId}`;
                        var notPrimaryFlag = false;
                        var linkSetNotPrimary =[];
                        const primarySectionObjectId = layoutSection.objectId === 0 ? hierarchy.primary.objectId : layoutSection.objectId;
                        for(let j = 0; j < layout.layoutLinkSet.length; j++){
                            if(layout.layoutLinkSet[j]['objectId'] === sectionElement.objectId){
                                if(layout.layoutLinkSet[j]['objectId'] !== primarySectionObjectId && layout.layoutLinkSet[j].objectType.toUpperCase() !== 'HEADER'){
                                    notPrimaryFlag =true
                                }
                            }
                            if(layout.layoutLinkSet[j].objectType.toUpperCase() !== 'HEADER'){ 
                                linkSetNotPrimary.push(layout.layoutLinkSet[j])
                            }
                        }
                        if(layout.layoutMode !== 'EDIT'){
                            let gridTableO;
                            if(sectionElement.uiType==='RECORDASSOCIATION'){
                                if(layout.layoutMode=== "VIEW" && layout.isDrawerEnable === "Y"){
                                    gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, sectionElement, baseCtrlObj, layout,'','_',"GRID");
                                }
                            }else{
                                gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, sectionElement, baseCtrlObj, layout);
                            }
                            if(notPrimaryFlag){
                                let finalObject;
                                if (!_.isEmpty(gridTableO)) {
                                    finalObject = await fieldInfoJson.getJsonFormation(linkSetNotPrimary, sectionElement.objectId, sectionElement.rootPath, gridTableO, '', {},'');
                                }
                                if(sectionElement.uiType === 'ROLLUPSUMMARY'){
                                    gridTableFieldInfoArray[`pfm${sectionElement.objectId}_${sectionElement.elementName}__r_${sectionElement.elementId}`] = finalObject;                                            
                                }else if(sectionElement.uiType === 'FORMULA'){
                                    gridTableFieldInfoArray[`pfm${sectionElement.objectId}_${sectionElement.elementName}__f_${sectionElement.elementId}`] = finalObject;                                            
                                } else {
                                    gridTableFieldInfoArray[`pfm${sectionElement.objectId}_${sectionElement.elementName}_${sectionElement.elementId}`] = finalObject;
                                }
                            } else {
                                if(sectionElement.uiType === 'ROLLUPSUMMARY'){
                                    gridTableFieldInfoArray[`pfm${sectionElement.objectId}_${sectionElement.elementName}__r_${sectionElement.elementId}`] = gridTableO;                                            
                                }else if(sectionElement.uiType === 'FORMULA'){
                                    gridTableFieldInfoArray[`pfm${sectionElement.objectId}_${sectionElement.elementName}__f_${sectionElement.elementId}`] = gridTableO;                                            
                                } else {
                                    gridTableFieldInfoArray[`pfm${sectionElement.objectId}_${sectionElement.elementName}_${sectionElement.elementId}`] = gridTableO;
                                }
                            }
                        }
                    }
                    if (sectionElement.uiType === 'DROPDOWN' && sectionElement.isStatusWorkflowEnabled === 'Y') {
                        let swfRootPath = sectionElement.rootPath.substring(0,sectionElement.rootPath.lastIndexOf("$$"));
                        fetchStatusWflForPreview += `if (this.dataObject['${swfRootPath}'] && this.dataObject['${swfRootPath}']["${sectionElement.elementName}"] &&  this.${sectionElement.elementName}_${sectionElement.fieldId}_swList[this.dataObject['${swfRootPath}']["${sectionElement.elementName}"]] ) {
                            this.${sectionElement.elementName}_${sectionElement.fieldId}_defaultStatus = this.${sectionElement.elementName}_${sectionElement.fieldId}_swList[this.dataObject['${swfRootPath}']["${sectionElement.elementName}"]].filter(item => {
                                return item['statusValue'] === this.dataObject['${swfRootPath}']["${sectionElement.elementName}"]
                            })[0]
                        } else {
                            this.${sectionElement.elementName}_${sectionElement.fieldId}_defaultStatus = this.${sectionElement.elementName}_${sectionElement.fieldId}_swList[this.${sectionElement.elementName}_${sectionElement.fieldId}_defaultStatusValue][0];
                        }`
                        fieldApproverType[sectionElement.fieldId]="";
                        workFlowMapping[sectionElement.fieldId] = sectionElement.label;
                        if(!statusWorkFlowVariables.includes(`public ${sectionElement.elementName}_${sectionElement.fieldId}_defaultStatusValue = '${sectionElement.statusWorkflowDefaultValue}';`)){
                        statusWorkFlowVariables += `public ${sectionElement.elementName}_${sectionElement.fieldId}_defaultStatusValue = '${sectionElement.statusWorkflowDefaultValue}';
                        public ${sectionElement.elementName}_${sectionElement.fieldId}_defaultStatus = {};
                        public ${sectionElement.elementName}_${sectionElement.fieldId}_status = {};
                        public ${sectionElement.elementName}_statusworkflow_${sectionElement.fieldId} = '';
                        public ${sectionElement.elementName}_${sectionElement.fieldId}_swList = {};`
                      }
                        statusWorkFlowFields +=`this.${sectionElement.elementName}_${sectionElement.fieldId}_swList = this.pfmObjectConfig.objectConfiguration['pfm${sectionElement.objectId}']['workflow']['${sectionElement.elementName}']['configJson'];
                                                this.${sectionElement.elementName}_statusworkflow_${sectionElement.fieldId} = this.pfmObjectConfig.objectConfiguration['pfm${sectionElement.objectId}']['workflow']['${sectionElement.elementName}']['fieldId'];`
                        if(statusWorkFlowCommonMethods === ''){
                            statusWorkFlowCommonMethods += `statusChange(event, selectedStatusField) { 
                                if (selectedStatusField === undefined) {
                                    selectedStatusField = {}
                                }
                                selectedStatusField['statusLabel'] = event['selectedStatus']['statusLabel'];
                                selectedStatusField['statusValue'] = event['selectedStatus']['statusValue'];
                                selectedStatusField['statusType'] = event['selectedStatus']['statusType'];
                                this.approveAction(selectedStatusField, event['workFlowUserApprovalStatusDataObject'],event['comments']);
                            }
                            
                            getApprovalState(event) {
                                if(event['fieldId']){
                                    this.fieldApproverType[event['fieldId']] = this.approverType = event['approverType']
                                }
                            }`
                        }
                         
                    }
                    if (sectionElement.uiType ==='FORMULA') {
                        let displayFormula = `${sectionElement.formulaConfigJson.displayFormula}`; 
                        let replaceQuotesFormula = displayFormula.replace(/"/g, "'"); 
                        formulaFieldsVar =`public pfm${sectionElement.objectId}${sectionElement.elementName}Formula = "${replaceQuotesFormula}";` 
                        if(!formulaFields.includes(formulaFieldsVar)){
                            formulaFields += formulaFieldsVar
                        }
                    }
                    else if(sectionElement.uiType === 'RECORDASSOCIATION'){
                        if(sectionElement.recordAssociationMap.recordAssociationOutputType !=='SingleWithMultiple' && sectionElement.recordAssociationMap.recordAssociationOutputType !=='SingleFromMultipleWithSingleStyle1' &&sectionElement.recordAssociationMap.recordAssociationOutputType !=='SingleFromMultipleWithSingleStyle2' ){
                            if(!associationConfigurationAssignment.includes(`this.associationConfiguration[this.__${sectionElement.objectName}$tableName]['${sectionElement.rootPath}']['columnDefinitions'] = this.associationColumnDefinitions['pfm${sectionElement.objectId}_${sectionElement.fieldName}_${sectionElement.elementId}'];`)){
                                associationConfigurationAssignment += `this.associationConfiguration[this.__${sectionElement.objectName}$tableName]['${sectionElement.rootPath}']['columnDefinitions'] = this.associationColumnDefinitions['pfm${sectionElement.objectId}_${sectionElement.fieldName}_${sectionElement.elementId}'];`
                            }
                        }
                        else{
                            if(!associationConfigurationAssignmentForAll.includes(`this.associationConfiguration[this.__${sectionElement.objectName}$tableName]['${sectionElement.rootPath}']['gridFieldInfo'] = this.gridFieldInfo['pfm${sectionElement.objectId}_${sectionElement.elementName}_${sectionElement.elementId}'];`)){
                                associationConfigurationAssignmentForAll += `this.associationConfiguration[this.__${sectionElement.objectName}$tableName]['${sectionElement.rootPath}']['gridFieldInfo'] = this.gridFieldInfo['pfm${sectionElement.objectId}_${sectionElement.elementName}_${sectionElement.elementId}'];`
                            }
                        }
                    }
                }				
                let variables = balloonUiInputMethod + childVariables + 
                    `public __${hierarchy.primary.objectName}$tableName = this.objectTableMapping.mappingDetail['${hierarchy.primary.objectName}'];
                    ${parentobjId}
                    skeletonIntervalId: number | null = null;
                    animation = 'pulse';
                    public associationConfiguration = {};
                    public tableColumnInfo: { [key: string]: { [key: string]: { [key: string]: FieldInfo } } } = {${gridTableDetails}};
                    public associationColumnDefinitions = {${gridColumnDefinitions}}
                    isBrowser = false;
                    headerenable = false;
                    headerDocItem: any = {};
                    public dataObject = {};
                    public navigationHistoryProperties = {
                        navigatedPagesNameArray: [],
                        navigatedPagesPathArray: [],
                        routerVisLinkTagName: "",
                        secondPreviousPage: "",
                        navigatedPagesLength: 0,
                        previousPage: "",
                        previousPageName: "",
                        secondPreviousPageName: ""
                    };  
                    public isAssociationLoading = true;   
                    private tableName_pfm${layoutSection.parentObjectId} = "pfm${layoutSection.parentObjectId}";        
                    private parentObjLabel = "";
                    private parentObjValue = "";
                    private parentTitle: any = "";
                    public pageTitle = "";
                    public id: any = "";
                    private loading;
                    public intervalId;
                    public redirectUrl = "/";
                    public isFromMenu = false;
                    public showNavigationHistoryPopUp = false;
                    ${traversalPath}
                    public expandParentObjectData:'C' | 'HO' | 'FO' = '${sectionFormat}';
                    public previousGridState;
                    public restrictionRules = []
                    private fieldApproverType =${JSON.stringify(fieldApproverType)};
                    private workFlowMapping = ${JSON.stringify(workFlowMapping)};
                    ${formulaFields}
                    objDisplayName = {${objDisplayName}};
                    ${statusWorkFlowVariables}
                    ${requiredColumn}
                    ${fetchActionInfo}
                    ${dataUpsert}
                    ${dbVar.type === 'webservice' ? `private viewFetchActionInfo: Array<any> = [];
                    public fetchActionInfo: any = ${JSON.stringify(fetchInfoAction)};` : ``}
                `
                let conditionFormatJsonForDetailView = `${layout.layoutConditionalFormatSet && layout.layoutConditionalFormatSet.length !== 0 ?`
                    private conditionalFormatJson: ConditionalFormat = {	
                        layoutId: this.layoutId,	
                        layoutType: '${layout.layoutMode === 'VIEW' ? 'View' : ''}',
                        dataObject: this.dataObject,
                        objectHierarchy: this.objectHierarchyJSON,
                        primaryTraversalPath: '${hierarchy.primary.rootPath}',
                        restrictionRules: this.restrictionRules,
                        fieldInfo: this.gridFieldInfo
                        }`:``}`
                for (let i = 0; i < hierarchy['parent'].length; i++) {
                    const element = hierarchy['parent'][i];
                    if (element.objectId !== hierarchy.primary.objectId) {
                        variables += `public __${element.objectName}$tableName = this.objectTableMapping.mappingDetail['${element.objectName}'];`;
                    }
                    parentObjectTableName += `
                    this.dataObject['${hierarchy.primary.rootPath}'] = result["records"][0];
                    this.cspfmDataTraversalUtilsObject.updateLayoutData(this.dataPaths, this.dataObject['${hierarchy.primary.rootPath}'], this.dataObject, this.layoutId, true);
                    if (this.dataObject['${hierarchy.primary.rootPath}'][this.__${element.objectName}$tableName]) {
                        this.dataObject['${element.rootPath}'] = this.dataObject['${hierarchy.primary.rootPath}'][this.__${element.objectName}$tableName]
                    }
                    `
                }
                for (let i = 0; i < hierarchy['child'].length; i++) {
                    const element = hierarchy['child'][i];
                    if (element.objectId !== hierarchy.primary.objectId) {
                        if(!variables.includes(`public __${element.objectName}$tableName = this.objectTableMapping.mappingDetail['${element.objectName}'];`)){
                            variables += `public __${element.objectName}$tableName = this.objectTableMapping.mappingDetail['${element.objectName}'];`;
                        }
                    }
                    if (element.referenceObjectId === hierarchy.primary.objectId) {
                        childObjectTableName +=`this.dataObject['${element.rootPath}'] = this.dataObject['${hierarchy.primary.rootPath}'][this.dataProvider.getPluralName(this.__${element.objectName}$tableName)][0];`
                    }
                }
                hierarchy.lookup.forEach(lookup => {
                    if(!variables.includes(`public __${lookup.objectName}$tableName = this.objectTableMapping.mappingDetail['${lookup.objectName}'];`)){
                        variables += `public __${lookup.objectName}$tableName = this.objectTableMapping.mappingDetail['${lookup.objectName}'];`;
                    }
                })
                variables += `${comboVar}
                public gridFieldInfo: { [key: string]: FieldInfo } = ${JSON.stringify(gridTableFieldInfoArray)};`
                if (dbVar.type === 'webservice') {
                     methods = `
                     async presentToastWithButton(message: string, closeButtonText: string, dismissCallback: () => void, autoDismissDuration ? : number) {
                        var toastOptions = {
                            message: message,
                            showCloseButton: true,
                            closeButtonText: closeButtonText
                        }
                        if (autoDismissDuration) {
                            toastOptions['duration'] = autoDismissDuration
                        }
                        const toast = await this.toastCtrl.create(toastOptions);
                        toast.onDidDismiss().then((res) => {
                
                            toast.dismiss();
                            dismissCallback();
                        });
                        toast.present();
                    }
                    async fetchSelectedObject() {
                        if (this.viewFetchActionInfo && this.viewFetchActionInfo.length > 0) {
                            this.fetchActionInfo['userSearchParams'] = {
                                'user_parameters': this.viewFetchActionInfo
                            }
                        };
                  
                        const fetchParams = {
                            'fetchActionInfo': this.fetchActionInfo,
                            'layoutId': this.layoutId,
                            'dataSource': appConstant.jsonDBStaticName,
                        }
                        this.dataProvider.querySingleDoc(fetchParams).then(result => {
                           clearInterval(this.skeletonIntervalId);
                           this.isSkeletonLoading = false;
                        if (result["status"] !== "SUCCESS") {
                        this.errorMessageToDisplay = result["message"];
                        if (this.errorMessageToDisplay === "No internet") {
                            this.appUtilityConfig.presentNoInternetToast(this);
                        }
                        return;
                        }
                        if(result['isStreamLimitExceeded']) {
                            this.presentToastWithButton(result['limitExceededMsg'], 'Ok', () => {
                            console.log("user confirmed");
                            }, 10000)
                        }   
                        ${parentObjectTableName}   
                        ${childObjectTableName}     
                        ${layout.layoutConditionalFormatSet && layout.layoutConditionalFormatSet.length !== 0 ?`this.fetchConditionalFormatConfigJSON();`:``}  
                        if (!this.objectHierarchyJSON['isLazyLoadingEnabled']) {
                            this.isAssociationLoading = false
                        } else {
                          this.cspfmRecordAssociationUtils.fetchAssociationRecords(this.objectHierarchyJSON, this.dataObject, this.dbService).then(res => {
                            this.isAssociationLoading = false
                          })
                        }    
                    }).catch(error => {
                        clearInterval(this.skeletonIntervalId);
                            this.isSkeletonLoading = false;
                            console.log(error);
                        });
                    }
                  `
                }
                else{
                 methods = `async fetchSelectedObject() {
                    const additionalObjectdata = {};
                    additionalObjectdata["id"] = this.id;
                    const fetchParams = {
                        objectHierarchyJSON: this.objectHierarchyJSON,
                        additionalInfo: additionalObjectdata,
                        dataSource: appConstant.couchDBStaticName
                    };
                    this.dataProvider
                        .querySingleDoc(fetchParams)
                        .then(async result => {
                            clearInterval(this.skeletonIntervalId);
                            this.dataObject['${hierarchy.primary.rootPath}'] = {};
                            if (result["status"] != "SUCCESS") {
                                this.isSkeletonLoading = false;
                                const errorMessageToDisplay = result["message"];
                                if (errorMessageToDisplay === "No internet") {
                                    this.appUtilityConfig.presentNoInternetToast(this);
                                }
                                ${statusWorkFlowFlag?`this.liveListenerHandlerUtils.clearListenerFetchInterval(this);`: ``}
                                return;
                            }
            
                            ${parentObjectTableName}  
                            ${childObjectTableName}                     
                            ${fetchStatusWfl}
                            ${fetchStatusWflForPreview}
                            ${layout.layoutConditionalFormatSet && layout.layoutConditionalFormatSet.length !== 0 ?`this.conditionalFormatJson['dataObject'] = this.dataObject;
                            await this.cspfmConditionalFormattingUtils.fetchConditionalFormatConfigJSON(this.conditionalFormatJson);`:``}
                            this.isSkeletonLoading = false;
                            if (this.changeRef && !this.changeRef['destroyed'])
                            {
                                this.changeRef.detectChanges();
                            }
                            if (!this.objectHierarchyJSON['isLazyLoadingEnabled']) {
                                this.isAssociationLoading = false
                            }${associateFun}  
                        })
                        .catch(error => {
                            clearInterval(this.skeletonIntervalId);
                            this.isSkeletonLoading = false;
                            ${statusWorkFlowFlag?`this.liveListenerHandlerUtils.clearListenerFetchInterval(this);`: ``}
                            console.log(error);
                        });
                }`
            }
                methods +=`refreshData() {
                    this.fetchSelectedObject();
                }
                registerRecordChangeListener() {
                    if(this.dataSource !== 'JsonDB'){
                        this.appUtilityConfig.addEventSubscriptionlayoutIds(this.dependentObjectList, this.layoutId, this.dataSource);
                      }

                    this.events.subscribe(this.layoutId, (modified) => {
                        try {
                            const isRecordDeleted = this.liveListenerHandlerUtils.handleLiveListenerForDelectedRecords('VIEW', modified, this);
                            if (isRecordDeleted) {
                                return;
                            }
                            ${recordStatusChange}
                            if (this.intervalId) {
                                return;
                            } 
                            var type = modified['doc']['data']['type'];
                            if(this.dataSource !== 'JsonDB') {
                            const layoutInfo = {
                                    "dataObject" : this.dataObject['${hierarchy.primary.rootPath}']
                                }
                                if (this.liveListenerHandlerUtils.handleListenerBasedOnPageType(FetchMode.GRID_FETCH , this.dependentObjectList , modified, layoutInfo)) {
                                    this.fetchSelectedObject();
                                }
                            }
                            if (type === 'pfmstaticreport') {
                                this.handleLiveListenerForReportObjects(modified)
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    });
                }
                initializeStatusWorkFlowFields() 
                {
                    ${statusWorkFlowFields}    
                }
                ngAfterViewInit() {
                    $(document).ready(function () {
                        $(".cs-mat-main-content").on('scroll', function () {
                          window.$('.cs-dropdown-open').jqDropdown('hide', ['.cs-dropdown'])
                        });
                    })
                }
                ngOnDestroy() {
                    ${dbVar.type === 'webservice' ? `` :`
                    this.liveListenerHandlerUtils.unregisterRecordChangeListener(this.dependentObjectList, this.layoutId, this);
                    ${statusWorkFlowFlag?`this.liveListenerHandlerUtils.clearListenerFetchInterval(this);`: ``}
                    `}
                }
                ${statusWorkFlowApproveAction};
                ${reportGenerationCode}
                ${moreActionJsonFormation} 
                ${moreActionSelected}
                ${userAssignmentViewMethods}
                ${statusWorkFlowCommonMethods}
                ${wfApprovalActionView}
                ${dataCloneClickAction}
                ${showBalloonLayoutOnMouseOverAndOnClick}
                associationConfigurationAssignment() {
                    this.associationConfiguration = lodash.cloneDeep(this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]['associationConfiguration']);
                    ${associationConfigurationAssignmentForAll}
                    ${associationConfigurationAssignment}
                }`;
                baseCtrlObj.baseCtrlMap.set("DYNA_METHODS", baseCtrlObj.baseCtrlMap.get("DYNA_METHODS") + methods + conditionFormatting);
                baseCtrlObj.baseCtrlMap.set("WEB_VARIABLES", baseCtrlObj.baseCtrlMap.get("WEB_VARIABLES") + variables + conditionFormatJsonForDetailView)
                resolve();
            } catch (err) {
                logger.debug('Error In  Due to......', err);
                reject(err);
            }
        })
    }
}