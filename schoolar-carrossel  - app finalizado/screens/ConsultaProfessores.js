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
 
import { listarProfessores, desativarProfessor } from '../services/api';
 
export default function ConsultaProfessores({ navigation }) {
 
  const [pesquisa, setPesquisa] = useState('');
 
  const [professores, setProfessores] = useState([]);
 
  const [mensagem, setMensagem] = useState('');
 
  const [carregando, setCarregando] = useState(false);
 
 
  // =====================================================
  // BUSCAR ALUNOS
  // =====================================================
 
  const buscarProfessores = async () => {
 
    try {
 
      setCarregando(true);
 
      setMensagem('Carregando professores...');
 
      const dados = await listarProfessores();
 
      setProfessores(dados.professores);
 
      setMensagem(
        `${dados.quantidade} professor(es) ativo(s) encontrado(s).`
      );
 
    } catch (erro) {
 
      console.log('Erro ao buscar professores:', erro);
 
      setProfessores([]);
 
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
 
  const executarDesativacao = async (professor) => {
 
    try {
 
      setMensagem('Desativando professor...');
 
      await desativarProfessor(professor.id_professor);
 
      mostrarMensagem('Sucesso', 'Professor desativado com sucesso!');
 
      // Atualiza a lista removendo o aluno desativado
      setProfessores(
        professores.filter(
          item =>
            item.id_professor !== professor.id_professor
        )
      );
 
      setMensagem(
        'Professor desativado com sucesso.'
      );
 
    } catch (erro) {
 
      console.log(
        'Erro ao desativar:',
        erro
      );
 
      mostrarMensagem(
        'Erro',
        erro.message ||
        'Não foi possível desativar o professor.'
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
 
  const desativar = (professor) => {
 
    console.log('Botão Desativar clicado para o professor:', professor.id_professor, professor.nome);
 
    if (Platform.OS === 'web') {
 
      const confirmado = window.confirm(
        `Deseja realmente desativar o professor ${professor.nome}?`
      );
 
      if (confirmado) {
        executarDesativacao(professor);
      }
 
      return;
    }
 
    Alert.alert(
      'Desativar professor',
 
      `Deseja realmente desativar o professor ${professor.nome}?`,
 
      [
        {
          text: 'Cancelar',
 
          style: 'cancel',
        },
 
        {
          text: 'Desativar',
 
          style: 'destructive',
 
          onPress: () => executarDesativacao(professor),
        },
      ]
    );
  };
 
 
  // =====================================================
  // BUSCAR AUTOMATICAMENTE QUANDO ABRIR A TELA
  // =====================================================
 
  useEffect(() => {
 
    buscarProfessores();
 
  }, []);
 
 
  // =====================================================
  // FILTRO DE PESQUISA
  // =====================================================
 
  const professoresFiltrados = professores.filter((professor) => {
 
    const nome = professor.nome
      ? professor.nome.toLowerCase()
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
        Consulta de Professores
      </Text>
 
 
      <Text style={styles.subtitulo}>
        Professores ativos
      </Text>
 
 
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do professor"
        value={pesquisa}
        onChangeText={setPesquisa}
      />
 
 
      <TouchableOpacity
        style={styles.botaoBuscar}
        onPress={buscarProfessores}
      >
 
        <Text style={styles.textoBotao}>
          🔎 Buscar Professores
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
 
 
      {professoresFiltrados.length === 0 && !carregando && (
 
        <Text style={styles.semProfessores}>
          Nenhum professor encontrado.
        </Text>
 
      )}
 
 
      {professoresFiltrados.map((professor) => (
 
        <View
          key={professor.id_professor}
          style={styles.card}
        >
 
          <Text style={styles.nome}>
            {professor.nome}
          </Text>
 
 
          <Text style={styles.info}>
            CPF: {professor.cpf}
          </Text>
 
 
          <Text style={styles.info}>
            E-mail: {professor.email || 'Não informado'}
          </Text>
 
 
          <Text style={styles.info}>
            Telefone: {professor.telefone || 'Não informado'}
          </Text>
 
 
         <Text style={styles.info}>
          Formação: {professor.formacao || 'Não informada'}
          </Text>
 
 
          <Text style={styles.status}>
            Status: {professor.status}
          </Text>
 
 
          <View style={styles.areaBotoes}>
 
            <TouchableOpacity
              style={styles.botaoEditar}
 
              onPress={() =>
                navigation.navigate(
                  'EditarProfessores',
                  {
                    professor: professor,
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
                desativar(professor)
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
 
 
  semProfessores: {
 
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
 