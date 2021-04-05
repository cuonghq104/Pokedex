import React, {useContext, useState, useEffect} from "react";
import {GetMoveDetailInformation, GetPokemonDetailInformation} from "../../../services/ApiPokemon";
import {View, Image, StyleSheet, Text, TouchableOpacity, FlatList, ScrollView} from "react-native";
import {AxiosResponse} from "axios";
import AppText from "../../components/text/AppText";
import Toast from 'react-native-toast-message';
import NameAndElements from "./NameAndElements";
import _ from "lodash"
import MoveItem from "./MoveItem";
import AbilityDetail from "./Ability";
import SpeciesDetail from "./SpeciesDetail";

interface Props {
  navigation?: any;
  route?: any
}

export interface StatInterface {
  [key: string]: any,
}

interface Detail {
  name: string,
  types: Array<any>,
  stats: Array<any>,
  species: any
}

interface Move {
  id: number,
  name?: string,
  type?: any,
  accuracy?: number
  description?: string,
  effect?: string
}

interface Ability {
  url: string,
  name?: string,
  shortEffect: string,
  description: string
}

const statIcons: StatInterface = {
  'hp': require('../../../assets/icon/ic_hp.png'),
  'attack': require('../../../assets/icon/ic_attack.png'),
  'special-attack': require('../../../assets/icon/ic_special_attack.png'),
  'speed': require('../../../assets/icon/ic_speed.png'),
  'defense': require('../../../assets/icon/ic_defense.png'),
  'special-defense': require('../../../assets/icon/ic_special_defense.png'),
}

