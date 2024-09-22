/**
 * Commodus App
 * https://github.com/aavelozo/commodus_v4
 * Faculdade Assis Gurgacz
 * Egenharia de Software 2021
 * TCC
 * 
 * @author Antonio Alencar Velozo
 * @author Bruno Romão
 * @author Carlos Henrique Rosa
 * @author Lucas Henrique do Nascimento
 * @author Richardison Korp
 *
 * @format
 */

import React from 'react';
import { SafeAreaView, useColorScheme,  StatusBar } from 'react-native';
import { NavigationContainer,DefaultTheme, DarkTheme  } from '@react-navigation/native'
import Stack from './src/views/screens/navigation/Stack';
import { ThemeProvider, createTheme } from '@rneui/themed';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'react-native-customizable-toast';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App(): React.JSX.Element {
  const scheme = useColorScheme();
  const theme = createTheme();
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    flex:1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return <GestureHandlerRootView style={{ flex: 1 }}>   
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={backgroundStyle}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme }>
            <Stack />
          </NavigationContainer>
          <Toaster useSafeArea={true} displayFromBottom={true} />
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  </GestureHandlerRootView>
}


export default App;
