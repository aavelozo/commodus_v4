import React, { useRef, useState, useCallback } from 'react';
import { View, Dimensions } from 'react-native';
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
const { width } = Dimensions.get('window');

/******************************************************
** COMPONENTE DA VIEW PRINCIPAL                      **
******************************************************/
function FuelExpense(props): JSX.Element {
    const selectFuelRef = useRef();
    const [loading, setLoading] = useState(false);    
    const [loaded, setLoaded] = useState(false);   
    const [saving, setSaving] = useState(false); 
    const [missingData, setMissingData] = useState(false);

    //default properties
    const [currentExpense, setCurrentExpense] = useState(null); 
    const [totalValue, setTotalValue] = useState(0);

    //specific properties
    const [selectedFuel, setSelectedFuel] = useState(null);
    const [unValue, setUnValue] = useState('');
    const [liters, setLiters] = useState('');

    useFocusEffect(useCallback(() => {
        if (!loaded) {
            if (!loading) setLoading(true);
            (async() => {
                try {
                    if (EditExpenseController.currentExpense) { 
                        setCurrentExpense(EditExpenseController.currentExpense);  
                        let dataExpense = EditExpenseController.currentExpense.data();
                        setTotalValue(Utils.toNumber(dataExpense.totalValue || 0));
                        setUnValue(dataExpense.othersdatas.unValue ? formatCurrency(Utils.toNumber(dataExpense.othersdatas.unValue)) : '');
                        setLiters(dataExpense.othersdatas.liters ? dataExpense.othersdatas.liters.toString() : '');
                        setSelectedFuel(dataExpense.othersdatas.fuel || null);
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
        let result = !selectedFuel || !totalValue;
        setMissingData(result);
        return result;
    }

    function getOthersDatas() {
        return {
            fuel: selectedFuel,
            unValue: Utils.toNumber(unValue.replace('R$', '').replace(',', '.').trim()),
            liters: Utils.toNumber(liters.trim())
        }
    }

    function clearStates() {
        setCurrentExpense(null);                
        setUnValue('');
        setLiters('');
        setSelectedFuel(null);
       
        if (selectFuelRef) {
            selectFuelRef.current?.reset();
        }
    }

    // Format a number as currency
    const formatCurrency = (value) => {
        if (value === null || value === undefined || isNaN(value)) return '';
        return `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`;
    };

    // Handle changes in price and liters
    const handlePriceChange = (value) => {
        const numericValue = value.replace(/\D/g, '');
        const formattedValue = numericValue.length > 0 ? `R$ ${(numericValue / 100).toFixed(2).replace('.', ',')}` : '';
        setUnValue(formattedValue);

        const parsedValue = parseFloat(numericValue) / 100;
        const litersNumeric = Utils.toNumber(liters.trim());
        setTotalValue(parsedValue * litersNumeric);
    };

    const handleLitersChange = (value) => {
        setLiters(value);
        const numericValue = Utils.toNumber(value.trim());
        const unValueNumeric = Utils.toNumber(unValue.replace('R$', '').replace(',', '.').trim());
        setTotalValue(numericValue * unValueNumeric);
    };

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
                    return (
                        <View style={{...DefaultStyles.dropdownTextView, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                            <Text style={DefaultStyles.dropdownText}>{_.capitalize(Trans.t(item))}</Text>
                        </View>
                    );
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
                }}>
                <View>
                    <TextInput
                        {...DefaultProps.textInput}
                        style={[DefaultStyles.textInput, { width: width * 0.27, marginTop: RFValue(12) }]}
                        keyboardType='numeric'
                        label={Trans.t('Preço/L')}
                        placeholder={Trans.getCurrencySymbol()}
                        placeholderTextColor='#666'
                        onChangeText={handlePriceChange}
                        value={unValue}
                        maxLength={10}
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
                        label={_.capitalize(Trans.t('litros'))}
                        onChangeText={handleLitersChange}
                        value={liters}
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
                        label={Trans.t('Valor')}
                        value={formatCurrency(totalValue)}
                        editable={false}
                    />
                    <HelperText
                        style={DefaultStyles.defaultHelperText}            
                        type="error"
                        visible={missingData && totalValue <= 0}
                    >
                        {_.capitalize(Trans.t('enter value'))}
                    </HelperText>
                </View>
            </View>            
        </BaseExpense>
    );
};

export { FuelExpense };
