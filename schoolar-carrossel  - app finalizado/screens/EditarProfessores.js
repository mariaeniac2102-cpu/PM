
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

import { editarProfessor } from '../services/api';

export default function EditarProfessores({ route, navigation }) {

  const professor = route.params?.professor || {};

  const temInformacaoCoordenador =
    professor.eh_coordenador !== undefined &&
    professor.eh_coordenador !== null;

  const [nome, setNome] = useState(professor.nome || '');
  const [cpf, setCpf] = useState(
    professor.cpf ? String(professor.cpf) : ''
  );
  const [formacao, setFormacao] = useState(professor.formacao || '');
  const [email, setEmail] = useState(professor.email || '');
  const [telefone, setTelefone] = useState(
    professor.telefone ? String(professor.telefone) : ''
  );

  // A rua e o número da casa ficam juntos
  const [rua, setRua] = useState(professor.rua || '');
  const [cep, setCep] = useState(
    professor.cep ? String(professor.cep) : ''
  );
  const [bairro, setBairro] = useState(professor.bairro || '');

  const [ehCoordenador, setEhCoordenador] = useState(
    Number(professor.eh_coordenador) === 1 ||
    professor.eh_coordenador === true
  );

  const [salvando, setSalvando] = useState(false);

  async function salvarAlteracoes() {

    if (!professor.id_professor) {
      mostrarMensagem('Erro', 'Não foi possível identificar o professor.');
      return;
    }

    if (!nome.trim()) {
      mostrarMensagem('Atenção', 'Digite o nome do professor.');
      return;
    }

    if (!cpf.trim()) {
      mostrarMensagem('Atenção', 'Digite o CPF do professor.');
      return;
    }

    if (!formacao.trim()) {
      mostrarMensagem('Atenção', 'Digite a formação do professor.');
      return;
    }

    if (!rua.trim() || !bairro.trim() || !cep.trim()) {
      mostrarMensagem(
        'Atenção',
        'Preencha a rua, o número da casa, o bairro e o CEP.'
      );
      return;
    }

    try {
      setSalvando(true);

      const dadosProfessor = {
        nome: nome.trim(),
        cpf: cpf.trim(),
        formacao: formacao.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        rua: rua.trim(),
        cep: cep.trim(),
        bairro: bairro.trim(),
      };

      // Só envia a opção quando a consulta já informa
      // se o professor é coordenador.
      if (temInformacaoCoordenador) {
        dadosProfessor.eh_coordenador = ehCoordenador;
      }

      const resposta = await editarProfessor(
        professor.id_professor,
        dadosProfessor
      );

      if (Platform.OS === 'web') {
        window.alert(
          resposta.mensagem || 'Professor atualizado com sucesso!'
        );

        navigation.goBack();
      } else {
        Alert.alert(
          'Sucesso',
          resposta.mensagem || 'Professor atualizado com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }

    } catch (erro) {
      console.log('Erro ao editar professor:', erro);

      const mensagemErro =
        erro.message || 'Não foi possível salvar as alterações.';

      mostrarMensagem('Erro', mensagemErro);

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

      <Text style={styles.titulo}>Editar Professor</Text>

      <Text style={styles.subtitulo}>
        Altere os dados do professor
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

        <Text style={styles.label}>Formação</Text>
        <TextInput
          style={styles.input}
          value={formacao}
          onChangeText={setFormacao}
          placeholder="Digite a formação"
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Digite o e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          placeholder="Digite o telefone"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Bairro</Text>
        <TextInput
          style={styles.input}
          value={bairro}
          onChangeText={setBairro}
          placeholder="Digite o bairro"
        />

        <Text style={styles.label}>Rua e número da casa</Text>
        <TextInput
          style={styles.input}
          value={rua}
          onChangeText={setRua}
          placeholder="Ex.: Av. Central, 100"
        />

        <Text style={styles.label}>CEP</Text>
        <TextInput
          style={styles.input}
          value={cep}
          onChangeText={setCep}
          placeholder="Digite o CEP"
          keyboardType="numeric"
        />

        {temInformacaoCoordenador ? (
          <>
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
                disabled={salvando}
              >
                <Text style={styles.textoOpcao}>Sim</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.opcaoCoordenador,
                  !ehCoordenador && styles.opcaoSelecionada,
                ]}
                onPress={() => setEhCoordenador(false)}
                disabled={salvando}
              >
                <Text style={styles.textoOpcao}>Não</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.avisoCoordenador}>
            A opção de coordenador ficará disponível após atualizar
            a consulta de professores.
          </Text>
        )}

        <TouchableOpacity
          style={[
            styles.botao,
            salvando && styles.botaoDesativado,
          ]}
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

  opcoesCoordenador: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
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

  avisoCoordenador: {
    fontSize: 14,
    color: '#777',
    marginTop: 15,
    marginBottom: 10,
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
