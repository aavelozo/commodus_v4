import React, { useRef, useState, useCallback } from 'react'
import { View, Dimensions } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize";
import { DefaultStyles } from '../../../DefaultStyles';
import { HelperText, Text, TextInput } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import { DefaultProps } from '../../../DefaultProps';
import Utils from '../../../../controllers/Utils';
import { useFocusEffect } from '@react-navigation/native';
import EditExpenseController from '../../../../controllers/EditExpenseController';
import { BaseExpense } from './BaseExpense';
import { TotalValue } from '../../../components/expenses/TotalValue';
import Trans from '../../../../controllers/internatiolization/Trans';
import _ from 'lodash';
import Vehicles from '../../../../database/models/Vehicles';
const { width, height } = Dimensions.get('window')




/******************************************************
** COMPONENTE DA VIEW PRINCIPAL                      **
******************************************************/
function FuelExpense(props): JSX.Element {
    const selectFuelRef = useRef();
    const [loading,setLoading] = useState(false);    
    const [loaded,setLoaded] = useState(false);   
    const [saving,setSaving] = useState(false); 
    const [missingData, setMissingData] = useState(false);

    //default properties
    const [currentExpense,setCurrentExpense] = useState(null); 
    const [totalValue, setTotalValue] = useState('');

    //specific properties
    const [selectedFuel, setSelectedFuel] = useState(null);
    const [unValue, setUnValue] = useState('');
    const [liters, setLiters] = useState('');

    useFocusEffect(useCallback(() => {
        console.log('INIT FuelExpense.useFocusEffect.useCallBack',loading,loaded);
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
                        console.log('loading states...2.1');
                        setTotalValue(Utils.toNumericText(dataExpense.totalValue||''));
                        //specific properties
                        setUnValue(Utils.toNumericText(dataExpense.othersdatas.unValue||''));
                        console.log('loading states...2.3');
                        setLiters(Utils.toNumericText(dataExpense.othersdatas.liters||''));
                        setSelectedFuel(dataExpense.othersdatas.fuel||null);
                        console.log('loading states...3');
                    } else {
                       clearStates();
                    }

                    console.log('loading expense... ok');
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
        if (!selectedFuel || !totalValue) {
            result = true;
        } 
        setMissingData(result);
        return result;
    }

    function getOthersDatas() {
        return {
            fuel: selectedFuel,
            unValue: Utils.hasValue(unValue) ? Utils.toNumber(unValue) : null,
            liters: Utils.hasValue(liters) ? Utils.toNumber(liters) : null
        }
    }

    function clearStates(){
        setCurrentExpense(null);                

        //specific properties
        setUnValue(0);
        setLiters(0);
        setSelectedFuel(null);
       
        if (selectFuelRef) {
            selectFuelRef.current?.reset();
        }
    }

    return (
        <BaseExpense
            title='fuel expense'
            type='FUEL'
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
            {/* FUEL */}                        
            {/* dropdown: usado para selecionar o ano e atualizar o txtinput */}
            <SelectDropdown
                dropdownStyle={DefaultStyles.dropdownMenuStyle}
                search={true}
                showsVerticalScrollIndicator={true}                            
                data={Vehicles.FUELS_LIST}
                defaultValue={selectedFuel}
                renderButton={(selectedItem, isOpened) => {
                    return (
                        <View>
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}                                
                                label={`* ${_.capitalize(Trans.t('fuel'))}`}
                                value={_.capitalize(Trans.t(selectedItem))}
                                pointerEvents="none"
                                readOnly
                            />
                            <HelperText
                                style={DefaultStyles.defaultHelperText}            
                                type="error"
                                visible={missingData && !selectedFuel}
                            >
                                {_.capitalize(Trans.t('select a fuel'))}
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
                    setSelectedFuel(Vehicles.FUELS_LIST[index]);
                }}
                ref={selectFuelRef}
            />

            {/* PREÇO/L, LITRO, VALOR */}
            <View 
                style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'space-between', 
                    width: width * 0.9, 
                    marginTop: RFValue(-10),
                    //height:200
                }}>
                <View>
                    <TextInput
                        {...DefaultProps.textInput}
                        style={[DefaultStyles.textInput, { width: width * 0.27, marginTop: RFValue(12)  }]}
                        keyboardType='numeric'
                        label={Trans.t('Price/L')}
                        placeholder={Trans.getCurrencySymbol()}
                        placeholderTextColor='#666'
                        //color={DefaultStyles.colors.tabBar}
                        onChangeText={valorunitario => {
                            valorunitario = Utils.toNumericText(valorunitario);
                            setUnValue(valorunitario);
                            setTotalValue(Utils.toNumericText(Utils.toNumber(liters) * Utils.toNumber(valorunitario)));
                        }}
                        value={unValue ? unValue.toString() : null}
                        maxLength={6}
                    />
                    <HelperText
                        style={DefaultStyles.defaultHelperText}            
                        type="error"
                        visible={false}
                    >
                        {_.capitalize(Trans.t('enter value'))}
                    </HelperText>
                </View>
                <View>
                    <TextInput
                        {...DefaultProps.textInput}
                        style={[DefaultStyles.textInput, { marginLeft: RFValue(15), width: width * 0.27 , marginTop: RFValue(12) }]}
                        keyboardType='numeric'
                        label={_.capitalize(Trans.t('liters'))}
                        onChangeText={litros => {
                            litros = Utils.toNumericText(litros);
                            setLiters(litros);
                            setTotalValue(Utils.toNumericText(Utils.toNumber(litros) * Utils.toNumber(unValue)));
                        }}
                        value={liters ? liters.toString() : null}
                        maxLength={6}
                    />
                    <HelperText
                        style={DefaultStyles.defaultHelperText}            
                        type="error"
                        visible={false}
                    >
                        {_.capitalize(Trans.t('enter value'))}
                    </HelperText>
                </View>

                <TotalValue 
                    totalValue={totalValue} 
                    setTotalValue={setTotalValue} 
                    style={{marginLeft: RFValue(15), width: width * 0.265, marginTop: RFValue(12)}} 
                    maxLength={7}
                    label="value"
                    missingData={missingData}
                    helperTextStyle={{marginLeft:5}}
                />

            </View>            
        </BaseExpense>
    );
};



export {FuelExpense};