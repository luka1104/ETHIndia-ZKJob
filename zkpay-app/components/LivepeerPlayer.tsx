import { Player } from "@livepeer/react";
import { parseArweaveTxId, parseCid } from "livepeer/media";
import { useMemo, useState } from "react";

interface Props {
  url: string;
}

export const LivepeerPlayer: React.FC<Props> = ({ url }) => {
  const idParsed = useMemo(() => parseCid(url) ?? parseArweaveTxId(url), [url]);
  return (
    <>
      {idParsed && (
        <Player
          title={idParsed.id}
          src={url}
          autoPlay
          muted
          autoUrlUpload={{
            fallback: true,
            ipfsGateway: "https://cloudflare-ipfs.com",
          }}
        />
      )}
    </>
  );
};
