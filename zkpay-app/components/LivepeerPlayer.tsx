import { Player } from "@livepeer/react";
import { parseArweaveTxId, parseCid } from "livepeer/media";
import { useMemo, useState } from "react";

interface Props {
  url: string;
  autoPlay: boolean;
}

export const LivepeerPlayer: React.FC<Props> = ({ url, autoPlay }) => {
  const idParsed = useMemo(() => parseCid(url) ?? parseArweaveTxId(url), [url]);
  return (
    <>
      {idParsed && (
        <Player
          title={idParsed.id}
          src={url}
          autoPlay={autoPlay}
          muted
          showTitle={false}
          autoUrlUpload={{
            fallback: true,
            ipfsGateway: "https://cloudflare-ipfs.com",
          }}
        />
      )}
    </>
  );
};
