import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  ScrollView
} from 'react-native';

export default function App() {
  const [nome, setNome] = useState('');
  const [personagem, setPersonagem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const buscarPersonagem = async () => {
    setLoading(true);
    setErro('');
    setPersonagem(null);

    try {
      const response = await fetch('https://hp-api.onrender.com/api/characters');
      const data = await response.json();

      const resultado = data.find((p) => {
        const nomeMatch = p.name.toLowerCase().includes(nome.toLowerCase());
        const altMatch = p.alternate_names.some((alt) =>
          alt.toLowerCase().includes(nome.toLowerCase())
        );
        return nomeMatch || altMatch;
      });

      if (resultado) {
        setPersonagem(resultado);
      } else {
        setErro('Personagem não encontrado 😢');
      }
    } catch (e) {
      setErro('Erro ao buscar dados da API');
    }

    setLoading(false);
  };

  const getCorCasa = () => {
    if (!personagem) return '#000';

    if (personagem.hogwartsStaff) {
      return 'transparent'; 
    }

    if (personagem.hogwartsStudent) {
      switch (personagem.house) {
        case 'Gryffindor':
          return '#7F0909';
        case 'Slytherin':
          return '#0D6217';
        case 'Ravenclaw':
          return '#0E1A40';
        case 'Hufflepuff':
          return '#EEE117';
        default:
          return '#333';
      }
    }

    return '#333';
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <Image
        source={require('./assets/HP_bg.png')}
        style={styles.background}
      />


      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.titulo}>PERSONAGENS DE HARRY POTTER</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite o nome completo do personagem"
          placeholderTextColor="#888"
          value={nome}
          onChangeText={setNome}
        />

        <TouchableOpacity style={styles.botao} onPress={buscarPersonagem}>
          <Text style={styles.botaoTexto}>Procurar</Text>
        </TouchableOpacity>
        
        {loading && <ActivityIndicator size="large" color="#fff" />}

        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
      
        {personagem && (
          <View style={[styles.card, { backgroundColor: getCorCasa() }]}>

            {personagem.hogwartsStaff && (
              <Image
                source={require('./assets/castle_bg.jpg')}
                style={styles.castelo}
              />
            )}

            <Image
              source={{ uri: personagem.image }}
              style={styles.imagem}
            />

            <Text style={styles.nome}>{personagem.name}</Text>
            <Text style={styles.texto}>
              Outros nomes: {personagem.alternate_names.length > 0 
                ? personagem.alternate_names.join(', ') 
                : 'Nenhum'}
            </Text>
            <Text style={styles.ator}>Ator: {personagem.actor}</Text>

            <Text style={styles.subtitulo}>Dados pessoais</Text>

            <Text style={styles.texto}>
              Bruxo: {personagem.wizard ? 'Sim' : 'Não'}
            </Text>
            <Text style={styles.texto}>Espécie: {personagem.species}</Text>
            <Text style={styles.texto}>Ancestralidade: {personagem.ancestry}</Text>
            <Text style={styles.texto}>Gênero: {personagem.gender}</Text>
            <Text style={styles.texto}>Olhos: {personagem.eyeColour}</Text>
            <Text style={styles.texto}>Cabelo: {personagem.hairColour}</Text>
            <Text style={styles.texto}>Nascimento: {personagem.dateOfBirth}</Text>
            <Text style={styles.texto}>
              Vivo: {personagem.alive ? 'Sim' : 'Não'}
            </Text>

            <Text style={styles.subtitulo}>Varinha e Patrono</Text>

            <Text style={styles.texto}>Madeira: {personagem.wand.wood}</Text>
            <Text style={styles.texto}>Interior: {personagem.wand.core}</Text>
            <Text style={styles.texto}>Comprimento: {personagem.wand.lenght}</Text>
            <Text style={styles.texto}>patrono: {personagem.patronus}</Text>

          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  content: {
    padding: 20,
    alignItems: 'center',
  },

  titulo: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
  },

  input: {
    width: '90%',
    backgroundColor: '#fff',
    color: '#111',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  botao: {
    backgroundColor: '#6200ea',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },

  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },

  erro: {
    color: 'red',
    marginTop: 10,
  },

  card: {
    width: '100%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },

  imagem: {
    width: 150,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },

  nome: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },

  ator: {
    color: '#fff',
    marginBottom: 10,
  },

  subtitulo: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },

  texto: {
    color: '#fff',
  },

  castelo: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 15,
    opacity: 1,
  },
});

// Perguntei como que eu fazia pra ele conferir os apelidos alem do nome do personagem
// Os outros nomes estavam vindo todos juntos, aí pedi ajuda para deixar com virgulas entre os elementos, e escrever nenhum caso não tivesse nada
// Eu queria que o fundo ficasse da cor da casa do personagem, ou se fosse funcionario aparecesse o castelo, mas não tava conseguindo direito fazensdo só if e else
// A parte do carregar e do erro eu tive que perguntar pro chatgpt

