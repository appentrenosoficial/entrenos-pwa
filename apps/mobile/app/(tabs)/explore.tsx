import { Text, View } from "react-native";
import {
  EmptyState,
  Heading,
  PendingAction,
  Screen,
  styles,
} from "../../src/components/primitives";
export default function ExploreScreen() {
  return (
    <Screen>
      <Heading
        eyebrow="Novas afinidades"
        title="Explorar"
        description="Pessoas e casais, com privacidade e escolhas respeitadas."
      />
      <View style={styles.row}>
        {["Individuais", "Casais", "Verificados"].map((label) => (
          <View key={label} style={styles.chip}>
            <Text style={styles.caption}>{label} · em breve</Text>
          </View>
        ))}
      </View>
      <EmptyState
        icon="compass-outline"
        title="Descoberta em preparação"
        description="Nenhum perfil está sendo consultado. Busca, filtros e descoberta serão conectados nas próximas etapas."
      />
      <PendingAction
        label="Ajustar descoberta"
        reason="Disponível na etapa de descoberta."
      />
    </Screen>
  );
}
