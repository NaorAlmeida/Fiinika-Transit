import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import {
  useFonts,
  Barlow_400Regular,
  Barlow_500Medium,
  Barlow_600SemiBold,
  Barlow_700Bold,
} from '@expo-google-fonts/barlow';
import { API_BASE_URL, API_KEY } from '@/utils/constants';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    'Barlow-Regular': Barlow_400Regular,
    'Barlow-Medium': Barlow_500Medium,
    'Barlow-SemiBold': Barlow_600SemiBold,
    'Barlow-Bold': Barlow_700Bold,
  });

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': ' application/x-www-form-urlencoded',
          Authorization: `${API_KEY}`,
        },
        body: new URLSearchParams({ username, pass: password }).toString(),
      });

      const data = await response.json();

      if (!response.ok || data.tipo != 'Sucesso') {
        throw new Error(data.msg || 'Erro ao fazer login');
      }

      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Login realizado com sucesso!',
      });

      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />

        <View style={styles.form}>
          <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
          <Text style={styles.loginText}>Faça login na sua conta</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <View style={styles.inputContainer}>
              <Mail size={20} color="#1E579C" />
              <TextInput
                style={styles.textInput}
                placeholder="Digite o ID"
                value={username}
                onChangeText={setUsername}
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999999"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Senha</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color="#1E579C" />
              <TextInput
                style={styles.textInput}
                placeholder="Digite sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#999999"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#666666" />
                ) : (
                  <Eye size={20} color="#666666" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>

          <View style={styles.registerSection}>
            <Text style={styles.registerText}>Não tem uma conta? </Text>
            <TouchableOpacity
              onPress={() => router.push('/register')}
            >
              <Text style={styles.registerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  subtitle: {
    fontSize: 16,
    fontFamily: 'Barlow-Medium',
    color: '#666666',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: 'Barlow-Bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  loginText: {
    fontSize: 16,
    fontFamily: 'Barlow-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Barlow-SemiBold',
    color: '#333333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Barlow-Regular',
    color: '#333333',
    marginLeft: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Barlow-Medium',
    color: '#1E579C',
  },
  loginButton: {
    backgroundColor: '#1A5785',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: '#1A5785',
  },
  loginButtonText: {
    fontSize: 18,
    fontFamily: 'Barlow-Bold',
    color: '#FFFFFF',
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    fontFamily: 'Barlow-Regular',
    color: '#666666',
  },
  registerLink: {
    fontSize: 14,
    fontFamily: 'Barlow-SemiBold',
    color: '#1E579C',
  },
});
