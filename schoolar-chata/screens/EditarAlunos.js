import React, { useState } from 'react';
 
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
 
import { editarAluno } from '../services/api';
 
export default function EditarAluno({ route, navigation }) {
 
  const aluno = route.params?.aluno || {};
 
  const [nome, setNome] = useState(aluno.nome || '');
  const [cpf, setCpf] = useState(aluno.cpf || '');
  const [email, setEmail] = useState(aluno.email || '');
  const [telefone, setTelefone] = useState(aluno.telefone || '');
  const [dataNascimento, setDataNascimento] = useState(aluno.data_nascimento || '');
  const [salvando, setSalvando] = useState(false);
 
  async function salvarAlteracoes() {
 
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Digite o nome do aluno.');
      return;
    }
 
    if (!cpf.trim()) {
      Alert.alert('Atenção', 'Digite o CPF do aluno.');
      return;
    }
 
    try {
 
      setSalvando(true);
 
      const resposta = await editarAluno(aluno.id_aluno, {
        nome,
        cpf,
        email,
        telefone,
        data_nascimento: dataNascimento,
      });
 
      if (Platform.OS === 'web') {
 
        window.alert(resposta.mensagem || 'Alterações salvas com sucesso!');
 
        navigation.goBack();
 
      } else {
 
        Alert.alert(
          'Sucesso',
          resposta.mensagem || 'Alterações salvas com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
 
    } catch (erro) {
 
      console.log('Erro ao salvar alterações:', erro);
 
      const mensagemErro = erro.message || 'Não foi possível salvar as alterações.';
 
      if (Platform.OS === 'web') {
        window.alert(mensagemErro);
      } else {
        Alert.alert('Erro', mensagemErro);
      }
 
    } finally {
 
      setSalvando(false);
    }
  }
 
  return (
    <ScrollView contentContainerStyle={styles.container}>
 
      <Text style={styles.titulo}>Editar Aluno</Text>
 
      <Text style={styles.subtitulo}>
        Altere os dados do aluno
      </Text>
 
      <View style={styles.formulario}>
 
        <Text style={styles.label}>Nome</Text>
 
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Digite o nome"
        />
 
        <Text style={styles.label}>CPF</Text>
 
        <TextInput
          style={styles.input}
          value={cpf}
          onChangeText={setCpf}
          placeholder="Digite o CPF"
          keyboardType="numeric"
        />
 
        <Text style={styles.label}>Data de nascimento</Text>
 
        <TextInput
          style={styles.input}
          value={dataNascimento}
          onChangeText={setDataNascimento}
          placeholder="DD/MM/AAAA"
          keyboardType="numeric"
        />
 
        <Text style={styles.label}>E-mail</Text>
 
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Digite o e-mail"
          keyboardType="email-address"
        />
 
        <Text style={styles.label}>Telefone</Text>
 
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          placeholder="Digite o telefone"
          keyboardType="phone-pad"
        />
 
        <TouchableOpacity
          style={styles.botao}
          onPress={salvarAlteracoes}
          disabled={salvando}
        >
          <Text style={styles.textoBotao}>
            {salvando ? 'Salvando...' : '💾 Salvar Alterações'}
          </Text>
        </TouchableOpacity>
 
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoBotaoVoltar}>
            Voltar
          </Text>
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
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
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
 