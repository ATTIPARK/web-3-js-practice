import { useEffect, useState } from "react";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./web3.config";

const web3 = new Web3("https://rpc-mumbai.maticvigil.com");
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

function App() {
  const [account, setAccount] = useState("");
  const [myBalance, setMyBalance] = useState("");

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

  // useEffect(() => {
  //   console.log();
  // }, []);

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
