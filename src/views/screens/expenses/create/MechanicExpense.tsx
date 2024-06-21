import React, { useState, useCallback, useRef } from 'react'
import { View, TouchableWithoutFeedback, Switch, Text } from 'react-native'
import DateComponent from '../../../components/expenses/DateComponent';
import { TextInput } from 'react-native-paper';
import { DefaultProps } from '../../../DefaultProps';
import { DefaultStyles } from '../../../DefaultStyles';
import SelectDropdown from 'react-native-select-dropdown';
import { useFocusEffect } from '@react-navigation/native';
import EditExpenseController from '../../../../controllers/EditExpenseController';
import { BaseExpense } from './BaseExpense';
import { TotalValue } from '../../../components/expenses/TotalValue';
import Trans from '../../../../controllers/internatiolization/Trans';
import _ from 'lodash';


const serviceList = [
    'brake maintenance',
    'alignment and balancing',
    'changing belts and tensioners',
    'changing spark plugs',
    'diagnosis',
    'suspension repair',
    'battery change',
    'exhaust system replacement',
    'air conditioning service'
];

/******************************************************
** COMPONENTE DA VIEW PRINCIPAL                      **
******************************************************/
function MechanicsExpense(props): JSX.Element {
    const selectServiceRef = useRef();
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [missingData, setMissingData] = useState(false);

    //default properties
    const [currentExpense, setCurrentExpense] = useState(null);
    const [totalValue, setTotalValue] = useState(0);

    //specific properties    
    const [service, setService] = useState(null);
    const [isEnabled, setIsEnabled] = useState(false);
    const [dateReminder, setDateReminder] = useState(null);


    useFocusEffect(useCallback(() => {
        console.log('INIT MechanicExpense.useFocusEffect.useCallBack', props.navigation);
        if (!loaded) {
            if (!loading) setLoading(true);
            (async () => {
                try {
                    console.log('loading expense...');
                    if (EditExpenseController.currentExpense) {
                        console.log('loading states...');

                        //default properties    
                        setCurrentExpense(EditExpenseController.currentExpense);
                        let dataExpense = EditExpenseController.currentExpense.data();

                        setTotalValue(dataExpense.totalValue || 0);

                        //specific properties             
                        setService(dataExpense.othersdatas.service || null);
                        if (dataExpense.othersdatas.dateReminder) {
                            setDateReminder(new Date(dataExpense.othersdatas.dateReminder.seconds * 1000 + dataExpense.othersdatas.dateReminder.nanoseconds / 1000000));
                        } else {
                            setDateReminder(null);
                        }
                        setIsEnabled(dataExpense.othersdatas.dateReminder ? true : false);
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
    }, []));


    function clearStates() {
        console.log('clearing states ...');
        setCurrentExpense(null);
        setTotalValue(0);

        //specific properties
        setService(null);
        setDateReminder(null);
        setIsEnabled(false);
        if (selectServiceRef) {
            selectServiceRef.current?.reset();
        }
    }


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
            service: service,
            dateReminder: isEnabled ? dateReminder : false
        }
    }

    return (
        <BaseExpense
            title='mechanic expense'
            type='MECHANIC'
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
        
            {/* dropdown: usado para selecionar o serviço e atualizar o txtinput */}
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
                        </View>
                    );
                }}
                renderItem={(item, index, isSelected) => {
                    return (<View style={{ ...DefaultStyles.dropdownTextView, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                        <Text style={DefaultStyles.dropdownText}>{_.capitalize(Trans.t(item))}</Text>
                    </View>);
                }}
                onSelect={(selectedItem, index) => {
                    setService(serviceList[index]);
                }}
                ref={selectServiceRef}
            />

            <TotalValue totalValue={totalValue} setTotalValue={setTotalValue} missingData={missingData}/>

            <View style={{ width: '100%', alignItems: 'flex-start', flexDirection: 'row', marginBottom: 10 }}>
                <Switch
                    trackColor={{ false: "#767577", true: "rgba(0,124,118,0.6)" }}
                    thumbColor={isEnabled ? "#007C76" : DefaultStyles.colors.fundoInput}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={enabled => setIsEnabled(enabled)}
                    value={isEnabled}
                />
                <TouchableWithoutFeedback
                    onPress={() => setIsEnabled(!isEnabled)}
                >
                    <Text style={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, color: DefaultStyles.colors.tabBar }}>
                        {_.capitalize(Trans.t('service review reminder'))}
                    </Text>
                </TouchableWithoutFeedback>
            </View>

            {
                isEnabled ? <DateComponent date={dateReminder} setDate={setDateReminder} /> : false
            }

        </BaseExpense>
    );
};


export default MechanicsExpense;