import { DefaultStyles } from "./DefaultStyles"

/**
 * Default props to simplify components reuse commonly props
 * @author Alencar
 */
class DefaultProps {
    static textInput = {
        color:DefaultStyles.colors.tabBar,
        activeOutlineColor:DefaultStyles.colors.tabBar,
        selectionColor:'#DDDDDD',
        mode: 'outlined',
        outlineColor:DefaultStyles.colors.tabBar,
    }
}

export {DefaultProps}