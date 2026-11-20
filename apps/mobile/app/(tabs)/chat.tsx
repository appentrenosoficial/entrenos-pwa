import { Text, View } from "react-native";
import {
  EmptyState,
  Heading,
  Screen,
  styles,
} from "../../src/components/primitives";
export default function ChatScreen() {
  return (
    <Screen>
      <Heading
        eyebrow="Encontros em palavras"
        title="Chat"
        description="Conversas que começam com consentimento."
      />
      <View style={styles.row}>
        {["Conversas", "Solicitações", "Arquivadas"].map((label) => (
          <View key={label} style={styles.chip}>
            <Text style={styles.caption}>{label} · em breve</Text>
          </View>
        ))}
      </View>
      <EmptyState
        icon="chatbubbles-outline"
        title="Suas conversas terão espaço aqui"
        description="Mensagens ainda não estão conectadas. Match, conexão aceita ou solicitação aceita serão necessários, respeitando as permissões do destinatário."
      />
    </Screen>
  );
}
