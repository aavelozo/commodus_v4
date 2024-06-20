import React, { useState, useRef, useCallback } from 'react'
import { View, StyleSheet, Alert, Dimensions, ScrollView } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize";
import TitleView from '../../../components/TitleView';
import Vehicles from '../../../../database/models/Vehicles';
import Header from '../../../components/Header';
import ContentContainer from '../../../components/ContentContainer';
import Observations from '../../../components/expenses/Observations';
import DateComponent from '../../../components/expenses/DateComponent';
import InputKM from '../../../components/vehicles/InputKM';
import { Text, TextInput } from 'react-native-paper';
import { DefaultProps } from '../../../DefaultProps';
import { DefaultStyles } from '../../../DefaultStyles';
import Utils from '../../../../controllers/Utils';
import SelectDropdown from 'react-native-select-dropdown';
import EditExpenseController from '../../../../controllers/EditExpenseController';
import { useFocusEffect } from '@react-navigation/native';
import { BaseExpense } from './BaseExpense';
const { width, height } = Dimensions.get('window')



/******************************************************
** COMPONENTE DA VIEW PRINCIPAL                      **
******************************************************/
function DocumentationExpense(props): JSX.Element {
    const selectRecurrenceRef = useRef();
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [missingData, setMissingData] = useState(false);

    //default properties
    const [currentExpense, setCurrentExpense] = useState(null);
    const [totalValue, setTotalValue] = useState(0);    

    //specific properties
    const [docList, setDocList] = useState(['IPVA', 'Transferência', 'Seguro', 'Hidratação de couro', 'Emplacamento', 'Blindagem']);
    const [documentName, setDocumentName] = useState(null);
    const [recurrenceList] = useState(['Mensal', 'Trimensal', 'Semestral', 'Anual', 'Bianual']);
    const [recurrence, setRecurrence] = useState('Sem recorrência');
    const selectServiceRef = useRef();


    useFocusEffect(useCallback(() => {
        console.log('INIT OthersExpense.useFocusEffect.useCallBack');
        if (!loaded) {
            if (!loading) setLoading(true);

            //load expense data
            (async () => {
                try {
                    console.log('loading expense...');
                    console.log('EditExpenseController.currentExpense', EditExpenseController.currentExpense);
                    if (EditExpenseController.currentExpense) {
                        console.log('loading states...');
                        //default properties    
                        setCurrentExpense(EditExpenseController.currentExpense);
                        let dataExpense = EditExpenseController.currentExpense.data();
                        setTotalValue(dataExpense.totalValue || 0);

                        //specific properties
                        setDocumentName(dataExpense.othersdatas.documentName || null);
                        setRecurrence(dataExpense.othersdatas.recurrence || null);
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
        if (!totalValue) {
            result = true;
        } 
        setMissingData(result);
        return result;
    }

    function getOthersDatas() {
        return {
            documentName: documentName,
            recurrence: recurrence
        }
    }

    function clearStates() {
        setCurrentExpense(null);
        setTotalValue(0);

        //specific properties
        setDocumentName(null);
        setRecurrence(null);
        if (selectRecurrenceRef) {
            selectRecurrenceRef.current?.reset();
        }
    }

    return (
        <BaseExpense
            title='document expense'
            type='DOCUMENT'
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
            hasEstablishment={false}
        >
        
            <SelectDropdown
                dropdownStyle={DefaultStyles.dropdownMenuStyle}
                search={true}
                showsVerticalScrollIndicator={true}
                data={docList}
                defaultValue={documentName}
                renderButton={(selectedItem, isOpened) => {
                    return (
                        <View>
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}
                                label='Nome do documento'
                                value={selectedItem}
                                pointerEvents="none"
                                readOnly
                            />
                        </View>
                    );
                }}
                renderItem={(item, index, isSelected) => {
                    return (<View style={{ ...DefaultStyles.dropdownTextView, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                        <Text style={DefaultStyles.dropdownText}>{item}</Text>
                    </View>);
                }}
                onSelect={(selectedItem, index) => {
                    setDocumentName(selectedItem);
                }}
                ref={selectServiceRef}
            />

            {/* PREÇO TOTAL */}
            <TextInput
                {...DefaultProps.textInput}
                style={DefaultStyles.textInput}
                error={missingData && !totalValue}
                keyboardType='numeric'
                label='* Valor Total'
                onChangeText={value => setTotalValue(Utils.toNumber(value))}
                value={totalValue.toString()}
            />



            {/* dropdown: usado para selecionar o ano e atualizar o txtinput */}
            <SelectDropdown
                dropdownStyle={DefaultStyles.dropdownMenuStyle}
                search={true}
                showsVerticalScrollIndicator={true}
                data={recurrenceList}
                defaultValue={recurrence}
                renderButton={(selectedItem, isOpened) => {
                    return (
                        <View>
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}
                                label='Recorrência'
                                value={selectedItem}
                                pointerEvents="none"
                                readOnly
                            />
                        </View>
                    );
                }}
                renderItem={(item, index, isSelected) => {
                    return (<View style={{ ...DefaultStyles.dropdownTextView, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                        <Text style={DefaultStyles.dropdownText}>{item}</Text>
                    </View>);
                }}
                onSelect={(selectedItem, index) => {
                    setRecurrence(selectedItem);
                }}
                ref={selectRecurrenceRef}
            />

        </BaseExpense>
    );
};

export default DocumentationExpense;