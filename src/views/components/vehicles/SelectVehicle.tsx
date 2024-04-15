import React, { useEffect, useState } from 'react'
import { Dimensions, View } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import { Text, TextInput } from 'react-native-paper';
import { DefaultProps } from '../../DefaultProps';
import { DefaultStyles } from '../../DefaultStyles';
import SelectDropdown from 'react-native-select-dropdown';
import Vehicles from '../../../database/models/Vehicles';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Models from '../../../database/models/Models';
import _ from "lodash";
import AuthController from '../../../controllers/AuthController';


//SELECT VEICULO
function SelectVehicle(props) : JSX.Element {
    const [loading,setLoading] = useState(false);
    const [loaded,setLoaded] = useState(false); 
    const [list,setList] = useState(props?.list || []);
    const [selected,setSelected] = useState(null);


    //carregamento dos dados do banco
    useEffect(() => {
        if (!loading && !loaded && !list.length) {
            setLoading(true);
            (async () => {
                try {
                    let newVehiclesCollection = await AuthController.getLoggedUser().ref.collection('vehicles').get();
                    let newVehicles = [];
                    newVehiclesCollection.forEach(el=>{
                        newVehicles.push({
                            id:el.id,
                            name:`${el.data().model.id}-${el.data().plate}`
                        })
                    });
                    setList(newVehicles);
                    let newSelected = newVehicles.find(el=>el.id == props.selectedId)||null;
                    setSelected(newSelected);
                } catch (e) {
                    console.log('error on selectvehicle',e);                    
                } finally {
                    setLoaded(true);
                    setLoading(false);                
                }
            })();
        } else if (loaded) {
            if (props.selectedId) {
                let newSelected = list.find(el=>el.id == props.selectedId)||null;
                setSelected(newSelected);
            }
        }
    });

        
        
    return (                        
            <SelectDropdown
                dropdownStyle={DefaultStyles.dropdownMenuStyle}
                search={true}
                showsVerticalScrollIndicator={true}                            
                data={list}
                defaultValue={selected}
                renderButton={(selectedItem, isOpened) => {
                    return (
                        <View>
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}
                                label='Veículo'
                                value={selectedItem?.name || ''}
                                pointerEvents="none"
                                readOnly
                            />
                        </View>
                    );
                }}
                renderItem={(item, index, isSelected) => {
                    return (<View style={{...DefaultStyles.dropdownTextView, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                            <Text style={DefaultStyles.dropdownText}>{item.name}</Text>
                    </View>);
                }}
                ref={props?.ref}
                onSelect={(selectedItem, index) => props.setSelected(selectedItem?.id||null)}
            />
    );
};

export default SelectVehicle;