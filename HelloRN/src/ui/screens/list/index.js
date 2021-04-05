import React, {useEffect, useState} from 'react'
import {FlatList, View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native'
import {GetPokemonList} from "../../../services/ApiPokemon";
import {Utils} from "../../../common";

export default function ListScreen({navigation}) {

  const backgroundColors = ['#ffcdd2', '#f8bbd0', '#e1bee7', '#d1c4e9', '#c5cae9', '#c5cae9', '#c5cae9', '#b2ebf2', '#b2dfdb']

  useEffect(() => {
    fetchPokemonList(1)
  }, [])

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  function fetchPokemonList(page) {
    GetPokemonList((page - 1) * 30).then(({results}) => {
        const newData = [...data, ...results];
      console.log('result::', newData);
      setData(newData)
      }
    )
  }

  const renderListData = (data) => {
    const {url} = data;
    const id = Utils.exactIdFromUrl(url);

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Detail', {
            id
          })
        }}
        style={styles.container(backgroundColors[id % backgroundColors.length])}>
        <View style={{padding: 10}}>
          <Image
            source={{
              uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
            }}
            style={{width: 100, height: 100}}
          />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <FlatList
      keyExtractor={item => "#" + item}
      data={data}
      renderItem={({item}) => renderListData(item)}
      numColumns={3}
      onEndReached={() => {
        fetchPokemonList(page + 1)
        setPage(page + 1)
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: (backgroundColor) => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor,
    margin: 10,
    borderRadius: 10
  })
})