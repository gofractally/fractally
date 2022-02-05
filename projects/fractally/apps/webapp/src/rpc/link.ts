import AnchorLink from "anchor-link";
import AnchorLinkBrowserTransport from "anchor-link-browser-transport";

const transport = new AnchorLinkBrowserTransport();

const chainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
const rpcHost = 'https://eos.greymass.com';
const appName = 'Fractally';

export const link = new AnchorLink({
  transport,
  chains: [
    {
      chainId,
      nodeUrl: rpcHost,
    },
  ],
});