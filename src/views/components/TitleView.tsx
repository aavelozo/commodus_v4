import React from 'react'
import { Text } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize";
import { DefaultStyles } from '../DefaultStyles';

/**
 * Generic component to show a title on screens
 * @param props 
 * @returns 
 * @author Bruno
 */
function TitleView(props:React.PropsWithChildren) : JSX.Element {
    return <Text style={{ fontSize: RFValue(20), paddingVertical: RFValue(7), fontFamily: 'verdana', color: DefaultStyles.colors.botao }}>
        {props.title}
    </Text>
}

export default TitleView;