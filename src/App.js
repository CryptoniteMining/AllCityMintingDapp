import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

const showRootHash = (hash) => console.log(`
  ██████  
  ██   ██ 
  ██████  
  ██   ██ 
  ██   ██ 

  Whitelist RootHash: ${hash.toString('hex')}
`)

export const StyledButton = styled.button`
  border-radius: 0.5rem;
  border: none;
  background-color: var(--secondary);
  padding: 0.8rem 1.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  :hover {
    background: #fff;
    color: var(--secondary);
  }
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  :disabled {
    opacity: 0.5;
  }
  :disabled:hover {
    color: #fff;
    background-color: var(--secondary);
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--tertiary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
  :disabled {
    opacity: 0.5;
  }
  :disabled:hover {
    color: var(--primary-text);
    background-color: var(--tertiary);
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  margin-bottom: 3rem;
  margin-top: 3rem;
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledLogoWebacy = styled.img`
  width: 100px;
  @media (min-width: 767px) {
    width: 200px;
  }
  margin-bottom: 3rem;
  margin-top: 3rem;
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.2);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const FooterImg = styled.img`
  width: 80px;
`

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

export const StyledLinkInfo = styled.a`
  color: var(--accent);
  font-weight: 800;
`;

export const StyledError = styled.div`
  background: var(--error);
  color: #fff;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 0.5rem;
`

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const account = useSelector((state) => state.blockchain.account);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Mint your NFT.`);
  const [done, setDone] = useState(false);
  const [tokens, settokens] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    WL_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const { MerkleTree } = require('merkletreejs');
  const keccak256 = require('keccak256');

  let Whitelist = require('./Accounts.json');
  const leafNodes = Whitelist.map(addr => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true});
  const rootHash = merkleTree.getRoot();

  useEffect(() => {
    showRootHash(rootHash);
  }, [])

  const claimingAddress = keccak256(account);
  const hexProof = merkleTree.getHexProof(claimingAddress);

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * tokens);
    let totalGasLimit = String(gasLimit);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(tokens)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong. Please try again later.");
        setClaimingNft(false);
      })
      .then(() => {
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const presalemint = () => {
    let cost = CONFIG.WL_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * tokens);
    let totalGasLimit = String(gasLimit);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .presalemint(tokens, hexProof)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setDone(true);
        setFeedback(
          <div>
            <p>
              <strong>Congrats on becoming a Rook owner!</strong>
            </p>
            <p>
              The All City ecosystem is where community management, operations, and rewards are proportionately owned by Rook pfp NFT holders
            </p>
          </div>
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementtokens = () => {
    let newtokens = tokens - 1;
    if (newtokens < 1) {
      newtokens = 1;
    }
    settokens(newtokens);
  };

  const incrementtokens = () => {
    let newtokens = tokens + 1;
    if (newtokens > 5) {
      newtokens = 5;
    }
    settokens(newtokens);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundSize: '100% 110%' }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        <s.LogoWrapper>
          <StyledLogo alt={"logo"} src={"/config/images/allcitylogo.png"} />
        </s.LogoWrapper>
        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 24, maxWidth: '1024px' }} test>
          <s.Container flex={1} jc={"center"} ai={"center"} style={{ padding: 48 }}>
            <StyledImg alt={"rooks"} src={"/config/images/example.png"} />
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={4}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              padding: 48,
              borderRadius: 24,
            }}
          >
            <s.TextCounter
              style={{
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              {blockchain.account === "" || blockchain.smartContract === null ? 'Mint up to 4 Rooks' : `${!done ? data.totalSupply : tokens} minted`}
            </s.TextCounter>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.FeedbackBubble>
                  The sale has ended.
                </s.FeedbackBubble>
                <s.SpacerSmall />
                You can still find {CONFIG.NFT_NAME} on:
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  <StyledButton>
                    {CONFIG.MARKETPLACE}
                  </StyledButton>
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextCounter
                  style={{ textAlign: "center" }}
                >
                  1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}
                </s.TextCounter>
                <s.SpacerXSmall />
                <s.TextCounter
                  style={{ textAlign: "center" }}
                >
                  Excluding gas fees.
                </s.TextCounter>
                <s.SpacerXSmall />
                <s.TextCounter
                  style={{
                    color: "var(--primary-text)",
                  }}
                >
                  <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                    {truncate(CONFIG.CONTRACT_ADDRESS, 15)} ({CONFIG.NETWORK.NAME})
                  </StyledLink>
                </s.TextCounter>
                <s.SpacerLarge />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container jc={"center"} ai={"center"}>
                    <s.NoteBubble>
                      <strong>Whitelist Mint is live!</strong>
                      <br />Rooks are now available to only whitelisted wallets.
                    </s.NoteBubble>
                    <s.SpacerSmall/>
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      Mint
                    </StyledButton>
                    <s.SpacerSmall/>
                    - also -
                    <s.SpacerSmall/>
                    <a href="https://discord.gg/qQareGJyg3">
                      <StyledButton>
                        Join the All City Helios Discord
                      </StyledButton>
                    </a>
                    {blockchain.errorMsg !== "" ? (
                      <StyledError>
                        <strong>Error:</strong> {blockchain.errorMsg}
                      </StyledError>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.Container ai={"center"} jc={"center"}>
                      <s.FeedbackBubble>
                        {feedback}
                      </s.FeedbackBubble>
                      <s.SpacerMedium />
                    </s.Container>
                    {!done && (
                      <>
                        <s.Container ai={"center"} jc={"center"} fd={"row"}>
                          <StyledRoundButton
                            style={{ lineHeight: 0.4 }}
                            disabled={claimingNft ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              decrementtokens();
                            }}
                          >
                            -
                          </StyledRoundButton>
                          <s.SpacerMedium />
                          <s.TextCounter
                            style={{
                              textAlign: "center",
                              fontSize: '2rem',
                            }}
                          >
                            {tokens}
                          </s.TextCounter>
                          <s.SpacerMedium />
                          <StyledRoundButton
                            disabled={(tokens >= 5) ? 1 : 0}
                            onClick={(e) => {
                              e.preventDefault();
                              incrementtokens();
                            }}
                          >
                            +
                          </StyledRoundButton>
                        </s.Container>
                        <s.SpacerSmall />
                        <s.Container ai={"center"} jc={"center"}>
                          <StyledButton
                            onClick={(e) => {
                              e.preventDefault();
                              claimNFTs();
                              getData();
                            }}
                          >
                            {claimingNft ? "Busy" : "Mint"}
                          </StyledButton>
                          <s.SpacerMedium/>
                          <s.NoteBubble
                            style={{
                              color: "var(--primary-text)",
                            }}
                          >
                            <p>
                              <strong>Note: </strong>
                              If you are whitelist minting be sure to use the wallet you obtained a whitelist spot with.
                            </p>
                            <br />
                            <p>
                              <strong>A rook is a trusted member by the All City krew.</strong>
                            </p>
                            <br />
                            <p>
                              <strong>Whitelist:</strong> If you are on the whitelist for Rooks, you should see a “Mint” button appear underneath the “Buy” button. If you think you should be whitelisted but do not see this button, please contact our team via Discord.
                            </p>
                          </s.NoteBubble>
                        </s.Container>
                      </>
                    )}
                  </>
                )}
              </>
            )}
            <s.Container jc={"center"} ai={"left"} style={{ marginTop: '4rem' }}>
              <s.TextDescription
                style={{
                  color: "var(--primary-text)",
                }}
              >
                Please make sure you are connected to the right network (
                {CONFIG.NETWORK.NAME} Mainnet) and the correct address.
              </s.TextDescription>
              <s.SpacerXSmall />
              <s.TextDescription
                style={{
                  color: "var(--primary-text)",
                }}
              >
                We have set the gas limit to <strong>{CONFIG.GAS_LIMIT}</strong> for the contract to
                successfully mint your NFT. We recommend that you don’t lower the
                gas limit.
              </s.TextDescription>
              <s.SpacerXSmall />
              <s.TextDescription><strong>Please note: Once you make the purchase, you cannot undo this action.</strong></s.TextDescription>
            </s.Container>
          </s.Container>
        </ResponsiveWrapper>
      </s.Container>
      <s.FooterPartners>
        <s.FooterPartnersTitle>Powered by All City Helios</s.FooterPartnersTitle>
      </s.FooterPartners>
      <s.Footer>
        <s.FooterItem>
          <a href={CONFIG.WEBSITE_LINK} target="_blank" rel="noreferrer">
            <FooterImg alt={"AllCity"} src={"/config/images/bg.jpg"}  />
          </a>
          <span>
            ©Copyright 2022 • AllCityHelios. • All rights reserved.
          </span>
        </s.FooterItem>
        <s.FooterItem>
          <a href="https://www.allcityhelios.com" target="_blank" rel="noreferrer">allcityhelios.com</a>
          <span>•</span>
          <a href={CONFIG.HOMEPAGE_LINK} target="_self">Back to AllCityHelios</a>
        </s.FooterItem>
      </s.Footer>
    </s.Screen>
  );
}

export default App;
