import { useWindowDimensions } from "react-native";
import { DesktopLogin } from "./DesktopLogin";
import {
  ReferenceLogin as MobileLogin,
  type ReferenceLoginProps,
} from "./ReferenceLoginMobile";

const DESKTOP_BREAKPOINT = 960;

export function ReferenceLogin(props: ReferenceLoginProps) {
  const { width } = useWindowDimensions();
  return width >= DESKTOP_BREAKPOINT ? (
    <DesktopLogin {...props} />
  ) : (
    <MobileLogin {...props} />
  );
}
