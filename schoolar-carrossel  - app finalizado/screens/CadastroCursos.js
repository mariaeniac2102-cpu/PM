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

import {
  cadastrarCurso,
  listarCursos,
} from '../services/api';

export default function CadastroCursos({ navigation }) {

  const [curso, setCurso] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [duracao, setDuracao] = useState('');
  const [descricao, setDescricao] = useState('');

  const [coordenadores, setCoordenadores] = useState([]);
  const [idCoordenador, setIdCoordenador] = useState('');

  const [carregando, setCarregando] = useState(false);
  const [carregandoCoordenadores, setCarregandoCoordenadores] = useState(true);

  // Carrega os coordenadores cadastrados no banco
  useEffect(() => {
    carregarCoordenadores();
  }, []);

  const carregarCoordenadores = async () => {
    try {
      const resposta = await listarCursos();

      setCoordenadores(resposta.coordenadores || []);

    } catch (erro) {
      console.log('Erro ao carregar coordenadores:', erro);

      const mensagem = 'Não foi possível carregar os coordenadores.';

      if (Platform.OS === 'web') {
        window.alert(mensagem);
      } else {
        Alert.alert('Erro', mensagem);
      }

    } finally {
      setCarregandoCoordenadores(false);
    }
  };

  // Realiza o cadastro do curso
  const cadastrar = async () => {

    if (!curso.trim()) {
      Alert.alert('Atenção', 'Digite o nome do curso.');
      return;
    }

    if (!cargaHoraria.trim() || Number(cargaHoraria) <= 0) {
      Alert.alert('Atenção', 'Digite uma carga horária válida.');
      return;
    }

    if (!duracao.trim()) {
      Alert.alert('Atenção', 'Digite a duração do curso.');
      return;
    }

    if (!idCoordenador) {
      Alert.alert('Atenção', 'Selecione um coordenador.');
      return;
    }

    try {
      setCarregando(true);

      console.log('Enviando cadastro de curso...');

      const resposta = await cadastrarCurso({
        curso: curso.trim(),
        carga_horaria: Number(cargaHoraria),
        duracao: duracao.trim(),
        descricao: descricao.trim(),
        id_coordenador: Number(idCoordenador),
      });

      console.log('Resposta do PHP:', resposta);

      const mensagem =
        resposta.mensagem || 'Curso cadastrado com sucesso!';

      if (Platform.OS === 'web') {
        window.alert(mensagem);
        navigation.goBack();
      } else {
        Alert.alert('Cadastro realizado', mensagem, [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }

    } catch (erro) {
      console.log('Erro ao cadastrar curso:', erro);

      const mensagem =
        erro.message || 'Não foi possível cadastrar o curso.';

      if (Platform.OS === 'web') {
        window.alert(mensagem);
      } else {
        Alert.alert('Erro no cadastro', mensagem);
      }

    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >

      <Text style={styles.titulo}>
        Cadastro de Curso
      </Text>

      <Text style={styles.subtitulo}>
        Preencha os dados do curso
      </Text>

      <Text style={styles.label}>
        Nome do curso
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o nome do curso"
        value={curso}
        onChangeText={setCurso}
      />

      <Text style={styles.label}>
        Carga horária
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ex.: 1200"
        value={cargaHoraria}
        onChangeText={setCargaHoraria}
        keyboardType="numeric"
      />

      <Text style={styles.label}>
        Duração
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ex.: 3 semestres"
        value={duracao}
        onChangeText={setDuracao}
      />

      <Text style={styles.label}>
        Descrição
      </Text>

      <TextInput
        style={[styles.input, styles.inputDescricao]}
        placeholder="Digite uma descrição para o curso"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <Text style={styles.label}>
        Coordenador responsável
      </Text>

      {carregandoCoordenadores ? (

        <Text style={styles.aviso}>
          Carregando coordenadores...
        </Text>

      ) : coordenadores.length === 0 ? (

        <Text style={styles.aviso}>
          Nenhum coordenador ativo encontrado.
        </Text>

      ) : (

        <View style={styles.listaCoordenadores}>

          {coordenadores.map((coordenador) => (

            <TouchableOpacity
              key={coordenador.id_coordenador}
              style={[
                styles.opcaoCoordenador,
                String(idCoordenador) === String(coordenador.id_coordenador)
                  && styles.opcaoSelecionada,
              ]}
              onPress={() =>
                setIdCoordenador(String(coordenador.id_coordenador))
              }
            >

              <Text style={styles.textoOpcao}>
                {coordenador.nome}
              </Text>

              {String(idCoordenador) === String(coordenador.id_coordenador) && (
                <Text style={styles.selecionado}>
                  ✓
                </Text>
              )}

            </TouchableOpacity>

          ))}

        </View>

      )}

      <TouchableOpacity
        style={styles.botao}
        onPress={cadastrar}
        disabled={carregando || carregandoCoordenadores}
      >

        <Text style={styles.textoBotao}>
          {carregando ? 'Cadastrando...' : 'Cadastrar Curso'}
        </Text>

        <Text style={styles.emoji}>
          💾
        </Text>

      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    backgroundColor: '#F5FCFF',
    padding: 20,
  },

  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1565C0',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitulo: {
    fontSize: 17,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 7,
  },

  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 18,
    fontSize: 16,
  },

  inputDescricao: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },

  listaCoordenadores: {
    marginBottom: 18,
  },

  opcaoCoordenador: {
    width: '100%',
    minHeight: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  opcaoSelecionada: {
    backgroundColor: '#D6E9FF',
    borderColor: '#1976D2',
  },

  textoOpcao: {
    fontSize: 16,
    color: '#333',
  },

  selecionado: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565C0',
  },

  aviso: {
    fontSize: 15,
    color: '#666',
    marginBottom: 18,
  },

  botao: {
    width: '100%',
    height: 60,
    backgroundColor: '#1976D2',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  textoBotao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  emoji: {
    fontSize: 22,
    marginTop: 2,
  },

});
