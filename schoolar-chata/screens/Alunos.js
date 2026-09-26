import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

export default function Alunos({ navigation }) {
  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Alunos
      </Text>

      <Text style={styles.subtitulo}>
        Gerenciamento de alunos
      </Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate('CadastroAlunos')}
      >
        <Text style={styles.textoBotao}>
          Cadastrar Aluno
        </Text>

        <Text style={styles.emoji}>
          👤
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate('ConsultaAlunos')}
      >
        <Text style={styles.textoBotao}>
          Consultar Alunos
        </Text>

        <Text style={styles.emoji}>
          🔎
        </Text>
      </TouchableOpacity>

     
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 10,
  },

  subtitulo: {
    fontSize: 18,
    color: '#666',
    marginBottom: 35,
  },

  botao: {
    width: '90%',
    height: 100,
    backgroundColor: '#1976D2',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  textoBotao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  emoji: {
    fontSize: 25,
    marginTop: 5,
  },

});