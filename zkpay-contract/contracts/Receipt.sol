// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title ZKJOB NFT
 */
contract ZKJOB is ERC721, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    struct Receipt {
        uint256 payAmount;
        address from;
        address to;
        string fromName;
        string toName;
    }
    string baseTokenURI;
    Counters.Counter private _tokenIds;
    mapping(uint256 => Receipt) public receipts;
    mapping(address => uint256) public payAmountTotal;
    mapping(address => uint256) public receiveAmountTotal;

    constructor() ERC721("ZKJOB", "ZKJOB") {
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        string memory svg = _getSVG(tokenId);

        return _getJson(tokenId, svg);
    }

    function mint(address _from, address _to, uint256 _amount, string memory _fromName, string memory _toName) public {
        _tokenIds.increment();
        uint256 nextTokenIdFrom = _tokenIds.current();
        receipts[nextTokenIdFrom] = Receipt({
            payAmount: _amount,
            from: _from,
            to: _to,
            fromName: _fromName,
            toName: _toName
        });
        _safeMint(_from, nextTokenIdFrom);
        
        _tokenIds.increment();
        uint256 nextTokenIdTo = _tokenIds.current();
        receipts[nextTokenIdTo] = Receipt({
            payAmount: _amount,
            from: _from,
            to: _to,
            fromName: _fromName,
            toName: _toName
        });
        _safeMint(_to, nextTokenIdTo);

        payAmountTotal[_from] += _amount;
        receiveAmountTotal[_to] += _amount;
    }

    function _getSVG(uint256 tokenId) private view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 480 480">',
                    '<style>text{fill:black;30px;font-family:serif;}</style>',
                    '<rect width="100%" height="100%" fill="#FFFFFE" />',
                    '<text x="10%" y="10%" font-size="40px">',
                    'ZKJob Receipt',
                    '</text>',
                    '<text x="10%" y="20%" font-size="24px">',
                    receipts[tokenId].from,
                    ' -> ',
                    receipts[tokenId].to,
                    '</text>',
                    '<text x="10%" y="40%" font-size="32px">Reaction: ',
                    receipts[tokenId].payAmount,' BOB',
                    '</text>',
                    "</text></svg>"
                )
            );
    }

    function _getJson(uint256 tokenId, string memory svg) private view returns (string memory) {

        bytes memory json = abi.encodePacked(
            '{"name": ZKJob Receipt #"',tokenId,
            '", "description": "',
            '", "image": "data:image/svg+xml;base64,',Base64.encode(bytes(svg)),
            '"}'
        );

        return string(abi.encodePacked("data:application/json;base64,", Base64.encode(json)));
        
    }
}