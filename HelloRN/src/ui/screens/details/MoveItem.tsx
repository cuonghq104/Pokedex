import React, {useEffect, useState} from "react";
import {GetMoveDetailInformation, GetPokemonDetailInformation} from "../../../services/ApiPokemon";
import {AxiosResponse} from "axios";
import {View, StyleSheet, Image, TouchableOpacity} from "react-native";
import AppText from "../../components/text/AppText";
import _ from "lodash"
import {Colors} from "../../../common";
import {elementBackground} from "./NameAndElements";
import {StatInterface} from "./DetailScreen";

interface Props {
  id: number
}

const damageClassIcon: StatInterface = {
  "status": require('../../../assets/icon/ic_status.png'),
  "physical": require('../../../assets/icon/ic_attack.png'),
  "special": require('../../../assets/icon/ic_special.png'),
}

const MoveItem: React.FC<Props> = (props) => {
  const [detail, setDetail] = useState<any>({id: props.id})

  useEffect(() => {
    GetMoveDetailInformation(props.id).then((data: any) => {
      setDetail(data)
    })
  }, [])

  const getNameFromDetail = () => {
    if (detail && detail.names) {
      const name = _.find(detail.names, (name: any) => name.language.name === 'en')
      return name.name;
    }
    return "";
  }

  const getDamageIcon: any = () => {
    if (detail && detail.damage_class) {
      return detail.damage_class.name;
    }
    return "status";
  }

  return (
    <TouchableOpacity style={[styles.container, detail && detail.type ? {backgroundColor: elementBackground[detail.type.name]} : {}]}>
      <Image
        style={{width: 16, height: 16}}
        source={damageClassIcon[getDamageIcon()]}
      />
      <AppText style={styles.name}>
        {getNameFromDetail()}
      </AppText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  name: {
    color: Colors.COLOR_WHITE,
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 5,
    marginRight: 10
  }
})
export default MoveItem;