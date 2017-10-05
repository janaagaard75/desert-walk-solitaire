import * as React from 'react'
import { observer } from 'mobx-react'
import { Text } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { Component } from 'react'
import { View } from 'react-native'

interface Props {
  disabled: boolean
  onPress: () => any
  title: string
}

@observer
export class GradientButton extends Component<Props, {}> {
  public render() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 10,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            if (this.props.disabled) {
              return
            }

            this.props.onPress()
          }}
          style={{
            borderRadius: 10,
          }}
        >
          <View
            style={{
              backgroundColor: '#448',
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                // fontFamily: 'Gill Sans',
                fontSize: 18,
                margin: 10,
                textAlign: 'center',
              }}
            >
              {this.props.title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}