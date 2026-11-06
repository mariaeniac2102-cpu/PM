
import React, { useState, useEffect } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';

import { listarCursos, desativarCurso } from '../services/api';

export default function ConsultaCursos({ navigation }) {

  const [pesquisa, setPesquisa] = useState('');

  const [cursos, setCursos] = useState([]);

  const [mensagem, setMensagem] = useState('');

  const [carregando, setCarregando] = useState(false);


  // =====================================================
  // BUSCAR CURSOS
  // =====================================================

  const buscarCursos = async () => {

    try {

      setCarregando(true);

      setMensagem('Carregando cursos...');

      const dados = await listarCursos();

      setCursos(dados.cursos || []);

      setMensagem(
        `${dados.quantidade} curso(s) ativo(s) encontrado(s).`
      );

    } catch (erro) {

      console.log('Erro ao buscar cursos:', erro);

      setCursos([]);

      setMensagem(
        erro.message || 'Não foi possível conectar ao servidor PHP.'
      );

    } finally {

      setCarregando(false);
    }
  };


  // =====================================================
  // DESATIVAR CURSO
  // =====================================================

  const executarDesativacao = async (curso) => {

    try {

      setMensagem('Desativando curso...');

      await desativarCurso(curso.id_curso);

      mostrarMensagem('Sucesso', 'Curso desativado com sucesso!');

      // Atualiza a lista removendo o curso desativado
      setCursos(
        cursos.filter(
          item =>
            item.id_curso !== curso.id_curso
        )
      );

      setMensagem('Curso desativado com sucesso.');

    } catch (erro) {

      console.log('Erro ao desativar curso:', erro);

      mostrarMensagem(
        'Erro',
        erro.message || 'Não foi possível desativar o curso.'
      );
    }
  };


  // =====================================================
  // MENSAGENS
  // =====================================================

  const mostrarMensagem = (titulo, mensagem) => {

    if (Platform.OS === 'web') {

      window.alert(`${titulo}\n\n${mensagem}`);

    } else {

      Alert.alert(titulo, mensagem);
    }
  };


  // =====================================================
  // CONFIRMAR DESATIVAÇÃO
  // =====================================================

  const desativar = (curso) => {

    if (Platform.OS === 'web') {

      const confirmado = window.confirm(
        `Deseja realmente desativar o curso ${curso.curso}?`
      );

      if (confirmado) {
        executarDesativacao(curso);
      }

      return;
    }

    Alert.alert(
      'Desativar curso',

      `Deseja realmente desativar o curso ${curso.curso}?`,

      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },

        {
          text: 'Desativar',
          style: 'destructive',
          onPress: () => executarDesativacao(curso),
        },
      ]
    );
  };


  // =====================================================
  // BUSCAR AUTOMATICAMENTE QUANDO ABRIR A TELA
  // =====================================================

  useEffect(() => {

    buscarCursos();

  }, []);


  // =====================================================
  // FILTRO DE PESQUISA
  // =====================================================

  const cursosFiltrados = cursos.filter((curso) => {

    const nome = curso.curso
      ? curso.curso.toLowerCase()
      : '';

    return nome.includes(
      pesquisa.toLowerCase()
    );
  });


  // =====================================================
  // TELA
  // =====================================================

  return (

    <ScrollView
      contentContainerStyle={styles.container}
    >

      <Text style={styles.titulo}>
        Consulta de Cursos
      </Text>

      <Text style={styles.subtitulo}>
        Cursos ativos
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o nome do curso"
        value={pesquisa}
        onChangeText={setPesquisa}
      />

      <TouchableOpacity
        style={styles.botaoBuscar}
        onPress={buscarCursos}
      >

        <Text style={styles.textoBotao}>
          🔎 Buscar Cursos
        </Text>

      </TouchableOpacity>

      {carregando && (

        <Text style={styles.mensagem}>
          Carregando...
        </Text>

      )}

      {!carregando && mensagem !== '' && (

        <Text style={styles.mensagem}>
          {mensagem}
        </Text>

      )}

      {cursosFiltrados.length === 0 && !carregando && (

        <Text style={styles.semCursos}>
          Nenhum curso encontrado.
        </Text>

      )}

      {cursosFiltrados.map((curso) => (

        <View
          key={curso.id_curso}
          style={styles.card}
        >

          <Text style={styles.nome}>
            {curso.curso}
          </Text>

          <Text style={styles.info}>
            Carga horária: {curso.carga_horaria} horas
          </Text>

          <Text style={styles.info}>
            Duração: {curso.duracao}
          </Text>

          <Text style={styles.info}>
            Descrição: {curso.descricao || 'Não informada'}
          </Text>

          <Text style={styles.info}>
            Coordenador: {curso.nome_coordenador || 'Não informado'}
          </Text>

          <Text style={styles.status}>
            Status: {curso.status}
          </Text>

          <View style={styles.areaBotoes}>

            <TouchableOpacity
              style={styles.botaoEditar}

              onPress={() =>
                navigation.navigate(
                  'EditarCursos',
                  {
                    curso: curso,
                  }
                )
              }
            >

              <Text style={styles.textoBotao}>
                ✏️ Editar
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoExcluir}

              onPress={() =>
                desativar(curso)
              }
            >

              <Text style={styles.textoBotao}>
                🚫 Desativar
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      ))}

    </ScrollView>
  );
}


// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({

  container: {

    flexGrow: 1,

    backgroundColor: '#F5FCFF',

    padding: 20,

    alignItems: 'center',
  },

  titulo: {

    fontSize: 30,

    fontWeight: 'bold',

    color: '#1565C0',

    marginTop: 20,

    marginBottom: 8,

    textAlign: 'center',
  },

  subtitulo: {

    fontSize: 18,

    color: '#666',

    marginBottom: 25,

    textAlign: 'center',
  },

  input: {

    width: '100%',

    height: 50,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,

    borderColor: '#CCC',

    borderRadius: 10,

    paddingHorizontal: 15,

    fontSize: 16,

    marginBottom: 12,
  },

  botaoBuscar: {

    width: '100%',

    height: 50,

    backgroundColor: '#1976D2',

    borderRadius: 10,

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: 15,
  },

  mensagem: {

    fontSize: 15,

    color: '#555',

    marginBottom: 15,

    textAlign: 'center',
  },

  semCursos: {

    fontSize: 17,

    color: '#777',

    marginTop: 30,

    textAlign: 'center',
  },

  card: {

    width: '100%',

    backgroundColor: '#FFFFFF',

    borderRadius: 12,

    padding: 18,

    marginBottom: 15,

    elevation: 3,
  },

  nome: {

    fontSize: 20,

    fontWeight: 'bold',

    color: '#1565C0',

    marginBottom: 10,
  },

  info: {

    fontSize: 15,

    color: '#555',

    marginBottom: 5,
  },

  status: {

    fontSize: 15,

    fontWeight: 'bold',

    color: '#2E7D32',

    marginTop: 5,

    marginBottom: 12,
  },

  areaBotoes: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    marginTop: 10,
  },

  botaoEditar: {

    flex: 1,

    height: 45,

    backgroundColor: '#1976D2',

    borderRadius: 8,

    alignItems: 'center',

    justifyContent: 'center',

    marginRight: 6,
  },

  botaoExcluir: {

    flex: 1,

    height: 45,

    backgroundColor: '#D32F2F',

    borderRadius: 8,

    alignItems: 'center',

    justifyContent: 'center',

    marginLeft: 6,
  },

  textoBotao: {

    color: '#FFFFFF',

    fontSize: 16,

    fontWeight: 'bold',

    textAlign: 'center',
  },

});
