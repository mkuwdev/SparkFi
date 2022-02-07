import React from 'react';
import {useMoralisDapp} from "providers/MoralisDappProvider/MoralisDappProvider"
import { Button, Card, Typography } from "antd";
import { useMoralisQuery, useWeb3ExecuteFunction } from "react-moralis";
import { useEffect, useState, createElement } from "react";
import {
    BrowserRouter as Router,
    Link
  } from "react-router-dom";

const { Text } = Typography;

const styles = {
    card: {
      boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
      border: "1px solid #e7eaf3",
      borderRadius: "0.5rem",
      marginBottom: "10px"
    },
  };

const VentureCard = ({post}) => {
    const { selectedVentureId, setSelectedVentureId } = useMoralisDapp();
    console.log("Selected")
    console.log(selectedVentureId);
    const { contractAddress, setContractAddress } = useMoralisDapp();
    console.log("Address");
    console.log(contractAddress);
    setContractAddress("hehe");
    console.log(contractAddress);
    const { contentId, ventureId, ventureManager, minimum } = post;
    const [ventureContent, setVentureContent] = useState({ venture: "default", description: "default" });
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

  return (
    <Card
        style={styles.card}
        title={
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <Text strong>📝 {ventureContent["venture"]}</Text>
            <Link onClick={setSelectedVentureId(ventureId)} to={`/explore/${contentId}`}>
                <Button
                    size="small"
                    type="primary"
                    style={{
                        width: "100%",
                        maxWidth: "150px",
                        borderRadius: "0.5rem",
                        fontSize: "16px",
                        fontWeight: "500",
                    }}
                >
                    View
                </Button>
            </Link>
        </div>
        }
    >
        <div style={{ display: "flex", flex: "3 1 auto", width: "100%"}}>
            <div style={{width: "65%", marginRight: "10px"}}>
                {ventureContent["description"]}
            </div>
            <div style={{width: "35%"}}>
                <h6>Minimum Contribution</h6>
                {minimum / 10**18} MATIC
            </div>
        </div>
    </Card>
  )
};

export default VentureCard;
