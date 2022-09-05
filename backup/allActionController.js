const ctrlActionSegments = require("./controllerMobileActions.js"), 
      actionController = require('./actionController.js'),
      listTableFormation = require("./listTableFormation");
const { moreActionInfoJson } = require("./listTableFormation");

module.exports = {

    navAction: function (baseCtrlObj, buttonType, sectionElementSet, layoutGrpObj, methodName, exeLayoutName, layout, elementId, ltype, hierarchy,MoreactionFlag) {
        return new Promise(function (resolve, reject) {
            try {
                actionforall(baseCtrlObj, buttonType, sectionElementSet, layoutGrpObj, methodName, exeLayoutName, layout, elementId, ltype, hierarchy,MoreactionFlag).then((data) => {
                    logger.debug("allActionController.js :: navAction :: actionforall Done");
                    baseCtrlObj.baseCtrlMap.set("ACTION_METHODS", `${baseCtrlObj.baseCtrlMap.get('ACTION_METHODS')} ${data}`);
                    resolve();
                }).catch((error) => {
                    logger.error("allActionController.js :: navAction :: Error ", error);
                    reject(error);
                });   
            } catch (error) {
                logger.debug("allActionController.js :: navAction :: Error ", error);
                reject(error);
            }
        });
    },
    matrixAction:async function (sectionElement,offlineObjectDetails,hierarchy,gridTableSkeleton,layout,baseCtrlObj,layoutSection) {
        return new Promise(async function (resolve, reject) {
          try {
            let objectOverrided = false;
            const { elementObjectLinkSet } = sectionElement;
            let actionData = sectionElement.actionData;
            let actionInfo = JSON.parse(actionData[0].actionInfo);
            actionInfo.LayoutProperties.forEach(property => {
                if (property && property.propertyKey === "overrideObjectSelection") {
                    objectOverrided = property.fieldDetails[0]['value'];
                }
            });
            let selectionCount =parseInt(actionInfo.LayoutProperties[0].fieldDetails[0].value);
            let matrixActionInfoSet = sectionElement.matrixActionInfoSet;
            let columnArray=[];
            let rowArray = [];
            let fields ='';
            var matrixArray =[];
            let tempHierarchy = hierarchy;
            var gridTableO;
            var referenceElement;
            if (objectOverrided) {
                tempHierarchy = getHierarchySet(elementObjectLinkSet);
            }
            for(let j=0;j<matrixActionInfoSet.length;j++){
                if(matrixActionInfoSet[j].type === 'H'){
                    offlineObjectDetails.forEach(matrixObject=>{
                        if(matrixObject.objectId === matrixActionInfoSet[j].objectId){
                            for(let i=0;i<matrixObject["fields"].length;i++){
                                if(matrixObject["fields"][i].fieldId === matrixActionInfoSet[j].fieldId){
                                    fields = matrixObject["fields"][i];
                                    fields["objectName"]=matrixObject.objectName;
                                }
                            }
                        }
                    })
                    if(tempHierarchy['child'].length !== 0){
                        referenceElement = tempHierarchy['child'].filter(element =>element.objectId === matrixActionInfoSet[j].objectId);
                    }
                    if (tempHierarchy['lookupObjId'].includes(matrixActionInfoSet[j].objectId)) {
                        let tempSectionElement = {
                            ...fields
                        };
                        tempSectionElement['forReadOnly'] = true;
                        let lookupFieldId = elementObjectLinkSet.find(link => link.objectType === 'LOOKUP' && link.objectId === matrixActionInfoSet[j].objectId);
                        tempSectionElement['referenceLookupFieldId'] = lookupFieldId && lookupFieldId.fieldId;
                        gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, tempSectionElement, baseCtrlObj,layout,'',true);
                    } else if (tempHierarchy['parentObjId'].includes(matrixActionInfoSet[j].objectId) || (matrixActionInfoSet[j].objectId !== layoutSection.objectId && tempHierarchy['childObjId'].includes(matrixActionInfoSet[j].objectId))){
                        let tempSectionElement = {
                            ...fields
                        };
                        tempSectionElement['forReadOnlyParent'] = true;
                        gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, tempSectionElement, baseCtrlObj,layout,'',true);                    
                    } 
                    // else if (matrixActionInfoSet[j].objectId !== layoutSection.objectId && tempHierarchy['childObjId'].includes(matrixActionInfoSet[j].objectId)) {
                    //     let tempSectionElement = {
                    //         ...fields
                    //     };
                    //     tempSectionElement['forReadOnlyParent'] = true;
                    //     gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, tempSectionElement, baseCtrlObj,layout,'',true);                                
                    // }
                    else if (layout.layoutMode === 'LIST' && tempHierarchy['childObjId'].includes(matrixActionInfoSet[j].objectId)) {
                        if(referenceElement.length !== 0 && tempHierarchy['primary']['objectId']!== referenceElement[0].referenceObjectId && layout.layoutMode !== 'VIEW'){
                            let referenceObjectId = referenceElement[0].referenceObjectId;
                            let tempSectionElement = {
                              ...sectionElement
                            };
                            tempSectionElement['forReadOnlyChild'] = true;
                            gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, tempSectionElement, baseCtrlObj,layout,referenceObjectId,true);
                        } else {
                            let tempSectionElement = {
                                ...fields
                            };
                            tempSectionElement['forReadOnlyParent'] = true;
                            gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, tempSectionElement, baseCtrlObj,layout,'',true);
                        }
                    } else {
                           gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, fields, baseCtrlObj,layout,'',true);
                    }
                    columnArray.push(gridTableO);
                } else {
                    offlineObjectDetails.forEach(matrixObject=>{
                        if(matrixObject.objectId === matrixActionInfoSet[j].objectId){
                            for(let i=0;i<matrixObject["fields"].length;i++){
                                if(matrixObject["fields"][i].fieldId === matrixActionInfoSet[j].fieldId){
                                    fields = matrixObject["fields"][i];
                                    fields["objectName"]=matrixObject.objectName;
                                }
                            }
                        }
                    })
                    if(tempHierarchy['child'].length !== 0){
                        referenceElement = tempHierarchy['child'].filter(element =>element.objectId === matrixActionInfoSet[j].objectId);
                    }
                    if (tempHierarchy['lookupObjId'].includes(matrixActionInfoSet[j].objectId)) {
                        let tempSectionElement = {
                            ...fields
                        };
                        tempSectionElement['forReadOnly'] = true;
                        let lookupFieldId = elementObjectLinkSet.find(link => link.objectType === 'LOOKUP' && link.objectId === matrixActionInfoSet[j].objectId);
                        tempSectionElement['referenceLookupFieldId'] = lookupFieldId && lookupFieldId.fieldId;
                        gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, tempSectionElement, baseCtrlObj,layout,'',true);
                    } else if (tempHierarchy['parentObjId'].includes(matrixActionInfoSet[j].objectId) || (matrixActionInfoSet[j].objectId !== layoutSection.objectId && tempHierarchy['childObjId'].includes(matrixActionInfoSet[j].objectId))){                    
                        let tempSectionElement = {
                            ...fields
                        };
                        tempSectionElement['forReadOnlyParent'] = true;
                        gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, tempSectionElement, baseCtrlObj,layout,'',true);
                    }
                    // else if (matrixActionInfoSet[j].objectId !== layoutSection.objectId && tempHierarchy['childObjId'].includes(matrixActionInfoSet[j].objectId)) {
                    //     let tempSectionElement = {
                    //         ...fields
                    //     };
                    //     tempSectionElement['forReadOnlyParent'] = true;
                    //      gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, tempSectionElement, baseCtrlObj,layout,'',true);                                
                    // } 
                    else if (layout.layoutMode === 'LIST' && tempHierarchy['childObjId'].includes(matrixActionInfoSet[j].objectId)) {
                        if(referenceElement.length !== 0 && tempHierarchy['primary']['objectId']!== referenceElement[0].referenceObjectId && layout.layoutMode !== 'VIEW'){
                            let referenceObjectId = referenceElement[0].referenceObjectId;
                            let tempSectionElement = {
                              ...sectionElement
                            };
                            tempSectionElement['forReadOnlyChild'] = true;
                            gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, tempSectionElement, baseCtrlObj,layout,referenceObjectId,true);
                        } else {
                            let tempSectionElement = {
                                ...fields
                            };
                            tempSectionElement['forReadOnlyParent'] = true;
                            gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, tempSectionElement, baseCtrlObj,layout,'',true);
                        }
                    } else {
                           gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, fields, baseCtrlObj,layout,'',true);
                    }
                    rowArray.push(gridTableO);
                }
            }
            matrixArray[0] = columnArray;
            matrixArray[1] = rowArray;
            matrixArray[2] = selectionCount;
            resolve(matrixArray)
         } catch (err) {
            logger.debug('Error In matrixAction allActionController Due to......', err);
            reject(err);
         }
        })
    }
};

