import React from 'react';
import {useMoralisDapp} from "providers/MoralisDappProvider/MoralisDappProvider"
import { useParams } from "react-router-dom";
import { useMoralisQuery } from "react-moralis";
import { useEffect, useState, createElement } from "react";
import { Button, Card, Typography, Progress, Input } from "antd";
import {
    BrowserRouter as Router,
    Link
  } from "react-router-dom";
import Address from "./Address/Address";


import CreateProposal from "./CreateProposal";

const { Text } = Typography;

const VenturePage = () => {

    const { selectedVentureId } = useMoralisDapp();

    console.log("NEW");
    console.log(selectedVentureId);

    const styles = {
        card: {
          boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
          border: "1px solid #e7eaf3",
          borderRadius: "0.5rem",
          marginBottom: "10px"
        },
        lcard: {
            boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
            border: "1px solid #e7eaf3",
            borderRadius: "0.5rem 0 0 0.5rem",
            marginBottom: "10px",
            width: "100%"
        },
        ccard: {
            boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
            border: "1px solid #e7eaf3",
            marginBottom: "10px",
            width: "100%"
        },
        rcard: {
            boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
            border: "1px solid #e7eaf3",
            borderRadius: "0 0.5rem 0.5rem 0",
            marginBottom: "10px",
            width: "100%"
        },
    };

    const [ventureContent, setVentureContent] = useState({ venture: "default", description: "default" });
    const [amount, setAmount] = useState();

    const { contentId } = useParams();
    const { data } = useMoralisQuery("Contents", (query) => query.equalTo("contentId", contentId));

    useEffect(() => {
        function extractUri(data) {
          const fetchedContent = JSON.parse(JSON.stringify(data, ["contentUri"]));
          const contentUri = fetchedContent[0]["contentUri"];
          return contentUri;
        }
        async function fetchIPFSDoc(ipfsHash) {
          console.log(ipfsHash);
          const url = ipfsHash;
          const response = await fetch(url);
          return await response.json();
        }
        async function processContent() {
          const content = await fetchIPFSDoc(extractUri(data));
          setVentureContent(content);
        }
        if (data.length > 0) {
          processContent();
        }
      }, [data]);

    const investorAmount = 49
    const totalReceived = 4.7
    const leftover = 2.3
    const minimum = 0.1

    const proposals = [
        {
            "name": "Proposal 1",
            "amount": 0.3,
            "description": "Aliquam erat volutpat. Sed ut dui ut lacus dictum fermentum vel tincidunt neque. Sed sed lacinia lectus. Duis sit amet sodales felis.",
            "receiver": "0xd09656a2EE7E5Ee3404fAce234e683D3337dA014",
            "approved": 20,
            "complete": false
        },
        {
            "name": "Proposal 2",
            "amount": 0.5,
            "description": "Ut aliquet tristique nisl vitae volutpat. Nulla aliquet porttitor venenatis. Donec a dui et dui fringilla consectetur id nec massa.",
            "receiver": "0x51C8B83D93A2bB2Dd6129AA6B4561A511E835c98",
            "approved": 37,
            "complete": true
        },
    ]

  return (
    <div style={{padding: "15px", maxWidth: "1030px", width: "100%"}}>
        <Link to="/explore">
            <Button
                size="large"
                style={{borderRadius: "0.5rem",}}
            >
                ⬅ return to explore
            </Button>
        </Link>
        <div style={{marginTop: "20px", marginBottom: "15px"}}>
            <h3 style={{ marginBottom: "15px" }}>💰 Invest</h3>
            <div style={{ display: "flex" }}>
                <div style={{ width: "65%" }}>
                    <Card
                        style={styles.card}
                        title={<Text strong>📝 {ventureContent["venture"]}</Text>}
                    >
                        {ventureContent["description"]}
                    </Card>
                    <div style={{ display: "flex", width: "100%" }}>
                        <Card
                            style={styles.lcard}
                        >
                            <h6>Investors</h6>
                            <p>{investorAmount}</p>
                        </Card>
                        <Card
                            style={styles.ccard}
                        >
                            <h6>Total Collected</h6>
                            <p>{totalReceived} MATIC</p>
                        </Card>
                        <Card
                            style={styles.rcard}
                        >
                            <h6>Treasury</h6>
                            <p>{leftover} MATIC</p>
                        </Card>
                    </div>
                </div>
                <div style={{ width: "35%", marginLeft: "10px" }}>
                <Card
                    style={styles.card}
                    title={<Text strong>Invest Now</Text>}
                >
                    <Input
                        size="large"
                        placeholder="Enter amount..."
                        style={{borderRadius: "8px", marginBottom: "5px"}}
                        onChange={(e) => {
                            setAmount(`${e.target.value}`);
                        }}
                        addonAfter="MATIC"
                    />
                    <div>Minimum Amount: {minimum}</div>
                    <Button
                        size="large"
                        type="primary"
                        style={{
                            width: "100%",
                            borderRadius: "0.5rem",
                            fontSize: "16px",
                            fontWeight: "500",
                            marginTop: "10px"
                        }}
                    >
                        Invest
                    </Button>
                </Card>
                </div>
            </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px"}}>
            <h3>⚡ Proposals</h3>
            <CreateProposal />
        </div>
        {proposals.map((proposal) => (
            <Card
                style={styles.card}
                title={
                    <div style={{display: "flex", justifyContent: "space-Between"}}>
                        <Text strong>📝 {proposal["name"]}</Text>
                        {!proposal["complete"] ? 
                            <h6 style={{color: "green"}}>Active</h6> 
                            : <h6 style={{color: "grey"}}>Completed</h6> 
                        }
                    </div>
                }
            >
                {proposal["description"]}
                <div style={{ display: "flex", marginTop: "15px", width:"80%"}}>
                    <div style={{ width: "40%"}}>
                        <h6>Amount</h6>
                        <div style={{ fontSize: "15px", marginTop: "13px" }}>{proposal["amount"]} MATIC</div>
                    </div>
                    <div style={{ width: "60%"}}>
                        <h6>Receiving Address</h6>
                        <Address
                            size={8}
                            style={{ fontSize: "15px" }}
                            address={proposal["receiver"]}
                            copyable
                        />
                    </div>
                </div>
                <div style={{ marginTop: "10px", width: "100%" }}>
                    <h6>Approvals</h6>
                    <Progress percent={Math.round((proposal["approved"] / investorAmount) * 100)} status="active"/>
                </div>
                {!proposal["complete"] && <div style={{ marginTop: "15px" }}>
                    <Button
                        size="large"
                        type="primary"
                        style={{
                            width: "100%",
                            borderRadius: "0.5rem",
                            fontSize: "16px",
                            fontWeight: "500",
                        }}
                    >
                        Approve
                    </Button>
                    <Button
                        size="large"
                        style={{
                            width: "100%",
                            borderRadius: "0.5rem",
                            fontSize: "16px",
                            fontWeight: "500",
                            marginTop: "5px",
                            borderColor: "#428af5"
                        }}
                    >
                        Finalize Proposal
                    </Button>
                </div>}
            </Card>
        ))}
    </div>
  );
};

export default VenturePage;
