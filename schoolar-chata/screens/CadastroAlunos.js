import React, { useState } from 'react';
 
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
 
import { cadastrarAluno } from '../services/api';
 
export default function CadastroAlunos({ navigation }) {
 
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [carregando, setCarregando] = useState(false);
 
  const cadastrar = async () => {
 
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Digite o nome do aluno.');
      return;
    }
 
    if (!cpf.trim()) {
      Alert.alert('Atenção', 'Digite o CPF do aluno.');
      return;
    }
 
    if (!dataNascimento.trim()) {
      Alert.alert('Atenção', 'Digite a data de nascimento.');
      return;
    }
 
    try {
 
      setCarregando(true);
 
      const resposta = await cadastrarAluno({
        nome,
        cpf,
        data_nascimento: dataNascimento,
        email,
        telefone,
      });
 
      const mensagemSucesso = resposta.mensagem || 'Aluno cadastrado com sucesso!';
 
      if (Platform.OS === 'web') {
 
        window.alert(mensagemSucesso);
 
        navigation.goBack();
 
      } else {
 
        Alert.alert(
          'Cadastro realizado',
          mensagemSucesso,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
 
    } catch (erro) {
 
      console.log('Erro ao cadastrar:', erro);
 
      const mensagemErro = erro.message || 'Não foi possível cadastrar o aluno.';
 
      if (Platform.OS === 'web') {
        window.alert(mensagemErro);
      } else {
        Alert.alert('Erro no cadastro', mensagemErro);
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
        Cadastro de Aluno
      </Text>
 
      <Text style={styles.subtitulo}>
        Preencha os dados do aluno
      </Text>
 
      <Text style={styles.label}>
        Nome completo
      </Text>
 
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do aluno"
        value={nome}
        onChangeText={setNome}
      />
 
      <Text style={styles.label}>
        CPF
      </Text>
 
      <TextInput
        style={styles.input}
        placeholder="Digite o CPF"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
      />
 
      <Text style={styles.label}>
        Data de nascimento
      </Text>
 
      <TextInput
        style={styles.input}
        placeholder="DD/MM/AAAA"
        value={dataNascimento}
        onChangeText={setDataNascimento}
        keyboardType="numeric"
      />
 
      <Text style={styles.label}>
        E-mail
      </Text>
 
      <TextInput
        style={styles.input}
        placeholder="Digite o e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
 
      <Text style={styles.label}>
        Telefone
      </Text>
 
      <TextInput
        style={styles.input}
        placeholder="Digite o telefone"
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
 
      <TouchableOpacity
        style={styles.botao}
        onPress={cadastrar}
        disabled={carregando}
      >
 
        <Text style={styles.textoBotao}>
          {carregando ? 'Cadastrando...' : 'Cadastrar Aluno'}
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
 
  botao: {
    width: '100%',
    height: 60,
    backgroundColor: '#1976D2',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
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
 