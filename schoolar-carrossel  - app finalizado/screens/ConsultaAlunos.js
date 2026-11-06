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
 
import { listarAlunos, desativarAluno } from '../services/api';
 
export default function ConsultaAlunos({ navigation }) {
 
  const [pesquisa, setPesquisa] = useState('');
 
  const [alunos, setAlunos] = useState([]);
 
  const [mensagem, setMensagem] = useState('');
 
  const [carregando, setCarregando] = useState(false);
 
 
  // =====================================================
  // BUSCAR ALUNOS
  // =====================================================
 
  const buscarAlunos = async () => {
 
    try {
 
      setCarregando(true);
 
      setMensagem('Carregando alunos...');
 
      const dados = await listarAlunos();
 
      setAlunos(dados.alunos);
 
      setMensagem(
        `${dados.quantidade} aluno(s) ativo(s) encontrado(s).`
      );
 
    } catch (erro) {
 
      console.log('Erro ao buscar alunos:', erro);
 
      setAlunos([]);
 
      setMensagem(
        erro.message || 'Não foi possível conectar ao servidor PHP.'
      );
 
    } finally {
 
      setCarregando(false);
    }
  };
 
 
  // =====================================================
  // DESATIVAR ALUNO
  // =====================================================
 
  const executarDesativacao = async (aluno) => {
 
    try {
 
      setMensagem('Desativando aluno...');
 
      await desativarAluno(aluno.id_aluno);
 
      mostrarMensagem('Sucesso', 'Aluno desativado com sucesso!');
 
      // Atualiza a lista removendo o aluno desativado
      setAlunos(
        alunos.filter(
          item =>
            item.id_aluno !== aluno.id_aluno
        )
      );
 
      setMensagem(
        'Aluno desativado com sucesso.'
      );
 
    } catch (erro) {
 
      console.log(
        'Erro ao desativar:',
        erro
      );
 
      mostrarMensagem(
        'Erro',
        erro.message ||
        'Não foi possível desativar o aluno.'
      );
    }
  };
 
  // Alert.alert com múltiplos botões não abre nada no navegador (react-native-web
  // não implementa esse caso). No navegador usamos window.confirm/window.alert.
  const mostrarMensagem = (titulo, mensagem) => {
 
    if (Platform.OS === 'web') {
 
      window.alert(`${titulo}\n\n${mensagem}`);
 
    } else {
 
      Alert.alert(titulo, mensagem);
    }
  };
 
  const desativar = (aluno) => {
 
    console.log('Botão Desativar clicado para o aluno:', aluno.id_aluno, aluno.nome);
 
    if (Platform.OS === 'web') {
 
      const confirmado = window.confirm(
        `Deseja realmente desativar o aluno ${aluno.nome}?`
      );
 
      if (confirmado) {
        executarDesativacao(aluno);
      }
 
      return;
    }
 
    Alert.alert(
      'Desativar aluno',
 
      `Deseja realmente desativar o aluno ${aluno.nome}?`,
 
      [
        {
          text: 'Cancelar',
 
          style: 'cancel',
        },
 
        {
          text: 'Desativar',
 
          style: 'destructive',
 
          onPress: () => executarDesativacao(aluno),
        },
      ]
    );
  };
 
 
  // =====================================================
  // BUSCAR AUTOMATICAMENTE QUANDO ABRIR A TELA
  // =====================================================
 
  useEffect(() => {
 
    buscarAlunos();
 
  }, []);
 
 
  // =====================================================
  // FILTRO DE PESQUISA
  // =====================================================
 
  const alunosFiltrados = alunos.filter((aluno) => {
 
    const nome = aluno.nome
      ? aluno.nome.toLowerCase()
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
        Consulta de Alunos
      </Text>
 
 
      <Text style={styles.subtitulo}>
        Alunos ativos
      </Text>
 
 
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do aluno"
        value={pesquisa}
        onChangeText={setPesquisa}
      />
 
 
      <TouchableOpacity
        style={styles.botaoBuscar}
        onPress={buscarAlunos}
      >
 
        <Text style={styles.textoBotao}>
          🔎 Buscar Alunos
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
 
 
      {alunosFiltrados.length === 0 && !carregando && (
 
        <Text style={styles.semAlunos}>
          Nenhum aluno encontrado.
        </Text>
 
      )}
 
 
      {alunosFiltrados.map((aluno) => (
 
        <View
          key={aluno.id_aluno}
          style={styles.card}
        >
 
          <Text style={styles.nome}>
            {aluno.nome}
          </Text>
 
 
          <Text style={styles.info}>
            CPF: {aluno.cpf}
          </Text>
 
 
          <Text style={styles.info}>
            E-mail: {aluno.email || 'Não informado'}
          </Text>
 
 
          <Text style={styles.info}>
            Telefone: {aluno.telefone || 'Não informado'}
          </Text>
 
 
          <Text style={styles.info}>
            Nascimento:{' '}
            {aluno.data_nascimento || 'Não informado'}
          </Text>
 
 
          <Text style={styles.status}>
            Status: {aluno.status}
          </Text>
 
 
          <View style={styles.areaBotoes}>
 
            <TouchableOpacity
              style={styles.botaoEditar}
 
              onPress={() =>
                navigation.navigate(
                  'EditarAlunos',
                  {
                    aluno: aluno,
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
                desativar(aluno)
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
 
 
  semAlunos: {
 
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
 