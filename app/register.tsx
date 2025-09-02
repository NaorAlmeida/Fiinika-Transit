import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  Banknote,
  FileText,
} from "lucide-react-native";
import CheckBox from "@react-native-community/checkbox";
import { API_BASE_URL, API_KEY } from "@/utils/constants";

export default function RegisterScreen() {
  const router = useRouter();

  // controle de steps
  const [step, setStep] = useState(1);

  // Step 1
  const [nome, setNome] = useState("");
  const [provincia, setProvincia] = useState("");
  const [telemovel, setTelemovel] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 2
  const [banco, setBanco] = useState("");
  const [iban, setIban] = useState("");
  const [nif, setNif] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (!nome || !provincia || !telemovel || !email || !senha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    setStep(2);
  };

  const handleRegister = async () => {
    if (!banco || !iban) {
      Alert.alert("Erro", "Por favor, preencha Banco e IBAN.");
      return;
    }
    if (!acceptedTerms) {
      Alert.alert("Erro", "Você precisa aceitar os termos e condições.");
      return;
    }

    setLoading(true);

    try {
      const body = new URLSearchParams({
        nome,
        provincia,
        telemovel,
        email,
        senha,
        banco,
        iban,
        nif: nif || "",
      }).toString();

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: API_KEY,
        },
        body,
      });

      const data = await response.json();

      if (!response.ok || data.tipo !== "Sucesso") {
        throw new Error(data.msg || "Erro ao cadastrar");
      }

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Passo {step} de 2</Text>

          {step === 1 ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome completo *</Text>
                <View style={styles.inputContainer}>
                  <User size={20} color="#1E579C" />
                  <TextInput
                    style={styles.textInput}
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Digite seu nome"
                    placeholderTextColor="#999999"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Província *</Text>
                <View style={styles.inputContainer}>
                  <FileText size={20} color="#1E579C" />
                  <TextInput
                    style={styles.textInput}
                    value={provincia}
                    onChangeText={setProvincia}
                    placeholder="Digite sua província"
                    placeholderTextColor="#999999"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Telemóvel *</Text>
                <View style={styles.inputContainer}>
                  <Phone size={20} color="#1E579C" />
                  <TextInput
                    style={styles.textInput}
                    value={telemovel}
                    onChangeText={setTelemovel}
                    placeholder="Digite seu telemóvel"
                    keyboardType="phone-pad"
                    placeholderTextColor="#999999"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>E-mail *</Text>
                <View style={styles.inputContainer}>
                  <Mail size={20} color="#1E579C" />
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Digite seu e-mail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#999999"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Senha *</Text>
                <View style={styles.inputContainer}>
                  <Lock size={20} color="#1E579C" />
                  <TextInput
                    style={styles.textInput}
                    value={senha}
                    onChangeText={setSenha}
                    placeholder="Digite sua senha"
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#999999"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#666666" />
                    ) : (
                      <Eye size={20} color="#666666" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Próximo</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Banco *</Text>
                <View style={styles.inputContainer}>
                  <Banknote size={20} color="#1E579C" />
                  <TextInput
                    style={styles.textInput}
                    value={banco}
                    onChangeText={setBanco}
                    placeholder="Digite o nome do banco"
                    placeholderTextColor="#999999"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>IBAN *</Text>
                <View style={styles.inputContainer}>
                  <FileText size={20} color="#1E579C" />
                  <TextInput
                    style={styles.textInput}
                    value={iban}
                    onChangeText={setIban}
                    placeholder="Digite seu IBAN"
                    placeholderTextColor="#999999"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>NIF (opcional)</Text>
                <View style={styles.inputContainer}>
                  <FileText size={20} color="#1E579C" />
                  <TextInput
                    style={styles.textInput}
                    value={nif}
                    onChangeText={setNif}
                    placeholder="Digite seu NIF"
                    placeholderTextColor="#999999"
                  />
                </View>
              </View>

              <View style={styles.termsRow}>
                <CheckBox
                  value={acceptedTerms}
                  onValueChange={setAcceptedTerms}
                  tintColors={{ true: "#1E579C", false: "#999999" }}
                />
                <Text style={styles.termsText}>
                  Concordo com os{" "}
                  <Text
                    style={styles.link}
                    onPress={() =>
                      Linking.openURL("https://seusite.com/termos")
                    }
                  >
                    termos e condições
                  </Text>
                </Text>
              </View>

              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.registerButtonText}>
                  {loading ? "A carregar..." : "Cadastrar"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setStep(1)}
              >
                <Text style={styles.backButtonText}>Voltar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F0F0" },
  content: { flexGrow: 1, justifyContent: "center", padding: 16 },
  form: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: "Barlow-Bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Barlow-Medium",
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  inputGroup: { marginBottom: 16 },
  inputLabel: {
    fontSize: 14,
    fontFamily: "Barlow-SemiBold",
    color: "#333",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Barlow-Regular",
    marginLeft: 10,
    color: "#333",
  },
  nextButton: {
    backgroundColor: "#1A5785",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  nextButtonText: { color: "#FFF", fontSize: 16, fontFamily: "Barlow-Bold" },
  registerButton: {
    backgroundColor: "#28A745",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  registerButtonText: { color: "#FFF", fontSize: 16, fontFamily: "Barlow-Bold" },
  backButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  backButtonText: {
    color: "#1E579C",
    fontSize: 14,
    fontFamily: "Barlow-Medium",
  },
  termsRow: { flexDirection: "row", alignItems: "center", marginVertical: 12 },
  termsText: { fontSize: 13, fontFamily: "Barlow-Regular", color: "#333" },
  link: { color: "#1E579C", fontFamily: "Barlow-SemiBold" },
});
