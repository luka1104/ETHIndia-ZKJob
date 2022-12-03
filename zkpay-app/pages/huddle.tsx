import { useEffect, useState } from "react";

import {
  huddleIframeApp,
  HuddleAppEvent,
  HuddleIframe,
  IframeConfig,
  HuddleClientMethodName,
} from "@huddle01/huddle01-iframe";

import { Chat } from "@pushprotocol/uiweb";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";

const Huddle = () => {
  const { address } = useAccount()
  const { query } = useRouter()
  const [walletAddress, setWalletAddress] = useState("");

  const iframeConfig: IframeConfig = {
    roomUrl: "https://iframe.huddle01.com/test-room",
    height: "640px",
    width: "100%",
  };

  useEffect(() => {
    huddleIframeApp.on(HuddleAppEvent.PEER_JOIN, (data) =>
      console.log({ iframeData: data })
    );
    huddleIframeApp.on(HuddleAppEvent.PEER_LEFT, (data) =>
      console.log({ iframeData: data })
    );
  }, []);

  useEffect(() => {
    if(!address)
    setWalletAddress(address!)
  }, [address])

  return (
    <div className="App">
      <div className="container">
        {address && query.address && query.nickname && (
          <Chat
            account={address} //user address
            supportAddress={query.address as string} //support address
            modalTitle={`Chat with ${query.nickname as string}`}
            apiKey={process.env.NEXT_PUBLIC_HUDDLE_KEY}
            env="staging"
          />
        )}
        <br />
        <HuddleIframe config={iframeConfig} />
      </div>
    </div>
  );
}

export default Huddle;
