const actionForAll = require("./allActionController"), 
    webSearchListController = require("./webSearchListController"),
    webListController= require("./webListController"),
    listTableFormation = require("./listTableFormation"),
    ViewControllerForWeb = require("./ViewControllerForWeb"),
    { gridGridViewController, ...gridGridViewControllerWeb } = require('./gridGridViewControllerWeb'),
    gridListViewController = require("./gridListViewControllerForWeb"),
    editDrawerControllerForWeb = require("./editDrawerControllerForWeb"),
    recordAssignmentCtrlWeb = require('./recordAssignmentControllerForWeb')
    slickGrid = require("./slickGridFormation"),
webEditController = require('./editControllerForWeb.js');
const fieldInfoJson = require("./fieldInfoJsonFormation");
const lodash= require('lodash');
const importDeails=require('../../../core/common');
module.exports = {
    baseImports: (baseCtrlObj, layout, appObject, layoutGrpObj, searchFlag, dbVar, hierarchy, isPreviewRequired) => {
        return new Promise(async(resolve, reject) => {
            try {
               
                    var dbImport = `import { couchdbProvider } from 'src/core/db/couchdbProvider';
                    import { onlineDbIndexCreation } from 'src/core/utils/onlineDbIndexCreation';
                    import { dbProvider } from 'src/core/db/dbProvider';
                    ${(layout.layoutType === 'Grid_with_List' && layout.layoutMode === 'VIEW') ? '' : `import { offlineDbIndexCreation } from 'src/core/utils/offlineDbIndexCreation';`}`
                    var importData=await importDeails.importModulesFun(layout,'layoutImport');
                let baseImports = `import { Inject, Component, ViewChild, OnInit, ApplicationRef, ChangeDetectorRef,ViewChildren, HostListener,ElementRef, QueryList, Input} from '@angular/core';
                import { Platform, LoadingController, Events, ToastController, IonVirtualScroll, ModalController, AlertController, PopoverController } from '@ionic/angular';
                import { EmailComposer } from '@ionic-native/email-composer/ngx';
                import { SocialSharing } from '@ionic-native/social-sharing/ngx';
                import { SMS } from '@ionic-native/sms/ngx';
                import { CallNumber } from '@ionic-native/call-number/ngx';
                import * as lodash from 'lodash';
                import * as _ from "underscore";
                import { Router, ActivatedRoute } from '@angular/router';
                import { appUtility } from 'src/core/utils/appUtility';
                import { dataProvider } from 'src/core/utils/dataProvider';
                import { appConstant } from 'src/core/utils/appConstant';
                import { ColumnMode } from "@swimlane/ngx-datatable";
                import { FieldInfo, cspfm_data_display, CspfmDataFormatter,cspfmDataGrouping, cspfmCustomEditor, CspfmDataValidator, CspfmActionsFormatter,cspfmAssociationDataFormatter, CspfmDataExportFormatter, cspfmUrlDataFormatter } from 'src/core/pipes/cspfm_data_display';
                import { Column, GridOption, FieldType, Filters, OperatorType, AngularGridInstance,FilterService, FileType, ExcelExportOption,GridStateChange, ExtensionName,AngularUtilService, DelimiterType,Editors, GroupingFormatterItem, CurrentSorter, OnEventArgs, SlickGrid } from 'angular-slickgrid';
                import { TranslateService } from '@ngx-translate/core';
                import { lookupFieldMapping } from 'src/core/pfmmapping/lookupFieldMapping';
                import * as moment from 'moment';
                import { lookuppage } from 'src/core/pages/lookuppage/lookuppage';
                import { cspfmCustomFieldProvider } from 'src/core/utils/cspfmCustomFieldProvider';
                import { registerLocaleData } from "@angular/common";
                import { cspfmactionweb } from 'src/core/components/cspfmactionweb/cspfmactionweb';
                import { objectTableMapping } from "src/core/pfmmapping/objectTableMapping";
                import { cspfmObjectConfiguration } from 'src/core/pfmmapping/cspfmObjectConfiguration';
                import { MdePopoverTrigger } from '@material-extended/mde';
                import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
                import { cspfmAlertDialog } from 'src/core/components/cspfmAlertDialog/cspfmAlertDialog';
                import { cspfmweblookuppage } from 'src/core/pages/cspfmweblookuppage/cspfmweblookuppage';
                import { cspfmFlatpickrConfig } from 'src/core/utils/cspfmFlatpickrConfig';
                import * as filterConfig from '../../assets/filterConfig/filter_based_conditional_operator_setting.json'
                import { cspfmSlickgridPopover } from 'src/core/components/cspfmSlickgridPopover/cspfmSlickgridPopover';
                import { SlickgridPopoverService } from 'src/core/services/slickgridPopover.service';
                import { CspfmReportGenerationService } from 'src/core/services/cspfmReportGeneration.service';
                import { cspfmExecutionPouchDbProvider } from "src/core/db/cspfmExecutionPouchDbProvider";
                import { cspfmExecutionPouchDbConfiguration } from "src/core/db/cspfmExecutionPouchDbConfiguration";
                import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
                import { cspfmBooleanEvaluation } from 'src/core/utils/cspfmBooleanEvaluation';
                import { cspfmLiveListenerHandlerUtils } from 'src/core/dynapageutils/cspfmLiveListenerHandlerUtils';
                import { DependentObjectListType, FetchMode } from 'src/core/models/cspfmLiveListenerConfig.type';
                ${dbImport}
                ${importData.imports}
                import { cspfmSlickgridMatrixService, MatrixConfig } from 'src/core/services/cspfmSlickgridMatrix.service';
                import { SectionObjectDetail } from 'src/core/models/cspfmSectionDetails.type';
                import { cspfmGridsectionListIdConfiguration } from 'src/core/utils/cspfmGridsectionListIdConfiguration';
                import { cspfmDataTraversalUtils } from 'src/core/dynapageutils/cspfmDataTraversalUtils';
                import { cspfmConditionalFormattingUtils } from "src/core/dynapageutils/cspfmConditionalFormattingUtils";
                import { ConditionalFormat, EntryType } from "src/core/models/cspfmConditionalFormat.type";	
                import { ObjectHierarchy } from "src/core/models/cspfmObjectHierarchy.type";
                import { DataFieldTraversal } from 'src/core/models/cspfmDataFieldTraversal.type';
                import { cspfmConditionalValidationUtils } from "src/core/dynapageutils/cspfmConditionalValidationUtils";
                import { ConditionalValidation, HeaderLineListType } from 'src/core/models/cspfmConditionalValidation.type';
                import { cspfmOnDemandFeature } from 'src/core/utils/cspfmOnDemandFeature';
                import { cspfmCustomActionUtils } from 'src/core/dynapageutils/cspfmCustomActionUtils';
                declare var $: any;
                declare const window: any;`;

                if (layout.layoutType === 'Grid_with_List' && layout.layoutMode === 'VIEW') {
                    baseImports += `
                    import { cspfmListSearchListUtils } from 'src/core/dynapageutils/cspfmListSearchListUtils';
                    import { cspfmHeaderLineUtils } from "src/core/dynapageutils/cspfmHeaderLineUtils";
                    import { cspfmSlickgridUtils } from 'src/core/dynapageutils/cspfmSlickgridUtils';
                    import { cspfmLayoutConfiguration } from 'src/core/pfmmapping/cspfmLayoutConfiguration';
                    import { DrawerState } from "ion-bottom-drawer";
                    import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
                    import { DatePipe } from "@angular/common";
                    import { metaDataDbProvider } from "src/core/db/metaDataDbProvider";
                    import { metaDbConfiguration } from "src/core/db/metaDbConfiguration";
                    import { cspfmLookupCriteriaUtils } from 'src/core/utils/cspfmLookupCriteriaUtils';
                    import { cspfmMetaCouchDbProvider } from 'src/core/db/cspfmMetaCouchDbProvider';
                    import { NgZone } from '@angular/core';
                    import { cspfmBulkWorkFlowValidation } from 'src/core/services/cspfmBulkWorkFlowValidation.service';
                    import { cspfmDateEditor } from 'src/core/dynapageutils/cspfmDateEditor';
                    import { cspfmBalloonComponent } from 'src/core/components/cspfmBalloonComponent/cspfmBalloonComponent';
                    declare function userAssignment(layoutId,userAssignService,metaDbProvider,metaDbConfig):any;`
                    await gridListViewController.gridListBaseImportsForWeb(layout).then((imports) => {
                        baseImports += imports;
                        baseCtrlObj.baseCtrlMap.set("IMPORTS", baseImports);
                        resolve(baseImports);
                    }).catch((error) => {
                        logger.debug(`controllerSegments.js :: baseImports :: CATCH ${error}`);
                        reject(error);
                    });
                } else if(layout.layoutType === 'Grid_with_List' && layout.layoutMode === 'LIST' && searchFlag){
                    webSearchListController.searchBaseImportsForWeb(layout).then((imports) => {
                        baseImports += imports;
                        baseImports += `
                        import { cspfmLayoutConfiguration } from 'src/core/pfmmapping/cspfmLayoutConfiguration';
                        import { cspfmSlickgridUtils } from 'src/core/dynapageutils/cspfmSlickgridUtils';
                        import { cspfmListSearchListUtils } from 'src/core/dynapageutils/cspfmListSearchListUtils';
                        import { cspfmLookupCriteriaUtils } from 'src/core/utils/cspfmLookupCriteriaUtils';
                        import { metaDbConfiguration } from 'src/core/db/metaDbConfiguration';
                        import { metaDataDbProvider } from "src/core/db/metaDataDbProvider";
                        import { cspfmMetaCouchDbProvider } from 'src/core/db/cspfmMetaCouchDbProvider';
                        import { FilterFieldInfo, FieldDataType } from 'src/core/models/cspfmFilterFieldInfo.type';
                        import { FormulaType } from 'src/core/models/cspfmFormulaType.enum';
                        import { FilterSectionDetail } from 'src/core/models/cspfmFilterDetails.type';
                        import { cspfmListFilterUtils } from 'src/core/dynapageutils/cspfmListFilterUtils';
                        import { NgZone } from '@angular/core';
                        import { cspfmBulkWorkFlowValidation } from 'src/core/services/cspfmBulkWorkFlowValidation.service';
                        import { cspfmDateEditor } from 'src/core/dynapageutils/cspfmDateEditor';
                        import { cspfmBalloonComponent } from 'src/core/components/cspfmBalloonComponent/cspfmBalloonComponent';
                        declare function userAssignment(layoutId,userAssignService,metaDbProvider,metaDbConfig):any;`;
                        baseCtrlObj.baseCtrlMap.set("IMPORTS", baseImports);
                        resolve(baseImports);
                    }).catch((error) => {
                        logger.debug(`controllerSegments.js :: baseImports :: CATCH ${error}`);
                        reject(error);
                    });
                } else if(layout.layoutType === 'List' && layout.layoutMode === 'LIST' && layout.pageType && layout.pageType.toUpperCase() ==='ASSIGNMENT'){
                    recordAssignmentCtrlWeb.assignmentBasicImports().then((imports) => {
                        baseImports = imports;
                        baseCtrlObj.baseCtrlMap.set("IMPORTS", baseImports);
                        resolve(baseImports);
                    }).catch((error) => {
                        logger.debug(`controllerSegments.js :: baseImports :: CATCH ${error}`);
                        reject(error);
                    });
                } else if(layout.layoutType === 'List' && layout.layoutMode === 'LIST'){
                    webListController.listBaseImportsForWeb(layout).then((imports) => {
                        baseImports+=`
                        import { cspfmLayoutConfiguration } from 'src/core/pfmmapping/cspfmLayoutConfiguration';
                        import { cspfmSlickgridUtils } from 'src/core/dynapageutils/cspfmSlickgridUtils';
                        import { cspfmListSearchListUtils } from 'src/core/dynapageutils/cspfmListSearchListUtils';
                        import { cspfmLookupCriteriaUtils } from 'src/core/utils/cspfmLookupCriteriaUtils';
                        import { metaDbConfiguration } from 'src/core/db/metaDbConfiguration';
                        import { metaDataDbProvider } from "src/core/db/metaDataDbProvider";
                        import { cspfmMetaCouchDbProvider } from 'src/core/db/cspfmMetaCouchDbProvider';
                        import { NgZone } from '@angular/core';
                        import { cspfmBulkWorkFlowValidation } from 'src/core/services/cspfmBulkWorkFlowValidation.service';
                        import { cspfmDateEditor } from 'src/core/dynapageutils/cspfmDateEditor';
                        import { cspfmBalloonComponent } from 'src/core/components/cspfmBalloonComponent/cspfmBalloonComponent';
                        declare function userAssignment(layoutId,userAssignService,metaDbProvider,metaDbConfig):any;`
                        baseImports += imports;
                        baseCtrlObj.baseCtrlMap.set("IMPORTS", baseImports);
                        resolve(baseImports);
                    }).catch((error) => {
                        logger.debug(`controllerSegments.js :: baseImports :: CATCH ${error}`);
                        reject(error);
                    });
                } else if (layout.layoutType === 'Grid' && layout.layoutMode === 'EDIT') {
                    baseImports = `import {
                        Component,
                        ViewChild,
                        OnInit,
                        ApplicationRef,
                        ChangeDetectorRef,
                        HostListener,
                        Renderer2,
                        NgZone,
                        Inject
                    } from '@angular/core';
                    import { registerLocaleData } from "@angular/common";
                    ${dbImport}
                    import {
                        dataProvider
                    } from 'src/core/utils/dataProvider';
                    import {
                        appConstant
                    } from 'src/core/utils/appConstant';
                    import { cspfmLookupCriteriaUtils } from 'src/core/utils/cspfmLookupCriteriaUtils';
                    import { cspfmweblookuppage } from 'src/core/pages/cspfmweblookuppage/cspfmweblookuppage';
                    import { cspfmMetaCouchDbProvider } from 'src/core/db/cspfmMetaCouchDbProvider';
                    import { metaDbConfiguration } from 'src/core/db/metaDbConfiguration';
                    import { cspfmLayoutConfiguration } from 'src/core/pfmmapping/cspfmLayoutConfiguration';
                    import { cspfmConditionalFormattingUtils } from "src/core/dynapageutils/cspfmConditionalFormattingUtils";
                    import { ConditionalFormat, EntryType } from "src/core/models/cspfmConditionalFormat.type";	
                    import { cs_conditionalvalidation_toast } from './../../core/components/cs_conditionalvalidation_toast/cs_conditionalvalidation_toast';
                    import { cs_conditionalvalidation_consolidate } from 'src/core/components/cs_conditionalvalidation_consolidate/cs_conditionalvalidation_consolidate';
                    import { ObjectHierarchy } from "src/core/models/cspfmObjectHierarchy.type";
                    import { cspfmConditionalValidationUtils } from "src/core/dynapageutils/cspfmConditionalValidationUtils";
                    import { ConditionalValidation } from "src/core/models/cspfmConditionalValidation.type";
                    import { DataFieldTraversal } from 'src/core/models/cspfmDataFieldTraversal.type';
                    import { cspfmLookupService } from 'src/core/utils/cspfmLookupService';
                    import { cspfmSlickgridUtils } from 'src/core/dynapageutils/cspfmSlickgridUtils';
                    import { cspfmBulkWorkFlowValidation } from 'src/core/services/cspfmBulkWorkFlowValidation.service';`;
                    webEditController.editBaseImportsForWeb().then((imports) => {
                        baseImports += imports;
                        baseCtrlObj.baseCtrlMap.set("IMPORTS", baseImports);
                        resolve(baseImports);
                    }).catch((error) => {
                        logger.debug(`controllerSegments.js :: baseImports :: CATCH ${error}`);
                        reject(error);
                    });
                    if(layout.isDrawerEnable === 'Y'){
                        editDrawerControllerForWeb.baseImports(layout).then(imports => {
                            baseImports += imports;
                            baseCtrlObj.baseCtrlMap.set("IMPORTS", baseImports);
                            resolve(baseImports);
                        }).catch((error) => {
                            logger.debug(`controllerSegmentsForWeb.js :: baseImports :: CATCH ${error}`);
                            reject(error);
                        });
                    }
                } else if (layout.layoutType === 'Grid' && layout.layoutMode === 'VIEW' && layout.isDrawerEnable === 'Y') {
                    baseImports += `import { metaDataDbProvider } from "src/core/db/metaDataDbProvider";
                    import { metaDbConfiguration } from "src/core/db/metaDbConfiguration";
                    import { DatePipe } from "@angular/common";
                    import { cspfmMetaCouchDbProvider } from 'src/core/db/cspfmMetaCouchDbProvider';
                    import { cspfmLayoutConfiguration } from "src/core/pfmmapping/cspfmLayoutConfiguration";
                    import { cspfmBulkWorkFlowValidation } from 'src/core/services/cspfmBulkWorkFlowValidation.service';
                    import { cspfmSlickgridUtils } from 'src/core/dynapageutils/cspfmSlickgridUtils';
                    import { cspfmBalloonComponent } from 'src/core/components/cspfmBalloonComponent/cspfmBalloonComponent';
                    `
                    gridGridViewControllerWeb.detailViewBaseImportsForWeb(layout).then((imports) => {
                        baseImports += imports;
                        baseCtrlObj.baseCtrlMap.set("IMPORTS", baseImports);
                        resolve(baseImports);
                    }).catch((error) => {
                        logger.debug(`controllerSegments.js :: baseImports :: CATCH ${error}`);
                        reject(error);
                    });
                } else if (layout.layoutType === 'Grid' && layout.layoutMode === 'VIEW') {
                    baseImports = `import {
                        Component,
                        OnInit,
                        ApplicationRef,
                        Inject,
                        ViewChild,
                        ViewChildren,
                        QueryList,
                        Input
                      } from "@angular/core";
                      import { metaDataDbProvider } from "src/core/db/metaDataDbProvider";
                      import { dataProvider } from "src/core/utils/dataProvider";
                      import { appConstant } from "src/core/utils/appConstant";
                      import { FieldInfo, cspfm_data_display,CspfmDataValidator } from 'src/core/pipes/cspfm_data_display';
                      import { cspfmLayoutConfiguration } from "src/core/pfmmapping/cspfmLayoutConfiguration";
                      import { FieldType, Filters } from 'angular-slickgrid';
                      import { TranslateService } from '@ngx-translate/core';
                      import {
                        ModalController,
                        Platform,
                        LoadingController,
                        Events,
                        ToastController,
                        AlertController
                      } from "@ionic/angular";
                      import { MdePopoverTrigger } from '@material-extended/mde';
                      import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
                      import { cspfmAlertDialog } from 'src/core/components/cspfmAlertDialog/cspfmAlertDialog';
                      ${dbImport}
                      ${importData.imports}
                      import { objectTableMapping } from "src/core/pfmmapping/objectTableMapping";
                      import { appUtility } from "src/core/utils/appUtility";
                      import { Router, ActivatedRoute } from "@angular/router";
                      import * as lodash from "lodash";
                      import * as _ from "underscore";
                      import { DatePipe } from "@angular/common";
                      import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
                      import { cspfmExecutionPouchDbProvider } from 'src/core/db/cspfmExecutionPouchDbProvider';
                      import { cspfmExecutionPouchDbConfiguration } from 'src/core/db/cspfmExecutionPouchDbConfiguration';
                      import { registerLocaleData } from "@angular/common";
                      import { cspfmObjectConfiguration } from 'src/core/pfmmapping/cspfmObjectConfiguration';
                      import { CspfmReportGenerationService } from 'src/core/services/cspfmReportGeneration.service';
                      import { lookupFieldMapping } from 'src/core/pfmmapping/lookupFieldMapping';
                      import { metaDbConfiguration } from "src/core/db/metaDbConfiguration";
                      import { cspfmMetaCouchDbProvider } from 'src/core/db/cspfmMetaCouchDbProvider';
                      import { cspfmBooleanEvaluation } from 'src/core/utils/cspfmBooleanEvaluation';
                      import { cspfmLiveListenerHandlerUtils } from 'src/core/dynapageutils/cspfmLiveListenerHandlerUtils';
                      import {  FetchMode, DependentObjectListType } from 'src/core/models/cspfmLiveListenerConfig.type';
                      declare var $: any;
                      declare const window: any;
                      import { cspfmDataTraversalUtils } from 'src/core/dynapageutils/cspfmDataTraversalUtils';
                      import { DataFieldTraversal } from 'src/core/models/cspfmDataFieldTraversal.type';
                      import { cspfmConditionalFormattingUtils } from 'src/core/dynapageutils/cspfmConditionalFormattingUtils';
                      import { ConditionalFormat } from 'src/core/models/cspfmConditionalFormat.type';
                      import { ObjectHierarchy } from 'src/core/models/cspfmObjectHierarchy.type';
                      import { cspfmBulkWorkFlowValidation } from 'src/core/services/cspfmBulkWorkFlowValidation.service';
                      import {  CspfmDataFormatter,cspfmDataGrouping, cspfmCustomEditor, CspfmActionsFormatter,cspfmAssociationDataFormatter, CspfmDataExportFormatter, cspfmUrlDataFormatter } from 'src/core/pipes/cspfm_data_display';
                      import { cspfmSlickgridUtils } from 'src/core/dynapageutils/cspfmSlickgridUtils';
                      import { cspfmCustomActionUtils } from 'src/core/dynapageutils/cspfmCustomActionUtils';
                      import { cspfmBalloonComponent } from 'src/core/components/cspfmBalloonComponent/cspfmBalloonComponent';
                      `
                      ViewControllerForWeb.viewBaseImportsForWeb(layout).then((imports) => {
                        baseImports += imports;
                        baseCtrlObj.baseCtrlMap.set("IMPORTS", baseImports);
                        resolve(baseImports);
                    }).catch((error) => {
                        logger.debug(`controllerSegments.js :: baseImports :: CATCH ${error}`);
                        reject(error);
                    });
                }
                baseCtrlObj.baseCtrlMap.set("IMPORTS", baseImports);
                if (isPreviewRequired) {
                    var importvar='';
                    for (let i = 0; i < layout.layoutSectionSet.length; i++) {
                        let layoutSectionSet = layout.layoutSectionSet[i];
                        for (let j = 0; j < layoutSectionSet.sectionElementSet.length; j++) {
                            let sectionElement = layoutSectionSet.sectionElementSet[j];
                            if (sectionElement.elementType === 'ACTION' && (sectionElement.actionType === 'ACTIONS_GROUP')) {
                                for(let a = 0;a < sectionElement.elementActions.length; a++){
                                    let elementActions=sectionElement.elementActions[a];
                                    if(elementActions.elementType=== "ACTION" && (elementActions.actionType === "EDIT" || sectionElement.actionType === 'VIEW')){
                                        let actionData = elementActions.actionData[0];
                                        let actionInfo = JSON.parse(actionData.actionInfo);
                                        let LayoutProperties = actionInfo.LayoutProperties;
                                        let redirectionTypeName = '';
                                        let enablePopupModel = false;
                                        for (let k = 0; k < LayoutProperties.length; k++) {
                                            if(LayoutProperties[k].propertyKey==="redirectionTo"){
                                                 redirectionTypeName = LayoutProperties[k].fieldDetails[0].redirectionTypeName;
                                            } else if (LayoutProperties[k].propertyKey === 'enablePopupModel') {
                                                 enablePopupModel = LayoutProperties[k].fieldDetails[0].value;
                                            }
                                        }
                                        if(enablePopupModel === true){
                                            if(!baseImports.includes(`import { ${redirectionTypeName} } from '../../pages/${redirectionTypeName}/${redirectionTypeName}';`)){
                                                baseImports += `import { ${redirectionTypeName} } from '../../pages/${redirectionTypeName}/${redirectionTypeName}';`
                                            }
                                        }
                                    } else if(elementActions.elementType=== 'ACTION' && elementActions.actionType === 'MORE'){
                                        for(let b = 0; b < elementActions.elementActions.length; b++){
                                            let moreElementActions = elementActions.elementActions[b];
                                            let actionData = moreElementActions.actionData[0];
                                            let actionInfo = JSON.parse(actionData.actionInfo);
                                            let LayoutProperties = actionInfo.LayoutProperties;
                                            let redirectionTypeName = '';
                                            let enablePopupModel = false;
                                        for (let k = 0; k < LayoutProperties.length; k++) {
                                            if(LayoutProperties[k].propertyKey==="redirectionTo"){
                                                 redirectionTypeName = LayoutProperties[k].fieldDetails[0].redirectionTypeName;
                                            } else if (LayoutProperties[k].propertyKey === 'enablePopupModel') {
                                                 enablePopupModel = LayoutProperties[k].fieldDetails[0].value;
                                            }
                                        }
                                        if(enablePopupModel === true){
                                            if(!baseImports.includes(`import { ${redirectionTypeName} } from '../../pages/${redirectionTypeName}/${redirectionTypeName}';`)){
                                                baseImports += `import { ${redirectionTypeName} } from '../../pages/${redirectionTypeName}/${redirectionTypeName}';`
                                            }
                                        }
                                        }
                                        
                                    }
                                }
                            }
                            else if (sectionElement.elementType === 'ACTION' && (sectionElement.actionType === 'EDIT' || sectionElement.actionType === 'VIEW' || sectionElement.actionType === "DATA_CLONE")) {
                                let LayoutProperties = JSON.parse(sectionElement.actionData[0].actionInfo).LayoutProperties;
                                let redirectionTo = '';
                                let enablePopupModel = false;
                                for (let k = 0; k < LayoutProperties.length; k++) {
                                    if (LayoutProperties[k].propertyKey === 'redirectionTo') {
                                        redirectionTo = LayoutProperties[k].fieldDetails[0].redirectionTypeName;
                                    } else if (LayoutProperties[k].propertyKey === 'enablePopupModel') {
                                        enablePopupModel = LayoutProperties[k].fieldDetails[0].value;
                                    }
                                }
                                if (enablePopupModel === true && sectionElement.actionType !== "DATA_CLONE") {
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
                        }
                    }
                    let listPreviewVals = baseCtrlObj.baseCtrlMap.get("WEB_HL_LIST_PREVIEW");
                    listPreviewVals.imports = baseImports+importvar;
                    baseCtrlObj.baseCtrlMap.set("WEB_HL_LIST_PREVIEW", listPreviewVals);
                }
                resolve();
            } catch (error) {
                logger.error(`controllerSegmentsForWeb.js :: baseImports :: CATCH...... ${error}`);
                reject(error);
            }
        })
    },

    component: (baseCtrlObj, layout, appObject, layoutGrpObj, searchFlag, dbVar, hierarchy, isPreviewRequired) => {
        return new Promise((resolve, reject) => {
            try {
                var baseComponent = `@Component({
                    selector: '${layout.layoutName}',
                    templateUrl: '${layout.layoutName}.html'
                })`;
                baseCtrlObj.baseCtrlMap.set("COMPONENT", baseComponent);
                if (isPreviewRequired) {
                    var baseComponentPreview = `@Component({
                        selector: '${layout.layoutName}preview',
                        templateUrl: '${layout.layoutName}preview.html'
                    })`;
                    let listPreviewVals = baseCtrlObj.baseCtrlMap.get("WEB_HL_LIST_PREVIEW");
                    listPreviewVals.baseComponent = baseComponentPreview;
                    baseCtrlObj.baseCtrlMap.set("WEB_HL_LIST_PREVIEW", listPreviewVals);
                }
                resolve(baseComponent);   
            } catch (error) {
                logger.error(`controllerSegmentsForWeb.js :: component :: CATCH...... ${error}`);
                reject(error);
            }
        })
    },

    defaultMethods: (baseCtrlObj, layout, appObject, layoutGrpObj, searchFlag, dbVar, hierarchy, isPreviewRequired) => {
        return new Promise(async (resolve, reject) => {
            try {
                var commonMethods;
                let userAssignFunc = '';
                let balloonUIFunc = ``;
                for (let i = 0; i < layout.layoutSectionSet.length; i++) {
                    let layoutSection = layout.layoutSectionSet[i];
                    if (layoutSection.sectionFor === 'LIST') {
                        for (let j = 0; j < layoutSection.sectionElementSet.length; j++) {
                            let sectionElement = layoutSection.sectionElementSet[j];
                            if (sectionElement.isHeaderAction !== 'Y') {
                                let userAssignActionGrp = '';
                                if (sectionElement.elementType === 'ACTION' && sectionElement.actionType === 'ACTIONS_GROUP' && sectionElement.hasOwnProperty('elementActions')) {
                                    userAssignActionGrp = sectionElement.elementActions.filter(elementAction =>  elementAction.elementType === 'ACTION' && elementAction.actionType === 'USERASSIGNMENT' );
                                }
                                if (sectionElement.elementType === 'ACTION' && sectionElement.actionType === 'USERASSIGNMENT' || userAssignActionGrp.length > 0) {
                                    userAssignFunc =  `userAssignment(this.layoutId,this.userAssignService,this.metaDbProvider,this.metaDbConfig);`
                                }
                            }
                        }
                    }
                    if(layoutSection.sectionFor === 'GRID'){
                        for (let j = 0; j < layoutSection.sectionElementSet.length; j++) {
                            let sectionElement = layoutSection.sectionElementSet[j];
                            if(sectionElement.layoutActionInfoSet.length > 0 && sectionElement.layoutActionInfoSet[0].actionType === 'BALLOON_TOOLTIP' && sectionElement.layoutActionInfoSet[0].isBalloonToolTipEnable === "Y"){
                                balloonUIFunc = `this.events.subscribe('balloonCloseAfterActionClick', () => {
                                    this.closePopover();
                                });`
                            }
                        }
                    }
                }
                if (layout.layoutMode === 'LIST' && layout.layoutType === 'Grid_with_List') {
                    commonMethods = await webSearchListController.defaultMethods(baseCtrlObj, layout, appObject, layoutGrpObj, searchFlag, dbVar, hierarchy,userAssignFunc);
                }else if (layout.layoutMode === 'LIST' && layout.layoutType === 'List' && layout.pageType && layout.pageType.toUpperCase() ==='ASSIGNMENT') {
                    commonMethods = await recordAssignmentCtrlWeb.assignmentDefaultMethods(baseCtrlObj, layout);
                }else if (layout.layoutMode === 'LIST' && layout.layoutType === 'List') {
                    commonMethods = await webListController.webListDefaultMethods(baseCtrlObj, layout, appObject, layoutGrpObj, searchFlag, dbVar, hierarchy,userAssignFunc);
                } else if (layout.layoutMode === 'VIEW' && layout.layoutType === 'Grid_with_List') {
                    commonMethods = await gridListViewController.defaultMethods(baseCtrlObj, layout, appObject, layoutGrpObj, searchFlag, dbVar, hierarchy,userAssignFunc, balloonUIFunc);
                } else if (layout.layoutMode === 'EDIT' && layout.layoutType === 'Grid') {
                    webEditController.editDefaultMethodsForWeb(layout,layoutGrpObj,dbVar,hierarchy).then((retbaseMethods) => {
                        baseCtrlObj.baseCtrlMap.set("DEFAULT_METHODS", retbaseMethods);
                    }).catch((error) => {
                        logger.error(`controllerSegments.js :: gridListDefaultMethods :: CATCH ${error}`);
                        reject(error);
                    });
                    if(layout.isDrawerEnable === 'Y'){
                        commonMethods = await editDrawerControllerForWeb.defaultMethods(layout,layoutGrpObj,dbVar,hierarchy);
                    }
                } else if (layout.layoutMode === 'VIEW' && layout.layoutType === 'Grid' && layout.isDrawerEnable === 'Y') {
                    commonMethods = await gridGridViewControllerWeb.defaultMethods(baseCtrlObj, layout, appObject, layoutGrpObj, searchFlag, dbVar, hierarchy, balloonUIFunc);
                } else if (layout.layoutMode === 'VIEW' && layout.layoutType === 'Grid') {
                    commonMethods = await ViewControllerForWeb.defaultMethods(baseCtrlObj, layout, appObject, layoutGrpObj, searchFlag, dbVar, hierarchy, balloonUIFunc);
                }
                baseCtrlObj.baseCtrlMap.set("DEFAULT_METHODS", commonMethods);
                if (isPreviewRequired) {
                    var commonMethodsForPreview = await gridListViewController.defaultMethodsForPreview(baseCtrlObj, layout, appObject, layoutGrpObj, searchFlag, dbVar, hierarchy,userAssignFunc, balloonUIFunc);
                    let listPreviewVals = baseCtrlObj.baseCtrlMap.get("WEB_HL_LIST_PREVIEW");
                    listPreviewVals.defaultMethods = commonMethodsForPreview;
                    baseCtrlObj.baseCtrlMap.set("WEB_HL_LIST_PREVIEW", listPreviewVals);
                }
                resolve();
            } catch (err) {
                logger.error(`controllerSegmentsForWeb.js :: Commmon Methods :: CATCH...... ${err}`);
                reject(err);
            }
        })
    },

    constructor: (baseCtrlObj, layout, appObject, layoutGrpObj, searchFlag, dbVar, hierarchy, isPreviewRequired) => {
        return new Promise(async (resolve, reject) => {
            try {
                var constructorValue;
                let urlSlickFormation=``;
                var constructorData=await importDeails.importModulesFun(layout,'layoutImport');
                for (let i = 0; i < layout.layoutSectionSet.length; i++) {
                    let layoutSectionSet = layout.layoutSectionSet[i];
                    for (let j = 0; j < layoutSectionSet.sectionElementSet.length; j++) {
                        let sectionElement = layoutSectionSet.sectionElementSet[j];
                        if(sectionElement.fieldType=== "URL" && sectionElement.isInlineEditRequired==='Y' && dbVar.type !== 'webservice' ){
                            urlSlickFormation=`
                            this.slickgridPopoverService._getChangedValue.subscribe(value => {
                                if (value['from'] === 'slickgrid') {
                                    const columnDefinition = value['args'].grid.getColumns()
                                    const fieldInfoObj = columnDefinition[value['args'].cell].params.fieldInfo
                                    let item = value['args'].grid.getData().getItem(value['args']['row']);
                                    const recordId = item.type + '_2_' + item.id
                                    let urlDBValue = value['dbData'];
                                    let data = item[value['fieldName']] || '';
                                    data = this.appUtilityConfig.isValidJson(data);
                                    let text, url, urlArray = [];
                                    text = data;
                                    url = data;
                                    if (value['inputType'] === 'delete') {
                                        this.slickgridUtils.deleteFieldValue(value['args'], value['fieldName'], value['isMultipleUrlField'], value['dbData'], true, this.angularGrid);
                                        return;
                                    } else {
                                        if (typeof data === 'string' && data != '') {
                                            urlArray.push({
                                                urlType: value['isMultipleUrlField'] ? 'multiple' : 'single',
                                                urlDBValue: {
                                                    displayValue: text,
                                                    urlValue: url
                                                }
                                            })
                                        } else {
                                            urlArray = data['urlDBValue'] || [];
                                        }
                                        if (value['inputType'] === 'edit' || value['inputType'] === 'view') {
                                          urlDBValue = urlArray;
                                          if (value['isMultipleUrlField']) {
                                            urlDBValue[value['selectedRecordIndex']] = value['dbData'][0];
                                        } else {
                                            urlDBValue = value["dbData"]
                                        } 
                                    } else if (value['inputType'] === 'add-entry') {
                                          urlDBValue = urlArray;
                                          if(value['isMultipleUrlField']){
                                            urlDBValue.push(...value["dbData"]);
                                        }else{
                                            urlDBValue=value["dbData"]
                                        }
                                        }
                                        let dbData: any = {
                                            urlType: value['isMultipleUrlField'] ? 'multiple' : 'single',
                                            urlDBValue: urlDBValue
                                        }
                                        dbData = JSON.stringify(dbData);
                                        this.slickgridUtils.fetchEditedRecord(appConstant.couchDBStaticName, this.angularGrid, recordId, fieldInfoObj, dbData, item);
                                    }
                                }
                            });
                            `
                        }
                    }
                }
                if (layout.layoutMode === 'LIST' && layout.layoutType === 'Grid_with_List') {
                    constructorValue = await webSearchListController.listConstructor(baseCtrlObj, layout, appObject, layoutGrpObj, searchFlag, dbVar, hierarchy,urlSlickFormation,constructorData)
                } else if (layout.layoutMode === 'LIST' && layout.layoutType === 'List' && layout.pageType && layout.pageType.toUpperCase() ==='ASSIGNMENT') {
                    constructorValue = await recordAssignmentCtrlWeb.assignmentBasicConstructor(baseCtrlObj, layout, appObject, layoutGrpObj, searchFlag, dbVar, hierarchy,urlSlickFormation)
                } else if (layout.layoutMode === 'LIST' && layout.layoutType === 'List') {
                    constructorValue = await webListController.webListConstructor(baseCtrlObj, layout, appObject, layoutGrpObj, searchFlag, dbVar, hierarchy,urlSlickFormation,constructorData)
                } else if (layout.layoutMode === 'VIEW' && layout.layoutType === 'Grid_with_List') {
                    constructorValue = await gridListViewController.gridListConstructor(baseCtrlObj, layout, appObject, layoutGrpObj, searchFlag, dbVar, hierarchy,urlSlickFormation,constructorData)
                } else if (layout.layoutMode === 'EDIT' && layout.layoutType === 'Grid') {
                    constructorValue = '';
                } else if (layout.layoutMode === 'VIEW' && layout.layoutType === 'Grid' && layout.isDrawerEnable === 'Y') {
                    constructorValue = await gridGridViewControllerWeb.gridGridViewConstructor(baseCtrlObj, layout, appObject, layoutGrpObj, searchFlag, dbVar, hierarchy,constructorData);
                } else if (layout.layoutMode === 'VIEW' && layout.layoutType === 'Grid') {
                    constructorValue = await ViewControllerForWeb.gridViewConstructor(baseCtrlObj, layout, appObject, layoutGrpObj, searchFlag, dbVar, hierarchy,constructorData)
                }
                baseCtrlObj.baseCtrlMap.set("CONSTRUCTOR", constructorValue);
                resolve();
            } catch (err) {
                logger.error(`controllerSegmentsForWeb.js :: constructor :: CATCH...... ${err}`);
                reject(err);
            }
        })
    },

    dynaObjects: (layoutgrp, layout, baseCtrlObj, layoutSection, appObject, hierarchy, dbVar, searchFlag, isPreviewRequired) => {
        return new Promise(async (resolve, reject) => {
            try {
                let parentObjId = layoutgrp.primaryObjectId;
                let fetchInfoAction = {};
                if (dbVar.value === 'JsonDB' && dbVar.processInfo) {
                    fetchInfoAction = {
                        "processId": dbVar.processInfo[0].processId,
                        "processType": dbVar.processInfo[0].processType,
                        "actionType": dbVar.processInfo[0].actionType,
                        "paramValue": "LAYOUT"
                    };
                }else{
                    fetchInfoAction = {
                        "processId": "",
                        "processType": "",
                        "actionType": "",
                        "paramValue": ""
                    };
                }
                let refObjVar = '';
                let dynaObjectslookup = '';
                let methods = ``;
                let variables = ``;
                let comboVar = ``;
                let  isMailActionAvailable =false;
                let isWorkflowActionAvailable = false;
                let multiSelectAndCheckBoxValueMaking=``;
                let viewIcon = false;
                let gridTableSkeleton = {
                    "child": "",
                    "dateFormat": "",
                    "mappingDetails": "",
                    "currencyDetails": ""
                };
                let queryFields = '';
                const dependentObjectList = JSON.parse(layout.dependentObjectList)[0];
                const sectionDependentObjectList = dependentObjectList['sectionDependentObjectList'];
                delete dependentObjectList['sectionDependentObjectList'];
                let promient={};
                let moreActionGroupJson = '';
                let moreActionJson = '';
                let moreActionJsonFormation = '';
                let moreActionSelected = '';
                let isUserAssignAction = '';
                let userAssignmentOnClick ='';
                let dataCloneAssignmentOnClick = ``;
                let openComponentForDataClone = ``;
                let balloonConfiguredFieldList = '';
                let showBalloonLayoutOnMouseOverAndOnClick = ``;
                let userAssignmentViewMethods ='';
                let matrixEnabled = false;
                let slickgridSelectOptionEnabled=false;
                let isEmailActionEnabled=false;
                let matrixHierarchyJson = null;
                let upsertFlag = false;
                let matrixArray =[];
                let columnArray ={};
                let rowArray =[];
                let matrixElementId ='';
                let gridTableFieldInfoArray = {};
                let lookupReadonlyFieldInfo = {};
                let listTableFieldInfoArray = [];
                let columnDefinitions = ``;
                let dataUpsertVariable=``;
                let objDisplayName=``;
                let sourceName = {};
                let elementId = {};
                let conditionFormatting =``;
                let childFetchInfoForWebService = {};
                let countList = 0;
                let statusWorkFlowCommonMethods = ``;
                let statusWorkFlowVariables = ``;
                let statusWorkFlowFields =``;
                let formulaFields = ``;
                let formulaVariable =``;
                let navigationParamsForDetailViewPage = [];
                let fieldApproverType ={};
                let fieldApproverTypeVal='';
                let workFlowMappingVal=''
                let workFlowMapping = {};
                let fetchStatusWfl = ``;
                let actionCompJson =``;
                let actionJson =``;
                let childJson =``;
                let childSecHeader =``;
                let fetchStatusWflForPreview = ``;
                let webHlListPreview = baseCtrlObj.baseCtrlMap.get("WEB_HL_LIST_PREVIEW");
                let sectionalFetchJson = baseCtrlObj.baseCtrlMap.get("WEB_SERVICE_WEB");
                let webHlListObj = baseCtrlObj.baseCtrlMap.get('WEB_HL_LIST_OBJ');
                let currencyImport = baseCtrlObj.baseCtrlMap.get('CURRENCY_IMPORT');
                let prominetDataMapping = webHlListObj.prominetDataMapping
                let detailViewNav = ``;
                let addButtonNav = ``;
                let listButtonNav = ``;
                let objectMapping ={};
                let addButtonNavPreview = ``;
                let addOneToOneCondition = ``;
                let gridOption = ``;
                let fetchActionUpsertInfo='';
                let requiredColumnForUpsert='';
                let dataFetchMode='';
                let skeletonLoading=``;
                let isHiddenEnabledValue = [];
                let sectionUserDataRestrictionSet=[];
                let paginationConfigInfo={};
                let mailActionInfo=``;
                let tableName_pfm=``;
                let lookupField = '';
                let lookupObjName = '';
                let lookupobjArray = [];
                var secondaryParent;
                var tempFieldName;
                var gridColumnDefinitions=``;
                var gridTableDetails=``;
                let workFlowActionConfig =``;
                let workflowActionInfoSet = ``; 
                let wfApprovalActionList =``;
                let wfApprovalActionView=``;
                let workFlowInfoList=``;
                let dataCloneClickAction = ``;
                let dataClonePopup = ``;
                let dataClonePopupList = ``;
                let balloonUiInputMethod = ``;
                let ImportDatas=await importDeails.importModulesFun(layout,'layoutImport');                
                for (var linkSet of layout.layoutLinkSet) {
                    if (linkSet.objectId !== parentObjId) {
                        if (linkSet.objectType === 'LOOKUP') {
                            for (let a = 0; a < appObject.offlineObjectDetails.length; a++) {
                                if(appObject.offlineObjectDetails[a].objectId === linkSet.referenceObjectId) {
                                    let objectFields = appObject.offlineObjectDetails[a].fields;
                                    lookupObjName = appObject.offlineObjectDetails[a].objectName;
                                    for(let h = 0;h<objectFields.length; h++){
                                        if(linkSet.fieldId === objectFields[h].fieldId){
                                            lookupField = objectFields[h].fieldName;
                                        }
                                    }
                                }
                            }
                            if(layout.layoutType.toUpperCase() === 'LIST' && layout.layoutMode.toUpperCase() === 'LIST'){
                                lookupobjArray =`public __${lookupField}$lookupIn${lookupObjName} = this.lookupFieldMappingObject.mappingDetail[this.__${lookupObjName}$tableName]['${lookupField}'];`;
                            
                            }else{
                             lookupobjArray =`public __${lookupField}$lookupIn${lookupObjName} = this.lookupFieldMapping.mappingDetail[this.__${lookupObjName}$tableName]['${lookupField}'];`;
                            }                            
                            if(!dynaObjectslookup.includes(lookupobjArray)){
                                dynaObjectslookup+=lookupobjArray;
                            }
                        }
                    }
                }
                for (let i = 0; i < layout.layoutSectionSet.length; i++) {
                    let layoutSectionSet = layout.layoutSectionSet[i];
                    
                    for (let j = 0; j < layoutSectionSet.sectionElementSet.length; j++) {
                        let sectionElement = layoutSectionSet.sectionElementSet[j];
                        let enablePopupModelDataClone = false, enablePopupModelElement = false;
                        if(layout.layoutMode==='LIST' && layoutSectionSet.sectionFor==='Header'){
                            if(sectionElement.elementType === 'ACTION' && sectionElement.actionType === 'MAIL'){
                                isMailActionAvailable=true;
                            }
                        }
                        if(layout.layoutMode==='VIEW'&& layout.layoutType === 'Grid_with_List'){
                            if(sectionElement.elementType === 'ACTION' && sectionElement.actionType === 'MAIL' && sectionElement.isHeaderAction==='Y'){
                                isMailActionAvailable=true;
                            }
                        }
                        if (layoutSectionSet.sectionFor === 'LIST') {
                            paginationConfigInfo = layoutSectionSet.paginationConfigInfo;
                        }
                        if (sectionElement.elementType === 'ACTION' && sectionElement.actionType === 'MAIL') {
                            let getActionInfo;
                            if (sectionElement.actionData[0].actionInfo.length > 0) {
                                getActionInfo = JSON.stringify(JSON.parse(sectionElement.actionData[0].actionInfo));
                            }
                            mailActionInfo += `public ${sectionElement.elementName}_${sectionElement.elementId}_Mail= ${getActionInfo};`

                        }
                        if (sectionElement.hasOwnProperty("elementActions")) {
                            for (let k = 0; k < sectionElement.elementActions.length; k++) {
                                let eleAction = sectionElement.elementActions[k];
                                if (eleAction.actionType === 'MAIL') {
                                    let eleActionInfor;
                                    if (eleAction.actionData[0].actionInfo.length > 0) {
                                        eleActionInfor = JSON.stringify(JSON.parse(eleAction.actionData[0].actionInfo));
                                    }
                                    mailActionInfo += `public ${eleAction.elementName}_${eleAction.elementId}_Mail= ${eleActionInfor};`;
                                }
                            }

                        }
                        let workflowActionsgroup = false,  dataCloneActionElement = false;
                        if(sectionElement.elementType === 'ACTION' && sectionElement.actionType === 'ACTIONS_GROUP'){
                            workflowActionsgroup = sectionElement.elementActions.filter(elementAction => elementAction.actionType === 'WORKFLOW').length > 0 ? true : false;
                        }
                        if((sectionElement.elementType === 'ACTION' && sectionElement.actionType === 'WORKFLOW') || workflowActionsgroup){
                            if(layout.layoutMode === 'LIST' && layoutSectionSet.sectionFor ==='Header'){
                                isWorkflowActionAvailable = true;
                            }
                            if(layout.layoutMode ==='VIEW' && layout.layoutType === 'Grid_with_List' && sectionElement.isHeaderAction === 'Y'){
                                isWorkflowActionAvailable = true;
                            }
                        }
                        if((sectionElement.elementType === 'ACTION' && sectionElement.actionType === 'WORKFLOW') || workflowActionsgroup){
                               let workflowAction = sectionElement.workflowActionInfoSet;
                                for(let w = 0; w < workflowAction.length; w++){
                                    workflowActionInfoSet += 
                                  `"${workflowAction[w].workflowActionInfoId}": {
                                      "actionDisplayType": "${workflowAction[w].actionDisplayType}",
                                      "sourceStatus": ${JSON.stringify(workflowAction[w].sourceStatus)},
                                      "destinationStatus": ${JSON.stringify(workflowAction[w].destinationStatus)},
                                      "objectId": "pfm${workflowAction[w].fieldObjectId}",
                                      "fieldName": "${workflowAction[w].fieldName}",
                                      "fieldDisplayName": "${workflowAction[w].fieldDisplayName}",
                                      "traversalPath": "${workflowAction[w].traversalPath}",
                                      "traversalConfigJson": ${JSON.stringify(workflowAction[w].traversalConfigJson)}
                                    },`
                                }
                                
                            wfApprovalActionList = `public dropDownAttribute = "#cs-dropdown-" + this.layoutId;
                                approvalAction_OnClick(actionId,dataObejct) {
                                    let htmlElement: HTMLElement = document.getElementById('cs-dropdown-' + this.layoutId);
                                    if (htmlElement && htmlElement.innerHTML && htmlElement.innerHTML != null) {
                                        htmlElement.innerHTML = "";
                                    }
                                    if (this.selectedRows.length === 0) {
                                        this.appUtilityConfig.showAlert(this,"Kindly select record")
                                        return
                                    }
                                    const workFlowConfig = this.workFlowActionConfig[actionId]
                                    const bulkWorkFlowConfig = {
                                        "workFlowConfig": workFlowConfig,
                                        "selectedRecords": dataObejct,
                                        "parent": this,
                                        "layoutId":this.layoutId
                                    }
                                    this.cspfmBulkWorkFlowValidationObject.validateWorkFlowStatus(bulkWorkFlowConfig,'VIEW')
                                }
                                
                                bulkApprovalResponse(response) {
                                    let htmlElement: HTMLElement = document.getElementById('cs-dropdown-' + this.layoutId);
                                    if (htmlElement && htmlElement.innerHTML && htmlElement.innerHTML != null) {
                                        htmlElement.innerHTML = "";
                                    }
                                    
                                    
                                    if(response['status']==='Success'){
                                        this.appUtilityConfig.presentToast(response["message"])
                                        this.selectedRows = [];
                                        this.angularGrid.gridService.setSelectedRows([]);
                                    }
                                    else{
                                        this.appUtilityConfig.showAlert(this,response["message"])
                                    }
                                    
                                    if(response['status']==='Success' && response['childObject'])
                                    {
                                        response['childObject']['selectedRows'] = []
                                        if( response['childObject']['angularGridInstance'] && response['childObject']['angularGridInstance']['gridService'])
                                        {
                                            response['childObject']['angularGridInstance']['gridService'].setSelectedRows([]);
                                        }
                                    }
                                }`;       

                            wfApprovalActionView = `public selectedRows = [];
                                public dropDownAttribute = "#cs-dropdown-" + this.layoutId;
                                approvalAction_OnClick(actionId,dataObject) {
                                    let htmlElement: HTMLElement = document.getElementById('cs-dropdown-' + this.layoutId);
                                    if (htmlElement && htmlElement.innerHTML && htmlElement.innerHTML != null) {
                                        htmlElement.innerHTML = "";
                                         }
                                        this.selectedRows = []
                                        this.selectedRows.push(dataObject)
                                        const workFlowConfig = this.workFlowActionConfig[actionId]
                                        const bulkWorkFlowConfig = {
                                            "workFlowConfig": workFlowConfig,
                                            "selectedRecords": this.selectedRows,
                                            "parent": this,
                                            "layoutId":this.layoutId
                                        }
                                        this.cspfmBulkWorkFlowValidationObject.validateWorkFlowStatus(bulkWorkFlowConfig,"VIEW")
                                    }
            
                                    bulkApprovalResponse(response) {
                                      let htmlElement: HTMLElement = document.getElementById('cs-dropdown-' + this.layoutId);
                                      if (htmlElement && htmlElement.innerHTML && htmlElement.innerHTML != null) {
                                          htmlElement.innerHTML = "";
                                      }
                                    
                                      if(response['status']==='Success'){
                                          this.appUtilityConfig.presentToast(response["message"])
                                          this.selectedRows = []
                                      }
                                      else{
                                        this.appUtilityConfig.showAlert(this,response["message"])
                                      }
                                    
                                      if(response['status']==='Success' && response['childObject'])
                                      {
                                          response['childObject']['selectedRows'] = []
                                          if( response['childObject']['angularGridInstance'] && response['childObject']['angularGridInstance']['gridService'])
                                          {
                                              response['childObject']['angularGridInstance']['gridService'].setSelectedRows([]);
                                          }
                                      }
                                }`;
                        }
                        if(sectionElement.elementType === 'ACTION' && sectionElement.actionType === 'DATA_CLONE'){
                            let LayoutProperties = JSON.parse(sectionElement.actionData[0].actionInfo).LayoutProperties;
                            for (let k = 0; k < LayoutProperties.length; k++) {
                                if (LayoutProperties[k].propertyKey === 'enablePopupModel') {
                                    enablePopupModelDataClone = LayoutProperties[k].fieldDetails[0].value;
                                }
                                if(enablePopupModelDataClone === true &&  layoutSectionSet.sectionFor !== 'LIST') { 
                                    let popupCheck = `if (actionInfo['navigationInfo']['navigationUrl'] === "${sectionElement.targetLayoutName}") {this.dialog.open(${sectionElement.targetLayoutName}, dialogConfig);}`;
                                    if(!dataClonePopup.includes(popupCheck)) {
                                        dataClonePopup += popupCheck;
                                    }
                                }
                                if(enablePopupModelDataClone === true &&  layoutSectionSet.sectionFor === 'LIST') { 
                                    let popupCheck = `if (navigationUrl === "${sectionElement.targetLayoutName}") {this.dialog.open(${sectionElement.targetLayoutName}, dialogConfig);}`;
                                    if(!dataClonePopupList.includes(popupCheck)) {
                                        dataClonePopupList += popupCheck;
                                    }
                                }
                            }
                        }
                        if (sectionElement.hasOwnProperty('elementActions')) {
                            dataCloneActionElement = sectionElement.elementActions.filter(elementAction =>  elementAction.elementType === 'ACTION' && elementAction.actionType === 'DATA_CLONE').length > 0 ? true : false;
                            for(let a = 0;a < sectionElement.elementActions.length; a++){
                                let elementActions=sectionElement.elementActions[a];
                                if(elementActions.elementType === 'ACTION' && elementActions.actionType === 'DATA_CLONE'){
                                let LayoutPropertiesElement = JSON.parse(elementActions.actionData[0].actionInfo).LayoutProperties;
                                for (let k = 0; k < LayoutPropertiesElement.length; k++) {
                                    if (LayoutPropertiesElement[k].propertyKey === 'enablePopupModel') {
                                        enablePopupModelElement = LayoutPropertiesElement[k].fieldDetails[0].value;
                                    }
                                }
                                if(enablePopupModelElement && layoutSectionSet.sectionFor !== 'LIST'){
                                   let elementPopupCheck  = `if (actionInfo['navigationInfo']['navigationUrl'] === "${elementActions.targetLayoutName}") {this.dialog.open(${elementActions.targetLayoutName}, dialogConfig);}`;
                                   if(!dataClonePopup.includes(elementPopupCheck)){
                                       dataClonePopup += elementPopupCheck;
                                   }
                                }
                                if(enablePopupModelElement === true &&  layoutSectionSet.sectionFor === 'LIST') { 
                                    let popupCheck = `if (navigationUrl === "${elementActions.targetLayoutName}") {this.dialog.open(${elementActions.targetLayoutName}, dialogConfig);}`;
                                    if(!dataClonePopupList.includes(popupCheck)) {
                                        dataClonePopupList += popupCheck;
                                    }
                                }
                            }
                        }
                    }

                    if((sectionElement.elementType === 'ACTION' && sectionElement.actionType === 'DATA_CLONE') ||  dataCloneActionElement) {      
                       let parentObjDataClone = ``;
                        if(layout.layoutMode === 'VIEW' && layout.isDrawerEnable === 'Y' && layout.layoutType === 'Grid'){
                            let parentObjectRootPath = layout.layoutLinkSet.find(link => link.objectType.toUpperCase() === 'HEADER');
                            parentObjDataClone =  `parentId: this.dataObject['${parentObjectRootPath.rootPath}']["id"],
                            parentObj: JSON.stringify(this.dataObject['${parentObjectRootPath.rootPath}'])`
                       }
                       
                        dataCloneClickAction = `
                            cloneButtonOnclick(actionId, navigationUrl, redirectUrl, isPopEnabled) {
                                if (this.isPopUpEnabled) {
                                this.dialogRef.close();
                                }
                                let actionInfo = {
                                actionElementId: actionId,
                                navigationInfo: {
                                    navigationUrl: navigationUrl,
                                    redirectUrl: redirectUrl,
                                    enablePopUp: isPopEnabled,
                                }
                                }

                                actionInfo['dataCloningInfo'] = this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]["dataCloningInfo"][actionInfo["actionElementId"]]
                                actionInfo['dataCloningInfo'] = this.appUtilityConfig.getUpdatedClonedFieldValues(this.dataObject, actionInfo['dataCloningInfo'])
                            
                                const navigationParameters = {
                                dataCloningInfo: JSON.stringify(actionInfo['dataCloningInfo']),
                                ${parentObjDataClone}
                                }
                                if (!actionInfo['navigationInfo']['enablePopUp'] && !this.appUtilityConfig.checkPageAlreadyInStack('/menu/' + actionInfo['navigationInfo']['navigationUrl'])) {
                                navigationParameters['redirectUrl'] = '/menu/' + actionInfo['navigationInfo']['redirectUrl']
                                } else if (actionInfo['navigationInfo']['enablePopUp']) {
                                navigationParameters["redirectUrl"] = '/menu/' + actionInfo['navigationInfo']['redirectUrl']
                                }
                                if (actionInfo['navigationInfo']['enablePopUp']) {
                                const dialogConfig = new MatDialogConfig();
                                dialogConfig.data = {
                                    params: navigationParameters
                                };
                                dialogConfig.panelClass = 'cs-dialoguecontainer-large'
                                 ${dataClonePopup}
                                } else {
                                this.appUtilityConfig.navigationByRouter('/menu/' + actionInfo['navigationInfo']['navigationUrl'], navigationParameters)
                                }
                            }
                        `;
                        if(layoutSection.sectionFor === 'LIST'){
                            dataCloneAssignmentOnClick = ` if (actionInfo['actionType'] === "DATA_CLONE") {
                                actionInfo['dataCloningInfo'] = this.cspfmLayoutConfig['layoutConfiguration'][this.layoutId]["dataCloningInfo"][actionInfo["actionElementId"]]
                                this.cspfmDataTraversalUtilsObject.setDestinationFieldValue(actionInfo,data,this.layoutId,this);
                            }`
        
                                if(enablePopupModelDataClone === true || enablePopupModelElement === true){
                                    openComponentForDataClone = `dialogOpenComponentForDataClone(navigationUrl,dialogConfig) {
                                   ${dataClonePopupList}
                                    }`
                                }
                            
                        }
                    }
                
                        if(sectionElement.uiType === 'DROPDOWN' && sectionElement.isStatusWorkflowEnabled === 'Y'){
                            workFlowInfoList=`else if (actionView && actionView === 'button'){
                                let htmlElement: HTMLElement = document.getElementById('cs-dropdown-' + this.layoutId);
                                if (htmlElement && htmlElement.innerHTML) {
                                    htmlElement.innerHTML = "";
                                }

                    
                                let gridOptions = args['grid'].getOptions();
                                let actionType = mouseEvent['target']['attributes']['action-view']['value']
                    
                                let columnDef = args['columnDef'];
                                columnDef['params']['actionType'] = actionType
                                let fieldInfo = this.slickgridPopoverService.getFieldInfo(columnDef["params"]["fieldInfo"])
                                let objectConfig = fieldInfo['statusWorkflow']['objectConfig']
                                let objectId = fieldInfo['statusWorkflow']['objectId']
                                let fieldName = fieldInfo['statusWorkflow']['fieldName']
                                let inlineEditAvaiable = columnDef['params']['inlineEditEnabled']
                                let fieldId = objectConfig[objectId]['workflow'][fieldName]['fieldId'];
                                if ((actionType === 'workflowStatus' && !inlineEditAvaiable) ||
                                    (actionType === 'workflowStatus' && gridOptions && gridOptions['editable'] && gridOptions['editable'] === false)) {
                                    return
                                }
                                if (args['dataContext']['systemAttributes'] && args['dataContext']['systemAttributes']['fieldId'] !== fieldId) {
                                    const currentElement: any = mouseEvent && mouseEvent.target || undefined;
                                    const currentActionView = currentElement && currentElement.getAttribute('action-view') || undefined;
                                    if (currentActionView !== 'workflowHistory') {
                                        return
                                    }
                                }
                                var WfStatusMappingList = objectConfig[objectId]['workflow'][fieldName]['configJson']
                                var dataOb = args['dataContext']
                                if (dataOb[fieldName] && WfStatusMappingList && WfStatusMappingList[dataOb[fieldName]]
                                    && WfStatusMappingList[dataOb[fieldName]].length > 0 && actionType && actionType === 'workflowStatus') {
                    
                    
                                    if (WfStatusMappingList[dataOb[fieldName]] && WfStatusMappingList[dataOb[fieldName]].length == 1) {
                                        this.listServiceUtils.presentToast("Workflow process completed")
                                        return
                                    }
                                }
                                if (actionType === 'workflowHistory') {
                                    this.cspfmOnDemandFeature.appendComponentToElement('cs-dropdown-' + this.layoutId, cs_status_workflow_history, args);
                                } else if (actionType === 'workflowStatus') {
                                    this.cspfmOnDemandFeature.appendComponentToElement('cs-dropdown-' + this.layoutId, cs_status_workflow_popover, args);
                                }
                            }`
                        }
                    }
                }
                let traversalPath = '';
                let traversalDataPaths = '';
                let tempVar = ``
                let requiredTempFlag = false;
        
                let objectKeys = Object.keys(layout.objectTraversal)
                for(let n=0;n<objectKeys.length;n++){
                    tempVar=`{traversalPath: '${objectKeys[n]}',requiredTemp: ${requiredTempFlag}},`
                        if(!traversalDataPaths.includes(tempVar)){
                            traversalDataPaths += tempVar
                        }
                        
                        requiredTempFlag = false;
                    traversalPath = `private dataPaths: Array<{ traversalPath: string; requiredTemp: boolean }> = [${traversalDataPaths}]`
                    
                }

                var sectionObjId = layoutSection.objectId ? layoutSection.objectId : hierarchy.primary.objectId;
                if ((layout.layoutMode === 'LIST' && layout.layoutType === 'List') || (layout.layoutMode === 'LIST' && layout.layoutType === 'Grid_with_List' && searchFlag)) {
                    sectionObjId = hierarchy.primary.objectId;
                }
                let offlineObjectDetails = appObject['offlineObjectDetails'];
                let reportGenerationCode = `
                handleLiveListenerForReportObjects(modified) {
                    const reportResult = modified['doc']['data']
                    var reportInput = this.reportInput[reportResult['elementId']] ? this.reportInput[reportResult['elementId']] : this.printInput[reportResult['elementId']]
                    if (reportInput && reportInput['isLoading']) {
                      switch (reportResult['reportStatus']) {
                        case 'COMPLETED':
                          reportInput['isLoading'] = false
                          if (reportInput['onDemandReportGneration'] === 'Y') {
                            this.openReportViewer(reportInput['action'], reportResult)
                          } else {
                            this.openReportDialog(reportResult['reportStatus'], reportInput, reportResult)
                          }
                          break;
                        case 'INITIATED':
                          this.appUtilityConfig.presentToast("Report generation is initiated...")
                          break;
                        case 'PROCESSING':
                          this.appUtilityConfig.presentToast("Report generation is progress...")
                          break;
                        case 'ERROR':
                          reportInput['isLoading'] = false
                          this.openReportDialog(reportResult['reportStatus'], reportInput, reportResult)
                          break;
                        default:
                          break;
                      }
                    }
                }
                regenerateReport(reportResult, reportInput) {
                    if (reportInput['isVisiblePageData'] === 'Y') {
                      reportInput['dataJson'] = [this.dataObject['${hierarchy.primary.rootPath}']]
                    }
                    if (reportInput['isLoading']) {
                        return this.cspfmReportGenerationService.regenerateReport(reportInput, JSON.parse(JSON.stringify(reportResult)))
                    }
                }
                reportAction(reportInput) {
                    if (this.isSkeletonLoading) {
                        this.appUtilityConfig.presentToast("Another process is running, please wait");
                        return
                    }            
                    if (reportInput['isLoading']) {
                        reportInput['isLoading'] = false
                        this.appUtilityConfig.presentToast("Report generation cancelled.")
                        return
                    } else {
                        reportInput['isLoading'] = true
                    }
                    this.openPDF(reportInput).then(res => {
                      if (res && res['records'].length > 0) {
                        const reportResult = res['records'][0]
                        switch (reportResult['reportStatus']) {
                          case 'COMPLETED':
                            reportInput['isLoading'] = false;
                            this.openReportDialog(reportResult['reportStatus'], reportInput, reportResult)
                            break;
                          case 'INITIATED':
                            this.appUtilityConfig.presentToast("Report generation is initiated...")
                            break;
                          case 'PROCESSING':
                            this.appUtilityConfig.presentToast("Report generation is progress...")
                            break;
                          case 'ERROR':
                            reportInput['isLoading'] = false;
                            this.openReportDialog(reportResult['reportStatus'], reportResult, reportInput)
                            break;
                          default:
                            break;
                        }
                    }else {
                        if (res && res['data']) {
                            reportInput['isLoading'] = false
                            this.appUtilityConfig.presentToast(res['data']['message'])
                        } else {
                            this.appUtilityConfig.presentToast("Report generation is Initiated...")
                        }
                      }
                    })
                }
                openPDF(reportInput) {
                    if (reportInput['isVisiblePageData'] === 'Y') {
                      reportInput['dataJson'] = [this.dataObject['${hierarchy.primary.rootPath}']]
                    }
                    reportInput['layoutId'] = +this.layoutId
                    if (this.dataSource === 'JsonDB') {
                      reportInput['recordId'] = +("" + this.appUtilityConfig.userId + this.layoutId + reportInput['elementId'])
                    } else {
                        reportInput['recordId'] = this.dataObject['${hierarchy.primary.rootPath}']['id'].includes(this.dataObject['${hierarchy.primary.rootPath}']['type']) ? this.dataObject['${hierarchy.primary.rootPath}']['id'] : this.dataObject['${hierarchy.primary.rootPath}']['type'] + "_2_" + this.dataObject['${hierarchy.primary.rootPath}']['id']
                    }
                    return this.cspfmReportGenerationService.getReport(reportInput).then(res => {
                      if (reportInput['onDemandReportGneration'] === 'Y') {
                        if (res && res['records'].length > 0) {
                            return this.regenerateReport(res['records'][0], reportInput)
                        }
                      } else {
                        return res;
                      }
                    }).catch(e => {
                      reportInput['isLoading'] = false;
                      this.appUtilityConfig.presentToast("Report genereation error...")
                    })
                }
                openReportViewer(action, reportResult) {
                    const dialogConfig = new MatDialogConfig()
                    dialogConfig.data = {
                      type: reportResult['reportFormat'],
                      url: reportResult['reportPath'],
                      action: action
                    };
                    dialogConfig.panelClass = 'custom-dialog-container'
                    this.dialog.open(cspfmAlertDialog, dialogConfig);
                }
                openReportDialog(status, reportInput, reportResult) {
                    var button = [{ "name": "Regenerate" }]
                    var title = "";
                    if (status === 'ERROR') {
                      title = reportResult['statusMessage']
                    } else {
                      button.unshift({ "name": reportInput['action'] })
                      title = "Report available"
                    }
                    const dialogConfig = new MatDialogConfig()
                    dialogConfig.data = {
                      title: title,
                      buttonInfo: button,
                      parentContext: this,
                      type: "Alert"
                    }
                    dialogConfig.autoFocus = false
                    let dialogRef = this.dialog.open(cspfmAlertDialog, dialogConfig)
                    dialogRef.afterClosed().subscribe(result => {
                      if (result) {
                        if (result['name'] === 'View' || result['name'] === 'Print') {
                          reportInput['isLoading'] = false
                          this.openReportViewer(reportInput['action'], reportResult)
                        } else if (result['name'] === 'Regenerate') {
                          reportInput['isLoading'] = true
                          this.regenerateReport(reportResult, reportInput)
                        }
                      }
                    });
                }
                `;
                if (layout.layoutType === 'Grid_with_List' && layout.layoutMode === 'VIEW' && layoutSection.sectionFor === "LIST") {
                    webHlListObj['entryPageA'][`pfm${layoutSection.objectId}`] = {};
                    webHlListObj['entryPageA'][`pfm${layoutSection.objectId}`]["addActionRequired"]= false;
                    webHlListObj['entryPageA'][`pfm${layoutSection.objectId}`]["addActionElementId"]= '';
                }
                // if (layout.layoutDataRestrictionSet.length > 0) {
                //     let layoutDataRestrictionType = layout.layoutDataRestrictionSet[0]
                //     let layoutDataRestriction = {
                //         "restrictionType": layoutDataRestrictionType.restrictionType,
                //         "restrictionLevel": layoutDataRestrictionType.restrictionLevel
                //     }
                //     layoutDataRestrictionSet.push(layoutDataRestriction)
                // }
                var presnt=(layout.layoutSectionSet).find(obj=>(obj.hasOwnProperty('sectionUserDataRestrictionSet') && (obj.sectionUserDataRestrictionSet).length!=0))              
                if(presnt!=undefined){
                    let sectionDataRestriction = {
                        "restrictionType": presnt.sectionUserDataRestrictionSet[0].restrictionType,
                        "restrictionLevel": presnt.sectionUserDataRestrictionSet[0].restrictionLevel
                    }
                    sectionUserDataRestrictionSet.push(sectionDataRestriction);
                }     
                hierarchy.parent.forEach(parentEL => {
                    if (!refObjVar.includes(`public __${parentEL.objectName}$tableName = this.objectTableMappingObject.mappingDetail['${parentEL.objectName}'];`)) {
                        refObjVar += `public __${parentEL.objectName}$tableName = this.objectTableMappingObject.mappingDetail['${parentEL.objectName}'];`
                    }
                });
                hierarchy.child.forEach(childEL => {
                    if (!refObjVar.includes(`public __${childEL.objectName}$tableName = this.objectTableMappingObject.mappingDetail['${childEL.objectName}'];`)) {
                        refObjVar += `public __${childEL.objectName}$tableName = this.objectTableMappingObject.mappingDetail['${childEL.objectName}'];`
                    }
                });
                hierarchy.lookup.forEach(lookup => {
                    if (!refObjVar.includes(`public __${lookup.objectName}$tableName = this.objectTableMappingObject.mappingDetail['${lookup.objectName}'];`)) {
                        refObjVar += `public __${lookup.objectName}$tableName = this.objectTableMappingObject.mappingDetail['${lookup.objectName}'];`
                    }
                });
                // if ((layout.layoutMode === 'VIEW' && layout.layoutType !== 'Grid_with_List' ) || layout.layoutMode === 'EDIT' ) {                                      
                //     if(layout.layoutConditionalFormatSet && layout.layoutConditionalFormatSet.length !== 0) {
                //         conditionFormatting = `
                //         getValuesBasedOnFieldType(element) {
                //             if (element['fieldType'] == 'TEXT' || element['fieldType'] == 'MULTILINETEXTBOX' || element['fieldType'] == 'AUTONUMBER' || element['fieldType'] == 'PRIMARY' || element['fieldType'] == 'TEXTAREA' || element['fieldType'] == 'URL' || element['fieldType'] == 'EMAIL' || element['fieldType'] == 'NUMBER' || element['fieldType'] == 'DECIMAL' || element['fieldType'] == 'CURRENCY' || element['fieldType'] == 'BOOLEAN') {
                //                 return element['value']
                //             } else if (element['fieldType'] == 'MULTISELECT' || element['fieldType'] == 'CHECKBOX') {
                //                 return element['value']
                //             } else if (element['fieldType'] == 'RADIO' || element['fieldType'] == 'DROPDOWN') {
                //                 return element['value']
                //             } else if (element['fieldType'] === 'DATE' || element['fieldType'] === 'TIMESTAMP') {
                //                 if (element['valueType'] == 'Function') {
                //                     return new Date().getTime()
                //                 } else {
                //                     return element['value']
                //                 }
                //             }
                //         }`
                //     }
                // }
                for (var off = 0; off < offlineObjectDetails.length; off++) {
                    if (offlineObjectDetails[off].objectId === sectionObjId) {
                        objDisplayName += `
                            'pfm${offlineObjectDetails[off].objectId}' : {
                                    'objectName':'${appObject.offlineObjectDetails[off].objectName}',
                                    'objectDisplayName':'${appObject.offlineObjectDetails[off].objectDisplayName}'
                            },
                        `
                    }
                    if(hierarchy !== undefined){
                        if (offlineObjectDetails[off].objectId === hierarchy.primary.objectId) {
                            for(let fields =0;fields<offlineObjectDetails[off].fields.length ; fields ++) {
                                let details = offlineObjectDetails[off].fields[fields];
                                if(details.fieldType === 'DROPDOWN' && details.isStatusWFEnabled === 'Y') {
                                    workFlowMapping[details.fieldId] = details.label; 
                                }
                            }
                        } 
                        for (let i = 0; i < hierarchy['child'].length; i++) {
                            const element = hierarchy['child'][i];
                            if (element.objectId !== layoutgrp.primaryObjectId) {
                                if (element.objectType === 'MASTERDETAIL') {
                                    if (offlineObjectDetails[off].objectId === element.objectId) {
                                        for(let field =0;field<offlineObjectDetails[off].fields.length ; field ++) {
                                            let detail = offlineObjectDetails[off].fields[field];
                                            if(detail.fieldType === 'DROPDOWN' && detail.isStatusWFEnabled === 'Y') {
                                                workFlowMapping[detail.fieldId] = detail.label; 
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                for (let i = 0; i < layout.layoutSectionSet.length; i++) {
                    let layoutSectionSet = layout.layoutSectionSet[i];
                    for (let j = 0; j < layoutSectionSet.sectionElementSet.length; j++) {
                        let sectionElement = layoutSectionSet.sectionElementSet[j];
                        if(layoutSectionSet.isSearch !=='Y' && sectionElement.elementType === 'ACTION' && sectionElement.actionType === 'FILE_MANAGE'){
                            for (let p = 0; p < appObject.offlineObjectDetails.length; p++) {
                                let fields = appObject.offlineObjectDetails[p].fields
                                fields.map(field => {
                                if(offlineObjectDetails[p]['fileManageConfigInfo'].length > 0 && field.isProminentEnable === 'Y'){
                                    let pro_key = `pfm${field.objectId}`;
                                    let pro_value = field.fieldName;          
                                    if (promient.hasOwnProperty(pro_key)) {
                                        if (field.prominentOrder === 0) {
                                            promient[pro_key].unshift(pro_value);
                                        } else {
                                            promient[pro_key].push(pro_value);
                                        }
                                    } else {
                                            promient[pro_key] = [pro_value];
                                    }
                                }
                                })
                            }
                        }
                        var gridTableO;
                        if(sectionElement.uiType === 'DROPDOWN' && sectionElement.isStatusWorkflowEnabled === 'Y' && sectionElement.isReadOnlyEnable != 'Y'){
                                // workFlowMapping[sectionElement.fieldId] = sectionElement.label; 
                                fieldApproverType[sectionElement.fieldId]="";                              
                        }
                        if (sectionElement.uiType === 'DROPDOWN' || sectionElement.uiType === 'CHECKBOX' || sectionElement.uiType === 'RADIO' || sectionElement.uiType === 'MULTISELECT') {
                            let comboVariable='';                        
                            if(layout.layoutMode === 'EDIT' && sectionElement.isReadOnlyEnable === 'Y'){
                                comboVariable = `public ${sectionElement.elementName}_${sectionElement.fieldId}_${sectionElement.elementId} = this.pfmObjectConfig.objectConfiguration['pfm${sectionElement.objectId}']['selectionFieldsMapping']['${sectionElement.elementName}'];`;
                            }else if(layout.layoutMode === 'LIST' || layout.layoutMode === 'VIEW'){
                                comboVariable = `public ${sectionElement.elementName}_${sectionElement.fieldId}_${sectionElement.elementId} = this.pfmObjectConfig.objectConfiguration[this.__${sectionElement.objectName}$tableName]['selectionFieldsMapping']['${sectionElement.elementName}'];`;
                            }
                            if(!comboVar.includes(comboVariable)){
                                comboVar += comboVariable
                            }
                        }
                        if(sectionElement.elementType === 'ACTION' && sectionElement.actionType === 'DATA_UPSERT'){
                            if(layout.layoutMode === 'LIST' && layoutSectionSet.sectionFor === 'Header') {
                                 upsertFlag = true;
                            }
                            fetchActionUpsertInfo +=`"${sectionElement.elementId}": {
                                "sourceId": ${sectionElement.elementId}, 
                                "sourceType": "SECTIONELEMENT",
                                "processId": ${sectionElement.layoutActionInfoSet[0]['processId']}, 
                                "processType": "${sectionElement.layoutActionInfoSet[0]['processType']}",
                                "objectId": ${sectionObjId},
                            },`
                            requiredColumnForUpsert+=`'${sectionElement.elementId}':${JSON.stringify(JSON.parse(sectionElement.layoutActionInfoSet[0].upsertDetails))},`
                            if(layout.layoutMode === 'LIST'){
                                dataUpsertVariable =`
                        
                            public objResultMap = new Map<string, any>();
                        
                            private childObjectList = [];
                        
                            private dataFetchInfo = {}
                        
                            public fetchActionUpsertInfo: any = {${fetchActionUpsertInfo}}
                        
                            private  objDisplayName = { ${objDisplayName}};
                            
                            private requiredColumnForUpsert = {${requiredColumnForUpsert}}; 
                        
                            private selectedRowMappingInfo = {
                        
                            }
                        
                            private webserviceUniqueColumnObj = {}
                        `
                            } else if(layout.layoutMode === 'VIEW' && layoutSection.sectionFor ==='LIST'){
                                if(sectionElement.isHeaderAction === "N"){
                                    if(actionJson === ''){
                                        actionJson +=`{
                                            "actionIcon": "icon-mat-check_circle",
                                            "actionName": "${sectionElement.elementName}",
                                            "actionType": "${sectionElement.actionType}",
                                            "actionLabel": "${sectionElement.label}",
                                            "sourceId": "${sectionElement.elementId}"
                                            }`
                                    }else{
                                        actionJson +=`,{
                                            "actionIcon": "icon-mat-check_circle",
                                            "actionName": "${sectionElement.elementName}",
                                            "actionType": "${sectionElement.actionType}",
                                            "actionLabel": "${sectionElement.label}",
                                            "sourceId": "${sectionElement.elementId}"
                                            }`
                                    }
                                    
                                } else {
                                    if(childJson === ''){
                                        childJson +=`{
                                            "sourceId": "${sectionElement.elementId}",
                                            "actionIcon": "icon-mat-library_books",
                                            "actionElementId":"${sectionElement.actionTagId}_preview"
                                            }`
                                    }else{
                                        childJson +=`,{
                                            "sourceId": "${sectionElement.elementId}",
                                            "actionIcon": "icon-mat-library_books",
                                            "actionElementId":"${sectionElement.actionTagId}_preview"
                                            }`
                                    }
                                }
                            }
                        }else if(sectionElement.elementType === 'ACTION' && sectionElement.actionType === 'ACTIONS_GROUP'){
                            for (let k = 0; k < sectionElement.elementActions.length; k++) {
                                const elementActions = sectionElement.elementActions[k];
                                if(elementActions.elementType === 'ACTION' && elementActions.actionType === 'MORE'){
                                    if(layoutSectionSet.sectionFor !== 'LIST'){
                                        if(moreActionGroupJson === ''){
                                            moreActionGroupJson += await listTableFormation.moreActionInfoJson(elementActions, hierarchy, layout, layoutSectionSet.sectionType, 'GRID');
                                        }else {
                                            moreActionGroupJson += "," + await listTableFormation.moreActionInfoJson(elementActions, hierarchy, layout, layoutSectionSet.sectionType, 'GRID');
                                        }

                                        moreActionSelected =
                                        `moreActionSelected(event) {
                                            if (event['actionInfo']['actionCallingMethodParamsCount'] === 0) {
                                                this[event['actionInfo']['actionCallingMethodName']]();
                                            } else if (event['actionInfo']['actionCallingMethodParamsCount'] === 1) {
                                                this[event['actionInfo']['actionCallingMethodName']](event['actionInfo']['actionCallingMethodParams']['params1']);
                                            } else if (event['actionInfo']['actionCallingMethodParamsCount'] === 2) {
                                                this[event['actionInfo']['actionCallingMethodName']](event['actionInfo']['actionCallingMethodParams']['params1'], event['actionInfo']['actionCallingMethodParams']['params2']);
                                            }
                                        }`

                                    }
                                } 
                                if(elementActions.elementType === 'ACTION' && elementActions.actionType === 'WORKFLOW'){
                                    let workflowAction = elementActions.workflowActionInfoSet;
                                    for(let w = 0; w < workflowAction.length; w++){
                                        workflowActionInfoSet += 
                                      `"${workflowAction[w].workflowActionInfoId}": {
                                          "actionDisplayType": "${workflowAction[w].actionDisplayType}",
                                          "sourceStatus": ${JSON.stringify(workflowAction[w].sourceStatus)},
                                          "destinationStatus": ${JSON.stringify(workflowAction[w].destinationStatus)},
                                          "objectId": "pfm${workflowAction[w].fieldObjectId}",
                                          "fieldName": "${workflowAction[w].fieldName}",
                                          "fieldDisplayName": "${workflowAction[w].fieldDisplayName}",
                                          "traversalPath": "${workflowAction[w].traversalPath}",
                                          "traversalConfigJson": ${JSON.stringify(workflowAction[w].traversalConfigJson)}
                                        },`
                                    }
                                }
                                if(elementActions.elementType === 'ACTION' && elementActions.actionType === 'DATA_UPSERT'){
                                    if(elementActions.layoutActionInfoSet.length > 0){
                                        requiredColumnForUpsert+=`'${elementActions.elementId}':${JSON.stringify(JSON.parse(elementActions.layoutActionInfoSet[0].upsertDetails))},`
                                        fetchActionUpsertInfo +=`"${elementActions.elementId}": {
                                            "sourceId": ${elementActions.elementId},
                                            "sourceType": "SECTIONELEMENT",
                                            "processId": ${elementActions.layoutActionInfoSet[0]['processId']},
                                            "processType": "${elementActions.layoutActionInfoSet[0]['processType']}",
                                            "objectId": ${sectionObjId},
                                        },`
                                    }
                                    if(layout.layoutMode === 'LIST'){
                                        dataUpsertVariable =`
                                
                                    public objResultMap = new Map<string, any>();
                                
                                    private childObjectList = [];
                                
                                    private dataFetchInfo = {}
                                
                                    public fetchActionUpsertInfo: any = {${fetchActionUpsertInfo}}
                                
                                    private  objDisplayName = { ${objDisplayName}};
                                    
                                    private requiredColumnForUpsert = {${requiredColumnForUpsert}}; 
                                
                                    private selectedRowMappingInfo = {
                                
                                    }
                                
                                    private webserviceUniqueColumnObj = {}
                                `
                                    } else if(layout.layoutMode === 'VIEW' && layoutSection.sectionFor ==='LIST'){
                                        if(sectionElement.isHeaderAction === "N"){
                                            if(actionJson === ''){
                                                actionJson +=`{
                                                    "actionIcon": "icon-mat-check_circle",
                                                    "actionName": "${elementActions.elementName}",
                                                    "actionType": "${elementActions.actionType}",
                                                    "actionLabel": "${elementActions.label}",
                                                    "sourceId": "${elementActions.elementId}"
                                                    }`
                                            }else{
                                                actionJson +=`,{
                                                    "actionIcon": "icon-mat-check_circle",
                                                    "actionName": "${elementActions.elementName}",
                                                    "actionType": "${elementActions.actionType}",
                                                    "actionLabel": "${elementActions.label}",
                                                    "sourceId": "${elementActions.elementId}"
                                                    }`
                                            }
                                            
                                        } else {
                                            if(childJson === ''){
                                                childJson +=`{
                                                    "sourceId": "${elementActions.elementId}",
                                                    "actionIcon": "icon-mat-library_books",
                                                    "actionElementId":"${elementActions.actionTagId}_preview"
                                                    }`
                                            }else{
                                                childJson +=`,{
                                                    "sourceId": "${elementActions.elementId}",
                                                    "actionIcon": "icon-mat-library_books",
                                                    "actionElementId":"${elementActions.actionTagId}_preview"
                                                    }`
                                            }
                                        }
                                    }
                                }
                            }
                        } else if(sectionElement.elementType === 'ACTION' && sectionElement.actionType === 'MORE'){
                            if(layoutSectionSet.sectionFor !== 'LIST' || (layoutSectionSet.sectionFor === 'LIST' && sectionElement.isHeaderAction === 'Y')){

                                if(moreActionJson === ''){
                                    moreActionJson += await listTableFormation.moreActionInfoJson(sectionElement, hierarchy, layout, layoutSectionSet.sectionType, 'GRID');
                                }else {
                                    moreActionJson += "," + await listTableFormation.moreActionInfoJson(sectionElement, hierarchy, layout, layoutSectionSet.sectionType, 'GRID');
                                }

                            moreActionSelected =
                            `moreActionSelected(event) {
                                if (event['actionInfo']['actionCallingMethodParamsCount'] === 0) {
                                    this[event['actionInfo']['actionCallingMethodName']]();
                                } else if (event['actionInfo']['actionCallingMethodParamsCount'] === 1) {
                                    this[event['actionInfo']['actionCallingMethodName']](event['actionInfo']['actionCallingMethodParams']['params1']);
                                } else if (event['actionInfo']['actionCallingMethodParamsCount'] === 2) {
                                    this[event['actionInfo']['actionCallingMethodName']](event['actionInfo']['actionCallingMethodParams']['params1'], event['actionInfo']['actionCallingMethodParams']['params2']);
                                } else if (event['actionInfo']['actionCallingMethodParamsCount'] === 3) {
                                    this[event['actionInfo']['actionCallingMethodName']](event['actionInfo']['actionCallingMethodParams']['params1'], event['actionInfo']['actionCallingMethodParams']['params2'],event['actionInfo']['actionCallingMethodParams']['params3']);
                                } else if (event['actionInfo']['actionCallingMethodParamsCount'] === 4) {
                                    this[event['actionInfo']['actionCallingMethodName']](this, event['actionInfo']['actionCallingMethodParams']['params2'],event['actionInfo']['actionCallingMethodParams']['params3'],event['actionInfo']['actionCallingMethodParams']['params4']);
                                }
                            }`

                            }
                        }
                        if(sectionElement.hasOwnProperty('elementActions')){
                            isUserAssignAction =sectionElement.elementActions.filter(elementActionele=> elementActionele.elementType === 'ACTION' && elementActionele.actionType === 'USERASSIGNMENT');
                        }
                        if (sectionElement.elementType === 'ACTION' && sectionElement.actionType === 'USERASSIGNMENT' || isUserAssignAction.length > 0 ) {
                            if (layoutSectionSet.sectionFor !== 'LIST' ) {
                                userAssignmentViewMethods = `public showUserIcon;
                                                             showMoreUserContent() {
                                                             this.showUserIcon = !this.showUserIcon;
                                                             }
                                                            public showGroupContent;
                                                             showMoregroupContent() {
                                                             this.showGroupContent = !this.showGroupContent;
                                                             }
                                                             public showRoleContent;
                                                             showMoreroleContent() {
                                                             this.showRoleContent = !this.showRoleContent;
                                                             }

                                                             toogleGrouptab() {
                                                             var selectedGroup = document.getElementById("selectedGroup");
                                                             selectedGroup.classList.toggle("cs-display-block");
                                                             selectedGroup.classList.toggle("cs-display-none");
                                                             var selectGroup = document.getElementById("selectGroup");
                                                             selectGroup.classList.toggle("cs-display-block");
                                                             selectGroup.classList.toggle("cs-display-none");
                                                             }
                                                              toggleUserTab() {
                                                              var selectedUser = document.getElementById("selectedUser");
                                                              selectedUser.classList.toggle("cs-display-block");
                                                              selectedUser.classList.toggle("cs-display-none");
                                                              var selectuser = document.getElementById("selectUser");
                                                              selectuser.classList.toggle("cs-display-block");
                                                              selectuser.classList.toggle("cs-display-none");
                                                              }
                                                             toggleRoleTab() {
                                                             var selectedRole = document.getElementById("selectedRole");
                                                             selectedRole.classList.toggle("cs-display-block");
                                                             selectedRole.classList.toggle("cs-display-none");
                                                             var selectRole = document.getElementById("selectRole");
                                                             selectRole.classList.toggle("cs-display-block");
                                                             selectRole.classList.toggle("cs-display-none");
                                                              }
                                                             morebtnaction() {
                                                             var btn = document.getElementsByClassName("cs-assingeduser-more-btn")[0].getBoundingClientRect();
                                                             var btnwidth = btn.width;
                                                             var btnright = btn.right;
                                                             var btnleft = document.getElementsByClassName("cs-assingeduser-more-btn")[0]['offsetLeft'];
                                                              var popup = document.getElementsByClassName("cs-morebtn-popup")[0]['offsetWidth'];
                                                             var popupstyle = document.getElementsByClassName("cs-morebtn-popup")[0];
                                                            if ((btnleft + popup) > window.innerWidth) {
                                                            var btn = document.getElementsByClassName("cs-assingeduser-more-btn")[0].getBoundingClientRect();
                                                             var btnx = btn.width;
                                                             var rightval = document.getElementsByClassName("cdk-overlay-pane")[0];
                                                             rightval['style']['right'] = btnx + 'px';
                                                             document.getElementsByClassName("cdk-overlay-pane")[0].classList.add("cs-remove-right");
                                                            popupstyle['style']['left'] = btnleft - popup + 'px';
                                                             }
                                                             else {
                                                              document.getElementsByClassName("cdk-overlay-pane")[0].classList.add("cs-remove-left");
                                                              popupstyle['style']['left'] = btnright + 'px';
                                                             }
                                                             }`
                            }
                            if (layoutSection.sectionFor === 'LIST') {
                                userAssignmentOnClick = `if (actionInfo['actionType'] === "USERASSIGNMENT") {
                                    this.slickgridPopoverService.render({
                                    component: cspfmUserAssignmentPopover,
                                    args,
                                    parent: this,
                                    additionalInfo: {
                                       "cspfmObjectName": "${hierarchy.primary.objectName}",
                                       "type": "USERASSIGNMENT",
                                       "data": data,
                                       "actionIdData": actionInfo['actionId'],
                                       "layoutIdData": this.layoutId
                                     }
                                    });           
                                }`
                            }
                        }
                        if(sectionElement.layoutActionInfoSet.length > 0 && sectionElement.layoutActionInfoSet[0].actionType === 'BALLOON_TOOLTIP' && sectionElement.layoutActionInfoSet[0].isBalloonToolTipEnable === "Y"){
                            let balloonRootPath = sectionElement.rootPath.substring(0,sectionElement.rootPath.lastIndexOf("$$"))
                            if(balloonConfiguredFieldList === ''){
                                balloonConfiguredFieldList += `
                                '${sectionElement.elementId}':{
                                    'layoutName': ${sectionElement.layoutActionInfoSet[0].BalloonToolTipEnabledLayout},
                                    'id': this.dataObject['${balloonRootPath}'] ? this.dataObject['${balloonRootPath}']["id"] : ''
                                }
                                `
                            }
                            else{
                                balloonConfiguredFieldList += `
                                ,'${sectionElement.elementId}':{
                                    'layoutName': ${sectionElement.layoutActionInfoSet[0].BalloonToolTipEnabledLayout},
                                    'id': this.dataObject['${balloonRootPath}'] ? this.dataObject['${balloonRootPath}']["id"] : ''
                                }
                                `
                            }
                            showBalloonLayoutOnMouseOverAndOnClick = `
                            public dynaComponentsOutputPage: any;
                            public balloonLayoutInfo: any;
                            public balloonEventType: any;

                            showBalloonLayoutOnMouseOverAndOnClick(elementId: any, event: any, eventType: any) {
                                this.balloonEventType = eventType;
                                if (['click', 'dblclick'].includes(eventType)) {
                                  $(document).find(".cdk-overlay-pane").css("display", "none");
                                }
                                this.balloonClickPosition(event);
                                
                                const balloonconfiguredfieldlist = {
                                    ${balloonConfiguredFieldList}
                                }

                                const selectedFieldConfigure = balloonconfiguredfieldlist[elementId];
                                selectedFieldConfigure['redirectUrlForNav'] = this.isPopUpEnabled ? this.redirectUrl : "/menu/${layout.layoutName}";
                                selectedFieldConfigure['isPopUpEnabled'] = this.isPopUpEnabled;
                                if (Object.keys(selectedFieldConfigure).length > 0 && selectedFieldConfigure["layoutName"]["name"] && selectedFieldConfigure["id"] && selectedFieldConfigure["id"] !== '' && selectedFieldConfigure['redirectUrlForNav']) {
                                  this.balloonLayoutInfo = "";
                                  this.balloonLayoutInfo = selectedFieldConfigure;
                                }
                                else {
                                  this.balloonLayoutInfo = "";
                                  this.closePopover();
                                }
                            }
                            
                            @ViewChildren(MdePopoverTrigger) queryTrigger: QueryList<MdePopoverTrigger>;
                            @ViewChild(MdePopoverTrigger, { static: false }) trigger: MdePopoverTrigger;

                            closePopover() {
                                this.queryTrigger.toArray().forEach(
                                  closePopoverElement => {
                                    closePopoverElement.closePopover();
                                  }
                                );
                              }

                            balloonClickPosition(event) {
                                setTimeout(() => {
                                  $(document).find(".cdk-overlay-pane").css("display", "inline-block");
                                  const windowHeight = window.innerHeight;
                                  let xPosition = event.clientX;
                                  let yPosition = event.clientY;
                                  var ballBtnWidth = $('.cs-mat-view-grid').find('label').width()
                                  var ballPopupWidth = $("cspfmBalloonComponent").find('.cs-balloon-popup-style').width();
                            
                                  if ((window.innerWidth - xPosition) - (ballPopupWidth + ballBtnWidth) > 0) {
                                    console.log("Popup right side === arrow to left");
                                    $(".cdk-overlay-pane").css('left', xPosition + ballBtnWidth + 35);
                                  } else {
                                    console.log("Popup left side === arrow to right");
                                    $(".cdk-overlay-pane").css('left', 22 + xPosition - ballPopupWidth);
                                  }
                                  let _ballHeight = $("cspfmBalloonComponent").find(".cs-balloon-popup-style").height()
                                  if (windowHeight - (yPosition + _ballHeight) < 0) {
                                    console.log("BOTTOM to Top")
                                    $(".cdk-overlay-pane").css("top", (yPosition - 10 - 15) - ((yPosition + _ballHeight) - windowHeight));
                                  } else {
                                    console.log("Top to BOTTOM")
                                    $(".cdk-overlay-pane").css("top", yPosition - 10);
                                  }
                                }, 10)
                              }
                            `
                        }
                        if (moreActionJson === ''){
                            moreActionJsonFormation = `public moreActionInfo = {${moreActionGroupJson}}`
                        } else {
                            moreActionJsonFormation = `public moreActionInfo = {${moreActionJson +','+ moreActionGroupJson}}`
                        }

                        if(layout.layoutMode==='VIEW' && layout.isDrawerEnable== "Y" && sectionElement.uiType ==="RECORDASSOCIATION"){
                            let gridTableDetailInfoP = await listTableFormation.associtationTableColumnInfo(gridTableSkeleton, sectionElement, layout,appObject);                      
                            let associationType=baseCtrlObj.baseCtrlMap.get('RECORD_TYPE');
                            let RType=sectionElement.recordAssociationMap.recordAssociationOutputType;
                            if(!associationType.includes(RType)){
                            if(gridTableDetails === ''){
                                gridTableDetails +=`'pfm${sectionElement.objectId}_${sectionElement.fieldName}_${sectionElement.elementId}':${JSON.stringify(gridTableDetailInfoP)}`
                             }else{
                                gridTableDetails +=`,'pfm${sectionElement.objectId}_${sectionElement.fieldName}_${sectionElement.elementId}':${JSON.stringify(gridTableDetailInfoP)}`
                             }
                            if(gridColumnDefinitions === '' ){
                                gridColumnDefinitions += await slickGrid.associtationColumnDefinition(sectionElement,layout,'',layoutSection.sectionFor);
                            }else{
                                gridColumnDefinitions += "," + await slickGrid.associtationColumnDefinition(sectionElement,layout,'',layoutSection.sectionFor);
                            }
                        }
                        }
                    }
                }
                if (actionJson != '') {
                    if (!actionCompJson.includes(`"pfm${layoutSection.objectId}":[${actionJson}]`)) {
                        actionCompJson += `"pfm${layoutSection.objectId}":[${actionJson}],`
                    }
                }
                if (childJson != '') {
                    if (!childSecHeader.includes(`"pfm${layoutSection.objectId}":[${childJson}]`)) {
                        childSecHeader += `"pfm${layoutSection.objectId}": [${childJson}],`
                    }
                }
                for (let i = 0; i < layoutSection.sectionElementSet.length; i++) {
                    const sectionElement = layoutSection.sectionElementSet[i];
                    let recAssDetailViewFlag=layout.layoutMode ==='VIEW' && layout.isDrawerEnable === "Y" ? false : true;
                    if (sectionElement.elementType === "FIELD") {
                        let objKey = `pfm${sectionElement.objectId}`;
                        if (prominetDataMapping.hasOwnProperty(objKey)) {
                            prominetDataMapping[objKey][sectionElement.displayOrder] = sectionElement.elementName;
                        } else {
                            prominetDataMapping[objKey] = [];
                            prominetDataMapping[objKey][sectionElement.displayOrder] = sectionElement.elementName;
                        }
                        if (sectionElement.elementName) {
                            var notPrimaryFlag = false;
                            const primarySectionObjectId = layoutSection.objectId === 0 ? hierarchy.primary.objectId : layoutSection.objectId;
                            layout.layoutLinkSet.forEach((linkSets)=>{
                                if(linkSets['objectId'] === sectionElement.objectId){
                                    if(linkSets['objectId'] !== primarySectionObjectId){
                                        notPrimaryFlag =true
                                    }
                                }

                            })
                            let linkSetNotPrimary = layout.layoutLinkSet.filter(
                                linkJSON => linkJSON.objectType.toUpperCase() !== 'PRIMARY' && linkJSON.objectId !== primarySectionObjectId
                            )
                            let lookupReadonlyField = layout.layoutLinkSet.filter(link => link.fieldId !== sectionElement.parentLookupReferenceId && link.objectType.toUpperCase() !== 'PRIMARY')
                            var temp = {};
                            if(layout.layoutMode === 'EDIT'){
                                if(notPrimaryFlag &&  sectionElement.isReadOnlyEnable === "Y"){
                                    if(sectionElement.referenceLookupFieldId !== 0 && sectionElement.referenceLookupFieldId === sectionElement.parentLookupReferenceId){
                                        gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, sectionElement, baseCtrlObj, layout);
                                        lookupReadonlyFieldInfo[sectionElement.rootPath] = gridTableO;
                                    } else {
                                        let tempSectionElement = {
                                            ...sectionElement
                                        };
                                        gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, tempSectionElement, baseCtrlObj, layout);
                                        let finalObject = await fieldInfoJson.getJsonFormation(lookupReadonlyField, sectionElement.objectId, sectionElement.rootPath, gridTableO, sectionElement.fieldId, Object.entries(layout.objectTraversal),'');
                                        lookupReadonlyFieldInfo[sectionElement.rootPath] = finalObject;
                                    }
                                }
                            } else {
                                if(sectionElement.uiType === 'DROPDOWN' && sectionElement.isStatusWorkflowEnabled === 'Y'){
                                    if( layoutSection.sectionFor==='LIST'){
                                        let tempSectionElement = {
                                            ...sectionElement
                                        };
                                        tempSectionElement["listSWF"] = true ; 
                                        gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, tempSectionElement, baseCtrlObj, layout);
                                    } else{
                                        gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, sectionElement, baseCtrlObj, layout);

                                    }
                                }else{
                                        if(sectionElement.uiType==='RECORDASSOCIATION'){
                                            let type;
                                            if(layout.layoutMode=== "VIEW" && (layoutSection.sectionFor==="LIST" || layoutSection.sectionFor==="GRID")){
                                                type=layoutSection.sectionFor==="LIST" ? "LIST" : "GRID";
                                                gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, sectionElement, baseCtrlObj, layout,'','_',type);
                                            }else if(layout.layoutMode=== "LIST"){
                                                gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, sectionElement, baseCtrlObj, layout,'','_',"LIST");
                                            }
                                        }else{
                                            gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, sectionElement, baseCtrlObj, layout);
                                        }
                                   }
                                if(notPrimaryFlag){
                                    let finalObject;
                                    if(!lodash.isEmpty(gridTableO)){
                                        if(layout.layoutType === 'Grid_with_List' && layout.layoutMode==='VIEW' && layoutSection.sectionFor==='LIST'){
                                            finalObject = await fieldInfoJson.getJsonFormation(linkSetNotPrimary, sectionElement.objectId, sectionElement.rootPath, gridTableO, sectionElement.fieldId, Object.entries(layout.objectTraversal),layoutSection.objectId);
                                        }else{
                                            finalObject = await fieldInfoJson.getJsonFormation(linkSetNotPrimary, sectionElement.objectId, sectionElement.rootPath, gridTableO, sectionElement.fieldId, Object.entries(layout.objectTraversal),'');
                                        }
                                    }
                                    if(sectionElement.hasOwnProperty('actionData') && sectionElement.actionData.length > 0 && sectionElement.actionData[0].hasOwnProperty('balloonInfo') && sectionElement.layoutActionInfoSet.length > 0 && sectionElement.layoutActionInfoSet[0].actionType === 'BALLOON_TOOLTIP' && sectionElement.layoutActionInfoSet[0].isBalloonToolTipEnable === "Y"){
                                        finalObject['balloonInfo'] = JSON.parse(sectionElement.actionData[0].balloonInfo);               
                                    }
                                    if(sectionElement.uiType === 'ROLLUPSUMMARY'){
                                        gridTableFieldInfoArray[`pfm${sectionElement.objectId}_${sectionElement.elementName}__r_${sectionElement.elementId}`] = finalObject;                                            
                                    }else if(sectionElement.uiType === 'FORMULA'){
                                        gridTableFieldInfoArray[`pfm${sectionElement.objectId}_${sectionElement.elementName}__f_${sectionElement.elementId}`] = finalObject;                                            
                                    } else {
                                        gridTableFieldInfoArray[`pfm${sectionElement.objectId}_${sectionElement.elementName}_${sectionElement.elementId}`] = finalObject;
                                    }
                                } else {
                                    if(sectionElement.hasOwnProperty('actionData') && sectionElement.actionData.length > 0 && sectionElement.actionData[0].hasOwnProperty('balloonInfo') && sectionElement.layoutActionInfoSet.length > 0 && sectionElement.layoutActionInfoSet[0].actionType === 'BALLOON_TOOLTIP' && sectionElement.layoutActionInfoSet[0].isBalloonToolTipEnable === "Y"){
                                        gridTableO['balloonInfo'] = JSON.parse(sectionElement.actionData[0].balloonInfo);               
                                    }
                                    if(sectionElement.uiType === 'ROLLUPSUMMARY'){
                                        gridTableFieldInfoArray[`pfm${sectionElement.objectId}_${sectionElement.elementName}__r_${sectionElement.elementId}`] = gridTableO;                                            
                                    }else if(sectionElement.uiType === 'FORMULA'){
                                        gridTableFieldInfoArray[`pfm${sectionElement.objectId}_${sectionElement.elementName}__f_${sectionElement.elementId}`] = gridTableO;                                            
                                    } else {
                                        gridTableFieldInfoArray[`pfm${sectionElement.objectId}_${sectionElement.elementName}_${sectionElement.elementId}`] = gridTableO;
                                    }
                                }
                            }
                            if (columnDefinitions === '') {
                                columnDefinitions += await slickGrid.slickGridArrayFormation(sectionElement, sectionObjId, layout, appObject.offlineObjectDetails, hierarchy, baseCtrlObj);
                            } else {
                                columnDefinitions += `, ` + await slickGrid.slickGridArrayFormation(sectionElement, sectionObjId, layout, appObject.offlineObjectDetails, hierarchy, baseCtrlObj);
                            }
                            if (countList === 0) {
                                if(sectionElement.uiType === 'ROLLUPSUMMARY'){
                                    gridOption = `this.tableColumnInfo['pfm${sectionObjId}']['pfm${sectionElement.objectId}_${sectionElement.elementName}__r_${sectionElement.elementId}']['prop']`
                                }else if(sectionElement.uiType === 'FORMULA'){
                                    gridOption = `this.tableColumnInfo['pfm${sectionObjId}']['pfm${sectionElement.objectId}_${sectionElement.elementName}__f_${sectionElement.elementId}']['prop']`
                                } else {
                                    gridOption = `this.tableColumnInfo['pfm${sectionObjId}']['pfm${sectionElement.objectId}_${sectionElement.elementName}_${sectionElement.elementId}']['prop']`
                                }
                            }
                            if (countList <= 2) {
                                if (sectionElement.displayOrder >= 1) {
                                    listTableFieldInfoArray.push(gridTableO);
                                    countList++;
                                }
                            }
                        }
                        if (sectionElement.hasOwnProperty("elementActions")){
                            for (let p = 0; p < sectionElement.elementActions.length; p++){
                                let fieldActions = sectionElement.elementActions[p];
                                if (fieldActions.elementType === 'ACTION' && fieldActions.actionType === "DATA_UPSERT") {
                                    if(fieldActions.layoutActionInfoSet.length > 0){
                                        fetchActionUpsertInfo +=`"${fieldActions.elementId}": {
                                            "sourceId": ${fieldActions.elementId},
                                            "sourceType": "SECTIONELEMENT",
                                            "processId": ${fieldActions.layoutActionInfoSet[0]['processId']},
                                            "processType": "${fieldActions.layoutActionInfoSet[0]['processType']}",
                                            "objectId": ${sectionObjId},
                                        },`
                                        requiredColumnForUpsert+=`'${fieldActions.elementId}':${JSON.stringify(JSON.parse(fieldActions.layoutActionInfoSet[0].upsertDetails))},`
                                    }
                                } 
                            
                            }
                        }
                    }
                    let objectJson = JSON.parse(layout.objectHierarchySet[0].hierarchyJsonContent);
                    let hierarchyOjectJson='';
                    for (let m = 0; m < objectJson['childObject'].length; m++) {
                        if(objectJson['childObject'][m]['objectType'] === 'MASTERDETAIL' && Number(objectJson['childObject'][m]['objectId']) === Number(layoutSection.objectId)){
                             hierarchyOjectJson = objectJson['childObject'][m];
                        }
                    }
                
                    if(sectionElement.elementType === 'ACTION' && sectionElement.actionType === "DATA_UPSERT"){
                        gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, sectionElement, baseCtrlObj,layout);
                        if(layout.layoutType != 'GRID' && layoutSection.sectionFor === 'LIST')
                        {
                            gridTableFieldInfoArray[`pfm${sectionObjId}_cspfmaction`] = gridTableO;
                        } 
                        if(sectionElement.isHeaderAction === "N"){
                            if (columnDefinitions === '') {
                                columnDefinitions += await slickGrid.slickGridArrayFormation(sectionElement, sectionObjId,layout,appObject.offlineObjectDetails,hierarchy,baseCtrlObj);
                            } else {
                                columnDefinitions += `, ` + await slickGrid.slickGridArrayFormation(sectionElement, sectionObjId,layout,appObject.offlineObjectDetails,hierarchy,baseCtrlObj);
                            }
                        } 
                    
                    }else if(sectionElement.elementType === 'ACTION' && (sectionElement.actionType === 'ACTIONS_GROUP'|| ((sectionElement.actionType === 'EDIT' || sectionElement.actionType === 'VIEW' || sectionElement.actionType === 'DATA_FETCH'  || sectionElement.actionType === 'MAIL' ||  sectionElement.actionType === 'WORKFLOW')&& sectionElement.isRowActionEnable === 'N'))){
                        if (layout.layoutType === 'Grid_with_List' && layout.layoutMode === 'VIEW'&& layoutSection.sectionFor === "LIST" && layoutSection.objectId != 0) {                             
                            let tempSectionElement = {
                               ...sectionElement
                           };
                           hierarchyChildObjectFormation(hierarchyOjectJson);
                           let hlListHierachy= await getHierarchySet(layout.layoutLinkSet,layoutSection.objectId);
                           tempSectionElement["hierarchy"] = hlListHierachy;                             
                            gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, tempSectionElement, baseCtrlObj, layout);
                            if(isPreviewRequired){  
                                for (let k = 0; k <  gridTableO['actionInfo'].length; k++) {
                                    const element =  gridTableO['actionInfo'][k];
                                    if(element.hasOwnProperty('navigationInfo')){
                                        element['navigationInfo']['redirectUrl']=element['navigationInfo']['redirectUrl']+'preview';
                                    }
                                }
                            }
                            } else {
                            let tempSectionElement = {
                                ...sectionElement
                            };
                            tempSectionElement["hierarchy"]=hierarchy;         
                            gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, tempSectionElement, baseCtrlObj,layout);
                            }
                            if(layout.layoutType != 'GRID' && layoutSection.sectionFor === 'LIST')
                            {
                                gridTableFieldInfoArray[`pfm${sectionObjId}_cspfmaction${sectionElement.elementId}`] = gridTableO;
                            } 
                            if(sectionElement.isHeaderAction === "N"){
                                if (columnDefinitions === '') {
                                    columnDefinitions += await slickGrid.slickGridArrayFormation(sectionElement, sectionObjId,layout,appObject.offlineObjectDetails,hierarchy,baseCtrlObj);
                                } else {
                                    columnDefinitions += `, ` + await slickGrid.slickGridArrayFormation(sectionElement, sectionObjId,layout,appObject.offlineObjectDetails,hierarchy,baseCtrlObj);
                                }
                            } 
                    }
                    // else if(sectionElement.elementType === 'ACTION' && sectionElement.isRowActionEnable === 'N' && (sectionElement.actionType === 'EDIT' || sectionElement.actionType === 'VIEW' )){
                    //     if (layout.layoutType === 'Grid_with_List' && layout.layoutMode === 'VIEW'&& layoutSection.sectionFor === "LIST" && layoutSection.objectId != 0) {
                          
                    //         let tempSectionElement = {
                    //             ...sectionElement
                    //         };
                    //         hierarchyChildObjectFormation(hierarchyOjectJson);
                    //         let hlListHierachy= await getHierarchySet(layout.layoutLinkSet,layoutSection.objectId);
                    //         tempSectionElement["hierarchy"] = hlListHierachy;                             
                    //          gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, tempSectionElement, baseCtrlObj, layout);
                    //      } else {
                    //         let tempSectionElement = {
                    //             ...sectionElement
                    //         };
                    //         tempSectionElement["hierarchy"]=hierarchy;
                    //         gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, tempSectionElement, baseCtrlObj,layout);
                    //      } 
                    //         if(layout.layoutType != 'GRID' && layoutSection.sectionFor === 'LIST')
                    //         {
                    //             gridTableFieldInfoArray[`pfm${sectionObjId}_cspfmaction${sectionElement.elementId}`] = gridTableO;
                    //         }
                    //         if(sectionElement.isHeaderAction == "N"){
                    //             if (columnDefinitions === '') {
                    //                 columnDefinitions += await slickGrid.slickGridArrayFormation(sectionElement, sectionObjId,layout,appObject.offlineObjectDetails,hierarchy,baseCtrlObj);
                    //             } else {
                    //                 columnDefinitions += `, ` + await slickGrid.slickGridArrayFormation(sectionElement, sectionObjId,layout,appObject.offlineObjectDetails,hierarchy,baseCtrlObj);
                    //             }
                    //         }
                    // } 
                    else if(sectionElement.elementType === 'ACTION' && sectionElement.actionType === 'WHO_COLUMN'){
                       gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, sectionElement, baseCtrlObj,layout);
                       let actionElementId=sectionElement.actionData[0].elementId
                        if(layout.layoutType != 'GRID' && layoutSection.sectionFor === 'LIST'){
                            gridTableFieldInfoArray[`pfm${sectionObjId}_${sectionElement.elementName}_${actionElementId}`] = gridTableO;
                        } 
                        if(sectionElement.isHeaderAction === "N"){
                            if (columnDefinitions === '') {
                                columnDefinitions += await slickGrid.slickGridArrayFormation(sectionElement, sectionObjId,layout,appObject.offlineObjectDetails,hierarchy,baseCtrlObj,actionElementId);
                            } else {
                                columnDefinitions += `, ` + await slickGrid.slickGridArrayFormation(sectionElement, sectionObjId,layout,appObject.offlineObjectDetails,hierarchy,baseCtrlObj,actionElementId);
                            }
                        } 
                    } else if (sectionElement.elementType === 'ACTION' && sectionElement.actionType === 'USERASSIGNMENT') {
                        if (layoutSection.sectionFor === 'LIST' && sectionElement.isHeaderAction !== 'Y') {
                            gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, sectionElement, baseCtrlObj, layout);
                            gridTableFieldInfoArray[`pfm${sectionObjId}_${sectionElement.actionType}_${sectionElement.elementId}`] = gridTableO;
                            if (columnDefinitions === '') {
                                columnDefinitions += await slickGrid.slickGridArrayFormation(sectionElement, sectionObjId, layout, appObject.offlineObjectDetails, hierarchy, baseCtrlObj);
                            } else {
                                columnDefinitions += `, ` + await slickGrid.slickGridArrayFormation(sectionElement, sectionObjId, layout, appObject.offlineObjectDetails, hierarchy, baseCtrlObj);
                            }
                        }
                    }else if (sectionElement.elementType === 'ACTION' && sectionElement.actionType === 'DATA_CLONE'){
                        gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, sectionElement, baseCtrlObj,layout);
                       let actionElementId=sectionElement.actionData[0].elementId
                        if(layout.layoutType != 'GRID' && layoutSection.sectionFor === 'LIST'){
                            gridTableFieldInfoArray[`pfm${sectionObjId}_cspfmaction${sectionElement.elementId}`] = gridTableO;
                        } 
                        if(sectionElement.isHeaderAction === "N"){
                            if (columnDefinitions === '') {
                                columnDefinitions += await slickGrid.slickGridArrayFormation(sectionElement, sectionObjId,layout,appObject.offlineObjectDetails,hierarchy,baseCtrlObj,actionElementId);
                            } else {
                                columnDefinitions += `, ` + await slickGrid.slickGridArrayFormation(sectionElement, sectionObjId,layout,appObject.offlineObjectDetails,hierarchy,baseCtrlObj,actionElementId);
                            }
                        } 
                    } else if(sectionElement.uiType ==="RECORDASSOCIATION" && !lodash.isEmpty(sectionElement.recordAssociationMap) && recAssDetailViewFlag){
                        let gridTableDetailInfo = await listTableFormation.associtationTableColumnInfo(gridTableSkeleton, sectionElement, layout,appObject);                      
                        let associationType=baseCtrlObj.baseCtrlMap.get('RECORD_TYPE');
                        let RType=sectionElement.recordAssociationMap.recordAssociationOutputType;
                            if (gridTableDetails === '' && !associationType.includes(RType) ) {
                                gridTableDetails += `'pfm${sectionElement.objectId}_${sectionElement.fieldName}_${sectionElement.elementId}':${JSON.stringify(gridTableDetailInfo)}`
                            } else if(!associationType.includes(RType) ) {
                                    gridTableDetails += `,'pfm${sectionElement.objectId}_${sectionElement.fieldName}_${sectionElement.elementId}':${JSON.stringify(gridTableDetailInfo)}`
                            }
                            if (gridColumnDefinitions === ''  && !associationType.includes(RType) ) {
                                gridColumnDefinitions += await slickGrid.associtationColumnDefinition(sectionElement, layout,'',layoutSection.sectionFor);
                            } else if(!associationType.includes(RType) ){
                                    gridColumnDefinitions += "," + await slickGrid.associtationColumnDefinition(sectionElement, layout,'',layoutSection.sectionFor);
                            }
                        }else if(sectionElement.elementType==='ACTION' && (sectionElement.actionType ==='FILE_MANAGE' || sectionElement.actionType ==='CUSTOM')){
                            if((layout.layoutMode === 'LIST' || (layout.layoutMode==='VIEW'&& layout.layoutType === 'Grid_with_List')) && layoutSection.sectionFor=== 'LIST'){
                                gridTableO = await listTableFormation.dataTableArrayFormation(gridTableSkeleton, sectionElement, baseCtrlObj, layout,'','','',hierarchy.primary.objectName);
                                gridTableFieldInfoArray[`pfm${sectionObjId}_cspfmaction${sectionElement.elementId}`] = gridTableO;
                            }  
                            if (columnDefinitions === '') {
                                columnDefinitions += await slickGrid.slickGridArrayFormation(sectionElement, sectionObjId,layout,appObject.offlineObjectDetails,hierarchy,baseCtrlObj);
                            } else {
                                columnDefinitions += `, ` + await slickGrid.slickGridArrayFormation(sectionElement, sectionObjId,layout,appObject.offlineObjectDetails,hierarchy,baseCtrlObj);
                            }
                        } else if(sectionElement.elementType === 'ACTION' && sectionElement.actionType === 'MORE'){
                            if(layoutSection.sectionFor === 'LIST' && sectionElement.isHeaderAction !== 'Y') {
                                gridTableO = await listTableFormation.moreActionInfoJson(sectionElement, hierarchy, layout, layoutSection.sectionType, 'LIST');
                                gridTableFieldInfoArray[`pfm${sectionObjId}_moreaction_${sectionElement.elementId}`] = gridTableO;
                            
                                if (columnDefinitions === '') {
                                    columnDefinitions += await slickGrid.slickGridArrayFormation(sectionElement, sectionObjId,layout,appObject.offlineObjectDetails,hierarchy,baseCtrlObj);
                                } else {
                                    columnDefinitions += "," + await slickGrid.slickGridArrayFormation(sectionElement, sectionObjId,layout,appObject.offlineObjectDetails,hierarchy,baseCtrlObj);
                                }
                            }
                        }

                    if (layout.layoutType === 'Grid_with_List' && layout.layoutMode === 'VIEW') {
                        multiSelectAndCheckBoxValueMaking =`multiSelectAndCheckBoxValueMaking(values,mappingDetails){
    
                            var displayValue = [];
                            
                                for (const element of values) {
                                displayValue.push(mappingDetails[element]);
                                }
                            
                            if (displayValue.length > 0) {
                                return displayValue.join(", ");
                            } else {
                                return "";
                            }
                        }
                        @ViewChildren(MdePopoverTrigger, {}) sectionPopover: MdePopoverTrigger;`;

                    }
                    if (sectionElement.elementType === 'ACTION') {
                        if (sectionElement.hasOwnProperty('layoutActionInfoSet') && sectionElement.isHeaderAction === 'Y' && sectionElement.layoutActionInfoSet.length > 0) {
                            for (const actionInfoSet of sectionElement.layoutActionInfoSet) {
                                if ((actionInfoSet.processId !== '' && actionInfoSet.hasOwnProperty('processType'))&& actionInfoSet.layoutActionParameterSet.length > 0) {
                                    if (!childFetchInfoForWebService.hasOwnProperty(actionInfoSet.processId)) {
                                        childFetchInfoForWebService[actionInfoSet.processId] = [];
                                        sourceName[actionInfoSet.processId] = [];
                                        elementId[actionInfoSet.processId] = sectionElement.elementId;
                                    }
                                    childFetchInfoForWebService[actionInfoSet.processId].push(actionInfoSet);
                                    actionInfoSet.layoutActionParameterSet.forEach(data => {
                                        sourceName[actionInfoSet.processId].push({
                                            fieldName: data.targetFieldName,
                                            value: '',
                                            fieldId:data.targetFieldId
                                        });
                                    });
                                }
                            }
                        }
                        if ((sectionElement.actionType === 'VIEW'||sectionElement.actionType === 'EDIT')  && sectionElement.isRowActionEnable === 'Y' && ((layout.layoutType === 'Grid_with_List' && layout.layoutMode === 'LIST') || (layout.layoutType === 'List' && layout.layoutMode === 'LIST'))) {
                            viewIcon = sectionElement.actionType === 'VIEW'? true:false;
                            let actionInfo = '';
                            let actionData = sectionElement.actionData;
                            if (actionData.length > 0) {
                                actionInfo = actionData[0].actionInfo;
                            }
                            let buttonType = sectionElement.actionType === 'EDIT'?'EDITONCLICK':sectionElement.actionType;
                            let methodName = sectionElement.elementName + "_" + sectionElement.elementId;
                            await actionForAll.navAction(baseCtrlObj, buttonType, layoutSection.sectionElementSet, layoutgrp, methodName, JSON.parse(actionInfo), layout, sectionElement.elementId, '');
                        }
                        if ((sectionElement.actionType === 'VIEW' || sectionElement.actionType === 'EDIT') && sectionElement.isRowActionEnable === 'Y' && (layout.layoutType === 'Grid_with_List' && layout.layoutMode === 'VIEW')) {
                            let actionData = sectionElement.actionData;
                            if (actionData.length > 0) {
                                let actionInfo = JSON.parse(actionData[0]['actionInfo']);
                                let LayoutProperties = actionInfo.LayoutProperties;
                                let redirectionTypeName = '';
                                let redirectObjectId = '';
                                let popupModel = false;
                                for (let k = 0; k < LayoutProperties.length; k++) {
                                    if(LayoutProperties[k].propertyKey==="redirectionTo"){
                                        redirectionTypeName = LayoutProperties[k].fieldDetails[0].redirectionTypeName;
                                    } else if (LayoutProperties[k].propertyKey === "redirectionInputParam") {
                                        if (LayoutProperties[k].fieldDetails && LayoutProperties[k].fieldDetails.length > 0) {
                                            navigationParamsForDetailViewPage = [...navigationParamsForDetailViewPage, ...LayoutProperties[k].fieldDetails]
                                        }
                                    }else if(LayoutProperties[k].propertyKey === "primaryObject"){
                                        redirectObjectId = LayoutProperties[k].fieldDetails[0].value
                                    } else if(LayoutProperties[k].propertyKey ==='enablePopupModel'){
                                        popupModel = LayoutProperties[k].fieldDetails[0].value;
                                    }
                                }
                                let navInfo = `this.router.navigate(["/menu/${redirectionTypeName}"], {
                                    queryParams: itemTapNavigationParams,
                                    skipLocationChange: true
                                });`;
                                if (popupModel) {
                                    navInfo = `const dialogConfig = new MatDialogConfig()
                                    dialogConfig.data = {
                                      params: itemTapNavigationParams
                                    };
                                    dialogConfig.panelClass = 'cs-dialoguecontainer-large';
                                    this.dialog.open(${redirectionTypeName}, dialogConfig);
                                    `;
                                }
                                detailViewNav += `if (objectName === "pfm${redirectObjectId}") {
                                    ${sectionElement.actionType === 'EDIT'?`itemTapNavigationParams["action"] = "Edit"`:``}
                                    ${navInfo}
                                }`
                            }
                        }
                        if (sectionElement.actionType === 'NEW') {
                            let actionData = sectionElement.actionData;
                            if (actionData.length > 0 && actionData[0].hasOwnProperty("actionInfo")) {
                                let actionInfo = JSON.parse(actionData[0]['actionInfo']);
                                let isPopUpAddNavMethod=''
                                    let LayoutProperties = actionInfo.LayoutProperties;
                                        let redirectionTypeName = '';
                                        let enablePopupModel = false;
                                        let redirectObjectId = '';
                                        for (let k = 0; k < LayoutProperties.length; k++) {
                                            if(LayoutProperties[k].propertyKey=== "redirectionTo"){
                                                 redirectionTypeName = LayoutProperties[k].fieldDetails[0].redirectionTypeName;
                                            } else if (LayoutProperties[k].propertyKey === 'enablePopupModel') {
                                                 enablePopupModel = LayoutProperties[k].fieldDetails[0].value;
                                            }else if(LayoutProperties[k].propertyKey === 'primaryObject'){
                                                redirectObjectId = LayoutProperties[k].fieldDetails[0].value
                                            }
                                        }
                                      webHlListObj['entryPageA'][`pfm${redirectObjectId}`] = {};
                                      webHlListObj['entryPageA'][`pfm${redirectObjectId}`]["addActionRequired"]= true;
                                      webHlListObj['entryPageA'][`pfm${redirectObjectId}`]["addActionElementId"]= `${sectionElement.actionTagId}_preview`;
                                    if(enablePopupModel === true){
                                        isPopUpAddNavMethod=`
                                        const dialogConfig = new MatDialogConfig()
                                        dialogConfig.data = {
                                            params: {
                                                action: "Add",
                                                parentId: this.id,
                                                parentObj: JSON.stringify(this.dataObject['${hierarchy.primary.rootPath}']),
                                                parentFieldLabel: this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['label'],
                                                parentFieldValue: this.parentValue,
                                                parentName: this.tableName_pfm${hierarchy.primary.objectId},
                                                redirectUrl: redirectUrlForNav,
                                                enablePopUp: 'true'
                                            }
                                        };
                                        dialogConfig.panelClass = 'cs-dialoguecontainer-large'
                                        this.dialog.open(${redirectionTypeName}, dialogConfig);`
                                    }else{
                                        isPopUpAddNavMethod=`
                                        const navigationParameters = {
                                            action: "Add",
                                            parentId: this.id,
                                            parentObj: JSON.stringify(this.dataObject['${hierarchy.primary.rootPath}']),
                                            parentFieldLabel: this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['label'],
                                            parentFieldValue: this.parentValue, 
                                            parentName: this.tableName_pfm${hierarchy.primary.objectId},
                                            redirectUrl: redirectUrlForNav
                                        };
                                        this.router.navigate(['/menu/${redirectionTypeName}'], {
                                            queryParams: navigationParameters,
                                            skipLocationChange: true
                                        });
                                        `
                                    }
                                    addButtonNav += `
                                    if (this.objectRelationshipMapping[childObject['objectName']] === 'one_to_one' && this.dataObject['${hierarchy.primary.rootPath}'][childObject['objectName']+'s'].length>0) {
                                        this.appUtilityConfig.presentToast("Multiple Entry is prohibited as only one child should be against " + this.objectNameMapping['pfm0s']);
                                        return
                                    }
                                    if (childObject['objectName'] === 'pfm${redirectObjectId}') {
                                        if(this.dataObject['${hierarchy.primary.rootPath}'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']]){
                                            let getFieldType= this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldType'];
                                            if(getFieldType ==='MULTISELECT' || getFieldType ==='RADIO' ||getFieldType==='CHECKBOX'||getFieldType ==='DROPDOWN'){
                                                this.parentValue = this.multiSelectAndCheckBoxValueMaking(this.dataObject['${hierarchy.primary.rootPath}'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']],this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['mappingDetails'])
                                            }else if(getFieldType==='DATE'){
                                                this.parentValue = moment(new Date(this.dataObject['${hierarchy.primary.rootPath}'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']])).tz(this.appUtilityConfig.userTimeZone).format(this.appUtilityConfig.userDatePickerFormat);
                                            }else if(getFieldType==='TIMESTAMP'){
                                                this.parentValue = moment(new Date(this.dataObject['${hierarchy.primary.rootPath}'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']])).tz(this.appUtilityConfig.userTimeZone).format(this.appUtilityConfig.userDateTimePickerFormat);
                                            }else{
                                                this.parentValue = this.dataObject['${hierarchy.primary.rootPath}'][this.gridFieldInfo[Object.keys(this.gridFieldInfo)[0]]['fieldName']]
                                            }
                                        }
                                        ${isPopUpAddNavMethod}
                                    }`;
                                    addButtonNavPreview += `if (this.selectedObjectName === 'pfm${redirectObjectId}') {
                                        this.router.navigate(["/menu/${redirectionTypeName}"], {
                                          queryParams: addNavigationParams,
                                          skipLocationChange: true
                                        });
                                    }`
                                    var isOneToOne = await isOneToOneRelationship(sectionElement.objectId, hierarchy);
                                    if (isOneToOne) {
                                        addOneToOneCondition += `if (this.selectedObjectName === "pfm${redirectObjectId}") {
                                            if (this.childObjectsInfo && this.childObjectsInfo.length >= 1) {
                                                alert("You cannot add more than one additional info...");
                                                return;
                                            }
                                        }`
                                    }
                                // }
                            }
                        }else if(sectionElement.actionType === 'LIST'){
                            let actionData = sectionElement.actionData;
                            if((actionData.length > 0 && actionData[0].hasOwnProperty("actionInfo"))){
                                let actionInfo = JSON.parse(actionData[0]['actionInfo']);
                                    let LayoutProperties = actionInfo.LayoutProperties;
                                        let redirectionTypeName = '';
                                        for (let k = 0; k < LayoutProperties.length; k++) {
                                            if(LayoutProperties[k].propertyKey=== "redirectionTo"){
                                                 redirectionTypeName = LayoutProperties[k].fieldDetails[0].redirectionTypeName;
                                            }
                                            //  else if (LayoutProperties[k].propertyKey === 'enablePopupModel') {
                                            //      enablePopupModel = LayoutProperties[k].fieldDetails[0].value;
                                            // }else if(LayoutProperties[k].propertyKey === 'primaryObject'){
                                            //     redirectObjectId = LayoutProperties[k].fieldDetails[0].value
                                            // }
                                        }
                                        listButtonNav += `
                                        listButton_${sectionElement.elementId}_Onclick() {
                                            var redirectUrlForNav = '/menu/${layout.layoutName}';
                                            if (this.isPopUpEnabled) {
                                                this.dialogRef.close();
                                            }
                                            this.toastCtrl.dismiss();
                                            const queryParamsRouting = {};
                                            
                                          
                                        if (this.isPopUpEnabled) {
                                            if (this.appUtilityConfig.checkPageAlreadyInStack(this.redirectUrl)) {
                                                queryParamsRouting['redirectUrl'] = this.redirectUrl;
                                            }
                                        } else {
                                            if (!this.appUtilityConfig.checkPageAlreadyInStack("/menu/${redirectionTypeName}")) { 
                                                queryParamsRouting['redirectUrl'] = "/menu/${layout.layoutName}"
                                            }
                                        }
                                        this.router.navigate(["/menu/${redirectionTypeName}"], {
                                            queryParams: queryParamsRouting,
                                            skipLocationChange: true
                                        });
                                    }`
                            }
                        }else if(sectionElement.actionType === 'FILE_MANAGE' && layout.layoutMode!='LIST'){
                            let actionInfo = '';
                            let actionData = sectionElement.actionData;
                            if (actionData.length > 0) {
                                actionInfo = actionData[0].actionInfo;
                            }
                            await actionForAll.navAction(baseCtrlObj, sectionElement.actionType, layoutSection.sectionElementSet, layoutgrp, '', JSON.parse(actionInfo), layout, sectionElement.elementId);
                        }
                    }
                    if (sectionElement.uiType === 'TEXTAREA' || sectionElement.uiType === 'TEXT' || sectionElement.uiType === 'AUTONUMBER') {
                        if (queryFields === '') {
                            queryFields = `{
                                "fieldName": "${sectionElement.elementName}",
                                "child": [],
                                "mappingDetails": "",
                                "fieldType": "${sectionElement.uiType}"
                            }`;
                        } else {
                            queryFields += `, {
                                "fieldName": "${sectionElement.elementName}",
                                "child": [],
                                "mappingDetails": "",
                                "fieldType": "${sectionElement.uiType}"
                            }`;
                        }
                    }
                    if(sectionElement.uiType ==='FORMULA' && layout.layoutMode === 'VIEW'){
                        let displayFormula = `${sectionElement.formulaConfigJson.displayFormula}`;  
                        let replaceQuotesFormula = displayFormula.replace(/"/g, "'");
                        formulaVariable =`public pfm${sectionElement.objectId}${sectionElement.elementName}Formula = "${replaceQuotesFormula}";`
                        if(!formulaFields.includes(formulaVariable)){
                            formulaFields+=formulaVariable;
                        }
                    }
                    if (sectionElement.uiType === 'CURRENCY') {
                        let country =  sectionElement.country.replace(/ /g, '');
                        currencyImport.add(`import ${country} from '@angular/common/locales/${sectionElement.locale}';registerLocaleData(${country});`)
                    }                   
                    if (sectionElement.uiType === 'DROPDOWN' && sectionElement.isStatusWorkflowEnabled === 'Y' && sectionElement.isReadOnlyEnable != 'Y') {
                        let swfRootPath = sectionElement.rootPath.substring(0,sectionElement.rootPath.lastIndexOf("$$"));
                        fetchStatusWfl += `if (this.dataObject['${swfRootPath}'] && this.dataObject['${swfRootPath}']["${sectionElement.elementName}"] && this.${sectionElement.elementName}_${sectionElement.fieldId}_swList[this.dataObject['${swfRootPath}']["${sectionElement.elementName}"]]) {
                            this.${sectionElement.elementName}_${sectionElement.fieldId}_defaultStatus = this.${sectionElement.elementName}_${sectionElement.fieldId}_swList[this.dataObject['${swfRootPath}']["${sectionElement.elementName}"]].filter(item => {
                                return item['statusValue'] === this.dataObject['${swfRootPath}']["${sectionElement.elementName}"]
                            })[0]
                        } else {
                            this.${sectionElement.elementName}_${sectionElement.fieldId}_defaultStatus = this.${sectionElement.elementName}_${sectionElement.fieldId}_swList[this.${sectionElement.elementName}_${sectionElement.fieldId}_defaultStatusValue][0];
                        }`
                        fetchStatusWflForPreview += `if (this.dataObject['${swfRootPath}'] && this.dataObject['${swfRootPath}']["${sectionElement.elementName}"] && this.${sectionElement.elementName}_${sectionElement.fieldId}_swList[this.dataObject['${swfRootPath}']["${sectionElement.elementName}"]]) {
                            this.${sectionElement.elementName}_${sectionElement.fieldId}_defaultStatus = this.${sectionElement.elementName}_${sectionElement.fieldId}_swList[this.dataObject['${swfRootPath}']["${sectionElement.elementName}"]].filter(item => {
                                return item['statusValue'] === this.dataObject['${swfRootPath}']["${sectionElement.elementName}"]
                            })[0]
                        } else {
                            this.${sectionElement.elementName}_${sectionElement.fieldId}_defaultStatus = this.${sectionElement.elementName}_${sectionElement.fieldId}_swList[this.${sectionElement.elementName}_${sectionElement.fieldId}_defaultStatusValue][0];
                        }`
                        fieldApproverType[sectionElement.fieldId]="";
                        // workFlowMapping[sectionElement.fieldId] = sectionElement.label;
                        statusWorkFlowVariables += `public ${sectionElement.elementName}_${sectionElement.fieldId}_defaultStatusValue = '${sectionElement.statusWorkflowDefaultValue}';
                        public ${sectionElement.elementName}_${sectionElement.fieldId}_defaultStatus = {};
                        public ${sectionElement.elementName}_${sectionElement.fieldId}_status = {};
                        public ${sectionElement.elementName}_statusworkflow_${sectionElement.fieldId} = '';
                        public ${sectionElement.elementName}_${sectionElement.fieldId}_swList = {};`
                        statusWorkFlowFields +=`this.${sectionElement.elementName}_${sectionElement.fieldId}_swList = this.pfmObjectConfig.objectConfiguration['pfm${sectionElement.objectId}']['workflow']['${sectionElement.elementName}']['configJson'];
                                                this.${sectionElement.elementName}_statusworkflow_${sectionElement.fieldId} = this.pfmObjectConfig.objectConfiguration['pfm${sectionElement.objectId}']['workflow']['${sectionElement.elementName}']['fieldId'];`
                        statusWorkFlowCommonMethods = `getApprovalState(event) {
                            if(event['fieldId']){
                                this.fieldApproverType[event['fieldId']] = this.approverType = event['approverType']
                            }
                        }
                        statusChange(event, selectedStatusField) {
                            if (selectedStatusField === undefined) {
                                selectedStatusField = {}
                            }
                            selectedStatusField['statusLabel'] = event['selectedStatus']['statusLabel'];
                            selectedStatusField['statusValue'] = event['selectedStatus']['statusValue'];
                            selectedStatusField['statusType'] = event['selectedStatus']['statusType'];
                           ${layout.layoutType === 'Grid_with_List' && layout.layoutMode === 'VIEW'? `this.slickgridUtils.approveAction(selectedStatusField, event['workFlowUserApprovalStatusDataObject'], event['comments'],this.dataSource)`: `this.approveAction(selectedStatusField, event['workFlowUserApprovalStatusDataObject'], event['comments'])`} 
                        }
                        `
                    }
                }
                
                if(!(layout.layoutType === 'Grid' && layout.isDrawerEnable === 'Y')){
                    workFlowMappingVal =`private workFlowMapping = ${JSON.stringify(workFlowMapping)};`
                    fieldApproverTypeVal=`private fieldApproverType = ${JSON.stringify(fieldApproverType)};`
                }
               
                skeletonLoading=`public isSkeletonLoading = true;`
           
                variables += `
                public isPopUpEnabled = false;
                private flatpickrListeners: Array<{
                    element: HTMLElement;
                    eventType: string;
                    handler: (event) => any | void;
                    option: any;
                }> = [];
                resultList: Array<any> = [];
                public slickgridResultList = [];
                public filteredResultList = [];
                public filteredResultListTemp = [];
                formulaAndRollupFieldInfo = {}
                public searchFlag = false;
                public searchTerm: any = "";
                public isAssociationDisplayRefreshRequired : Boolean;
                public slickGridItemClickCount = 0;
                public isValidationRequired = true;
                private approverType = "";
                public isCustomActionProcessing = false;
                public customActionConfiguration = {};            
                public flatpickrInstance;
                ${skeletonLoading}
                ${statusWorkFlowVariables}
                private currentStatusWorkFlowActionFieldId;
                public WorkFlowUserApprovalStatusDataObject = {};
                ${workFlowMappingVal}
                ${fieldApproverTypeVal}
                ${dataUpsertVariable}
                public filteredEventTriggeredList = [];
                public parentValue;
                private tableName_pfm${hierarchy.primary.objectId} = 'pfm${hierarchy.primary.objectId}';              
                public errorMessageToDisplay = "No Records";
                public eventsTriggeredList: Array<any> = [];
                public objectHierarchyJSON: ObjectHierarchy = ${layout.objectHierarchySet[0].hierarchyJsonContent};
                ${ layout.layoutMode === 'LIST' && searchFlag &&layout.hasOwnProperty('conditionalValidationSet') && layout.conditionalValidationSet !==0 ? `public conditionalValidationJson: ConditionalValidation = {
                    layoutId: "${layout.layoutId}",
                    layoutType: 'List',
                    dataObject: {},
                    objectHierarchy: this.objectHierarchyJSON,
                    primaryTraversalPath: '${hierarchy.primary.rootPath}',
                    pickListValues: [],
                    validationRules: this.validationRules,
                    conditionalValidationRelationshipDataObject: {},
                    conditionalValidationObjectHierarchy: this.conditionalValidationRelationshipObjectHierarchy
                }`: ''}
                public layoutDataRestrictionSet = ${JSON.stringify(sectionUserDataRestrictionSet)};
                public layoutId = "${layoutSection.layoutId}";
                public layoutName = "${layout.layoutName}";
                public dataSource = "${dbVar.value}";
                public searchQueryForDesignDoc = "";
                customAlert: any;
                private dbprovider;
                public sectionDependentObjectList: {[key: string]: DependentObjectListType}= ${JSON.stringify(sectionDependentObjectList)};
                public tempColumnDefinitions = [];
                public dependentObjectList : DependentObjectListType= ${JSON.stringify(dependentObjectList)};
                public isLoading = false;`
                variables+=`${mailActionInfo}`;
                workFlowActionConfig = `public workFlowActionConfig = {${workflowActionInfoSet}};`
                variables+=`${workFlowActionConfig}`
                if(layoutSection.sectionFor==='LIST' && !(layout.layoutMode==='VIEW'&& layout.layoutType === 'Grid_with_List') ){
                    variables+=`${wfApprovalActionList} 
                    public inlineEditBoolObj = {
                        isNavigated : false,
                        isDoubleClicked : false
                    }                
                    public paginationConfigInfo=${paginationConfigInfo?paginationConfigInfo:{}};`
                }
                if( layout.layoutType !== 'Grid'){
                    variables+=`
                    public selectedRows = [];
                    public isMailActionAvailable = ${isMailActionAvailable};
                    public isWorkflowActionAvailable = ${isWorkflowActionAvailable};`
                }
                methods += `getChangedObjectIndex(array, modifiedData, key) {
                    return lodash.findIndex(array, item => {
                        return item[key] === modifiedData[key];
                    }, 0)
                }
                ${multiSelectAndCheckBoxValueMaking}`;
                baseCtrlObj.baseCtrlMap.set('CURRENCY_IMPORT', currencyImport);
                if(layoutgrp.hasOwnProperty('isBalloonToolTipModeEnable') && layoutgrp.isBalloonToolTipModeEnable ==='Y') {
                    balloonUiInputMethod = `@Input() set setIdVal(balloonData: String) {
                        if (balloonData['id']) {
                          this.id = balloonData['id'];
                        }
                        if (balloonData['balloonCallFromList']) {
                          this.balloonCallingFromList = balloonData['balloonCallFromList'];
                        }
                        if(balloonData['redirectUrlForNav']){
                          this.redirectUrl = balloonData['redirectUrlForNav'];
                        }
                        if(balloonData['isPopUpEnabled']){
                          this.isPopUpEnabled = balloonData['isPopUpEnabled'];
                        }
                        this.initializeStatusWorkFlowFields();
                        this.fetchSelectedObject();
                      }
                      public balloonCallingFromList = false;`
                }
                if (layout.layoutType === 'Grid_with_List' && searchFlag && layout.layoutMode === 'LIST') {
                    rowArray=[];
                    columnArray={};
                    matrixElementId='';
                    for (let i = 0; i < layout.layoutSectionSet.length; i++) {
                        let layoutSectionSet = layout.layoutSectionSet[i];
                            for(let j = 0;j<layoutSectionSet.sectionElementSet.length;j++){
                                let sectionElement = layoutSectionSet.sectionElementSet[j]
                                if(sectionElement.actionType === 'MATRIX'){
                                    matrixEnabled = true;
                                    matrixArray = await actionForAll.matrixAction(sectionElement,offlineObjectDetails,hierarchy,gridTableSkeleton,layout,baseCtrlObj,layoutSection);
                                    rowArray = matrixArray[1];
                                    columnArray = matrixArray[0][0];
                                    matrixElementId =sectionElement.actionTagId
                                    const {
                                        actionData,
                                        elementObjectHierarchyJson
                                    } = sectionElement;
                                    const actionInfo = JSON.parse(actionData[0]['actionInfo']);
                                    actionInfo.LayoutProperties.forEach(property => {
                                        if (property && property.propertyKey === "overrideObjectSelection") {
                                            matrixHierarchyJson = property.fieldDetails[0]['value'] ?  elementObjectHierarchyJson : null;
                                        }
                                    });
                                }
                            }
                    }
                    if (layoutSection.sectionFor === 'LIST') {
                        let rowActionFlag = layoutSection.sectionElementSet.filter(pro => 
                            pro.elementType === 'ACTION' && pro.isRowActionEnable === 'Y' && (pro.actionType === "VIEW"|| pro.actionType === "EDIT")
                        )
                        variables += `
                        public itemCount: number;
                        public upsertHeaderFlag = ${upsertFlag}
                        public __${hierarchy.primary.objectName}$tableName = this.objectTableMappingObject.mappingDetail['${hierarchy.primary.objectName}'];
                        public gridId =  'cspfm_grid_' + this.layoutId + '_' + this.__${hierarchy.primary.objectName}$tableName;
                        public gridContainerId = 'cspfm_grid_container_' + this.layoutId + '_' + this.__${hierarchy.primary.objectName}$tableName;       
                        public matrixGridId =  'cspfm_matrix_grid_' + this.layoutId + '_' + this.__${hierarchy.primary.objectName}$tableName;
                        public matrixGridContainerId =  'cspfm_matrix_grid_container_' + this.layoutId + '_' + this.__${hierarchy.primary.objectName}$tableName;
                        ${refObjVar}
                        ${comboVar}
                        ${dynaObjectslookup}
                        public associationConfiguration = {};
                        public associationTableColumnInfo: { [key: string]: { [key: string]: { [key: string]: FieldInfo } } } = {${gridTableDetails}};
                        public tableColumnInfo = {[this.__${hierarchy.objectMapping[sectionObjId]}$tableName] : ${JSON.stringify(gridTableFieldInfoArray)}};
                        public associationColumnDefinitions =  {${gridColumnDefinitions}}
                        public sectionObjectDetails: { [objectName: string]: SectionObjectDetail } = {
                            [this.__${hierarchy.primary.objectName}$tableName] : {
                                'groupingColumns':[],
                                'isRowClickDisabled':${rowActionFlag.length > 0?false:true},
                                'dataFetchMode': '${layoutSection.dataFetchMode}',
                                'isExpanded':'${layoutSection.sectionFormat}',
                                'isMatrixEnabled':${matrixEnabled},
                                'matrixConfig': {
                                    'matrixActionElementId': '${matrixElementId}',
                                    'objectHierarchy': ${matrixHierarchyJson ? matrixHierarchyJson : null},
                                    'columnTitle': ${matrixEnabled?JSON.stringify(columnArray):null},
                                    'rowValues': ${matrixEnabled?JSON.stringify(rowArray):'[]'},
                                    'selectionLimit': ${matrixEnabled?matrixArray[2]:null},
                                    'displayInfo': {
                                        'currentMode': 'list',
                                        'gridOptions': this.cspfmSlickgridMatrix.getMatrixGridOptions(this.matrixGridContainerId,''),
                                        'columns': [],
                                        'dataset': []
                                    }
                                }
                            }
                        }`
                        let dynaValues = {
                            variables,
                            listTableFieldInfoArray,
                            columnDefinitions,
                            gridOption,
                            viewIcon,
                            queryFields,
                            moreActionJsonFormation,
                            moreActionSelected,
                            dataCloneAssignmentOnClick,
                            openComponentForDataClone,
                            userAssignmentOnClick,
                            workFlowInfoList
                        }
                        await webSearchListController.listMethods(layoutgrp, layout, baseCtrlObj, layoutSection, appObject, hierarchy, dbVar, dynaValues,conditionFormatting);
                    }
                } else if (layout.layoutType === 'List' && layout.layoutMode === 'LIST') {
                    rowArray=[];
                    columnArray={};
                    matrixElementId = '';
                    for (let i = 0; i < layout.layoutSectionSet.length; i++) {
                        let layoutSectionSet = layout.layoutSectionSet[i];
                            for(let j = 0;j<layoutSectionSet.sectionElementSet.length;j++){
                                let sectionElement = layoutSectionSet.sectionElementSet[j]
                                if(sectionElement.actionType === 'MATRIX'){
                                    matrixEnabled = true;
                                    matrixArray = await actionForAll.matrixAction(sectionElement,offlineObjectDetails,hierarchy,gridTableSkeleton,layout,baseCtrlObj,layoutSection);
                                    rowArray = matrixArray[1];
                                    columnArray = matrixArray[0][0];
                                    matrixElementId =sectionElement.actionTagId
                                    const {
                                        actionData,
                                        elementObjectHierarchyJson
                                    } = sectionElement;
                                    const actionInfo = JSON.parse(actionData[0]['actionInfo']);
                                    actionInfo.LayoutProperties.forEach(property => {
                                        if (property && property.propertyTitle === "Override Object Selection") {
                                            matrixHierarchyJson = property.fieldDetails[0]['value'] ?  elementObjectHierarchyJson : null;
                                        }
                                    });
                                }
                            }
                    }
                    if (layoutSection.sectionFor === 'LIST') {
                        let rowActionFlag = layoutSection.sectionElementSet.filter(pro => 
                            pro.elementType === 'ACTION' && pro.isRowActionEnable === 'Y' && (pro.actionType === "VIEW"|| pro.actionType === "EDIT")
                        )
                        variables += `
                        public itemCount: number;
                        public __${hierarchy.primary.objectName}$tableName = this.objectTableMappingObject.mappingDetail['${hierarchy.primary.objectName}'];
                        public gridId =  'cspfm_grid_' + this.layoutId + '_' + this.__${hierarchy.primary.objectName}$tableName;
                        public gridContainerId = 'cspfm_grid_container_' + this.layoutId + '_' + this.__${hierarchy.primary.objectName}$tableName;       
                        public matrixGridId =  'cspfm_matrix_grid_' + this.layoutId + '_' + this.__${hierarchy.primary.objectName}$tableName;
                        public matrixGridContainerId =  'cspfm_matrix_grid_container_' + this.layoutId + '_' + this.__${hierarchy.primary.objectName}$tableName;
                        ${refObjVar}
                        ${comboVar}
                        ${dynaObjectslookup}
                        public associationConfiguration = {};
                        public associationTableColumnInfo: { [key: string]: { [key: string]: { [key: string]: FieldInfo } } } = {${gridTableDetails}};
                        public tableColumnInfo = {[this.__${hierarchy.objectMapping[sectionObjId]}$tableName] : ${JSON.stringify(gridTableFieldInfoArray)}};
                        public associationColumnDefinitions = {${gridColumnDefinitions}};
                        public upsertHeaderFlag = ${upsertFlag}
                        public sectionObjectDetails: { [objectName: string]: SectionObjectDetail } = {
                            [this.__${hierarchy.primary.objectName}$tableName] : {
                                'groupingColumns':[],
                                'isRowClickDisabled':${rowActionFlag.length > 0?false:true},
                                'dataFetchMode': '${layoutSection.dataFetchMode}',
                                'isExpanded':'${layoutSection.sectionFormat}',
                                'isMatrixEnabled':${matrixEnabled},
                                'matrixConfig': {
                                    'matrixActionElementId': '${matrixElementId}',
                                    'objectHierarchy': ${matrixHierarchyJson ? matrixHierarchyJson : null},
                                    'columnTitle': ${matrixEnabled?JSON.stringify(columnArray):null},
                                    'rowValues': ${matrixEnabled?JSON.stringify(rowArray):'[]'},
                                    'selectionLimit': ${matrixEnabled?matrixArray[2]:null},
                                    'displayInfo': {
                                        'currentMode': 'list',
                                        'gridOptions': this.cspfmSlickgridMatrix.getMatrixGridOptions(this.matrixGridContainerId,''),
                                        'columns': [],
                                        'dataset': []
                                    }
                                }
                            }
                        }`
                        let dynaValues = {
                            variables,
                            listTableFieldInfoArray,
                            columnDefinitions,
                            gridOption,
                            viewIcon,
                            queryFields,
                            moreActionJsonFormation,
                            moreActionSelected,
                            userAssignmentOnClick,
                            dataCloneAssignmentOnClick,
                            openComponentForDataClone,
                            workFlowInfoList
                        }
                        await webListController.webListMethods(layoutgrp, layout, baseCtrlObj, layoutSection, appObject, hierarchy, dbVar, dynaValues ,conditionFormatting);
                    }
                } else if (layout.layoutType === 'Grid_with_List' && layout.layoutMode === 'VIEW') {
                    let sectionObjectDetails={};
                    let sectionObjectVar=``;
                    let reportVar = '';
                    let printVar = '';
                    variables+=`public isnavigated = false;public isdblclicked = false;public groupingColumns = [];`
                    for (let sect = 0; sect < layout.layoutSectionSet.length; sect++) {
                        let layoutSections = layout.layoutSectionSet[sect];
                        for (var offs = 0; offs <offlineObjectDetails.length; offs++) {
                            if (offlineObjectDetails[offs].objectId === layoutSections.objectId) {
                                var objectName = offlineObjectDetails[offs].objectName
                            }
                        }    
                        let objKey = `__${objectName}$tableName`;
                        if (layoutSections["sectionType"] === "HORIZONTAL") {
                            objectMapping[`pfm${layoutSections['objectId']}s`] = layoutSections['title'];
                        }
                        if(layoutSections.sectionFor ==='LIST') {
                            const reportInput = [];
                            let rowActionFlag = false;
                            let reportString = '';
                            const printInput = [];
                            let printString = '';
                            matrixArray=[];
                            matrixEnabled=false;
                            let columnGrid='';
                            let countGrid = 0;
                            let mailAction;
                            let layoutSectionObjId = layoutSections.objectId ? layoutSections.objectId : hierarchy.primary.objectId;
                            for(let a =0;a<layoutSections.sectionElementSet.length;a++){
                                let ele =layoutSections.sectionElementSet[a]
                                const {
                                    elementType,
                                    isHeaderAction,
                                    actionType,
                                    actionData,
                                    elementId: actionEleId,
                                    elementObjectHierarchyJson
                                } = ele;
                                matrixElementId = '';
                                if(actionType==='MATRIX' || actionType==='MAIL'){
                                    slickgridSelectOptionEnabled=true;
                                }
                                if(actionType==='MAIL'){
                                    let actionInfoInMail=JSON.stringify(JSON.parse(ele.actionData[0].actionInfo));
                                    isEmailActionEnabled=true;
                                    mailAction=` 'slickgridSelectOptionEnabled':${slickgridSelectOptionEnabled},
                                    'isEmailActionEnabled':${isEmailActionEnabled},
                                    'emailActionConfig':${actionInfoInMail},`
                                    
                                }
                                if (elementType === 'ACTION' && isHeaderAction === 'Y') {
                                    const propertyInfo = {
                                        isVisiblePageData: 'Y',
                                        reportFormat: '',
                                        templateName: '',
                                    };
                                    if (actionType === 'REPORT' || actionType === 'PRINTER') {
                                        const reportAction = actionType === 'REPORT' ? 'View' : 'Print';
                                        const actionInfo = JSON.parse(actionData[0]['actionInfo'])
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
                                        propertyInfo['elementId'] = actionEleId;
                                        propertyInfo['hierarchyJson'] = elementObjectHierarchyJson ? elementObjectHierarchyJson : {};
                                        propertyInfo["isLoading"] = false;
                                        if (actionType === 'REPORT') {
                                            reportInput.push(actionEleId);
                                        } else if (actionType === 'PRINTER') {
                                            printInput.push(actionEleId);
                                        }
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
                                        if (actionType === 'REPORT') {
                                            if (reportVar === '') {
                                                reportVar = jsonVar;
                                            } else {
                                                reportVar += `, ${jsonVar}`;
                                            }
                                        } else {
                                            if (printVar === '') {
                                                printVar = jsonVar;
                                            } else {
                                                printVar += `, ${jsonVar}`;
                                            }
                                        }
                                    } else if(actionType === 'MATRIX') {
                                        matrixEnabled = true;
                                        matrixElementId =ele.actionTagId
                                        matrixArray =  await actionForAll.matrixAction(ele,offlineObjectDetails,hierarchy,gridTableSkeleton,layout,baseCtrlObj,layoutSections)
                                        const actionInfo = JSON.parse(actionData[0]['actionInfo']);
                                        actionInfo.LayoutProperties.forEach(property => {
                                            if (property && property.propertyTitle === "Override Object Selection") {
                                                matrixHierarchyJson = property.fieldDetails[0]['value'] ?  elementObjectHierarchyJson : null;
                                            }
                                        });

                                    }
                                }
                                if(ele.elementType === 'FIELD'){
                                    if(countGrid === 0){
                                        if(ele.uiType === 'ROLLUPSUMMARY'){
                                              columnGrid = `this.tableColumnInfo['pfm${layoutSectionObjId}']['pfm${ele.objectId}_${ele.elementName}__r_${ele.elementId}']['prop']`
                                          } else if(ele.uiType === 'FORMULA'){
                                              columnGrid = `this.tableColumnInfo['pfm${layoutSectionObjId}']['pfm${ele.objectId}_${ele.elementName}__f_${ele.elementId}']['prop']`
                                          } else {
                                             columnGrid = `this.tableColumnInfo['pfm${layoutSectionObjId}']['pfm${ele.objectId}_${ele.elementName}_${ele.elementId}']['prop']`
                                        }  
                                         countGrid++;
                                    }                              
                                }
                                if (ele.isRowActionEnable === 'Y'){
                                    rowActionFlag = true;
                                  }
                            }
                            if (!sectionObjectDetails.hasOwnProperty(objKey)) {
                                sectionObjectDetails[objKey]={};
                            }
                            if (!sectionObjectDetails[objKey].hasOwnProperty('groupingColumns')) {
                                sectionObjectDetails[objKey]['groupingColumns']=[];
                            }
                            if (!sectionObjectDetails[objKey].hasOwnProperty('sortByColumns')) {
                                sectionObjectDetails[objKey]['sortByColumns']=[];
                            }

                            if(layoutSections.dataFetchMode !== ''){
                                sectionObjectDetails[objKey]['dataFetchMode'] = layoutSections.dataFetchMode;
                            } else {
                                sectionObjectDetails[objKey]['dataFetchMode'] = 'Batch';
                            }
                            if(layoutSections.sectionFormat !== ''){
                                sectionObjectDetails[objKey]['isExpanded'] = layoutSections.sectionFormat;
                            }
                            if(layoutSections.elementPropertySet !== ''){ 
                                let elementPropertySet = JSON.parse(layoutSections.elementPropertySet);
                                let groupByFields = elementPropertySet.hasOwnProperty('groupByFields') ? elementPropertySet['groupByFields'] : [];
                                let groupingColumns = groupByFields.sort((x, y) => x.sequence - y.sequence); 
                                let shorter=``;
                                let sortByFields = elementPropertySet.hasOwnProperty('sortByFields') ? elementPropertySet['sortByFields'] : [];
                                let sortByCol = sortByFields.sort((x, y) => x.sequence - y.sequence);
                                for(let i = 0; i < sortByCol.length; i++){
                                    let shortFieldName=''
                                    if(sortByCol[i].fieldType === 'FORMULA'){
                                        shortFieldName=`pfm${sortByCol[i].objectId}_${sortByCol[i].fieldName}__f_${sortByCol[i].elementId}`
                                    } else if(sortByCol[i].fieldType === 'ROLLUPSUMMARY'){
                                        shortFieldName=`pfm${sortByCol[i].objectId}_${sortByCol[i].fieldName}__r_${sortByCol[i].elementId}`
                                    } else{
                                        shortFieldName=`pfm${sortByCol[i].objectId}_${sortByCol[i].fieldName}_${sortByCol[i].elementId}`
                                    }
                                    let columnId=`this.tableColumnInfo['pfm${layoutSectionObjId}']['${shortFieldName}']['prop']`
                                     if (columnId === '') {
                                         shorter = ` {
                                            columnId: ${columnGrid !=''? columnGrid :`''`},
                                            direction: 'ASC'
                                         },`
                                    } else {
                                         shorter += `{
                                            'columnId':${columnId},
                                            'direction':'${sortByCol[i].sequenceType}'
                                         },`
                                    } 
                                }                          
                                sectionObjectDetails[objKey]['groupingColumns']=JSON.stringify(groupingColumns);
                                sectionObjectDetails[objKey]['sortByColumns']=`[${shorter}]`
                            } else {
                                sectionObjectDetails[objKey]['groupingColumns']=`[]`;
                                sectionObjectDetails[objKey]['sortByColumns']=`[{
                                    columnId: ${columnGrid !=''? columnGrid :`''`},
                                    direction: 'ASC'
                                }]`
                            }
                            if (reportInput.length > 0) {
                                reportString = `'reportInput': ${JSON.stringify(reportInput)},`;
                            }
                            if (printInput.length > 0) {
                                printString = `'printInput': ${JSON.stringify(printInput)},`;
                            }
                            let sectionUserDataRestrictionSet1=[];
                            let sectionCriteria=(layoutSections.hasOwnProperty('sectionCriteriaQueryConfig')&&layoutSections.hasOwnProperty('isSectionCriteriaEnabled')&&layoutSections['isSectionCriteriaEnabled']==='Y'&&layoutSections['sectionCriteriaQueryConfig'][0]!='undefined')?layoutSections['sectionCriteriaQueryConfig']:{}
                            var sectionCriteriaRestriction=(layoutSections.hasOwnProperty('sectionUserDataRestrictionSet')&&layoutSections.hasOwnProperty('isSectionCriteriaEnabled')&&layoutSections['isSectionCriteriaEnabled']==='Y'&&layoutSections.sectionUserDataRestrictionSet.length!=0)?layoutSections.sectionUserDataRestrictionSet:[]
                            if (sectionCriteriaRestriction != undefined && layoutSections.sectionUserDataRestrictionSet.length != 0) {
                                let sectionDataRestriction = {
                                    "restrictionType": layoutSections.sectionUserDataRestrictionSet[0].restrictionType,
                                    "restrictionLevel": layoutSections.sectionUserDataRestrictionSet[0].restrictionLevel
                                }
                                sectionUserDataRestrictionSet1.push(sectionDataRestriction);
                            }
                            sectionObjectVar +=`
                                [this.${objKey}]:{
                                    'groupingColumns':${sectionObjectDetails[objKey]['groupingColumns']},
                                    'isRowClickDisabled':${rowActionFlag === false?true:false},
                                    'dataFetchMode':'${sectionObjectDetails[objKey]['dataFetchMode']}',
                                    'isExpanded':'${sectionObjectDetails[objKey]['isExpanded']}',
                                    'isMatrixEnabled':${matrixEnabled},
                                    'sectionElementId': '${layoutSection.sectionElementTagId}_preview',
                                    'sortByColumns':${sectionObjectDetails[objKey]['sortByColumns']},
                                    ${reportString}
                                    ${printString}
                                    ${mailAction ? mailAction:''}
                                    'matrixConfig': {
                                        'matrixActionElementId': '${matrixElementId}',
                                        'objectHierarchy': ${matrixHierarchyJson ? matrixHierarchyJson : null},
                                        'columnTitle': ${matrixEnabled?JSON.stringify(matrixArray[0][0]):null},
                                        'rowValues': ${matrixEnabled?JSON.stringify(matrixArray[1]):'[]'},
                                        'selectionLimit': ${matrixEnabled?matrixArray[2]:null},
                                        'displayInfo': {
                                            'currentMode': 'list',
                                            'gridOptions': this.cspfmSlickgridMatrix.getMatrixGridOptions(this.matrixGridContainerId,this.${objKey}),
                                            'columns': [],
                                            'dataset': []
                                        }
                                    },
                                    'criteriaQueryConfig':{
                                        'queryConfig':  ${JSON.stringify(sectionCriteria)} ,                                   
                                            "junctionDataObjects": {},
                                            "relationalObjectIds": [],
                                            "criteriaQuery": "" 
                                    },                                    
                                    "sectionUserDataRestrictionSet":${JSON.stringify(sectionUserDataRestrictionSet1)}                                                                        
                                },`
                        }
                    }
                    if (layoutSection.sectionFor === 'GRID') {
                        if (isPreviewRequired) {
                            let constructurVlauesPreview = {
                                fetchStatusWflForPreview
                            };
                            var constructorValueForPreview = await gridListViewController.gridListPreviewConstructor(baseCtrlObj, layout, appObject, layoutgrp, searchFlag, dbVar, hierarchy, constructurVlauesPreview,ImportDatas);
                            let listPreviewVals = baseCtrlObj.baseCtrlMap.get("WEB_HL_LIST_PREVIEW");
                            listPreviewVals.constructor = constructorValueForPreview;
                            baseCtrlObj.baseCtrlMap.set("WEB_HL_LIST_PREVIEW", listPreviewVals);
                            let dynavalues = {
                                fetchStatusWflForPreview,
                                requiredColumnForUpsert,
                                statusWorkFlowFields,
                                fetchActionUpsertInfo,
                                conditionFormatting,
                                reportGenerationCode,
                                traversalPath,
                                moreActionJsonFormation,
                                moreActionSelected,
                                userAssignmentViewMethods,
                                workFlowInfoList,
                                showBalloonLayoutOnMouseOverAndOnClick
                            };
                            await gridListViewController.listPreviewMethods(layoutgrp, layout, baseCtrlObj, layoutSection, appObject, hierarchy, dbVar, dynavalues);
                        }
                        baseCtrlObj.baseCtrlMap.set('WEB_HL_LIST_OBJ', webHlListObj);
                        let dynaValues = {
                            variables,
                            requiredColumnForUpsert,
                            fetchActionUpsertInfo,
                            fetchInfoAction,
                            methods,
                            gridTableFieldInfoArray,
                            statusWorkFlowFields,
                            statusWorkFlowCommonMethods,
                            fetchStatusWfl,
                            conditionFormatting,
                            isHiddenEnabledValue,
                            traversalPath,
                            dataCloneClickAction,
                            moreActionJsonFormation,
                            moreActionSelected,
                            comboVar,
                            userAssignmentViewMethods,
                            workFlowInfoList,
                            showBalloonLayoutOnMouseOverAndOnClick
                        };
                        await gridListViewController.gridMethods(layoutgrp, layout, baseCtrlObj, layoutSection, appObject, hierarchy, dbVar, dynaValues ,objectMapping,formulaFields, isPreviewRequired);
                    } else if (layoutSection.sectionFor === 'LIST') {
                        let sectionWiseIdArray = []
                        let sectionresultCount = 0
                        let sectionalFetchMappingJson = {};                        
                        Object.keys(sourceName).forEach(procId => {
                            sectionalFetchMappingJson = {
                                fetchActionInfo: {
                                    processId: Number(procId),
                                    processType: childFetchInfoForWebService[procId][0]['processType'],
                                    actionType: "",
                                    paramValue: 'SECTIONELEMENT',
                                    userSearchParams: {
                                        user_parameters: sourceName[procId]
                                    }
                                },
                                layoutId: Number(elementId[procId]),
                                dataSource: dbVar.value
                            }
                        });
                        if(layoutSection.dataFetchMode !== ''){
                            dataFetchMode =`public dataFetchMode: 'Full' | 'Batch' | 'OnClickBatch' = '${layoutSection.dataFetchMode}';`
                        }else {
                            dataFetchMode =`public dataFetchMode: 'Full' | 'Batch' | 'OnClickBatch' = 'Batch';`
                        }
                        sectionalFetchJson["sectionWiseIdArray"][`pfm${sectionObjId}`] = sectionWiseIdArray
                        sectionalFetchJson["sectionresultCount"][`pfm${sectionObjId}`] = sectionresultCount
                        sectionalFetchJson["sectionalFetchMapping"][`pfm${sectionObjId}`] = sectionalFetchMappingJson;
                        sectionalFetchJson["navigationParamsForDetailViewPage"][`pfm${sectionObjId}`] = navigationParamsForDetailViewPage;
                        webHlListObj.detailViewNav += detailViewNav;
                        webHlListObj.addButtonNav += addButtonNav;
                        webHlListObj.listButtonNav += listButtonNav;
                        webHlListObj.addButtonNavPreview += addButtonNavPreview;
                        webHlListObj.addOneToOneCondition += addOneToOneCondition;
                        if(!lodash.isEmpty(webHlListObj.associationTableColumnInfo)){
                            webHlListObj.associationTableColumnInfo +=!lodash.isEmpty(gridTableDetails) ? ","+gridTableDetails : '';
                            webHlListObj.associtationColumnDefinition+= !lodash.isEmpty(gridColumnDefinitions) ? "," +gridColumnDefinitions: '';  
                        }else{
                            webHlListObj.associationTableColumnInfo +=!lodash.isEmpty(gridTableDetails) ? gridTableDetails : '';
                            webHlListObj.associtationColumnDefinition+= !lodash.isEmpty(gridColumnDefinitions) ? gridColumnDefinitions: '';
                        }
                        webHlListObj.tableColumnInfo[`[this.__${hierarchy.objectMapping[layoutSection.objectId]}$tableName]`] = gridTableFieldInfoArray;
                        if (webHlListObj.columnDefinitions === '') {
                            webHlListObj.columnDefinitions = `[this.__${hierarchy.objectMapping[layoutSection.objectId]}$tableName]: [${columnDefinitions}]`;
                        } else {
                            webHlListObj.columnDefinitions += `, [this.__${hierarchy.objectMapping[layoutSection.objectId]}$tableName]: [${columnDefinitions}]`;
                        }
                        let variable =baseCtrlObj.baseCtrlMap.get("WEB_VARIABLES")
                        sectionObjectDetails=`
                        public sectionObjectDetails: {[objectName: string]: SectionObjectDetail}= {${sectionObjectVar}};`
                        webHlListObj.sectionObjectDetails = sectionObjectDetails;
                        webHlListObj.actionCompJson +=actionCompJson;
                        webHlListObj.childSecHeader +=childSecHeader;
                        webHlListPreview.dataFetchMode =dataFetchMode;
                        baseCtrlObj.baseCtrlMap.set("WEB_HL_LIST_PREVIEW",webHlListPreview);
                        baseCtrlObj.baseCtrlMap.set('WEB_HL_LIST_OBJ', webHlListObj);
                        baseCtrlObj.baseCtrlMap.set("WEB_VARIABLES",variable);
                        baseCtrlObj.baseCtrlMap.set("WEB_SERVICE_WEB", sectionalFetchJson);
                        if (reportVar !== '') {
                            let reportVariable = baseCtrlObj.baseCtrlMap.get('REPORT_ACTION');
                            if (reportVariable === '') {
                                reportVariable = reportVar;
                            } else {
                                reportVariable += `, ${reportVar}`;
                            }
                            baseCtrlObj.baseCtrlMap.set('REPORT_ACTION', reportVariable);
                        }
                        if (printVar !== '') {
                            let printVariable = baseCtrlObj.baseCtrlMap.get('PRINT_ACTION');
                            if (printVariable === '') {
                                printVariable = printVar;
                            } else {
                                printVariable += `, ${printVar}`;
                            }
                            baseCtrlObj.baseCtrlMap.set('PRINT_ACTION', printVariable);
                        }
                        let dynaValues = {};
                        await gridListViewController.listMethods(layoutgrp, layout, baseCtrlObj, layoutSection, appObject, hierarchy, dbVar, dynaValues);
                    }
                } else if (layout.layoutType === 'Grid' && layout.layoutMode === 'EDIT') {
                    let dynaValues ={
                        promient,
                        tableName_pfm,
                        lookupReadonlyFieldInfo,
                        gridTableDetails,
                        gridColumnDefinitions,
                        mailActionInfo,
                        workFlowActionConfig,
                        dataCloneClickAction,
                        wfApprovalActionView,
                        moreActionJsonFormation,
                        moreActionSelected,
                        comboVar,
                        userAssignmentViewMethods
                    }
                    await webEditController.editDynaMethodsForWeb(layoutgrp, layout, baseCtrlObj, layoutSection, appObject, hierarchy, dbVar, searchFlag, dynaValues);                    // });
                } else if (layout.layoutType === 'Grid' && layout.layoutMode === 'VIEW' && layout.isDrawerEnable === 'Y') {
                    let dynaValues = {
                        variables,
                        formulaFields,
                        fetchInfoAction,
                        requiredColumnForUpsert,
                        fetchActionUpsertInfo,
                        gridTableFieldInfoArray,
                        gridTableDetails,
                        gridColumnDefinitions,
                        fetchStatusWfl,
                        statusWorkFlowFields,
                        statusWorkFlowCommonMethods,
                        workFlowMapping,
                        dataCloneClickAction,
                        fieldApproverType,
                        comboVar,
                        reportGenerationCode,
                        conditionFormatting,
                        traversalPath,
                        moreActionJsonFormation,
                        moreActionSelected,
                        workFlowActionConfig,
                        wfApprovalActionView,
                        userAssignmentViewMethods,
                        balloonUiInputMethod,
                        showBalloonLayoutOnMouseOverAndOnClick
                    }
                    await gridGridViewController(layoutgrp, layout, baseCtrlObj, layoutSection, appObject, hierarchy, dbVar, dynaValues);
                } else if (layout.layoutType === 'Grid' && layout.layoutMode === 'VIEW') {                   
                    let dynaValues = {
                        promient,
                        requiredColumnForUpsert,
                        fetchActionUpsertInfo,
                        tableName_pfm,                     
                        gridTableFieldInfoArray,
                        gridTableDetails,
                        gridColumnDefinitions,
                        workFlowMapping,
                        fieldApproverType,
                        statusWorkFlowFields,
                        dataCloneClickAction,
                        statusWorkFlowVariables,
                        statusWorkFlowCommonMethods,
                        fetchStatusWfl,
                        comboVar,
                        reportGenerationCode,
                        conditionFormatting,
                        traversalPath,
                        secondaryParent,
                        tempFieldName,
                        mailActionInfo,
                        workFlowActionConfig,
                        wfApprovalActionView,
                        moreActionJsonFormation,
                        moreActionSelected,
                        userAssignmentViewMethods,
                        balloonUiInputMethod,
                        showBalloonLayoutOnMouseOverAndOnClick
                    };
                    await ViewControllerForWeb.gridViewMethods(layoutgrp, layout, baseCtrlObj, layoutSection, appObject, hierarchy, dbVar, dynaValues,formulaFields,tableName_pfm);
                }
                if(layout.layoutType === 'Grid_with_List' && layout.layoutMode === 'VIEW' && layoutSection.sectionFor.toUpperCase() === "GRID"){
                    
                    let baseVariable = baseCtrlObj.baseCtrlMap.get('WEB_HL_LIST_OBJ', webHlListObj);
                    if(!lodash.isEmpty(baseVariable.associationTableColumnInfo)){
                        baseVariable.associationTableColumnInfo +=!lodash.isEmpty(gridTableDetails) ? ","+gridTableDetails : '';
                        baseVariable.associtationColumnDefinition+= !lodash.isEmpty(gridColumnDefinitions) ? "," +gridColumnDefinitions: '';  
                    }else{
                        baseVariable.associationTableColumnInfo +=!lodash.isEmpty(gridTableDetails) ? gridTableDetails : '';
                        baseVariable.associtationColumnDefinition+= !lodash.isEmpty(gridColumnDefinitions) ? gridColumnDefinitions: '';
                    }
                }

                resolve();
            } catch (err) {
                logger.error('Error In dynaObjects Due to......', err);
                reject(err);
            }
        })
    }
};


