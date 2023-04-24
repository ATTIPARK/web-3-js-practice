import { useEffect, useState } from "react";
import axios from "axios";
import Web3 from "web3";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  NFT_CONTRACT_ABI,
  NFT_CONTRACT_ADDRESS,
} from "./web3.config";

const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
const nftContract = new web3.eth.Contract(
  NFT_CONTRACT_ABI,
  NFT_CONTRACT_ADDRESS
);

function App() {
  const [account, setAccount] = useState("");
  const [myBalance, setMyBalance] = useState("");
  const [nftMetadata, setNftMetadata] = useState();

  const onClickAccount = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickLogOut = () => {
    setAccount("");
  };

  const onClickBalance = async () => {
    try {
      if (!account || !contract) return;

      const balance = await contract.methods.balanceOf(account).call();

      // const totalsupply = await contract.methods.totalSupply().call();
      // console.log("TotalSupply:", web3.utils.fromWei(totalsupply));

      // setMyBalance(balance / 10 ** 18);
      setMyBalance(web3.utils.fromWei(balance));
    } catch (error) {
      console.error(error);
    }
  };

  const onClickMint = async () => {
    try {
      if (!account) return;

      // 간단 버전
      // const uri =
      //   "https://gateway.pinata.cloud/ipfs/QmexSTqQx9ZB7nyy3VULwkmhNgPrfCVhCATXH3G6VSTcVz";

      // const result = await nftContract.methods.mintNft(uri).send({
      //   from: account,
      // });

      // if (!result.status) return;

      // const response = await axios.get(uri);

      // 정석 버전
      const result = await nftContract.methods
        .mintNft(
          "https://gateway.pinata.cloud/ipfs/QmexSTqQx9ZB7nyy3VULwkmhNgPrfCVhCATXH3G6VSTcVz"
        )
        .send({
          from: account,
        });

      if (!result.status) return;

      const balanceOf = await nftContract.methods.balanceOf(account).call();

      const tokenOfOwnerByIndex = await nftContract.methods
        .tokenOfOwnerByIndex(account, parseInt(balanceOf) - 1)
        .call();

      const tokenURI = await nftContract.methods
        .tokenURI(tokenOfOwnerByIndex)
        .call();

      const response = await axios.get(tokenURI);

      setNftMetadata(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(nftContract.methods);
  }, []);

  return (
    <div className="bg-red-100 min-h-screen flex justify-center items-center">
      {account ? (
        <div>
          <div className="text-main font-bold text-xl ">
            {account.substring(0, 4)}...
            {account.substring(account.length - 4)}
            <button onClick={onClickLogOut} className="ml-4 btn-style">
              로그아웃
            </button>
          </div>
          <div className="flex items-center mt-4">
            <button onClick={onClickBalance} className="btn-style mr-4">
              잔액 조회
            </button>
            {myBalance && (
              <div className="text-main font-bold text-xl">
                {myBalance} tMatic
              </div>
            )}
          </div>
          <div className="flex flex-col items-center mt-4 gap-4">
            {nftMetadata && (
              <div>
                <img src={nftMetadata.image} alt="NFT" />
                <div>Name : {nftMetadata.name}</div>
                <div>Description : {nftMetadata.description}</div>
                {nftMetadata.attributes.map((v, i) => {
                  return (
                    <div>
                      <span>{v.trait_type} : </span>
                      <span>{v.value}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <button onClick={onClickMint} className="btn-style mr-4">
              민팅
            </button>
          </div>
        </div>
      ) : (
        <button onClick={onClickAccount} className="btn-style">
          <img
            className="w-12"
            src={`${process.env.PUBLIC_URL}/images/metamask.png`}
          />
        </button>
      )}
    </div>
  );
}

export default App;
