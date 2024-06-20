import React from "react";
import Utils from "../../../controllers/Utils";
import { TextInput } from "react-native-paper";
import { DefaultProps } from "../../DefaultProps";
import { DefaultStyles } from "../../DefaultStyles";
import Trans from '../../../controllers/internatiolization/Trans';
import _ from 'lodash';

interface InputKMProps {
    km ? : number,
    setKM : (km:number)=>void,
    ref ? : React.RefObject<HTMLElement>
}

function InputKM(props: InputKMProps) : JSX.Element {

    return (
        <TextInput        
            {...DefaultProps.textInput}            
            style={DefaultStyles.textInput}
            ref={props?.ref}
            keyboardType='numeric' 
            label={`${_.capitalize(Trans.t('actual kilometers'))}`} 
            maxLength={7}
            //color={defaultStyle.colors.tabBar}                             
            onChangeText={(text:string) => {
                if (text.includes(',')) return
                if (text.includes('.')) return
                if (text.includes('-')) return
                if (text.includes(' ')) return
                if (text.includes('/')) return
                if (text.includes('+')) return
                if (text.includes('(')) return
                if (text.includes(')')) return
                if (text.includes('-')) return
                if (text.includes(';')) return
                if (text.includes('#')) return
                if (text.includes('*')) return
                props.setKM(Utils.toNumber(text));
            }}
            value={(props?.km||0).toString()} />
    );
};

export default InputKM;