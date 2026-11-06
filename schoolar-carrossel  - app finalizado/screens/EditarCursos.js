
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

import { editarCurso, listarCursos } from '../services/api';

export default function EditarCursos({ route, navigation }) {

  const cursoOriginal = route.params?.curso || {};

  const [curso, setCurso] = useState(cursoOriginal.curso || '');
  const [cargaHoraria, setCargaHoraria] = useState(
    cursoOriginal.carga_horaria
      ? String(cursoOriginal.carga_horaria)
      : ''
  );
  const [duracao, setDuracao] = useState(cursoOriginal.duracao || '');
  const [descricao, setDescricao] = useState(cursoOriginal.descricao || '');

  const [coordenadores, setCoordenadores] = useState([]);
  const [idCoordenador, setIdCoordenador] = useState(
    cursoOriginal.id_coordenador
      ? String(cursoOriginal.id_coordenador)
      : ''
  );

  const [carregandoCoordenadores, setCarregandoCoordenadores] =
    useState(true);

  const [salvando, setSalvando] = useState(false);

  // Busca os coordenadores cadastrados
  async function carregarCoordenadores() {
    try {
      setCarregandoCoordenadores(true);

      const resposta = await listarCursos();

      setCoordenadores(resposta.coordenadores || []);

    } catch (erro) {
      console.log('Erro ao carregar coordenadores:', erro);
      mostrarMensagem('Erro', 'Não foi possível carregar os coordenadores.');
    } finally {
      setCarregandoCoordenadores(false);
    }
  }

  useEffect(() => {
    carregarCoordenadores();
  }, []);

  async function salvarAlteracoes() {

    if (!cursoOriginal.id_curso) {
      mostrarMensagem('Erro', 'Não foi possível identificar o curso.');
      return;
    }

    if (!curso.trim()) {
      mostrarMensagem('Atenção', 'Digite o nome do curso.');
      return;
    }

    if (!cargaHoraria.trim() || Number(cargaHoraria) <= 0) {
      mostrarMensagem('Atenção', 'Digite uma carga horária válida.');
      return;
    }

    if (!duracao.trim()) {
      mostrarMensagem('Atenção', 'Digite a duração do curso.');
      return;
    }

    if (!idCoordenador) {
      mostrarMensagem('Atenção', 'Selecione um coordenador.');
      return;
    }

    try {
      setSalvando(true);

      const dadosCurso = {
        curso: curso.trim(),
        carga_horaria: Number(cargaHoraria),
        duracao: duracao.trim(),
        descricao: descricao.trim(),
        id_coordenador: Number(idCoordenador),
      };

      const resposta = await editarCurso(
        cursoOriginal.id_curso,
        dadosCurso
      );

      if (Platform.OS === 'web') {
        window.alert(
          resposta.mensagem || 'Curso atualizado com sucesso!'
        );

        navigation.goBack();

      } else {
        Alert.alert(
          'Sucesso',
          resposta.mensagem || 'Curso atualizado com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }

    } catch (erro) {
      console.log('Erro ao editar curso:', erro);

      mostrarMensagem(
        'Erro',
        erro.message || 'Não foi possível salvar as alterações.'
      );

    } finally {
      setSalvando(false);
    }
  }

  function mostrarMensagem(titulo, mensagem) {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}\n\n${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.titulo}>Editar Curso</Text>

      <Text style={styles.subtitulo}>
        Altere os dados do curso
      </Text>

      <View style={styles.formulario}>

        <Text style={styles.label}>Nome do curso</Text>
        <TextInput
          style={styles.input}
          value={curso}
          onChangeText={setCurso}
          placeholder="Digite o nome do curso"
        />

        <Text style={styles.label}>Carga horária</Text>
        <TextInput
          style={styles.input}
          value={cargaHoraria}
          onChangeText={setCargaHoraria}
          placeholder="Digite a carga horária"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Duração</Text>
        <TextInput
          style={styles.input}
          value={duracao}
          onChangeText={setDuracao}
          placeholder="Ex.: 3 semestres"
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.inputDescricao]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Digite a descrição do curso"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Coordenador responsável</Text>

        {carregandoCoordenadores ? (
          <Text style={styles.aviso}>
            Carregando coordenadores...
          </Text>
        ) : coordenadores.length === 0 ? (
          <Text style={styles.aviso}>
            Nenhum coordenador disponível.
          </Text>
        ) : (
          coordenadores.map((coordenador) => (
            <TouchableOpacity
              key={coordenador.id_coordenador}
              style={[
                styles.opcaoCoordenador,
                String(coordenador.id_coordenador) === idCoordenador &&
                  styles.opcaoSelecionada,
              ]}
              onPress={() =>
                setIdCoordenador(String(coordenador.id_coordenador))
              }
              disabled={salvando}
            >
              <Text style={styles.textoOpcao}>
                {coordenador.nome}
              </Text>

              {String(coordenador.id_coordenador) === idCoordenador && (
                <Text style={styles.selecionado}>✓ Selecionado</Text>
              )}
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity
          style={[
            styles.botao,
            salvando && styles.botaoDesativado,
          ]}
          onPress={salvarAlteracoes}
          disabled={salvando || carregandoCoordenadores}
        >
          <Text style={styles.textoBotao}>
            {salvando ? 'Salvando...' : '💾 Salvar Alterações'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
          disabled={salvando}
        >
          <Text style={styles.textoBotaoVoltar}>Voltar</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingVertical: 30,
  },

  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1565C0',
  },

  subtitulo: {
    fontSize: 17,
    color: '#666',
    marginBottom: 30,
  },

  formulario: {
    width: '90%',
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 5,
    marginTop: 10,
  },

  input: {
    width: '100%',
    minHeight: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },

  inputDescricao: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },

  opcaoCoordenador: {
    width: '100%',
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: '#FFFFFF',
  },

  opcaoSelecionada: {
    backgroundColor: '#D6E9FF',
    borderColor: '#1976D2',
    borderWidth: 2,
  },

  textoOpcao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
  },

  selecionado: {
    fontSize: 13,
    color: '#1976D2',
    marginTop: 5,
  },

  aviso: {
    fontSize: 14,
    color: '#777',
    marginTop: 10,
  },

  botao: {
    width: '100%',
    height: 55,
    backgroundColor: '#1976D2',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },

  botaoDesativado: {
    opacity: 0.6,
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  botaoVoltar: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#1976D2',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },

  textoBotaoVoltar: {
    color: '#1976D2',
    fontSize: 16,
    fontWeight: 'bold',
  },

});
