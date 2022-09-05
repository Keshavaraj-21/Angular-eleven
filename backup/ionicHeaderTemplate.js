 /********************************************************************************************************************************************
 * REVISION   DATE        NAME                     DESCRIPTION                                  METHODS                                     *
 * 19.10      04.10.19    Parthi         Menu Icon is not displayed when Search List           allButtons                                   *
 *                                        page added in Menu Navigation                                                                     *
 * 19.12      13.11.19    MATHI          showing undefined error in the title region            allButtons                                  *
 *                                              of the search form in 2020.                                                                 *
 * 19.12      18.11.19    MATHI          recommit for showing undefined error in the title         allButtons                                  *
 *                                            region of the search form in 2020.
 ********************************************************************************************************************************************/

var json2html = require('node-json2html');
var tagGenerator = require('../tagcomponents/ionictags/ionicTagGenerator.js');
var webtagGenerator = require('../tagcomponents/ionictags/ionicWebTagGenerator.js');
var ctrlSegments = require('../controllercomponents/controllerSegments.js');
var commonmethos = require("../../../core/common");
var allAction = require('../controllercomponents/allActionController.js');

module.exports = {
    ionHeaderItems: function(baseCtrlObj, layoutSection, layout, layoutgrp) {        
        return new Promise(function(resolve, reject) {
            try {
                let searchFlag;
                for (let isSearchEnabled of layout.layoutSectionSet) {
                    searchFlag = isSearchEnabled.isSearch == "Y" ?  true : 0;
                }
                allButtons(baseCtrlObj, layoutSection, layout, layoutgrp)
                .then((buttontags) => {
                        if (buttontags !== '') {
                            return (tagGenerator.ionButtons(buttontags));
                        } else {
                            return '';
                        }
                    }).then((ionButtons) => {
                        if (searchFlag) {                        
                            return ([tagGenerator.ionTitle('', layout.translationKey), ionButtons]);
                        } else {
                            return ([tagGenerator.ionMenu(layout), tagGenerator.ionTitle('', layout.translationKey,layout.layoutMode), ionButtons]);
                        }
                    }).then((arrValues) => {
                        return tagGenerator.ionToolBar(arrValues,layout.layoutMode, searchFlag);
                    }).then((navbar) => {
                        return (tagGenerator.ionHeader(navbar,layout.layoutMode));
                    }).then((headerTags) => {                    
                        resolve(json2html.transform({}, headerTags));
                    }).catch((error) => {
                        logger.debug("ionicHeaderTemplate.js ::: ionHeaderItems :: Error :: ", error);
                        reject('Error', error);
                    });
            } catch (error) {
                logger.debug("ionicHeaderTemplate.js ::: ionHeaderItems :: Error :: ", error);
                reject('Error', error);
            }
        });
    },
    childIonHeader: (baseCtrlObj, layoutSection, layout, layoutgrp, type) => {

        return new Promise((resolve, reject) => {
            try {
                logger.debug('ionic ChildIonHeader get called');
                allButtons(baseCtrlObj, layoutSection, layout, layoutgrp, type)
                    .then(async(buttontags) => {
                        if (buttontags !== '') {
                            return (tagGenerator.ionButtons(buttontags));
                        } else if (buttontags == '' && type === 'Grid_with_List-inner') {
                            let buttons = await tagGenerator.ion_buttonHeader(type);
                            return (tagGenerator.ionButtons(buttons));    
                        } else {
                            return '';
                        }
                    }).then(async ionButtons => {
                        let arrValues = await ([tagGenerator.ionMenu(layout), tagGenerator.ionTitle('', layout.translationKey, true, type), ionButtons]);
                        return await tagGenerator.ionNavbar(arrValues);
                    }).then((navbar) => {
                        return (tagGenerator.ionHeader(navbar,layout.layoutMode));
                    }).then((headerTags) => {
                        resolve(json2html.transform({}, headerTags));
                    }).catch((error) => {
                        logger.debug("ionlicHeaderTemplate.js :: childIonHeader :: Error :: ", error);
                        reject('Error', error);
                    });   
            } catch (error) {
                logger.debug("ionlicHeaderTemplate.js :: childIonHeader :: Error :: ", error);
                reject('Error', error);
            }
        });
    },
    ionHeaderItemForWeb: (baseCtrlObj, layoutSection, layout, layoutgrp, searchFlag, hierarchy) => {
        return new Promise(async (resolve, reject) => {
            try {
               // await commonmethos.displayOrderSort(layoutSection.sectionElementSet)
                await commonmethos.displayOrderSortAction(layoutSection.sectionElementSet);             
                let buttonTags = await allButtonsForWeb(baseCtrlObj, layoutSection, layout, layoutgrp, searchFlag, hierarchy);
                // let buttons = await tagGenerator.buttonsGeneratorWeb(buttonTags, searchFlag,layout);
                // let pagination = await tagGenerator.paginationForWeb(buttons, searchFlag);
                // let ionTitle = await tagGenerator.titleGeneratorWeb(buttons, layout.translationKey, searchFlag, buttons, layout);
                let ionHeader = await tagGenerator.headerGeneratorWeb(buttonTags, searchFlag,layout,layout.translationKey,layoutSection, layoutgrp);
                resolve(json2html.transform({}, ionHeader));
            } catch (err) {
                logger.debug("Error in web header tag generation.........", err);
                reject(err);
            }
        })
    }
}

