import React, { useEffect, useRef, useState } from 'react'
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
    const ref = useRef();
    const [list,setList] = useState(props?.list || []);
    //const [selected,setSelected] = useState(props.selected || null);


    //carregamento dos dados do banco
    useEffect(() => {
        console.log('INIT SelectVehicle.useEffect',props.selected);
        if (!loading && !loaded && !list.length) {
            setLoading(true);
            (async () => {
                try {
                    const newVehiclesCollection = await Vehicles.getDBData();
                    let newVehicles = [];
                    newVehiclesCollection.forEach(el=>{
                        newVehicles.push({
                            id:el.id,
                            name:`${el.data().model.id}-${el.data().plate}`
                        })
                    });
                    setList(newVehicles);
                    if (props.selected) {
                        console.log('finding ', props.selected.id);
                        let newSelected = newVehicles.find(el=>el.id == props.selected.id)||null;
                        console.log('founded',newSelected);
                        //setSelected(newSelected);
                        props.setSelected(newSelected);
                    } else {
                        //setSelected(null);
                        props.setSelected(null); 
                        if (props?.ref || ref) {
                            (props?.ref || ref).current?.reset();
                        }
                    }
                } catch (e) {
                    console.log('error on selectvehicle',e);                    
                } finally {
                    setLoaded(true);
                    setLoading(false);                
                }
            })();
        } else if (loaded) {
            if (props.selected) {
                console.log('finding 2 ', props.selected.id);
                let newSelected = list.find(el=>el.id == props.selected.id)||null;
                //setSelected(newSelected);
                console.log('founded 2',newSelected);
                props.setSelected(newSelected);
            } else {
                //setSelected(null);
                props.setSelected(null);
                if (props?.ref || ref) {
                    (props?.ref || ref).current?.reset();
                }
            }
        }
    },[props.selected]);

        
        
    return (                        
            <SelectDropdown
                dropdownStyle={DefaultStyles.dropdownMenuStyle}
                search={true}
                showsVerticalScrollIndicator={true}                            
                data={list}
                defaultValue={props.selected}
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
                ref={props?.ref || ref}
                onSelect={(selectedItem, index) => props.setSelected(selectedItem)}
            />
    );
};

export default SelectVehicle;