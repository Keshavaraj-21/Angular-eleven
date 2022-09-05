var popupAction = require('../../../core/common.js'); 
var fieldInfoJson = require("../../ioniccomponents/controllercomponents/fieldInfoJsonFormation");


module.exports = {

    dataTableArrayFormation:async(gridTableSkeleton, fieldDetailsObj, baseObj,layout,referenceObjectId,matrixEnabled,type,hierarchy) =>{
      try{
        if(matrixEnabled){
            var {
                label,
                fieldName,
                fieldType,
                isStatusWFEnabled: isStatusWorkflowEnabled,
                optionSelectedValue,
            } = fieldDetailsObj;
        } else {
            var {
                translationKey: label,
                fieldName,
                fieldType,
                elementType,
                actionType,
                elementActions,
                isStatusWorkflowEnabled,
                optionSelectedValue,
                hierarchy,
                listSWF
            } = fieldDetailsObj;
        }
        if(fieldName){
            fieldName = fieldName.toLowerCase();
        }
        if(fieldType === 'DROPDOWN' && isStatusWorkflowEnabled === 'Y' && listSWF){
            fieldType = 'STATUSWORKFLOW'
        }
        let appObject = baseObj.baseCtrlMap.get("META_JSON");
        let actionInfo=[];
        let multiActioninfo={};
        let keyValue = '';
        const data = {
            "levelObjectId" : [],
            "levelCount" : 0
        };
        label= matrixEnabled?label:fieldDetailsObj.isTitleRequired==='Y'? label : '';
        if (!appObject.popupCheck) {
            var commonobj = await popupAction.getWebLayoutPopupdetails(appObject.popupInfo, fieldDetailsObj.lookupId, true,'',appObject.offlineObjectDetails);
        } else {
            label = fieldDetailsObj.label
        }
        if(elementType === 'ACTION' && actionType === 'ACTIONS_GROUP'){
            await popupAction.displayOrderSort(elementActions);
            for (let i = 0; i < elementActions.length; i++) {
                const multiActions = elementActions[i];
                let LayoutPropertiesElement = JSON.parse(multiActions.actionData[0].actionInfo).LayoutProperties;
                let enablePopupModel = false;
                for(let k = 0; k < LayoutPropertiesElement.length; k++){
                     if (LayoutPropertiesElement[k].propertyKey === 'enablePopupModel') {
                        enablePopupModel = LayoutPropertiesElement[k].fieldDetails[0].value;
                   }
                }
                label= multiActions.isTitleRequired==='Y'? label : '';
                    multiActioninfo ={
                        "isHiddenEnabled":multiActions.isHiddenEnabled,
                        "actionIcon": multiActions.actionType === 'DATA_CLONE' ? 'icon-mat-file_copy' : multiActions.icon,
                        "actionName": multiActions.elementName,
                        "actionType": multiActions.actionType,
                        "actionLabel": multiActions.label,
                        "sourceId"  : multiActions.actionType === 'FILE_MANAGE' ? `${multiActions.elementId}` : multiActions.elementId,
                        "actionDisplayType":multiActions.actionDisplayType, 
                        "objectName":"",
                        "boxStyle": multiActions.boxStyle, 
                        "labelStyle": multiActions.labelStyle, 
                        "valueStyle": multiActions.valueStyle 
                    };
                    if(multiActions.actionType === 'WORKFLOW'){
                        let wfActionInfo = '';
                        let workflowAction = multiActions.workflowActionInfoSet;
                        for(let w=0; w<workflowAction.length; w++){
                            wfActionInfo = {
                                actionDisplayType: `${workflowAction[w].actionDisplayType}`,
                                sourceStatus: workflowAction[w].sourceStatus,
                                destinationStatus: workflowAction[w].destinationStatus,
                                objectId: `pfm${workflowAction[w].fieldObjectId}`,
                                fieldName: `${workflowAction[w].fieldName}`,
                                fieldDisplayName: `${workflowAction[w].fieldDisplayName}`,
                                traversalPath: `${workflowAction[w].traversalPath}`,
                                traversalConfigJson: workflowAction[w].traversalConfigJson
                            }
                        } 
                        let rootPath;
                        let LayoutProperties = JSON.parse(multiActions.actionData[0].actionInfo).LayoutProperties;
                        for (let k = 0; k < LayoutProperties.length; k++) {
                            if(LayoutProperties[k].propertyTitle=="Select Workflow Field" && LayoutProperties[k].propertyKey == "selectWorkflowField"){
                                rootPath= LayoutProperties[k].fieldDetails[0].hasOwnProperty('rootPath') ? LayoutProperties[k].fieldDetails[0].rootPath : '';
                            }
                        }
                        multiActioninfo["traversalpath"] = rootPath
                        multiActioninfo["elementid"] = multiActions.elementId
                        multiActioninfo["buttonColor"] = "#06623b"
                        multiActioninfo["workFlowConfig"] = wfActionInfo
                    }
                    if (multiActions.actionType === 'WHO_COLUMN') {
                        let LayoutProperties = JSON.parse(multiActions.actionData[0].actionInfo).LayoutProperties;
                        let auditFields = JSON.parse(multiActions.actionData[0].actionInfo).auditFields;
                        for (let k = 0; k < LayoutProperties.length; k++) {
                            if(LayoutProperties[k].propertyTitle=="Object Name Selection"){
                                var whoObjectName = LayoutProperties[k].fieldDetails[0].value;
                                 var whoColumnObjId= LayoutProperties[k].fieldDetails[0].objectId;
                                 var traversalPath= LayoutProperties[k].fieldDetails[0].hasOwnProperty('whoColumnTraversalPath') ? LayoutProperties[k].fieldDetails[0].whoColumnTraversalPath : '';
                            } else if (LayoutProperties[k].propertyTitle === 'Default') {
                                var whoAuditType = LayoutProperties[k].fieldDetails[0].value;
                            }
                        }
                        multiActioninfo["objectName"] = whoObjectName;
                        multiActioninfo["auditType"] = whoAuditType;
                        multiActioninfo["traversalPath"] = traversalPath!='' && layout.layoutMode == 'VIEW' ? Object.keys(traversalPath)[0] :   layout.layoutLinkSet.find(path=>path.objectId == whoColumnObjId).rootPath;
                        multiActioninfo['auditFields'] = auditFields && auditFields.length > 0 ? auditFields : []
                    }
                    if (multiActions.actionType === 'MORE') {
                            multiActioninfo = await module.exports.moreActionInfoJson(multiActions, hierarchy, layout, 'GRID', 'LIST', 'ACTIONSGROUP');
                    }
                    if(multiActions.actionType === 'MAIL'){
                        let mailCompose=JSON.parse(multiActions.actionData[0].actionInfo).mailComposeOptions;
                        let LayoutProperties = JSON.parse(multiActions.actionData[0].actionInfo).LayoutProperties;
                        multiActioninfo["elementId"]=JSON.parse(multiActions.actionData[0].actionInfo).elementId;
                        multiActioninfo["style"]="3";
                        multiActioninfo["layoutId"]=`${layout.layoutId}`;
                        multiActioninfo["mailComposeOptions"] = mailCompose;
                        multiActioninfo["LayoutProperties"] = LayoutProperties;
                    }
                    if(multiActions.actionType === 'FILE_MANAGE'){
                        let LayoutProperties = JSON.parse(multiActions.actionData[0].actionInfo).LayoutProperties;
                        let objectName=[]
                        LayoutProperties.forEach(element => {
                            let objsName=element.find(objs=>objs.propertyKey==='objectName').fieldDetails[0].value;
                            objectName.push(objsName);
                        });
                        multiActioninfo['actionElementId']=`${multiActions.actionData[0].actionBinaryId}`
                    }
                    if(multiActions.actionType === 'DATA_CLONE'){
                        let navigationInfo = '';
                        
                        navigationInfo = {
                            navigationUrl: multiActions.targetLayoutName,
                            redirectUrl: layout.layoutName,
                            enablePopUp:enablePopupModel ? true : false
                        }
                        multiActioninfo["elementid"] = multiActions.elementId
                        multiActioninfo["buttonColor"] = "#06623b"
                        multiActioninfo["buttonCss"] = "cs-web-action-button"
                        multiActioninfo['actionElementId']=`${multiActions.actionData[0].actionBinaryId}`
                        multiActioninfo["traversalpath"] = `${multiActions.actionTagId}`
                        multiActioninfo["navigationInfo"] = navigationInfo
                        delete multiActioninfo["sourceId"];

                    }
                    if(multiActions.actionType === 'USERASSIGNMENT'){
                        let userAssignRootPath='';
                        let userAssignObjName ='';
                        if(multiActions.hasOwnProperty("actionData")){
                            let LayoutProperties = JSON.parse(multiActions.actionData[0].actionInfo).LayoutProperties;
                            let userAssignProperty = LayoutProperties.filter(select => select.propertyKey === "selectTheObject")[0].fieldDetails[0];
                            userAssignRootPath = userAssignProperty.traversalPath;
                            userAssignObjName = userAssignProperty.objectName;
                               
                        }
                        multiActioninfo["objectName"] = userAssignObjName;
                        multiActioninfo["buttonCss"] = "cs-web-action-button";
                        multiActioninfo["traversalPath"] = userAssignRootPath;
                        multiActioninfo["actionId"]=multiActioninfo["sourceId"];
                        delete multiActioninfo["sourceId"];
                    }
                    actionInfo.push(multiActioninfo)
            }
        }
        if (fieldDetailsObj.forReadOnlyParent) {
            delete fieldDetailsObj.forReadOnlyParent;
            let childValue = await module.exports.dataTableArrayFormation(gridTableSkeleton, fieldDetailsObj, baseObj,layout,'',matrixEnabled)
            let returnValue = {...gridTableSkeleton};
            returnValue['id'] = fieldDetailsObj['isParent'] === true ? "pfm" + fieldDetailsObj.objectId + "_" + fieldName:"pfm" + fieldDetailsObj.objectId + "_s_0_" + fieldName;
            returnValue['label'] = childValue['label'];
            childValue['label'] = ''
            childValue['objectName'] = `${fieldDetailsObj.objectName}`;
            returnValue['child'] = childValue;
            returnValue['prop'] = fieldDetailsObj['isParent'] === true ? "pfm" + fieldDetailsObj.objectId +"."+ fieldName:"pfm" + fieldDetailsObj.objectId + "s.0" + fieldName;
            returnValue['fieldName'] = fieldDetailsObj['isParent'] === true ? "pfm" + fieldDetailsObj.objectId:"pfm" + fieldDetailsObj.objectId + "s";
            returnValue['fieldType'] = fieldDetailsObj['isParent'] === true ? 'HEADER':'MASTERDETAIL';
            returnValue['objectName'] = `${fieldDetailsObj.objectName}`;    
            returnValue['traversalpath'] = fieldDetailsObj.rootPath
            return returnValue;
        } else if(fieldDetailsObj.forReadOnlyChild){
            delete fieldDetailsObj.forReadOnlyChild;
            let childValue = await module.exports.dataTableArrayFormation(gridTableSkeleton, fieldDetailsObj, baseObj,layout,'',matrixEnabled)
            const primary = {
                "child": {},
                "dateFormat": "",
                "mappingDetails": "",
                "currencyDetails": "",
                "id": "pfm" + fieldDetailsObj.objectId + "_s_0_" + fieldName,
                "label": fieldDetailsObj.label,
                "prop": "",
                "fieldName": `pfm${fieldDetailsObj.levelObjectId[0]}s`,
                "fieldType": "MASTERDETAIL",
                "objectName":`${fieldDetailsObj.objectName}`,
                "traversalpath":`${fieldDetailsObj.rootPath}`
            };
            let tempObj = primary.child;
            for (let i = 0; i < fieldDetailsObj.levelCount; i++) {
                tempObj.id = '';
                tempObj.label = '';
                tempObj.fieldName = "";
                tempObj.prop = "";
                tempObj.fieldType = "";
                tempObj.objectName = "";
                tempObj.dateFormat = "";
                tempObj.mappingDetails = "";
                tempObj.currencyDetails = "";
                tempObj.child = "";
                if (i === fieldDetailsObj.levelCount - 1) {
                    tempObj.id =   childValue.id;
                    tempObj.label = childValue.label;
                    tempObj.fieldName = childValue.fieldName;
                    tempObj.prop = childValue.prop;
                     tempObj. fieldType = childValue.fieldType;
                    tempObj.objectName = childValue.objectName;
                    tempObj.dateFormat = childValue.dateFormat;
                    tempObj.mappingDetails = childValue.mappingDetails;
                    tempObj.currencyDetails = childValue.currencyDetails;
                } else {
                    tempObj.fieldName = `pfm${fieldDetailsObj.levelObjectId[i+1]}s`;
                    tempObj.fieldType = `MASTERDETAIL`;
                    tempObj.objectName = `${fieldDetailsObj.objectName}`;
                    tempObj.child = {};
                }
                tempObj = tempObj.child;
            }
            return primary;
        } else if ((fieldDetailsObj.isReadOnlyEnable === 'Y' && fieldDetailsObj.forReadOnly) || (matrixEnabled &&fieldDetailsObj.forReadOnly)) {
            delete fieldDetailsObj.forReadOnly;
            let childValue = await module.exports.dataTableArrayFormation(gridTableSkeleton, fieldDetailsObj, baseObj,layout,'',matrixEnabled)
            let returnValue = {...gridTableSkeleton};
            returnValue['id'] = `pfm${fieldDetailsObj.objectId}_${fieldDetailsObj.referenceLookupFieldId}_${fieldName}`;
            returnValue['label'] = childValue['label'];
            childValue['label'] = ''
            childValue['objectName'] = `${fieldDetailsObj.objectName}`;
            returnValue['child'] = childValue;
            returnValue['objectName'] = `${fieldDetailsObj.objectName}`;
            returnValue['prop'] = `pfm${fieldDetailsObj.objectId}_${fieldDetailsObj.referenceLookupFieldId}.${fieldName}`;
            returnValue['fieldName'] = `pfm${fieldDetailsObj.objectId}_${fieldDetailsObj.referenceLookupFieldId}`;
             returnValue['fieldType'] = 'LOOKUP';
            returnValue['traversalpath'] = fieldDetailsObj.rootPath
            return returnValue;

        } else if (fieldType === 'MASTERDETAIL') {
            let lookupO = {
                'id': "pfm" + fieldDetailsObj.referenceObjectId + "0_" + commonobj.mapcolName,
                label,
                'prop': "pfm" + fieldDetailsObj.referenceObjectId + "." + commonobj.mapcolName,
                'fieldName': "pfm" + fieldDetailsObj.referenceObjectId,
                'fieldType': "HEADER",
                "objectName":fieldDetailsObj.objectName,
                'elementid': fieldDetailsObj.elementId,
                'traversalpath': fieldDetailsObj.rootPath,
                ...gridTableSkeleton
            }
            if (commonobj.fieldType === 'RADIO' || commonobj.fieldType === 'CHECKBOX' || commonobj.fieldType === 'DROPDOWN' || commonobj.fieldType === 'MULTISELECT') {
                if (commonobj.options !== 'undefined') {
                    let optionArr = commonobj.options.split("|");
                    let optionValue = commonobj.optionValue.split("|");
                    for (let l = 0; l < optionArr.length; l++) {
                        if (keyValue === '') {
                            keyValue = " {'" + optionValue[l] + "' : '" + optionArr[l] + "'";
                        } else {
                            keyValue += ", '" + optionValue[l] + "' : '" + optionArr[l] + "'";
                        }
                    }
                }

                lookupO['child'] = {
                    ...gridTableSkeleton
                };
                lookupO['child']['id'] = commonobj.mapcolName;
                lookupO['child']['label'] = commonobj.mapcolName;
                lookupO['child']['prop'] = commonobj.mapcolName;
                lookupO['child']['fieldName'] = commonobj.mapcolName;
                lookupO['child']['fieldType'] = commonobj.fieldType;
                lookupO['child']['objectName'] = fieldDetailsObj.objectName;
                lookupO['child']['mappingDetails'] = keyValue + '}';

            } else {
                lookupO['child'] = {
                    ...gridTableSkeleton
                };
                lookupO['child']['id'] = commonobj.mapcolName;
                lookupO['child']['label'] = commonobj.mapcolName;
                lookupO['child']['prop'] = commonobj.mapcolName;
                lookupO['child']['fieldName'] = commonobj.mapcolName;
                lookupO['child']['objectName'] = fieldDetailsObj.objectName;
                lookupO['child']['fieldType'] = commonobj.fieldType;
            }
            return lookupO;
        } else if (fieldType == 'LOOKUP' && appObject.popupCheck) {
            let lookObj = await popupAction.getWebLayoutPopupdetails(appObject.popupInfo, fieldDetailsObj.popupId, true,'',appObject.offlineObjectDetails);
            let lookupO = {
                'id': "pfm" + fieldDetailsObj.referenceObjectId + "_" + fieldDetailsObj.fieldId + '_' + lookObj.mapcolName,
                label,
                'prop': "pfm" + fieldDetailsObj.referenceObjectId + "_" + fieldDetailsObj.fieldId + '.' + lookObj.mapcolName,
                'fieldName': "pfm" + fieldDetailsObj.referenceObjectId + "_" + fieldDetailsObj.fieldId,
                'fieldType': fieldType,
                "objectName":fieldDetailsObj.objectName,
                'elementid': fieldDetailsObj.elementId,
                'traversalpath': fieldDetailsObj.rootPath,
                ...gridTableSkeleton
            }
            if (lookObj.fieldType === 'RADIO' || lookObj.fieldType === 'CHECKBOX' || lookObj.fieldType === 'DROPDOWN' || lookObj.fieldType === 'MULTISELECT') {

                if (lookObj.options !== 'undefined') {
                    let optionArr = lookObj.options.split("|");
                    let optionValue = lookObj.optionValue.split("|");
                    for (let l = 0; l < optionArr.length; l++) {
                        if (keyValue === '') {
                            keyValue = " {'" + optionValue[l] + "' : '" + optionArr[l] + "'";
                        } else {
                            keyValue += ", '" + optionValue[l] + "' : '" + optionArr[l] + "'";
                        }
                    }
                }

                lookupO['child'] = {
                    ...gridTableSkeleton
                };
                lookupO['child']['id'] = lookObj.mapcolName;
                lookupO['child']['label'] = lookObj.mapcolName;
                lookupO['child']['prop'] = lookObj.mapcolName;
                lookupO['child']['fieldName'] = lookObj.mapcolName;
                lookupO['child']['fieldType'] = lookObj.fieldType;
                lookupO['child']['objectName'] = fieldDetailsObj.objectName;
                lookupO['child']['mappingDetails'] = keyValue + '}';

            } else {
                lookupO['child'] = {
                    ...gridTableSkeleton
                };
                lookupO['child']['id'] = lookObj.mapcolName.toLowerCase();
                lookupO['child']['label'] = lookObj.mapcolName;
                lookupO['child']['prop'] = lookObj.mapcolName.toLowerCase();
                lookupO['child']['fieldName'] = lookObj.mapcolName.toLowerCase();
                lookupO['child']['fieldType'] = lookObj.fieldType;
                lookupO['child']['objectName'] = fieldDetailsObj.objectName;
            }
            return lookupO;
        } else if (fieldType == 'LOOKUP') {
            let lookupO = {
                'id': "pfm" + fieldDetailsObj.referenceObjectId + "_" + fieldDetailsObj.fieldId + '_' + commonobj.mapcolName,
                label,
                'prop': "pfm" + fieldDetailsObj.referenceObjectId + "_" + fieldDetailsObj.fieldId + '.' + commonobj.mapcolName,
                'fieldName': "pfm" + fieldDetailsObj.referenceObjectId + "_" + fieldDetailsObj.fieldId,
                'fieldType': fieldType,
                "objectName":fieldDetailsObj.objectName,
                'elementid': fieldDetailsObj.elementId,
                'traversalpath': fieldDetailsObj.rootPath,
                ...gridTableSkeleton
            }
            if (commonobj.fieldType === 'RADIO' || commonobj.fieldType === 'CHECKBOX' || commonobj.fieldType === 'DROPDOWN' || commonobj.fieldType === 'MULTISELECT') {

                if (commonobj.options !== 'undefined') {
                    let optionArr = commonobj.options.split("|");
                    let optionValue = commonobj.optionValue.split("|");
                    for (let l = 0; l < optionArr.length; l++) {
                        if (keyValue === '') {
                            keyValue = " {'" + optionValue[l] + "' : '" + optionArr[l] + "'";
                        } else {
                            keyValue += ", '" + optionValue[l] + "' : '" + optionArr[l] + "'";
                        }
                    }
                }

                lookupO['child'] = {
                    ...gridTableSkeleton
                };
                lookupO['child']['id'] = commonobj.mapcolName;
                lookupO['child']['label'] = commonobj.mapcolName;
                lookupO['child']['prop'] = commonobj.mapcolName;
                lookupO['child']['fieldName'] = commonobj.mapcolName;
                lookupO['child']['fieldType'] = commonobj.fieldType;
                lookupO['child']['objectName'] = fieldDetailsObj.objectName;
                lookupO['child']['mappingDetails'] = keyValue + '}';

            } else {
                lookupO['child'] = {
                    ...gridTableSkeleton
                }
                lookupO['child']['id'] = commonobj.mapcolName;
                lookupO['child']['label'] = commonobj.mapcolName;
                lookupO['child']['prop'] = commonobj.mapcolName;
                lookupO['child']['fieldName'] = commonobj.mapcolName;
                lookupO['child']['fieldType'] = commonobj.fieldType;
                lookupO['child']['objectName'] = fieldDetailsObj.objectName;
            }
            return lookupO;

        } else if (fieldType == 'DROPDOWN' || fieldType === "MULTISELECT" || fieldType === "RADIO" || fieldType === "CHECKBOX") {
            let dropSkelton = {
                ...gridTableSkeleton
            };
            if (fieldDetailsObj.options !== 'undefined') {
                let optionArr = fieldDetailsObj.options.split("|");
                let optionValue = fieldDetailsObj.optionValue.split("|");
                for (let l = 0; l < optionArr.length; l++) {
                    if (keyValue === '') {
                        keyValue = `{"${optionValue[l]}": "${optionArr[l]}"`;
                    } else {
                        keyValue += `,"${optionValue[l]}": "${optionArr[l]}"`;
                    }
                }
            }
            dropSkelton['mappingDetails'] =  fieldDetailsObj.elementName && fieldDetailsObj.elementId 
             && !fieldDetailsObj.hasOwnProperty('pageType') 
             ? `this2.${fieldDetailsObj.elementName}_${fieldDetailsObj.fieldId}_${fieldDetailsObj.elementId}calling_2`
             :JSON.parse(keyValue + '}');
             
            let dropDownO = {
                "id": fieldName,
                label,
                fieldName,
                "prop": fieldName,
                fieldType,
                "objectName":fieldDetailsObj.objectName,
                'elementid': fieldDetailsObj.elementId,
                'traversalpath': fieldDetailsObj.rootPath,
                ...dropSkelton
            }
            return dropDownO;
        } else if (fieldType == 'STATUSWORKFLOW') {
            let dropSkelton = {
                ...gridTableSkeleton
            };
            if (fieldDetailsObj.options !== 'undefined') {
                let optionArr = fieldDetailsObj.options.split("|");
                let optionValue = fieldDetailsObj.optionValue.split("|");
                for (let l = 0; l < optionArr.length; l++) {
                    if (keyValue === '') {
                        keyValue = `{"${optionValue[l]}": "${optionArr[l]}"`;
                    } else {
                        keyValue += `,"${optionValue[l]}": "${optionArr[l]}"`;
                    }
                }
            }
            dropSkelton['mappingDetails'] = fieldDetailsObj.elementName && fieldDetailsObj.elementId ?`this2.${fieldDetailsObj.elementName}_${fieldDetailsObj.fieldId}_${fieldDetailsObj.elementId}calling_2`:JSON.parse(keyValue + '}');
            let dropDownO = {
                "id": fieldName,
                label,
                fieldName,
                "prop": fieldName,
                fieldType,
                "objectName":fieldDetailsObj.objectName,
                'elementid': fieldDetailsObj.elementId,
                'traversalpath': fieldDetailsObj.rootPath,
                ...dropSkelton
            }
            for (let i = 0; i < layout.layoutSectionSet.length; i++) {
                let layoutSectionSet = layout.layoutSectionSet[i];
                if(isStatusWorkflowEnabled === 'Y' && layoutSectionSet.sectionFor ==='LIST'){
                    dropDownO['statusWorkflow'] = {
                        defaultStatus: optionSelectedValue,
                        label: label,
                        fieldName:fieldName,
                        "objectName":fieldDetailsObj.objectName,
                    } 
                    dropDownO['statusWorkflow']['objectId'] = `this1.__${fieldDetailsObj.objectName}$tableName_1`
                    dropDownO['statusWorkflow']['objectConfig'] = 'this.pfmObjectConfig.objectConfiguration1';
                }
            }
            return dropDownO;
        } else if (fieldType === 'DATE') {
            let dateO = {
                ...gridTableSkeleton
            };
            dateO['dateFormat'] = type === 'RECORDASSOCIATION' ? `this.appUtilityObj.userDateFormat1` : 'this.appUtilityConfig.userDateFormat1';
            return {
                "id": fieldName,
                label,
                fieldName,
                "prop": fieldName,
                fieldType,
                "objectName":fieldDetailsObj.objectName,
                'elementid': fieldDetailsObj.elementId,
                'traversalpath': fieldDetailsObj.rootPath,
                ...dateO
            }
        } else if (fieldType === 'TIMESTAMP') {
            let datetimeO = {
                ...gridTableSkeleton
            };
            datetimeO['dateFormat'] = type === 'RECORDASSOCIATION' ?  `this.appUtilityObj.userDateTimeFormat1` : 'this.appUtilityConfig.userDateTimeFormat1';
            return {
                "id": fieldName,
                label,
                fieldName,
                "prop": fieldName,
                fieldType,
                "objectName":fieldDetailsObj.objectName,
                'elementid': fieldDetailsObj.elementId,
                'traversalpath': fieldDetailsObj.rootPath,
                ...datetimeO
            }
        } else if (fieldType === 'CURRENCY') {
            let CurrencyO = {
                ...gridTableSkeleton
            };
            CurrencyO['currencyDetails'] = {
                currencyCode: fieldDetailsObj.currencySymbol,
                display: true,
                digitsInfo: '1.2-2',
                locale: fieldDetailsObj.locale
            }
            return {
                "id": fieldName,
                label,
                fieldName,
                "prop": fieldName,
                fieldType,
                "objectName":fieldDetailsObj.objectName,
                'elementid': fieldDetailsObj.elementId,
                'traversalpath': fieldDetailsObj.rootPath,
                ...CurrencyO
            }
        } else if(fieldType === 'FORMULA') {
            let fileSizeMeasurment;
            let aggregateFormula = {
                ...gridTableSkeleton
            }
            let recordFormulaType = '';
            if(fieldDetailsObj.hasOwnProperty('rollupResultType')) {
                if(fieldDetailsObj.rollupResultType === 'STRING') {
                    recordFormulaType = 'TEXT';
                } else if(fieldDetailsObj.rollupResultType === 'DATETIME') {
                    recordFormulaType = 'TIMESTAMP';
                } else {
                    recordFormulaType = fieldDetailsObj.rollupResultType;
                }
            }
            if (fieldDetailsObj.formulaFieldType == "DATE"){
                aggregateFormula['dateFormat'] = 'this.appUtilityConfig.userDateFormat1';
            } else if (fieldDetailsObj.formulaFieldType == "TIMESTAMP"){
                aggregateFormula['dateFormat'] = 'this.appUtilityConfig.userDateTimeFormat1';
            } else if(fieldDetailsObj.formulaFieldType == "CURRENCY"){
                aggregateFormula['currencyDetails'] = {
                    currencyCode: fieldDetailsObj.currencySymbol,
                    display: true,
                    digitsInfo: '1.2-2',
                    locale: fieldDetailsObj.currencyDetails
                }
            }
            if(fieldDetailsObj.hasOwnProperty('fileSizeMeasurment') && fieldDetailsObj.fileSizeMeasurment){
                fileSizeMeasurment= fieldDetailsObj.fileSizeMeasurment
            }
            if(type === 'RECORDASSOCIATION'){
                aggregateFormula['dateFormat']=fieldDetailsObj.rollupResultType == "DATE" ? `this.appUtilityObj.userDateFormat1` : fieldDetailsObj.rollupResultType == "DATETIME" ?  `this.appUtilityObj.userDateTimeFormat1` : `` ;
                aggregateFormula['currencyDetails'] = fieldDetailsObj.rollupResultType == "CURRENCY" ? {
                    currencyCode: fieldDetailsObj.currencySymbol,
                    display: true,
                    digitsInfo: '1.2-2',
                    locale: fieldDetailsObj.currencyDetails
                } : '' ;
                aggregateFormula['formulaType']=fieldDetailsObj.rollupResultType === 'STRING' ? 'TEXT' : fieldDetailsObj.rollupResultType === 'DATETIME' ? 'TIMESTAMP' : fieldDetailsObj.rollupResultType
                if(fieldDetailsObj.hasOwnProperty('fileSizeMeasurment') && fieldDetailsObj.fileSizeMeasurment){
                    aggregateFormula['fileSizeMeasurment']= fieldDetailsObj.fileSizeMeasurment
                }
            }
            return {
                "id": fieldName+"__f",
                label,
                "fieldName":fieldName+"__f",
                "prop": fieldName+"__f",
                fieldType,
                "formulaType":fieldDetailsObj.formulaFieldType ? fieldDetailsObj.formulaFieldType : recordFormulaType,
                fileSizeMeasurment,
                "objectName":fieldDetailsObj.objectName,
                'elementid': fieldDetailsObj.elementId,
                'traversalpath': fieldDetailsObj.rootPath,
                ...aggregateFormula
            }
        } else if(fieldType === 'ROLLUPSUMMARY' ) {
            let aggregateRollup = {
                ...gridTableSkeleton
            };
            let rollupDefaultValue = (fieldDetailsObj.rollupDefaultValue === "True") ? true : (fieldDetailsObj.rollupDefaultValue === "False") ? false : fieldDetailsObj.rollupDefaultValue;
            if(fieldDetailsObj.rollupResultType == "CURRENCY"){
                aggregateRollup['currencyDetails'] = {
                    currencyCode: fieldDetailsObj.currencySymbol,
                    display: true,
                    digitsInfo: '1.2-2',
                    locale: fieldDetailsObj.currencyDetails
                }
            } else if (fieldDetailsObj.rollupResultType == "DATE"){
                aggregateRollup['dateFormat'] = 'this.appUtilityConfig.userDateFormat1';
            } else if (fieldDetailsObj.rollupResultType == "TIMESTAMP"){
                aggregateRollup['dateFormat'] = 'this.appUtilityConfig.userDateTimeFormat1';
            }
            if(type === 'RECORDASSOCIATION'){
                aggregateRollup['dateFormat']=fieldDetailsObj.rollupResultType == "DATE" ? `this.appUtilityObj.userDateFormat1` : fieldDetailsObj.rollupResultType == "DATETIME" ?  `this.appUtilityObj.userDateTimeFormat1` : `` ;
                aggregateRollup['currencyDetails'] = fieldDetailsObj.rollupResultType == "CURRENCY" ? {
                    currencyCode: fieldDetailsObj.currencySymbol,
                    display: true,
                    digitsInfo: '1.2-2',
                    locale: fieldDetailsObj.currencyDetails
                } : '' ;
                aggregateRollup['rollupResultType']=fieldDetailsObj.rollupResultType === 'STRING' ? 'TEXT' : fieldDetailsObj.rollupResultType === 'DATETIME' ? 'TIMESTAMP' : fieldDetailsObj.rollupResultType
            }
            return {
                "id": fieldName+"__r",
                label,
                "fieldName":fieldName+"__r",
                "prop": fieldName+"__r",
                "rollupResultType": (fieldDetailsObj.rollupResultType === 'FORMULA'  || fieldDetailsObj.rollupResultType === 'ROLLUPSUMMARY' ? 'NUMBER' : fieldDetailsObj.rollupResultType),
                fieldType,
                "objectName":fieldDetailsObj.objectName,
                'elementid': fieldDetailsObj.elementId,
                ...aggregateRollup,
                'traversalpath': fieldDetailsObj.rootPath,
                "rollupDefaultValue": rollupDefaultValue
            }
        }else if(fieldType === 'URL'){
            let dbVarDBType
           if(layout){
                dbVarDBType =layout.dataSourceInfo.datasourceType;
            }
            let isMultipleUrlField=false;
                for(let a=0;a<appObject.offlineObjectDetails.length;a++){
                    if(!fieldDetailsObj.objectName && appObject.offlineObjectDetails[a].objectId === fieldDetailsObj.objectId ){
                        fieldDetailsObj.objectName = appObject.offlineObjectDetails[a].objectName;
                    }
                    for(let b=0;b<appObject.offlineObjectDetails[a].fields.length;b++){
                        let getFields=appObject.offlineObjectDetails[a].fields[b];
                        if(getFields.fieldId===fieldDetailsObj.fieldId && getFields.urlType.toLowerCase()==='multiple'){
                            isMultipleUrlField=true;
                        }
                    }
                   
                }
            return {
                "id": fieldName,
                label,
                fieldName,
                "prop": fieldName,
                 fieldType,
                "objectName":fieldDetailsObj.objectName,
                'elementid': fieldDetailsObj.elementId,
                'traversalpath': fieldDetailsObj.rootPath,
                "from": `${dbVarDBType ==='Webservice'? 'webService':'slickgrid'}`,
                "isMultiUrlField": isMultipleUrlField,
                "actionInfo":[{
                    "isHiddenEnabled":fieldDetailsObj.isHiddenEnabled,
                    "buttonCss": "cs-web-action-button",
                    "actionIcon": `${fieldDetailsObj.icon}`,
                    "actionName": `${fieldDetailsObj.elementName}`,
                    "actionLabel": `${fieldDetailsObj.label}`,
                    "actionType": `URL`,
                    "sourceId"  : `${fieldDetailsObj.elementId}`,
                    "actionDisplayType":fieldDetailsObj.actionDisplayType,
                    "objectName":  `${fieldDetailsObj.objectName}`,
                    "auditType": auditType,
                    "elementid" : fieldDetailsObj.elementId
                }],
                ...gridTableSkeleton,

            };
        } else if(elementType ==='ACTION' && actionType ==='DATA_UPSERT'){
            if(layout.layoutMode !=='VIEW'){
                return {
                    label,
                    "fieldName":"cspfmaction",
                    "prop": "cspfmaction",
                    "objectName":fieldDetailsObj.objectName,
                    'elementid': fieldDetailsObj.elementId,
                    elementType,
                    ...gridTableSkeleton,
                    "actionInfo":[{
                        "isHiddenEnabled":fieldDetailsObj.isHiddenEnabled,
                        "buttonCss": "cs-web-action-button",
                        "actionIcon": `${fieldDetailsObj.icon}`,
                        "actionName": `${fieldDetailsObj.elementName}`,
                        "actionLabel": `${fieldDetailsObj.label}`,
                        "actionType": `${fieldDetailsObj.actionType}`,
                        "sourceId"  : `${fieldDetailsObj.elementId}`,
                        "boxStyle": `${fieldDetailsObj.boxStyle}`,
                        "labelStyle": `${fieldDetailsObj.labelStyle}`,
                        "valueStyle": `${fieldDetailsObj.valueStyle}`,
                    }]
                }
            } else return {
                label,
                "fieldName":"cspfmaction",
                "prop": "cspfmaction",
                "fieldType":elementType,
                "objectName":fieldDetailsObj.objectName,
                'elementid': fieldDetailsObj.elementId,
                ...gridTableSkeleton,
                "actionInfo":[{
                    "isHiddenEnabled":fieldDetailsObj.isHiddenEnabled,
                    "buttonCss": "cs-web-action-button",
                    "actionIcon": `${fieldDetailsObj.icon}`,
                    "actionName": `${fieldDetailsObj.elementName}`,
                    "actionLabel": `${fieldDetailsObj.label}`,
                    "actionType": `${fieldDetailsObj.actionType}`,
                    "sourceId"  : `${fieldDetailsObj.elementId}`,
                    "actionDisplayType":`${fieldDetailsObj.actionDisplayType}`,
                    "objectName":"",
                    "boxStyle": `${fieldDetailsObj.boxStyle}`,
                    "labelStyle": `${fieldDetailsObj.labelStyle}`,
                    "valueStyle": `${fieldDetailsObj.valueStyle}`
                }]
            }
        } else if(elementType ==='ACTION' && (actionType ==='EDIT' || actionType ==='VIEW' || actionType === 'DATA_FETCH' ||actionType ==='MAIL' )){
            const actionDataVar = fieldDetailsObj.actionData[0];
            const actionInfoVar = JSON.parse(actionDataVar.actionInfo);
            const LayoutProperties = actionInfoVar.LayoutProperties;
            let redirectionTo = '';
            let enablePopupModel=false;
            let webservice;
            let relationalObjectInfo={};
            const webServiceInfo=[];
            if (actionType === 'MAIL') {
                let mailCompose = JSON.parse(actionDataVar.actionInfo).mailComposeOptions;
                var emailFormation = {
                    "elementId":JSON.parse(actionDataVar.actionInfo).elementId,
                    "style":"3",
                    "layoutId":`${layout.layoutId}`,
                    "mailComposeOptions": mailCompose,
                    "LayoutProperties": LayoutProperties
                }
            };
            for (let k = 0; k < LayoutProperties.length; k++) {
                if(LayoutProperties[k].propertyKey ==='redirectionTo'){
                    redirectionTo = LayoutProperties[k].fieldDetails[0].redirectionTypeName;
                }
                else if(LayoutProperties[k].propertyKey ==='enablePopupModel'){
                    enablePopupModel = LayoutProperties[k].fieldDetails[0].value;
                }else if (LayoutProperties[k].propertyKey === "redirectionInputParam") {
                    if (LayoutProperties[k].fieldDetails && LayoutProperties[k].fieldDetails.length > 0) {
                        if(fieldDetailsObj.isRowActionEnable==='N'){
                          webservice=LayoutProperties[k].fieldDetails;
                          for(const webserviceData of webservice){
                              const web={
                                  "fieldName":webserviceData.fieldName,
                                  "fieldId":webserviceData.fieldId
                              };
                              webServiceInfo.push(web);
                          }
                        }
                    }
                }
            }
            if(actionType === 'DATA_FETCH' && webServiceInfo.length == 0) {
                for(const userParam of actionInfoVar.userParamData){
                    const param={
                        'fieldId':userParam.targetId,
                        'fieldName':userParam.targetName
                    };
                    webServiceInfo.push(param);
                }
            }
            if(hierarchy){
                if(hierarchy['child'].length != 0){
                     var referenceElementEdit = hierarchy['child'].filter(element =>element.objectId === fieldDetailsObj.objectId);
                }
               if(referenceElementEdit != undefined && referenceElementEdit.length !=0 && hierarchy['primary']['objectId']!== referenceElementEdit[0].referenceObjectId ){
                    getHierechyLevel(layout.layoutLinkSet, fieldDetailsObj.objectId, hierarchy['primary']['objectId'], 1, [], data);
                    fieldDetailsObj['levelCount'] = data.levelCount-1;
                    fieldDetailsObj['levelObjectId'] = data.levelObjectId;
                    relationalObjectInfo = {                               
                        "relationalObjectName": `${hierarchy.objectMapping[fieldDetailsObj.levelObjectId[0]]}`,
                        "relationalObjectId": `pfm${fieldDetailsObj.levelObjectId[0]}s`,
                        "fieldType": "MASTERDETAIL",
                        "child":{} 
                    }
                    let tempObjEdit = relationalObjectInfo.child;
                    for (let i = 0; i < fieldDetailsObj.levelCount; i++) {
                        tempObjEdit.relationalObjectName = "";
                        tempObjEdit.relationalObjectId = '';
                        tempObjEdit.fieldType = "";
                        tempObjEdit.child = "";
                           if (i === fieldDetailsObj.levelCount - 1) {
                                tempObjEdit.relationalObjectName =  `${hierarchy.objectMapping[fieldDetailsObj.levelObjectId[i+1]]}`;
                                tempObjEdit.relationalObjectId = `pfm${fieldDetailsObj.levelObjectId[i+1]}s`;
                                tempObjEdit.fieldType = "MASTERDETAIL";
                                tempObjEdit.child = "";
                            } else {
                                tempObjEdit.relationalObjectName =  `${hierarchy.objectMapping[fieldDetailsObj.levelObjectId[i+1]]}`;
                                tempObjEdit.relationalObjectId = `pfm${fieldDetailsObj.levelObjectId[i+1]}s`;
                                tempObjEdit.fieldType = "MASTERDETAIL";
                                tempObjEdit.child = {};
                            }
                            tempObjEdit = tempObjEdit.child;
                    }
                } else{
                    relationalObjectInfo = {                            
                        "relationalObjectName": `${hierarchy.objectMapping[fieldDetailsObj.objectId]}`,
                        "relationalObjectId":Number(hierarchy['primary']['objectId']) === Number(fieldDetailsObj.objectId) ? "":hierarchy['parentObjId'].includes(fieldDetailsObj.objectId)? `pfm${fieldDetailsObj.objectId}` :`pfm${fieldDetailsObj.objectId}s`,
                        "fieldType": hierarchy['lookupObjId'].includes(fieldDetailsObj.objectId)?"LOOKUP":hierarchy['parentObjId'].includes(fieldDetailsObj.objectId)?"HEADER":"MASTERDETAIL",
                        "child":""
                    }
                }
            }
            let navigationInfo = elementType==='ACTION' && actionType !== 'MAIL' ?{"navigationInfo": {
                "navigationUrl": `${redirectionTo}`,
                "redirectUrl": `${layout.layoutName}`,
                "uniqueKey": "id",
                "enablePopUp":enablePopupModel ? true :false,
                "webserviceinfo":webServiceInfo,
                "relationalObjectInfo": {
                    ...relationalObjectInfo
                }
            }} : '';


            if(layout.layoutMode !=='VIEW'){
                return {
                    "id":`cspfmaction${fieldDetailsObj.elementId}`,
                    label,
                    "fieldName":`cspfmaction${fieldDetailsObj.elementId}`,
                    "prop": `cspfmaction${fieldDetailsObj.elementId}`,
                    "objectName":fieldDetailsObj.objectName,
                    'elementid': fieldDetailsObj.elementId,
                    elementType,
                    ...gridTableSkeleton,
                    "actionInfo":[{
                        "isHiddenEnabled":fieldDetailsObj.isHiddenEnabled,
                        "buttonCss": "cs-web-action-button",
                        "actionIcon": `${fieldDetailsObj.icon}`,
                        "actionName": `${fieldDetailsObj.elementName}`,
                        "actionLabel": `${fieldDetailsObj.label}`,
                        "actionType": `${fieldDetailsObj.actionType}`,
                        "sourceId"  : `${fieldDetailsObj.elementId}`,
                        "traversalpath" : `${fieldDetailsObj.actionTagId}`,
                        "actionDisplayType": `${fieldDetailsObj.actionDisplayType}` ,
                        "objectName":"",
                        "boxStyle": `${fieldDetailsObj.boxStyle}`,
                        "labelStyle": `${fieldDetailsObj.labelStyle}`,
                        "valueStyle": `${fieldDetailsObj.valueStyle}`,
                        ...emailFormation,
                        ...navigationInfo

                    }]
                }
            } else {
                return {
                    'id':`cspfmaction${fieldDetailsObj.elementId}`,
                    label,
                    'fieldName':`cspfmaction${fieldDetailsObj.elementId}`,
                    'prop': `cspfmaction${fieldDetailsObj.elementId}`,
                    'fieldType':elementType,
                    'objectName':fieldDetailsObj.objectName,
                    'elementid': fieldDetailsObj.elementId,
                    ...gridTableSkeleton,
                    'actionInfo':[{
                        'isHiddenEnabled':fieldDetailsObj.isHiddenEnabled,
                        'buttonCss': 'cs-web-action-button',
                        'actionIcon': `${fieldDetailsObj.icon}`,
                        'actionName': `${fieldDetailsObj.elementName}`,
                        'actionLabel': `${fieldDetailsObj.label}`,
                        'actionType': `${fieldDetailsObj.actionType}`,
                        'sourceId'  : `${fieldDetailsObj.elementId}`,
                        "traversalpath" : `${fieldDetailsObj.actionTagId}`,
                        'actionDisplayType':`${fieldDetailsObj.actionDisplayType}`,
                        'objectName':'',
                        "boxStyle": `${fieldDetailsObj.boxStyle}`,
                        "labelStyle": `${fieldDetailsObj.labelStyle}`,
                        "valueStyle": `${fieldDetailsObj.valueStyle}`,
                        ...emailFormation,
                        ...navigationInfo
                    }]
                };
            }
        }else if(elementType ==='ACTION' && actionType === 'ACTIONS_GROUP'){
            let webservice;
            for (let i = 0; i < elementActions.length; i++) {
                const webServiceInfo=[];
                const elementActionsVar = elementActions[i];
                if (elementActionsVar.elementType === 'ACTION' && (elementActionsVar.actionType === 'EDIT' ||
                elementActionsVar.actionType === 'VIEW' || elementActionsVar.actionType === 'DATA_FETCH')) {
                    const actionDataVar = elementActionsVar.actionData[0];
                    const actionInfoVar = JSON.parse(actionDataVar.actionInfo);
                    const LayoutProperties = actionInfoVar.LayoutProperties;
                    let redirectionTo='',enablePopupModel=false;
                    let relationalObjectInfo={};
                    for (let k = 0; k < LayoutProperties.length; k++) {
                        if(LayoutProperties[k].propertyKey ==='redirectionTo'){
                            redirectionTo = LayoutProperties[k].fieldDetails[0].redirectionTypeName;
                        }else if(LayoutProperties[k].propertyKey ==='enablePopupModel'){
                            enablePopupModel = LayoutProperties[k].fieldDetails[0].value;
                        }else if (LayoutProperties[k].propertyKey === 'redirectionInputParam' && LayoutProperties[k].fieldDetails && LayoutProperties[k].fieldDetails.length > 0) {
                            if(fieldDetailsObj.isRowActionEnable==='N'){
                                webservice=LayoutProperties[k].fieldDetails;
                                for(const webserviceData of webservice){
                                const web={
                                    'fieldName':webserviceData.fieldName,
                                    'fieldId':webserviceData.fieldId
                                };
                                webServiceInfo.push(web);
                                }
                            }
                        }
                    }

                    if(elementActionsVar.actionType === 'DATA_FETCH' && webServiceInfo.length === 0) {
                        for(const userParam of actionInfoVar.userParamData){
                            const param={
                                'fieldId':userParam.targetId,
                                'fieldName':userParam.targetName
                            };
                            webServiceInfo.push(param);
                        }
                    }
                    if(hierarchy){
                        if(hierarchy['child'].length != 0){                     
                            var referenceElementActionEdit = hierarchy['child'].filter(element =>element.objectId === elementActionsVar.objectId);                         
                        }
                        if(referenceElementActionEdit != undefined && referenceElementActionEdit.length != 0 && hierarchy['primary']['objectId']!== referenceElementActionEdit[0].referenceObjectId ){
                            getHierechyLevel(layout.layoutLinkSet, elementActionsVar.objectId, hierarchy['primary']['objectId'], 1, [], data);
                            elementActionsVar['levelCount'] = data.levelCount-1;
                            elementActionsVar['levelObjectId'] = data.levelObjectId;
                            relationalObjectInfo = {                               
                                "relationalObjectName": `${hierarchy.objectMapping[elementActionsVar.levelObjectId[0]]}`,
                                "relationalObjectId": `pfm${elementActionsVar.levelObjectId[0]}s`,
                                "fieldType": "MASTERDETAIL",
                                "child":{} 
                            }
                            let tempObjAction = relationalObjectInfo.child;
                            for (let i = 0; i < elementActionsVar.levelCount; i++) {
                                tempObjAction.relationalObjectName = "";
                                tempObjAction.relationalObjectId = '';
                                tempObjAction.fieldType = "";
                                tempObjAction.child = "";
                                if (i === elementActionsVar.levelCount - 1) {
                                    tempObjAction.relationalObjectName =  `${hierarchy.objectMapping[elementActionsVar.levelObjectId[i+1]]}`;
                                    tempObjAction.relationalObjectId = `pfm${elementActionsVar.levelObjectId[i+1]}s`;
                                    tempObjAction.fieldType = "MASTERDETAIL";
                                    tempObjAction.child = "";
                                } else {
                                    tempObjAction.relationalObjectName =  `${hierarchy.objectMapping[elementActionsVar.levelObjectId[i+1]]}`;
                                    tempObjAction.relationalObjectId = `pfm${elementActionsVar.levelObjectId[i+1]}s`;
                                    tempObjAction.fieldType = "MASTERDETAIL";
                                    tempObjAction.child = {};
                                }
                                tempObjAction = tempObjAction.child;
                            }
                        } else{
                             relationalObjectInfo = {                            
                                "relationalObjectName": `${hierarchy.objectMapping[elementActionsVar.objectId]}`,
                                "relationalObjectId":Number(hierarchy['primary']['objectId']) === Number(elementActionsVar.objectId) ? "":hierarchy['parentObjId'].includes(elementActionsVar.objectId)? `pfm${elementActionsVar.objectId}` :`pfm${elementActionsVar.objectId}s`,
                                "fieldType": hierarchy['lookupObjId'].includes(elementActionsVar.objectId)?"LOOKUP":hierarchy['parentObjId'].includes(elementActionsVar.objectId)?"HEADER":"MASTERDETAIL",
                                "child":""
                            }
                        }
                    }
                    actionInfo[i].actionIcon=`${elementActionsVar.icon}`;
                    actionInfo[i].actionName=`${elementActionsVar.elementName}`;
                    actionInfo[i].actionLabel=`${elementActionsVar.label}`;
                    actionInfo[i].actionDisplayType= `${elementActionsVar.actionDisplayType}`;
                    actionInfo[i].sourceId =`${elementActionsVar.elementId}`;
                    actionInfo[i].actionType=`${elementActionsVar.actionType}`;
                    actionInfo[i]['isHiddenEnabled']=`${elementActionsVar.isHiddenEnabled}`;
                    actionInfo[i]['buttonCss']='cs-web-action-button';
                    actionInfo[i]['boxStyle']=`${elementActionsVar.boxStyle}`;
                    actionInfo[i]['labelStyle']=`${elementActionsVar.labelStyle}`;
                    actionInfo[i]['valueStyle']=`${elementActionsVar.valueStyle}`;
                    if(elementActionsVar.elementType === 'ACTION' && elementActionsVar.actionType !== 'MAIL'){
                        actionInfo[i]['navigationInfo']={
                            'navigationUrl': `${redirectionTo}`,
                            'redirectUrl': `${layout.layoutName}`,
                            'uniqueKey': 'id',
                            'enablePopUp': enablePopupModel ? true :false,
                            'webserviceinfo':webServiceInfo,
                            'relationalObjectInfo': {
                                ...relationalObjectInfo
                            }
                        } 
                    }
                }
            }
                if(layout.layoutMode !=='VIEW'){
                    return {
                        "id":`cspfmaction${fieldDetailsObj.elementId}`,
                        label,
                        "fieldName":`cspfmaction${fieldDetailsObj.elementId}`,
                        "prop": `cspfmaction${fieldDetailsObj.elementId}`,
                        elementType,
                        "objectName":fieldDetailsObj.objectName,
                        'elementid': fieldDetailsObj.elementId,
                        ...gridTableSkeleton,
                        "actionInfo":actionInfo
                    };
                } else {
                    return {
                        'id':`cspfmaction${fieldDetailsObj.elementId}`,
                        label,
                        'fieldName':`cspfmaction${fieldDetailsObj.elementId}`,
                        'prop': `cspfmaction${fieldDetailsObj.elementId}`,
                        'fieldType':elementType,
                        'objectName':fieldDetailsObj.objectName,
                        'elementid': fieldDetailsObj.elementId,
                        ...gridTableSkeleton,
                        'actionInfo':actionInfo
                    };
                }
        }else if(elementType ==='ACTION' && actionType ==='WHO_COLUMN'){
            let LayoutProperties = JSON.parse(fieldDetailsObj.actionData[0].actionInfo).LayoutProperties;
            let auditFields = JSON.parse(fieldDetailsObj.actionData[0].actionInfo).auditFields;
            for (let k = 0; k < LayoutProperties.length; k++) {
                if(LayoutProperties[k].propertyKey=="objectNameSelection"){
                    var auditObjectName = LayoutProperties[k].fieldDetails[0].value;
                    var whoColumnObjId= LayoutProperties[k].fieldDetails[0].objectId;
                    var traversalPath= LayoutProperties[k].fieldDetails[0].hasOwnProperty('whoColumnTraversalPath') ? LayoutProperties[k].fieldDetails[0].whoColumnTraversalPath : '';
                } else if (LayoutProperties[k].propertyKey === 'default') {
                    var auditType = LayoutProperties[k].fieldDetails[0].value;
                }
            }
            return {
                label,
                "id" : fieldDetailsObj.elementName,
                "fieldName": fieldDetailsObj.elementName,
                "prop": fieldDetailsObj.elementName,
                "fieldType":"TIMESTAMP",
                "objectName":`${auditObjectName}`,
                'elementid': fieldDetailsObj.elementId,
                ...gridTableSkeleton,
                "actionInfo":[{
                    "isHiddenEnabled":fieldDetailsObj.isHiddenEnabled,
                    "buttonCss": "cs-web-action-button",
                    "actionIcon": `${fieldDetailsObj.icon}`,
                    "actionName": `${fieldDetailsObj.elementName}`,
                    "actionLabel": `${fieldDetailsObj.label}`,
                    "actionType": `${fieldDetailsObj.actionType}`,
                    "sourceId"  : `${fieldDetailsObj.elementId}`,
                    "actionDisplayType":fieldDetailsObj.actionDisplayType,
                    "objectName":  `${auditObjectName}`,
                    "auditType": auditType,
                    "boxStyle": `${fieldDetailsObj.boxStyle}`, 
                    "labelStyle": `${fieldDetailsObj.labelStyle}`, 
                    "valueStyle": `${fieldDetailsObj.valueStyle}`, 
                    "auditFields" : auditFields && auditFields.length > 0 ? auditFields : [],   
                    "traversalPath" : traversalPath!='' && layout.layoutMode == 'VIEW' ? Object.keys(traversalPath)[0] :   layout.layoutLinkSet.find(path=>path.objectId == Number(whoColumnObjId)).rootPath
                }]
            }
        } else if(elementType ==='ACTION' && actionType ==='USERASSIGNMENT'){
            let userAssignRootPath='';
            let userAssignObjName='';
            if(fieldDetailsObj.hasOwnProperty("actionData")){
                let LayoutProperties = JSON.parse(fieldDetailsObj.actionData[0].actionInfo).LayoutProperties;
                let userAssignProperty = LayoutProperties.filter(select => select.propertyKey === "selectTheObject")[0].fieldDetails[0];
                userAssignRootPath = userAssignProperty.traversalPath;
                userAssignObjName = userAssignProperty.objectName;
                   
            }
            return {
                label,
                "id" : fieldDetailsObj.elementName,
                "fieldName": fieldDetailsObj.elementName,
                "prop": fieldDetailsObj.elementName,
                "fieldType":"TEXT",
                "objectName":userAssignObjName,
                'elementid': fieldDetailsObj.elementId,
                "traversalPath" :  userAssignRootPath,
                ...gridTableSkeleton,
                "actionInfo":[{
                    "actionIcon": `${fieldDetailsObj.icon}`,
                    "actionName": `${fieldDetailsObj.elementName}`,
                    "boxStyle": `${(fieldDetailsObj.hasOwnProperty('boxStyle')) ? fieldDetailsObj.boxStyle : ""}`, 
                    "valueStyle": `${(fieldDetailsObj.hasOwnProperty('valueStyle')) ? fieldDetailsObj.boxStyle : ""}`, 
                    "labelStyle": `${(fieldDetailsObj.hasOwnProperty('labelStyle')) ? fieldDetailsObj.boxStyle : ""}`,
                    "actionType": `${fieldDetailsObj.actionType}`,
                    "actionDisplayType":`${fieldDetailsObj.actionDisplayType}`,
                    "buttonCss": "cs-web-action-button",
                    "actionId"  : fieldDetailsObj.elementId,
                    "objectName":  `${userAssignObjName}`,
                    "isHiddenEnabled":`${fieldDetailsObj.isHiddenEnabled}`,
                    "traversalPath" : `${userAssignRootPath}`,
                }]
            }
        }
        else if(elementType === 'ACTION' && actionType === 'DATA_CLONE'){
            let navigationInfo = '';
            let enablePopupModel=false;
            let LayoutProperties = JSON.parse(fieldDetailsObj.actionData[0].actionInfo).LayoutProperties;
            for(let k = 0; k < LayoutProperties.length; k++){
                if (LayoutProperties[k].propertyKey === 'enablePopupModel') {
                   enablePopupModel = LayoutProperties[k].fieldDetails[0].value;
              }
           }
            navigationInfo = {
                navigationUrl: fieldDetailsObj.targetLayoutName,
                redirectUrl: layout.layoutName,
                enablePopUp:enablePopupModel ? true:false
            }

            return {
                label,
                "id" : fieldDetailsObj.elementName,
                "fieldName": fieldDetailsObj.elementName,
                "prop": fieldDetailsObj.elementName,
                "fieldType":elementType,
                'elementid': fieldDetailsObj.elementId,
                ...gridTableSkeleton,
                "actionInfo":[{
                    "actionIcon": "icon-mat-file_copy",
                    "actionName": `${fieldDetailsObj.elementName}`,
                    "actionLabel": `${fieldDetailsObj.label}`,
                    "boxStyle": `${(fieldDetailsObj.hasOwnProperty('boxStyle')) ? fieldDetailsObj.boxStyle : ""}`, 
                    "valueStyle": `${(fieldDetailsObj.hasOwnProperty('valueStyle')) ? fieldDetailsObj.boxStyle : ""}`, 
                    "labelStyle": `${(fieldDetailsObj.hasOwnProperty('labelStyle')) ? fieldDetailsObj.boxStyle : ""}`,
                    "actionType": `${fieldDetailsObj.actionType}`,
                    "actionDisplayType":`${fieldDetailsObj.actionDisplayType}`,
                    "buttonCss": "cs-web-action-button",
                    "buttonColor": "#06623b",
                    "elementid"  : fieldDetailsObj.elementId,
                    "isHiddenEnabled":`${fieldDetailsObj.isHiddenEnabled}`,
                    "actionElementId": fieldDetailsObj.actionData[0].actionBinaryId,
                    "traversalPath" : `${fieldDetailsObj.actionTagId}`, 
                    "navigationInfo":navigationInfo
                }]
            }
        }else if(elementType ==='ACTION' && actionType ==='WORKFLOW'){
            let wfActionInfo = '';
            let workflowAction = fieldDetailsObj.workflowActionInfoSet;
              for(let w=0; w<workflowAction.length; w++){
                wfActionInfo = {
                  actionDisplayType: `${workflowAction[w].actionDisplayType}`,
                  sourceStatus: workflowAction[w].sourceStatus,
                  destinationStatus: workflowAction[w].destinationStatus,
                  objectId: `pfm${workflowAction[w].fieldObjectId}`,
                  fieldName: `${workflowAction[w].fieldName}`,
                  fieldDisplayName: `${workflowAction[w].fieldDisplayName}`,
                  traversalPath: `${workflowAction[w].traversalPath}`,
                  traversalConfigJson: workflowAction[w].traversalConfigJson
                }
              }
  
              wfActionInfo = {
                  actionIcon: fieldDetailsObj.icon,
                  actionName: fieldDetailsObj.elementName,
                  actionType: fieldDetailsObj.actionType,
                  actionLabel: fieldDetailsObj.label,
                  actionDisplayType: fieldDetailsObj.actionDisplayType,
                  actionDisplayName: fieldDetailsObj.label,
                  buttonCss: "cs-web-action-button",
                  buttonColor: "#06623b",
                  sourceId: fieldDetailsObj.elementId,
                  objectName: hierarchy.primary.objectName,
                  traversalpath: hierarchy.primary.rootPath,
                  isHiddenEnabled: fieldDetailsObj.isHiddenEnabled,
                  workFlowConfig: wfActionInfo
              }
              
              return {
                  label,
                  fieldName: `cspfmaction${fieldDetailsObj.elementId}`,
                  prop: `cspfmaction${fieldDetailsObj.elementId}`,
                  id: `cspfmaction${fieldDetailsObj.elementId}`,
                  fieldType: elementType,
                  "objectName": fieldDetailsObj.objectName,
                  elementid: fieldDetailsObj.elementId,
                  traversalpath: fieldDetailsObj.rootPath,
                  ...gridTableSkeleton, 
                  actionInfo: [wfActionInfo]
              }
          }
        // else if(fieldDetailsObj.isReadOnlyEnable === 'Y'){
        //     let lookupO = {
        //         'id': "pfm" + fieldDetailsObj.objectId + "_" + fieldDetailsObj.referenceLookupFieldId + '_' + fieldName,
        //         label,
        //         'prop': "pfm" + fieldDetailsObj.objectId + "_" + fieldDetailsObj.referenceLookupFieldId + '.' + fieldName,
        //         'fieldName': "pfm" + fieldDetailsObj.objectId + "_" + fieldDetailsObj.referenceLookupFieldId,
        //         'fieldType': fieldType,
        //         "objectName":fieldDetailsObj.objectName,
        //         'elementid': fieldDetailsObj.elementId,
        //         'traversalpath': fieldDetailsObj.rootPath,
        //         ...gridTableSkeleton
        //     }
        //     return lookupO;
        // }
        else if(fieldType === 'RECORDASSOCIATION'){
           
                if(type==='LIST'){
                    let icon ='';
                    let actionDisplayType ='';
                    if(fieldDetailsObj.recordAssociationMap.recordAssociationOutputType !=='SingleWithMultiple' && fieldDetailsObj.recordAssociationMap.recordAssociationOutputType !=='SingleFromMultipleWithSingleStyle1' &&fieldDetailsObj.recordAssociationMap.recordAssociationOutputType !=='SingleFromMultipleWithSingleStyle2' ){
                        icon = fieldDetailsObj.icon
                        actionDisplayType = fieldDetailsObj.actionDisplayType
                    }
                    else {
                        icon ='';
                        actionDisplayType = '';
                    }
                    return {
                        "id": fieldName,
                        "label": fieldDetailsObj.translationKey,
                        fieldName,
                        "prop": fieldName,
                        fieldType,
                        "objectName":fieldDetailsObj.objectName,
                        'elementid': fieldDetailsObj.elementId,
                        'traversalpath': fieldDetailsObj.rootPath,
                        ...gridTableSkeleton,
                        associationInfo: {},
                        actionInfo: [
                            {
                                "actionIcon": `${icon}`,
                                "actionName":  `${fieldDetailsObj.rootPath}`,
                                "actionType": "ASSOCIATION",
                                "actionLabel": fieldDetailsObj.objectName,
                                "sourceId": `${fieldDetailsObj.elementId}`,
                                "actionDisplayType": `${actionDisplayType}`,
                                "buttonColor": "#06623b",
                                "buttonCss": "cs-web-action-button",
                                "objectName": `this1.__${fieldDetailsObj.objectName}$tableName_1`,
                                "isHiddenEnabled": `${fieldDetailsObj.isHiddenEnabled}`,
                                "elementid" : fieldDetailsObj.elementId,
                            }
                        ]
                    }
                }
                if(type === 'GRID'){

                    if(fieldDetailsObj.recordAssociationMap.recordAssociationOutputType === 'SingleWithMultiple' || fieldDetailsObj.recordAssociationMap.recordAssociationOutputType === 'SingleFromMultipleWithSingleStyle1' || fieldDetailsObj.recordAssociationMap.recordAssociationOutputType === 'SingleFromMultipleWithSingleStyle2'){
                        return {
                            "id": fieldName,
                            "label": fieldDetailsObj.translationKey,
                            fieldName,
                            "prop": fieldName,
                            fieldType,
                            "objectName":fieldDetailsObj.objectName,
                            'elementid': fieldDetailsObj.elementId,
                            'traversalpath': fieldDetailsObj.rootPath,
                            ...gridTableSkeleton
                        }
                    }
                    else {
                        return
                    }
                } 
        } else if (elementType === 'ACTION' && actionType === 'FILE_MANAGE') {
            let LayoutProperties = JSON.parse(fieldDetailsObj.actionData[0].actionInfo).LayoutProperties;
            let objectName = []
            LayoutProperties.forEach(element => {
                let objsName = element.find(objs => objs.propertyKey === 'objectName').fieldDetails[0].value;
                objectName.push(objsName);
            });
            return {
                label: fieldDetailsObj.label,
                fieldName: `cspfmaction${fieldDetailsObj.elementId}`,
                prop: `cspfmaction${fieldDetailsObj.elementId}`,
                id: `cspfmaction${fieldDetailsObj.elementId}`,
                fieldType: "ACTION",
                child: "",
                dateFormat: "",
                elementid: fieldDetailsObj.elementId,
                mappingDetails: "",
                objectName: hierarchy,
                currencyDetails: "",
                actionInfo: [{
                    actionIcon: `${fieldDetailsObj.icon}`,
                    actionName: `${fieldDetailsObj.elementName}`,
                    actionType: `${fieldDetailsObj.actionType}`,
                    actionLabel: `${fieldDetailsObj.label}`,
                    actionDisplayType: fieldDetailsObj.actionDisplayType,
                    buttonCss: "cs-web-action-button",
                    sourceId: "",
                    elementid: fieldDetailsObj.elementId,
                    isHiddenEnabled: `${fieldDetailsObj.isHiddenEnabled}`,
                    actionElementId: `${fieldDetailsObj.actionData[0].actionBinaryId}`,
                }]
            }
        } else if (elementType === 'ACTION' && actionType === 'CUSTOM') {
            return {
                label: fieldDetailsObj.label,
                fieldName: `cspfmaction${fieldDetailsObj.elementId}`,
                prop: `cspfmaction${fieldDetailsObj.elementId}`,
                id: `cspfmaction${fieldDetailsObj.elementId}`,
                fieldType: "ACTION",
                child: "",
                dateFormat: "",
                elementid: fieldDetailsObj.elementId,
                mappingDetails: "",
                objectName: hierarchy,
                currencyDetails: "",
                actionInfo: [{
                    actionIcon: `${fieldDetailsObj.icon}`,
                    actionName: `${fieldDetailsObj.elementName}`,
                    actionType: `${fieldDetailsObj.actionType}`,
                    actionLabel: `${fieldDetailsObj.label}`,
                    actionDisplayType: fieldDetailsObj.actionDisplayType,
                    buttonCss: "cs-web-action-button",
                    sourceId: fieldDetailsObj.elementId,
                    elementid: fieldDetailsObj.elementId,
                    isHiddenEnabled: `${fieldDetailsObj.isHiddenEnabled}`,
                    actionElementId: `${fieldDetailsObj.actionData[0].actionBinaryId}`,
                }]
            }
        }
        else {
            return {
                "id": fieldName,
                label,
                fieldName,
                "prop": fieldName,
                fieldType,
                "objectName":fieldDetailsObj.objectName,
                'elementid': fieldDetailsObj.elementId,
                'traversalpath': fieldDetailsObj.rootPath,
                ...gridTableSkeleton
            };
        }
    }catch(err){
        logger.debug("Error in  listTableFormation=====>",err);
        throw err;
    }

},
associtationTableColumnInfo:async(gridTableSkeleton, fieldDetailsObj,layout,appObject)=>{
    try{
        var {
            fieldType,
        } = fieldDetailsObj;
        let data;
        let baseCtrlObj = {
            baseCtrlMap: new Map()
        }
        baseCtrlObj.baseCtrlMap.set("META_JSON", appObject);
        if(fieldType === 'RECORDASSOCIATION'){
            if (fieldDetailsObj.recordAssociationMap.recordAssociationOutputType !=='SingleWithMultiple' &&fieldDetailsObj.recordAssociationMap.recordAssociationOutputType !=='SingleFromMultipleWithSingleStyle1' &&fieldDetailsObj.recordAssociationMap.recordAssociationOutputType !=='SingleFromMultipleWithSingleStyle2' ){
                let temp = {};
                let tempFieldName = fieldDetailsObj.fieldName;
                if(fieldDetailsObj.recordAssociationMap && fieldDetailsObj.recordAssociationMap.recordassociationlayoutlist) {
                    for (let i = 0;i< fieldDetailsObj.recordAssociationMap.recordassociationlayoutlist.length; i++) {
                        let currentField = fieldDetailsObj.recordAssociationMap.recordassociationlayoutlist[i];
                        let secondaryParent = tempFieldName + "-" + currentField.objectName;
                        temp[secondaryParent] = {};
                        for(let j=0;j<currentField.pfmPopupSet[0].pfmPopupLineSet.length;j++) {
                            let currentChild = currentField.pfmPopupSet[0].pfmPopupLineSet[j];
                            var childObj=JSON.parse(currentField.pfmPopupSet[0].popupHierarchyJson);
                            if(currentChild.mappingType === "RESULT") {
                                let keyValue =``;
                                let popuplinkSet = await popupAction.popuplinkSetFormation(childObj);
                                let popupLinkHierarchy = await popupAction.getHierarchySet(popuplinkSet, currentField.objectId);
                                let linkSetNotPrimary = popuplinkSet.filter(
                                    linkJSON => linkJSON.objectType.toUpperCase() !== 'PRIMARY' && linkJSON.objectId !== currentField.objectId
                                )
                                        let gridTableO = await module.exports.dataTableArrayFormation(gridTableSkeleton, currentChild, baseCtrlObj);
                                        gridTableO['label'] = currentChild.label;
                                        if (currentField.objectId !== currentChild.objectId) {
                                            data = await fieldInfoJson.getJsonFormation(linkSetNotPrimary, currentChild.objectId, currentChild.rootPath, gridTableO, currentChild.fieldId, Object.entries(popupLinkHierarchy));
                                        } else {
                                            data = gridTableO;
                                        }
                                    // }
                                temp[secondaryParent][secondaryParent + "_" + currentChild.mappingColumnName] = data
                                // {
                                //     id: currentChild.mappingColumnName,
                                //     label: currentChild.label,
                                //     fieldName: currentChild.fieldName,
                                //     prop: currentChild.fieldName,
                                //     fieldType: currentChild.fieldType,
                                //     child: "",
                                //     objectName: currentField.objectName,
                                //     traversalpath:currentChild.rootPath,
                                //     ...gridTableSkeleton
    
                                // }
                                if(currentChild.fieldType==="DATE"|| ((currentChild.fieldType==="FORMULA" || currentChild.fieldType==="ROLLUPSUMMARY") && currentChild.rollupResultType === 'DATE')){
                                    temp[secondaryParent][secondaryParent + "_" + currentChild.mappingColumnName]['dateFormat'] = `this.appUtilityConfig.userDateFormat1`;
                                }
                                else if(currentChild.fieldType==="TIMESTAMP" || ((currentChild.fieldType==="FORMULA" || currentChild.fieldType==="ROLLUPSUMMARY") && currentChild.rollupResultType === 'DATETIME')){
                                    temp[secondaryParent][secondaryParent + "_" + currentChild.mappingColumnName]['dateFormat'] = `this.appUtilityConfig.userDateTimeFormat1`;
                                }
                                else if (currentChild.fieldType==="CURRENCY" || ((currentChild.fieldType==="FORMULA" || currentChild.fieldType==="ROLLUPSUMMARY") && currentChild.rollupResultType === 'CURRENCY')){
                                    temp[secondaryParent][secondaryParent + "_" + currentChild.mappingColumnName]['currencyDetails'] ={
                                        currencyCode: currentChild.currencySymbol,
                                        display: true,
                                        digitsInfo: '1.2-2',
                                        locale: currentChild.locale
                                    }
                                }
                                else if(currentChild.fieldType === 'RADIO' || currentChild.fieldType === 'CHECKBOX' || currentChild.fieldType === 'DROPDOWN' || currentChild.fieldType === 'MULTISELECT'){
                                    let option=currentChild.options.split('|')
                                    let optionValue=currentChild.optionValue.split('|')                                                                                
                                    for (const l in option) {
                                        if (keyValue === '') {
                                            keyValue = `{"${optionValue[l]}": "${option[l]}"`;
                                        } else {
                                            keyValue += `,"${optionValue[l]}": "${option[l]}"`;
                                        }
                                    }
                                    temp[secondaryParent][secondaryParent + "_" + currentChild.mappingColumnName]['mappingDetails'] = JSON.parse(keyValue + '}')
                                }
                                 if(currentChild.fieldType =='ROLLUPSUMMARY'){
                                    temp[secondaryParent][secondaryParent + "_" + currentChild.mappingColumnName]['rollupResultType']=currentChild.rollupResultType === 'STRING' ? 'TEXT' : currentChild.rollupResultType === 'DATETIME' ? 'TIMESTAMP' : currentChild.rollupResultType
                                }else if(currentChild.fieldType =='FORMULA'){
                                    temp[secondaryParent][secondaryParent + "_" + currentChild.mappingColumnName]['formulaType']=currentChild.rollupResultType === 'STRING' ? 'TEXT' : currentChild.rollupResultType === 'DATETIME' ? 'TIMESTAMP' : currentChild.rollupResultType
                                }
                            }
                        }
                    }
                }
                return temp;

            }
        }
    }catch(errorMsg){
        logger.debug("Error in  associtationTableColumnInfo=====>",errorMsg);
        throw errorMsg;
    }
 },

moreActionInfoJson:async(fieldDetailsObj, hierarchy, layout, sectionType, layoutSectionSet, actionType) => {
    try{
        let moreActionInfo = '';
        let moreActionItemsInfo = [];
        let whoColumnAuditType = '';
        let moreChooseStyles = '';
        let rootPath = layout.layoutLinkSet.find(value => value.objectType.toUpperCase() === 'PRIMARY').rootPath;
        let sortedActions = fieldDetailsObj.elementActions.sort(function(a, b){
            return a.displayOrder - b.displayOrder;
        });
                for (let k = 0; k < fieldDetailsObj.elementActions.length; k++) {
                    let elementMoreAction = sortedActions[k];
                    let elementActionDatas = elementMoreAction.actionData[0];
                    let elementActionInfos = JSON.parse(elementActionDatas.actionInfo);
                    let LayoutPropertiesActions = elementActionInfos.LayoutProperties;  
                    let actionCallingMethodName = '';
                    let reportParamsCount = 0
                    let reportMethodParams = '';
                    let reportMethodParams2 = '';
                    let reportMethodParams3 = '';
                    let reportMethodParams4 = '';
                    let redirectionTo = '';
                    let enablePopupModel = '';
                    let moreActionItems = {} ;

                    if(LayoutPropertiesActions.length > 0){
                        for (let j = 0; j < LayoutPropertiesActions.length; j++) {
                            if(LayoutPropertiesActions[j].propertyKey ==='redirectionTo'){
                                redirectionTo = LayoutPropertiesActions[j].fieldDetails[0].redirectionTypeName;
                            } else if(LayoutPropertiesActions[j].propertyKey ==='enablePopupModel'){
                                enablePopupModel = LayoutPropertiesActions[j].fieldDetails[0].value;
                            }                                
                        }
                    }

                    if(elementActionInfos.actionType === 'WHO_COLUMN'){
                        whoColumnAuditType = elementActionInfos.LayoutProperties.find(properties => properties.propertyKey === 'default').fieldDetails[0].value;
                    }

                    if (elementMoreAction.actionType === 'NEW'){ 
                        actionCallingMethodName = `addButton_${elementMoreAction.elementId}_Onclick`
                    } else if (elementMoreAction.actionType === 'EDIT'){
                        actionCallingMethodName =  `editButton_${elementMoreAction.elementId}_Onclick`
                    } else if (elementMoreAction.actionType === 'LIST'){
                        actionCallingMethodName = `listButton_${elementMoreAction.elementId}_Onclick`
                    } else if (elementMoreAction.actionType === 'SAVE'){
                        actionCallingMethodName = `saveButtonOnclick`
                    } else if (elementMoreAction.actionType === 'DATA_UPSERT'){
                        actionCallingMethodName = `dataUpsert_Onclick`
                    } else if (elementMoreAction.actionType === 'DATA_FETCH'){
                        actionCallingMethodName = `dataFetch_${elementMoreAction.elementId}_Onclick`
                    }else if (elementMoreAction.actionType === 'SEARCH'){
                        actionCallingMethodName = `filterActionForMoreAction`
                    }else if (elementMoreAction.actionType === 'MAKE_AS_HEADER'){
                        actionCallingMethodName = `makeAsHeaderAction`
                        reportParamsCount = 4
                        reportMethodParams = ``
                        reportMethodParams2 = `${rootPath}`
                        reportMethodParams3 = `/menu/${layout.layoutName}`
                        reportMethodParams4 = `/menu/${elementActionInfos.redirectionLayoutName}`
                    } else if (elementMoreAction.actionType === 'VIEW'){
                        actionCallingMethodName = ``
                    } else if (elementMoreAction.actionType === 'FILE_MANAGE'){
                        actionCallingMethodName = `${layoutSectionSet === 'LIST' ? `fileManageActionOnClickForListSection` : `fileManageActionOnClick`}`
                        reportParamsCount = 2
                        reportMethodParams = elementActionDatas.actionBinaryId
                        reportMethodParams2 = [hierarchy.primary.objectName]
                    } else if (elementMoreAction.actionType === 'REPORT'){
                        actionCallingMethodName = `reportAction`
                        reportParamsCount = 1
                        reportMethodParams = `this.reportInput1['${elementMoreAction.elementId}']&&`
                    } else if (elementMoreAction.actionType === 'PRINTER'){
                        actionCallingMethodName = `reportAction`
                        reportParamsCount = 1
                        reportMethodParams = `this.printInput1['${elementMoreAction.elementId}']&&`
                    }

                    if(layoutSectionSet !== 'LIST'){
                        moreActionItems = {
                            actionIcon: elementMoreAction.icon,
                            actionName: elementMoreAction.elementName,
                            actionType: elementMoreAction.actionType,
                            actionLabel: elementMoreAction.label,
                            actionDisplayType: elementMoreAction.actionDisplayType,
                            auditType: whoColumnAuditType,
                            buttonCss: "cs-web-action-button",
                            isHiddenEnabled: elementMoreAction.isHiddenEnabled,
                            elementid: elementMoreAction.elementId,
                            actionCallingMethodName: actionCallingMethodName,
                            actionCallingMethodParamsCount: reportParamsCount,
                            actionCallingMethodParams: {
                                params1: reportMethodParams,
                                params2: reportMethodParams2,
                                params3: reportMethodParams3,
                                params4: reportMethodParams4
                            }
                        }
                        
                    } else {
                        moreActionItems = { 
                            actionIcon: elementMoreAction.icon,
                            actionName: elementMoreAction.elementName,
                            actionType: elementMoreAction.actionType,
                            actionLabel: elementMoreAction.label,
                            actionDisplayType: elementMoreAction.actionDisplayType,
                            auditType: whoColumnAuditType,
                            buttonCss: "cs-web-action-button",
                            isHiddenEnabled: elementMoreAction.isHiddenEnabled,
                            elementid: elementMoreAction.elementId,
                            navigationInfo : {
                                navigationUrl: redirectionTo,
                                redirectUrl: layout.layoutName,
                                uniqueKey: 'id',
                                enablePopUp: enablePopupModel,
                                relationalObjectInfo: {
                                relationalObjectName: "",
                                relationalObjectId: "",
                                fieldType: "",
                                child: ""
                                }
                                }
                            } 
                        }
                        if(elementMoreAction.actionType === 'FILE_MANAGE' && layoutSectionSet === 'LIST') {
                            moreActionItems['actionElementId'] = elementActionDatas.actionBinaryId;
                        }
                moreActionItemsInfo.push(moreActionItems)

                    }
                    let isSelectActionEnabled = '';
                    let selectAndGoValue = '';
                    let moreActionDisplayTypes = '';
                    let moreActionDisplayType = '';
                    let moreActionFinalInfo = '';
                    let actionDatas = fieldDetailsObj.actionData[0];
                    let actionInfos = JSON.parse(actionDatas.actionInfo);
                    let LayoutProperties = actionInfos.LayoutProperties;
                    if(LayoutProperties.length > 0){
                        moreChooseStyles = LayoutProperties.find(property => property.propertyKey === 'chooseStyle').fieldDetails[0].value;
                        isSelectActionEnabled = LayoutProperties.find(properties => properties.propertyKey === 'chooseType').fieldDetails[0].value;
                        moreActionDisplayTypes = LayoutProperties.find(properties => properties.propertyKey === 'chooseStyle').fieldDetails[0].value;
                        selectAndGoValue = LayoutProperties.find(properties => properties.propertyKey === 'selectAndGo').fieldDetails[0].value;
                        if(moreActionDisplayTypes === 'Fab'){
                          moreActionDisplayType = "fabOption"
                        } else if(moreActionDisplayTypes === 'Popup' && fieldDetailsObj.moreActionElementDisplayType === 'Button'){
                            moreActionDisplayType = "labelOnly" 
                        } else if(moreActionDisplayTypes === 'Popup' && (fieldDetailsObj.moreActionElementDisplayType === 'Icon' || fieldDetailsObj.moreActionElementDisplayType === 'IconandButton')){
                            moreActionDisplayType = "labelWithIcon"
                        } else if(moreActionDisplayTypes === 'RadioButtonWithPopup' && fieldDetailsObj.moreActionElementDisplayType === 'Button'){
                            moreActionDisplayType = "radioOnly"
                        } else if(moreActionDisplayTypes === 'RadioButtonWithPopup' && (fieldDetailsObj.moreActionElementDisplayType === 'Icon' || fieldDetailsObj.moreActionElementDisplayType === 'IconandButton')){
                            moreActionDisplayType = "radioWithIcon" 
                        } else if(moreActionDisplayTypes === 'Inline' && fieldDetailsObj.moreActionElementDisplayType === 'Button'){
                            moreActionDisplayType = "inlineSelect"
                        } else if(moreActionDisplayTypes === 'Inline' && (fieldDetailsObj.moreActionElementDisplayType === 'Icon' || fieldDetailsObj.moreActionElementDisplayType === 'IconandButton')){
                            moreActionDisplayType = "inlineIconSelect"
                        }

                    }
                    
                        moreActionInfo = {
                            actionIcon: fieldDetailsObj.icon,
                            actionName: `${layoutSectionSet === 'LIST' ? "MORE_ACTION" : fieldDetailsObj.elementName}`,
                            actionType: `${layoutSectionSet === 'LIST' ? "MORE_ACTION" : fieldDetailsObj.actionType}`,
                            actionLabel: fieldDetailsObj.label,
                            actionDisplayType: fieldDetailsObj.actionDisplayType,
                            actionDisplayName: fieldDetailsObj.label,
                            buttonCss:"cs-web-action-button",
                            sourceId: fieldDetailsObj.elementId,
                            objectName: hierarchy.primary.objectName,
                            isHiddenEnabled: fieldDetailsObj.isHiddenEnabled,
                            isPageHeader:`${sectionType === 'WEBHEADER' ? "Y" : "N"}`,
                            moreActionDisplayType: moreActionDisplayType,
                            isGoAndSelectActionEnabled:`${isSelectActionEnabled === 'selectandgo' ? "Y" : "N"}`,
                            selectAndGoValue: selectAndGoValue,
                            isFab : moreChooseStyles === 'Fab' ? true : false,
                            moreActionItems: moreActionItemsInfo
                        }
                            
                        if(layoutSectionSet !== 'LIST'){
                            moreActionFinalInfo = `"${fieldDetailsObj.elementId}":${JSON.stringify(moreActionInfo)}`
                        } else {
                            moreActionFinalInfo = actionType !== 'ACTIONSGROUP' ?{
                                label: fieldDetailsObj.translationKey,
                                fieldName: fieldDetailsObj.elementName,
                                prop: fieldDetailsObj.elementName,
                                id: fieldDetailsObj.elementName,
                                fieldType: fieldDetailsObj.actionType,
                                child: "",
                                elementid : fieldDetailsObj.elementId,
                                dateFormat: "",
                                objectName: hierarchy.primary.objectName,
                                mappingDetails: "",
                                currencyDetails: "",
                                actionInfo: [moreActionInfo]
                            } : moreActionInfo;
                        }

                    return moreActionFinalInfo;
            
    }catch(errorMsg){
        logger.debug("Error in  MoreActionInfoJson=====>",errorMsg);
        throw errorMsg;
    }
 }

}
const getHierechyLevel = (linkSetObj, objID, parentObjId, levelCount, levelObjectId, returnData) => {
    const childObjs = getChildObj(parentObjId, linkSetObj);
    for (let i = 0; i < childObjs.length; i++) {
        const child = childObjs[i];
        const tempLevelObj = [...levelObjectId];
        tempLevelObj.push(parentObjId);
        if (child.objectId === objID) {
            tempLevelObj.push(objID);
            returnData.levelCount = levelCount;
            returnData.levelObjectId = tempLevelObj;
            returnData.levelObjectId.shift();
            return;
        }
        const tempLevelCount = levelCount + 1;
        getHierechyLevel(linkSetObj, objID, child.objectId, tempLevelCount, tempLevelObj, returnData);
    }
    return;
}


const getChildObj = (objId, linkSet) => {
    return linkSet.filter(link => link.referenceObjectId === objId && link.objectType.toUpperCase() === 'MASTERDETAIL')
}