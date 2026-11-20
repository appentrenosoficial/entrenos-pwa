import {
  Card,
  Heading,
  PendingAction,
  Screen,
  styles,
} from "../../src/components/primitives";
import { Text } from "react-native";
export default function CreateScreen() {
  return (
    <Screen>
      <Heading
        eyebrow="Compartilhe seu mundo"
        title="Criar"
        description="Espaço reservado às suas próximas histórias."
      />
      <Card>
        <Text style={styles.cardTitle}>Uma nova publicação</Text>
        <Text style={styles.body}>
          Texto, fotos e vídeos terão controles de público e respeitarão a
          privacidade do perfil.
        </Text>
        <PendingAction
          label="Criar publicação"
          reason="Publicação e envio de mídia ainda não implementados."
        />
      </Card>
      <Card>
        <Text style={styles.cardTitle}>Um momento, uma história</Text>
        <Text style={styles.body}>
          Stories e seus controles de audiência chegarão na etapa social.
        </Text>
        <PendingAction
          label="Criar story"
          reason="Stories ainda não implementados."
        />
      </Card>
    </Screen>
  );
}