const DetailScreen: React.FC<Props> = ({navigation, route}) => {
  const backgroundColors = ['#ffcdd2', '#f8bbd0', '#e1bee7', '#d1c4e9', '#c5cae9', '#c5cae9', '#c5cae9', '#b2ebf2', '#b2dfdb']
  console.log('navigation::', navigation, route)
  const {params} = route;
  const {id} = params;

  const [detailData, setDetailData] = useState<Detail>();
  const [move, setMove] = useState<Array<any>>([]);
  const [ability, setAbility] = useState<Array<any>>([]);

  const toMatrix = (arr: Array<any>, width: number) =>
    arr.reduce((rows, key, index) => (index % width == 0 ? rows.push([key])
      : rows[rows.length - 1].push(key)) && rows, []);

  function updateData(data: any) {
    setDetailData(data)
    const moves = data.moves.map((m: any) => {
      const {url} = m.move;
      const urlSplit = url.split('/');
      const id = urlSplit[urlSplit.length - 2];
      return {
        name: m.move.name,
        id,
      }
    })
    const {abilities} = data;
    setMove(moves)
    setAbility(abilities)

    setTimeout(() => {
      getMoveDetailData(data)
    }, 400)
  }

  useEffect(() => {
    GetPokemonDetailInformation(id).then((data: AxiosResponse) => {
      updateData(data)
    })
  }, [])

  const getStatImage = (stat: any) => {
    return statIcons[stat];
  }

  const statItemClick = (stat: string, base_stat: number, effort: number) => {
    showToast(stat.replace('-', ' ').toUpperCase(), `Base stat is ${base_stat} with ${effort} effort value`)
  }

  const statView = () => {
    const stats = detailData?.stats;
    const baseView: Array<any> = [];
    stats && toMatrix(stats, 3).map((row: any) => {
      const rowView: Array<any> = [];
      row.map((s: any) => {
        const {stat, base_stat, effort} = s;
        const view = (
          <TouchableOpacity
            onPress={() => statItemClick(stat.name, base_stat, effort)}
            style={styles.statItemStyle}>
            <Image
              source={getStatImage(stat.name)}
              style={styles.statIcon}
            />
            <AppText style={styles.statText}>
              {base_stat}
              {effort && (
                <AppText style={{color: 'lime'}}>
                  {` +${effort}`}
                </AppText>
              )}
            </AppText>
          </TouchableOpacity>
        )
        rowView.push(view);
      })
      baseView.push(
        <View style={styles.statRowStyle}>
          {rowView}
        </View>
      )
    })
    return (
      <View>
        {baseView}
      </View>
    )
  };

  const onElementPress: (arg0: any) => void = (element: any) => {
    showToast(_.capitalize(element.name), "")
  }

  const summary = () => {
    const name = detailData?.name;
    const types = detailData?.types || [];
    return (
      <View>
        <View
          style={[styles.image, {backgroundColor: backgroundColors[id % backgroundColors.length]}]}>
          <NameAndElements
            name={name}
            types={types}
            onElementPress={(element: any) => onElementPress(element)}
          />
          <View style={{padding: 10, alignSelf: 'center'}}>
            <Image
              source={{
                uri: `https://pokeres.bastionbot.org/images/pokemon/${id}.png`
              }}
              style={{width: 160, height: 160}}
            />
          </View>
        </View>
        {statView()}
      </View>
    )
  }

  const moveSingleItem: any = (data: Move) => {
    return (
      <MoveItem id={data.id} />
    )
  }

  const abilitySingleItem: any = ({ability}: any) => {
    return (
      <AbilityDetail
        url={ability.url}
        backgroundColor={backgroundColors[id % backgroundColors.length]}
      />
    )
  }

  const moveSection = () => {
    return (
      <View>
        <AppText style={styles.sectionTitle}>
          {"Moves"}
        </AppText>
        <FlatList
          keyExtractor={(item, index) => item.name.toString()}
          data={move}
          renderItem={({item}: any) => moveSingleItem(item)}
          horizontal
        />
      </View>
    )
  }

  const abilitySection = () => {
    return (
      <View>
        <AppText style={styles.sectionTitle}>
          {"Abilities"}
        </AppText>
        <FlatList
          keyExtractor={(item, index) => item.ability.name.toString()}
          data={ability}
          renderItem={({item}: any) => abilitySingleItem(item)}
          horizontal
        />
      </View>
    )
  }

  const message = () => {
    return (
      <Toast ref={(ref) => Toast.setRef(ref)} />
    )
  }

  const getMoveDetailData = (data: any) => {
    let detailMoveList = [...move]

    data.moves.map((m: any, index: number) => {
      const {url} = m.move;
      const urlSplit = url.split('/');
      const id = urlSplit[urlSplit.length - 2];

      GetMoveDetailInformation(id).then((detail: any) => {
        if (detailMoveList && detailMoveList[index]) {
          detailMoveList[index].name = getNameFromResponse(detail)
          setMove(detailMoveList)
        }
      })
    })
  }

  const speciesDetail = () => {
    const url = detailData?.species;
    return (
      <View>
        {url && <SpeciesDetail url={url?.url} />}
      </View>
    )
  }

  return (
    <ScrollView>
      <View style={{flex: 1, padding: 10}}>
        {summary()}
        {/*{moveSection()}*/}
        {/*{abilitySection()}*/}
        {speciesDetail()}
        {message()}
      </View>
    </ScrollView>
  )

  function getNameFromResponse(data: any): string {
    const name = _.find(data.names, (name: any) => name.language.name === 'en')
    return name.name;
  }

  function getTypeFromResponse(data: any): string {
    return data.type;
  }


  function getMoveDetailFromApi(id: number, position: number) {
    GetMoveDetailInformation(id).then((data: any) => {

    })
  }

  function showToast(message: string, subMessage?: string) {
    Toast.show({
      type: 'info',
      position: 'bottom',
      text1: message,
      text2: subMessage,
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
  }
}


const styles = StyleSheet.create({
  image: {
    justifyContent: 'center',
    borderRadius: 10
  },
  statRowStyle: {
    flexDirection: 'row'
  },
  statItemStyle: {
    flex: 1,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statIcon: {
    width: 30,
    height: 30
  },
  statText: {
    marginLeft: 10,
    width: 60,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 16,
    marginTop: 24,
    marginBottom: 16,
  },
})

export default DetailScreen