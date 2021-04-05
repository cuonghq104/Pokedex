import React, {useEffect, useState} from "react"
import {TouchableOpacity, View, StyleSheet} from "react-native";
import AppText from "../../components/text/AppText";
import {GetAbilityInformation} from "../../../services/ApiPokemon";
import _ from "lodash";
import {Colors} from "../../../common";

interface Props {
  url: string,
  backgroundColor: string,
}

const AbilityDetail: React.FC<Props> = (props) => {

  const [data, setData] = useState<any>();
  const {backgroundColor} = props

  useEffect(() => {
    const {url} = props;
    const urlSplit = url.split('/');
    const id = urlSplit[urlSplit.length - 2];

    GetAbilityInformation(id).then((response: any) => {
      setData(response);
    })

  }, [])

  const flavorTextEntries = data?.flavor_text_entries
  const effectEntries = data?.effect_entries

  const effect = _.find(flavorTextEntries, (item: any) => item.language.name === 'en')
  const description = _.find(effectEntries, (item: any) => item.language.name === 'en')

  return (
    <TouchableOpacity style={[styles.container, {backgroundColor: backgroundColor}]}>
      <AppText style={styles.name}>{_.capitalize(data?.name)}</AppText>
      <AppText numberOfLines={2} style={styles.effect}>{effect?.flavor_text}</AppText>
      <AppText numberOfLines={4} style={styles.description}>{description?.effect}</AppText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    padding: 8,
    marginRight: 8,
    width: 200,
  },
  name: {
    fontSize: 18,
    color: Colors.COLOR_BLACK
  },
  effect: {
    marginTop: 8,
    fontSize: 12,
  },
  description: {
    marginTop: 4
  }
})
export default AbilityDetail