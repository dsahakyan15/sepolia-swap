import { explorerAddressUrl } from "@/config/chains";
import { contracts } from "@/config/contracts";
import { shortenAddress } from "@/lib/format";
import styles from "./Footer.module.css";

export function Footer() {
  const router = contracts.uniswapV2Router.address;
  return (
    <footer className={styles.footer}>
      Тестовая сеть Sepolia · Router{" "}
      <a href={explorerAddressUrl(router)} target="_blank" rel="noreferrer">
        {shortenAddress(router, 6)}
      </a>
      <br />
      Тестовый ETH:{" "}
      <a href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia" target="_blank" rel="noreferrer">
        faucet
      </a>
    </footer>
  );
}