var actionforall = function (baseCtrlObj, buttonType, sectionElementSet, layoutGrpObj, methodName, actionInfo, layout, elementId, ltype, hierarchy,MoreactionFlag) {
    return new Promise(function (resolve, reject) {
      try {
        const dialogClose = layout.layoutFor === 'WEB' ? `this.dialogRef.close();`: '';
        var navAction = '';
        var attConfig='';
        let searchFlag;
        let dataFetchFlag = '';
        let LayoutProperties = actionInfo.LayoutProperties;
        let redirectionTo = '';
        let enablePopupModel = false;
        let redirectionInputParams = '';
        let redirectionInputParamsFields = '';
        let fieldInfo =[];
        let web_serviceInfo = [];
        let isCustomOutputRequired = false;
        let isURLTooltipRequired = false;
        let urlConfigInfo ='';
        let selectURLFieldInfo =[];
        let balloonActionChanges = `
            if (this.balloonCallingFromList) {
                this.appUtilityConfig.balloonCloseAction();
            }
            else {
                this.events.publish("balloonCloseAfterActionClick");
            }`;
        let checkHeaderAction = (layout.layoutFor === 'WEB' && sectionElementSet.isHeaderAction === 'Y' && layoutGrpObj.hasOwnProperty('isBalloonToolTipModeEnable') && layoutGrpObj.isBalloonToolTipModeEnable === 'Y') ? true: false;
        if(LayoutProperties.length > 0){
            for (let k = 0; k < LayoutProperties.length; k++) {

                if(LayoutProperties[k].propertyKey ==='redirectionTo'){
                    redirectionTo = LayoutProperties[k].fieldDetails[0].redirectionTypeName;
                } else if(LayoutProperties[k].propertyKey ==='enablePopupModel'){
                    enablePopupModel = LayoutProperties[k].fieldDetails[0].value;
                } else if (LayoutProperties[k].propertyKey == "redirectionInputParam") {
                    redirectionInputParams = LayoutProperties[k].fieldDetails;
                    redirectionInputParamsFields = LayoutProperties[k].redirectionInputParamFields
                }
                else if (LayoutProperties[k].propertyKey === "isCustomOutputRequired") {
                    isCustomOutputRequired = LayoutProperties[k].fieldDetails[0]['value'];
                } else if (LayoutProperties[k].propertyKey === "uRLConfigInfo") {
                    if (LayoutProperties[k].fieldDetails[0]) {
                        urlConfigInfo = LayoutProperties[k].fieldDetails[0]['value'];
                    }
                } else if (LayoutProperties[k].propertyKey === "selectURLFieldInfo") {
                    selectURLFieldInfo = LayoutProperties[k].fieldDetails;
                } else if (LayoutProperties[k].propertyKey === "isURLTooltipRequired") {
                    if (LayoutProperties[k].fieldDetails[0]) {
                        isURLTooltipRequired = LayoutProperties[k].fieldDetails[0]['value'];
                    }
                }
            }
        }

        let hierarchyValue = getHierarchySet(layout.layoutLinkSet);
        if (layoutGrpObj != null) {
            searchFlag=(layout.layoutSectionSet).filter(obj=>obj.isSearch == "Y" );
            searchFlag=searchFlag.length!=0? true :false;
        }
            if (buttonType !== 'CALL' && buttonType !== 'MAIL' && buttonType !== 'SHARE' && buttonType !== 'SMS') {
                logger.debug('actionfor call button type get called');
                if (buttonType === 'NEW') {
                    let popupIf = '';
                    let popupClose = '';
                    if (layout.layoutMode === 'VIEW' && layout.layoutFor === 'WEB') {
                        popupClose = `if (this.isPopUpEnabled) {
                            ${dialogClose}
                        }`;
                        popupIf = `if (this.isPopUpEnabled) {
                            if (this.appUtilityConfig.checkPageAlreadyInStack(this.redirectUrl)) {
                                queryParamsRouting['redirectUrl'] = this.redirectUrl;
                            }
                          } else `;
                    }
                    let isPopUpAddNavMethod=''
                    if(enablePopupModel === true){
                        isPopUpAddNavMethod =`
                        ${popupIf !== ''
                        ? `var redirectUrlForNav = '';
                        if (this.isPopUpEnabled) {
                            redirectUrlForNav = this.redirectUrl;
                        } else {
                            redirectUrlForNav = ${checkHeaderAction ? `this.redirectUrl;` : `'/menu/${layout.layoutName}';`}
                        }`
                        : `var redirectUrlForNav = ${checkHeaderAction ? `this.redirectUrl;` : `'/menu/${layout.layoutName}';`}`}
                        const dialogConfig = new MatDialogConfig()
                        const navigationParams = {
                            action: 'Add',
                            parentPage: this,
                            dataSource: appConstant.couchDBStaticName,
                            id: '',
                            redirectUrl: redirectUrlForNav,
                            enablePopUp: 'true'
                        };
                        dialogConfig.data = {
                            params: navigationParams
                        };
                        dialogConfig.panelClass = 'cs-dialoguecontainer-large'
                        this.dialog.open(${redirectionTo}, dialogConfig);`
                    }else{
                        isPopUpAddNavMethod =`
                        const queryParamsRouting = {
                            action: 'Add'
                        };
                        ${popupIf}if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/${redirectionTo}")) {
                            queryParamsRouting['redirectUrl'] = ${checkHeaderAction ? `this.redirectUrl;` : `"/menu/${layout.layoutName}";`}
                        }
                        this.router.navigate(['/menu/${redirectionTo}'], {queryParams: queryParamsRouting, skipLocationChange: true});`
                    }
                    if(layout.layoutMode === 'VIEW' && layout.layoutFor === 'WEB' && layout.layoutType === 'Grid_with_List' && MoreactionFlag) {
                        let parentObjectInfo = layout.layoutLinkSet.find(link => link.objectType.toUpperCase() === 'PRIMARY');
                        isPopUpAddNavMethod =`
                        const queryParamsRouting = {
                            action: 'Add',
                            parentId: this.id,
                            parentObj: JSON.stringify(this.dataObject['${parentObjectInfo.rootPath}']),
                            parentFieldLabel: this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['label'],
                            parentFieldValue: this.parentValue,
                            parentName: this.tableName_pfm${parentObjectInfo.objectId}
                        };
                        ${popupIf}if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/${redirectionTo}")) {
                            queryParamsRouting['redirectUrl'] = "/menu/${layout.layoutName}"
                        }
                        this.router.navigate(['/menu/${redirectionTo}'], {queryParams: queryParamsRouting, skipLocationChange: true});`
                    }
                    navAction = `addButton_${elementId}_Onclick() {${(layoutGrpObj.hasOwnProperty('isBalloonToolTipModeEnable') && layoutGrpObj.isBalloonToolTipModeEnable === 'Y' && checkHeaderAction) ? balloonActionChanges + popupClose : popupClose}${isPopUpAddNavMethod}}`;
                    if (layout.layoutFor === 'WEB' && layout.isDrawerEnable === 'Y' && layoutGrpObj.primaryObjectId === sectionElementSet.objectId) {
                        let parentObjectInfo = layout.layoutLinkSet.find(link => link.objectType.toUpperCase() === 'HEADER');
                        console.log(parentObjectInfo.relationshipType)
                        console.log(layout.layoutName)
                        if (parentObjectInfo.relationshipType === "one_to_many") {
                            if(enablePopupModel === true) {
                            navAction = `addButton_${elementId}_Onclick() {
                                ${(layoutGrpObj.hasOwnProperty('isBalloonToolTipModeEnable') && layoutGrpObj.isBalloonToolTipModeEnable === 'Y' && checkHeaderAction) ? balloonActionChanges : ''}
                                ${popupClose}
                                ${popupIf !== ''
                                    ? `var redirectUrlForNav = '';
                                    if (this.isPopUpEnabled) {
                                        redirectUrlForNav = this.redirectUrl;
                                    } else {
                                        redirectUrlForNav = ${checkHeaderAction ? `this.redirectUrl;` : `'/menu/${layout.layoutName}';`}
                                    }`
                                    : `var redirectUrlForNav = ${checkHeaderAction ? `this.redirectUrl;` : `'/menu/${layout.layoutName}';`}`}
                                    const dialogConfig = new MatDialogConfig()
                                    var navigationParams = {
                                        action: 'Add',
                                        parentObj: JSON.stringify(this.dataObject['${parentObjectInfo.rootPath}']),
                                        parentFieldLabel: this.parentObjLabel,
                                        parentFieldValue: this.parentObjValue,
                                        parentName: this.tableName_pfm${parentObjectInfo.objectId},
                                        parentId: this.dataObject['${parentObjectInfo.rootPath}']['id'],
                                        dataSource: appConstant.couchDBStaticName,
                                        id: '',
                                        redirectUrl: redirectUrlForNav,
                                        enablePopUp: 'true'
                                    };
                                    dialogConfig.data = {
                                        params: navigationParams
                                    }
                                    dialogConfig.panelClass = 'cs-dialoguecontainer-large'
                                    this.dialog.open(${redirectionTo}, dialogConfig);
                                }`;
                            } else {
                                navAction = `addButton_${elementId}_Onclick() {
                                    ${(layoutGrpObj.hasOwnProperty('isBalloonToolTipModeEnable') && layoutGrpObj.isBalloonToolTipModeEnable === 'Y' && checkHeaderAction) ? balloonActionChanges : ''}
                                    ${popupClose}
                                    const queryParamsRouting = {
                                        action: 'Add',
                                        parentObj: JSON.stringify(this.dataObject['${parentObjectInfo.rootPath}']),
                                        parentFieldLabel: this.parentObjLabel,
                                        parentFieldValue: this.parentObjValue,
                                        parentName: this.tableName_pfm${parentObjectInfo.objectId},
                                        parentId: this.dataObject['${parentObjectInfo.rootPath}']['id']
                                    };
                                    ${popupIf}if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/${redirectionTo}")) {
                                        queryParamsRouting['redirectUrl'] = ${checkHeaderAction ? `this.redirectUrl;` : `"/menu/${layout.layoutName}";`}
                                    }
                                    this.router.navigate(['/menu/${redirectionTo}'], {queryParams: queryParamsRouting, skipLocationChange: true});
                                }`;
                            }
                        }
                    }
                    if(searchFlag && layout.layoutFor === "MOBILE"){
                        if (baseCtrlObj.baseCtrlMap.get('SEARCH_LIST_LIST')[0].hasOwnProperty('ACTIONS')) {
                            baseCtrlObj.baseCtrlMap.get('SEARCH_LIST_LIST')[0]["ACTIONS"] += navAction;
                        } else {
                            baseCtrlObj.baseCtrlMap.get('SEARCH_LIST_LIST')[0]["ACTIONS"] = navAction;
                        }   
                    }
                } else if (buttonType === 'EDIT') {
                    let statusWorkFlowenabled = false;
                    let editActionContent = '';
                    let isPopUpEditNavMethod = ``;
                    hierarchy=hierarchyValue;
                    for (let sectionsetdet of layout.layoutSectionSet) {
                        if ((sectionsetdet.sectionType === "BODY" || sectionsetdet.sectionType === "HORIZONTAL") && sectionsetdet.sectionFor == "GRID") {
                            if (layout.isDrawerEnable === 'Y' && layout.layoutFor === 'WEB' && sectionsetdet.objectId === 0) {
                                for (let fieldDetails of sectionsetdet.sectionElementSet) {
                                    if (fieldDetails.isStatusWorkflowEnabled === "Y") {
                                        statusWorkFlowenabled = true;
                                    }
                                }
                            } else {
                                for (let fieldDetails of sectionsetdet.sectionElementSet) {
                                    if (fieldDetails.isStatusWorkflowEnabled === "Y" && fieldDetails.isReadOnlyEnable === "N") {
                                        statusWorkFlowenabled = true;
                                    }
                                }
                            }
                        }
                    }
                    let actionSearchParams = "const actionInfo_View = [";
                    let actionView = ``;
                    if (redirectionInputParams && redirectionInputParams.length > 0) {
                        for (let userParamData of redirectionInputParams) {
                            if (actionView === ``) {
                                actionView += `{
                                    'fieldName': viewParams['fields']['${userParamData.rootPath}']['fieldName'],
                                    'value': ${layout.layoutFor === "MOBILE"?
                                        `this.obj_pfm${layoutGrpObj.primaryObjectId}["${userParamData.fieldName}"]` :
                                        `this.cspfmDataTraversalUtilsObject.parse(this.dataObject['${hierarchy.primary.rootPath}'],viewParams,'${userParamData.rootPath}','value')`},
                                    'fieldId': ${userParamData.fieldId},}`;
                            } else {
                                actionView += `, {
                                    'fieldName': viewParams['fields']['${userParamData.rootPath}']['fieldName'],
                                    'value': ${layout.layoutFor === "MOBILE" ?
                                        `this.obj_pfm${layoutGrpObj.primaryObjectId}["${userParamData.fieldName}"]`:
                                        `this.cspfmDataTraversalUtilsObject.parse(this.dataObject['${hierarchy.primary.rootPath}'],viewParams,'${userParamData.rootPath}','value')`},
                                    'fieldId': ${userParamData.fieldId},}`;
                            }
                        }
                    }
                    actionSearchParams = actionSearchParams + actionView + "]";

                    let statusWorkflowEdit = (editElements) => {
                        let showAlert='';
                        let callingFetchLock=``;
                        if(layout.layoutType ==='Grid_with_List' && layout.layoutMode ==='VIEW' && layout.layoutFor === 'WEB'){
                            showAlert= ``;
                        }else{
                            if(layout.layoutFor !== 'WEB'){
                                showAlert=`async showAlert(messageContent) {

                                    var customAlert = await this.alerCtrl.create({
                                    backdropDismiss: false,
                                    message: messageContent,
                                    buttons: [
                                    
                                    {
                                    text: "OK",
                                    cssClass: "method-color",
                                    handler: () => {
                                    
                                    }
                                    }
                                    ]
                                    });
                                    customAlert.present();
                                    
                                    };`
                            }
                        }
                        // if(hierarchy !== undefined){
                        //     for (let i = 0; i < hierarchy['child'].length; i++) {
                        //         const element = hierarchy['child'][i];
                        //         if (element.objectId !== layoutGrpObj.primaryObjectId) {
                        //             if (element.relationshipType === 'one_to_one' && element.objectType === 'MASTERDETAIL') {
                        //                 callingFetchLock += `
                        //                 else if(${layout.layoutFor === "MOBILE"?`this.obj_pfm${element.objectId}`:`this.dataObject && this.dataObject['${element.rootPath}'] && this.dataObject['${element.rootPath}']`}['systemAttributes'] && this.workFlowMapping && this.cspfmMetaCouchDbProvider){
                        //                     this.appUtilityConfig.fetchLockedUserDetail(this.dataObject['${element.rootPath}'], this.workFlowMapping, this.cspfmMetaCouchDbProvider)
                        //                     return
                        //                 }
                        //                 `
                        //             }
                        //         }
                        //     }
                        // }
                        return navAction = `editButton_${elementId}_Onclick() {
                            // if(${layout.layoutFor === "MOBILE"?`this.obj_pfm${layoutGrpObj.primaryObjectId}`:`this.dataObject && this.dataObject['${hierarchyValue.primary.rootPath}'] && this.dataObject['${hierarchyValue.primary.rootPath}']`}['systemAttributes'] && this.workFlowMapping && this.cspfmMetaCouchDbProvider){
                            //     ${(layout.layoutFor === "MOBILE" || statusWorkFlowenabled == true) ? `this.appUtilityConfig.fetchLockedUserDetail(this.dataObject['${hierarchyValue.primary.rootPath}'], this.workFlowMapping, this.cspfmMetaCouchDbProvider)`:``}
                            //     return
                            // }${callingFetchLock}
                            if (this.isPopUpEnabled) {
                                ${dialogClose}
                            }
                            var redirectUrlForNav = ''
                            if (this.isPopUpEnabled) {
                                redirectUrlForNav = this.redirectUrl;
                            } else {
                                redirectUrlForNav = '/menu/${layout.layoutName}';
                            }
                            ${editElements}						
                        }
                        ${layout.layoutFor === "MOBILE"?`
                        fetchLockedUserDetail() {
                            var systemAttributes = this.obj_pfm${layoutGrpObj.primaryObjectId}['systemAttributes']
                            var userId = systemAttributes['lockedBy']
                            var date = new Date(systemAttributes['lockedDate']);
                            this.metaDbProvider.getUserNameAgainstUserId(userId).then(corUserResult => {
                                if (corUserResult.status !== 'SUCCESS' ||
                                    (corUserResult.status == 'SUCCESS' && corUserResult['records'].length == 0)) {
                                    this.showAlert(userId + "  has locked for " + this.workFlowMapping[this.obj_pfm${layoutGrpObj.primaryObjectId}['systemAttributes']['fieldId']] + " on " + this.datePipe.transform(date, this.appUtilityConfig.userDateTimeFormat));
                                    return
                                }
                                this.showAlert(corUserResult['records'][0]['first_name'] + "  has locked for " + this.workFlowMapping[this.obj_pfm${layoutGrpObj.primaryObjectId}['systemAttributes']['fieldId']] + " on " + this.datePipe.transform(date, this.appUtilityConfig.userDateTimeFormat));
                            }).catch(er => {
                                this.showAlert(userId + "  has locked for " + this.workFlowMapping[this.obj_pfm${layoutGrpObj.primaryObjectId}['systemAttributes']['fieldId']] + " on " + this.datePipe.transform(date, this.appUtilityConfig.userDateTimeFormat));
                            })
                        }
                        approveAction(selectedStatusField, workFlowUserApprovalStatusDataObject, comment) {	
                            this.WorkFlowUserApprovalStatusDataObject = workFlowUserApprovalStatusDataObject;
                            this.WorkFlowUserApprovalStatusDataObject['lastmodifiedby'] = this.appUtilityConfig.userId
                            var userObjectList = this.WorkFlowUserApprovalStatusDataObject['approvalStatus'].filter(userDataObject => userDataObject.userId == this.appUtilityConfig.userId);
                            var userObject = userObjectList[0]
                            userObject['userName'] = this.appUtilityConfig.loggedUserName
                            userObject['userLevel'] = ""
                            userObject['statusValue'] = selectedStatusField['statusValue']
                            userObject['statusType'] = selectedStatusField['statusType']
                            userObject['approvalExecutionStatus'] = "INPROGRESS"
                            userObject['execStatusMessage'] = ""
                            userObject['comment'] = ""
                            userObject['userComment'] = comment
                            this.cspfmexecutionPouchDbProvider.save(this.executionDbConfigObject.workFlowUserApprovalStatusObject, 
                                this.WorkFlowUserApprovalStatusDataObject).then(result => {
                    
                                if (result['status'] != 'SUCCESS') {
                                    alert("failed")
                    
                                    return;
                                }
                                this.appUtilityConfig.presentToast("data saved sucessfully");
                            })
                        }
                        statusChange(event, selectedStatusField) { 
                            if (selectedStatusField == undefined) {
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
                        }`:``} 
                        ${showAlert}`;
                    }
                    if (!ltype && layout.layoutType == 'Grid_with_List' && layout.dataSourceInfo.datasourceType !== 'Webservice') {
                        if(enablePopupModel === true){
                            isPopUpEditNavMethod =`
                            const dialogConfig = new MatDialogConfig()                         
                            const navigationParams = {                            
                                    action: 'Edit',
                                    parentPage: this,
                                    dataSource: appConstant.couchDBStaticName,
                                    id: ${layout.layoutFor === "MOBILE"?`this.obj_pfm${layoutGrpObj.primaryObjectId}`:`this.dataObject['${hierarchyValue.primary.rootPath}']`}["id"],
                                    redirectUrl: redirectUrlForNav,
                                    enablePopUp: 'true'                            
                            };
                            dialogConfig.data = {
                                params: navigationParams
                            }

                            dialogConfig.panelClass = 'cs-dialoguecontainer-large'
                            let checkRecordNotInitiated: boolean = this.appUtilityConfig.checkRecordInitiatedOrNot(this.dataObject, navigationParams,this.pfmObjectConfig['objectConfiguration'],this.cspfmMetaCouchDbProvider);
                            if(checkRecordNotInitiated){
                                this.dialog.open(${redirectionTo}, dialogConfig);
                            }`
                        }else{
                            let cspfmMetaCouchDb= layout.layoutType.toUpperCase() === 'LIST' && layout.layoutMode.toUpperCase() === 'LIST' ? `this.cspfmMetaCouchDbProviderObject`: `this.cspfmMetaCouchDbProvider`;
                            isPopUpEditNavMethod =`
                            let navigationParams = {
                                action: 'Edit',
                                id : ${layout.layoutFor === "MOBILE"?`this.obj_pfm${layoutGrpObj.primaryObjectId}`:`this.dataObject['${hierarchyValue.primary.rootPath}']`}['id'],
                                parentPage: this
                            }
                            if (this.isPopUpEnabled) {
                                if (this.appUtilityConfig.checkPageAlreadyInStack(this.redirectUrl)) {
                                    navigationParams['redirectUrl'] = this.redirectUrl;
                                }
                            } else {                          
                                if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/${redirectionTo}")) {
                                    navigationParams['redirectUrl'] = ${checkHeaderAction ? `this.redirectUrl;` : `"/menu/${layout.layoutName}";`}
                                }
                            }
                            let checkRecordNotInitiated: boolean = this.appUtilityConfig.checkRecordInitiatedOrNot(this.dataObject, navigationParams,this.pfmObjectConfig['objectConfiguration'],${cspfmMetaCouchDb});
                            if(checkRecordNotInitiated){
                                this.router.navigate(["/menu/${redirectionTo}"], {
                                    queryParams: navigationParams,
                                    skipLocationChange: true
                                })
                            }`
                        }
                        navAction = `editButton_${elementId}_Onclick() {
                            ${(layoutGrpObj.hasOwnProperty('isBalloonToolTipModeEnable') && layoutGrpObj.isBalloonToolTipModeEnable === 'Y' && checkHeaderAction) ? balloonActionChanges : ''}
                            if (this.isSkeletonLoading) {
                                this.appUtilityConfig.presentToast("Another process is running, please wait");
                                return
                            }
                            if (this.isPopUpEnabled) {
                                ${dialogClose}
                            }
                            var redirectUrlForNav = ''
                            if (this.isPopUpEnabled) {
                                redirectUrlForNav = this.redirectUrl;
                            } else {
                                redirectUrlForNav = ${checkHeaderAction ? `this.redirectUrl;` : `"/menu/${layout.layoutName}";`}
                            }
                            ${isPopUpEditNavMethod} 
                        }`;
                    } else if(layout.dataSourceInfo.datasourceType == 'Webservice' || layout.dataSourceInfo.datasourceType == 'CSPDataMart'){
                        let cspfmMetaCouchDb= layout.layoutType.toUpperCase() === 'LIST' && layout.layoutMode.toUpperCase() === 'LIST' ? `this.cspfmMetaCouchDbProviderObject`: `this.cspfmMetaCouchDbProvider`;
                        editActionContent =`
                        let viewParams: DataFieldTraversal = ${JSON.stringify(redirectionInputParamsFields)}
                        ${actionSearchParams}
                        const navigationParams = {
                            action:'Edit',
                            viewFetchActionInfo: JSON.stringify(actionInfo_View),
                            redirectUrl: redirectUrlForNav
                        };
                        let checkRecordNotInitiated: boolean = this.appUtilityConfig.checkRecordInitiatedOrNot(this.dataObject, navigationParams,this.pfmObjectConfig['objectConfiguration'],${cspfmMetaCouchDb});
                        if(checkRecordNotInitiated){
                            this.router.navigate(["/menu/${redirectionTo}"], {
                                queryParams: navigationParams,
                                skipLocationChange: true
                            });
                        }`
                        navAction = `editButton_${elementId}_Onclick() {
                            if (this.isPopUpEnabled) {
                                ${dialogClose}
                            }
                            var redirectUrlForNav = ''
                            if (this.isPopUpEnabled) {
                                redirectUrlForNav = this.redirectUrl;
                            } else {
                                redirectUrlForNav = "/menu/${layout.layoutName}";
                            }
                            if (this.isSkeletonLoading) {
                                this.appUtilityConfig.presentToast("Another process is running, please wait");
                                return
                            }                                              
                            ${editActionContent}
                        }`;
                    }else if (!ltype && layout.layoutType == 'Grid'&& layout.dataSourceInfo.datasourceType !== 'Webservice') {
                        if (layout.isDrawerEnable === 'Y') {
                            let parentObjectInfo = layout.layoutLinkSet.find(link => link.objectType.toUpperCase() === 'HEADER');
                            if(enablePopupModel === true){
                                isPopUpEditNavMethod =`
                                const dialogConfig = new MatDialogConfig()
                                const navigationParams = {                                
                                        action: 'Edit',
                                        parentPage: this,
                                        dataSource: appConstant.couchDBStaticName,
                                        id: ${layout.layoutFor === "MOBILE"?`this.obj_pfm${layoutGrpObj.primaryObjectId}`:`this.dataObject['${hierarchyValue.primary.rootPath}']`}["id"],
                                        redirectUrl: redirectUrlForNav,
                                        enablePopUp: 'true'                                    
                                };
                                dialogConfig.data = {
                                    params: navigationParams
                                }
    
                                dialogConfig.panelClass = 'cs-dialoguecontainer-large'
                                let checkRecordNotInitiated: boolean = this.appUtilityConfig.checkRecordInitiatedOrNot(this.dataObject, navigationParams,this.pfmObjectConfig['objectConfiguration'],this.cspfmMetaCouchDbProvider);
                                if(checkRecordNotInitiated){
                                    this.dialog.open(${redirectionTo}, dialogConfig);
                                }`
                            }else{
                                let editId= false;
                                for (let section of layout.layoutSectionSet ) {
                                    if (section.sectionFor === 'GRID' && section.sectionType === 'HORIZONTAL' && section.objectId != 0) {
                                        if(sectionElementSet.objectId === section.objectId){
                                            editId = true ;
                                        }
                                    } 
                                }      
                                isPopUpEditNavMethod =`
                                const navigationParams = {
                                    action: 'Edit',
                                    ${editId === true ?
                                    `id :  ${layout.layoutFor === "MOBILE"?`this.headerDocItem`:`this.dataObject['${parentObjectInfo.rootPath}']`}['id']` : `id : ${layout.layoutFor === "MOBILE"?`this.headerDocItem`:`this.dataObject['${hierarchyValue.primary.rootPath}']`}['id'],
                                    parentObj: JSON.stringify(${layout.layoutFor === "MOBILE"?`this.headerDocItem`:`this.dataObject['${parentObjectInfo.rootPath}']`}),
                                    parentFieldLabel: this.parentObjLabel,
                                    parentFieldValue: this.parentObjValue,
                                    parentId: ${layout.layoutFor === "MOBILE"?`this.headerDocItem`:`this.dataObject['${parentObjectInfo.rootPath}']`}['id'],`}
                                    // redirectUrl: "${layout.layoutName}"
                                }
                                this.toastCtrl.dismiss();
                                if (this.isPopUpEnabled) {
                                    if (this.appUtilityConfig.checkPageAlreadyInStack(this.redirectUrl)) {
                                        navigationParams['redirectUrl'] = this.redirectUrl;
                                    }
                                } else {                          
                                    if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/${redirectionTo}")) {
                                        navigationParams['redirectUrl'] = ${checkHeaderAction ? `this.redirectUrl;` : `"/menu/${layout.layoutName}";`}
                                    }
                                }
                                let checkRecordNotInitiated: boolean = this.appUtilityConfig.checkRecordInitiatedOrNot(this.dataObject, navigationParams,this.pfmObjectConfig['objectConfiguration'],this.cspfmMetaCouchDbProvider);
                                if(checkRecordNotInitiated){
                                    this.router.navigate(["/menu/${redirectionTo}"], { queryParams: navigationParams, skipLocationChange: true });
                                }`
                            }
                            navAction = `editButton_${elementId}_Onclick() {
                                ${(layoutGrpObj.hasOwnProperty('isBalloonToolTipModeEnable') && layoutGrpObj.isBalloonToolTipModeEnable === 'Y' && checkHeaderAction) ? balloonActionChanges : ''}
                                if (this.isPopUpEnabled) {
                                    ${dialogClose}
                                }
                                if (this.isSkeletonLoading) {
                                    this.appUtilityConfig.presentToast("Another process is running, please wait");
                                    return
                                }
                                    var redirectUrlForNav = ''
                                    if(this.isPopUpEnabled){
                                        redirectUrlForNav = this.redirectUrl;
                                    } else {
                                        redirectUrlForNav = ${checkHeaderAction ? `this.redirectUrl;` : `'/menu/${layout.layoutName}';`}
                                    }
                                ${isPopUpEditNavMethod}
                            }`;
                        } else {
                            if(enablePopupModel === true){
                                isPopUpEditNavMethod =`
                                const dialogConfig = new MatDialogConfig()
                                const navigationParams = {                                    
                                        action: 'Edit',
                                        parentPage: this,
                                        dataSource: appConstant.couchDBStaticName,
                                        id: ${layout.layoutFor === "MOBILE"?`this.obj_pfm${layoutGrpObj.primaryObjectId}`:`this.dataObject['${hierarchyValue.primary.rootPath}']`}["id"],
                                        redirectUrl: redirectUrlForNav,
                                        enablePopUp: 'true'                                    
                                };
                                dialogConfig.data = {
                                    params: navigationParams
                                }
                                dialogConfig.panelClass = 'cs-dialoguecontainer-large'
                                let checkRecordNotInitiated: boolean = this.appUtilityConfig.checkRecordInitiatedOrNot(this.dataObject, navigationParams,this.pfmObjectConfig['objectConfiguration'],this.cspfmMetaCouchDbProvider);
                                if(checkRecordNotInitiated){
                                    this.dialog.open(${redirectionTo}, dialogConfig);
                                }`
                            }else{    
                                isPopUpEditNavMethod =`const navigationParams = {
                                    action: 'Edit',
                                    id : ${layout.layoutFor === "MOBILE"?`this.obj_pfm${layoutGrpObj.primaryObjectId}`:`this.dataObject['${hierarchyValue.primary.rootPath}']`}['id'],
                                    parentObj: '',
                                    parentFieldLabel: '',
                                    parentFieldValue: '',
                                    parentId: '',
                                    // redirectUrl: "${layout.layoutName}"
                                }
                                var currentPageUrl = "/menu/${layout.layoutName}";
                                var navPageUrl = "/menu/${redirectionTo}"
                                navigationParams['redirectUrl'] = this.appUtilityConfig.setRedirectUrl(this.isPopUpEnabled, { redirectUrl: this.redirectUrl, currentPageUrl: currentPageUrl, navPageUrl: navPageUrl });
                                this.toastCtrl.dismiss();
                                let checkRecordNotInitiated: boolean = this.appUtilityConfig.checkRecordInitiatedOrNot(this.dataObject, navigationParams,this.pfmObjectConfig['objectConfiguration'],this.cspfmMetaCouchDbProvider);
                                if(checkRecordNotInitiated){
                                    this.router.navigate([navPageUrl], {
                                        queryParams: navigationParams,
                                        skipLocationChange: true
                                        });
                                }`
                            }
                        
                            navAction = `editButton_${elementId}_Onclick() {
                                ${layout.layoutFor === "WEB"?`this.appUtilityConfig.closeDialog(this.isPopUpEnabled, this.dialogRef);`:``}
                                ${(layoutGrpObj.hasOwnProperty('isBalloonToolTipModeEnable') && layoutGrpObj.isBalloonToolTipModeEnable === 'Y' && checkHeaderAction) ? balloonActionChanges : ''}
                                if (this.isSkeletonLoading) {
                                    this.appUtilityConfig.presentToast("Another process is running, please wait");
                                    return
                                }
                                var redirectUrlForNav = ''
                                if(this.isPopUpEnabled){
                                    redirectUrlForNav = this.redirectUrl;
                                } else {
                                    redirectUrlForNav = ${checkHeaderAction ? `this.redirectUrl;` : `'/menu/${layout.layoutName}';`}
                                }
                                ${isPopUpEditNavMethod}
                            }`;
                        }
                    }

                    statusWorkFlowenabled && (layout.layoutType == 'Grid_with_List' || layout.layoutType == 'Grid') && isPopUpEditNavMethod !== '' ? navAction = resolve(statusWorkflowEdit(isPopUpEditNavMethod)) : resolve(navAction);
                } else if ((buttonType === 'VIEW'|| buttonType === 'EDITONCLICK' ) && layout.layoutMode !== 'LIST') {
                    let actionSearchParams = "const actionInfo_View = [";
                    let actionView = ``;
                    var inlineEdit = false;
                    for (let i = 0; i < sectionElementSet.length; i++) {
                        const sectionElement = sectionElementSet[i];
                        if(sectionElement.isInlineEditRequired === 'Y') {
                            inlineEdit = true;
                        }
                    }
                    if (redirectionInputParams && redirectionInputParams.length > 0) {
                        for (let userParamData of redirectionInputParams) {
                            if (actionView === ``) {
                                actionView += `{
                                    'fieldName': viewParams['fields']['${userParamData.rootPath}']['fieldName'],
                                    'value':this.cspfmDataTraversalUtilsObject.parse(selectedObj,viewParams,'${userParamData.rootPath}','value'),
                                    'fieldId': ${userParamData.fieldId},}`;
                            } else {
                                actionView += `, {
                                    'fieldName': viewParams['fields']['${userParamData.rootPath}']['fieldName'],
                                    'value': this.cspfmDataTraversalUtilsObject.parse(selectedObj,viewParams,'${userParamData.rootPath}','value'),
                                    'fieldId': ${userParamData.fieldId},}`;
                            }
                        }
                    }
                    actionSearchParams = actionSearchParams + actionView + "]";
                    let navItem = (path) => {
                         navAction =  `this.router.navigate(["/menu/${redirectionTo}"], { queryParams: queryParamsRouting, skipLocationChange: true });`;
                        if (enablePopupModel) {
                            navAction = `const dialogConfig = new MatDialogConfig()
                            dialogConfig.data = {
                            params: queryParamsRouting
                            };    
                            dialogConfig.panelClass = 'cs-dialoguecontainer-large'
                            let checkRecordNotInitiated: boolean = this.appUtilityConfig.checkRecordInitiatedOrNot(this.dataObject, queryParamsRouting,this.pfmObjectConfig['objectConfiguration'],this.cspfmMetaCouchDbProvider);
                            if(checkRecordNotInitiated){
                                this.dialog.open(${redirectionTo}, dialogConfig);
                            }`;
                        }
                        return ` onItemTap(selectedObj) { 
                                    let viewParams: DataFieldTraversal = ${JSON.stringify(redirectionInputParamsFields)}
                                    ${actionSearchParams}
                                    const queryParamsRouting ={ 
                                        id: selectedObj["id"],
                                        ${buttonType === 'VIEW'?`viewFetchActionInfo: JSON.stringify(actionInfo_View)`:`action:"Edit"`}
                                    };
                                    if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/${redirectionTo}")) {
                                        queryParamsRouting['redirectUrl'] = "/menu/${path}"
                                    }
                                    ${inlineEdit === true ?`if (!this.isdblclicked) {
                                        ${navAction}
                                    }
                                    setTimeout(() => {
                                        this.isnavigated = false;
                                    }, 50)`
                                    : navAction}
                                }`;
                    }
                    navAction = navItem(layout.layoutName);
                    if (baseCtrlObj.baseCtrlMap.get('SEARCH_LIST_LIST').length > 0 && baseCtrlObj.baseCtrlMap.get('SEARCH_LIST_LIST')[0] != undefined) {
                        if (baseCtrlObj.baseCtrlMap.get('SEARCH_LIST_LIST')[0].hasOwnProperty('ACTIONS')) {
                            baseCtrlObj.baseCtrlMap.get('SEARCH_LIST_LIST')[0]["ACTIONS"] += navItem(`${layout.layoutName}`);
                        } else {
                            baseCtrlObj.baseCtrlMap.get('SEARCH_LIST_LIST')[0]["ACTIONS"] = navItem(`${layout.layoutName}`);
                        }
                    }
                } else if(buttonType === 'LIST' && !ltype ){
                    let isPopUpListNavMethod =``;
                    let isPopUpListNavMethodElse =``;
                    let setRedirectUrl = `if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/${redirectionTo}")) {
                        queryParamsRouting['redirectUrl'] = redirectUrlForNav
                    }`;
                    let redirectMtd = `this.router.navigate(["/menu/${redirectionTo}"], { queryParams: queryParamsRouting, skipLocationChange: true });`;
                    if(layout.layoutMode === 'EDIT') {
                        isPopUpListNavMethod=`
                        const stackArray = document.getElementsByTagName('ion-router-outlet')[1].children
                        const layoutToRedirect = this.redirectUrl.replace('/menu/','');
                        if ( stackArray[stackArray.length - 1].tagName.toLowerCase() !== "${redirectionTo}") {`
                        isPopUpListNavMethodElse=`} else {
                            if (this.isPopUpEnabled) {
                                this.appUtilityConfig.navigationDiscardConfirmAlert("", {}, false, this);
                            } 
                        }`;
                        redirectMtd = `
                            if (this.isPopUpEnabled) {
                                this.appUtilityConfig.navigationDiscardConfirmAlert("/menu/${redirectionTo}", queryParamsRouting, false, this);
                            } else {
                                this.router.navigate(["/menu/${redirectionTo}"], { queryParams: queryParamsRouting, skipLocationChange: true });
                            }
                        `;
                    } else if (layout.layoutMode.toUpperCase() === 'VIEW') {
                        isPopUpListNavMethod = `if (this.isPopUpEnabled) {
                            ${dialogClose}
                        }`
                        // redirectUrl = `if (this.isPopUpEnabled) {
                        //     redirectUrlForNav = this.redirectUrl;
                        // } else {
                        //     redirectUrlForNav = '/menu/${layout.layoutName}';
                        // }`;
                        setRedirectUrl = `if (this.isPopUpEnabled) {
                            if (this.appUtilityConfig.checkPageAlreadyInStack(this.redirectUrl)) {
                                queryParamsRouting['redirectUrl'] = this.redirectUrl;
                            }
                        } else {
                            if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/${redirectionTo}")) {
                                queryParamsRouting['redirectUrl'] = ${checkHeaderAction ? `this.redirectUrl;` : `"/menu/${layout.layoutName}";`}
                            }
                        }`
                    }
                    navAction=`
                    listButton_${elementId}_Onclick() {
                        ${(layoutGrpObj.hasOwnProperty('isBalloonToolTipModeEnable') && layoutGrpObj.isBalloonToolTipModeEnable === 'Y' && checkHeaderAction) ? balloonActionChanges : ''}
                        var redirectUrlForNav = '/menu/${layout.layoutName}';
                        ${isPopUpListNavMethod}
                        this.toastCtrl.dismiss();
                        const queryParamsRouting = {};
                        ${setRedirectUrl}
                        ${redirectMtd}
                        ${isPopUpListNavMethodElse}
                    }`;
                } 
                // else if (buttonType === 'NEW') {
                //     navAction = `onItemTap(selectedObj) {
                //         let options = { animate: false };
                //         let itemTapNavigationParams = {
                //             // selectedObject: selectedObj
                //             id: selectedObj['id']
                //         };
                //         this.navCtrl.push(${actionInfo.LayoutProperties[0].fieldDetails[0].layoutName}, itemTapNavigationParams, options);
                //     }`;
                // }
                else if (buttonType === 'MAKE_AS_HEADER' && MoreactionFlag === "MORE") {
                   navAction = `makeAsHeaderAction(classContext : object, objectTraversalPath: string, navigateFrom: string, navigateTo: string) {
                        if (classContext["isSkeletonLoading"]) {
                            this.appUtilityConfig.presentToast("Another process is running, please wait");
                            return
                        }
                        if (classContext["isPopUpEnabled"]) {
                            classContext["dialogRef"].close();
                        }
                        const navigationParameters = {
                            id: classContext["dataObject"][objectTraversalPath]['id'],
                        };
                        if (!this.appUtilityConfig.checkPageAlreadyInStack(navigateTo)) {
                            if (classContext["isPopUpEnabled"]) {
                                navigationParameters['redirectUrl'] = classContext["redirectUrl"];
                            } else {
                                navigationParameters['redirectUrl'] = navigateFrom;
                            }
                        }
                        this.router.navigate([navigateTo], { queryParams: navigationParameters, skipLocationChange: true });
                    }`
                
                }  
                else if (buttonType === 'FILE_MANAGE' && !ltype) {
                    let dataProviderObj= layout.layoutType.toUpperCase() === 'LIST' && layout.layoutMode.toUpperCase() === 'LIST' ? `this.dataProviderObject`: `this.dataProvider`;
                    let bare_storage = baseCtrlObj.baseCtrlMap.get("IMPORTS");
                    let involveObj = []
                    let count = baseCtrlObj.baseCtrlMap.get('FILE_MANAGE');
                    if (!bare_storage.includes("import { attachmentlist } from 'src/core/pages/attachmentlist/attachmentlist';")) {
                        bare_storage += `import { attachmentlist } from 'src/core/pages/attachmentlist/attachmentlist';`
                    }
                    let modalLogic = baseCtrlObj.baseCtrlMap.get("CONSTRUCTOR");
                    let bare_constructor = "";
                    if (!modalLogic.includes('ModalController')) {
                        bare_constructor = modalLogic.replace("constructor(", "constructor(private modalCtrl: ModalController,");
                        baseCtrlObj.baseCtrlMap.set("CONSTRUCTOR", bare_constructor);
                    }
                    let LayoutrootPath = layout.layoutLinkSet.find(objsp => objsp.objectType.toUpperCase() === 'PRIMARY').rootPath;
                    let entryCodeForm = layout.layoutMode == 'EDIT' ?
                    `const dailogdata=this.dialog.open(attachmentlist, dialogConfig);
                dailogdata.afterClosed().subscribe(result => {          
                   this.customField.attachmentAndDocumentInfo(objectIds,this.layoutId,actionElementId,this.dataObject).then(res=>{
                    this.appUtilityConfig.updateFormulaData(this)
                }
              ) });` : `this.dialog.open(attachmentlist, dialogConfig);`
                    baseCtrlObj.baseCtrlMap.set("IMPORTS", bare_storage);
                    if (count < 1 && layout.layoutType!='Grid_with_List') {
                        navAction += `fileManageActionOnClick(actionElementId) {
                        let actionInfo = {
                          "actionElementId": actionElementId,
                        }
                        let objectIds = []
                        let primaryObjects = []
                        actionInfo['fileManageInfo'] = this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]["fileManageInfo"][actionInfo["actionElementId"]]
                        const prominentDataMapping = this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]["fileManageInfo"]["prominentDataMapping"]
                        const fileAttachmentInfo = this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]["fileManageInfo"]["fileAttachmentInfo"]
                        objectIds = Object.keys(actionInfo['fileManageInfo']);
                        Object.keys(actionInfo['fileManageInfo']).forEach(element => {
                            const traversalPath = this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]["objectTraversal"][actionInfo['fileManageInfo'][element]["traversalPath"]]
                            primaryObjects[element] = this.cspfmDataTraversalUtilsObject.getDataObject(this.dataObject['${LayoutrootPath}'], traversalPath)
                        })
                        let dialogConfig = this.appUtilityConfig.showFileManagementPopUp(actionInfo, primaryObjects, objectIds, prominentDataMapping, fileAttachmentInfo, ${dataProviderObj},this.dataObject['${LayoutrootPath}'], this.cspfmDataDisplay)
                        if (dialogConfig) {
                            ${entryCodeForm}
                        }
                      }
                    `
                    }
                    let offlineObjectDetails = baseCtrlObj.baseCtrlMap.get('META_JSON').offlineObjectDetails;
                    for (let a in offlineObjectDetails) {
                        if (offlineObjectDetails[a]['fileManageConfigInfo'].length > 0) {
                            involveObj.push(offlineObjectDetails[a]['objectName'])
                        }

                    }
                    baseCtrlObj.baseCtrlMap.set('FILE_MANAGE', count + 1);
                    baseCtrlObj.baseCtrlMap.set('FILEINVOLVEOBJ', involveObj)
                } else if (buttonType === 'CUSTOM') {
                    let actionInfoSet = sectionElementSet.layoutCustomActionInfoSet;
                    let customActionForeGround ='';
                    let customActionBackGround = '';
                    let customActionInfo = baseCtrlObj.baseCtrlMap.get('META_JSON').appCustomInfo;
                    let customActionData = customActionInfo[0][actionInfoSet[0].customActionInfoId.toString()];

                    if(actionInfoSet[0].processType.toLowerCase()=== 'foreground') {
                        customActionForeGround = `async ${sectionElementSet.elementName}_${sectionElementSet.elementId}_predefined_start() {
                            const result = await this.customActionUtils.initialMethod(this, '${sectionElementSet.elementName}_${sectionElementSet.elementId}', '${actionInfoSet[0].accessOption.toLowerCase()}');
                            if (result['isProcessToTerminate']) {
                              return;
                            }
                            result['actionConfig']['isProcessInitiated'] = true;
                            ${customActionData}
                            this.${sectionElementSet.elementName}_${sectionElementSet.elementId}_predefined_end();
                          }
                        
                          async ${sectionElementSet.elementName}_${sectionElementSet.elementId}_predefined_end() {
                            await this.customActionUtils.endMethod(this, '${sectionElementSet.elementName}_${sectionElementSet.elementId}', '${actionInfoSet[0].accessOption.toLowerCase()}');
                          }`
                          navAction = customActionForeGround;
                    } else {
                        customActionBackGround = `async ${sectionElementSet.elementName}_${sectionElementSet.elementId}_predefined_start() {
                            const result = await this.customActionUtils.initialMethod(this, '${sectionElementSet.elementName}_${sectionElementSet.elementId}', '${actionInfoSet[0].accessOption.toLowerCase()}');
                            if (result['isProcessToTerminate']) {
                              return;
                            }
                            result['actionConfig']['isProcessInitiated'] = false;
                            let backgroundIntervalId = setInterval(async () => {
                              if (!result['actionConfig']['isProcessInitiated']) {
                                result['actionConfig']['isProcessInitiated'] = true;
                                ${customActionData}
                                this.${sectionElementSet.elementName}_${sectionElementSet.elementId}_predefined_end(backgroundIntervalId);
                              }
                            }, 1000);
                          }
                        
                          async ${sectionElementSet.elementName}_${sectionElementSet.elementId}_predefined_end(backgroundIntervalId) {
                            if (backgroundIntervalId) {
                              clearInterval(backgroundIntervalId);
                            }
                            await this.customActionUtils.endMethod(this, '${sectionElementSet.elementName}_${sectionElementSet.elementId}', '${actionInfoSet[0].accessOption.toLowerCase()}');
                          }`
                          navAction = customActionBackGround;
                    }
                }
                else if (buttonType === 'DATA_FETCH' && searchFlag && !isCustomOutputRequired) {
                    dataFetchFlag = 'Data_Fetch';
                    let slickGridFetch = ``;
                    if (layout.layoutFor === 'WEB') {
                        slickGridFetch = `res['records']=this.cspfmCustomFieldProvider.makeSlickGridCustomFields(res['records'], this.columnDefinitions[this.__${hierarchy.objectMapping[hierarchy.primary.objectId]}$tableName]);`
                    }
                    let filterJSONAction = ``;
                    if (layout.layoutFor === 'MOBILE') {
                        filterJSONAction = `async filterJSONAction() {
                            const filterModal = await this.modalCtrl.create(
                                {
                                    component: ${layout.layoutName}_Filter,
                                    componentProps: {
                                        filterFieldWithValues: this.filterFieldWithValues,
                                        filterFieldWithoutValues: this.filterFieldWithoutValues,
                                        filterCustomFieldWithValues: this.filterCustomFieldWithValues,
                                        filterCustomFieldWithoutValues: this.filterCustomFieldWithoutValues,
                                        parentPage: this,
                                        dbProvider: this.dbService,
                                        dataSource: appConstant.jsonDBStaticName 
                                    }
                                });
                            await filterModal.present();
                        }`;
                    }
                    navAction = `
                    ${filterJSONAction}          
                    createSelectorForWebService() {
                        var selector = [];
                
                        //Here Object Name SHould be replace with PFM
                        var dataObjWithUserSelectedValue = this.filterSectionDetail.filterFields['pfm${layoutGrpObj.primaryObjectId}'];
                        var keySet = Object.keys(dataObjWithUserSelectedValue);
                        for (let fieldName of keySet) {
                            var fieldObj = dataObjWithUserSelectedValue[fieldName];
                            var fieldValue = fieldObj['fieldValue']
                            if (fieldValue != '') {
                                var selectorObj = {}
                                selectorObj['fieldName'] = fieldName
                                selectorObj['value'] = fieldValue
                                selectorObj['fieldId'] = fieldObj['fieldId']
                                selector.push(selectorObj)
                            }
                
                        }
                        if (selector.length != 0) {
                            this.filterSectionDetail.filterApplied = true;
                            this.filterJSONResponse(selector);
                        } else {
                            this.filterJSONResponse();
                            this.filterSectionDetail.filterApplied = false;
                        }
                    }
                    ${layout.dataSourceInfo.datasourceType ==='CSPDataMart'?
                    `async dataFetch_${elementId}_Onclick(selector ?) {
                        this.isSkeletonLoading = true;
                        let fetchActionInfo = {};
                    var handledLayoutId = this.layoutId
                    if (selector) {
                        handledLayoutId ='${elementId}' 
                        this.fetchActionInfo = {
                            'paramValue': 'SECTIONELEMENT',
                            "processType": "${sectionElementSet['layoutActionInfoSet'][0]['processType']}",
                            'userSearchParams': {
                                'user_parameters': selector
                            }
                        }
                    } else {
                        this.fetchActionInfo = {
                            'paramValue': 'LAYOUT',
                            "processType": "${sectionElementSet['layoutActionInfoSet'][0]['processType']}",
                        }
                    }

                    const fetchingParams = {
                        'fetchActionInfo': this.fetchActionInfo,
                        'layoutId': handledLayoutId,
                        'dataSource': appConstant.jsonDBStaticName
                };` :`async dataFetch_${elementId}_Onclick(selector ?) {
                    this.isLoading = true;
                    this.isSkeletonLoading = true;
                    let fetchActionInfo = {};
                    if(selector) {
                        fetchActionInfo = {
                            "paramValue": "SECTIONELEMENT",
                            "processType": "${sectionElementSet['layoutActionInfoSet'][0]['processType']}",
                            'userSearchParams' : {
                                'user_parameters' :  selector
                            } 
                        };
                    } else {
                        fetchActionInfo = {
                            "paramValue": "SECTIONELEMENT",
                            "processType": "${sectionElementSet['layoutActionInfoSet'][0]['processType']}"
                        };
                    }
                    
                    const fetchingParams = {
                        'fetchActionInfo' : fetchActionInfo,
                        'layoutId' : ${elementId},
                        'dataSource' : appConstant.jsonDBStaticName
                    };`}
                            this.dataProvider.fetchDataFromDataSource(fetchingParams).then(res => {
                                this.isLoading = false;
                                if (res["status"] === "SUCCESS") {
                                    if (res["records"].length > 0) {
                                        ${slickGridFetch}
                                        const data = lodash.orderBy(res["records"], ["addressline1"], ["asc"]);
                                        this.resultList = data;
                                        this.filteredResultList = this.resultList;
                                        this.slickgridResultList = this.filteredResultList;
                                        this.isSkeletonLoading = false;
                                        this.slickgridUtils.slickgridHeightChange(this.angularGrid.paginationService.itemsPerPage, true, this.filteredResultList, this.gridSearchRowToggle, this.angularGrid, this.filterSectionDetail)
                                        this.angularGrid.resizerService.resizeGrid();
                                    } else {
                                        this.filteredResultList = [];
                                        this.slickgridResultList =[];
                                        this.resultList = [];
                                        this.errorMessageToDisplay = "No Records";
                                        this.isSkeletonLoading = false;
                                    }
                                } else {
                                    this.isSkeletonLoading = false;
                                    this.filteredResultList = [];
                                    this.slickgridResultList =[];
                                    this.resultList = [];
                                    this.errorMessageToDisplay = res["message"];
                                    if (this.errorMessageToDisplay === "No internet") {
                                        this.appUtilityConfig.presentNoInternetToast(this);
                                    } else {
                                        this.appUtilityConfig.showInfoAlert(this.errorMessageToDisplay)
                                    }
                                }
                                if(res['isStreamLimitExceeded']) {
                                    this.presentToastWithButton(res['limitExceededMsg'], 'Ok', () => {
                                        console.log("user confirmed");
                                    }, 10000)
                                }
                                // if (loading) {
                                //     loading.dismiss();
                                // }
                            }).catch(error => {
                                // loading.dismiss();
                                this.isLoading = false;
                                this.isSkeletonLoading = false;
                            });
                        }
    
                        filterJSONResponse(selector ? ) {
                            if (this.isLoading) {
                                this.appUtilityConfig.presentToast("Another process is running, please wait");
                                return
                            }                    
                            this.dataFetch_${elementId}_Onclick(selector);
                         }
                        `;
                    if (layout.layoutFor === 'MOBILE') {
                        if (baseCtrlObj.baseCtrlMap.get('SEARCH_LIST_LIST')[0].hasOwnProperty('ACTIONS')) {
                            baseCtrlObj.baseCtrlMap.get('SEARCH_LIST_LIST')[0]["ACTIONS"] += navAction;
                        } else {
                            baseCtrlObj.baseCtrlMap.get('SEARCH_LIST_LIST')[0]["ACTIONS"] = navAction;
                        }
                    }

                } else if (buttonType === 'DATA_FETCH' && ltype !== 'Grid_with_List-inner' && !isCustomOutputRequired) {
                    dataFetchFlag = 'Data_Fetch';
                    let fetchDataForm= layout.layoutType.toUpperCase() === 'LIST' && layout.layoutMode.toUpperCase() === 'LIST' ? `this.dataProviderObject.fetchDataFromDataSource`: `this.dataProvider.fetchDataFromDataSource`;
                    let cspfmCustomField= layout.layoutType.toUpperCase() === 'LIST' && layout.layoutMode.toUpperCase() === 'LIST' ? `this.cspfmCustomFieldProviderObject.makeSlickGridCustomFields`: `this.cspfmCustomFieldProvider.makeSlickGridCustomFields`;
                    let fetchActionInfo = {
                        "paramValue": "SECTIONELEMENT",
                        "processType":sectionElementSet['layoutActionInfoSet'][0]['processType']
                    };
                    let slickGridFetch = ``;
                    if (layout.layoutFor === 'WEB') {
                        slickGridFetch = `res['records']=${cspfmCustomField}(res['records'], this.columnDefinitions[this.__${hierarchy.objectMapping[hierarchy.primary.objectId]}$tableName]);`
                    }
                    navAction = `
                    filterJSONResponse(selector ? ) {
                        if (this.isLoading) {
                            this.appUtilityConfig.presentToast("Another process is running, please wait");
                            return
                        }                
                        this.dataFetch_${elementId}_Onclick(selector);
                    }
                        async dataFetch_${elementId}_Onclick(selector ?) {
                            this.isLoading = true;
                            this.isSkeletonLoading = true;
                            const fetchingParams = {
                                'fetchActionInfo' : ${JSON.stringify(fetchActionInfo)},
                                'layoutId' : ${elementId},
                                'dataSource' : appConstant.jsonDBStaticName,
                            }
                            ${fetchDataForm}(fetchingParams).then(res => {
                                this.isLoading = false;
                                if (res["status"] === "SUCCESS") {
                                    if (res["records"].length > 0) {
                                        ${slickGridFetch}
                                        const data = lodash.orderBy(res["records"], ["addressline1"], ["asc"]);
                                        this.resultList = data;
                                        this.filteredResultList = this.resultList;
                                        this.slickgridResultList = this.filteredResultList;
                                        this.isSkeletonLoading = false;
                                    } else {
                                        this.filteredResultList = [];
                                        this.slickgridResultList =[];
                                        this.resultList = [];
                                        this.errorMessageToDisplay = "No Records";
                                        this.isSkeletonLoading = false;
                                    }
                                } else {
                                    this.isSkeletonLoading = false;
                                    this.filteredResultList = [];
                                    this.slickgridResultList =[];
                                    this.resultList = [];
                                    this.errorMessageToDisplay = res["message"];
                                    if (this.errorMessageToDisplay === "No internet") {
                                        this.appUtilityConfig.presentNoInternetToast(this);
                                    }
                                }
                                // if (loading) {
                                //     loading.dismiss();
                                // }
                                if(res['isStreamLimitExceeded']) {
                                    this.presentToastWithButton(res['limitExceededMsg'], 'Ok', () => {
                                       console.log("user confirmed");
                                    }, 10000)
                                }
                            }).catch(error => {
                                // loading.dismiss();
                                this.isLoading = false;
                                this.isSkeletonLoading = false;
                            });
                        }
                        `;
                }  else if (buttonType === 'DATA_FETCH' && isCustomOutputRequired && layout.layoutFor === 'WEB') {
                    let dataProviderObj= layout.layoutType.toUpperCase() === 'LIST' && layout.layoutMode.toUpperCase() === 'LIST' ? `this.dataProviderObject`: `this.dataProvider`;
                    for (let kt = 0; kt < selectURLFieldInfo.length; kt++) {
                        let fieldDetail = {};
                        if (urlConfigInfo === 'SINGLE_URL') {
                            fieldDetail = {
                                "fieldName": selectURLFieldInfo[kt].fieldName
                            }
                        } else {
                            fieldDetail = {
                                "fieldName": selectURLFieldInfo[kt].fieldName,
                                "urlFieldType": selectURLFieldInfo[kt].urlFieldType
                            }
                        }
                        // if(layout.layoutType === 'Grid_with_List' || (layout.layoutType === 'Grid' && layout.isDrawerEnable === 'N')) {
                            if(hierarchyValue.primary.objectId !==Number(selectURLFieldInfo[kt].objectId)){
                                fieldDetail["child"] = {};
                                fieldDetail["child"]["objectId"] = `pfm${selectURLFieldInfo[kt].objectId}`
                            }
                        // } else if(layout.isDrawerEnable === 'Y') {
                        //     if(hierarchyValue.childObjId.includes(Number(selectURLFieldInfo[kt].objectId))){
                        //         fieldDetail["child"] = {};
                        //         fieldDetail["child"]["objectId"] = `pfm${selectURLFieldInfo[kt].objectId}`
                        //     }
                        // }
                        fieldInfo.push(fieldDetail);
                    }

                    for(let userParam of actionInfo.userParamData){
                        let traversal_Path = layout.layoutLinkSet.filter(ele => ele.objectId === userParam.objectId)[0].rootPath;
                        let param={
                            "fieldId":userParam.targetId,
                            "fieldName":userParam.targetName,
                            "objectId":`pfm${userParam.objectId}`,
                            "traversalPath":traversal_Path
                        }                              
                        web_serviceInfo.push(param)
                    }
                    
                    navAction =
                    `urlDataFetch_${elementId}_Onclick() {
                        let htmlElement: HTMLElement = document.getElementById('cs-dropdown-' + this.layoutId);
                        if (htmlElement && htmlElement.innerHTML) {
                            htmlElement.innerHTML = '';
                        }
                        this.isCustomFetchLoading = true;
                        let urlConfig = {
                            "type": '${urlConfigInfo}',
                            "isTooltipVisible": ${isURLTooltipRequired},
                            "fieldInfo": ${JSON.stringify(fieldInfo)}
                        };
                        let webserviceinfo = ${JSON.stringify(web_serviceInfo)};
                        let actionInfo_View = this.appUtilityConfig.prepareFetchActionInfo(webserviceinfo, this.dataObject);
                        let fetchActionInfo = {
                            "paramValue": "SECTIONELEMENT",
                            "processType": '${sectionElementSet['layoutActionInfoSet'][0]['processType']}',
                            'userSearchParams': {
                                'user_parameters': actionInfo_View
                            }
                        };
                        const fetchingParams = {
                            'fetchActionInfo': fetchActionInfo,
                            'layoutId': ${elementId},
                            'dataSource': appConstant.jsonDBStaticName
                        };
                        ${dataProviderObj}.fetchDataFromDataSource(fetchingParams).then(res => {
                            if (res['isStreamLimitExceeded']) {
                                this.presentToastWithButton(res['limitExceededMsg'], 'Ok', () => {
                                    console.log("user confirmed");
                                }, 10000)
                            }                
                            this.isCustomFetchLoading = false;
                            if (res["status"] === "SUCCESS") {
                                this.appUtilityConfig.displayPopover(res, this.cspfmDataDisplay, this.layoutId, this.objectHierarchyJSON["objectName"], urlConfig);
                            } else {
                                // this.isSkeletonLoading = false;
                                this.errorMessageToDisplay = res["message"];
                                if (this.errorMessageToDisplay === "No internet") {
                                    this.appUtilityConfig.presentNoInternetToast(this);
                                } else {
                                    this.errorMessageToDisplay = this.errorMessageToDisplay || 'Getting null message from response, kindly verify the dataobject execution.'
                                    this.appUtilityConfig.showInfoAlert(this.errorMessageToDisplay)
                                }                
                                return;
                            }
                        }).catch(error => {
                            this.isCustomFetchLoading = false;
                            this.appUtilityConfig.presentToast('No record found');
                        });
                    }`;
                } else if (buttonType === 'DATA_UPSERT'){
                    if(layout.layoutMode === 'VIEW' && layout.layoutFor !== 'WEB'){
                        let mapDataObject  ='';  
                        let mapDataCase ='';    
                        let childObjectList ='';
                        let parentObjId='';
                        let childObjectId='';
                        let ChildFetch =``;
                        let parentTable =``;
                        let primaryId =`${layoutGrpObj.primaryObjectId}`
                        let dataUpsertFunc ='';
                        let childObjList =``;
                        for (var linkSet of layout.layoutLinkSet) {
                            if(layout.layoutType === 'Grid' && layout.isDrawerEnable === 'Y') {
                                if(linkSet.objectType === 'primary') {
                                    childObjectId =`"Child":'pfm${linkSet.objectId}'`
                                    mapDataCase += "case 'pfm" + linkSet.objectId + "' : return this.obj_pfm" + linkSet.objectId + ";";
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
                                }  else if(linkSet.objectType === 'Header'){
                                    mapDataCase += "case 'pfm" + linkSet.objectId + "' : return this.headerDocItem;";
                                    parentObjId =`"Parent":'pfm${linkSet.objectId}'`
                                    primaryId =`${linkSet.objectId}`
                                    parentTable =`private tableName_pfm${linkSet.objectId} = "pfm${linkSet.objectId}";`
                                } 
                                    mapDataObject = `mapDataObject(objectName) { switch (objectName) { ${mapDataCase} } }`;
                            } else {
                                if(linkSet.objectType !== 'LOOKUP'){                
                                    mapDataCase += "case 'pfm" + linkSet.objectId + "' : return this.obj_pfm" + linkSet.objectId + ";";
                                    mapDataObject = `mapDataObject(objectName) { switch (objectName) { ${mapDataCase} } }`;
                                }
                                if(linkSet.objectType === 'MASTERDETAIL') {
                                    childObjectId =`"Child":'pfm${linkSet.objectId}'`
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
                                }  else if(linkSet.objectType === 'primary'){
                                    parentObjId =`"Parent":'pfm${linkSet.objectId}'`
                                }
                            }
                            
                            childObjList += `{ ${parentObjId},${childObjectId}},`
                        }
                        
                        childObjectList = `[${childObjList}]`
                        if(baseCtrlObj.baseCtrlMap.get('DATA_UPSERT') != '' && baseCtrlObj.baseCtrlMap.get('DATA_UPSERT') != undefined) {
                            logger.debug("Already has content ");
                            dataUpsertFunc = baseCtrlObj.baseCtrlMap.get('DATA_UPSERT');
                        } else {
                        dataUpsertFunc =`
                        ${parentTable}
                        public objResultMap = new Map<string, any>();

                         // Webservice Provider Save    
                        childObjList = ${childObjectList}
                        public childObjectList =this.childObjList.slice(1)
                        dataUpsert_OnClick(sourceId) {
                            if (this.isLoading) {
                                this.appUtilityConfig.presentToast("Another process is running, please wait");
                                return
                            }                    
                            this.webServiceSaveAction(sourceId)
                        }
                         //  WebService Provider Save
                      async webServiceSaveAction(sourceId) {
                        const loading = await this.loadingCtrl.create({ message: "Fetching..." });
                        loading.present();
                        const dataJSON : any = {};
                        const parentDataObject = this.mapDataObject(this.tableName_pfm${primaryId});
                        const parentObjectName = this.objDisplayName[this.tableName_pfm${primaryId}]["objectName"];
                        dataJSON[parentObjectName] = [parentDataObject]
                        ${ChildFetch}
                        this.dataProvider.saveWebService("Edit", this.fetchActionUpsertInfo[sourceId], dataJSON,
                          this.requiredColumnForUpsert[sourceId]).then(result => {
                            loading.dismiss()
                            this.handleSaveUpsertResponse(result, sourceId)
                          }).catch(error => {
                            loading.dismiss()
                            this.showInfoAlert("Error saving record");
                            console.log(error);
                          });
                      }
                    
                      //  WebService Provider Save
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
                            this.showInfoAlert(message);
                        } else {
                            // Set Response Data in DataObject
                            const dataResult = JSON.parse(result["dataResult"])
                            const objectKeys = Object.keys(dataResult)
                            objectKeys.forEach(objectName => {
                                const dataObjects = dataResult[objectName]
                                this.checkObjectWithResultRecords(dataObjects, objectName, sourceId)
                            })
                
                            // Show Success/Failure Status
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
                
                    // Webservice Provider Save - Comparing object with Result records with Unique fields
                  checkObjectWithResultRecords(resultDataObjects, objectName, sourceId) {
                    const requiredColumn = this.requiredColumnForUpsert[sourceId][objectName]
                
                    const uniqueRequiredColumn = lodash.filter(requiredColumn, function (fieldObject) {
                      return fieldObject["isUnique"] === "Y";
                    });
                
                    for(let resultObj of resultDataObjects) { 
                      if(resultObj['objSystemAttributes']['Status'] == "Success") {
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
                
                  // Webservice Provider Save - Updating object with compared Result record
                  updateObjectWithResultRecord(resultObj, obj, requiredColumn) {
                    for(let columnObj of requiredColumn) {
                      obj[columnObj['fieldName']] = resultObj[columnObj['fieldName']]
                    }
                  }
                
                    
                      // Webservice Provider Save - Method to map data object
                      ${mapDataObject}
                    
                       // Webservice Provider Save - Method to make save result message
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
                        this.showInfoAlert(errorMsg);
                    
                      }
                    
                      // Webservice Provider Save - Method to handle save success
                      handleSaveSuccess() {
                        this.appUtilityConfig.presentToast("Data saved sucessfully");
                        // this.navigatePopUpAction();
                      }
                    
                      // Webservice Provider Save - Method to map variable status
                      saveStatusInMapVariable(tableName, status, id, revId, message) {
                        const resultObject = { "status": status, "id": id, "revId": revId, "message": message };
                        this.objResultMap.set(tableName, resultObject);
                      }
                       // Webservice Provider Save - Method to custom alert
                       showInfoAlert(info) {
                        this.alerCtrl.create({
                          message: info, subHeader: "",
                          buttons: [
                            {
                              text: 'Ok',
                              handler: () => {
                                console.log('Confirm Okay');
                              }
                            }
                          ]
                        }).then(alert =>
                          alert.present());
                      }
                    `
                        }
                            baseCtrlObj.baseCtrlMap.set('DATA_UPSERT', dataUpsertFunc);
                    } else return
                } else if (buttonType === 'REPORT' || buttonType === 'PRINTER') {
                    const reportAction = buttonType === 'REPORT' ? 'View' : 'Print';
                    const propertyInfo = {
                        isVisiblePageData: 'Y',
                        reportFormat: '',
                        templateName: '',
                    };
                    actionInfo.LayoutProperties.forEach(property => {
                        if (property.propertyKey === "format") {
                            propertyInfo['reportFormat'] = property.fieldDetails[0]['value'];
                        } else if (property.propertyKey === "velocityTemplate") {
                            propertyInfo['templateName'] = property.fieldDetails[0]['value'];
                        } else if (property.propertyTitle === "Override Object Selection") {
                            if (layout.dataSourceInfo.datasourceType !== 'Webservice' && layout.dataSourceInfo.datasourceType !== 'CSPDataMart') {
                                propertyInfo['isVisiblePageData'] = property.fieldDetails[0]['value'] ? 'N' : 'Y';
                            }
                        } else if (property.propertyKey === "enableOndemandGeneration") {
                            propertyInfo['onDemandReportGneration'] = property.fieldDetails[0]['value'] ? 'Y' : 'N';
                        }
                    });
                    propertyInfo['elementId'] = elementId;
                    propertyInfo['hierarchyJson'] = sectionElementSet.elementObjectHierarchyJson ? sectionElementSet.elementObjectHierarchyJson : {};
                    const jsonVar = `"${propertyInfo.elementId}" : {
                        "action": "${reportAction}",
                        "isVisiblePageData": "${propertyInfo.isVisiblePageData}",
                        "reportFormat": "${propertyInfo.reportFormat}",
                        "templateName": "${propertyInfo.templateName}",
                        "onDemandReportGneration": "${propertyInfo['onDemandReportGneration']}",
                        "elementId": ${propertyInfo.elementId},
                        "isLoading": false,
                        "hierarchyJson": ${JSON.stringify(propertyInfo['hierarchyJson'])}
                    }`;
                    if (buttonType === 'REPORT') {
                        let reportVar = baseCtrlObj.baseCtrlMap.get('REPORT_ACTION');
                        if (reportVar === '') {
                            reportVar = jsonVar;
                        } else {
                            reportVar += `, ${jsonVar}`;
                        }
                        baseCtrlObj.baseCtrlMap.set('REPORT_ACTION', reportVar);
                    } else {
                        let reportVar = baseCtrlObj.baseCtrlMap.get('PRINT_ACTION');
                        if (reportVar === '') {
                            reportVar = jsonVar;
                        } else {
                            reportVar += `, ${jsonVar}`;
                        }
                        baseCtrlObj.baseCtrlMap.set('PRINT_ACTION', reportVar);
                    }
                }
                if (searchFlag) {
                    let dataFetchAction ='';
                    if (layout.layoutFor === 'MOBILE') {
                         if (baseCtrlObj.baseCtrlMap.get('SEARCH_LIST_LIST')[0]["DATAFETCH"] != '' && baseCtrlObj.baseCtrlMap.get('SEARCH_LIST_LIST')[0]["DATAFETCH"] != undefined) {
                            logger.debug("Already has content in SEARCH_LIST_LIST");
                            dataFetchAction = baseCtrlObj.baseCtrlMap.get('SEARCH_LIST_LIST')[0]["DATAFETCH"];
                        } 
                        // else {
                        //     dataFetchAction = `
                        //         dataFetchNewMethod(info) {
                        //             if(info === "${dataFetchFlag}") {
                        //                 ${dataFetchFlag === 'Data_Fetch' ? 'this.createSelectorForWebService();':''}
                        //                 return 'success';    
                        //             } else {
                        //                 return 'failed';
                        //             }
                        //         }`;
                        // }
                            baseCtrlObj.baseCtrlMap.get('SEARCH_LIST_LIST')[0]["DATAFETCH"] = dataFetchAction;
                    } else {
                         if (baseCtrlObj.baseCtrlMap.get('WEB_DATA_FETCH') != '' && baseCtrlObj.baseCtrlMap.get('WEB_DATA_FETCH') != undefined) {
                            logger.debug("Already has content in SEARCH_LIST_LIST");
                            dataFetchAction = baseCtrlObj.baseCtrlMap.get('WEB_DATA_FETCH');
                        }
                        //  else {
                        //     dataFetchAction = `
                        //         dataFetchNewMethod(info) {
                        //             if(info === "${dataFetchFlag}") {
                        //                 ${dataFetchFlag === 'Data_Fetch' ? 'this.createSelectorForWebService();':''}
                        //                 return 'success';    
                        //             } else {
                        //                 return 'failed';
                        //             }
                        //         }`;
                        // }
                       // if (baseCtrlObj.baseCtrlMap.get('WEB_DATA_FETCH')) {
                        baseCtrlObj.baseCtrlMap.set('WEB_DATA_FETCH', dataFetchAction);
                    }
                }
                resolve(navAction);
            } else if (ltype !== 'Grid_with_List-inner' && sectionElementSet.actionType === 'CALL') {
                ctrlActionSegments.callAction(sectionElementSet, layoutGrpObj, methodName, layout.layoutMode).then((data) => {
                    resolve(data);
                });
            } else if (layout.layoutFor !== "WEB" && ltype !== 'Grid_with_List-inner' && sectionElementSet.actionType === 'MAIL') {
                ctrlActionSegments.emailAction(sectionElementSet, layoutGrpObj, methodName, layout.layoutMode).then((data) => {
                    resolve(data);
                });
            } else if (ltype !== 'Grid_with_List-inner' && sectionElementSet.actionType === 'SMS') {
                ctrlActionSegments.smsAction(sectionElementSet, layoutGrpObj, methodName, layout.layoutMode).then((data) => {
                    resolve(data);
                });
            } else if (ltype !== 'Grid_with_List-inner' && sectionElementSet.actionType === 'SHARE') {
                ctrlActionSegments.shareAction(sectionElementSet, layoutGrpObj, methodName, layout.layoutMode).then((data) => {
                    resolve(data);
                });
            } else {
                resolve("");
            }
        } catch (error) { 
            logger.debug("allActionController.js :: actionforall :: Error ", error)
            reject(error);
        }
    });
}


const getHierarchySet = (linkSet) => {
  try{
    const hierarchy = {
        "primary": "",
        "child": [],
        "parent": [],
        "lookup": [],
        "lookupObjId": [],
        "parentObjId": [],
        "childObjId": []
    };
    linkSet.forEach(link => {
        if (link.objectType.toUpperCase() === 'PRIMARY') {
            let objDetail = {...link}
            hierarchy["primary"] = objDetail;
        } else if (link.objectType.toUpperCase() === 'LOOKUP') {
            let objDetail = {...link}
            hierarchy["lookup"].push(objDetail);
            hierarchy['lookupObjId'].push(objDetail.objectId)
        } else if (link.objectType.toUpperCase() === 'HEADER') {
            let objDetail = {...link}
            hierarchy["parent"].push(objDetail);
            hierarchy['parentObjId'].push(objDetail.objectId)
        } else if (link.objectType.toUpperCase() === 'MASTERDETAIL') {
            let objDetail = {...link}
            hierarchy["child"].push(objDetail);
            hierarchy['childObjId'].push(objDetail.objectId)
        }
    });
    return hierarchy;
 } catch(err){
    logger.debug("Error in getHierarchySet allActionController=====>",err);
    throw err;
 }
}
