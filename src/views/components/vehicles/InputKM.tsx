import React from "react";
import Utils from "../../../controllers/Utils";
import { HelperText, TextInput } from "react-native-paper";
import { DefaultProps } from "../../DefaultProps";
import { DefaultStyles } from "../../DefaultStyles";
import Trans from '../../../controllers/internatiolization/Trans';
import _ from 'lodash';
import { RFValue } from "react-native-responsive-fontsize";

interface InputKMProps {
    km ? : number,
    setKM : (km:number)=>void,
    ref ? : React.RefObject<HTMLElement>
}

function InputKM(props: InputKMProps) : JSX.Element {

    return (
        <>
            <TextInput        
                {...DefaultProps.textInput}            
                style={DefaultStyles.textInput}
                ref={props?.ref}
                keyboardType='decimal-pad' 
                label={`${_.capitalize(Trans.t('actual kilometers'))}`} 
                maxLength={7}
                //color={defaultStyle.colors.tabBar}                             
                onChangeText={(text:string) => {
                    //if (text.includes(',')) return
                    //if (text.includes('.')) return
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
                    props.setKM(Utils.toNumber(Utils.toNumericText(text)));
                }}
                value={(props?.km||0).toString()} />
            <HelperText
                style={DefaultStyles.defaultHelperText}            
                type="error"
                visible={false}
            >
                {_.capitalize(Trans.t('enter a value'))}
            </HelperText>
        </>
    );
};

export default InputKM;