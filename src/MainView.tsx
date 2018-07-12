import * as React from 'react'
import { Component } from 'react'
import { Dimensions } from 'react-native'
import { Image } from 'react-native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { observer } from 'mobx-react'
import { ScreenOrientation } from 'expo'
import { StatusBar } from 'react-native'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import './ArrayExtensions'
import { FooterView } from './FooterView'
import { GridView } from './GridView'
import { Settings } from './Settings'

@observer
export default class MainView extends Component {
  constructor(props: {}, context?: any) {
    super(props, context)

    ScreenOrientation.allow(ScreenOrientation.Orientation.LANDSCAPE)
    this.updateWindowSize()
    Dimensions.addEventListener('change', () => {
      this.updateWindowSize()
    })
  }

  private updateWindowSize() {
    const windowSize = Dimensions.get('window')
    Settings.instance.windowSize = {
      height: windowSize.height,
      width: windowSize.width
    }
  }

  public render() {
    return (
      <View style={this.getMainStyle()}>
        <StatusBar hidden={true} />
        <Text style={this.getHeaderStyle()}>
          Desert Walk
        </Text>
        <View style={this.getGridWrapperStyle()}>
          <Image
            source={require('./50713-transparent.png')}
            style={{
              backgroundColor: Settings.instance.colors.gridBackgroundColor,
              height: Settings.instance.windowSize.height,
              position: 'absolute',
              resizeMode: 'repeat',
              width: Settings.instance.windowSize.width
            }}
          />
          <GridView/>
        </View>
        <FooterView/>
        {isIphoneX()
          ?
            <View
              style={{
                height: 12
              }}
            />
          :
            undefined
        }
      </View>
    )
  }

  private getGridWrapperStyle(): ViewStyle {
    return {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center'
    }
  }

  private getHeaderStyle(): TextStyle {
    return {
      backgroundColor: Settings.instance.colors.mainBackgroundColor,
      color: 'white',
      fontWeight: '600',
      paddingBottom: 4,
      paddingTop: 4,
      textAlign: 'center',
      zIndex: 10 // TODO: Figure out why this is necessary.
    }
  }

  private getMainStyle(): ViewStyle {
    return {
      backgroundColor: Settings.instance.colors.mainBackgroundColor,
      flex: 1,
      flexDirection: 'column'
    }
  }
}