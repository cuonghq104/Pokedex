import React, {useEffect, useState} from "react";
import {View, StyleSheet, Image, ScrollView, FlatList} from "react-native";
import AppText from "../../components/text/AppText";
import {Colors, Utils} from "../../../common";
import {GetEvolutionInformation, GetSpicyDetailInformation} from "../../../services/ApiPokemon";
import _ from "lodash";
import ApiHelper from "../../../services/ApiHelper";

const getHabitatIcon = (name) => {
  switch (name) {
    case "cave":
      return require('../../../assets/icon/ic_habitat_cave.png');
    case "forest":
      return require('../../../assets/icon/ic_habitat_forest.png');
    case "grassland":
      return require('../../../assets/icon/ic_habitat_grassland.png');
    case "mountain":
      return require('../../../assets/icon/ic_habitat_mountain.png');
    case "rare":
      return require('../../../assets/icon/ic_habitat_rare.png');
    case "rough-terrain":
      return require('../../../assets/icon/ic_habitat_rough_terrain.png');
    case "sea":
      return require('../../../assets/icon/ic_habitat_sea.png');
    case "urban":
      return require('../../../assets/icon/ic_habitat_urban.png');
    default:
      return require('../../../assets/icon/ic_habitat_water_edge.png');
  }
}

const getGrowthRateColor = (rate) => {
  switch (rate) {
    case "slow":
      return Colors.COLOR_GREEN;
    case "medium":
      return Colors.COLOR_ORANGE;
    case "fast":
      return Colors.COLOR_RED;
    default:
      return Colors.COLOR_PURPLE;
  }
}

interface Props {
  url: string
}

interface EvolutionData {
  species?: any,
  trigger?: any,
  minLevel?: number,
}

const SpeciesDetail: React.FC<Props> = ({url}) => {

  const [detail, setDetail] = useState<any>()
  const [evolutionData, setEvolutionData] = useState<Array<any>>()

  function fetchSpicyDetailInformation() {
    const urlSplit = url.split('/');
    const id = urlSplit[urlSplit.length - 2];

    GetSpicyDetailInformation(id).then((data: any) => {
      setDetail(data)
      getEvolutionData(data)
    })
  }

  function getEvolutionData({evolution_chain}) {
    const {url} = evolution_chain;
    const id = Utils.exactIdFromUrl(url);

    GetEvolutionInformation(id).then((data) => {
      let {chain} = data;
      let exactData: Array<EvolutionData> = [];
      while (chain) {
        const pokData: EvolutionData = {};
        pokData.species = chain.species;
        if (chain.evolution_details && chain.evolution_details.length > 0) {
          const {trigger, min_level} = chain.evolution_details[0];
          const evolveData = {
            trigger,
            minLevel: min_level
          }
          exactData.push(evolveData)
        }
        exactData.push(pokData);
        chain = chain.evolves_to.length === 0 ? undefined : chain.evolves_to[0];
      }
      setEvolutionData(exactData)
    })
  }

  useEffect(() => {
    fetchSpicyDetailInformation()
  }, [])

  const information = (title: string, detail: any) => {
    return (
      <View style={styles.informationContainer}>
        <AppText style={styles.informationTitle} numberOfLines={1}>{title}</AppText>
        <View style={styles.informationDetail}>
          {detail}
        </View>
      </View>
    )
  }

  const shape = detail?.shape;
  const color = detail?.color;
  const habitat = detail?.habitat;
  const growthRate = detail?.growth_rate;

  const detailInformation = () => {
    return (
      <View>
        <AppText style={styles.sectionTitle}>
          {"Species detail"}
        </AppText>
        <View style={styles.rowInformationContainer}>
          {information("Shape", (
            <AppText style={styles.shapeDetail} numberOfLines={1}>
              {_.capitalize(shape?.name)}
            </AppText>
          ))}
          {information("Habitat", (
            <View style={styles.colorDetailContainer}>
              <Image source={getHabitatIcon(habitat?.name)} style={styles.habitatIcon} />
              <AppText style={styles.colorDetail} numberOfLines={1}>
                {_.capitalize(_.replace(habitat?.name, new RegExp("-", "g"), " "))}
              </AppText>
            </View>
          ))}
        </View>
        <View style={styles.rowInformationContainer}>
          {information("Color", (
            <View style={styles.colorDetailContainer}>
              <View style={[styles.colorDetailExample, {backgroundColor: color ? color?.name : "blue"}]} />
              <AppText style={styles.colorDetail} numberOfLines={1}>{_.capitalize(color?.name)}</AppText>
            </View>
          ))}
          {information("Growth rate", (
            <AppText style={[styles.shapeDetail, {color: getGrowthRateColor(growthRate?.name)}]} numberOfLines={1}>
              {Utils.formatNameFromServer(growthRate?.name)}
            </AppText>
          ))}
        </View>
      </View>
    )
  }

  const speciesBlock = (id, name) => (
    <View style={{alignItems: 'center'}}>
      <Image
        source={{uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}}
        style={{width: 100, height: 100, resizeMode: 'contain'}}
        resizeMode="contain"
      />
      <AppText style={styles.evolutionSpicy}>
        {_.capitalize(name)}
      </AppText>
    </View>
  )

  const getEvolveIcon = (type) => {
    switch (type) {
      case "level-up":
        return require('../../../assets/icon/ic_level_up.png');
      default:
        return require('../../../assets/icon/ic_level_up.png');
    }
  }

  const evolveBlock = (data) => {
    return (
      <View style={{alignItems: 'center'}}>
        <Image
          source={getEvolveIcon(data?.trigger?.name)}
          style={{width: 25, height: 25, resizeMode: 'contain'}}
          resizeMode="contain"
        />
        <AppText style={styles.evolutionSpicy}>
          {`Lv${data.minLevel}`}
        </AppText>
      </View>
    )
  }

  const evolutionItem = (data) => {
    const {species, minLevel, trigger} = data;
    const id = species ? Utils.exactIdFromUrl(species.url) : 0;
    return (
      <View style={{alignItems: 'center'}}>
        {species ? speciesBlock(id, species?.name) : evolveBlock(data)}
      </View>
    )
  }

  const evolutionChart = () => {
    return (
      <View>
        <AppText style={styles.sectionTitle}>
          {"Evolution chart"}
        </AppText>

        <FlatList
          keyExtractor={(item) => item.species ? item.species.name : `${item.trigger.name}${item.minLevel}`}
          data={evolutionData}
          renderItem={({item}) => evolutionItem(item)}
          horizontal
          contentContainerStyle={{alignItems: 'center'}}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {detailInformation()}
      {evolutionChart()}
    </View>
  )
}

export default SpeciesDetail;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  },
  informationTitle: {
    fontSize: 12
  },
  informationDetail: {
    flexDirection: 'row-reverse'
  },
  rowInformationContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  informationContainer: {
    flexDirection: 'column', flex: 1, paddingVertical: 8, borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors.COLOR_GREY,
    marginHorizontal: 8,
    paddingHorizontal: 4,
    alignItems: 'center'
  },
  shapeDetail: {
    fontWeight: 'bold'
  },
  colorDetailContainer: {
    flexDirection: "row",
    alignItems: 'center'
  },
  colorDetail: {
    fontWeight: "bold"
  },
  colorDetailExample: {width: 16, height: 16, borderRadius: 4, marginRight: 4},
  habitatIcon: {
    width: 24,
    height: 24,
    marginRight: 4
  },
  evolutionSpicy: {
    fontSize: 8,
    fontFamily: 'PressStart2P-Regular',
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: 16,
    marginTop: 24,
    marginBottom: 16,
  },
})