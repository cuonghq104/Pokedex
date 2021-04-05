import React from "react";
import {View, StyleSheet, TouchableOpacity, Image} from "react-native"
import AppText from "../../components/text/AppText";
import {Colors} from "../../../common";

interface Props {
  name?: string,
  types: Array<any>,
  onElementPress: any
}

interface ElementInterface {
  [key: string]: any,
}

export const elementBackground: ElementInterface = {
  'bug': Colors.COLOR_TEAL,
  'dark': Colors.COLOR_DARK_GREY,
  'dragon': Colors.COLOR_DARK_INDIGO,
  'electric': Colors.COLOR_DARK_YELLOW,
  'fairy': Colors.COLOR_DARK_PINK,
  'fire': Colors.COLOR_DARK_RED,
  'fighting': Colors.COLOR_DARK_AMBER,
  'flying': Colors.COLOR_DARK_LIME,
  'ghost': Colors.COLOR_DARK_INDIGO,
  'grass': Colors.COLOR_GREEN,
  'ground': Colors.COLOR_DARK_BROWN,
  'ice': Colors.COLOR_LIGHT_BLUE,
  'normal': Colors.COLOR_GREY,
  'poison': Colors.COLOR_DARK_PURPLE,
  'psychic': Colors.COLOR_DARK_DEEP_ORANGE,
  'steel': Colors.COLOR_DARK_DEEP_PURPLE,
  'water': Colors.COLOR_DARK_BLUE,
}

const elementIcon: ElementInterface = {
  'bug': require('../../../assets/icon/ic_bug.png'),
  'dark': require('../../../assets/icon/ic_dark.png'),
  'dragon': require('../../../assets/icon/ic_dragon.png'),
  'electric': require('../../../assets/icon/ic_electric.png'),
  'fairy': require('../../../assets/icon/ic_fairy.png'),
  'fire': require('../../../assets/icon/ic_fire.png'),
  'fighting': require('../../../assets/icon/ic_fighting.png'),
  'flying': require('../../../assets/icon/ic_flying.png'),
  'ghost': require('../../../assets/icon/ic_ghost.png'),
  'grass': require('../../../assets/icon/ic_grass.png'),
  'ground': require('../../../assets/icon/ic_ground.png'),
  'ice': require('../../../assets/icon/ic_ice.png'),
  'normal': require('../../../assets/icon/ic_normal.png'),
  'poison': require('../../../assets/icon/ic_poison.png'),
  'psychic': require('../../../assets/icon/ic_psychic.png'),
  'steel': require('../../../assets/icon/ic_steel.png'),
  'water': require('../../../assets/icon/ic_water.png'),
}

interface Type {
  name: string
}

interface Element {
  type: Type
}

const NameAndElements: React.FC<Props> = (props) => {
  const {name, types, onElementPress} = props;
  return (
    <View style={styles.container}>
      <AppText style={styles.name}>
        {name?.toUpperCase()}
      </AppText>
      <View style={styles.elementContainer}>
        {
          types.map((type: Element) => (
            <TouchableOpacity
              onPress={() => onElementPress(type.type)}
              style={[styles.elementIconContainer, {backgroundColor: elementBackground[type.type.name]}]}
            >
              <Image
                source={elementIcon[type.type.name]}
                style={{width: 12, height: 12}}
              />
            </TouchableOpacity>
          ))
        }
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 10
  },
  elementContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  name: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 16,
  },
  elementIconContainer: {
    backgroundColor: 'red',
    padding: 4,
    borderRadius: 12,
    marginRight: 2
  }
})

export default NameAndElements;