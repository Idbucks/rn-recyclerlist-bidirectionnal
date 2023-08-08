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
  console.log('type', type, data);
  return (
    <View key={data?._id} style={{ width: '100%' }}>
      <View
        style={{
          padding: 10,
        }}
      >
        <Text>Published by {data?.text}</Text>
      </View>
      <View
        style={{
          backgroundColor:
            '#' + Math.floor(Math.random() * 16777215).toString(16),
          height: 450,
        }}
      />
      <View
        style={{
          padding: 10,
          marginBottom: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          flex: 1,
        }}
      >
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
    {
      _id: 4,
      text: 'Jordan',
    },
    {
      _id: 5,
      text: 'Marie',
    },
    {
      _id: 6,
      text: 'Nicolas',
    },
  ]);

  const [layoutProvider] = useState(
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

  // useEffect(() => {
  //   if (pictures.length > 3) {
  //     setDataProvider((p) => p.appendRows(pictures));
  //   }
  // }, [pictures]);

  const onStartReached = async () => {
    setTimeout(() => {
      console.log('--- 1. onStartReached');
      setDataProvider((p) => {
        return p.prependRows([
          {
            _id: -4,
            text: 'Alexis',
          },
          {
            _id: -3,
            text: 'Maria',
          },
          {
            _id: -2,
            text: 'Cindy',
          },
          {
            _id: -1,
            text: 'Manon',
          },
          {
            _id: 0,
            text: 'Maena',
          },
        ]);
      });
    }, 1000);
  };
  const onEndReached = async () => {};

  return (
    <View style={styles.container}>
      <View style={{ minHeight: 1, width: '100%' }}>
        <RecyclerListView
          layoutProvider={layoutProvider}
          dataProvider={dataProvider}
          rowRenderer={(type, data) => renderImage(type, data)}
          // onStartReached={onStartReached}
          // onStartReachedThreshold={400}
          onEndReached={onEndReached}
          onEndReachedThreshold={400}
          isHorizontal={false}
          forceNonDeterministicRendering={true}
          initialRenderIndex={3}
          renderAheadOffset={0}
          scrollViewProps={{
            showsVerticalScrollIndicator: false,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
