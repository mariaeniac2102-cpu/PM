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
 
import { cadastrarProfessor } from '../services/api';
 
export default function CadastroProfessores({ navigation }) {
 
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [formacao, setFormacao] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [rua, setRua] = useState('');
 const [numero, setNumero] = useState('');
 const [cep, setCep] = useState('');
 const [bairro, setBairro] = useState('');
 const [ehCoordenador, setEhCoordenador] = useState(false);
 const [carregando, setCarregando] = useState(false);

 
  
const cadastrar = async () => {
  if (!nome.trim()) {
    Alert.alert('Atenção', 'Digite o nome do professor.');
    return;
  }

  if (!cpf.trim()) {
    Alert.alert('Atenção', 'Digite o CPF do professor.');
    return;
  }

  if (!formacao.trim()) {
    Alert.alert('Atenção', 'Digite a formação acadêmica.');
    return;
  }

  if (!rua.trim() || !bairro.trim() || !cep.trim()) {
    Alert.alert('Atenção', 'Preencha rua, bairro e CEP.');
    return;
  }

  try {
    setCarregando(true);

    console.log('Enviando cadastro de professor...');

    const resposta = await cadastrarProfessor({
      nome: nome.trim(),
      cpf: cpf.trim(),
      formacao: formacao.trim(),
      email: email.trim(),
      telefone: telefone.trim(),
      rua: rua.trim(),
      numero: numero.trim(),
      cep: cep.trim(),
      bairro: bairro.trim(),
      eh_coordenador: ehCoordenador,
    });

    console.log('Resposta do PHP:', resposta);

    const mensagem =
      resposta.mensagem || 'Professor cadastrado com sucesso!';

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
    console.log('Erro ao cadastrar professor:', erro);

    const mensagem =
      erro.message || 'Não foi possível cadastrar o professor.';

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
        Cadastro de Professor
      </Text>
 
      <Text style={styles.subtitulo}>
        Preencha os dados do professor
      </Text>
 
      <Text style={styles.label}>
        Nome completo
      </Text>
 
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do professor"
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
  Formação acadêmica
      </Text>

      <TextInput
       style={styles.input}
       placeholder="Ex.: Pedagogia"
       value={formacao}
       onChangeText={setFormacao}
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
      
      <Text style={styles.label}>Rua</Text>
<TextInput
  style={styles.input}
  placeholder="Digite o nome da rua"
  value={rua}
  onChangeText={setRua}
/>

<Text style={styles.label}>Número da casa</Text>
<TextInput
  style={styles.input}
  placeholder="Digite o número"
  value={numero}
  onChangeText={setNumero}
  keyboardType="numeric"
/>

<Text style={styles.label}>CEP</Text>
<TextInput
  style={styles.input}
  placeholder="Digite o CEP"
  value={cep}
  onChangeText={setCep}
  keyboardType="numeric"
  maxLength={9}
/>

<Text style={styles.label}>Bairro</Text>
<TextInput
  style={styles.input}
  placeholder="Digite o bairro"
  value={bairro}
  onChangeText={setBairro}
/>

<Text style={styles.label}>Cidade</Text>
<TextInput
  style={styles.input}
  value="São José dos Campos"
  editable={false}
/>

<Text style={styles.label}>Estado</Text>
<TextInput
  style={styles.input}
  value="São Paulo - SP"
  editable={false}
/>
<Text style={styles.label}>
  O professor também é coordenador?
</Text>

<View style={styles.opcoesCoordenador}>
  <TouchableOpacity
    style={[
      styles.opcaoCoordenador,
      ehCoordenador && styles.opcaoSelecionada,
    ]}
    onPress={() => setEhCoordenador(true)}
  >
    <Text style={styles.textoOpcao}>Sim</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.opcaoCoordenador,
      !ehCoordenador && styles.opcaoSelecionada,
    ]}
    onPress={() => setEhCoordenador(false)}
  >
    <Text style={styles.textoOpcao}>Não</Text>
  </TouchableOpacity>
</View>
      <TouchableOpacity
        style={styles.botao}
        onPress={cadastrar}
        disabled={carregando}
      >
 
        <Text style={styles.textoBotao}>
          {carregando ? 'Cadastrando...' : 'Cadastrar Professor'}
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
  opcoesCoordenador: {
  flexDirection: 'row',
  gap: 10,
  marginBottom: 18,
},

opcaoCoordenador: {
  flex: 1,
  padding: 14,
  borderWidth: 1,
  borderColor: '#CCCCCC',
  borderRadius: 8,
  alignItems: 'center',
},

opcaoSelecionada: {
  backgroundColor: '#D6E9FF',
  borderColor: '#1976D2',
},

textoOpcao: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#1565C0',
},
 
});
 