var allButtons = function(baseCtrlObj, layoutSection, layout, layoutgrp, type) {
    return new Promise(function(resolve, reject) {
      try {
        let buttonsTags = [];
        let i = 0,
            j = 0;

        let searchFlag;
        let conditionalValidationFlag=false;

        for (let isSearchEnabled of layout.layoutSectionSet) {
            searchFlag = isSearchEnabled.isSearch == "Y" ? searchFlag = true : 0;            
        }

        if (layoutSection.sectionElementSet.length !== 0) {
            let btags = [];
            for (let sectionElement of layoutSection.sectionElementSet) {
                let actionInfo = '';
                let actionData;
                let buttonType, methodName = '';

                //Mobile Actions
                if (sectionElement.elementType === 'ACTION' && sectionElement.hasOwnProperty("elementDisplayName") && sectionElement.actionType !== "" &&
                    sectionElement.actionType !== 'NAVIGATION') {                    
                    buttonType = sectionElement.actionType;
                    methodName = sectionElement.elementName + '_' + sectionElement.elementId;
                    actionData = sectionElement.actionData[0];
                    actionInfo = JSON.parse(actionData.actionInfo);
                    allAction.navAction(baseCtrlObj, buttonType, sectionElement, layoutgrp, methodName, actionInfo, layout, sectionElement.elementId, type);
                } else if (sectionElement.elementType === 'ACTION' && sectionElement.actionData.length !== 0) {
                    actionData = sectionElement.actionData[0];
                    if (actionData !== undefined && actionData.length!=0) {
                        actionInfo = JSON.parse(actionData.actionInfo);
                        buttonType = sectionElement.actionType;
                    }                    
                    if (buttonType != undefined && buttonType != 'SAVE' && buttonType !='') {

                        methodName = sectionElement.elementName + '_' + sectionElement.elementId;
                        allAction.navAction(baseCtrlObj, buttonType, null, layoutgrp, methodName, actionInfo, layout, sectionElement.elementId, type);
                    }
                }

                if (type == 'Grid_with_List-inner') {
                    resolve('');
                } else {                    
                    if (searchFlag) {
                        let actions = sectionElement;
                        if (actions.label) {
                            if (layout.hasOwnProperty('conditionalValidationSet')) {
                                conditionalValidationFlag = true;
                            }
                            tagGenerator.ionButton(buttonType,layout.layoutType, layout.layoutMode, methodName, actions.elementId, searchFlag,undefined,undefined,undefined,undefined,undefined,conditionalValidationFlag).then((val) => {                                
                                if (val !== undefined && val !== '') {                                    
                                    btags.push(val);
                                    tagGenerator.ionButtons(btags).then((values) => {                                        
                                        return tagGenerator.ionToolBar([tagGenerator.ionMenu(layout),tagGenerator.ionTitle('', layout.translationKey), values], '', searchFlag);
                                    }).then((navbar) => {                                        
                                        return (tagGenerator.ionHeader(navbar,layout.layoutMode));
                                    }).then((headerTags) => {                                        
                                        return baseCtrlObj.baseCtrlMap.get("SEARCH_LIST_LIST")[0]["HEADER_TAGS"] = json2html.transform({}, headerTags);
                                    }).catch((error) => {
                                        logger.debug("ionicHeaderTemplate.js ::: ionHeaderItems :: Error :: ", error);
                                        reject('Error', error);
                                    });
                                }
                            }).catch((error) => {
                                logger.debug("ionicHeaderTemplate.js ::: ionHeaderItems :: Error :: ", error);
                                reject('Error', error);
                            });
                        }
                        let buttonList = ['clear', 'apply', 'close'];
                        buttonType = buttonList[j];
                        j++;
                    }
                    if (layout.hasOwnProperty('conditionalValidationSet')) {
                        conditionalValidationFlag = true;
                    }
                    tagGenerator.ionButton(buttonType, layout.layoutType, layout.layoutMode, methodName, sectionElement.elementId,sectionElement.elementName,layoutgrp.primaryObjectId,undefined,undefined,undefined,conditionalValidationFlag).then((returnValue) => {
                        if (returnValue !== undefined) {
                            buttonsTags.push(returnValue);
                        }
                        return buttonsTags;
                    }).then((ButtonsTags) => {
                        if (++i === layoutSection.sectionElementSet.length) {
                            resolve(ButtonsTags);
                        }
                    }).catch((error) => {
                        logger.debug("ionicHeaderTemplate.js :: allButtons :: Error :: ", error);
                        reject('Error', error);
                    });
                }
            }
        } else {
                tagGenerator.ionToolBar([tagGenerator.ionMenu(layout),tagGenerator.ionTitle('', layout.translationKey), ''], '', searchFlag)
                .then((navbar) => {                                
                    return (tagGenerator.ionHeader(navbar,layout.layoutMode));
                })
                .then((headerTags) => {                                
                    return baseCtrlObj.baseCtrlMap.get("SEARCH_LIST_LIST")[0]["HEADER_TAGS"] = json2html.transform({}, headerTags);
                }).catch((error) => {
                    logger.debug("ionicHeaderTemplate.js ::: ionHeaderItems :: Error :: ", error);
                    reject('Error', error);
                });
            logger.debug("ionicHeaderTemplate.js :: allButtons :: Else :: ");
            resolve('');
               }
        }catch(error){
            logger.debug("ionicHeaderTemplate.js  allButtons Exception", error);
            reject(error);
         }
    });
}


