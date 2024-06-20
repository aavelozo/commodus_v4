import React, { useRef, useState, useCallback } from 'react'
import { View, Dimensions } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize";
import { DefaultStyles } from '../../../DefaultStyles';
import { Text, TextInput } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import { DefaultProps } from '../../../DefaultProps';
import Establishment from '../../../components/expenses/Establishment';
import Observations from '../../../components/expenses/Observations';
import Utils from '../../../../controllers/Utils';
import { useFocusEffect } from '@react-navigation/native';
import EditExpenseController from '../../../../controllers/EditExpenseController';
import { BaseExpense } from './BaseExpense';
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
    const [totalValue, setTotalValue] = useState(0);

    //specific properties
    const listaCombustiveis = ['Álcool', 'Gasolina', 'Diesel']
    const [selectedFuel, setSelectedFuel] = useState(null);
    const [unValue, setUnValue] = useState(0);
    const [liters, setLiters] = useState(0);

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
                        setTotalValue(dataExpense.totalValue||0);
                        //specific properties
                        setUnValue(dataExpense.othersdatas.unValue||0);
                        console.log('loading states...2.3');
                        setLiters(dataExpense.othersdatas.liters||0);
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
            unValue: unValue,
            liters: liters
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
                data={listaCombustiveis}
                defaultValue={selectedFuel}
                renderButton={(selectedItem, isOpened) => {
                    return (
                        <View>
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}
                                error={missingData && !selectedFuel}
                                label='* Combustível'
                                value={selectedItem}
                                pointerEvents="none"
                                readOnly
                            />
                        </View>
                    );
                }}
                renderItem={(item, index, isSelected) => {
                    return (<View style={{...DefaultStyles.dropdownTextView, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                            <Text style={DefaultStyles.dropdownText}>{item}</Text>
                    </View>);
                }}
                onSelect={(selectedItem, index) => {
                    setSelectedFuel(selectedItem);
                }}
                ref={selectFuelRef}
            />

            {/* PREÇO/L, LITRO, VALOR */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width * 0.9, marginTop: RFValue(-10) }}>
                <TextInput
                    {...DefaultProps.textInput}
                    style={[DefaultStyles.textInput, { width: width * 0.27, marginTop: RFValue(12)  }]}
                    keyboardType='numeric'
                    label='Preço/L'
                    placeholder='R$'
                    placeholderTextColor='#666'
                    //color={DefaultStyles.colors.tabBar}
                    onChangeText={valorunitario => {
                        if (valorunitario.includes(',')) return
                        if (valorunitario.includes('-')) return
                        if (valorunitario.includes(' ')) return
                        if (valorunitario.includes('/')) return
                        if (valorunitario.includes('+')) return
                        if (valorunitario.includes('(')) return
                        if (valorunitario.includes(')')) return
                        if (valorunitario.includes('-')) return
                        if (valorunitario.includes(';')) return
                        if (valorunitario.includes('#')) return
                        if (valorunitario.includes('*')) return
                        setUnValue(Utils.toNumber(valorunitario));
                        setTotalValue(Utils.toNumber(liters) * Utils.toNumber(valorunitario));
                    }}
                    value={(unValue || 0).toString()}
                    maxLength={6}
                    search={false}
                />
                <TextInput
                    {...DefaultProps.textInput}
                    style={[DefaultStyles.textInput, { marginLeft: RFValue(15), width: width * 0.27 , marginTop: RFValue(12) }]}
                    keyboardType='numeric'
                    label='Litros'
                    onChangeText={litros => {
                        if (litros.includes(',')) return
                        if (litros.includes('-')) return
                        if (litros.includes(' ')) return
                        if (litros.includes('/')) return
                        if (litros.includes('+')) return
                        if (litros.includes('(')) return
                        if (litros.includes(')')) return
                        if (litros.includes('-')) return
                        if (litros.includes(';')) return
                        if (litros.includes('#')) return
                        if (litros.includes('*')) return

                        setLiters(Utils.toNumber(litros));
                        setTotalValue(Utils.toNumber(litros) * Utils.toNumber(unValue));
                    }}
                    value={(liters || 0).toString()}
                    maxLength={3}
                    search={false}
                />

                <TextInput
                    {...DefaultProps.textInput}
                    style={[DefaultStyles.textInput, { marginLeft: RFValue(15), width: width * 0.27, marginTop: RFValue(12) }]}
                    error={missingData && !totalValue}
                    keyboardType='numeric'
                    label='* Valor'
                    placeholder='R$'

                    placeholderTextColor='#666'
                    onChangeText={totalValue => setTotalValue(totalValue)}
                    maxLength={7}
                    value={(totalValue || 0).toString()}
                    search={false}
                />

            </View>            
        </BaseExpense>
    );
};



export {FuelExpense};