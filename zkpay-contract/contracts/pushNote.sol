// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;


interface IPUSHCommInterface {
    function sendNotification(address _channel, address _recipient, bytes calldata _identity) external;
}


contract pushNote {
    //string body = "Hello I'm shun funaki nice to meet you!";
    function SendNote(address to) public{
        IPUSHCommInterface(0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa).sendNotification(
            0x94feEEDFcd7ad9a255FE205037c6Df14a8960D3D, // from channel - recommended to set channel via dApp and put it's value -> then once contract is deployed, go back and add the contract address as delegate for your channel
            to, // to recipient, put address(this) in case you want Broadcast or Subset. For Targetted put the address to which you want to send
            bytes(
                string(
                    // We are passing identity here: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                    abi.encodePacked(
                        "0", // this is notification identity: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/identity/payload-identity-implementations
                        "+", // segregator
                        "3", // this is payload type: https://docs.epns.io/developers/developer-guides/sending-notifications/advanced/notification-payload-types/payload (1, 3 or 4) = (Broadcast, targetted or subset)
                        "+", // segregator
                        "Someone Contact to you", // this is notificaiton title
                        "+", // segregator
                        "Hey, someone contact to you! Let's checkout your messanger!"// notification body
                        )
                    )
                )
        );
    }
}