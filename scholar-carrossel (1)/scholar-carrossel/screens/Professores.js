import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function Professores({ voltar }) {

  return (

    <View style={styles.container}>

      <Text style={styles.titulo}>
        Professores
      </Text>

      <Text style={styles.subtitulo}>
        Gerenciamento de Professores
      </Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={() =>
          Alert.alert(
            'Aviso',
            'Tela de cadastro será criada em breve.'
          )
        }
      >
        <Text style={styles.textoBotao}>
          Cadastrar Professor
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() =>
          Alert.alert(
            'Aviso',
            'Tela de consulta será criada em breve.'
          )
        }
      >
        <Text style={styles.textoBotao}>
          Consultar Professor
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() =>
          Alert.alert(
            'Aviso',
            'Tela de edição será criada em breve.'
          )
        }
      >
        <Text style={styles.textoBotao}>
          Editar Professor
        </Text>
      </TouchableOpacity>


      
    </View>

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

  botao: {

    width: '80%',

    backgroundColor: '#1976D2',

    padding: 15,

    borderRadius: 10,

    marginBottom: 15,

    alignItems: 'center',

  },

  textoBotao: {

    fontSize: 18,

    fontWeight: 'bold',

    color: '#FFFFFF',

  },


 
});