const isOneToOneRelationship = (objectId, hierarchy) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isOneToOne = false;
            for (let i = 0; i < hierarchy['child'].length; i++) {
                const element = hierarchy['child'][i];
                if (element.objectId === objectId) {
                    if (element.relationshipType === 'one_to_one') {
                        isOneToOne = true
                        break
                    }
                }
            }
            resolve(isOneToOne)
        } catch (err) {
            logger.debug('Error In isOneToOneRelationship Due to......', err);
            reject(err);
        }
    })
}



let hierarchyChildObjects=[];
function hierarchyChildObjectFormation(object) {
    if (object['childObject'].length > 0) {
        if (object['childObject'].length === 1) {
            hierarchyChildObjects.push(parseInt(object['objectId']));
            hierarchyChildObjectFormation(object['childObject'][0])
        } else {
            hierarchyChildObjects.push(parseInt(object['objectId']));
            for (let i = 0; i < object['childObject'].length; i++) {
                hierarchyChildObjectFormation(object['childObject'][i])
            }
        }
    } else {
        hierarchyChildObjects.push(parseInt(object['objectId']));
        return 
    }
}
const getHierarchySet = (layoutLinkSet,objId) => {
    return new Promise((resolve, reject) => {
        try{
          const hierarchy = {
              "primary": "",
              "child": [],
              "parent": [],
              "lookup": [],
              "lookupObjId": [],
              "parentObjId": [],
              "childObjId": [],
              "objectMapping":{}
          };
          let headerLinkset = layoutLinkSet.filter(link => link.objectType.toUpperCase() === 'PRIMARY')
          let headerObjDetail = {...headerLinkset[0]}
          hierarchy["parent"].push(headerObjDetail)
          hierarchy['parentObjId'].push(headerObjDetail.objectId)
          let childObjIds = [...new Set(hierarchyChildObjects)];
          for (let b = 0; b < childObjIds.length; b++) {
            for (let a = 0; a < layoutLinkSet.length; a++) {
                let linkSet = layoutLinkSet[a];
                hierarchy.objectMapping[linkSet.objectId]=linkSet.objectName;
                if (linkSet.objectType === 'MASTERDETAIL' && childObjIds[b] === linkSet.objectId ) {
                     if ( childObjIds[b] === objId) {
                         let objDetail = {...linkSet}
                         objDetail['objectType']="PRIMARY";
                         hierarchy["primary"] = objDetail;
                    }else {
                        let objDetail = {...linkSet}
                        hierarchy["child"].push(objDetail);
                        hierarchy['childObjId'].push(objDetail.objectId)
                    }                   
                } else if (linkSet.objectType === 'LOOKUP' && childObjIds[b] === linkSet.objectId ) {
                    let objDetail = {...linkSet}
                    hierarchy["lookup"].push(objDetail);
                    hierarchy['lookupObjId'].push(objDetail.objectId)
                }
            }
        } 
            resolve(hierarchy);
        } catch (err) {
            logger.debug("Error in getHierarchySet controllerSegmentsForWeb=====>", err);
            reject(err);
        }
    })
}