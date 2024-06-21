import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { DefaultStyles } from "../DefaultStyles";
import Trans from "../../controllers/internatiolization/Trans";
import _ from 'lodash';
/**
 * Botao cancelar padrao para uso no app
 * @author Alencar
 * @created 2022-10-06
 */
function ButtonCancel(props) : JSX.Element {
    return (
        <TouchableOpacity {...props} style={DefaultStyles.buttonCancel}>
            <Text style={DefaultStyles.textButton}>
                {_.capitalize(Trans.t(props.text || 'cancel'))}
            </Text>
        </TouchableOpacity>
    );
       
} 

export default ButtonCancel;