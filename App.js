import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image, SafeAreaView, Modal, TextInput, Linking } from 'react-native';
import { Feather, SimpleLineIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';

const Card = ({ icon, name, description }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContainer}>
        <Feather name={icon} size={22} color="#555" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
      <SimpleLineIcons name='arrow-right' size={22} color="#555" />
    </View>
  );
};

const Alert = ({ visible, message, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.containerAlert}>
        <View style={styles.alertBox}>
          <Text style={styles.message}>{message}</Text>
          <Button title="OK" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();

  const { nameCurrent, userName, avatarCurrent } = route.params || {};
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [avatar, setAvatar] = useState(avatarCurrent || 'https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png');
  const [username, setUsername] = useState(userName || undefined);
  const [name, setName] = useState(nameCurrent || undefined);

  useEffect(() => {
    // Atualiza os parâmetros quando eles forem alterados
    setAvatar(avatarCurrent || 'https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png');
    setUsername(userName || undefined);
    setName(nameCurrent || undefined);
  }, [avatarCurrent, userName, nameCurrent]);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSearchText('');
  };

  const resetUser = () => {
    setAvatar('https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png');
    setName(undefined);
    setUsername(undefined);
    navigation.navigate('Home', {});
  };

  const searchUser = async () => {
    try {
      const response = await axios.get(`https://api.github.com/users/${searchText}`);
      const userData = response.data;
      console.log(userData);
      if (userData.message === "Not Found") {
        setAlertMessage('Usuário não encontrado.'); // Atualiza a mensagem do Alert
        setShowAlert(true);
      } else {
        setAvatar(userData.avatar_url);
        setName(userData.name);
        setUsername(userData.login);
        closeModal();
      }
    } catch (error) {
      setAvatar('https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png');
      setName(undefined);
      setUsername(undefined);

      setAlertMessage('Ocorreu um erro ao buscar o usuário.'); // Atualiza a mensagem do Alert
      setShowAlert(true);

      closeModal();
    }
  };

  const navLink = (page) => {
    try {
      navigation.navigate(page, { name: name, username: username, avatar: avatar });
    } catch (error) {
      setAlertMessage('Ocorreu um erro ao redirecionar.'); // Atualiza a mensagem do Alert
      setShowAlert(true);
    }
  };

  const openExternalLink = async (username) => {
    if (!username) {
      setAlertMessage('Ocorreu um erro.'); // Atualiza a mensagem do Alert
      setShowAlert(true);
      return;
    }
  
    const url = `https://github.com/${username}`;
    const supported = await Linking.canOpenURL(url);
  
    if (supported) {
      await Linking.openURL(url);
    } else {
      setAlertMessage('Ocorreu um erro.'); // Atualiza a mensagem do Alert
      setShowAlert(true);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View>
          <Image
            source={{ uri: avatar }}
            style={styles.profileImage}
          />
          <Feather name="search" size={24} color="white" style={styles.editIcon} onPress={openModal} />
        </View>
        <Text style={styles.profileName}>{name}</Text>
        <Text style={styles.profileSubName}>{username}</Text>
      </View>

      <View style={styles.linksContainer}>
        <TouchableOpacity style={styles.linkButton} onPress={() => openExternalLink(username)}>
          <Card icon="user" name="Bio" description="Um pouco sobre o usuário" icon2="ios-arrow-forward" />
        </TouchableOpacity>

        <View style={styles.line} />

        <TouchableOpacity style={styles.linkButton} onPress={() => navLink('Orgs')}>
          <Card icon="headphones" name="Organizações" description="Organizações que o usuário faz parte" icon2="ios-arrow-forward" />
        </TouchableOpacity>

        <View style={styles.line} />

        <TouchableOpacity style={styles.linkButton} onPress={() => navLink('Repos')}>
          <Card icon="file-text" name="Repositórios" description="Lista contendo todos os repositórios" icon2="ios-arrow-forward" />
        </TouchableOpacity>

        <View style={styles.line} />

        <TouchableOpacity style={styles.linkButton} onPress={() => navLink('Followers')}>
          <Card icon="smile" name="Seguidores" description="Lista de seguidores" icon2="ios-arrow-forward" />
        </TouchableOpacity>
      </View>

      <SafeAreaView style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <View style={styles.buttonContent}>
            <Ionicons name="md-exit-outline" size={24} color="black" style={styles.icon_footer} />
            <Text style={styles.footerButtonText} onPress={resetUser}>Resetar</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>

      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            placeholder="Pesquisar usuário"
            style={styles.input}
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.searchButton} onPress={searchUser}>
            <Text style={styles.searchButtonText}>Pesquisar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>

      <Alert
        visible={showAlert}
        message={alertMessage} // Utiliza a variável de estado alertMessage como a mensagem do Alert
        onClose={handleCloseAlert}
      />
    </View>
  );
};

