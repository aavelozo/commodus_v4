import React, { useState, useRef, useCallback } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native'
import { Checkbox, HelperText, TextInput, useTheme } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { DefaultProps } from '../../../DefaultProps';
import { DefaultStyles } from '../../../DefaultStyles';
import SelectDropdown from 'react-native-select-dropdown';
import EditExpenseController from '../../../../controllers/EditExpenseController';
import { useFocusEffect } from '@react-navigation/native';
import { BaseExpense } from './BaseExpense';
import Trans from '../../../../controllers/internatiolization/Trans';
import _ from 'lodash';
import { TotalValue } from '../../../components/expenses/TotalValue';
import Utils from '../../../../controllers/Utils';
const { width, height } = Dimensions.get('window')


const serviceList = [
    'painting glazing', 
    'headlight polishing', 
    'painting crystallization', 
    'leather hydration', 
    'ceiling cleaning', 
    'carpet cleaning',
    'seat cleaning',
    'cleaning plastic areas',
    'painting revitalization',
    'painting',
    'gold hammer',
    'sinister recovery',
    'others services'
];

/******************************************************
** COMPONENTE PRINCIPAL                             **
******************************************************/
function AppearanceExpense(props): JSX.Element {
    const theme = useTheme();
    const selectServiceRef = useRef();
    const [loading,setLoading] = useState(false);    
    const [loaded,setLoaded] = useState(false); 
    const [saving,setSaving] = useState(false);
    const [missingData, setMissingData] = useState(false);

    //default properties
    const [currentExpense,setCurrentExpense] = useState(null);    
    const [totalValue, setTotalValue] = useState('');

    //specific properties
    const [regularWashing, setRegularWashing] = useState(false);
    const [completeWashing, setCompleteWashing] = useState(false);
    
    const [service, setService] = useState(serviceList[serviceList.length-1]);

    useFocusEffect(useCallback(() => {
        console.log('INIT AppearanceExpense.useFocusEffect.useCallBack');
        if (!loaded) {
            if (!loading) setLoading(true);
            (async()=>{
                try {
                    console.log('loading expense...');
                    console.log('EditExpenseController.currentExpense',EditExpenseController.currentExpense);
                    if (EditExpenseController.currentExpense) { 
                        console.log('loading states...');             
                        //default properties    
                        setCurrentExpense(EditExpenseController.currentExpense);  
                        
                        console.log('loading states...2');
                        let dataExpense = EditExpenseController.currentExpense.data();
                        setTotalValue(Utils.toNumericText(dataExpense.totalValue||''));

                        //specific properties
                        setRegularWashing(dataExpense.othersdatas.regularWashing ? true : false);
                        setCompleteWashing(dataExpense.othersdatas.completeWashing ? true : false);
                        setService(dataExpense.othersdatas.service||null);
                    } else {
                       clearStates();
                    }
                } catch (e) {
                    console.log(e);                    
                } finally {
                    setLoaded(true);
                    setLoading(false);                    
                }
            })();
        }
    }, [props.navigation]));


    function isMissingData() {
        let result = false;
        if (!(regularWashing || completeWashing)  || !totalValue) {
            result = true;
        } 
        setMissingData(result);
        return result;
    }

    function getOthersDatas() {
        return {
            regularWashing: regularWashing ? 'regular washing' : false,
            completeWashing: completeWashing ? 'complete washing' : false,
            othersServices: service
        }
    }

    function clearStates(){
        setCurrentExpense(null);                
        setTotalValue('');

        //specific properties
        setRegularWashing(false);
        setCompleteWashing(false);
        setService(null);

        if (selectServiceRef) {
            selectServiceRef.current?.reset();
        }
    }
    

    return (
        <BaseExpense
            title='appearance expense'
            type='APPEARANCE'
            loading={loading}
            setLoading={setLoading}
            loaded={loaded}
            setLoaded={setLoaded}
            saving={saving}
            setSaving={setSaving}
            currentExpense={currentExpense}
            setCurrentExpense={setCurrentExpense}
            clearStates={clearStates}
            isMissingData={isMissingData}
            getOthersDatas={getOthersDatas}
            totalValue={totalValue}
        >
            <View style={style.viewCheckBox}>
                <Checkbox
                    status={regularWashing ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setRegularWashing(!regularWashing);
                    }} 
                    uncheckedColor={missingData && !(regularWashing || completeWashing) ? theme.colors.error : undefined}                               
                />
                <TouchableWithoutFeedback onPress={() => setRegularWashing(!regularWashing)}>
                    <Text style={[style.textCheckBox, { fontSize: DefaultStyles.dimensions.defaultLabelFontSize }]}>{_.capitalize(Trans.t('regular washing'))}</Text>
                </TouchableWithoutFeedback>

            </View>

            <View style={style.viewCheckBox}>
                <Checkbox
                    status={completeWashing ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setCompleteWashing(!completeWashing);
                    }}
                    uncheckedColor={missingData && !(regularWashing || completeWashing) ? theme.colors.error : undefined}
                />
                <TouchableWithoutFeedback onPress={() => setCompleteWashing(!completeWashing)}>
                    <Text style={[style.textCheckBox, { fontSize: DefaultStyles.dimensions.defaultLabelFontSize }]}>{_.capitalize(Trans.t('complete washing'))}</Text>
                </TouchableWithoutFeedback>

            </View>
            <HelperText
                style={DefaultStyles.defaultHelperText}            
                type="error"
                visible={false}
            >
                {_.capitalize(Trans.t('enter a value'))}
            </HelperText>


            
            {/* dropdown: usado para selecionar o ano e atualizar o txtinput */}

            <SelectDropdown
                dropdownStyle={DefaultStyles.dropdownMenuStyle}
                search={true}
                showsVerticalScrollIndicator={true}                            
                data={serviceList}
                defaultValue={service}
                renderButton={(selectedItem, isOpened) => {
                    return (
                        <View>
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}
                                label={_.capitalize(Trans.t('service'))}
                                value={_.capitalize(Trans.t(selectedItem))}
                                pointerEvents="none"
                                readOnly
                            />
                            <HelperText
                                style={DefaultStyles.defaultHelperText}            
                                type="error"
                                visible={false}
                            >
                                {_.capitalize(Trans.t('enter a value'))}
                            </HelperText>
                        </View>
                    );
                }}
                renderItem={(item, index, isSelected) => {
                    return (<View style={{...DefaultStyles.dropdownTextView, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                            <Text style={DefaultStyles.dropdownText}>{_.capitalize(Trans.t(item))}</Text>
                    </View>);
                }}
                onSelect={(selectedItem, index) => {
                    setService(serviceList[index]);
                }}
                ref={selectServiceRef}
            />
            
            <TotalValue totalValue={totalValue} setTotalValue={setTotalValue} missingData={missingData}/>
        </BaseExpense>
    );
}

const style = StyleSheet.create({
    viewCheckBox: {
        width: '65%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: width * 0.03,
        alignItems: 'center',
        alignSelf: 'flex-start'
    },
    textCheckBox: {
        fontSize: RFValue(25),
        color: DefaultStyles.colors.tabBar
    }
});

export default AppearanceExpense;