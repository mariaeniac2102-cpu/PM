import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Alunos from './screens/Alunos';
import CadastroAlunos from './screens/CadastroAlunos';
import ConsultaAlunos from './screens/ConsultaAlunos';
import EditarAlunos from './screens/EditarAlunos';
import Professores from './screens/Professores';
import Matriculas from './screens/Matriculas';
import Turmas from './screens/Turmas';
import Cursos from './screens/Cursos';
import Disciplinas from './screens/Disciplinas';
import Boletins from './screens/Boletins';
import Responsaveis from './screens/Responsaveis';
import Avaliacoes from './screens/Avaliacoes';
import Coordenadores from './screens/Coordenadores';
import Sobre from './screens/Sobre';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('./assets/Carrossel.png')} style={styles.logo} />

      <Text style={styles.titulo}>APP Carrossel</Text>

      <Text style={styles.subtitulo}>Sistema Acadêmico Mobile</Text>

      <View style={styles.areaBotoes}>
        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Alunos')}>
          <Text style={styles.textoBotao}>Alunos</Text>

          <Text style={styles.emoji}>🧑‍🎓</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Professores')}>
          <Text style={styles.textoBotao}>Professores</Text>

          <Text style={styles.emoji}>👩‍🏫</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Matriculas')}>
          <Text style={styles.textoBotao}>Matriculas</Text>

          <Text style={styles.emoji}>✍️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Turmas')}>
          <Text style={styles.textoBotao}>Turmas</Text>

          <Text style={styles.emoji}>🤝</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Cursos')}>
          <Text style={styles.textoBotao}>Cursos</Text>

          <Text style={styles.emoji}>🖥️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Disciplinas')}>
          <Text style={styles.textoBotao}>Disciplinas</Text>

          <Text style={styles.emoji}>📚</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Boletins')}>
          <Text style={styles.textoBotao}>Boletins</Text>

          <Text style={styles.emoji}>📑</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Responsaveis')}>
          <Text style={styles.textoBotao}>Responsaveis</Text>

          <Text style={styles.emoji}>👨‍👩‍👧‍👦</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Avaliacoes')}>
          <Text style={styles.textoBotao}>Avaliacoes</Text>

          <Text style={styles.emoji}>😨</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Coordenadores')}>
          <Text style={styles.textoBotao}>Coordenadores</Text>

          <Text style={styles.emoji}>🧑‍💼</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('Sobre')}>
          <Text style={styles.textoBotao}>Sobre</Text>

          <Text style={styles.emoji}>ℹ️</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
         name="CadastroAlunos"
         component={CadastroAlunos}
         options={{
         title: 'Cadastro de Aluno',
        }}
        />
        <Stack.Screen
         name="ConsultaAlunos"
         component={ConsultaAlunos}
         options={{
         title: 'Consulta de Alunos',
         }}
         />

        <Stack.Screen
         name="EditarAlunos"
         component={EditarAlunos}
         options={{
         title: 'Editar Alunos',
         }}
         />

        <Stack.Screen
          name="Professores"
          component={Professores}
          options={{
            title: 'Professores',
          }}
        />

        <Stack.Screen
          name="Matriculas"
          component={Matriculas}
          options={{
            title: 'Matriculas',
          }}
        />

        <Stack.Screen
          name="Turmas"
          component={Turmas}
          options={{
            title: 'Turmas',
          }}
        />

        <Stack.Screen
          name="Cursos"
          component={Cursos}
          options={{
            title: 'Cursos',
          }}
        />

        <Stack.Screen
          name="Disciplinas"
          component={Disciplinas}
          options={{
            title: 'Disciplinas',
          }}
        />

        <Stack.Screen
          name="Boletins"
          component={Boletins}
          options={{
            title: 'Boletins',
          }}
        />

        <Stack.Screen
          name="Responsaveis"
          component={Responsaveis}
          options={{
            title: 'Responsaveis',
          }}
        />

        <Stack.Screen
          name="Avaliacoes"
          component={Avaliacoes}
          options={{
            title: 'Avaliacoes',
          }}
        />

        <Stack.Screen
          name="Coordenadores"
          component={Coordenadores}
          options={{
            title: 'Coordenadores',
          }}
        />

        <Stack.Screen
          name="Sobre"
          component={Sobre}
          options={{
            title: 'Sobre',
          }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingVertical: 30,
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