const OrgsScreen = ({ route }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const { name, username, avatar } = route.params;
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const response = await axios.get(`https://api.github.com/users/${username}/orgs`);
        setOrgs(response.data);
      } catch (error) {
        //Alert.alert('Erro', 'Ocorreu um erro ao buscar organizações.');
      }
    };

    fetchOrgs();
  }, []);

  const openExternalLink = async (login) => {
    const url = `https://github.com/${login}`;
    const supported = await Linking.canOpenURL(url);
  
    if (supported) {
      await Linking.openURL(url);
    } else {
      setAlertMessage('Ocorreu um erro ao redirecionar para organização.'); // Atualiza a mensagem do Alert
      setShowAlert(true);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View>
          <Image
            source={{ uri: avatar }}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.profileName}>{name}</Text>
        <Text style={styles.profileSubName}>{username}</Text>
      </View>

      <View style={styles.linksContainer} onPress={() => openExternalLink(org.login)}>
        {orgs.map((org) => (
          <TouchableOpacity style={styles.linkButton}>
            <View style={styles.card}>
              <Feather name="file-text" size={22} color="#555" style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{org.login}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Alert
        visible={showAlert}
        message={alertMessage} // Utiliza a variável de estado alertMessage como a mensagem do Alert
        onClose={handleCloseAlert}
      />
    </View>
  );
};

const ReposScreen = ({ route }) => {
  const { name, username, avatar } = route.params;
  const [repos, setRepos] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get(`https://api.github.com/users/${username}/repos`);
        setRepos(response.data);
      } catch (error) {
        setAlertMessage('Ocorreu um erro ao visualizar o repositório.'); // Atualiza a mensagem do Alert
        setShowAlert(true);
      }
    };

    fetchRepos();
  }, []);

  const openExternalLink = async (full_name) => {
    const url = `https://github.com/${full_name}`;
    const supported = await Linking.canOpenURL(url);
  
    if (supported) {
      await Linking.openURL(url);
    } else {
      setAlertMessage('Ocorreu um erro ao redirecionar para os repositórios.'); // Atualiza a mensagem do Alert
      setShowAlert(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View>
          <Image
            source={{ uri: avatar }}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.profileName}>{name}</Text>
        <Text style={styles.profileSubName}>{username}</Text>
      </View>

      <View style={styles.linksContainer}>
        {repos.map((repo) => (
          <TouchableOpacity style={styles.linkButton} onPress={() => openExternalLink(repo.full_name)}>
            <View style={styles.card}>
              <Feather name="file-text" size={22} color="#555" style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{repo.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Alert
        visible={showAlert}
        message={alertMessage} // Utiliza a variável de estado alertMessage como a mensagem do Alert
        onClose={handleCloseAlert}
      />
    </View>
  );
};

const FollowersScreen = ({ route }) => {
  const navigation = useNavigation();

  const { name, username, avatar } = route.params;
  const [followers, setFollowers] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await axios.get(`https://api.github.com/users/${username}/followers`);
        setFollowers(response.data);
      } catch (error) {
        setAlertMessage('Ocorreu um erro ao redirecionar para os seguidores.'); // Atualiza a mensagem do Alert
        setShowAlert(true);
      }
    };

    fetchFollowers();
  }, []);

  const navUserProfile = async (new_username) => {
    try {
      const response = await axios.get(`https://api.github.com/users/${new_username}`);
      const userData = response.data;
      console.log(userData);
      navigation.navigate('Home', { nameCurrent: userData.name, userName: userData.login, avatarCurrent: userData.avatar_url });
    } catch (error) {
      setAlertMessage('Ocorreu um erro ao redirecionar para os seguidores.'); // Atualiza a mensagem do Alert
      setShowAlert(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View>
          <Image
            source={{ uri: avatar }}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.profileName}>{name}</Text>
        <Text style={styles.profileSubName}>{username}</Text>
      </View>

      <View style={styles.linksContainer}>
        {followers.map((follower) => (
          <TouchableOpacity style={styles.linkButton} onPress={() => navUserProfile(follower.login)}>
            <View style={styles.card}>
              <Feather name="user" size={22} color="#555" style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{follower.login}</Text>
              </View>
              <SimpleLineIcons name='arrow-right' size={22} color="#555" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Alert
        visible={showAlert}
        message={alertMessage} // Utiliza a variável de estado alertMessage como a mensagem do Alert
        onClose={handleCloseAlert}
      />
    </View>
  );
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Orgs" component={OrgsScreen} />
        <Stack.Screen name="Repos" component={ReposScreen} />
        <Stack.Screen name="Followers" component={FollowersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  icon: {
    marginRight: 5,
    padding: 8,
    borderRadius: 10,
    borderWidth: 2, 
    borderColor: '#f5f5f5'
  },
  icon_footer: {
    marginRight: 5,
    padding: 8,
  },
  line: {
    height: 1,
    width: '100%',
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 180,
    height: 180,
    borderRadius: 65,
    marginBottom: 10,
  },
  textContainer: {
    marginLeft: 10,
    flexDirection: 'column', // Empilhar os elementos verticalmente
  },
  profileName: {
    fontSize: 20,
    fontWeight: 900,
  },
  profileSubName: {
    fontSize: 15,
    fontWeight: 900,
    color: '#ccc',
  },
  linksContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 20,
    borderWidth: 2, 
    borderColor: '#f5f5f5'
  },
  linkButton: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 18,
    marginLeft: 10,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  footerButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'black',
    bottom: 20,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: '5%',
    right: 0,
    bottom: 10,
  },
  footerButtonText: {
    color: 'black',
    fontSize: 16,
  },
  editIcon: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 10,
    borderWidth: 2, 
  },
  searchButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'black',
    bottom: 20,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: '90%',
    fontSize: 18,
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'white',
    bottom: 20,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  description: {
    fontSize: 12,
    color: 'gray',
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerAlert: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
