import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  RecyclerListView,
  LayoutProvider,
  DataProvider,
} from 'rn-recyclerlist-bidirectionnal';

const renderImage = (type: any, data: any) => {
  return (
    <View style={{ flex: 1, backgroundColor: 'grey' }} key={data?._id}>
      <Text>Published by {data?.text}</Text>
      <View style={{ backgroundColor: 'red', height: 450, width: '100%' }} />
      <View>
        <TouchableOpacity>
          <Text>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text>Like</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function App() {
  const [pictures, setPictures] = useState<any>([
    {
      _id: 1,
      text: 'Guillaume',
    },
    {
      _id: 2,
      text: 'Alex',
    },
    {
      _id: 3,
      text: 'Claire',
    },
  ]);

  const [layoutProvider] = React.useState(
    new LayoutProvider(
      () => 1,
      (_type, dim) => {
        const { width: SCREEN_WIDTH } = Dimensions.get('window');
        dim.width = SCREEN_WIDTH; // Remplacez `SCREEN_WIDTH` par la largeur de l'écran.
        dim.height = 800; // Remplacez `ITEM_HEIGHT` par la hauteur réelle de chaque élément.
      }
    )
  );

  const [dataProvider, setDataProvider] = useState(
    new DataProvider((r1, r2) => {
      return r1?._id !== r2?._id;
    }).cloneWithRows(pictures)
  );

  useEffect(() => {
    setDataProvider((p) => p.cloneWithRows(pictures));
  }, [pictures]);

  const onStartReached = async () => {};
  const onEndReached = async () => {};

  return (
    <View style={styles.container}>
      <RecyclerListView
        style={{
          flex: 1,
          backgroundColor: "blue"
        }}
        layoutProvider={layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={(type, data) => renderImage(type, data)}
        onStartReached={onStartReached}
        onStartReachedThreshold={400}
        onEndReached={onEndReached}
        onEndReachedThreshold={400}
        isHorizontal={false}
        forceNonDeterministicRendering={true}
        initialRenderIndex={1}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