const allButtonsForWeb = (baseCtrlObj, layoutSection, layout, layoutgrp, searchFlag, hierarchy) => {
    return new Promise(async (resolve, reject) => {
      try{
        let buttonsTags = [];
        if (layoutSection.sectionElementSet.length > 0) {
            for (let i = 0; i < layoutSection.sectionElementSet.length; i++) {
                var buttonType = ``;
                var methodName = ``;
                var actionData = {};
                var actionInfo = {};               
                const sectionElement = layoutSection.sectionElementSet[i];
                if (sectionElement.elementType === 'ACTION' && sectionElement.actionType !== "" &&
                    sectionElement.actionType !== 'NAVIGATION') {
                        if (sectionElement.actionType === 'ACTIONS_GROUP'){
                           for (let k = 0; k < sectionElement.elementActions.length; k++) {
                            let actionGroupElement = sectionElement.elementActions[k];
                            if (actionGroupElement.actionType === 'MORE'){
                                for (let l = 0; l < actionGroupElement.elementActions.length; l++) {
                                    let moreActionElement = actionGroupElement.elementActions[l];
                                    let moreActionMethodName = moreActionElement.elementName + '_' + moreActionElement.elementId;
                                    let moreActionInfo = {};
                                    let moreActionData = moreActionElement.actionData[0];
                                        if (moreActionData !== undefined) {
                                            moreActionInfo = JSON.parse(moreActionData.actionInfo);
                                        }
                                    allAction.navAction(baseCtrlObj, moreActionElement.actionType, moreActionElement, layoutgrp, moreActionMethodName, moreActionInfo, layout, moreActionElement.elementId, undefined);
                                }
                            }
                           }
                        } else if (sectionElement.actionType === 'MORE'){
                            for (let k = 0; k < sectionElement.elementActions.length; k++) {
                                let moreActionElement = sectionElement.elementActions[k];
                                let moreActionMethodName = moreActionElement.elementName + '_' + moreActionElement.elementId;
                                let moreActionInfo = {};
                                let moreActionData = moreActionElement.actionData[0];
                                    if (moreActionData !== undefined) {
                                        moreActionInfo = JSON.parse(moreActionData.actionInfo);
                                    }
                                allAction.navAction(baseCtrlObj, moreActionElement.actionType, moreActionElement, layoutgrp, moreActionMethodName, moreActionInfo, layout, moreActionElement.elementId, undefined,'',sectionElement.actionType);
                            }
                        }
                    buttonType = sectionElement.actionType;
                    methodName = sectionElement.elementName + '_' + sectionElement.elementId;
                    actionData = sectionElement.actionData[0];
                    if (actionData !== undefined) {
                        actionInfo = JSON.parse(actionData.actionInfo);
                    }
                    allAction.navAction(baseCtrlObj, buttonType, sectionElement, layoutgrp, methodName, actionInfo, layout, sectionElement.elementId, undefined,hierarchy);
                } else if (sectionElement.elementType === 'ACTION' && sectionElement.actionData.length !== 0) {
                    actionData = sectionElement.actionData[0];
                    if (actionData !== undefined) {
                        actionInfo = JSON.parse(actionData.actionInfo);
                        buttonType = sectionElement.actionType;
                    }
                    if (buttonType != undefined && buttonType != 'SAVE') {
                        methodName = sectionElement.elementName + '_' + sectionElement.elementId;
                        allAction.navAction(baseCtrlObj, buttonType, sectionElement, layoutgrp, methodName, actionInfo, layout, sectionElement.elementId, undefined, hierarchy);
                    }
                }
                let fileACTN=sectionElement.actionType==='FILE_MANAGE' ? baseCtrlObj.baseCtrlMap.get('FILEINVOLVEOBJ') : '';
                let sectionHeader = true ;
                webtagGenerator.ionButton(buttonType,layout, layout.layoutType, layout.layoutMode, methodName, sectionElement.elementId,sectionElement.elementName,layoutgrp.primaryObjectId, searchFlag, layout.layoutFor, sectionElement,'',fileACTN,sectionHeader).then((returnValue) => {
                    if (returnValue !== undefined) {
                        buttonsTags.push(returnValue);
                    }
                    return buttonsTags;
                }).then((ButtonsTags) => {
                    if (i === layoutSection.sectionElementSet.length - 1) {
                        resolve(ButtonsTags);
                    }
                }).catch((error) => {
                    logger.debug("ionicHeaderTemplate.js :: allButtons :: Error :: ", error);
                    reject('Error', error);
                });

            }
        } else {
            resolve([]);
        }
     }catch(error){
        logger.debug("ionicHeaderTemplate.js  allButtonsForWeb Exception", error);
        reject(error);
     }
    })
}