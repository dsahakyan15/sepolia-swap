import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { appChain, RPC_URL } from "./chains";

export const wagmiConfig = createConfig({
  chains: [appChain],
  connectors: [injected({ target: "metaMask" })],
  transports: {
    [appChain.id]: http(RPC_URL),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
