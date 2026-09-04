import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Alunos from './screens/Alunos';
import Professores from './screens/Professores';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {

  return (
    <View style={styles.container}>

      <Image
        source={require('./assets/Carrossel.png')}
        style={styles.logo}
      />

      <Text style={styles.titulo}>
        APP Carrossel
      </Text>

      <Text style={styles.subtitulo}>
        Sistema Acadêmico Mobile
      </Text>

      <View style={styles.areaBotoes}>

        {/* ALUNOS */}
        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Alunos')}
        >
          <Text style={styles.textoBotao}>
            Alunos
          </Text>

          <Text style={styles.emoji}>
            🧑‍🎓
          </Text>
        </TouchableOpacity>


        {/* PROFESSORES */}
        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Professores')}
        >
          <Text style={styles.textoBotao}>
            Professores
          </Text>

          <Text style={styles.emoji}>
            👩‍🏫
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Matriculas') }
        >
          <Text style={styles.textoBotao}>
            Matriculas
          </Text>

          <Text style={styles.emoji}>
            ✍️
          </Text>
        </TouchableOpacity>


         <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Turmas') }
        >
          <Text style={styles.textoBotao}>
            Turmas
          </Text>

          <Text style={styles.emoji}>
            🤝
          </Text>
        </TouchableOpacity>


         <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Cursos') }
        >
          <Text style={styles.textoBotao}>
            Cursos
          </Text>

          <Text style={styles.emoji}>
            🖥️
          </Text>
        </TouchableOpacity>


         <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Disciplinas') }
        >
          <Text style={styles.textoBotao}>
            Disciplinas
          </Text>

          <Text style={styles.emoji}>
           📚
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Boletins') }
        >
          <Text style={styles.textoBotao}>
            Boletins
          </Text>

          <Text style={styles.emoji}>
           📑
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Responsaveis') }
        >
          <Text style={styles.textoBotao}>
            Responsaveis
          </Text>

          <Text style={styles.emoji}>
           👨‍👩‍👧‍👦
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Avaliacoes') }
        >
          <Text style={styles.textoBotao}>
            Avaliacoes
          </Text>

          <Text style={styles.emoji}>
           😨
          </Text>
        </TouchableOpacity>

         <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Coordenadores') }
        >
          <Text style={styles.textoBotao}>
            Coordenadores
          </Text>

          <Text style={styles.emoji}>
           🧑‍💼
          </Text>
        </TouchableOpacity>




        {/* SOBRE */}
        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Sobre') }
        >
          <Text style={styles.textoBotao}>
            Sobre
          </Text>

          <Text style={styles.emoji}>
            ℹ️
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}


export default function App() {

  return (
    <NavigationContainer>

      <Stack.Navigator>

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Alunos"
          component={Alunos}
          options={{
            title: 'Alunos',
          }}
        />

        <Stack.Screen
          name="Professores"
          component={Professores}
          options={{
            title: 'Professores',
          }}
        />

       

      </Stack.Navigator>

    </NavigationContainer>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },

  logo: {
    width: 220,
    height: 220,
    marginBottom: 20,
    resizeMode: 'contain',
  },

  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1565C0',
  },

  subtitulo: {
    fontSize: 18,
    marginBottom: 40,
    color: '#666',
  },

  areaBotoes: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },

  botao: {
    width: '45%',
    height: 100,
    backgroundColor: '#1976D2',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoBotao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  emoji: {
    fontSize: 24,
    marginTop: 5,
    textAlign: 'center',
  },

});