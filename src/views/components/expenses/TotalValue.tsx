import { HelperText, TextInput } from "react-native-paper";
import { DefaultProps } from "../../DefaultProps";
import { DefaultStyles } from "../../DefaultStyles";
import Trans from "../../../controllers/internatiolization/Trans";
import _ from 'lodash';
import Utils from "../../../controllers/Utils";
import { RFValue } from "react-native-responsive-fontsize";

function TotalValue(props) {
    let otherProps = {};
    if (Utils.hasValue(props.maxLength||null)) {
        otherProps.maxLength = props.maxLength
    }
    return <>
        <TextInput
            {...DefaultProps.textInput}
            style={[DefaultStyles.textInput,props.style || {}]}
            keyboardType='numeric'
            label={`* ${_.capitalize(Trans.t(props.label || 'total value'))}`}
            onChangeText={value => props.setTotalValue(Utils.toNumber(value))}
            placeholder='R$'
            placeholderTextColor='#666'
            value={props.totalValue ? props.totalValue.toString() : null}
            {...otherProps}
        />
        <HelperText
            style={DefaultStyles.defaultHelperText}            
            type="error"
            visible={props.missingData && !props.totalValue}
        >
            {_.capitalize(Trans.t('enter value'))}
        </HelperText>
    </>
}

export {TotalValue};