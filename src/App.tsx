import * as React from 'react'
import { Button } from 'react-native'
import { Component } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { Modal } from 'react-native'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { StatusBar } from 'react-native'
import { Text } from 'react-native'
import { TextStyle } from 'react-native'
import { View } from 'react-native'
import { ViewStyle } from 'react-native'

import { Grid } from './Grid'
import { GridView } from './GridView'
import { Size } from './Size'

interface State {
  confirmModalVisible: boolean
}

@observer
export default class App extends Component<{}, State> {
  constructor(props: {}, context?: any) {
    super(props, context)

    this.state = {
      confirmModalVisible: false
    }
  }

  @observable private availableSize: Size | undefined = undefined
  private grid = new Grid()

  public render() {
    const headerStyle: TextStyle = {
      marginTop: 4,
      textAlign: 'center'
    }

    const mainViewStyle: ViewStyle = {
      backgroundColor: '#bbb',
      flex: 1,
      flexDirection: 'column'
    }

    const gridWrapperViewStyle: ViewStyle = {
      flex: 1
    }

    return (
      <View style={mainViewStyle}>
        <StatusBar hidden={true}/>
        <Text style={headerStyle}>
          Desert Walk
        </Text>
        <View
          onLayout={layoutChangeEvent => this.layoutChanged(layoutChangeEvent)}
          style={gridWrapperViewStyle}
        >
          {this.renderGrid()}
        </View>
        <View>
          <Button
            onPress={() => this.confirmUnlessBlocked()}
            title="Start Over"
          />
        </View>
        <Modal
          animationType="slide"
          onRequestClose={() => { alert('Modal has been closed.') }}
          supportedOrientations={['landscape']}
          transparent={false}
          visible={this.state.confirmModalVisible}
        >
          <View style={{ marginTop: 22 }}>
              <Text>Are you sure you want to start over?</Text>
              <Button
                onPress={() => {}}
                title="Yes, start over"
              />
              <Button
                onPress={() => this.hideConfirmModal()}
                title="No, let me continue the game"
              />
          </View>
        </Modal>
      </View>
    )
  }

  private confirmUnlessBlocked() {
    if (this.grid.draggableCards.length >= 1) {
      this.showConfirmModal()
    }
    else {
      this.grid.shuffleDeckAndDealCards()
    }
  }

  private layoutChanged(layoutChangeEvent: LayoutChangeEvent) {
    this.availableSize = {
      height: layoutChangeEvent.nativeEvent.layout.height,
      width: layoutChangeEvent.nativeEvent.layout.width
    }
  }

  private hideConfirmModal() {
    this.setState({
      confirmModalVisible: false
    })
  }

  private renderGrid() {
    if (this.availableSize === undefined) {
      return undefined
    }

    return (
      <GridView
        availableSize={this.availableSize}
        grid={this.grid}
      />
    )
  }

  private showConfirmModal() {
    this.setState({
      confirmModalVisible: true
    })
  }
}