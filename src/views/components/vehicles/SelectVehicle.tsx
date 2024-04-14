import React, { useEffect, useState } from 'react'
import { Dimensions, View } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import { TextInput } from 'react-native-paper';
import { DefaultProps } from '../../DefaultProps';
import { DefaultStyles } from '../../DefaultStyles';
import SelectDropdown from 'react-native-select-dropdown';
import Vehicles from '../../../database/models/Vehicles';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Models from '../../../database/models/Models';
import _ from "lodash";


//SELECT VEICULO
function SelectVehicle(props) : JSX.Element {
    const [loading,setLoading] = useState(false);
    const [loaded,setLoaded] = useState(false); 
    const [list,setList] = useState(props?.list || []);
    const [selected,setSelected] = useState(null);
    const [models,setModels] = useState(null);

    //carregamento dos dados do banco
    useEffect(() => {
        if (!loading && !loaded && !list.length) {
            setLoading(true);
            (async () => {
                try {
                    console.log('loading vehicles...');
                    const newVehiclesCollection : any = await firestore().collection('Vehicles').where('idUser','==',auth().currentUser.id).get();
                    let newModels = [];
                    const newModelsCollection = await firestore().collection('Models').get();
                    if (newModelsCollection && newModelsCollection.size > 0) {
                        newModelsCollection.forEach(documentSnapshot => {                                
                            newModels.push({
                                id: documentSnapshot.id,
                                ...documentSnapshot.data()
                            });
                        });    
                    }
                    
                    console.log('newModels',newModels);
                    newModels = _.keyBy(newModels,'id');
                    console.log('newModels',newModels);
                    let newVehicles = [];
                    newVehiclesCollection.forEach(el => {  
                        console.log('el',el);                      
                        let elData = el.data();
                        console.log('elData',elData);
                        elData.id = el.id;
                        elData.modelName = newModels[elData.idModel].name;
                        newVehicles.push(elData);
                    });
                    console.log('loaded vehicles',newVehicles);
                    setList(newVehicles);                    
                    console.log('loading vehicles... ok');
                    
                    setModels(newModels);
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
                {...DefaultProps.selectDropdown}                      
                data={list}
                ref={props?.ref}
                label="Veículo"
                onSelect={(selectedItem, index) => props.setSelected(selectedItem)}
                buttonTextAfterSelection={(selectedItem, index) => `${selectedItem.modelName} - ${selectedItem.plate}`}
                rowTextForSelection={(item, index) => {
                    console.log('before');
                    let result = `${item.modelName} - ${item.plate}`;
                    console.log('mouted',result);
                    console.log('before return' );
                    return result;
                }}
                defaultButtonText={selected
                    ? `${selected?.modelName} - ${selected.plate}`
                    : ' '} 
            />
    );
};

export default SelectVehicle;