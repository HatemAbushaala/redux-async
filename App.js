import React, { useEffect } from 'react';
import {
  TouchableHighlight,
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableHighlightComponent,
  TouchableOpacity,
} from 'react-native';

import { combineReducers, createStore, applyMiddleware } from 'redux';
import { useSelector, useDispatch, Provider } from 'react-redux';

import thunk from 'redux-thunk';
import axios from 'axios';

const getTodos = () => {
  return async (dispatch) => {
    try {
      let data = await axios.get('https://jsonplaceholder.typicode.com/todos');
      console.log('finish fetching');
      dispatch({ type: 'GET_TODOS', data });
    } catch (err) {
      console.log(err);
    }
  };
};
const getTodoInfo = (id) => {
  console.log('todo id', id);
  return async (dispatch) => {
    try {
      let data = await axios.get(
        `https://jsonplaceholder.typicode.com/todos/${id}`
      );
      console.log('finish fetching inforamtion');
      dispatch({ type: 'GET_INFO', data });
    } catch (err) {
      //console.log(err);
    }
  };
};

const reducer = (state = [], action) => {
  if (action.type == 'GET_TODOS') {
    console.log(action.data.data.length);
    return action.data.data;
  } else if (action.type == 'GET_INFO') {
    console.log(action.data.data);
    return state;
  } else {
    return state;
  }
};

const store = createStore(
  combineReducers({
    todos: reducer,
  }),
  applyMiddleware(thunk)
);

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <Home />
      </SafeAreaView>
    </Provider>
  );
}

const Home = (props) => {
  let data = useSelector((state) => state.todos);
  let dispatch = useDispatch();

  useEffect(() => {
    console.log('use effect');
    dispatch(getTodos());
  }, [dispatch]);

  const getInfo = (id) => {
    dispatch(getTodoInfo(id));
  };

  return (
    <View>
      <FlatList
        keyExtractor={(item) => item.id.toString()}
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => getInfo(item.id)}
          >
            <Text>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    margin: 8,
    padding: 16,
    backgroundColor: '#ffd',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
